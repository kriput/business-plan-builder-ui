import { FinancialForecast } from "../../../domain/FinancialForecast";
import { Button, Col, Divider, Empty, List, Row, Skeleton } from "antd";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { FinancialForecastService } from "../../../services/FinancialForecastService";
import ErrorResult from "../../../base_components/ErrorResult";
import { FieldTimeOutlined, FileTextOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const FinancialForecastOverview = () => {
  const tripService = new FinancialForecastService();

  const getForecasts: UseQueryResult<FinancialForecast[], Error> = useQuery({
    queryKey: ["loadAllFinancialForecasts"],
    queryFn: async () => {
      return (await tripService
        .getAll("")
        .then((list) => list?.reverse())) as FinancialForecast[];
    },
    retry: 0,
  });

  return (
    <>
      <Row justify="center">
        <Col>
          <h1> Finatsprognooside ülevaade </h1>
        </Col>
      </Row>
      <Row justify="center">
        <div>
          <Link to="/forecasts/add">
            <Button type="primary" size="large">
              Koosta uus finantsprognoos
            </Button>
          </Link>
        </div>
      </Row>
      <Divider dashed />

      {getForecasts.isLoading && <Skeleton />}

      {getForecasts.isError && (
        <ErrorResult
          errorMessage={`Error: ${getForecasts.error?.message}`}
          buttonMessage={"Proovi uuesti"}
          onClick={() => getForecasts.refetch()}
        />
      )}

      {getForecasts.isSuccess && getForecasts.data.length > 0 && (
        <>
          <Row>
            <Col span="6" />
            <Col span="12">
              <h2>
                <FieldTimeOutlined /> Varasemad finatsprognoosid
              </h2>
            </Col>
            <Col span="6" />
          </Row>
          <Row justify="center">
            <Col span="12">
              <List
                itemLayout="horizontal"
                dataSource={getForecasts.data}
                renderItem={(forecast: FinancialForecast) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <h3>
                          <FileTextOutlined />
                        </h3>
                      }
                      title={
                      <Link to={`/forecasts/${forecast.id}`}>
                        <h3>{forecast.name}</h3>
                      </Link>}
                      description={
                        <>
                          <div>
                            Krediiti müügi osakaal käibest:{" "}
                            {(forecast.sellingInCreditRate ?? 0) * 100} %
                          </div>
                          <div>
                            Hoonete amortisatsiooninorm:{" "}
                            {(forecast.buildingDeprecationRate ?? 0) * 100} %
                          </div>
                          <div>
                            Seadmete amortisatsiooninorm:{" "}
                            {(forecast.equipmentDeprecationRate ?? 0) * 100} %
                          </div>
                        </>
                      }
                    />
                    <Link to={`/forecasts/${forecast.id}`}>Ava prognoos</Link>
                  </List.Item>
                )}
              />
            </Col>
          </Row>
        </>
      )}
      {getForecasts.data?.length === 0 && <Empty />}
    </>
  );
};

export default FinancialForecastOverview;
