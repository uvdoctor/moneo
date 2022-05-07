import { Button, Card, Divider, Row, Typography } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { ROUTES } from "../../CONSTANTS";
import ItemDisplay from "../calc/ItemDisplay";
import { getAssetName } from "../utils";
import { DBContext } from "./DBContext";

export default function AAList() {
  const { aa }: any = useContext(DBContext);
  const [currentYearAA, setCurrentYearAA] = useState<any>({});
  const [currentAllocationDone, setCurrentAllocationDone] =
    useState<boolean>(false);
  const { Title } = Typography;
  const year = new Date().getFullYear();

  useEffect(() => {
    if (!aa || !Object.keys(aa).length) {
      setCurrentAllocationDone(true);
      return;
    }
    let currentAA: any = {};
    Object.keys(aa).forEach((key: string) => {
      const allocation = aa[key][0];
      if (!allocation) return;
      currentAA[key] = allocation;
    });
    if (Object.keys(currentAA).length) {
      setCurrentYearAA(currentAA);
      setCurrentAllocationDone(true);
    }
  }, [aa]);

  return (
    <>
      <Title level={5}>Where to Invest?</Title>
      <Card
        style={{ width: "100%", height: 600 }}
        title={`Target Asset Allocation for the year ${year}`}
        loading={!currentAllocationDone}>
        {Object.keys(currentYearAA).length ? (
          <div
            id="scrollableDiv"
            style={{
              height: 400,
              overflow: "auto",
            }}>
            {Object.keys(currentYearAA).map((key: string) => (
              <div key={key}>
                <ItemDisplay
                  label={getAssetName(key)}
                  unit="%"
                  result={currentYearAA[key]}
                  noResultFormat
                  labelHighlight
                />
                <Divider />
              </div>
            ))}
          </div>
        ) : (
          <Row justify="center">
            <h3>Define your goals to discover where to invest.</h3>
          </Row>
        )}
        <br />
        <Row justify="center">
          <Button key="more" type="primary" href={ROUTES.SET}>
            {Object.keys(currentYearAA).length
              ? "Set Goals for more accurate allocation"
              : "Define Goals"}
          </Button>
        </Row>
      </Card>
    </>
  );
}
