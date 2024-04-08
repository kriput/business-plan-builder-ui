import { useState } from "react";
import { FinancialOperation } from "../../domain/FinancialOperation";
import {
  FinancialOperationSubtype,
  financialOperationSubtypeMapping,
} from "../../enums/FinancialOperationSubtype";
import { Alert, Button, Form, Modal, Select, Tooltip } from "antd";
import { useForm } from "antd/es/form/Form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FinancialOperationService } from "../../services/FinancialOperationService";
import ErrorResult from "../ErrorResult";
import { parseToFinancialOperationSubtype } from "./FinancialOperationOverview";
import { FinancialOperationType } from "../../enums/FinancialOperationType";
import { CheckOutlined, PlusOutlined } from "@ant-design/icons";
import {updateAllData} from "../../routes/forecast/container/FinancialForecastContainer";

interface Props {
  forecastId: number;
  financialOperations: FinancialOperation[];
  financialOperationCategory: string;
  acceptedFinancialOperationSubtypes: FinancialOperationSubtype[];
  financialOperationType: FinancialOperationType;
}

const FinancialOperationFormModal = (props: Props) => {
  const [form] = useForm();
  const [showModal, setShowModal] = useState(false);
  const [input, setInput] = useState({
    type: props.financialOperationType,
    subtype: undefined,
    totalsPerPeriod: [],
  } as FinancialOperation);
  const financialOperationService = new FinancialOperationService();
  const queryClient = useQueryClient();

  const addFinancialOperation = useMutation({
    mutationFn: async (financialOperation: FinancialOperation) => {
      if (
        parseToFinancialOperationSubtype(input.subtype ?? "") ===
        FinancialOperationSubtype.SALARY
      ) {
        await handleSalaryInput();
      } else {
        await financialOperationService.update(
          financialOperation,
          `/${props.forecastId}/add`,
        );
      }
    },
    onSuccess: async () => {
      await updateAllData(queryClient);
      setInput({ ...input, subtype: undefined });
      setShowModal(false);
    },
  });

  const handleSalaryInput = async () => {
    await financialOperationService.update(input, `/${props.forecastId}/add`);
    input.subtype = financialOperationSubtypeMapping.get(
      FinancialOperationSubtype.SOCIAL_TAX,
    ) as FinancialOperationSubtype;
    await financialOperationService.update(input, `/${props.forecastId}/add`);
    input.subtype = financialOperationSubtypeMapping.get(
      FinancialOperationSubtype.UNEMPLOYMENT_INSURANCE_TAX,
    ) as FinancialOperationSubtype;
    await financialOperationService.update(input, `/${props.forecastId}/add`);
  };

  const handleChange = (value: FinancialOperationSubtype) => {
    setInput({
      ...input,
      subtype: financialOperationSubtypeMapping.get(
        value,
      ) as FinancialOperationSubtype,
    });
  };

  const options = props.acceptedFinancialOperationSubtypes
    .filter(
      (operationType) =>
        !props.financialOperations
          ?.map((operation) =>
            parseToFinancialOperationSubtype(operation.subtype!),
          )
          ?.includes(operationType),
    )
    .map((opType) => {
      return { name: opType, value: opType };
    });

  return (
    <div onClick={(e) => e.stopPropagation()}>
      {options.length === 0 && (
        <Tooltip title="Kõik alamkategooriad juba lisatud">
          <Button disabled>
            <CheckOutlined style={{ color: "green" }} />
          </Button>
        </Tooltip>
      )}
      {options.length > 0 && (
        <Tooltip title="Lisa alamkategooria">
          <Button onClick={() => setShowModal(true)}>
            <PlusOutlined />
          </Button>
        </Tooltip>
      )}

      <Modal
        title={props.financialOperationCategory}
        onOk={() => addFinancialOperation.mutate(input)}
        okText="Lisa"
        okButtonProps={{ disabled: options.length === 0 }}
        cancelText="Sulge"
        onCancel={() => {
          addFinancialOperation.reset();
          setShowModal(false);
        }}
        open={showModal}
      >
        {!addFinancialOperation.isError && (
          <Form form={form}>
            <Form.Item label="Kulu tüüp: ">
              <Select
                value={
                  parseToFinancialOperationSubtype(input.subtype ?? "") ?? null
                }
                options={options}
                onChange={handleChange}
                disabled={options.length === 0}
              ></Select>
              {options.length === 0 && (
                <Alert
                  type="warning"
                  showIcon
                  message="Kõik alamkategooriad on juba listaud!"
                />
              )}
            </Form.Item>
          </Form>
        )}
        {addFinancialOperation.isError && (
          <ErrorResult
            errorMessage={
              "Viga alamkategooria lisamisel! " + addFinancialOperation.error
            }
            buttonMessage={"Proovi uuesti"}
            onClick={addFinancialOperation.reset}
          />
        )}
      </Modal>
    </div>
  );
};
export default FinancialOperationFormModal;
