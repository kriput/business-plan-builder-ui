import React from "react";
import { Button, Form, Input, InputNumber, Modal } from "antd";
import { Product } from "../../domain/Product";
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { ProductService } from "../../services/ProductService";
import ErrorResult from "../../base_components/ErrorResult";
import AdditionalInfo from "../../base_components/AdditionalInfo";

interface Props {
  id: number | undefined;
}

const ProductForm = (props: Props) => {
  const productService = new ProductService();
  const [form] = Form.useForm();
  const [modal, contextHolder] = Modal.useModal();
  const queryClient = useQueryClient();

  const onSubmit = () => {
    const product = {
      name: form.getFieldValue("name"),
      financialForecastId: props.id,
      tax: form.getFieldValue("tax") / 100,
      stockReserveRate: form.getFieldValue("stockReserveRate") / 100,
    } as Product;

    addProduct.mutate(product);
  };

  const addProduct: UseMutationResult<Product | undefined, Error, Product> =
    useMutation({
      mutationFn: async (product: Product) => {
        return await productService.add(product, "/add");
      },
      onSuccess: () => {
        modal.success({
          title: "Toode edukalt lisatud!",
          onOk: () =>
            queryClient.refetchQueries({
              queryKey: ["loadFinancialForecastById"],
            }),
        });
      },
    });

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
        <span>
          <h4>Lisa uus toode:</h4>
          <Form
            onFinish={onSubmit}
            name="create_product"
            form={form}
            layout="inline"
          >
            <Form.Item<string>
              label="Nimi"
              name="name"
              rules={[{ required: true, message: "Palun sisestage nimi" }]}
            >
              <Input name="name" placeholder="Minu toode" />
            </Form.Item>

            <Form.Item<number>
              label="Käibemaksu määr %"
              name="tax"
              rules={[
                {
                  message: "Number peab olema vahemikus 0 - 100",
                  required: true,
                  type: "number",
                  min: 0,
                  max: 100,
                },
              ]}
            >
              <InputNumber
                style={{ width: "5rem" }}
                name="tax"
                placeholder="0%"
                type="number"
              />
            </Form.Item>
            <Form.Item<number>
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
              <span>
                <AdditionalInfo
                  info={
                    "Toote valmistamiseks vajava kauba/materjali ülejääk järgmiseks perioodiks (see summa arvutatakse välja järgmise perioodi materjali kuludest)"
                  }
                />
                <Input
                  type="number"
                  style={{ width: "5rem", }}
                  name="stockReserveRate"
                  placeholder="0%"
                />
              </span>
            </Form.Item>
            <Form.Item>
              <Button
                loading={addProduct.isPending}
                htmlType="submit"
                type="primary"
              >
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
