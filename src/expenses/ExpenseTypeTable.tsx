import {InputNumber, message, Popconfirm, Table, TableProps, Tag} from "antd";
import { Expense } from "../domain/Expense";
import { useState } from "react";
import { ExpenseType } from "../enums/ExpenseType";
import { ExpensePerPeriod } from "../domain/ExpensePerPeriod";
import { getExpenseTypeEnumName } from "./ExpensesContainer";
import { ExpenseService } from "../services/ExpenseService";
import { useMutation } from "@tanstack/react-query";
import { getPrice } from "../forecast/container/FinancialForecastContainer";

interface Props {
  forecastId: number;
  expenses: Expense[];
  latestYear: number;
  fetchForecast: Function;
}

const ExpenseTypeTable = (props: Props) => {
  const [valueInput, setValueInput] = useState(0);
  const [messageApi, contextHolder] = message.useMessage();
  const [expenses, setExpenses] = useState(props.expenses);


  const expenseService = new ExpenseService();

  const addExpense = useMutation({
    mutationFn: async (expense: Expense) =>
      expenseService.add(expense, `/add/${props.forecastId}`),
    onSuccess: (data) => {
      props.fetchForecast();
    },
    onError: error => messageApi.error('Andmete muutmine ebaõnnestus! ' + error.message)
  });

  const addNewExpensePerPeriod = (expense: Expense, year: number) => {
    const createdExpensePerPeriod: ExpensePerPeriod = { sum: 0, year: year };
    expense.expensesPerPeriod.push(createdExpensePerPeriod);
    return createdExpensePerPeriod;
  };

  const onSubmit = (year: number, type: ExpenseType, sum: number) => {
    const updatedExpenses = [...props.expenses];
    const expenseWithProvidedType = updatedExpenses.find(
      (exp) => exp.type === type,
    );

    const expensePerPeriodToUpdate =
      expenseWithProvidedType?.expensesPerPeriod.find(
        (expPP) => expPP.year === year,
      ) ?? addNewExpensePerPeriod(expenseWithProvidedType!, year);

    expensePerPeriodToUpdate.sum = sum;
    setExpenses(updatedExpenses);
    addExpense.mutate(expenseWithProvidedType!);
  };

  const getColumns = (): TableProps["columns"] => {
    const tableProps = [] as TableProps["columns"];
    tableProps?.push({
      width: "10rem",
      key: "type",
      title: "Kulu tüüp",
      render: (value: Expense) => getExpenseTypeEnumName(value.type ?? ""),
    });

    for (let i = new Date().getFullYear(); i <= props.latestYear; i++) {
      tableProps?.push({
        key: i,
        title: <Tag color="geekblue">{i}</Tag>,
        render: (value: Expense) => (
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
              onCancel={addExpense.reset}
              onConfirm={() => onSubmit(i, value.type!, valueInput)}
            >
              <span style={{ cursor: "pointer" }}>
                {getPrice(
                  value.expensesPerPeriod.find((exp) => exp.year === i)?.sum ??
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
        dataSource={props.expenses}
        columns={getColumns()}
      ></Table>
    </>
  );
};
export default ExpenseTypeTable;
