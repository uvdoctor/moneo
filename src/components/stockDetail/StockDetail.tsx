import { useContext } from "react";
import { Skeleton, Alert, Row, Col, PageHeader } from "antd";
import StockDetailContext from "./StockDetailContext";
import RenderDetails from "./RenderDetails";
import CoachingRequest from "../CoachingRequest";

require("./StockDetail.less");

export default function StockDetail() {
  const { state }: any = useContext(StockDetailContext);

  return (
    <div className="stock-detail">
      {state.isLoading ? (
        <>
          <Skeleton />
          <Skeleton />
        </>
      ) : state.error ? (
        <Alert
          message={state.error.title}
          description="Not found"
          // description={state.error.text}
          type="error"
          showIcon
        />
      ) : (
        state.data && (
          <>
            <Row className="primary-header">
              <Col span={24}>
                <PageHeader
                  title={state.data.General?.name}
                  extra={[<CoachingRequest key="cr" />]}
                />
              </Col>
              <Col span={24} className="secondary-header">
                <Row justify="space-between">
                  <Col>Price</Col>
                  <Col>Quantity owned</Col>
                </Row>
              </Col>
            </Row>
            <RenderDetails />
          </>
        )
      )}
    </div>
  );
}
