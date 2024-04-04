import { InputNumber, message, Popconfirm, Table, TableProps, Tag } from "antd";
import { FinancialOperation } from "../../domain/FinancialOperation";
import { useState } from "react";
import { FinancialOperationSubtype } from "../../enums/FinancialOperationSubtype";
import { TotalPerPeriod } from "../../domain/TotalForPeriod";
import { parseToFinancialOperationSubtype } from "./FinancialOperationOverview";
import { FinancialOperationService } from "../../services/FinancialOperationService";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import { getPrice } from "../../routes/forecast/container/FinancialForecastContainer";

interface Props {
  forecastId: number;
  financialOperations: FinancialOperation[];
  latestYear: number;
}

const FinancialOperationCategoryTable = (props: Props) => {
  const [valueInput, setValueInput] = useState(0);
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();

  const financialOperationService = new FinancialOperationService();

  const addFinancialOperation = useMutation({
    mutationFn: async (financialOperation: FinancialOperation) =>
      financialOperationService.add(financialOperation, `/${props.forecastId}/add`),
    onSuccess: async () => {
      await queryClient.refetchQueries({queryKey: ["getExpensesForForecast"]});
    },
    onError: error => messageApi.error('Andmete muutmine ebaõnnestus! ' + error.message)
  });

  const addNewTotalPerPeriod = (financialOperation: FinancialOperation, year: number) => {
    const createdTotalPerPeriod: TotalPerPeriod = { sum: 0, year: year };
    financialOperation.totalsPerPeriod.push(createdTotalPerPeriod);
    return createdTotalPerPeriod;
  };

  const onSubmit = (year: number, subtype: FinancialOperationSubtype, sum: number) => {
    const financialOperations = props.financialOperations;
    const operationToUpdate = financialOperations.find(
      (exp) => exp.subtype === subtype,
    );

    const totalPerPeriodToUpdate =
      operationToUpdate?.totalsPerPeriod.find(
        (tPP) => tPP.year === year,
      ) ?? addNewTotalPerPeriod(operationToUpdate!, year);

    totalPerPeriodToUpdate.sum = sum;
    addFinancialOperation.mutate(operationToUpdate!);
  };

  const getColumns = (): TableProps["columns"] => {
    const tableProps = [] as TableProps["columns"];
    tableProps?.push({
      width: "10rem",
      key: "subtype",
      title: "Alamkategooria",
      render: (value: FinancialOperation) => parseToFinancialOperationSubtype(value.subtype ?? ""),
    });

    for (let i = new Date().getFullYear(); i <= props.latestYear; i++) {
      tableProps?.push({
        key: i,
        title: <Tag color="geekblue">{i}</Tag>,
        render: (value: FinancialOperation) => (
          <>
            <Popconfirm
              title="Muuuda selle assta adnmed"
              description={
                <>
                  <InputNumber
                    controls={false}
                    type="number"
                    onChange={(e) => setValueInput(e ?? 0)}
                    style={{ width: "6rem" }}
                    value={valueInput}
                  />{" "}
                  €
                </>
              }
              okText="Jah"
              cancelText="Ei"
              onCancel={addFinancialOperation.reset}
              onConfirm={() => onSubmit(i, value.subtype!, valueInput)}
            >
              <span style={{ cursor: "pointer" }}>
                {getPrice(
                  value.totalsPerPeriod.find((exp) => exp.year === i)?.sum ??
                    0,
                )}
              </span>
            </Popconfirm>
            {contextHolder}
          </>
        ),
      });
    }
    return tableProps;
  };

  return (
    <>
      <Table
        rowKey="id"
        size="small"
        pagination={false}
        dataSource={[...props.financialOperations]}
        columns={getColumns()}
      ></Table>
    </>
  );
};
export default FinancialOperationCategoryTable;
