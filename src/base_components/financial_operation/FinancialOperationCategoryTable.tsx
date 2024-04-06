import {
  InputNumber,
  message,
  Popconfirm,
  Table,
  TableProps,
  Tag,
  Tooltip,
} from "antd";
import { LockOutlined } from "@ant-design/icons";
import { FinancialOperation } from "../../domain/FinancialOperation";
import { useState } from "react";
import {
  FinancialOperationSubtype,
  financialOperationSubtypeMapping,
} from "../../enums/FinancialOperationSubtype";
import { parseToFinancialOperationSubtype } from "./FinancialOperationOverview";
import { FinancialOperationService } from "../../services/FinancialOperationService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addNewTotalPerPeriod,
  getPercents,
  getPrice,
} from "../../routes/forecast/container/FinancialForecastContainer";
import { SOCIAL_TAX, UNEMPLOYMENT_INSURANCE_TAX } from "../../index";

interface Props {
  forecastId: number;
  financialOperations: FinancialOperation[];
  latestYear: number;
}

const automaticallyGeneratedFields = [
  FinancialOperationSubtype.SALES_INCOME,
  FinancialOperationSubtype.SALES_INCOME_WITH_TAX,
  FinancialOperationSubtype.SALES_INCOME_WITHOUT_TAX,
  FinancialOperationSubtype.SOCIAL_TAX,
  FinancialOperationSubtype.UNEMPLOYMENT_INSURANCE_TAX,
  FinancialOperationSubtype.RAW_MATERIALS,
];

interface InputDto {
  year: number;
  subtype: FinancialOperationSubtype;
  sum: number;
}

const FinancialOperationCategoryTable = (props: Props) => {
  const [valueInput, setValueInput] = useState(0);
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();

  const financialOperationService = new FinancialOperationService();

  const addFinancialOperation = useMutation({
    mutationFn: async (input: InputDto) => {
      if (
        parseToFinancialOperationSubtype(input.subtype) ===
        FinancialOperationSubtype.SALARY
      ) {
        await makeRequest(
          input.year + 1,
          financialOperationSubtypeMapping.get(
            FinancialOperationSubtype.SOCIAL_TAX,
          ) as FinancialOperationSubtype,
          input.sum * SOCIAL_TAX,
        );
        await makeRequest(
          input.year + 1,
          financialOperationSubtypeMapping.get(
            FinancialOperationSubtype.UNEMPLOYMENT_INSURANCE_TAX,
          ) as FinancialOperationSubtype,
          input.sum * UNEMPLOYMENT_INSURANCE_TAX,
        );
      }
      return await makeRequest(input.year, input.subtype, input.sum);
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ["getExpensesForForecast"],
      });
      await queryClient.refetchQueries({ queryKey: ["getIncomesForForecast"] });
    },
    onError: (error) => {
      console.log(error);
      messageApi.error("Andmete muutmine ebaõnnestus! " + error.message);
    },
  });

  const makeRequest = async (
    year: number,
    subtype: FinancialOperationSubtype,
    sum: number,
  ) => {
    const operationToUpdate = props.financialOperations.find(
      (exp) => exp.subtype === subtype,
    );

    const totalPerPeriodToUpdate =
      operationToUpdate?.totalsPerPeriod.find((tPP) => tPP?.year === year) ??
      addNewTotalPerPeriod(operationToUpdate!, year);

    totalPerPeriodToUpdate.sum = sum;
    return await financialOperationService.update(
      operationToUpdate!,
      `/${props.forecastId}/add`,
    );
  };

  const getColumns = (): TableProps["columns"] => {
    const tableProps = [] as TableProps["columns"];
    tableProps?.push({
      width: "15rem",
      key: "subtype",
      title: "Alamkategooria",
      render: (value: FinancialOperation) => (
        <>
          {automaticallyGeneratedFields.includes(
            parseToFinancialOperationSubtype(value.subtype!),
          ) && (
            <Tooltip title="Automaatselt genereeritud andmed">
              <LockOutlined style={{ color: "green" }} />
            </Tooltip>
          )}
          {parseToFinancialOperationSubtype(value.subtype ?? "")}
          {value.tax ? `, käibemaks: ${getPercents(value.tax)}` : ""}
        </>
      ),
    });

    for (let i = new Date().getFullYear(); i <= props.latestYear; i++) {
      tableProps?.push({
        key: i,
        title: <Tag color="geekblue">{i}</Tag>,
        render: (value: FinancialOperation) => (
          <>
            {automaticallyGeneratedFields.includes(
              parseToFinancialOperationSubtype(value.subtype!),
            ) && (
              <Popconfirm
                title="Automaatselt genereeritud"
                description={"Neid andmeid käsitsi muuta ei saa"}
                okText="Sulge"
                cancelText="Kust andmed tulevad?"
                cancelButtonProps={{ disabled: true }}
              >
                <span style={{ cursor: "pointer" }}>
                  {getPrice(
                    value.totalsPerPeriod.find((exp) => exp.year === i)?.sum ??
                      0,
                  )}
                </span>
              </Popconfirm>
            )}
            {!automaticallyGeneratedFields.includes(
              parseToFinancialOperationSubtype(value.subtype!),
            ) && (
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
                onConfirm={() =>
                  addFinancialOperation.mutate({
                    year: i,
                    subtype: value.subtype!,
                    sum: valueInput,
                  })
                }
              >
                <span style={{ cursor: "pointer" }}>
                  {getPrice(
                    value.totalsPerPeriod.find((exp) => exp.year === i)?.sum ??
                      0,
                  )}
                </span>
              </Popconfirm>
            )}
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
        scroll={{ x: "max-content" }}
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
