import { Table, TableColumnsType, Tag } from "antd";
import { getPrice } from "../../routes/forecast/container/FinancialForecastContainer";
import { FinancialOperation } from "@/domain/FinancialOperation";

interface Props {
  dataProcessor: (incomes: FinancialOperation[], year: number) => number;
  financialOperations: FinancialOperation[];
  latestYear: number;
  addFirstBlank: boolean;
}

const SimpleTotalPerPeriodTable = (props: Props) => {
  const getColumns = (): TableColumnsType<string> => {
    const columns: TableColumnsType<string> = props.addFirstBlank
      ? [{ width: "15rem" }]
      : [];

    for (let i = new Date().getFullYear(); i <= props.latestYear; i++) {
      columns?.push({
        title: <Tag color="blue">{i}</Tag>,
        key: i,
        render: () =>
          getPrice(props.dataProcessor(props.financialOperations, i)),
      });
    }
    return columns;
  };

  return (
    <Table<string>
      scroll={{ x: "max-content" }}
      columns={getColumns()}
      size="small"
      dataSource={[""]}
      rowKey={Math.random}
      pagination={false}
    />
  );
};

export default SimpleTotalPerPeriodTable;
