import React, { Fragment, useContext, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { List, Badge, Row, Col } from "antd";
import {
  getAllAssetCategories,
  getAllAssetTypesByCategory,
  getAssetColour,
  getAssetName,
  initOptions,
  isMobileDevice,
  toHumanFriendlyCurrency,
} from "../utils";
import { CalcContext } from "../calc/CalcContext";
import DataSwitcher from "../DataSwitcher";
import { COLORS } from "../../CONSTANTS";
import { useFullScreenBrowser } from "react-browser-hooks";
import SelectInput from "../form/selectinput";
import { FIGoalContext } from "./FIGoalContext";
import { PlanContext } from "./PlanContext";
import CashAA from "./CashAA";

const TreemapChart = dynamic(() => import("bizcharts/lib/plots/TreemapChart"), {
  ssr: false,
});

interface RenderItemProp {
  name?: any;
  value?: any;
}

interface TargetAAChartProps {
  yearChangeable?: boolean;
}

export default function TargetAAChart({ yearChangeable }: TargetAAChartProps) {
  const nowYear = new Date().getFullYear();
  const { Chart, List: DataSwitcherList } = DataSwitcher;
  const { goal, rr, ffGoal, ffResult }: any = useContext(PlanContext);
  const { cfs, startYear, currency }: any = useContext(CalcContext);
  const { wipResult, planDuration }: any = useContext(FIGoalContext);
  const [index, setIndex] = useState<number>(yearChangeable ? 1 : 0);
  const [data, setData] = useState<Array<any>>([]);
  const getFFGoalEndYear = () =>
    goal ? startYear + planDuration : ffGoal.sy + ffGoal.loan?.dur;
  const getCurrency = () => (goal ? currency : ffGoal.ccy);
  const getCF = (index: number) =>
    goal ? cfs[index] : ffResult.ffCfs[new Date().getFullYear() + index];
  const [aaYearOptions, setAAYearOptions] = useState<any>(
    initOptions(nowYear + 1, getFFGoalEndYear() - nowYear - 2)
  );
  const fsb = useFullScreenBrowser();
  const aa = goal ? wipResult.aa : ffResult.aa;

  const getFormattedAssetName = (assetName: string) => {
    if (
      isMobileDevice(fsb) &&
      (assetName.endsWith("nds") || assetName.endsWith("cks"))
    ) {
      let result = "";
      let strings = assetName.split(" ");
      strings.forEach(
        (str) => (result += str + (str.includes(",") ? " " : "\n"))
      );
      return result;
    } else return assetName + "\n";
  };

  const initChartData = () => {
    let data: Array<any> = [];
    getAllAssetCategories().forEach((cat) => {
      let children: Array<any> = [];
      let total = 0;
      getAllAssetTypesByCategory(cat).forEach((at) => {
        if (aa[at][index]) {
          total += aa[at][index];
          children.push({
            name: getAssetName(at),
            value: aa[at][index],
            children: [],
          });
        }
      });

      if (total)
        data.push({
          name: cat,
          value: total,
          children: children,
        });
    });
    setData([...data]);
  };

  useEffect(() => {
    const ffGoalEndYear = goal
      ? startYear + planDuration
      : ffGoal.sy + ffGoal.loan?.dur;
    setAAYearOptions(initOptions(nowYear + 1, ffGoalEndYear - nowYear - 2));
    if (!goal) initChartData();
  }, [startYear, planDuration, rr]);

  useEffect(() => {
    if (cfs.length) initChartData();
  }, [cfs, index]);

  return (
    <Fragment>
      <DataSwitcher
        title={
          <Fragment>
            Target Asset Allocation of{" "}
            <strong>
              {toHumanFriendlyCurrency(getCF(index), getCurrency())}
            </strong>{" "}
            for end of Year&nbsp;
            {yearChangeable ? (
              <SelectInput
                pre=""
                value={nowYear + index}
                changeHandler={(val: string) =>
                  setIndex(parseInt(val) - nowYear)
                }
                options={aaYearOptions}
              />
            ) : (
              <strong>{nowYear + index}</strong>
            )}
          </Fragment>
        }
        header={
          <div className="chart">
            <CashAA
              emergency={(getCF(index) * aa.cash[index]) / 100}
              longTerm={(getCF(index) * aa.ltdep[index]) / 100}
              emergencyPer={aa.cash[index]}
              longTermPer={aa.ltdep[index]}
              currency={getCurrency()}
              emergencyInfo="Emergency cash including savings, deposits and liquid funds"
              longTermInfo="Long-term cash investments in long-term deposits and retirement related funds"
            />
          </div>
        }>
        <Chart>
          {aa.cash[index] + aa.ltdep[index] === 100 ? (
            <Row justify="center">
              <Col>
                <strong>
                  No further allocation possible as Cash Allocation is 100%
                </strong>
              </Col>
            </Row>
          ) : (
            <TreemapChart
              data={{
                name: "root",
                value: 100 - (aa.cash[index] || 0),
                children: data,
              }}
              meta={{
                value: {
                  formatter: ({ v }: any) => v + "%",
                },
              }}
              label={{
                visible: true,
                formatter: (v: any) => {
                  let aa = goal ? wipResult.aa : ffResult.aa;
                  return aa.hasOwnProperty(v.name)
                    ? `${getFormattedAssetName(v.name)}${aa[v.name][index]}%`
                    : v.name;
                },
                style: {
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 14,
                  fill: COLORS.DEFAULT,
                },
              }}
              rectStyle={{ stroke: "#fff", lineWidth: 2 }}
              color={(asset: any) => getAssetColour(asset.name)}
              autoFit
              tooltip={{
                visible: true,
                formatter: ({ name, value }: any) => {
                  return {
                    name,
                    value: `<strong>${toHumanFriendlyCurrency(
                      Math.round((getCF(index) * value) / 100),
                      getCurrency()
                    )}</strong> (${value}%)`,
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
          )}
        </Chart>
        <DataSwitcherList>
          <List
            dataSource={data}
            renderItem={({ name, value, children }) => {
              const [title] = name.split(" ");
              return (
                <Fragment>
                  <List.Item
                    className="heading"
                    actions={[
                      toHumanFriendlyCurrency(
                        Math.round((getCF(index) * value) / 100),
                        getCurrency()
                      ),
                      <Badge count={`${value}%`} key="cfv" />,
                    ]}>
                    {title}
                  </List.Item>
                  <List.Item>
                    <List
                      dataSource={children}
                      renderItem={({ name, value }: RenderItemProp) => {
                        const assetColor = getAssetColour(name);
                        return (
                          <List.Item
                            actions={[
                              toHumanFriendlyCurrency(
                                Math.round((getCF(index) * value) / 100),
                                getCurrency()
                              ),
                              <Badge count={`${value}%`} key={name} />,
                            ]}>
                            <span style={{ background: assetColor }} />
                            {name}
                          </List.Item>
                        );
                      }}
                    />
                  </List.Item>
                </Fragment>
              );
            }}
          />
        </DataSwitcherList>
      </DataSwitcher>
    </Fragment>
  );
}
