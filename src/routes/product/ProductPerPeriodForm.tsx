import ErrorResult from "../../base_components/ErrorResult";
import { Button, Form, InputNumber, message, Select, Space } from "antd";
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import AdditionalInfo from "../../base_components/AdditionalInfo";

interface Props {
  sellingInCreditRate: number;
  product: Product;
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

  const onSubmit = () => {
    const productPerPeriod = {
      year: form.getFieldValue("year") ?? new Date().getFullYear(),
      quantity: form.getFieldValue("quantity"),
      price: form.getFieldValue("price"),
      costPerItem: form.getFieldValue("costPerItem"),
      forExport: (form.getFieldValue("forExport") ?? 0) / 100,
    } as ProductPerPeriod;

    props.product?.productsPerPeriod.push(productPerPeriod);
    addProduct.mutate({ product: props.product, productPerPeriod });
  };

  const addProduct = useMutation({
    mutationFn: async ({
      product,
      productPerPeriod,
    }: {
      product: Product;
      productPerPeriod: ProductPerPeriod;
    }) => {
      await saveExpensesForProduct(productPerPeriod, product, "add");
      await saveIncomesForProduct(
        productPerPeriod,
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
    },
  });

  const getOptions = () => {
    const options = [];
    for (
      let i = new Date().getFullYear();
      i <= new Date().getFullYear() + 10;
      i++
    ) {
      if (!props.product.productsPerPeriod.find((p) => p.year === i)) {
        options.push({ value: i, label: i });
      }
    }
    return options;
  };

  return (
    <>
      {contextHolder}
      {addProduct.isError && (
        <ErrorResult
          errorMessage={`Salvestamine ebaõnnestus. ${addProduct.error.message}`}
          buttonMessage={"OK"}
          onClick={addProduct.reset}
        />
      )}
      {!addProduct.isError && (
        <>
          <Form
            name="add_product_per_period"
            form={form}
            onFinish={onSubmit}
            labelCol={{ span: 12 }}
          >
            <Form.Item<string> label={<h4>Lisa andmed aastaks</h4>} name="year">
              <Select
                style={{ width: "5rem" }}
                options={getOptions()}
                placeholder="Aasta"
              />
            </Form.Item>

            <Form.Item<number>
              label={
                <div>
                  Müüdud <b>kogus</b>
                </div>
              }
              rules={[
                {
                  required: true,
                  message: "Kohustsulik väli",
                },
                {
                  type: "number",
                  min: 0,
                  message: "Number ei tohi olla väiksem, kui 0",
                },
              ]}
              name="quantity"
            >
              <InputNumber
                className="number-input"
                name="quantity"
                placeholder="0"
                type="number"
              />
            </Form.Item>

            <Form.Item<number>
              label={
                <div>
                  Keskm.ühiku <b>müügihind</b> KM-ta €
                </div>
              }
              rules={[
                {
                  required: true,
                  message: "Kohustsulik väli",
                },
                {
                  type: "number",
                  min: 0,
                  message: "Number ei tohi olla väiksem, kui 0",
                },
              ]}
              name="price"
            >
              <InputNumber
                className="number-input"
                name="price"
                placeholder="0 €"
                type="number"
              />
            </Form.Item>

            <Form.Item<number>
              label={
                <div>
                  Materjali / kauba <b>kulu</b> ühikule €
                </div>
              }
              rules={[
                {
                  required: true,
                  message: "Kohustsulik väli",
                },
                {
                  type: "number",
                  min: 0,
                  message: "Number ei tohi olla väiksem, kui 0",
                },
              ]}
              name="costPerItem"
            >
              <InputNumber
                className="number-input"
                name="costPerItem"
                placeholder="0 €"
                type="number"
              />
            </Form.Item>

            <Form.Item<number>
              label={
                <>
                  Tooteid ekspordiks %{" "}
                  <AdditionalInfo
                    info={
                      <>
                        <div>
                          Mitu % toodetest läheb ekspordiks ehk on müüdud
                          teistes riikides.
                        </div>
                        <br />
                        <b>Selliste toodete puhul on käibemaksumäär 0%.</b>
                      </>
                    }
                  />
                </>
              }
              name="forExport"
              rules={[
                {
                  type: "number",
                  min: 0,
                  max: 100,
                  message: "Number saab olla vahemikus 0 kuni 100",
                },
              ]}
            >
              <InputNumber
                className="number-input"
                name="forExport"
                placeholder="0%"
                type="number"
              />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button
                  loading={addProduct.isPending}
                  htmlType="submit"
                  type="primary"
                >
                  Lisa
                </Button>
                <Button
                  onClick={() => props.setIsFormOpen(false)}
                  danger
                  type="dashed"
                >
                  Tühista
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </>
      )}
    </>
  );
};
export default ProductPerPeriodForm;
