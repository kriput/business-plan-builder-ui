import { Col, Row, Steps, Tag } from "antd";
import ProductContainer from "../../product/ProductContainer";
import { FinancialForecastService } from "../../../services/FinancialForecastService";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  BarChartOutlined,
  FallOutlined,
  PieChartOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import IncomeContainer from "../../income/IncomeContainer";
import { TotalPerPeriod } from "../../../domain/TotalForPeriod";
import ExpenseContainer from "../../expense/ExpenseContainer";
import { FinancialOperation } from "../../../domain/FinancialOperation";
import IncomeStatementContainer from "../../income_statement/IncomeStatementContainer";
import { useState } from "react";

export const getPercents = (num: number) => {
  return `${num * 100} %`;
};

export const roundNumberToTwoDecimalPlaces = (num: number) =>
  Math.round((num + Number.EPSILON) * 100) / 100;

export const getPrice = (price: number) => {
  return `${price} €`;
};

export const addNewTotalPerPeriod = (financialOperation: FinancialOperation, year: number) => {
  const createdTotalPerPeriod: TotalPerPeriod = { sum: 0, year: year };
  financialOperation.totalsPerPeriod.push(createdTotalPerPeriod);
  return createdTotalPerPeriod;
};

export const getTotalsPerPeriod = (financialOperations: FinancialOperation[]) =>
  financialOperations.map((exp) => exp.totalsPerPeriod).flat() ?? [];

const FinancialForecastContainer = () => {
  const [current, setCurrent] = useState(0);
  const financialForecastService = new FinancialForecastService();
  const { id } = useParams();

  const onChange = (value: number) => {
    setCurrent(value);
  };

  const getForecastById = useQuery({
    queryKey: ["loadFinancialForecastById"],
    queryFn: async () =>
      await financialForecastService.getForecastById(id ?? ""),
    retry: 0,
  });

  const latestYear = () => {
    const latestFromProducts = getForecastById.data?.products?.reduce((prev, next) => {
      const maxYearFromProduct = next.productsPerPeriod.reduce(
          (a, b) => Math.max(a, b.year),
          new Date().getFullYear(),
      );
      return Math.max(prev, maxYearFromProduct);
    }, new Date().getFullYear());

    const latestFromOperations = getForecastById.data?.financialOperations?.reduce((prev, next) => {
      const maxYearFromProduct = next.totalsPerPeriod.reduce(
          (a, b) => Math.max(a, b.year),
          new Date().getFullYear(),
      );
      return Math.max(prev, maxYearFromProduct);
    }, new Date().getFullYear());
    return Math.max(latestFromOperations!, latestFromProducts!);
  };

  const items = [
    {
      key: "1",
      title: (
        <span>
          <PieChartOutlined /> Tooted
        </span>
      ),
      subTitle: "Alusta siit",
      description: <span style={{color: "gray", fontSize:"small"}}>Toodete ja teenustega seotud info</span>,
      content: <ProductContainer latestYear={latestYear()} financialForecast={getForecastById.data} />,
    },
    {
      key: "2",
      title: (
        <span>
          <RiseOutlined /> Raha sissetulek
        </span>
      ),
      description: <span style={{color: "gray", fontSize:"small"}}>Tulude info lisamine</span>,
      content: (
        <IncomeContainer
          latestYear={latestYear()}
          forecastId={getForecastById.data?.id ?? 0}
        />
      ),
    },
    {
      key: "3",
      title: (
        <span>
          <FallOutlined /> Raha väljaminek
        </span>
      ),
      description: <span style={{color: "gray", fontSize:"small"}}>Kulude info lisamine</span>,
      content: (
        <ExpenseContainer
          latestYear={latestYear()}
          forecastId={getForecastById.data?.id ?? 0}
        />
      ),
    },
    {
      key: "4",
      title: (
        <span>
          <BarChartOutlined /> Kasumiaruanne
        </span>
      ),
      subTitle: "Kokkuvõte",
      description: <span style={{color: "gray", fontSize:"small"}}>Kõikide operatsioonide ja rahajäägi ülevaade</span>,
      content: <IncomeStatementContainer latestYear={latestYear()} financialForecast={getForecastById.data!}/>,
    },
  ];

  return (
      <>
        <Row justify="center">
          <Col>
            <h1>
              <Tag color="blue">
                <h1>Finantsprognoos: {getForecastById.data?.name} </h1>
              </Tag>
            </h1>
          </Col>
        </Row>
        <Steps
            type="navigation"
            current={current}
            onChange={onChange}
            className="site-navigation-steps"
            items={items}
        />
        <br/>
        <div>{items[current].content}</div>

      </>
  );
};

export default FinancialForecastContainer;
