import {Col, Row, Tabs, TabsProps, Tag} from "antd";
import ProductContainer from "../../product/ProductContainer";
import { FinancialForecastService } from "../../../services/FinancialForecastService";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  DiffOutlined,
  BarChartOutlined,
  PieChartOutlined,
  FallOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import ExpensesContainer from "../../expenses/ExpensesContainer";
import IncomeView from "../../income/IncomeView";
import {Product} from "../../../domain/Product";

export const getPercents = (num: number) => {
  return `${num * 100} %`;
};

export const roundNumberToTwoDecimalPlaces = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100

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
      children: (
        <ProductContainer
          fetchForecast={getForecastById.refetch}
          financialForecast={getForecastById.data}
        />
      ),
    },
    {
      key: "2",
      label: (
        <span>
          <RiseOutlined /> Raha sissetulek
        </span>
      ),
      children: <IncomeView/>,
    },
    {
      key: "3",
      label: (
        <span>
          <FallOutlined /> Raha väljaminek
        </span>
      ),
      children: (
        <ExpensesContainer
          fetchForecast={getForecastById.refetch}
          financialForecast={getForecastById.data}
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
      children: (
        <>VARSTI TULEKUL</>
      ),
    },
    {
      key: "5",
      label: (
        <span>
          <DiffOutlined /> Bilanss
        </span>
      ),
      children: (
        <>VARSTI TULEKUL</>
      ),
    },
  ];

  return (
    <>
      <Row justify="center">
        <Col>
          <h1><Tag color="blue"> <h1>Finantsprognoos: {getForecastById.data?.name} </h1></Tag></h1>
        </Col>
      </Row>
      <div style={{ marginLeft: "1rem" }}>
        <Tabs defaultActiveKey="1" size="large" items={items} />
      </div>
    </>
  );
};

export default FinancialForecastContainer;
