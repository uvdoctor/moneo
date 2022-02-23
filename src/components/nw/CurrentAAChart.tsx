import { Empty, Skeleton } from "antd";
import dynamic from "next/dynamic";
import React, { useContext, useEffect, useState } from "react";
import { COLORS } from "../../CONSTANTS";
import CashAA from "../goals/CashAA";
import { toHumanFriendlyCurrency, toReadableNumber } from "../utils";
import { NWContext } from "./NWContext";
import { getTooltipDesc } from "./nwutils";

const TreemapChart = dynamic(() => import("bizcharts/lib/plots/TreemapChart"), {
  ssr: false,
});

export default function CurrentAAChart() {
  const {
    totalCash,
    totalSavings,
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
    totalNPSGFixed,
    totalNPSCFixed,
    totalCrypto,
    totalP2P,
    totalLtdep,
    totalPM,
    totalLargeCapStocks,
    totalLargeCapFunds,
    totalMultiCap,
    totalLargeCapETF,
    totalIndexFunds,
    totalLiquidFunds,
    totalIntervalFunds,
    totalFMP,
    totalFFixed,
    totalStLendings,
    totalBonds,
    totalStocks,
    loadingInstruments,
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
      color: "#ffa698",
      total: totalLargeCapStocks + totalLargeCapFunds + totalNPSEquity,
    },
    "Multi-cap Stocks & Funds": {
      color: "#e78284",
      total: totalMultiCap,
    },
    "Bonds & Fixed Income Funds": {
      color: COLORS.BLUE,
      total: totalFFixed - totalLiquidFunds + totalNPSGFixed + totalNPSCFixed,
    },
    "Real-estate": { color: "#7cd9fd", total: totalProperties },
    REITs: { color: "#ffc107", total: totalFRE },
    Gold: { color: "#f6e05e", total: totalFGold + totalPGold },
    "P2P Lending": { color: COLORS.ORANGE, total: totalP2P },
    Others: {
      color: "#aa8dfa",
      total:
        totalOthers +
        totalFInv +
        totalAngel +
        totalVehicles +
        (totalPM - totalPGold),
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
        {buildValuationString("Short Term Deposits", totalStLendings)}
        {buildValuationString("Liquid funds", totalLiquidFunds)}
      </>
    ) : (
      "Emergency cash includes savings, deposits and liquid funds"
    );

  const buildLongTermInfo = () =>
    totalPF || totalLtdep ? (
      <>
        Long-term cash includes
        <br />
        {buildValuationString("Long-term Schemes", totalLtdep)}
        {buildValuationString(
          "Long Term Deposits",
          totalLendings - totalStLendings
        )}
        {buildValuationString("PPF", totalPPF)}
        {buildValuationString("Employee PF", totalEPF)}
        {buildValuationString("Voluntary PF", totalVPF)}
      </>
    ) : (
      "Long-term cash includes long-term deposits and retirement funds"
    );

  const initChartData = () => {
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
    if (!totalAssets || loadingInstruments) {
      setData([...[]]);
      return;
    }
    initChartData();
  }, [totalAssets]);

  const breakdownAssetInfo = (asset: string) => {
    if (asset === "Gold")
      return getTooltipDesc(
        {
          "Physical Gold": totalPGold,
          "Gold Bonds": totalFGold,
        },
        selectedCurrency,
        totalAssets
      );
    if (asset === "Real-estate")
      return getTooltipDesc(
        {
          Commercial: totalCommercial,
          Residential: totalResidential,
          Plot: totalPlot,
          Other: totalOtherProperty,
        },
        selectedCurrency,
        totalAssets
      );
    if (asset === "Others")
      return getTooltipDesc(
        {
          "Other Precious Metals": totalPM - totalPGold,
          "Start-up Investments": totalAngel,
          "Other Investment Trusts": totalFInv,
          Vehicles: totalVehicles,
          "Memberships & Collections": totalOthers,
        },
        selectedCurrency,
        totalAssets
      );
    if (asset === "Large-cap Stocks & Funds")
      return getTooltipDesc(
        {
          "Large-cap Stocks": totalLargeCapStocks,
          "Large-cap Mutual Funds": totalLargeCapFunds,
          "NPS Equity Schemes": totalNPSEquity,
        },
        selectedCurrency,
        totalAssets
      );
    if (asset === "Multi-cap Stocks & Funds")
      return getTooltipDesc(
        {
          "Multi-cap Stocks": totalStocks - totalLargeCapStocks,
          "Multi-cap Mutual Funds":
            totalMultiCap - (totalStocks - totalLargeCapStocks),
        },
        selectedCurrency,
        totalAssets
      );
    if (asset === "Bonds & Fixed Income Funds")
      return getTooltipDesc(
        {
          "NPS Bond Schemes": totalNPSGFixed + totalNPSCFixed,
          Bonds: totalBonds,
          "Fixed Maturity Plan": totalFMP,
          "Interval Funds": totalIntervalFunds,
          "Index Funds": totalIndexFunds,
          "Other Funds":
            totalFFixed -
            totalBonds -
            totalFMP -
            totalIntervalFunds -
            totalIndexFunds -
            totalLiquidFunds,
        },
        selectedCurrency,
        totalAssets
      );
    return "";
  };

  return loadingInstruments ? (
    <Skeleton active />
  ) : data.length ? (
    <div className="container chart">
      <h3>
        {`Total allocation of ${toHumanFriendlyCurrency(
          totalAssets,
          selectedCurrency
        )} by asset type`}
      </h3>
      <CashAA
        emergencyPer={((totalSavings + totalStLendings) / totalAssets) * 100}
        emergency={totalSavings + totalStLendings}
        longTerm={totalLtdep + totalLendings - totalStLendings + totalPF}
        longTermPer={
          ((totalLtdep + totalLendings - totalStLendings + totalPF) /
            totalAssets) *
          100
        }
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
      ) : (
        <Empty />
      )}
    </div>
  ) : (
    <Empty />
  );
}
