import {
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Table,
  TableProps,
  Tag,
  Tooltip,
} from "antd";
import { LockOutlined, StopOutlined } from "@ant-design/icons";
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
  updateAllData,
} from "../../routes/forecast/container/FinancialForecastContainer";
import { SOCIAL_TAX, UNEMPLOYMENT_INSURANCE_TAX } from "../../index";
import { FinancialOperationType } from "../../enums/FinancialOperationType";
import { FINANCIAL_OPERATION_SUBTYPE_INFO } from "../../routes/expense/ExpenseSubtypeInfo";
import ConfirmDelete from "../ConfirmDelete";

interface Props {
  forecastId: number;
  financialOperations: FinancialOperation[];
  latestYear: number;
  financialOperationType: FinancialOperationType | null;
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
  const [modal, context] = Modal.useModal();

  const financialOperationService = new FinancialOperationService();

  const addFinancialOperation = useMutation({
    mutationFn: async (input: InputDto) => {
      if (
        parseToFinancialOperationSubtype(input.subtype) ===
        FinancialOperationSubtype.SALARY
      ) {
        await makeRequest(
          input.year,
          financialOperationSubtypeMapping.get(
            FinancialOperationSubtype.SOCIAL_TAX,
          ) as FinancialOperationSubtype,
          input.sum * SOCIAL_TAX,
        );
        await makeRequest(
          input.year,
          financialOperationSubtypeMapping.get(
            FinancialOperationSubtype.UNEMPLOYMENT_INSURANCE_TAX,
          ) as FinancialOperationSubtype,
          input.sum * UNEMPLOYMENT_INSURANCE_TAX,
        );
      }
      return await makeRequest(input.year, input.subtype, input.sum);
    },
    onSuccess: async () => {
      await updateAllData(queryClient);
    },
    onError: (error) => {
      console.log(error);
      messageApi.error("Andmete muutmine ebaõnnestus! " + error.message);
    },
  });

  const deleteOperation = useMutation({
    mutationFn: async (operationId: number) => {
      await financialOperationService.delete(operationId.toString());
    },
    onSuccess: async () => await updateAllData(queryClient),
    onError: (e) => messageApi.error("Kustutamine ebaõnnestus: " + e.message),
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
            {(automaticallyGeneratedFields.includes(
              parseToFinancialOperationSubtype(value.subtype!),
            ) ||
              props.financialOperationType === null) && (
              <Popconfirm
                title="Automaatselt genereeritud"
                description="Neid andmeid käsitsi muuta ei saa"
                okText="Sulge"
                cancelText="Kust andmed tulevad?"
                cancelButtonProps={{disabled: !FINANCIAL_OPERATION_SUBTYPE_INFO.has(parseToFinancialOperationSubtype(value.subtype ?? ""))}}
                onCancel={() => modal.info({
                  title: 'Lisainfo',
                  content: FINANCIAL_OPERATION_SUBTYPE_INFO.get(parseToFinancialOperationSubtype(value.subtype ?? ""))
                })}
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
            ) &&
              props.financialOperationType !== null && (
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
                      value.totalsPerPeriod.find((exp) => exp.year === i)
                        ?.sum ?? 0,
                    )}
                  </span>
                </Popconfirm>
              )}
            {contextHolder}
            {context}
          </>
        ),
      });
    }
    if (props.financialOperationType !== null) {
      tableProps?.push({
        title: "",
        fixed: "right",
        width: "1rem",
        render: (value: FinancialOperation) =>
            !automaticallyGeneratedFields.includes(
                parseToFinancialOperationSubtype(value.subtype!),
            ) ? (
                <ConfirmDelete
                    onConfirm={() => deleteOperation.mutate(value.id ?? 0)}
                />
            ) : (
                <>
                  <Tooltip
                      title="Automaatselt genereeritud andmed ei saa kustutada käsitsi"><StopOutlined
                      style={{color: "green"}}/></Tooltip>
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
