import {
  Alert,
  Button,
  Col,
  Collapse,
  CollapseProps,
  Row,
  Space,
  Switch,
  Tag,
} from "antd";
import ButtonGroup from "antd/es/button/button-group";
import { FinancialOperationSubtype } from "../../enums/FinancialOperationSubtype";
import { useState } from "react";
import FinancialOperationCategoryTable from "./FinancialOperationCategoryTable";
import { FinancialOperation } from "../../domain/FinancialOperation";
import { FinancialOperationCategory } from "../../dto/FinancialOperationCategory";
import FinancialOperationFormModal from "./FinancialOperationFormModal";
import { CalendarOutlined } from "@ant-design/icons";
import SimpleTotalPerPeriodTable from "./SimpleTotalPerPeriodTable";
import {
  countVATForPeriod,
  getTotalsPerPeriod,
} from "../../routes/forecast/container/FinancialForecastContainer";
import {FinancialOperationType} from "../../enums/FinancialOperationType";

interface Props {
  forecastId: number;
  latestYear: number;
  financialOperations: FinancialOperation[];
  title: string;
  financialOperationCategoryList: FinancialOperationCategory[];
  financialOperationType: FinancialOperationType | null;
}

export const parseToFinancialOperationSubtype = (name: string) =>
  FinancialOperationSubtype[name as keyof typeof FinancialOperationSubtype];

const FinancialOperationOverview = (props: Props) => {
  const [openPanels, setOpenPanels] = useState([] as string[] | string);
  const [showEmpty, setShowEmpty] = useState(true);
  const [latestYear, setLatestYear] = useState(props.latestYear);

  const onSwitchChange = (checked: boolean) => setShowEmpty(checked);

  const filterEmptyCategories = () => {
    const subtypesWithOperations = props.financialOperations?.map((operation) =>
      parseToFinancialOperationSubtype(operation.subtype ?? ""),
    );
    return showEmpty
      ? props.financialOperationCategoryList
      : props.financialOperationCategoryList.filter((operationCategory) =>
          operationCategory.acceptedFinancialOperationSubtypes.some((operationSubtype) =>
            subtypesWithOperations?.includes(operationSubtype),
          ),
        );
  };
  const getFinancialOperationByCategory = (
    financialOperations: FinancialOperation[] | undefined,
    financialOperationCategory: FinancialOperationCategory,
  ) => {
    return financialOperations?.filter((operation) =>
      financialOperationCategory.acceptedFinancialOperationSubtypes.includes(
        parseToFinancialOperationSubtype(operation.subtype ?? ""),
      ),
    );
  };

  const items: CollapseProps["items"] = filterEmptyCategories().map(
    (financialOperationCategory) => {
      return {
        key: financialOperationCategory.name,
        extra: (props.financialOperationType ?
          <FinancialOperationFormModal
            financialOperationType={props.financialOperationType}
            forecastId={props.forecastId}
            financialOperations={props.financialOperations ?? []}
            acceptedFinancialOperationSubtypes={financialOperationCategory.acceptedFinancialOperationSubtypes}
            financialOperationCategory={financialOperationCategory.name}
          /> : ""
        ),
        label: (
          <>
            <h2 style={{ display: "inline" }}>{financialOperationCategory.icon}</h2>
            <b style={{ marginLeft: "1rem" }}>
              {financialOperationCategory.name.toUpperCase()}
            </b>
            <span style={{ marginLeft: "1rem " }}>
              {getFinancialOperationByCategory(props.financialOperations, financialOperationCategory)
                ?.length === 0 && <Tag color="red">Tühi</Tag>}
            </span>
          </>
        ),
        children: (
          <>
            <FinancialOperationCategoryTable
              forecastId={props.forecastId}
              financialOperations={
                getFinancialOperationByCategory(
                  props.financialOperations,
                  financialOperationCategory,
                ) ?? []
              }
              latestYear={latestYear}
            />
          </>
        ),
      };
    },
  ) as CollapseProps["items"];


  return (
    <>
      <Row>
        <Space size="large">
          <Col>
            <h2>{props.title}</h2>
          </Col>
          <Col>
            <ButtonGroup>
              {openPanels.length < props.financialOperationCategoryList.length && (
                <Button
                  type="default"
                  onClick={() =>
                    setOpenPanels(props.financialOperationCategoryList.map((ec) => ec.name))
                  }
                >
                  Ava kõik tabelid
                </Button>
              )}
              {openPanels.length > 0 && (
                <Button onClick={() => setOpenPanels([])} type="dashed">
                  Peida kõik tabelida
                </Button>
              )}
            </ButtonGroup>
          </Col>
          <Col>
            <Switch
              onChange={onSwitchChange}
              checkedChildren="Näita tühjad"
              unCheckedChildren="Peida tühjad"
              defaultChecked
            />
          </Col>
        </Space>
      </Row>
      <Row>
        <Space size="large">
          <Col>
            <Button
              onClick={() => setLatestYear(latestYear + 1)}
              size="large"
              type="dashed"
            >
              <CalendarOutlined /> Lisa veerg<b> {latestYear + 1}</b>
            </Button>
          </Col>
          <Col>
            <Alert
              type="info"
              message="Aasta andmete muutmiseks klõpsake numbrile "
              closable
              showIcon
            />
          </Col>
        </Space>
      </Row>

      <br />

        <>
          <Row>
            <Col span={20}>
              <Collapse
                onChange={setOpenPanels}
                activeKey={openPanels}
                items={items}
              />
            </Col>
          </Row>
          <Row>
            <Col span={20}>
              <Tag style={{ width: "100%" }} color="red">
                <h3>Kuludelt makstav käibemaks: </h3>
                <SimpleTotalPerPeriodTable
                  addFirstBlank={true}
                  latestYear={latestYear}
                  totalsPerPeriod={
                    getTotalsPerPeriod(props.financialOperations)
                  }
                  dataProcessor={countVATForPeriod}
                />
              </Tag>
            </Col>
          </Row>
        </>
    </>
  );
};
export default FinancialOperationOverview;