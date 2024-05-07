import ErrorResult from "../../base_components/ErrorResult";
import {Button, Form, Input, message, Modal, Row, Select} from "antd";
import React, { useState } from "react";
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { Product } from "../../domain/Product";
import { ProductService } from "../../services/ProductService";
import { ProductPerPeriod } from "../../domain/ProductPerPeriod";
import { FinancialOperationService } from "../../services/FinancialOperationService";
import { FinancialOperation } from "../../domain/FinancialOperation";
import { FinancialOperationType } from "../../enums/FinancialOperationType";
import {
  FinancialOperationSubtype,
  financialOperationSubtypeMapping,
} from "../../enums/FinancialOperationSubtype";
import {QuestionCircleOutlined} from "@ant-design/icons";

interface Props {
  sellingInCreditRate: number;
  product: Product | undefined;
  setIsFormOpen: Function;
}

export const saveExpensesForProduct = async (
  input: ProductPerPeriod,
  product: Product,
  operation: "add" | "delete",
) => {
  const expense = {
    type: FinancialOperationType.EXPENSE,
    subtype: financialOperationSubtypeMapping.get(
      FinancialOperationSubtype.RAW_MATERIALS,
    ),
    totalsPerPeriod: [
      {
        year: input.year,
        sum:
          input.quantity * input.costPerItem +
          input.quantity * input.costPerItem * product.stockReserveRate,
      },
      {
        year: input.year + 1,
        sum: 0 - input.quantity * input.costPerItem * product.stockReserveRate,
      },
    ],
  } as FinancialOperation;
  if (operation === "add") {
    return await new FinancialOperationService().add(
      expense,
      `/${product?.financialForecastId}/add`,
    );
  } else if (operation === "delete") {
    return await new FinancialOperationService().deleteOperation(
      expense,
      `/${product?.financialForecastId}/delete`,
    );
  }
};

export const saveIncomesForProduct = async (
  input: ProductPerPeriod,
  product: Product,
  inCreditRate: number,
  operation: "add" | "delete",
) => {
  const financialOperationService = new FinancialOperationService();
  const totalSumForThisPeriod =
    input.quantity * input.price - input.quantity * input.price * inCreditRate;
  const income = {
    type: FinancialOperationType.INCOME,
    subtype: financialOperationSubtypeMapping.get(
      FinancialOperationSubtype.SALES_INCOME,
    ),
    totalsPerPeriod: [
      {
        year: input.year,
        sum: totalSumForThisPeriod,
      },
      {
        year: input.year + 1,
        sum: input.quantity * input.price * inCreditRate,
      },
    ],
  } as FinancialOperation;
  if (operation === "add") {
    await financialOperationService.add(
      income,
      `/${product?.financialForecastId}/add`,
    );
  } else if (operation === "delete") {
    await financialOperationService.deleteOperation(
      income,
      `/${product?.financialForecastId}/delete`,
    );
  }

  const incomeWithTax = {
    type: FinancialOperationType.INCOME,
    subtype: financialOperationSubtypeMapping.get(
      FinancialOperationSubtype.SALES_INCOME_WITH_TAX,
    ),
    tax: product.tax,
    totalsPerPeriod: [
      {
        year: input.year,
        sum: totalSumForThisPeriod - input.forExport * totalSumForThisPeriod,
      },
      {
        year: input.year + 1,
        sum: input.quantity * input.price * inCreditRate,
      },
    ],
  } as FinancialOperation;

  if (operation === "add") {
    await financialOperationService.add(
      incomeWithTax,
      `/${product?.financialForecastId}/add`,
    );
  } else if (operation === "delete") {
    await financialOperationService.deleteOperation(
      incomeWithTax,
      `/${product?.financialForecastId}/delete`,
    );
  }

  if (input.forExport > 0) {
    const incomeWithoutTax = {
      type: FinancialOperationType.INCOME,
      subtype: financialOperationSubtypeMapping.get(
        FinancialOperationSubtype.SALES_INCOME_WITHOUT_TAX,
      ),
      totalsPerPeriod: [
        {
          year: input.year,
          sum: input.forExport * totalSumForThisPeriod,
        },
      ],
    } as FinancialOperation;
    if (operation === "add") {
      await financialOperationService.add(
        incomeWithoutTax,
        `/${product?.financialForecastId}/add`,
      );
    } else if (operation === "delete") {
      await financialOperationService.deleteOperation(
        incomeWithoutTax,
        `/${product?.financialForecastId}/delete`,
      );
    }
  }
};


const ProductPerPeriodForm = (props: Props) => {
  const [form] = Form.useForm();
  const [, contextHolder] = message.useMessage();
  const productService = new ProductService();
  const queryClient = useQueryClient();
  const [modal, context] = Modal.useModal();
  const [input, setInput] = useState({
    quantity: 0,
    forExport: 0,
    price: 0,
    costPerItem: 0,
    year: new Date().getFullYear(),
  } as ProductPerPeriod);

  const handleChange = (target: EventTarget & HTMLInputElement) => {
    setInput({ ...input, [target.name]: target.value });
  };

  const handleYearChange = (year: number) => {
    console.log(input)
    setInput({ ...input, year: year });
  }

  const handleRateInput = (target: EventTarget & HTMLInputElement) => {
    if (target.value) {
      const dividedNumber = parseFloat(target.value) / 100 || 0;
      setInput({ ...input, [target.name]: dividedNumber });
    }
  };

  const handleSubmit = () => {
    props.product?.productsPerPeriod.push(input);
    addProduct.mutate(props.product);
  };

  const reload = () => window.location.reload();

  const addProduct: UseMutationResult<
    Product | undefined,
    Error,
    Product | undefined
  > = useMutation({
    mutationFn: async (product: Product | undefined) => {
      if (!product) {
        throw Error("Toode pole leitud!");
      }

      await saveExpensesForProduct(input, product, "add");
      await saveIncomesForProduct(
        input,
        product,
        props.sellingInCreditRate,
        "add",
      );
      return await productService.add(product, `/add`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["loadFinancialForecastById"],
      });
      props.setIsFormOpen(false);
    },
    onError: async () => {
      await message.error("Viga andmete lisamisel");
      setTimeout(reload, 2000);
    },
  });

  const getOptions = () => {
    const options = []
    for (let i = new Date().getFullYear(); i <= new Date().getFullYear() + 10; i++) {
      options.push({value: i, label: i});
    }
    return options;
  }

  return (
    <>
      {contextHolder}
      {context}
      {addProduct.isError && (
        <ErrorResult
          errorMessage={`Salvestamine ebaõnnestus. ${addProduct.error.message}`}
          buttonMessage={"OK"}
          onClick={addProduct.reset}
        />
      )}
      {!addProduct.isError && (
        <span>
          <h4>
            Lisa andmed aastaks{" "}
            <Select style={{width: "5rem"}} onChange={handleYearChange} options={getOptions()}/>
          </h4>
          <Form name="add_product_per_period" form={form} layout="inline">
            <Form.Item
              label={
                <div>
                  Müüdud <b>kogus</b>
                </div>
              }
              name="quantity"
            >
              <Input
                style={{ width: "8rem", marginBottom: "1rem" }}
                onChange={(e) => handleChange(e.target)}
                name="quantity"
                placeholder="0"
                type="number"
              />
            </Form.Item>

            <Form.Item
              label={
                <div>
                  Keskm.ühiku <b>müügihind</b> KM-ta €
                </div>
              }
              name="price"
            >
              <Input
                style={{ width: "8rem", marginBottom: "1rem" }}
                onChange={(e) => handleChange(e.target)}
                name="price"
                placeholder="0"
                type="number"
              />
            </Form.Item>

            <Form.Item
              label={
                <div>
                  Materjali / kauba <b>kulu</b> ühikule €
                </div>
              }
              name="costPerItem"
            >
              <Input
                style={{ width: "8rem", marginBottom: "1rem" }}
                onChange={(e) => handleChange(e.target)}
                name="costPerItem"
                placeholder="0"
                type="number"
              />
            </Form.Item>

            <Form.Item
              label="Tooteid ekspordiks %"
              name="forExport"
              rules={[
                {
                  message: "Number saab olla vahemikus 0 kuni 100",
                  min: 0,
                  max: 100,
                },
              ]}
            >
              <QuestionCircleOutlined style={{color: "blue"}} onClick={() => modal.info({
                title: 'Lisainfo',
                content: <><div>Mitu % toodetest läheb ekspordiks ehk on müüdud teistes riikides.</div>
                  <br/>
                  <b>Selliste toodete puhul on käibemaksumäär 0%.</b>
                </>
              })}/>
              <Input
                style={{ width: "8rem", marginBottom: "1rem", marginLeft: "0.5rem" }}
                onChange={(e) => handleRateInput(e.target)}
                name="forExport"
                placeholder="0"
                type="number"
              />
            </Form.Item>
          </Form>
          <br />
          <Row>
            <Button onClick={handleSubmit} type="primary">
              Lisa
            </Button>
            <Button
              style={{ marginLeft: "1rem" }}
              onClick={() => props.setIsFormOpen(false)}
              danger
              type="dashed"
            >
              Tühista
            </Button>
          </Row>
        </span>
      )}
    </>
  );
};
export default ProductPerPeriodForm;
