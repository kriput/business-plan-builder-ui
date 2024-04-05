import { Table, TableProps, Tag } from "antd";
import {
  getPrice,
  roundNumberToTwoDecimalPlaces,
} from "../../routes/forecast/container/FinancialForecastContainer";
import { FinancialOperation } from "../../domain/FinancialOperation";

interface Props {
  dataProcessor: (incomes: FinancialOperation[], year: number) => number;
  financialOperations: FinancialOperation[];
  latestYear: number;
  addFirstBlank: boolean;
}

const SimpleTotalPerPeriodTable = (props: Props) => {
  const getColumns = () => {
    const columns = props.addFirstBlank
      ? ([{ width: "10rem" }] as TableProps["columns"])
      : ([] as TableProps["columns"]);

    for (let i = new Date().getFullYear(); i <= props.latestYear; i++) {
      columns?.push({
        title: <Tag color="blue">{i}</Tag>,
        key: i,
        render: () => getPrice(roundNumberToTwoDecimalPlaces(props.dataProcessor(props.financialOperations, i))),
      });
    }
    return columns;
  };

  return (
    <Table
      columns={getColumns()}
      size="small"
      dataSource={[""]}
      rowKey={Math.random}
      pagination={false}
    />
  );
};

export default SimpleTotalPerPeriodTable;
