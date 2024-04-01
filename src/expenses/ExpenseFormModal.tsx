import { useState } from "react";
import { Expense } from "../domain/Expense";
import { ExpenseType, expenseTypeMapping } from "../enums/ExpenseType";
import {Alert, Button, Form, Modal, Select, Tag} from "antd";
import { useForm } from "antd/es/form/Form";
import { useMutation } from "@tanstack/react-query";
import { ExpenseService } from "../services/ExpenseService";
import ErrorResult from "../base_components/ErrorResult";
import { FinancialForecast } from "../domain/FinancialForecast";
import {getExpenseTypeEnumName} from "./ExpensesContainer";

interface Props {
  forecast: FinancialForecast;
  expenseCategory: string;
  acceptedExpenseTypes: ExpenseType[];
  fetchForecast: Function;
  setExpenses: Function
}

const ExpenseFormModal = (props: Props) => {
  const [form] = useForm();
  const [showModal, setShowModal] = useState(false);
  const [input, setInput] = useState({
    type: undefined,
    expensesPerPeriod: [],
  } as Expense);
  const expenseService = new ExpenseService();

  const addExpense = useMutation({
    mutationFn: async (expense: Expense) =>
      await expenseService.add(expense, `/add/${props.forecast.id}`),
    onSuccess: async (data)  => {
      props.fetchForecast();
      setInput({ ...input, type: undefined });
      setShowModal(false);
    },
  });

  const handleChange = (value: ExpenseType) => {
    setInput({ ...input, type: expenseTypeMapping.get(value) as ExpenseType });
  };

  const options = props.acceptedExpenseTypes
    .filter((accpExp) =>
        !props.forecast.expenses
        ?.map((exp) => getExpenseTypeEnumName(exp.type!))?.includes(accpExp),
    )
    .map((expType) => {
      return { name: expType, value: expType };
    });

  return (
    <div onClick={(e) => e.stopPropagation()}>
      {options.length === 0 && <Tag style={{marginTop: '5px'}} color="green">Kõik kulu tüübid juba lisatud</Tag> }
      {options.length > 0 && <Button onClick={() => setShowModal(true)}>+ Lisa kulu</Button>}

      <Modal
        title={props.expenseCategory}
        onOk={() => addExpense.mutate(input)}
        okText="Lisa"
        okButtonProps={{disabled: options.length === 0}}
        cancelText="Sulge"
        onCancel={() => {
          addExpense.reset();
          setShowModal(false);
        }}
        open={showModal}
      >
        {!addExpense.isError && (
          <Form form={form}>
            <Form.Item label="Kulu tüüp: ">
              <Select
                  value={getExpenseTypeEnumName(input.type ?? '') ?? null}
                options={options}
                onChange={handleChange}
                disabled={options.length === 0}
              ></Select>
              {options.length === 0 && <Alert type="warning" showIcon message="Kõik kulude kategooriad on juba listaud!"/>}
            </Form.Item>
          </Form>
        )}
        {addExpense.isError && (
          <ErrorResult
            errorMessage={"Viga kulu lisamisel! " + addExpense.error}
            buttonMessage={"Proovi uuesti"}
            onClick={addExpense.reset}
          />
        )}
      </Modal>
    </div>
  );
};
export default ExpenseFormModal;
