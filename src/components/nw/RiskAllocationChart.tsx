import React, { useContext, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  getRiskProfileOptions,
  toHumanFriendlyCurrency,
  toReadableNumber,
} from "../utils";
import { COLORS } from "../../CONSTANTS";
import { NWContext } from "./NWContext";
import { getTooltipDesc } from "./nwutils";
import { RiskProfile } from "../../api/goals";
import { AppContext } from "../AppContext";
import LabelWithTooltip from "../form/LabelWithTooltip";
import { Col, Empty, Row, Skeleton } from "antd";

const PieChart = dynamic(() => import("bizcharts/lib/plots/PieChart"), {
  ssr: false,
});

export default function RiskAllocationChart() {
  const {
    totalCash,
    totalProperties,
    totalCrypto,
    totalAssets,
    totalFGold,
    totalPM,
    totalNPSFixed,
    totalFRE,
    totalVehicles,
    totalOthers,
    totalPGold,
    totalAngel,
    totalFEquity,
    totalP2P,
    totalNPSEquity,
    selectedCurrency,
    totalFFixed,
    totalMultiCap,
    totalFInv,
    totalSavings,
    totalLendings,
    totalLiquidFunds,
    totalLtdep,
    totalBonds,
    totalLargeCapFunds,
    totalLargeCapStocks,
    totalStocks,
    totalETFs,
    totalPPF,
    totalEPF,
    totalVPF,
    loadingInstruments,
  }: any = useContext(NWContext);
  const { userInfo }: any = useContext(AppContext);
  const riskAttributes: any = {
    [RiskProfile.VC]: { label: "Very low", color: COLORS.GREEN, rating: 1 },
    [RiskProfile.C]: { label: "Low", color: "#ffc107", rating: 2 },
    [RiskProfile.M]: { label: "Medium", color: "#ffa698", rating: 3 },
    [RiskProfile.A]: { label: "High", color: COLORS.ORANGE, rating: 4 },
    [RiskProfile.VA]: { label: "Very high", color: COLORS.RED, rating: 5 },
  };
  const [data, setData] = useState<Array<any>>([]);
  const [excessRiskPercent, setExcessRiskPercent] = useState<number>(0);
  const riskProfileOptions: any = getRiskProfileOptions();

  const buildDataItem = (risk: string, val: number) => {
    return {
      risk,
      value: (val * 100) / (totalAssets - totalVehicles),
    };
  };

  useEffect(() => {
    let data: Array<any> = [];
    const vcVal = totalCash + totalProperties + totalPGold + totalFGold;
    const cVal =
      totalPM -
      totalPGold +
      (totalFFixed - totalLiquidFunds) +
      totalNPSFixed +
      totalFRE;
    const mVal = totalFEquity - totalMultiCap + totalNPSEquity;
    const hVal = totalOthers + totalP2P + totalFInv + totalMultiCap;
    const vhVal = totalAngel + totalCrypto;
    if (vcVal) data.push(buildDataItem(RiskProfile.VC, vcVal));
    if (cVal) data.push(buildDataItem(RiskProfile.C, cVal));
    if (mVal) data.push(buildDataItem(RiskProfile.M, mVal));
    if (hVal) data.push(buildDataItem(RiskProfile.A, hVal));
    if (vhVal) data.push(buildDataItem(RiskProfile.VA, vhVal));
    setData([...data]);
  }, [
    totalFEquity,
    totalMultiCap,
    totalNPSEquity,
    totalNPSFixed,
    totalAngel,
    totalCrypto,
    totalFInv,
    totalCrypto,
    totalP2P,
    totalOthers,
    totalCash,
    totalProperties,
    totalPGold,
    totalFGold,
    totalPM,
    totalLiquidFunds,
    totalFRE,
    totalFFixed,
  ]);

  const calculateRiskAppetite = () => {
    let total = 0;
    data.map((item: { risk: string; value: number }) => {
      const riskProfile = riskAttributes[userInfo?.rp].rating;
      const allocation = riskAttributes[item.risk].rating;
      if (allocation > riskProfile) total += item.value;
    });
    setExcessRiskPercent(total);
  };

  const breakdownRiskInfo = (risk: string) => {
    if (risk === RiskProfile.VC)
      return getTooltipDesc(
        {
          Savings: totalSavings,
          Deposits: totalLendings,
          "Long-term Schemes": totalLtdep,
          "Liquid Funds": totalLiquidFunds,
          Properties: totalProperties,
          "Physical Gold": totalPGold,
          "Gold Bonds": totalFGold,
          PPF: totalPPF,
          "Employee PF": totalEPF,
          "Voluntary PF": totalVPF,
        },
        selectedCurrency,
        totalAssets
      );
    if (risk === RiskProfile.C)
      return getTooltipDesc(
        {
          "Precious Metals": totalPM - totalPGold,
          Bonds: totalBonds,
          "Fixed Income Funds": totalFFixed - totalBonds - totalLiquidFunds,
          "NPS Bond Schemes": totalNPSFixed,
          REITs: totalFRE,
        },
        selectedCurrency,
        totalAssets
      );
    if (risk === RiskProfile.M)
      return getTooltipDesc(
        {
          "Large-cap Stocks": totalLargeCapStocks,
          "Large-cap Mutual Funds": totalLargeCapFunds,
          ETFs: totalETFs,
          "NPS Equity Schemes": totalNPSEquity,
        },
        selectedCurrency,
        totalAssets
      );
    if (risk === RiskProfile.A)
      return getTooltipDesc(
        {
          "Multi-cap Stocks": totalStocks - totalLargeCapStocks,
          "Multi-cap Mutual Funds":
            totalMultiCap - (totalStocks - totalLargeCapStocks),
          "Memberships & Collections": totalOthers,
          "P2P Lending": totalP2P,
          "Other Investment Trusts": totalFInv,
        },
        selectedCurrency,
        totalAssets
      );
    if (risk === RiskProfile.VA)
      return getTooltipDesc(
        {
          "Start-up Investments": totalAngel,
          Crypto: totalCrypto,
        },
        selectedCurrency,
        totalAssets
      );
    return "";
  };

  useEffect(() => {
    if (!userInfo || !data.length) {
      setExcessRiskPercent(0);
      return;
    }
    calculateRiskAppetite();
  }, [data, userInfo]);

  return loadingInstruments ? (
    <Skeleton active />
  ) : data.length ? (
    <Row align="middle" className="container chart">
      <Col xs={24} md={12}>
        <Row justify="center">
          <h3>{`Total allocation of ${toHumanFriendlyCurrency(
            totalAssets,
            selectedCurrency
          )} by risk`}</h3>
        </Row>
        {excessRiskPercent ? (
          <Row justify="center">
            <h3 style={{ color: COLORS.RED }}>
              <LabelWithTooltip
                label={`${toReadableNumber(
                  excessRiskPercent,
                  2
                )}% of assets have higher risk `}
                // @ts-ignore
                info={`Given that you can tolerate ${
                  riskProfileOptions[userInfo?.rp]
                } loss, your risk profile is 
				${
          riskAttributes[userInfo?.rp].label
        }. Current allocation includes ${toReadableNumber(
                  excessRiskPercent,
                  2
                )}% of assets with higher risk.`}
              />
            </h3>
          </Row>
        ) : null}
      </Col>
      <Col style={{ minWidth: 400 }}>
        <PieChart
          data={data}
          title={{
            visible: true,
          }}
          meta={{
            risk: {
              formatter: (v: any) =>
                riskAttributes[v] ? riskAttributes[v].label : "",
            },
            value: {
              formatter: (v: any) => {
                const riskData = data.find((item) => item.value === v);
                return v
                  ? `<b>${toHumanFriendlyCurrency(
                      (v * totalAssets) / 100,
                      selectedCurrency
                    )}</b> (${toReadableNumber(v, 2)}%)${breakdownRiskInfo(
                      riskData.risk
                    )}`
                  : "";
              },
            },
          }}
          label={{
            visible: true,
            type: "outer",
            autoRotate: false,
            formatter: (angleField) =>
              `${toReadableNumber(angleField.value, 2)}%`,
            style: {
              fontFamily: "'Jost', sans-serif",
              fontSize: 14,
              fill: COLORS.DEFAULT,
            },
          }}
          autoFit
          interactions={[
            {
              type: "zoom",
              enable: false,
            },
          ]}
          angleField="value"
          colorField="risk"
          legend={{
            position: "top",
          }}
          color={({ risk }: any) =>
            riskAttributes[risk] ? riskAttributes[risk].color : COLORS.DEFAULT
          }
        />
      </Col>
    </Row>
  ) : (
    <Empty />
  );
}
