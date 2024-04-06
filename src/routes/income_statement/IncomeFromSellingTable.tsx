import React from "react";
import { Product } from "../../domain/Product";
import {Table, TableProps, Tag} from "antd";
import {
  getPercents,
  getPrice,
  roundNumberToTwoDecimalPlaces
} from "../forecast/container/FinancialForecastContainer";
import {getSoldUnits, getTotalForExportInEuro, getTotalSold} from "../product/ProductOverview";
import {INCOME_FROM_SELLING_LIST} from "./IncomeFromSellingListBuilder";
import {TotalPerPeriod} from "../../domain/TotalForPeriod";

interface Props {
  products: Product[];
  latestYear: number;
  otherIncomesTotalsPerPeriod: TotalPerPeriod[]
}

const IncomeFromSellingTable = (props: Props) => {
  const columns = [] as TableProps["columns"];

  const getColumns = () => {
    columns?.push({
      title: "",
      width: "15rem",
      dataIndex: "title"
    })
    for (let i = new Date().getFullYear(); i <= props.latestYear; i++) {
      columns?.push({
        key: i,
        title: <Tag color="blue">{i}</Tag>,
        dataIndex: "valuesForRow",
        render: (value: {year: number, value: number | string}[]) => value.find(v => v.year === i)?.value ?? ""
      })
    }
    return columns;
  }
  
  const getValues = () => {
    const data = INCOME_FROM_SELLING_LIST;
    const productsPerPeriod = props.products.map(p => p.productsPerPeriod).flat();
    for (let i = new Date().getFullYear(); i <= props.latestYear; i++) {
      const productsOnlyForThisPeriod = productsPerPeriod.filter(p => p.year === i);
      const otherIncomesForThisPeriod = props.otherIncomesTotalsPerPeriod.find(iPP => iPP.year === i)?.sum ?? 0;

      const totalSoldForPeriod = getTotalSold(productsOnlyForThisPeriod);
      const forExportInEuro = getTotalForExportInEuro(productsOnlyForThisPeriod);
      const soldUnits = getSoldUnits(productsOnlyForThisPeriod);

      data[0].valuesForRow.push({year: i, value: <b>{getPrice(totalSoldForPeriod)}</b>})
      data[1].valuesForRow.push({year: i, value: `${soldUnits} tk`})
      data[2].valuesForRow.push({year: i, value: getPrice(soldUnits === 0 ? 0 : roundNumberToTwoDecimalPlaces(totalSoldForPeriod / soldUnits))})
      data[3].valuesForRow.push({year: i, value: getPrice(forExportInEuro)})
      data[4].valuesForRow.push({year: i, value: getPercents(forExportInEuro === 0 ? 0 : roundNumberToTwoDecimalPlaces(forExportInEuro / totalSoldForPeriod))})
      data[5].valuesForRow.push({year: i, value: getPrice(otherIncomesForThisPeriod)})
      data[6].valuesForRow.push({year: i, value: <Tag color="green"> <b>{getPrice(totalSoldForPeriod + otherIncomesForThisPeriod)}</b></Tag>});
    }
    return data;
  }

  return (
      <>
        <Table size="small" pagination={false} dataSource={getValues()} columns={getColumns()}/>
      </>
  );
};

export default IncomeFromSellingTable;