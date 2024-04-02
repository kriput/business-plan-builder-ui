import { Button, Row, Table, TableProps, Tag } from "antd";
import {
  getPercents,
  getPrice,
} from "../forecast/container/FinancialForecastContainer";
import {useEffect, useState} from "react";
import ProductPerPeriodForm from "./ProductPerPeriodForm";
import { Product } from "../../domain/Product";

interface Props {
  product: Product | undefined;
  fetchForecast: Function;
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
];

const ProductPerPeriodTable = (props: Props) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  useEffect(() => window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'}), [isFormOpen])
  const countYearTurnOver = (soldQuantity: number, costPerItem: number) =>
    soldQuantity * costPerItem;

  const dataSource = props.product?.productsPerPeriod?.map(
    (productPerPeriod) => {
      const productPerPeriodDto = productPerPeriod as ProductPerPeriodTableDto;
      productPerPeriodDto.key = productPerPeriod.year;
      productPerPeriodDto.yearTurnOver = countYearTurnOver(
        productPerPeriod.costPerItem,
        productPerPeriod.quantity,
      );
      return productPerPeriodDto;
    },
  );

  return (
    <>
      <Table
        pagination={false}
        size="small"
        columns={columns}
        dataSource={dataSource}
      />
      <br />
      {isFormOpen && (
        <ProductPerPeriodForm
          setIsFormOpen={setIsFormOpen}
          product={props.product}
          fetchForecast={props.fetchForecast}
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
