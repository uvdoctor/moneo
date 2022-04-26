import { Col, Row } from "antd";
import Link from "next/link";
import React, { useContext } from "react";
import { ROUTES } from "../../CONSTANTS";
import { AppContext } from "../AppContext";
import ItemDisplay from "../calc/ItemDisplay";
import { DBContext } from "./DBContext";

export default function GetResult() {
  const { totalAssets, totalLiabilities, holdingsLoaded }: any =
    useContext(DBContext);
  const { defaultCurrency }: any = useContext(AppContext);
  return (
    <Link href={ROUTES.GET}>
      <a>
        <Row>
          <Col span={24}>
            <ItemDisplay
              label="Net Worth"
              result={
                !totalAssets && !totalLiabilities
                  ? "Discover"
                  : totalAssets - totalLiabilities
              }
              currency={defaultCurrency}
              pl={totalAssets || totalLiabilities}
              info={"Net Worth equals what you own minus what you owe."}
              loading={!holdingsLoaded}
            />
          </Col>
          <Col xs={12}>
            <ItemDisplay
              label="You Own"
              result={totalAssets}
              currency={defaultCurrency}
              loading={!holdingsLoaded}
              info="This is the total valuation of the assets you own."
              pl
            />
          </Col>
          <Col xs={12}>
            <ItemDisplay
              label="You Owe"
              result={-totalLiabilities}
              currency={defaultCurrency}
              loading={!holdingsLoaded}
              info="This is the total valuation of all the money you owe."
              pl
            />
          </Col>
        </Row>
      </a>
    </Link>
  );
}
