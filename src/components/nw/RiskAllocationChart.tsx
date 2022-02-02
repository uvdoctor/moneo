import React, { useContext, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { toHumanFriendlyCurrency, toReadableNumber } from "../utils";
import { COLORS } from "../../CONSTANTS";
import { NWContext } from "./NWContext";

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
    totalInv,
    totalLiquidFunds,
  }: any = useContext(NWContext);
  const LOW_RISK = "Low risk";
  const MED_RISK = "Medium risk";
  const HIGH_RISK = "High risk";
  const VH_RISK = "Very high risk";
  const SPECULATIVE = "Gamble";
  const riskColors: any = {
    [LOW_RISK]: COLORS.GREEN,
    [MED_RISK]: COLORS.BLUE,
    [HIGH_RISK]: COLORS.ORANGE,
    [VH_RISK]: "#ffab00",
    [SPECULATIVE]: COLORS.RED,
  };
  const [data, setData] = useState<Array<any>>([]);

  const buildDataItem = (risk: string, val: number) => {
    return {
      risk,
      value: (val * 100) / totalAssets,
    };
  };

  const initChartData = () => {
    let data: Array<any> = [];
    const lowRiskVal = totalCash + totalProperties + totalPGold + totalFGold;
    const mediumRiskVal =
      totalPM -
      totalPGold +
      (totalFFixed - totalLiquidFunds) +
      totalNPSFixed +
      totalFRE;
    const highRiskVal = totalFEquity - totalMultiCap + totalNPSEquity;
    const veryHighRiskVal =
      totalOthers + totalVehicles + totalP2P + totalInv + totalMultiCap;
    const speculativeVal = totalAngel + totalCrypto;
    if (lowRiskVal) data.push(buildDataItem(LOW_RISK, lowRiskVal));
    if (mediumRiskVal) data.push(buildDataItem(MED_RISK, mediumRiskVal));
    if (highRiskVal) data.push(buildDataItem(HIGH_RISK, highRiskVal));
    if (veryHighRiskVal) data.push(buildDataItem(VH_RISK, veryHighRiskVal));
    if (speculativeVal) data.push(buildDataItem(SPECULATIVE, speculativeVal));
    setData([...data]);
  };

  useEffect(() => {
    if (!totalAssets) {
      setData([...[]]);
      return;
    }
    initChartData();
  }, [totalAssets]);

  return (
    <div className="container chart">
      <h3>
        {`Total allocation of ${toHumanFriendlyCurrency(
          totalAssets,
          selectedCurrency
        )} by risk`}
      </h3>
      <PieChart
        data={data}
        title={{
          visible: true,
        }}
        meta={{
          value: {
            formatter: (v: any) =>
              `${toHumanFriendlyCurrency(
                (v * totalAssets) / 100,
                selectedCurrency
              )} (${toReadableNumber(v, 2)}%)`,
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
        legend={{ position: "top" }}
        color={({ risk }: any) => riskColors[risk]}
      />
    </div>
  );
}
