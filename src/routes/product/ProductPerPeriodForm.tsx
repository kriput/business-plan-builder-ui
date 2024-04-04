import ErrorResult from "../../base_components/ErrorResult";
import { Button, Form, Input, Row } from "antd";
import React, { useState } from "react";
import {useMutation, UseMutationResult, useQueryClient} from "@tanstack/react-query";
import { Product } from "../../domain/Product";
import { ProductService } from "../../services/ProductService";
import { ProductPerPeriod } from "../../domain/ProductPerPeriod";


interface Props {
  product: Product | undefined;
  setIsFormOpen: Function;
}

const getNextYearToInsert = (
  productsPerPeriod: ProductPerPeriod[] | undefined,
): number | undefined => {
  if (!productsPerPeriod || productsPerPeriod.length === 0) {
    return new Date().getFullYear();
  }
  const lastInsertedYear =
    productsPerPeriod
      .map((productPerPeriod) => productPerPeriod.year)
      .sort()
      .reverse()
      .at(0) ?? new Date().getFullYear();
  return lastInsertedYear + 1;
};

const ProductPerPeriodForm = (props: Props) => {
  const [form] = Form.useForm();
  const productService = new ProductService();
  const queryClient = useQueryClient();
  const [input, setInput] = useState({
    quantity: 0,
    forExport: 0,
    price: 0,
    costPerItem: 0,
    year: getNextYearToInsert(props.product?.productsPerPeriod),
  } as ProductPerPeriod);

  const handleChange = (target: EventTarget & HTMLInputElement) => {
    setInput({ ...input, [target.name]: target.value });
  };

  const handleRateInput = (target: EventTarget & HTMLInputElement) => {
    if (target.value) {
      const dividedNumber = parseFloat(target.value) / 100 || 0;
      setInput({ ...input, [target.name]: dividedNumber });
    }
  };

  const handleSubmit = () => {
    props.product?.productsPerPeriod.push(input);
    addProduct.mutate(props.product);
    props.setIsFormOpen(false);
  };

  const addProduct: UseMutationResult<
    Product | undefined,
    Error,
    Product | undefined
  > = useMutation({
    mutationFn: async (product: Product | undefined) => {
      if (!product) {
        throw Error("Toode pole leitud!");
      }
      return await productService.add(product, "/add");
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({queryKey: ["loadFinancialForecastById"]});
    },
  });

  return (
    <>
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
            {getNextYearToInsert(props.product?.productsPerPeriod)}:
          </h4>
          <Form name="add_product_per_period" form={form} layout="inline">
            <Form.Item label={<div>Müüdud <b>kogus</b></div>} name="quantity">
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
              <Input
                style={{ width: "8rem", marginBottom: "1rem" }}
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
