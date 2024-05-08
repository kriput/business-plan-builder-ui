import { FinancialForecast } from "../../domain/FinancialForecast";
import {
  Badge,
  Button,
  Col,
  Collapse,
  CollapseProps,
  Divider,
  Empty,
  message,
  Row,
} from "antd";
import {
  getPercents,
  updateAllData,
} from "../forecast/container/FinancialForecastContainer";
import { useEffect, useState } from "react";
import ProductForm from "./ProductForm";
import ProductPerPeriodTable from "./ProductPerPeriodTable";
import ProductOverview from "./ProductOverview";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductPerPeriod } from "../../domain/ProductPerPeriod";
import {
  saveExpensesForProduct,
  saveIncomesForProduct,
} from "./ProductPerPeriodForm";
import { Product } from "../../domain/Product";
import { ProductService } from "../../services/ProductService";
import ConfirmDelete from "../../base_components/ConfirmDelete";

interface Props {
  financialForecast: FinancialForecast | undefined;
  latestYear: number;
}

export interface InputData {
  product: Product;
  productPerPeriod: ProductPerPeriod;
  sellingInCreditRate: number
}

const ProductContainer = (props: Props) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const productService = new ProductService();
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();

  const deleteProduct = useMutation({
    mutationFn: async (product: Product) => {
      if (product.productsPerPeriod.length > 0) {
        messageApi.error("Viga! Alguses tuleb kustutada toote andmed!")
        return ;
      }
      return await productService.delete(product.id?.toString() ?? "0");
    },
    onSuccess: async () => updateAllData(queryClient),
    onError: (e) => messageApi.error("Viga kustutamisel !" + e),
  })

  const deleteProductPerPeriod = useMutation({
    mutationFn: async (inputData: InputData) => {
      await saveExpensesForProduct(inputData.productPerPeriod, inputData.product!, "delete");
      await saveIncomesForProduct(
          inputData.productPerPeriod,
          inputData.product!,
          inputData.sellingInCreditRate,
          "delete",
      );
      const index =
          inputData.product?.productsPerPeriod.indexOf(inputData.productPerPeriod) ?? -1;
      if (index > -1) {
        inputData.product?.productsPerPeriod.splice(index, 1);
      }
      return await productService.add(inputData.product!, "/add");
    },
    onSuccess: async () => updateAllData(queryClient),
    onError: (e) => messageApi.error("Viga kustutamisel !" + e),
  });

  const items: CollapseProps["items"] = props.financialForecast?.products
    ?.reverse()
    .map((product) => {
      return {
        key: product.id,
        label: (
          <>
            <Row justify="space-between">
              <Col>
                <b>{product.name}</b>
              </Col>
              <Col>
                <Badge
                  color="green"
                  count={"Käibemaks: " + getPercents(product.tax)}
                />
              </Col>
              <Col>
                <ConfirmDelete onConfirm={() => deleteProduct.mutate(product)}/>
              </Col>
            </Row>
          </>
        ),
        children: (
          <ProductPerPeriodTable
            deleteProductPerPeriod={deleteProductPerPeriod.mutate}
            sellingInCreditRate={
              props.financialForecast?.sellingInCreditRate ?? 0
            }
            product={product}
          />
        ),
      };
    }) as CollapseProps["items"];

  useEffect(() => setIsFormOpen(false), [props.financialForecast]);

  return (
    <>
      {contextHolder}
      <Row justify="center">
        <h2>Toodete ülevaade</h2>
      </Row>
      <Row justify="center">
        <ProductOverview latestYear={props.latestYear} products={props.financialForecast?.products ?? []} />
      </Row>
      <Divider />

      <br />
      <br />
      <Row justify="center">
        <Col>
          <h2>
            <b> Tooted </b>
          </h2>
        </Col>
      </Row>
      {!isFormOpen && (
        <Row justify="center">
          <Button onClick={() => setIsFormOpen(true)}>+ Lisa toode</Button>
        </Row>
      )}
      {isFormOpen && (
        <>
          <Row justify="center">
            <Button danger onClick={() => setIsFormOpen(false)}>
              Tagasi
            </Button>
          </Row>
          <br />
          <Row justify="center">
            <ProductForm id={props.financialForecast?.id} />
          </Row>
        </>
      )}

      {props.financialForecast?.products?.length === 0 && (
        <>
          <br />
          <Row justify="center">
            <div>
              <Empty />
            </div>
          </Row>
        </>
      )}

      {props.financialForecast?.products?.length !== 0 && (
        <Row justify="center" style={{ marginTop: "2rem" }}>
          <Col xs={24} xl={20}>
            <Collapse items={items} />
          </Col>
        </Row>
      )}
    </>
  );
};
export default ProductContainer;
