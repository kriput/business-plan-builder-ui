import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { FinancialForecastService } from "../../../services/FinancialForecastService";
import { FinancialForecast } from "../../../domain/FinancialForecast";
import { Button, Col, Divider, Form, Input, Modal, Row } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorResult from "../../../base_components/ErrorResult";
import { CheckCircleOutlined } from "@ant-design/icons";

const FinancialForecastForm = () => {
  const financialForecastService = new FinancialForecastService();
  const [modal, contextHolder] = Modal.useModal();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [input, setInput] = useState({
    id: undefined,
    name: "",
    sellingInCreditRate: 0,
    buildingDeprecationRate: 0,
    equipmentDeprecationRate: 0,
  } as FinancialForecast);

  const handleChange = (target: EventTarget & HTMLInputElement) => {
    setInput({ ...input, [target.name]: target.value });
  };

  const handleRateInput = (target: EventTarget & HTMLInputElement) => {
    if (target.value) {
      const dividedNumber = parseFloat(target.value) / 100 || 0;
      setInput({ ...input, [target.name]: dividedNumber });
    }
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
            <Form name="create_forecast" form={form} layout="vertical">
              <Row justify="center">
                <Col span="8">
                  <Form.Item
                    label="Nimi"
                    name="name"
                    rules={[
                      { required: true, message: "Palun sisestage nimi" },
                    ]}
                  >
                    <Input
                      onChange={(e) => handleChange(e.target)}
                      value={input.name}
                      name="name"
                    />
                  </Form.Item>
                  <Form.Item
                    label="Krediiti müügi osakaal käibest %"
                    name="sellingInCreditRate"
                    rules={[
                      {
                        message: "Number saab olla vahemikus 0 kuni 100",
                        min: 0,
                        max: 100,
                      },
                    ]}
                  >
                    <Input
                      style={{ width: "5rem" }}
                      onChange={(e) => handleRateInput(e.target)}
                      name="sellingInCreditRate"
                      placeholder="0"
                      type="number"
                    />
                  </Form.Item>
                  <Form.Item
                    label="Hoonete amortisatsiooninorm %"
                    name="buildingDeprecationRate"
                    rules={[
                      {
                        min: 0,
                        max: 100,
                        message: "Number saab olla vahemikus 0 kuni 100",
                      },
                    ]}
                  >
                    <Input
                      style={{ width: "5rem" }}
                      onChange={(e) => handleRateInput(e.target)}
                      value={input.buildingDeprecationRate}
                      name="buildingDeprecationRate"
                      placeholder="0"
                      type="number"
                    />
                  </Form.Item>
                  <Form.Item
                    label="Seadmete amortisatsiooninorm %"
                    name="equipmentDeprecationRate"
                    rules={[
                      {
                        min: 0,
                        max: 100,
                        message: "Number saab olla vahemikus 0 kuni 100",
                      },
                    ]}
                  >
                    <Input
                      style={{ width: "5rem" }}
                      onChange={(e) => handleRateInput(e.target)}
                      value={input.equipmentDeprecationRate}
                      name="equipmentDeprecationRate"
                      placeholder="0"
                      type="number"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <Row>
              <Col span="8" />
              <Col span="8">
                <br />
                <Button
                    loading={
                        createFinancialForecast.isPending ||
                        createFinancialForecast.isSuccess
                    }
                    type="primary"
                    onClick={() => createFinancialForecast.mutate(input)}
                >
                  Salvesta
                </Button>
                <Row>
                  <Col span={12}>{contextHolder}</Col>
                </Row>
              </Col>
            </Row>
          </>
        )}

    </>
  );
};

export default FinancialForecastForm;
