import { useQuery } from "@tanstack/react-query";
import { FinancialOperationService } from "../../services/FinancialOperationService";
import { Col, Divider, Row, Skeleton } from "antd";
import SimpleTotalPerPeriodTable from "../../base_components/financial_operation/SimpleTotalPerPeriodTable";
import {
  countTotalForAllOperationsPerPeriod,
  getTotalsPerPeriod,
} from "../forecast/container/FinancialForecastContainer";
import FinancialOperationOverview from "../../base_components/financial_operation/FinancialOperationOverview";
import ErrorResult from "../../base_components/ErrorResult";
import { EXPENSE_CATEGORY_LIST } from "./ExpenseCategoryListCreator";
import { useState } from "react";
import { FinancialOperation } from "../../domain/FinancialOperation";
import { FinancialOperationType } from "../../enums/FinancialOperationType";

interface Props {
  forecastId: number;
  latestYear: number;
}

const ExpenseContainer = (props: Props) => {
  const [expenses, setExpenses] = useState([] as FinancialOperation[]);
  const financialOperationService = new FinancialOperationService();

  const getExpenses = useQuery({
    queryKey: ["getExpensesForForecast"],
    queryFn: async () => {
      const expenses = await financialOperationService.getExpensesForForecast(
        props.forecastId.toString(),
      );
      setExpenses(expenses ?? []);
      return expenses;
    },
  });

  return (
    <>
      <Row justify="center">
        <h2>Kulud kokku</h2>
      </Row>
      <Row justify="center">
        <Col>
          <SimpleTotalPerPeriodTable
            dataProcessor={countTotalForAllOperationsPerPeriod}
            totalsPerPeriod={getTotalsPerPeriod(expenses)}
            latestYear={props.latestYear}
            addFirstBlank={false}
          />
        </Col>
      </Row>
      <Divider />
      {getExpenses.isSuccess && (
        <FinancialOperationOverview
          financialOperationType={FinancialOperationType.EXPENSE}
          forecastId={props.forecastId}
          latestYear={props.latestYear}
          financialOperations={expenses}
          financialOperationCategoryList={EXPENSE_CATEGORY_LIST}
          title="Majandustegevuse käigus tekkivad kulud"
        />
      )}
      {getExpenses.isError && (
        <ErrorResult
          errorMessage={getExpenses.error.message}
          buttonMessage={"Proovi uuesti"}
          onClick={() => getExpenses.refetch()}
        />
      )}
      {getExpenses.isPending && <Skeleton active />}
    </>
  );
};
export default ExpenseContainer;
