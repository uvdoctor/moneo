import { Badge, Col, Empty, Row, Skeleton } from "antd";
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
import { toHumanFriendlyCurrency, toReadableNumber } from "../utils";
import { NWContext } from "./NWContext";

const TreemapChart = dynamic(() => import("bizcharts/lib/plots/TreemapChart"), {
  ssr: false,
});

export default function AAChart() {
  const {
    totalSavings,
    totalDeposits,
    totalAlternative,
    totalLendings,
    totalFGold,
    totalPGold,
    totalFRE,
    totalFInv,
    totalProperties,
    selectedCurrency,
    loadingHoldings,
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
  }: any = useContext(NWContext);
  const { insData }: any = useContext(AppContext);
  const [totalCash, setTotalCash] = useState<number>(
    totalSavings + totalDeposits + totalLendings
  );
  const [data, setData] = useState<Array<any>>([]);
  const [largeCap, setLargeCap] = useState<number>(0);
  const [midCap, setMidCap] = useState<number>(0);
  const [smallCap, setSmallCap] = useState<number>(0);
  const [hybridCap, setHybridCap] = useState<number>(0);
  const [fmp, setFmp] = useState<number>(0);
  const [bonds, setBonds] = useState<number>(0);
  const [intervalFunds, setIntervalFunds] = useState<number>(0);
  const [indexFunds, setIndexFunds] = useState<number>(0);
  const [liquidFunds, setLiquidFunds] = useState<number>(0);
  const categories: any = {
    "Large-cap Stocks & Funds": {
      color: "#fdd0cb",
      total: largeCap + totalNPSEquity,
    },
    "Multi-cap Stocks & Funds": {
      color: "#e78284",
      total: midCap + smallCap + hybridCap,
    },
    Bonds: { color: "#aa8dfa", total: bonds },
    "Other Fixed": {
      color: COLORS.BLUE,
      total: totalFixed - totalPF - liquidFunds - bonds - totalP2P,
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
    setTotalCash(totalSavings + totalDeposits + totalLendings);
  }, [totalSavings, totalDeposits, totalLendings]);

  useEffect(() => {
    initChartData();
  }, [totalAssets]);

  useEffect(() => {
    let largeCap = 0;
    let midCap = 0;
    let smallCap = 0;
    let hybridCap = 0;
    let fmp = 0;
    let bonds = 0;
    let intervalFunds = 0;
    let indexFunds = 0;
    let liquidFunds = 0;
    instruments.map((instrument: InstrumentInput) => {
      const data = insData[instrument.id];
      if (data) {
        const price = instrument.qty * (data ? data.price : 0);
        if (data.type === AssetType.E) {
          if (data.meta) {
            if (data.meta.mcap === MCap.L) largeCap += price;
            if (data.meta.mcap === MCap.M) midCap += price;
            if (data.meta.mcap === MCap.S) smallCap += price;
            if (data.meta.mcap === MCap.H) hybridCap += price;
            else smallCap += price;
          }
          if (data.mcap === MCap.L) largeCap += price;
          if (data.mcap === MCap.M) midCap += price;
          if (data.mcap === MCap.S) smallCap += price;
          if (data.mcap === MCap.H) hybridCap += price;
        }
        if (data.type === AssetType.F) {
          if (
            data.subt === AssetSubType.CB ||
            data.subt === AssetSubType.GB ||
            data.subt === AssetSubType.GBO ||
            data.subt === AssetSubType.HB
          )
            bonds += price;
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
    setMidCap(midCap);
    setSmallCap(smallCap);
    setHybridCap(hybridCap);
    setIndexFunds(indexFunds);
    setLiquidFunds(liquidFunds);
    setBonds(bonds);
    setIntervalFunds(intervalFunds);
    setFmp(fmp);
  }, [instruments]);

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

  return !loadingHoldings ? (
    totalAssets ? (
      <div className="container chart">
        <h3>
          Total Asset Allocation of{" "}
          {toHumanFriendlyCurrency(totalAssets, selectedCurrency)}
        </h3>
        <Row>
          <Col xs={24} lg={8}>
            <div className="cash active">
              <span className="arrow-right" />
              Total Cash{" "}
              <Badge
                count={`${toReadableNumber(
                  ((totalSavings + totalLendings) / totalAssets) * 100,
                  2
                )} %`}
              />
            </div>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <div className="cash">
              Savings{" "}
              <Badge
                count={`${toReadableNumber(
                  (totalSavings / totalAssets) * 100,
                  2
                )} %`}
              />
              <strong>
                {toHumanFriendlyCurrency(totalSavings, selectedCurrency)}
              </strong>
            </div>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <div className="cash deposits">
              Deposits{" "}
              <Badge
                count={`${toReadableNumber(
                  (totalLendings / totalAssets) * 100,
                  2
                )} %`}
              />
              <strong>
                {toHumanFriendlyCurrency(totalLendings, selectedCurrency)}
              </strong>
            </div>
          </Col>
        </Row>
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
