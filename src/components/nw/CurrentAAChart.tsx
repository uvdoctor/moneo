import { Empty } from "antd";
import dynamic from "next/dynamic";
import React, { useContext, useEffect, useState } from "react";
import { COLORS } from "../../CONSTANTS";
import CashAA from "../goals/CashAA";
import { toHumanFriendlyCurrency, toReadableNumber } from "../utils";
import { NWContext } from "./NWContext";

const TreemapChart = dynamic(() => import("bizcharts/lib/plots/TreemapChart"), {
  ssr: false,
});

export default function CurrentAAChart() {
  const {
    totalCash,
    totalSavings,
    totalAlternative,
    totalLendings,
    totalFGold,
    totalPGold,
    totalFRE,
    totalFInv,
    totalProperties,
    selectedCurrency,
    totalAssets,
    totalAngel,
    totalOthers,
    totalVehicles,
    totalPF,
    totalOtherProperty,
    totalCommercial,
    totalResidential,
    totalPlot,
    totalEPF,
    totalVPF,
    totalPPF,
    totalNPSEquity,
    totalNPSFixed,
    totalCrypto,
    totalFixed,
    totalP2P,
    totalNSC,
    totalBonds,
    totalPM,
    totalLargeCap,
    totalMultiCap,
    totalLargeCapETF,
    totalIndexFunds,
    totalLiquidFunds,
    totalIntervalFunds,
    totalFMP,
  }: any = useContext(NWContext);
  const [data, setData] = useState<Array<any>>([]);
  const [emergencyInfo, setEmergencyInfo] = useState<any>("");
  const [longTermInfo, setLongTermInfo] = useState<any>("");
  const categories: any = {
    "Large-cap ETFs": {
      color: "#fdd0ab",
      total: totalLargeCapETF,
    },
    "Large-cap Stocks & Funds": {
      color: "#fdd0cb",
      total: totalLargeCap + totalNPSEquity,
    },
    "Multi-cap Stocks & Funds": {
      color: "#e78284",
      total: totalMultiCap,
    },
    "Bonds and Funds": {
      color: "#aa8dfa",
      total: totalBonds + totalNPSFixed,
    },
    "Other Fixed": {
      color: COLORS.BLUE,
      total:
        totalFixed - totalLiquidFunds - totalBonds - totalNPSFixed - totalP2P,
    },
    "Real-estate": { color: "#7cd9fd", total: totalProperties },
    REITs: { color: "#ffc107", total: totalFRE },
    Gold: { color: "#f6e05e", total: totalFGold + totalPGold },
    "P2P Lending": { color: COLORS.ORANGE, total: totalP2P },
    "Start-up Investments & Collections": {
      color: "#ffab00",
      total: totalAngel + totalOthers,
    },
    Others: {
      color: "#aa8dfa",
      total:
        totalAlternative -
        totalFGold -
        totalPGold -
        totalProperties -
        totalFRE -
        totalCrypto,
    },
    Crypto: { color: COLORS.RED, total: totalCrypto },
  };

  const buildValuationString = (pre: string, total: number) =>
    total ? (
      <>
        {`${pre}: ${toHumanFriendlyCurrency(
          total,
          selectedCurrency
        )} (${toReadableNumber((total * 100) / totalAssets, 2)}%)`}
        <br />
      </>
    ) : (
      ""
    );

  const buildEmergencyInfo = () =>
    totalSavings || totalLendings || totalLiquidFunds ? (
      <>
        Emergency cash includes
        <br />
        {buildValuationString("Savings", totalSavings)}
        {buildValuationString("Deposits", totalLendings)}
        {buildValuationString("Liquid funds", totalLiquidFunds)}
      </>
    ) : (
      "Emergency cash includes savings, deposits and liquid funds"
    );

  const buildLongTermInfo = () =>
    totalPF || totalNSC ? (
      <>
        Long-term cash includes
        <br />
        {buildValuationString("NSC", totalNSC)}
        {buildValuationString("PPF", totalPPF)}
        {buildValuationString("Employee PF", totalEPF)}
        {buildValuationString("Voluntary PF", totalVPF)}
      </>
    ) : (
      "Long-term cash includes long-term deposits and retirement funds"
    );

  const initChartData = () => {
    if (!totalAssets) {
      setData([...[]]);
      return;
    }
    setEmergencyInfo(buildEmergencyInfo());
    setLongTermInfo(buildLongTermInfo());
    let data: Array<any> = [];
    Object.keys(categories).forEach((cat) => {
      data.push({
        name: cat,
        value: (categories[cat].total / totalAssets) * 100,
      });
    });
    setData([...data]);
  };

  useEffect(() => {
    if (!totalAssets) {
      setData([...[]]);
      return;
    }
    initChartData();
  }, [totalAssets]);

  const getTooltipDesc = (records: any) => {
    let data: any = "";
    Object.keys(records).map((value) => {
      if (!records[value]) return;
      const amount = toHumanFriendlyCurrency(records[value], selectedCurrency);
      const percentage = toReadableNumber(
        (records[value] / totalAssets) * 100,
        2
      );
      data += `${amount} (${percentage}%) of ${value}<br/><br/>`;
    });
    return data ? `<br/><br/>Includes<br/><br/>${data}` : "";
  };

  const breakdownAssetInfo = (asset: string) => {
    if (asset === "Gold")
      return getTooltipDesc({
        "Physical Gold": totalPGold,
        "Gold Bonds": totalFGold,
      });
    if (asset === "Other Fixed")
      return getTooltipDesc({
        "Fixed Maturity Plan": totalFMP,
        "Interval Funds": totalIntervalFunds,
        "Index Funds": totalIndexFunds,
      });
    if (asset === "Real-estate")
      return getTooltipDesc({
        Commercial: totalCommercial,
        Residential: totalResidential,
        Plot: totalPlot,
        Other: totalOtherProperty,
      });
    if (asset === "Start-up Investments & Collections")
      return getTooltipDesc({
        "Start-up Investments": totalAngel,
        Collections: totalOthers,
      });
    if (asset === "Others")
      return getTooltipDesc({
        "Precious Metals": totalPM - totalPGold,
        "Other Investment Trusts": totalFInv,
        Vehicles: totalVehicles,
      });
    if (asset === "Large-cap Stocks & Funds")
      return getTooltipDesc({
        "NPS Equity Funds": totalNPSEquity,
        "Other Large-cap Stocks & Funds": totalLargeCap,
      });
    if (asset === "Bonds & Funds")
      return getTooltipDesc({
        "NPS Bond Funds": totalNPSFixed,
        "Other Bonds & Funds": totalBonds,
      });
    return "";
  };

  return totalAssets ? (
    <div className="container chart">
      <h3>
        Total Asset Allocation of{" "}
        {toHumanFriendlyCurrency(totalAssets, selectedCurrency)}
      </h3>
      <CashAA
        emergencyPer={((totalSavings + totalLendings) / totalAssets) * 100}
        emergency={totalSavings + totalLendings}
        longTerm={totalNSC + totalPF}
        longTermPer={((totalNSC + totalPF) / totalAssets) * 100}
        currency={selectedCurrency}
        // @ts-ignore
        emergencyInfo={emergencyInfo}
        longTermInfo={longTermInfo}
        decimal
      />
      {data.length ? (
        <TreemapChart
          data={{
            name: "root",
            value: 100 - (totalAssets ? totalCash / totalAssets : 0),
            children: data,
          }}
          meta={{
            value: {
              formatter: ({ v }: any) => toReadableNumber(v, 2) + "%",
            },
          }}
          label={{
            visible: true,
            formatter: (v: any) => v.name,
            style: {
              fontFamily: "'Jost', sans-serif",
              fontSize: 14,
              fill: COLORS.DEFAULT,
            },
          }}
          rectStyle={{ stroke: "#fff", lineWidth: 2 }}
          color={(asset: any) => categories[asset.name].color}
          autoFit
          tooltip={{
            visible: true,
            formatter: ({ name, value }: any) => {
              return {
                name,
                value: categories[name].total
                  ? `<b>${toHumanFriendlyCurrency(
                      categories[name].total,
                      selectedCurrency
                    )}</b> (${toReadableNumber(value, 2)}%)${breakdownAssetInfo(
                      name
                    )}`
                  : "",
              };
            },
          }}
          interactions={[
            {
              type: "zoom",
              enable: false,
            },
          ]}
        />
      ) : null}
    </div>
  ) : (
    <Empty />
  );
}
