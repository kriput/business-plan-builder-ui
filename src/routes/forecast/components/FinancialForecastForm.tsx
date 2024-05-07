import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { FinancialForecastService } from "../../../services/FinancialForecastService";
import { FinancialForecast } from "../../../domain/FinancialForecast";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
} from "antd";
import { useNavigate } from "react-router-dom";
import ErrorResult from "../../../base_components/ErrorResult";
import { CheckCircleOutlined } from "@ant-design/icons";

const FinancialForecastForm = () => {
  const financialForecastService = new FinancialForecastService();
  const [modal, contextHolder] = Modal.useModal();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onSubmit = () => {
    const forecast = {
      id: undefined,
      name: form.getFieldValue("name"),
      sellingInCreditRate: form.getFieldValue("sellingInCreditRate"),
    } as FinancialForecast;

    createFinancialForecast.mutate(forecast);
  };

  const createFinancialForecast: UseMutationResult<
    FinancialForecast | undefined,
    Error,
    FinancialForecast
  > = useMutation({
    mutationFn: async (financialForecast: FinancialForecast) => {
      return await financialForecastService.add(financialForecast, "/create");
    },
    onSuccess: (data) => {
      return modal.confirm({
        icon: <CheckCircleOutlined style={{ color: "green" }} />,
        title: "Edukalt salvestatud!",
        onOk: () => navigate(`/forecasts/${data?.id}`),
        okText: "Edasi finantsprognoosi täitma",
        onCancel: () => navigate("/forecasts"),
        cancelText: "Tagasi ülevaate lehele",
        width: "30rem",
      });
    },
  });

  return (
    <>
      <Row justify="center">
        <Col>
          <h1> Uue finantsprognoosi koostamine </h1>
        </Col>
      </Row>

      <Divider dashed />

      {createFinancialForecast.isError && (
        <ErrorResult
          errorMessage={`Salvestamine ebaõnnestus. ${createFinancialForecast.error?.message}`}
          buttonMessage="OK"
          onClick={() => createFinancialForecast.reset()}
        />
      )}

      {!createFinancialForecast.isError &&
        !createFinancialForecast.isSuccess && (
          <>
            {contextHolder}
            <Form
              size="large"
              name="create_forecast"
              form={form}
              onFinish={onSubmit}
              layout="vertical"
            >
              <Row justify="center">
                <Col span="8">
                  <Form.Item
                    label="Nimi"
                    name="name"
                    rules={[
                      { required: true, message: "Palun sisestage nimi" },
                    ]}
                  >
                    <Input name="name" />
                  </Form.Item>
                  <Form.Item
                    label="Krediiti müügi osakaal käibest %"
                    name="sellingInCreditRate"
                    rules={[
                      {
                        message: "Number saab olla vahemikus 0 kuni 100",
                        type: "number",
                        min: 0,
                        max: 100,
                      },
                    ]}
                  >
                    <InputNumber
                      style={{ width: "5rem" }}
                      name="sellingInCreditRate"
                      placeholder="0"
                      type="number"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col span="8" />
                <Col span="8">
                  <br />
                  <Button
                    htmlType="submit"
                    loading={
                      createFinancialForecast.isPending ||
                      createFinancialForecast.isSuccess
                    }
                    type="primary"
                  >
                    Salvesta
                  </Button>
                </Col>
              </Row>
            </Form>
          </>
        )}
    </>
  );
};

export default FinancialForecastForm;
