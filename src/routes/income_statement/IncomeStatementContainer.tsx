import React from "react";
import { Col, Row, Tag } from "antd";
import IncomeFromSellingTable from "./IncomeFromSellingTable";
import { FinancialForecast } from "../../domain/FinancialForecast";
import FinancialOperationOverview, {
  parseToFinancialOperationSubtype,
} from "../../base_components/financial_operation/FinancialOperationOverview";
import { FinancialOperationSubtype } from "../../enums/FinancialOperationSubtype";
import { FinancialOperationType } from "../../enums/FinancialOperationType";
import { EXPENSE_CATEGORY_LIST } from "../expense/ExpenseCategoryListCreator";

interface Props {
  financialForecast: FinancialForecast;
  latestYear: number;
}

const IncomeStatementContainer = (props: Props) => {
  return (
    <>
      <Row justify="center">
        <Col>
          <h2>Kasumiaruanne</h2>
        </Col>
      </Row>
      <Row>
        <h2>Tulud majandustegevusest</h2>
      </Row>
      <Row>
        <Col span={20}>
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
        financialOperationType={null}
        forecastId={props.financialForecast?.id ?? 0}
        latestYear={props.latestYear}
        financialOperations={
          props.financialForecast.financialOperations?.filter(
            (op) => op.type === FinancialOperationType.EXPENSE,
          ) ?? []
        }
        financialOperationCategoryList={EXPENSE_CATEGORY_LIST}
        title="Majandustegevuse käigus tekkivad kulud"
      />
      <Row>
        <Col span={20}>
          <Tag style={{ width: "100%" }} color="red">
            <h3>Kulud kokku: </h3>
          </Tag>
        </Col>
      </Row>
      <br/>
      <Row>
        <Col span={20}>
          <Tag style={{ width: "100%" }} color="blue">
            <h3>Kasum majandustegevusest: </h3>
          </Tag>
        </Col>
      </Row>
      <br/>
      <Row>
        <Col span={20}>
          <Tag style={{ width: "100%" }} color="green-inverse">
            <h2><b>Raha jääk perioodi lõpus: </b></h2>
          </Tag>
        </Col>
      </Row>
    </>
  );
};

export default IncomeStatementContainer;
