import { Col, Divider, Row, Skeleton, Tag } from "antd";
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
import { INCOME_CATEGORY_LIST } from "./IncomeCategoryListCreator";
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

const countVATForPeriod = (incomes: FinancialOperation[], year: number) => {
  const filteredIncomes = incomes.filter(income =>
      parseToFinancialOperationSubtype(income.subtype!) !== FinancialOperationSubtype.SALES_INCOME &&
      parseToFinancialOperationSubtype(income.subtype!) !== FinancialOperationSubtype.SALES_INCOME_WITHOUT_TAX);
  let sum = 0;
  for (const income of filteredIncomes) {
    if (!income.tax) {
      sum += income.totalsPerPeriod.filter(tPP => tPP.year === year).flat().reduce((a, b) => a + b.sum * VAT, 0)
    } else {
      sum += income.totalsPerPeriod.filter(tPP => tPP.year === year).flat().reduce((a, b) => a + b.sum * (income.tax ?? VAT) , 0)
    }
  }
  return sum;
}

const countTotalForAllOperationsPerPeriod = (incomes: FinancialOperation[], year: number) => {
  const total = incomes.filter((income) => !subTypesNotIncludedForTotal.includes(parseToFinancialOperationSubtype(income.subtype!)))
  .map(income => income.totalsPerPeriod).flat()
  .filter(tPP => tPP.year === year)
  .reduce((a, b) => a + b.sum, 0);
  return total + countVATForPeriod(incomes, year);
}


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
            financialOperations={incomes}
            latestYear={props.latestYear}
            addFirstBlank={false}
          />
        </Col>
      </Row>
      <Divider />

      {getIncomes.isSuccess && (
        <>
          <FinancialOperationOverview
            financialOperationType={FinancialOperationType.INCOME}
            forecastId={props.forecastId}
            latestYear={props.latestYear}
            financialOperations={incomes}
            financialOperationCategoryList={INCOME_CATEGORY_LIST}
            title="Laekumised müügist"
          />
          <Row>
            <Col span={20}>
              <Tag style={{ width: "100%" }} color="red">
                <h3>Operatsioonidelt makstav käibemaks: </h3>
                <SimpleTotalPerPeriodTable
                  addFirstBlank={true}
                  latestYear={props.latestYear}
                  financialOperations={incomes}
                  dataProcessor={countVATForPeriod}
                />
              </Tag>
            </Col>
          </Row>
        </>
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
