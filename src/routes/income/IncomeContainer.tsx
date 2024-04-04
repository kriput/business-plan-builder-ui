import { Col, Divider, Row, Skeleton } from "antd";
import {
  countTotalForAllOperationsPerPeriod,
  getTotalsPerPeriod,
} from "../forecast/container/FinancialForecastContainer";
import { ProductPerPeriod } from "../../domain/ProductPerPeriod";
import { useQuery } from "@tanstack/react-query";
import { FinancialOperationService } from "../../services/FinancialOperationService";
import { useState } from "react";
import { FinancialOperation } from "../../domain/FinancialOperation";
import SimpleTotalPerPeriodTable from "../../base_components/financial_operation/SimpleTotalPerPeriodTable";
import FinancialOperationOverview from "../../base_components/financial_operation/FinancialOperationOverview";
import { FinancialOperationType } from "../../enums/FinancialOperationType";
import ErrorResult from "../../base_components/ErrorResult";
import { INCOME_CATEGORY_LIST } from "./IncomeCategoryListCreator";

interface Props {
  forecastId: number;
  latestYear: number;
}

interface IncomeData {
  period: number;
  totalIncome: number;
  incomeWithTax: number;
  incomeFromExport: number;
}

const getTotalSoldForExportRate = (productsPerPeriod: ProductPerPeriod[]) =>
  productsPerPeriod.map((p) => p.forExport).reduce((a, b) => a + b, 0) /
  productsPerPeriod.length;

const IncomeContainer = (props: Props) => {
  const financialOperationService = new FinancialOperationService();
  const [incomes, setIncomes] = useState([] as FinancialOperation[]);

  const getIncomes = useQuery({
    queryKey: ["getIncomesForForecast"],
    queryFn: async () => {
      const incomes = await financialOperationService.getIncomesForForecast(
        props.forecastId.toString(),
      );
      setIncomes(incomes ?? []);
      return incomes;
    },
  });

  return (
    <>
      <Row justify="center">
        <Col>
          <h2>Tulud kokku:</h2>
        </Col>
      </Row>
      <Row justify="center">
        <Col>
          <SimpleTotalPerPeriodTable
              dataProcessor={countTotalForAllOperationsPerPeriod}
              totalsPerPeriod={getTotalsPerPeriod(incomes)}
              latestYear={props.latestYear}
              addFirstBlank={false}
          />
        </Col>
      </Row>
      <Divider />

      {getIncomes.isSuccess && (
          <FinancialOperationOverview
              financialOperationType={FinancialOperationType.INCOME}
              forecastId={props.forecastId}
              latestYear={props.latestYear}
              financialOperations={incomes}
              financialOperationCategoryList={INCOME_CATEGORY_LIST}
              title="Laekumised müügist"
          />
      )}
      {getIncomes.isError && (
          <ErrorResult
              errorMessage={getIncomes.error.message}
              buttonMessage={"Proovi uuesti"}
              onClick={() => getIncomes.refetch()}
          />
      )}
      {getIncomes.isPending && <Skeleton active />}
    </>
  );
};

export default IncomeContainer;
