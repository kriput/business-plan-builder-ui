import { Table, TableProps, Tag } from "antd";
import {
  getPercents,
  getPrice,
} from "../forecast/container/FinancialForecastContainer";
import { Product } from "../../domain/Product";
import { ProductPerPeriod } from "../../domain/ProductPerPeriod";

interface Props {
  products: Product[];
  latestYear: number;
}

interface PeriodData {
  period: number
  totalSoldForPeriod: number,
  forExportInPercent: number,
  forExportInEuro: number,
  soldUnits: number,
  averagePrice: number,
}

export const getTotalSold = (productsForPeriod: ProductPerPeriod[]) => productsForPeriod.reduce((accumulator, currentValue) => accumulator + currentValue.price * currentValue.quantity, 0)

export const getTotalForExportInEuro = (productsForPeriod: ProductPerPeriod[]) => productsForPeriod.reduce((accumulator, currentValue) => accumulator + currentValue.price * currentValue.quantity * currentValue.forExport, 0)

export const getSoldUnits = (productsForPeriod: ProductPerPeriod[]) => productsForPeriod.reduce((accumulator, currentValue) => accumulator + currentValue.quantity, 0)

const ProductOverview = (props: Props) => {

  const columns = [
    {
      title: "Periood",
      dataIndex: "period",
      key: "period",
      render: value => <Tag color="blue">{value}</Tag>
    },
    {
      title: <b>MÜÜDUD KOKKU</b>,
      dataIndex: "totalSoldForPeriod",
      key: "totalSoldForPeriod",
      render: value => <Tag color="green"><b>{getPrice(value)}</b></Tag>
    },
    {
      title: "Müüdud ühikuid",
      dataIndex: "soldUnits",
      key: "soldUnits",
      render: value => <>{value} tk</>
    },
    {
      title: "Ühe ühiku keskmine müügihind",
      dataIndex: "averagePrice",
      key: "averagePrice",
      render: value => getPrice(value)
    },
    {
      title: "Müüdud ekspordiks €",
      dataIndex: "forExportInEuro",
      key: "forExportInEuro",
      render: value => getPrice(value)
    },
    {
      title: "Müüdud ekspordiks %",
      dataIndex: "forExportInPercent",
      key: "forExportInPercent",
      render: value => getPercents(value)
    },
  ] as TableProps["columns"];

  const getData = () : PeriodData[] => {
    const data = [] as PeriodData[];
    const productsPerPeriod = props.products.map(p => p.productsPerPeriod).flat();

    for (let i = new Date().getFullYear(); i <= props.latestYear; i++) {
      const productsOnlyForThisPeriod = productsPerPeriod.filter(p => p.year === i);

      const totalSoldForPeriod = getTotalSold(productsOnlyForThisPeriod);
      const forExportInEuro = getTotalForExportInEuro(productsOnlyForThisPeriod);
      const soldUnits = getSoldUnits(productsOnlyForThisPeriod);
      data.push({
        period: i,
        totalSoldForPeriod: totalSoldForPeriod,
        forExportInPercent: forExportInEuro === 0 ? 0 : forExportInEuro / totalSoldForPeriod,
        forExportInEuro: forExportInEuro,
        soldUnits: soldUnits,
        averagePrice: soldUnits === 0 ? 0 : totalSoldForPeriod / soldUnits
      })
    }

    return data;
  }

  return (
      <Table scroll={{ x: "max-content" }} dataSource={getData()} columns={columns} pagination={false} rowKey={"period"}/>
  );
};

export default ProductOverview;
