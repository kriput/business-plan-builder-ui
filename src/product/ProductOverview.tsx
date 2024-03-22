import { FinancialForecast } from "../domain/FinancialForecast";
import { Badge, Button, Col, Collapse, Divider, Empty, Row } from "antd";
import { Product } from "../domain/Product";
import { getPercents } from "../forecast/container/FinancialForecastContainer";
import { useEffect, useState } from "react";
import ProductForm from "./ProductForm";

interface Props {
  financialForecast: FinancialForecast | undefined;
  fetchForecast: Function;
}

const ProductOverview = (props: Props) => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(
      () => setIsFormOpen(false),
      [props.financialForecast]
  )

  return (
    <>
      <Row justify="center">
        <Col>
          <h2>
            <b> Tooted </b>
          </h2>
        </Col>
      </Row>
      {!isFormOpen && (
        <Row justify="center">
          <Button onClick={() => setIsFormOpen(true)}>+ Lisa toode</Button>
        </Row>
      )}
      {isFormOpen && (
        <>
          <Row justify='center'>
            <Button danger onClick={() => setIsFormOpen(false)}>
              Tagasi
            </Button>
          </Row>
          <br/>
          <Row justify='center'>
            <ProductForm fetchForecast={props.fetchForecast} id={props.financialForecast?.id}/>
          </Row>
        </>
      )}

      <Divider dashed />

      {props.financialForecast?.products?.length === 0 && (
        <>
          <br />
          <Row justify="center">
            <div>
              <Empty />
            </div>
          </Row>
        </>
      )}

      <Collapse>
        {props.financialForecast?.products?.length !== 0 &&
          props.financialForecast?.products?.map((product: Product, index) => (
            <Collapse.Panel
              key={index}
              header={
                <Row justify="space-between">
                  <Col>
                    <b>{product.name}</b>
                  </Col>
                  <Col>
                    <Badge
                      color="green"
                      count={"Käibemaks: " + getPercents(product.tax)}
                    />
                  </Col>
                  <Col>
                    <Badge
                      color="orange"
                      count={
                        "Keskmine laovaru vajadus: " +
                        getPercents(product.stockReserveRate)
                      }
                    />
                  </Col>
                </Row>
              }
            >
              {product.unit}
            </Collapse.Panel>
          ))
          .sort().reverse()}
      </Collapse>
    </>
  );
};

export default ProductOverview;
