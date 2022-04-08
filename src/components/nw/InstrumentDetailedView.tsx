import { Button, Col, Dropdown, Menu, Radio, Row } from "antd";
import MenuItem from "antd/lib/menu/MenuItem";
import React, { useState } from "react";
import { InstrumentInput } from "../../api/goals";
import { COLORS } from "../../CONSTANTS";
import LabelWithTooltip from "../form/LabelWithTooltip";
import PurchaseView from "./PurchaseView";

interface InstrumentDetailedViewProps {
  record: InstrumentInput;
}

export default function InstrumentDetailedView({
  record,
}: InstrumentDetailedViewProps) {
  const [view, setView] = useState<string>("Purchase");
  const [purOption, setPurOption] = useState<string>("avg");

  return (
    <Row justify="center" gutter={[0, 8]}>
      <Radio.Group
        defaultValue={view}
        value={view}
        onChange={(e) => setView(e.target.value)}>
        <Radio.Button key="Purchase" value="Purchase">
          <Dropdown
            overlay={
              <Menu>
                <MenuItem key="avg" onClick={() => setPurOption("avg")}>
                  <LabelWithTooltip
                    label="Average price"
                    info="Get a highly approximate performance figure by entering average price of all the purchases done"
                  />
                </MenuItem>
                <MenuItem key="details" onClick={() => setPurOption("details")}>
                  <LabelWithTooltip
                    label="Buy transactions"
                    info="Get a much more accurate performance figure by entering all relevant buy transactions"
                  />
                </MenuItem>
              </Menu>
            }
            onVisibleChange={() => setView("Purchase")}>
            <Button
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: view === "Purchase" ? COLORS.WHITE : COLORS.DEFAULT,
              }}>
              Purchase Input
            </Button>
          </Dropdown>
        </Radio.Button>
        <Radio.Button key="Analysis" value="Analysis">
          Analysis
        </Radio.Button>
      </Radio.Group>
      {view === "Purchase" ? (
        <Col xs={24}>
          <PurchaseView
            record={record}
            isAvgPriceRecord={purOption === "avg"}
          />
        </Col>
      ) : (
        <></>
      )}
    </Row>
  );
}
