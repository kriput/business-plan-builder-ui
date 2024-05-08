import { Badge, Button, Row, Table, TableProps, Tag } from "antd";
import {
  getPercents,
  getPrice,
} from "../forecast/container/FinancialForecastContainer";
import { useEffect, useState } from "react";
import ProductPerPeriodForm from "./ProductPerPeriodForm";
import { Product } from "../../domain/Product";
import { ProductPerPeriod } from "../../domain/ProductPerPeriod";
import { InputData } from "./ProductContainer";
import { UseMutateFunction } from "@tanstack/react-query";
import ConfirmDelete from "../../base_components/ConfirmDelete";

interface Props {
  product: Product | undefined;
  sellingInCreditRate: number;
  deleteProductPerPeriod: UseMutateFunction<
    Product | undefined,
    Error,
    InputData,
    unknown
  >;
}

interface ProductPerPeriodTableDto {
  key: number;
  quantity: number;
  forExport: number;
  price: number;
  costPerItem: number;
  year: number;
  yearTurnOver: number;
}

const ProductPerPeriodTable = (props: Props) => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(
    () =>
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      }),
    [isFormOpen],
  );

  const dataSource = props.product?.productsPerPeriod
    ?.sort((a, b) => a.year - b.year)
    .map((productPerPeriod) => {
      const productPerPeriodDto = productPerPeriod as ProductPerPeriodTableDto;
      productPerPeriodDto.key = productPerPeriod.year;
      productPerPeriodDto.yearTurnOver =
        productPerPeriod.price * productPerPeriod.quantity;
      return productPerPeriodDto;
    });

  const columns: TableProps["columns"] = [
    {
      title: "Aasta",
      dataIndex: "year",
      key: "year",
      render: (value) =>
        value ? (
          <Tag color="blue">{value}</Tag>
        ) : (
          <Tag color="red">Palun lisage järgmise aasta andmed</Tag>
        ),
    },
    {
      title: <b>AASTA KÄIVE KOKKU</b>,
      dataIndex: "yearTurnOver",
      key: "yearTurnOver",
      render: (value) => (
        <b>
          <Tag color="green">{getPrice(value)}</Tag>
        </b>
      ),
    },
    {
      title: "Keskm.ühiku müügihind KM-ta",
      dataIndex: "price",
      key: "price",
      render: (value) => getPrice(value),
    },
    {
      title: "Materjali / kauba kulu ühikule",
      dataIndex: "costPerItem",
      key: "costPerItem",
      render: (value) => getPrice(value),
    },
    {
      title: "Kogus kokku",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Tooteid ekspordiks %",
      dataIndex: "forExport",
      key: "forExport",
      render: (value) => getPercents(value),
    },
    {
      title: "",
      fixed: "right",
      width: "1rem",
      render: (value: ProductPerPeriod) => (
        <ConfirmDelete
          onConfirm={() =>
            props.deleteProductPerPeriod({
              productPerPeriod: value,
              product: props.product!,
              sellingInCreditRate: props.sellingInCreditRate,
            })
          }
        />
      ),
    },
  ];

  return (
    <>
      <Row justify="center">
      <Badge
        color="cyan"
        count={
          "Materjali/kauba keskmine laovaru vajadus: " +
          getPercents(props.product?.stockReserveRate ?? 0)
        }
      />
      </Row>
      <br />
      <Table
        scroll={{ x: "max-content" }}
        pagination={false}
        size="small"
        columns={columns}
        dataSource={dataSource}
      />
      <br />
      {isFormOpen && (
        <ProductPerPeriodForm
          sellingInCreditRate={props.sellingInCreditRate}
          setIsFormOpen={setIsFormOpen}
          product={props.product!}
        />
      )}
      {!isFormOpen && (
        <Row>
          <Button
            type="dashed"
            onClick={() => {
              setIsFormOpen(true);
            }}
          >
            Lisa järgmise aasta andmed
          </Button>
        </Row>
      )}
    </>
  );
};

export default ProductPerPeriodTable;
