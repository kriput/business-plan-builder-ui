import {Alert, Col, Divider, Row, Skeleton, Tag} from "antd";
import { useQuery } from "@tanstack/react-query";
import { FinancialOperationService } from "../../services/FinancialOperationService";
import { useState } from "react";
import { FinancialOperation } from "../../domain/FinancialOperation";
import SimpleTotalPerPeriodTable from "../../base_components/financial_operation/SimpleTotalPerPeriodTable";
import FinancialOperationOverview, {
  parseToFinancialOperationSubtype,
} from "../../base_components/financial_operation/FinancialOperationOverview";
import { FinancialOperationType } from "../../enums/FinancialOperationType";
import ErrorResult from "../../base_components/ErrorResult";
import {INCOME_CATEGORY_LIST, INCOME_FROM_LOANS_LIST} from "./IncomeCategoryListCreator";
import { FinancialOperationSubtype } from "../../enums/FinancialOperationSubtype";
import { VAT } from "../../index";

interface Props {
  forecastId: number;
  latestYear: number;
}

const subTypesNotIncludedForTotal = [
  FinancialOperationSubtype.SALES_INCOME_WITH_TAX,
  FinancialOperationSubtype.SALES_INCOME_WITHOUT_TAX,
];

const subTypesNotIncludedForVAT = [
  FinancialOperationSubtype.SALES_INCOME,
  FinancialOperationSubtype.SALES_INCOME_WITHOUT_TAX,
    FinancialOperationSubtype.SUBSIDIES,
    FinancialOperationSubtype.LOAN,
    FinancialOperationSubtype.INTEREST
]

export const countVATForPeriodIncome = (incomes: FinancialOperation[], year: number) => {
  const filteredIncomes = incomes.filter(
    (income) =>
        !subTypesNotIncludedForVAT.includes(parseToFinancialOperationSubtype(income.subtype!))
  );
  let sum = 0;
  for (const income of filteredIncomes) {
    if (!income.tax) {
      sum += income.totalsPerPeriod
        .filter((tPP) => tPP.year === year)
        .flat()
        .reduce((a, b) => a + b.sum * VAT, 0);
    } else {
      sum += income.totalsPerPeriod
        .filter((tPP) => tPP.year === year)
        .flat()
        .reduce((a, b) => a + b.sum * (income.tax ?? VAT), 0);
    }
  }
  return sum;
};

export const countTotalForAllOperationsPerPeriodIncome = (
  incomes: FinancialOperation[],
  year: number,
) => {
  const total = incomes
    .filter(
      (income) =>
        !subTypesNotIncludedForTotal.includes(
          parseToFinancialOperationSubtype(income.subtype!),
        ),
    )
    .map((income) => income.totalsPerPeriod)
    .flat()
    .filter((tPP) => tPP.year === year)
    .reduce((a, b) => a + b.sum, 0);
  return total + countVATForPeriodIncome(incomes, year);
};

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
            dataProcessor={countTotalForAllOperationsPerPeriodIncome}
            financialOperations={incomes}
            latestYear={props.latestYear}
            addFirstBlank={false}
          />
        </Col>
      </Row>
      <Divider />

      {getIncomes.isSuccess && (
          <>
            <Row>
              <Col>
                <Alert
                    style={{ marginBottom: "1rem" }}
                    type="info"
                    message="Aasta andmete muutmiseks klõpsake numbrile. Aasta lisamiseks lisage vastava aasta andmed vähemalt ühe toote alla."
                    closable
                    showIcon
                />
              </Col>
            </Row>
            <FinancialOperationOverview
                financialOperationType={FinancialOperationType.INCOME}
                forecastId={props.forecastId}
                latestYear={props.latestYear}
                financialOperations={incomes}
                financialOperationCategoryList={INCOME_CATEGORY_LIST}
                title="Laekumised müügist"
            />
            <Row>
              <Col xs={24} xl={20}>
                <Tag style={{width: "100%"}} color="red">
                  <h3>Operatsioonidelt makstav käibemaks: </h3>
                  <SimpleTotalPerPeriodTable
                      addFirstBlank={true}
                      latestYear={props.latestYear}
                      financialOperations={incomes}
                      dataProcessor={countVATForPeriodIncome}
                  />
                </Tag>
              </Col>
            </Row>
            <br/>
            <br/>
            <FinancialOperationOverview forecastId={props.forecastId}
                                        latestYear={props.latestYear}
                                        financialOperations={incomes}
                                        title={"Laekumised finantseerimistegevusest"}
                                        financialOperationCategoryList={INCOME_FROM_LOANS_LIST}
                                        financialOperationType={FinancialOperationType.INCOME}/>
          </>
      )}
      {getIncomes.isError && (
          <ErrorResult
              errorMessage={getIncomes.error.message}
              buttonMessage={"Proovi uuesti"}
              onClick={() => getIncomes.refetch()}
          />
      )}
      {getIncomes.isPending && <Skeleton active/>}
    </>
  );
};

export default IncomeContainer;
