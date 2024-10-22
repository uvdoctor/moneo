import React, { useState, useEffect, useContext } from "react";
import dynamic from "next/dynamic";
import {
  getCommonMeta,
  getCommonXAxis,
  getCommonYAxis,
  getDefaultSliderProps,
} from "../chartutils";
import { Row, Col } from "antd";
import { COLORS } from "../../CONSTANTS";
import { isMobileDevice, toHumanFriendlyCurrency } from "../utils";
import { useFullScreenBrowser } from "react-browser-hooks";
import { NWContext } from "./NWContext";
import { AppContext } from "../AppContext";
import { calculateInsurance } from "./valuationutils";
import { doesHoldingMatch, getInsuranceType } from "./nwutils";

const ColumnChart = dynamic(() => import("bizcharts/lib/plots/ColumnChart"), {
  ssr: false,
});
const Slider = dynamic(() => import("bizcharts/lib/components/Slider"), {
  ssr: false,
});

export default function InsuranceCFChart() {
  const { selectedCurrency, insurance, selectedMembers, lifeExpectancy }: any =
    useContext(NWContext);
  const { userInfo }: any = useContext(AppContext);
  const fsb = useFullScreenBrowser();
  const [data, setData] = useState<Array<any>>([]);
  const currency = selectedCurrency;

  useEffect(() => {
    let data: Array<any> = [];
    if (!insurance.length) return;
    for (let holding of insurance) {
      if (doesHoldingMatch(holding, selectedMembers, selectedCurrency)) {
        const { cashflows, subt } = calculateInsurance(
          holding,
          lifeExpectancy,
          userInfo?.dob
        );
        let year = new Date().getFullYear();
        for (let ind = 0; ind < cashflows.length; ind++) {
          data.push({
            year: year,
            value: cashflows[ind],
            // @ts-ignore
            name: getInsuranceType()[subt as string],
          });
          year++;
        }
      }
    }
    setData([...data]);
  }, [insurance, userInfo, selectedMembers, selectedCurrency]);

  const getColumnColor = (name: string) => {
    const { H, L, V, O, P, A } = getInsuranceType();
    switch (name) {
      case H:
        return COLORS.BLUE;
      case L:
        return COLORS.ORANGE;
      case V:
        return COLORS.GREEN;
      case O:
        return "#ffa698";
      case P:
        return "#7cd9fd";
      case A:
        return "#e78284";
    }
  };

  return (
    <Row>
      <Col span={24} style={{ minHeight: "400px" }}>
        <ColumnChart
          data={data}
          xField="year"
          yField="value"
          seriesField="name"
          yAxis={getCommonYAxis(!isMobileDevice(fsb))}
          xAxis={getCommonXAxis("Year")}
          meta={getCommonMeta(currency)}
          legend={{ position: "top" }}
          //@ts-ignore
          color={(column: any) => getColumnColor(column.name)}
          isStack={true}
          tooltip={{
            visible: true,
            formatter: ({ value, name }: any) => {
              return {
                name: `${name} Premium`,
                value: toHumanFriendlyCurrency(Math.abs(value), currency),
              };
            },
          }}>
          <Slider {...getDefaultSliderProps()} />
        </ColumnChart>
      </Col>
    </Row>
  );
}
