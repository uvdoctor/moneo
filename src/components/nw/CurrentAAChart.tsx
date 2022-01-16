import { Empty, Skeleton } from "antd";
import dynamic from "next/dynamic";
import React, { useContext, useEffect, useState } from "react";
import {
  AssetSubType,
  AssetType,
  InstrumentInput,
  MCap,
  MFSchemeType,
} from "../../api/goals";
import { COLORS } from "../../CONSTANTS";
import { AppContext } from "../AppContext";
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
    instruments,
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
    totalCrypto,
    totalFixed,
    totalP2P,
    totalNSC,
    totalBonds,
    pricingDone,
  }: any = useContext(NWContext);
  const { insData }: any = useContext(AppContext);
  const [data, setData] = useState<Array<any>>([]);
  const [largeCap, setLargeCap] = useState<number>(0);
  const [multiCap, setMultiCap] = useState<number>(0);
  const [fmp, setFmp] = useState<number>(0);
  const [intervalFunds, setIntervalFunds] = useState<number>(0);
  const [indexFunds, setIndexFunds] = useState<number>(0);
  const [liquidFunds, setLiquidFunds] = useState<number>(0);
  const [allocationDone, setAllocationDone] = useState<boolean>(false);
  const categories: any = {
    "Large-cap Stocks & Funds": {
      color: "#fdd0cb",
      total: largeCap + totalNPSEquity,
    },
    "Multi-cap Stocks & Funds": {
      color: "#e78284",
      total: multiCap,
    },
    Bonds: { color: "#aa8dfa", total: totalBonds },
    "Other Fixed": {
      color: COLORS.BLUE,
      total: totalFixed - liquidFunds - totalBonds - totalP2P,
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

  const initChartData = () => {
    if (!totalAssets) {
      setData([...[]]);
      return;
    }
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
    if (!pricingDone) return;
    setAllocationDone(false);
    let largeCap = 0;
    let multiCap = 0;
    let fmp = 0;
    let intervalFunds = 0;
    let indexFunds = 0;
    let liquidFunds = 0;
    instruments.map((instrument: InstrumentInput) => {
      const data = insData[instrument.id];
      if (data) {
        const price = instrument.qty * (data ? data.price : 0);
        if (data.type === AssetType.E) {
          if (data?.meta?.mcap === MCap.L || data?.mcap === MCap.L)
            largeCap += price;
          else multiCap += price;
        } else if (data.type === AssetType.F) {
          if (data.subt === AssetSubType.I) indexFunds += price;
          if (data.subt === AssetSubType.L) liquidFunds += price;
          if (data.mftype && data.subt === AssetSubType.HB) {
            if (data.mftype === MFSchemeType.I) intervalFunds += price;
            if (data.mftype === MFSchemeType.C) fmp += price;
          }
        }
      }
    });
    setLargeCap(largeCap);
    setMultiCap(multiCap);
    setIndexFunds(indexFunds);
    setLiquidFunds(liquidFunds);
    setIntervalFunds(intervalFunds);
    setFmp(fmp);
    setAllocationDone(true);
  }, [pricingDone, instruments]);

  useEffect(() => {
    if (!allocationDone) return;
    initChartData();
  }, [allocationDone]);

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
        "Fixed Maturity Plan": fmp,
        "Interval Funds": intervalFunds,
        "Index Funds": indexFunds,
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
        "Other Investment Trusts": totalFInv,
        Vehicles: totalVehicles,
      });
    if (asset === "PF") {
      return (
        <>
          Includes
          <br />
          <br />
          <strong>{toHumanFriendlyCurrency(totalPPF, selectedCurrency)}</strong>
          ({toReadableNumber((totalPPF / totalAssets) * 100, 2)}%) of Pension PF
          <br />
          <br />
          <strong>{toHumanFriendlyCurrency(totalVPF, selectedCurrency)}</strong>
          ({toReadableNumber((totalVPF / totalAssets) * 100, 2)}%) of Voluntary
          PF
          <br />
          <br />
          <strong>{toHumanFriendlyCurrency(totalEPF, selectedCurrency)}</strong>
          ({toReadableNumber((totalEPF / totalAssets) * 100, 2)}%) of Employee
          PF
          <br />
          <br />
        </>
      );
    }
    return "";
  };

  return pricingDone ? (
    totalAssets ? (
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
          decimal
        />
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
      </div>
    ) : (
      <Empty />
    )
  ) : (
    <Skeleton active />
  );
}
