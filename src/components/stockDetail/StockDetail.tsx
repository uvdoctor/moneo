import { useContext } from "react";
import { Skeleton, Alert } from "antd";
import StockDetailContext from "./StockDetailContext";
import RenderDetails from "./RenderDetails";

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
        state.data && <RenderDetails />
      )}
    </div>
  );
}
