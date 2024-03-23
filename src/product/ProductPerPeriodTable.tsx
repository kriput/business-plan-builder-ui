import {Button, Row, Table, TableProps, Tag} from "antd";
import {ProductPerPeriod} from "../domain/ProductPerPeriod";
import {getPercents, getPrice} from "../forecast/container/FinancialForecastContainer";

interface Props {
  productsPerPeriod: ProductPerPeriod[] | undefined
}

interface ProductPerPeriodTableDto {
  key: number
  quantity: number,
  forExport: number,
  price: number,
  costPerItem: number,
  year: number,
  yearTurnOver: number
}

const columns: TableProps["columns"] = [
  {
    title: "Aasta",
    dataIndex: "year",
    key: "year",
    render: value => value ? <Tag color='blue'>{value}</Tag> :
        <Tag color='red'>Palun lisage järgmise aasta andmed</Tag>
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
    render: value => getPercents(value)
  },
  {
    title: 'Keskm.ühiku müügihind KM-ta',
    dataIndex: 'price',
    key: 'price',
    render: value => getPrice(value)
  },
  {
    title: 'Materjali/kauba kulu ühikule',
    dataIndex: 'costPerItem',
    key: 'costPerItem',
    render: value => getPrice(value)
  },
  {
    title: <Tag color='green'>AASTA KÄIVE KOKKU</Tag>,
    dataIndex: 'yearTurnOver',
    key: 'yearTurnOver',
    render: value => <b><Tag color='green'>{getPrice(value)}</Tag></b>
  }
];

const ProductPerPeriodTable = (props: Props) => {
  const countYearTurnOver = (soldQuantity: number, costPerItem: number) => soldQuantity * costPerItem;

  const dataSource = props.productsPerPeriod?.map(productPerPeriod => {
    const productPerPeriodDto = productPerPeriod as ProductPerPeriodTableDto;
    productPerPeriodDto.key = productPerPeriod.year;
    productPerPeriodDto.yearTurnOver = countYearTurnOver(productPerPeriod.costPerItem, productPerPeriod.quantity)
    return productPerPeriodDto
  })

  return (
      <>
        <Table
            pagination={false}
            size="small"
            columns={columns}
            dataSource={dataSource}
        />
        <br/>
        <Row>
          <Button type='dashed'>Lisa järgmise aasta andmed</Button>
        </Row>
      </>
  );
};

export default ProductPerPeriodTable;
