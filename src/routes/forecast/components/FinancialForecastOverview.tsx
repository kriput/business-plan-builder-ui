import { FinancialForecast } from "../../../domain/FinancialForecast";
import {
  Button,
  Col,
  Divider,
  Empty,
  List,
  message,
  Row,
  Skeleton,
  Space,
} from "antd";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { FinancialForecastService } from "../../../services/FinancialForecastService";
import ErrorResult from "../../../base_components/ErrorResult";
import {
  DeleteOutlined,
  FieldTimeOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { getPercents } from "../container/FinancialForecastContainer";

const FinancialForecastOverview = () => {
  const financialForecastService = new FinancialForecastService();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();

  const getForecasts: UseQueryResult<FinancialForecast[], Error> = useQuery({
    queryKey: ["loadAllFinancialForecasts"],
    queryFn: async () => {
      return (await financialForecastService
        .getAll("")
        .then((list) => list?.reverse())) as FinancialForecast[];
    },
    retry: 0,
  });

  const deleteFinancialForecast = useMutation({
    mutationFn: async (id: number) => {
      await financialForecastService.delete(id.toString());
    },
    onSuccess: async () =>
      await queryClient.invalidateQueries({
        queryKey: ["loadAllFinancialForecasts"],
      }),
    onError: (e) => messageApi.error("Kustutamine ebaõnnestus: " + e.message),
  });

  return (
    <>
      {contextHolder}
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
                        </Link>
                      }
                      description={
                        <>
                          Krediiti müügi osakaal käibest:{" "}
                          {getPercents(forecast.sellingInCreditRate ?? 0)}
                        </>
                      }
                    />
                    <Row>
                      <Space>
                        <Col>
                          <Link to={`/forecasts/${forecast.id}`}>
                            <Button>Ava</Button>
                          </Link>
                        </Col>
                        <Col>|</Col>
                        <Col>
                          <DeleteOutlined
                            className={"delete"}
                            onClick={() =>
                              deleteFinancialForecast.mutate(forecast.id ?? 0)
                            }
                          />
                        </Col>
                      </Space>
                    </Row>
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
