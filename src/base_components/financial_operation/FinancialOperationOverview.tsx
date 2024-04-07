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
import {FinancialOperationSubtype} from "../../enums/FinancialOperationSubtype";
import {useState} from "react";
import FinancialOperationCategoryTable from "./FinancialOperationCategoryTable";
import {FinancialOperation} from "../../domain/FinancialOperation";
import {FinancialOperationCategory} from "../../dto/FinancialOperationCategory";
import FinancialOperationFormModal from "./FinancialOperationFormModal";
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

  const onSwitchChange = (checked: boolean) => setShowEmpty(checked);

  const filterEmptyCategories = () => {
    const subtypesWithOperations = props.financialOperations?.map((operation) =>
        parseToFinancialOperationSubtype(operation.subtype ?? ""),
    );
    return showEmpty
        ? props.financialOperationCategoryList
        : props.financialOperationCategoryList.filter((operationCategory) =>
            operationCategory.acceptedFinancialOperationSubtypes.some(
                (operationSubtype) =>
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
          extra: props.financialOperationType ? (
              <FinancialOperationFormModal
                  financialOperationType={props.financialOperationType}
                  forecastId={props.forecastId}
                  financialOperations={props.financialOperations ?? []}
                  acceptedFinancialOperationSubtypes={
                    financialOperationCategory.acceptedFinancialOperationSubtypes
                    .filter(opType =>
                        opType !== FinancialOperationSubtype.UNEMPLOYMENT_INSURANCE_TAX &&
                        opType !== FinancialOperationSubtype.SOCIAL_TAX)
                  }
                  financialOperationCategory={financialOperationCategory.name}
              />
          ) : (
              ""
          ),
          label: (
              <>
                <h2 style={{display: "inline"}}>
                  {financialOperationCategory.icon}
                </h2>
                <b style={{marginLeft: "1rem"}}>
                  {financialOperationCategory.name.toUpperCase()}
                </b>
                <span style={{marginLeft: "1rem "}}>
              {getFinancialOperationByCategory(
                  props.financialOperations,
                  financialOperationCategory,
              )?.length === 0 && <Tag color="red">Tühi</Tag>}
            </span>
              </>
          ),
          children: (
              <>
                <FinancialOperationCategoryTable
                    financialOperationType={props.financialOperationType}
                    forecastId={props.forecastId}
                    financialOperations={
                        getFinancialOperationByCategory(
                            props.financialOperations,
                            financialOperationCategory,
                        ) ?? []
                    }
                    latestYear={props.latestYear}
                />
              </>
          ),
        };
      },
  ) as CollapseProps["items"];

  return (
      <>
        <Row>
          <Col>
            <h2>{props.title}</h2>
          </Col>
        </Row>

        <Row>
          <Col>
            {props.financialOperationType !== null && <Alert style={{marginBottom: "1rem"}}
                   type="info"
                   message="Aasta andmete muutmiseks klõpsake numbrile. Aasta lisamiseks lisage vastava aasta andmed vähemalt ühe toote alla."
                   closable
                   showIcon
            />}
          </Col>
        </Row>

        <Row>
          <Space size="large">
          <Col>
            <ButtonGroup>
              {openPanels.length <
                  props.financialOperationCategoryList.length && (
                      <Button
                          size="small"
                          type="default"
                          onClick={() =>
                              setOpenPanels(
                                  props.financialOperationCategoryList.map((ec) => ec.name),
                              )
                          }
                      >
                        Ava kõik tabelid
                      </Button>
                  )}
              {openPanels.length > 0 && (
                  <Button size="small" onClick={() => setOpenPanels([])} type="dashed">
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

          <br/>

          <Row>
            <Col xs={24} xl={20}>
              <Collapse
                  onChange={setOpenPanels}
                  activeKey={openPanels}
                  items={items}
              />
            </Col>
          </Row>
        </>
        );
        };
        export default FinancialOperationOverview;
