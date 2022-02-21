import React, { useContext, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { toHumanFriendlyCurrency, toReadableNumber } from "../utils";
import { COLORS } from "../../CONSTANTS";
import { NWContext } from "./NWContext";
import {
  doesExceedRisk,
  getRiskAttributes,
  getRiskAttributesByProfile,
  getTooltipDesc,
} from "./nwutils";
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
    totalNPSGFixed,
    totalNPSCFixed,
    totalVehicles,
    totalOthers,
    totalPGold,
    totalAngel,
    totalP2P,
    totalNPSEquity,
    selectedCurrency,
    totalSavings,
    totalLendings,
    totalLiquidFunds,
    totalLtdep,
    totalPPF,
    totalEPF,
    totalVPF,
    loadingInstruments,
    riskTotals,
  }: any = useContext(NWContext);
  const { userInfo }: any = useContext(AppContext);
  const riskAttributes: any = getRiskAttributes();
  const [data, setData] = useState<Array<any>>([]);
  const [excessRiskPercent, setExcessRiskPercent] = useState<number>(0);

  const buildDataItem = (risk: string, val: number) => {
    return {
      risk,
      value: (val * 100) / (totalAssets - totalVehicles),
    };
  };

  const getRiskTotal = (risk: RiskProfile) => {
    let total = 0;
    let totals = Object.keys(riskTotals[risk]);
    totals.forEach((rt: string) => {
      if (riskTotals[risk][rt]) total += riskTotals[risk][rt];
    });
    return total;
  };

  useEffect(() => {
    let data: Array<any> = [];
    const vcVal =
      totalCash -
      totalLiquidFunds +
      totalProperties +
      totalPGold +
      totalFGold +
      totalNPSGFixed +
      getRiskTotal(RiskProfile.VC);
    const cVal =
      totalPM - totalPGold + totalNPSCFixed + getRiskTotal(RiskProfile.C);
    const mVal = getRiskTotal(RiskProfile.M);
    const hVal = totalOthers + totalP2P + getRiskTotal(RiskProfile.A);
    const vhVal = totalAngel + totalCrypto + getRiskTotal(RiskProfile.VA);
    if (vcVal) data.push(buildDataItem(RiskProfile.VC, vcVal));
    if (cVal) data.push(buildDataItem(RiskProfile.C, cVal));
    if (mVal) data.push(buildDataItem(RiskProfile.M, mVal));
    if (hVal) data.push(buildDataItem(RiskProfile.A, hVal));
    if (vhVal) data.push(buildDataItem(RiskProfile.VA, vhVal));
    setData([...data]);
  }, [
    totalNPSEquity,
    totalNPSGFixed,
    totalNPSCFixed,
    totalAngel,
    totalCrypto,
    totalP2P,
    totalOthers,
    totalCash,
    totalProperties,
    totalPGold,
    totalFGold,
    totalPM,
    totalLiquidFunds,
    riskTotals,
  ]);

  const calculateRiskAppetite = () => {
    let total = 0;
    data.map((item: { risk: RiskProfile; value: number }) => {
      if (doesExceedRisk(item.risk, userInfo.rp)) total += item.value;
    });
    setExcessRiskPercent(total);
  };

  const breakdownRiskInfo = (risk: RiskProfile) => {
    if (risk === RiskProfile.VC)
      return getTooltipDesc(
        {
          Savings: totalSavings,
          Deposits: totalLendings,
          "Long-term Schemes": totalLtdep,
          Properties: totalProperties,
          "Physical Gold": totalPGold,
          "Gold Bonds": totalFGold,
          PPF: totalPPF,
          "Employee PF": totalEPF,
          "Voluntary PF": totalVPF,
          "NPS Government Bond Schemes": totalNPSGFixed,
        },
        selectedCurrency,
        totalAssets,
        riskTotals[RiskProfile.VC]
      );
    if (risk === RiskProfile.C)
      return getTooltipDesc(
        {
          "Precious Metals": totalPM - totalPGold,
          "NPS Corporate Bond Schemes": totalNPSCFixed,
        },
        selectedCurrency,
        totalAssets,
        riskTotals[RiskProfile.C]
      );
    if (risk === RiskProfile.M)
      return getTooltipDesc(
        {
          "NPS Equity Schemes": totalNPSEquity,
        },
        selectedCurrency,
        totalAssets,
        riskTotals[RiskProfile.M]
      );
    if (risk === RiskProfile.A)
      return getTooltipDesc(
        {
          "Memberships & Collections": totalOthers,
          "P2P Lending": totalP2P,
        },
        selectedCurrency,
        totalAssets,
        riskTotals[RiskProfile.A]
      );
    if (risk === RiskProfile.VA)
      return getTooltipDesc(
        {
          "Start-up Investments": totalAngel,
          Crypto: totalCrypto,
        },
        selectedCurrency,
        totalAssets,
        riskTotals[RiskProfile.VA]
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
                  getRiskAttributesByProfile(userInfo?.rp).label
                }, current allocation includes ${toReadableNumber(
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
