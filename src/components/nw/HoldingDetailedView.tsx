import { Button, Col, Dropdown, Menu, Radio, Row } from "antd";
import MenuItem from "antd/lib/menu/MenuItem";
import React, { useContext, useState } from "react";
import { COLORS } from "../../CONSTANTS";
import LabelWithTooltip from "../form/LabelWithTooltip";
import { NWContext } from "./NWContext";
import PurchaseView from "./PurchaseView";

interface HoldingDetailedViewProps {
  record: any;
  others: any;
}

export default function HoldingDetailedView({
  record,
  others,
}: HoldingDetailedViewProps) {
  const { preciousMetals, setPreciousMetals }: any = useContext(NWContext);
  const [view, setView] = useState<string>("Purchase");
  const [isAvgPriceOption, setIsAvgPriceOption] = useState<boolean>(
    !record.pur || !record.pur.length
  );

  return (
    <Row justify="center" gutter={[0, 8]}>
      <Radio.Group
        defaultValue={view}
        value={view}
        onChange={(e) => setView(e.target.value)}
      >
        <Radio.Button key="Purchase" value="Purchase">
          <Dropdown
            overlay={
              record?.pur?.length ? (
                <></>
              ) : (
                <Menu>
                  <MenuItem key="avg" onClick={() => setIsAvgPriceOption(true)}>
                    <LabelWithTooltip
                      label="Average price"
                      info="Get a highly approximate performance figure by entering average price of all the purchases done"
                    />
                  </MenuItem>
                  <MenuItem
                    key="details"
                    onClick={() => setIsAvgPriceOption(false)}
                  >
                    <LabelWithTooltip
                      label="Buy transactions"
                      info="Get a much more accurate performance figure by entering all relevant buy transactions"
                    />
                  </MenuItem>
                </Menu>
              )
            }
            onVisibleChange={() => setView("Purchase")}
          >
            <Button
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: view === "Purchase" ? COLORS.WHITE : COLORS.DEFAULT,
              }}
            >
              Purchase Input
            </Button>
          </Dropdown>
        </Radio.Button>
        <Radio.Button key="Others" value="Others">
          Others
        </Radio.Button>
      </Radio.Group>
      {view === "Purchase" ? (
        <Col xs={24}>
          <PurchaseView
            record={record}
            isAvgPriceRecord={isAvgPriceOption}
            instruments={preciousMetals}
            setInstruments={setPreciousMetals}
            isHolding
          />
        </Col>
      ) : (
        <Col xs={24}>{others}</Col>
      )}
    </Row>
  );
}
