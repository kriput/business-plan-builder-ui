import { useQuery } from "@tanstack/react-query";
import { FinancialOperationService } from "../../services/FinancialOperationService";
import { Col, Divider, Row, Skeleton, Tag } from "antd";
import SimpleTotalPerPeriodTable from "../../base_components/financial_operation/SimpleTotalPerPeriodTable";
import { getTotalsPerPeriod } from "../forecast/container/FinancialForecastContainer";
import FinancialOperationOverview, {
  parseToFinancialOperationSubtype
} from "../../base_components/financial_operation/FinancialOperationOverview";
import ErrorResult from "../../base_components/ErrorResult";
import { EXPENSE_CATEGORY_LIST } from "./ExpenseCategoryListCreator";
import { useState } from "react";
import { FinancialOperation } from "../../domain/FinancialOperation";
import { FinancialOperationType } from "../../enums/FinancialOperationType";
import { VAT } from "../../index";
import {FinancialOperationSubtype} from "../../enums/FinancialOperationSubtype";

interface Props {
  forecastId: number;
  latestYear: number;
}

const countVATForPeriod = (
    financialOperations: FinancialOperation[],
    year: number,
) => {
  const totalForPeriod = getTotalsPerPeriod(financialOperations.filter(exp =>
      parseToFinancialOperationSubtype(exp.subtype ?? "") !== FinancialOperationSubtype.SOCIAL_TAX &&
      parseToFinancialOperationSubtype(exp.subtype ?? "") !== FinancialOperationSubtype.UNEMPLOYMENT_INSURANCE_TAX));
  return (
      totalForPeriod
      .filter((totalPerPeriod) => totalPerPeriod.year === year)
      .reduce((sum, currentValue) => sum + currentValue.sum, 0) * VAT
  );
};

const countTotalForAllOperationsPerPeriod = (
    financialOperations: FinancialOperation[],
    year: number,
) => {
  const totalsForPeriod = getTotalsPerPeriod(financialOperations);
  return (
      totalsForPeriod
      .filter((totalPerPeriod) => totalPerPeriod.year === year)
      .reduce((sum, currentValue) => sum + currentValue.sum, 0) +
      countVATForPeriod(financialOperations, year)
  );
};

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
                financialOperations={expenses}
                latestYear={props.latestYear}
                addFirstBlank={false}
            />
          </Col>
        </Row>
        <Divider/>
        {getExpenses.isSuccess && (
            <>
              <Row>
              <Col span={24}>
              <FinancialOperationOverview
                  financialOperationType={FinancialOperationType.EXPENSE}
                  forecastId={props.forecastId}
                  latestYear={props.latestYear}
                  financialOperations={expenses}
                  financialOperationCategoryList={EXPENSE_CATEGORY_LIST}
                  title="Majandustegevuse käigus tekkivad kulud"
              />
              </Col>
              </Row>
              <Row>
                <Col xs={24} xl={20}>
                  <Tag style={{width: "100%"}} color="red">
                    <h3>Operatsioonidelt makstav käibemaks: </h3>
                    <SimpleTotalPerPeriodTable
                        addFirstBlank={true}
                        latestYear={props.latestYear}
                        financialOperations={expenses}
                        dataProcessor={countVATForPeriod}
                    />
                  </Tag>
                </Col>
              </Row>
            </>
        )}
        {getExpenses.isError && (
            <ErrorResult
                errorMessage={getExpenses.error.message}
                buttonMessage={"Proovi uuesti"}
                onClick={() => getExpenses.refetch()}
            />
        )}
        {getExpenses.isPending && <Skeleton active/>}
      </>
  );
};
export default ExpenseContainer;
