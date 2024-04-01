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
import { FinancialForecast } from "../domain/FinancialForecast";
import { Product } from "../domain/Product";
import ButtonGroup from "antd/es/button/button-group";
import { ExpenseType } from "../enums/ExpenseType";
import { EXPENSE_CATEGORY_LIST } from "./ExpenseCategoryListCreator";
import { useState } from "react";
import ExpenseTypeTable from "./ExpenseTypeTable";
import { Expense } from "../domain/Expense";
import { ExpenseCategory } from "../dto/ExpenseCategory";
import ExpenseFormModal from "./ExpenseFormModal";
import { CalendarOutlined } from "@ant-design/icons";

interface Props {
  financialForecast: FinancialForecast | undefined;
  fetchForecast: Function;
}

export const getExpenseTypeEnumName = (name: string) =>
  ExpenseType[name as keyof typeof ExpenseType];

const getLatestYear = (products: Product[]) => {
  return products.reduce((prev, next) => {
    const maxYearFromProduct = next.productsPerPeriod.reduce(
      (a, b) => Math.max(a, b.year),
      new Date().getFullYear(),
    );
    return Math.max(prev, maxYearFromProduct);
  }, new Date().getFullYear());
};

const ExpensesContainer = (props: Props) => {
  const [openPanels, setOpenPanels] = useState([] as string[] | string);
  const [showEmpty, setShowEmpty] = useState(true);
  const [latestYear, setLatestYear] = useState(
    getLatestYear(props.financialForecast?.products ?? []),
  );
  const [expenses, setExpenses] = useState(props.financialForecast?.expenses);

  const onSwitchChange = (checked: boolean) => setShowEmpty(checked);

  const getFilteredCategories = () => {
    const addedExpenseTypes = props.financialForecast?.expenses?.map(
      (expense) => getExpenseTypeEnumName(expense.type ?? ""),
    );
    return showEmpty
      ? EXPENSE_CATEGORY_LIST
      : EXPENSE_CATEGORY_LIST.filter((expenseCategory) =>
          expenseCategory.acceptedExpenseTypes.some((expenseType) =>
            addedExpenseTypes?.includes(expenseType),
          ),
        );
  };
  const findExpensesForExpenseCategory = (
    expenses: Expense[] | undefined,
    expenseCategory: ExpenseCategory,
  ) => {
    return expenses?.filter((expense) =>
      expenseCategory.acceptedExpenseTypes.includes(
        getExpenseTypeEnumName(expense.type ?? ""),
      ),
    );
  };

  const items: CollapseProps["items"] = getFilteredCategories().map(
    (expenseCategory) => {
      return {
        key: expenseCategory.name,
        extra: (
          <ExpenseFormModal
            setExpenses={setExpenses}
            fetchForecast={props.fetchForecast}
            forecast={props.financialForecast!}
            acceptedExpenseTypes={expenseCategory.acceptedExpenseTypes}
            expenseCategory={expenseCategory.name}
          />
        ),
        label: (
          <>
            <h2 style={{ display: "inline" }}>{expenseCategory.icon}</h2>
            <b style={{ marginLeft: "1rem" }}>
              {expenseCategory.name.toUpperCase()}
            </b>
            <span style={{ marginLeft: "1rem " }}>
              {findExpensesForExpenseCategory(
                props.financialForecast?.expenses,
                expenseCategory,
              )!.length === 0 && <Tag color="red">Tühi</Tag>}
            </span>
          </>
        ),
        children: (
          <>
            <ExpenseTypeTable
              forecastId={props.financialForecast?.id ?? 0}
              fetchForecast={props.fetchForecast}
              expenses={
                findExpensesForExpenseCategory(
                  props.financialForecast?.expenses,
                  expenseCategory,
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
            <h2>Majandustegevuse käigus tekkivad kulud</h2>
          </Col>
          <Col>
            <ButtonGroup>
              {openPanels.length < EXPENSE_CATEGORY_LIST.length && (
                <Button
                  type="default"
                  onClick={() =>
                    setOpenPanels(EXPENSE_CATEGORY_LIST.map((ec) => ec.name))
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
      <Row>
        <Col span={20}>
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
export default ExpensesContainer;
