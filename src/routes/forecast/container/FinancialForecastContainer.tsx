import { Col, Row, Tabs, TabsProps, Tag } from "antd";
import ProductContainer from "../../product/ProductContainer";
import { FinancialForecastService } from "../../../services/FinancialForecastService";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  BarChartOutlined,
  DiffOutlined,
  FallOutlined,
  PieChartOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import IncomeContainer from "../../income/IncomeContainer";
import { Product } from "../../../domain/Product";
import { TotalPerPeriod } from "../../../domain/TotalForPeriod";
import { VAT } from "../../../index";
import ExpenseContainer from "../../expense/ExpenseContainer";
import { FinancialOperation } from "../../../domain/FinancialOperation";

export const getPercents = (num: number) => {
  return `${num * 100} %`;
};

export const roundNumberToTwoDecimalPlaces = (num: number) =>
  Math.round((num + Number.EPSILON) * 100) / 100;

export const getPrice = (price: number) => {
  return `${price} €`;
};

export const getLatestYear = (products: Product[]) => {
  return products.reduce((prev, next) => {
    const maxYearFromProduct = next.productsPerPeriod.reduce(
      (a, b) => Math.max(a, b.year),
      new Date().getFullYear(),
    );
    return Math.max(prev, maxYearFromProduct);
  }, new Date().getFullYear());
};

export const countVATForPeriod = (
  totalForPeriod: TotalPerPeriod[],
  year: number,
) => {
  return (
    totalForPeriod
      .filter((totalPerPeriod) => totalPerPeriod.year === year)
      .reduce((sum, currentValue) => sum + currentValue.sum, 0) * VAT
  );
};

export const countTotalForAllOperationsPerPeriod = (
  totalsPerPeriod: TotalPerPeriod[],
  year: number,
) => {
  return (
    totalsPerPeriod
      .filter((totalPerPeriod) => totalPerPeriod.year === year)
      .reduce((sum, currentValue) => sum + currentValue.sum, 0) +
    countVATForPeriod(totalsPerPeriod, year)
  );
};

export const getTotalsPerPeriod = (financialOperations: FinancialOperation[]) =>
  financialOperations.map((exp) => exp.totalsPerPeriod).flat() ?? [];

const FinancialForecastContainer = () => {
  const financialForecastService = new FinancialForecastService();
  const { id } = useParams();

  const getForecastById = useQuery({
    queryKey: ["loadFinancialForecastById"],
    queryFn: async () =>
      await financialForecastService.getForecastById(id ?? ""),
    retry: 0,
  });

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: (
        <span>
          <PieChartOutlined /> Tooted
        </span>
      ),
      children: <ProductContainer financialForecast={getForecastById.data} />,
    },
    {
      key: "2",
      label: (
        <span>
          <RiseOutlined /> Raha sissetulek
        </span>
      ),
      children: (
        <IncomeContainer
          latestYear={getLatestYear(getForecastById.data?.products ?? [])}
          forecastId={getForecastById.data?.id ?? 0}
        />
      ),
    },
    {
      key: "3",
      label: (
        <span>
          <FallOutlined /> Raha väljaminek
        </span>
      ),
      children: (
        <ExpenseContainer
          latestYear={getLatestYear(getForecastById.data?.products ?? [])}
          forecastId={getForecastById.data?.id ?? 0}
        />
      ),
    },
    {
      key: "4",
      label: (
        <span>
          <BarChartOutlined /> Kasumiaruanne
        </span>
      ),
      children: <>VARSTI TULEKUL</>,
    },
    {
      key: "5",
      label: (
        <span>
          <DiffOutlined /> Bilanss
        </span>
      ),
      children: <>VARSTI TULEKUL</>,
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
      <div style={{ marginLeft: "1rem" }}>
        <Tabs defaultActiveKey="1" size="large" items={items} />
      </div>
    </>
  );
};

export default FinancialForecastContainer;
