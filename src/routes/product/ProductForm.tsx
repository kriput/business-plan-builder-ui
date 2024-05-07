import React, { useState } from "react";
import { Button, Form, Input, Modal } from "antd";
import { Product } from "../../domain/Product";
import {useMutation, UseMutationResult, useQueryClient} from "@tanstack/react-query";
import { ProductService } from "../../services/ProductService";
import ErrorResult from "../../base_components/ErrorResult";
import {QuestionCircleOutlined} from "@ant-design/icons"

interface Props {
  id: number | undefined;
}

const ProductForm = (props: Props) => {
  const productService = new ProductService();
  const [form] = Form.useForm();
  const [modal, contextHolder] = Modal.useModal();
  const queryClient = useQueryClient();
  const [input, setInput] = useState({
    name: "",
    financialForecastId: props.id,
    tax: 0,
    stockReserveRate: 0,
  } as Product);

  const handleChange = (target: EventTarget & HTMLInputElement) => {
    setInput({ ...input, [target.name]: target.value });
  };

  const handleRateInput = (target: EventTarget & HTMLInputElement) => {
    if (target.value) {
      const dividedNumber = parseFloat(target.value) / 100 || 0;
      setInput({ ...input, [target.name]: dividedNumber });
    }
  };

  const addProduct: UseMutationResult<
      Product | undefined,
      Error,
      Product
  > = useMutation({
    mutationFn: async (product: Product) => {
      return await productService.add(product, "/add");
    },
    onSuccess: () => {
      modal.success({
        title: "Toode edukalt lisatud!",
        onOk: () => queryClient.refetchQueries({queryKey: ["loadFinancialForecastById"]})
      })
    }
  });

  return (
    <>
      {addProduct.isError && (
          <ErrorResult
              errorMessage={`Salvestamine ebaõnnestus. ${addProduct.error.message}`}
              buttonMessage={'OK'}
              onClick={addProduct.reset}
              />
      )}
      {!addProduct.isError && (
          <span>
        {contextHolder}
        <h4>Lisa uus toode:</h4>
        <Form name="create_product" form={form} layout="inline">
          <Form.Item
            label="Nimi"
            name="name"
            rules={[{ required: true, message: "Palun sisestage nimi" }]}
          >
            <Input
              onChange={(e) => handleChange(e.target)}
              value={input.name}
              name="name"
            />
          </Form.Item>
          <Form.Item
            label="Käibemaksu määr %"
            name="tax"
            rules={[
              {
                message: "Number saab olla vahemikus 0 kuni 100",
                min: 0,
                max: 100,
              },
            ]}
          >
            <Input
              style={{ width: "5rem" }}
              onChange={(e) => handleRateInput(e.target)}
              name="tax"
              placeholder="0"
              type="number"
            />
          </Form.Item>
          <Form.Item
            label="Materjali / kauba laovaru vajadus % "
            name="stockReserveRate"
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
              content: 'Toote valmistamiseks vajava kauba/materjali ülejääk järgmiseks perioodiks (see summa arvutatakse välja järgmise perioodi materjali kuludest)'
            })}/>
            <Input
              style={{ width: "5rem", marginLeft: "0.5rem" }}
              onChange={(e) => handleRateInput(e.target)}
              name="stockReserveRate"
              placeholder="0"
              type="number"
            />
          </Form.Item>
          <Form.Item>
            <Button onClick={() => addProduct.mutate(input)} type='primary'>
              Lisa
            </Button>
          </Form.Item>
        </Form>
      </span>
          )}
    </>
  );
};

export default ProductForm;
