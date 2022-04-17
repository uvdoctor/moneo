import { Col, Row } from "antd";
import React, { useContext } from "react";
import { ROUTES } from "../../CONSTANTS";
import { AppContext } from "../AppContext";
import ItemDisplay from "../calc/ItemDisplay";
import { DBContext } from "./DBContext";

export default function GetResult() {
  const { totalAssets, totalLiabilities }: any = useContext(DBContext);
  const { defaultCurrency }: any = useContext(AppContext);
  return (
    <Row>
      <Col span={24}>
        <ItemDisplay
          label="Net Worth"
          result={totalAssets - totalLiabilities}
          currency={defaultCurrency}
          pl
          info={"Net Worth equals what you own minus what you owe."}
        />
        {!totalAssets && !totalLiabilities ? (
          <a href={ROUTES.GET}>Discover your networth</a>
        ) : null}
      </Col>
      {totalAssets || totalLiabilities ? (
        <Col xs={12}>
          <ItemDisplay
            label="You Own"
            result={totalAssets}
            currency={defaultCurrency}
            info="This is the total valuation of the assets you own."
            pl
          />
        </Col>
      ) : null}
      {totalAssets || totalLiabilities ? (
        <Col xs={12}>
          <ItemDisplay
            label="You Owe"
            result={-totalLiabilities}
            currency={defaultCurrency}
            info="This is the total valuation of all the money you owe."
            pl
          />
        </Col>
      ) : null}
    </Row>
  );
}
