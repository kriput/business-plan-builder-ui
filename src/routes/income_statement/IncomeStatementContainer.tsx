import React, {useState} from "react";
import {Button, Col, Row, Space, Tag} from "antd";
import {DownloadOutlined} from "@ant-design/icons";
import IncomeFromSellingTable from "./IncomeFromSellingTable";
import { FinancialForecast } from "../../domain/FinancialForecast";
import FinancialOperationOverview, {
  parseToFinancialOperationSubtype,
} from "../../base_components/financial_operation/FinancialOperationOverview";
import { FinancialOperationSubtype } from "../../enums/FinancialOperationSubtype";
import { FinancialOperationType } from "../../enums/FinancialOperationType";
import { ALL_EXPENSE_CATEGORY_LIST } from "../expense/ExpenseCategoryListCreator";
import { ALL_INCOME_CATEGORY_LIST } from "../income/IncomeCategoryListCreator";
import SimpleTotalPerPeriodTable from "../../base_components/financial_operation/SimpleTotalPerPeriodTable";
import { countTotalForAllOperationsPerPeriodIncome } from "../income/IncomeContainer";
import { countTotalForAllOperationsPerPeriodExpense } from "../expense/ExpenseContainer";
import { FinancialOperation } from "../../domain/FinancialOperation";

interface Props {
  financialForecast: FinancialForecast;
  latestYear: number;
}

const countTotalForAllOperationsPerPeriod = (
  financialOperations: FinancialOperation[],
  year: number,
) =>
  countTotalForAllOperationsPerPeriodIncome(
    financialOperations.filter(
      (op) => op.type === FinancialOperationType.INCOME,
    ),
    year,
  ) -
  countTotalForAllOperationsPerPeriodExpense(
    financialOperations.filter(
      (op) => op.type === FinancialOperationType.EXPENSE,
    ),
    year,
  );

const countTotalMoneyLeft = (
  financialOperations: FinancialOperation[],
  year: number,
) => {
  let sum = 0;
  for (let i = new Date().getFullYear(); i <= year; i++) {
    sum += countTotalForAllOperationsPerPeriod(financialOperations, i);
  }
  return sum;
};

const IncomeStatementContainer = (props: Props) => {
  const [printButtonPressed, setPrintButtonPressed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  return (
    <>

      <Row justify="center">
        <Space>
        <Col>
          <h2>Kasumiaruanne</h2>
        </Col>
        <Col>
          <Button loading={isLoading} onClick={() => {
            setIsLoading(true)
            setPrintButtonPressed(!printButtonPressed);
            setTimeout(() => window.print(), 1500)
            setTimeout(() => setIsLoading(false), 1200)
          }}><DownloadOutlined /></Button>
        </Col>
        </Space>
      </Row>

      <Row>
        <h2>Tulud majandustegevusest</h2>
      </Row>
      <Row>
        <Col xs={24} xl={20}>
          <IncomeFromSellingTable
            otherIncomesTotalsPerPeriod={
              props.financialForecast.financialOperations
                ?.find(
                  (op) =>
                    parseToFinancialOperationSubtype(op.subtype ?? "") ===
                    FinancialOperationSubtype.OTHER_INCOME,
                )
                ?.totalsPerPeriod.flat() ?? []
            }
            products={props.financialForecast?.products ?? []}
            latestYear={props.latestYear}
          />
        </Col>
      </Row>
      <br />
      <FinancialOperationOverview
          printButtonPressed={printButtonPressed}
        financialOperationType={null}
        forecastId={props.financialForecast.id ?? 0}
        latestYear={props.latestYear}
        financialOperations={
          props.financialForecast.financialOperations?.filter(
            (op) => op.type === FinancialOperationType.INCOME,
          ) ?? []
        }
        financialOperationCategoryList={ALL_INCOME_CATEGORY_LIST}
        title="Laekumised müügist"
      />
      <Row>
        <Col xs={24} xl={20}>
          <Tag style={{ width: "100%" }} color="green">
            <h3>Laekumised kokku: </h3>
            <SimpleTotalPerPeriodTable
              dataProcessor={countTotalForAllOperationsPerPeriodIncome}
              financialOperations={
                props.financialForecast.financialOperations?.filter(
                  (op) => op.type === FinancialOperationType.INCOME,
                ) ?? []
              }
              latestYear={props.latestYear}
              addFirstBlank={true}
            />
          </Tag>
        </Col>
      </Row>
      <br />
      <FinancialOperationOverview
          printButtonPressed={printButtonPressed}
        financialOperationType={null}
        forecastId={props.financialForecast?.id ?? 0}
        latestYear={props.latestYear}
        financialOperations={
          props.financialForecast.financialOperations?.filter(
            (op) => op.type === FinancialOperationType.EXPENSE,
          ) ?? []
        }
        financialOperationCategoryList={ALL_EXPENSE_CATEGORY_LIST}
        title="Majandustegevuse käigus tekkivad kulud"
      />
      <Row>
        <Col xs={24} xl={20}>
          <Tag style={{ width: "100%" }} color="red">
            <h3>Kulud kokku: </h3>
            <SimpleTotalPerPeriodTable
              dataProcessor={countTotalForAllOperationsPerPeriodExpense}
              financialOperations={
                props.financialForecast.financialOperations?.filter(
                  (op) => op.type === FinancialOperationType.EXPENSE,
                ) ?? []
              }
              latestYear={props.latestYear}
              addFirstBlank={true}
            />
          </Tag>
        </Col>
      </Row>
      <br />
      <Row>
        <h1>Kokkuvõte</h1>
      </Row>
      <Row>
        <Col xs={24} xl={20}>
          <Tag style={{ width: "100%" }} color="blue">
            <h3>Kasum majandustegevusest: </h3>
            <SimpleTotalPerPeriodTable
              dataProcessor={countTotalForAllOperationsPerPeriod}
              financialOperations={
                props.financialForecast.financialOperations ?? []
              }
              latestYear={props.latestYear}
              addFirstBlank={true}
            />
          </Tag>
        </Col>
      </Row>
      <br />
      <Row>
        <Col xs={24} xl={20}>
          <Tag style={{ width: "100%" }} color="green-inverse">
            <h2>
              <b>Raha jääk perioodi lõpus: </b>
            </h2>
            <SimpleTotalPerPeriodTable
              dataProcessor={countTotalMoneyLeft}
              financialOperations={
                props.financialForecast.financialOperations ?? []
              }
              latestYear={props.latestYear}
              addFirstBlank={true}
            />
          </Tag>
        </Col>
      </Row>
    </>
  );
};

export default IncomeStatementContainer;
