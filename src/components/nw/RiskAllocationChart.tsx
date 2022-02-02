import React, { useContext, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { toHumanFriendlyCurrency, toReadableNumber } from "../utils";
import { COLORS } from "../../CONSTANTS";
import { NWContext } from "./NWContext";
import { getTooltipDesc } from "./nwutils";
import { RiskProfile } from "../../api/goals";

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
  }: any = useContext(NWContext);
  const riskAttributes: any = {
    [RiskProfile.VC]: { label: "Very low", color: COLORS.GREEN },
    [RiskProfile.C]: { label: "Low", color: "#ffc107" },
    [RiskProfile.M]: { label: "Medium", color: "#ffa698" },
    [RiskProfile.A]: { label: "High", color: COLORS.ORANGE },
    [RiskProfile.VA]: { label: "Very high", color: COLORS.RED },
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
      totalOthers + totalVehicles + totalP2P + totalFInv + totalMultiCap;
    const speculativeVal = totalAngel + totalCrypto;
    if (lowRiskVal) data.push(buildDataItem(RiskProfile.VC, lowRiskVal));
    if (mediumRiskVal) data.push(buildDataItem(RiskProfile.C, mediumRiskVal));
    if (highRiskVal) data.push(buildDataItem(RiskProfile.M, highRiskVal));
    if (veryHighRiskVal)
      data.push(buildDataItem(RiskProfile.A, veryHighRiskVal));
    if (speculativeVal)
      data.push(buildDataItem(RiskProfile.VA, speculativeVal));
    setData([...data]);
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
          Vehicles: totalVehicles,
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
    if (!totalAssets) {
      setData([...[]]);
      return;
    }
    initChartData();
  }, [totalAssets]);

  return (
    <div className="container chart">
      <h3>{`Total allocation of ${toHumanFriendlyCurrency(
        totalAssets,
        selectedCurrency
      )} by risk`}</h3>
      <PieChart
        data={data}
        title={{
          visible: true,
        }}
        meta={{
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
          formatter: (risk) => riskAttributes[risk].label,
        }}
        color={({ risk }: any) => riskAttributes[risk].color}
      />
    </div>
  );
}
