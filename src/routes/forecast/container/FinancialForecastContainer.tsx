import { Col, Row, Tabs, TabsProps } from "antd";
import ProductOverview from "../../product/ProductOverview";
import { FinancialForecastService } from "../../../services/FinancialForecastService";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  PieChartOutlined,
  FallOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import ExpensesContainer from "../../expenses/ExpensesContainer";

export const getPercents = (num: number) => {
  return `${num * 100} %`;
};

export const getPrice = (price: number) => {
  return `${price} €`;
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
        <ProductOverview
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
      children: <></>,
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
  ];

  return (
    <>
      <Row justify="center">
        <Col>
          <h1> Finantsprognoos: {getForecastById.data?.name} </h1>
        </Col>
      </Row>
      <div style={{ marginLeft: "1rem" }}>
        <Tabs defaultActiveKey="1" size="large" items={items} />
      </div>
    </>
  );
};

export default FinancialForecastContainer;
