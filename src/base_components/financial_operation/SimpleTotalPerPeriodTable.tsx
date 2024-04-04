import { Table, TableProps, Tag } from "antd";
import { TotalPerPeriod } from "../../domain/TotalForPeriod";
import {getPrice} from "../../routes/forecast/container/FinancialForecastContainer";

interface Props {
  dataProcessor: (
    totalsPerPeriod: TotalPerPeriod[],
    year: number,
  ) => number;
  totalsPerPeriod: TotalPerPeriod[];
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
        render: () => getPrice(props.dataProcessor(props.totalsPerPeriod, i)),
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
