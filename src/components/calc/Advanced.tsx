import { Tabs } from "antd";
import React, { useContext, useState } from "react";
import { BuyType, GoalType } from "../../api/goals";
import NumberInput from "../form/numberinput";
import RadialInput from "../form/radialinput";
import AnnualCF from "../goals/AnnualCF";
import { GoalContext } from "../goals/GoalContext";
import { toHumanFriendlyCurrency, toStringArr } from "../utils";
import { CalcContext } from "./CalcContext";
import TaxAdjustment from "./TaxAdjustment";

export default function Advanced() {
  const { goal, currency }: any = useContext(CalcContext);
  const {
    sellAfter,
    setSellAfter,
    buyType,
    assetChgRate,
    setAssetChgRate,
    sellPrice,
    runningCost,
    runningCostChg,
    setRunningCostChg,
  }: any = useContext(GoalContext);
  const { TabPane } = Tabs;
  const [tabIndex, setTabIndex] = useState<number>(0);
  return goal.type !== GoalType.B ? (
    <TaxAdjustment />
  ) : (
    <Tabs
      onTabClick={(key: string) => setTabIndex(parseInt(key))}
      defaultActiveKey={"" + tabIndex}
      type="card">
      <TabPane key={0} tab="Tax">
        <TaxAdjustment />
      </TabPane>
      {goal.type === GoalType.B ? (
        <>
          <TabPane key={1} tab="Sell">
            <RadialInput
              info="Years after which you plan to sell."
              label="Years"
              pre="Sell After"
              labelBottom={true}
              data={toStringArr(3, buyType === BuyType.P ? 30 : 10)}
              value={sellAfter}
              step={1}
              changeHandler={setSellAfter}
            />
            {goal.type === GoalType.B && (
              <NumberInput
                info="Approximate rate at which you expect resale value to change yearly."
                pre="Assume resale value changes"
                unit="% yearly"
                post={`Sell price ${toHumanFriendlyCurrency(
                  sellPrice,
                  currency
                )}`}
                min={-40}
                max={15}
                step={0.5}
                value={assetChgRate}
                changeHandler={setAssetChgRate}
              />
            )}
          </TabPane>
          {buyType === BuyType.P || buyType === BuyType.V ? (
            <TabPane key={2} tab="Other">
              <>
                {buyType === BuyType.V ? (
                  <>
                    <NumberInput
                      pre="Usage cost changes"
                      info="Rate at which the usage cost changes in a year"
                      value={runningCostChg}
                      changeHandler={setRunningCostChg}
                      step={0.1}
                      max={10}
                      unit="% yearly"
                    />
                    <p>&nbsp;</p>
                  </>
                ) : null}
                <AnnualCF />
                <AnnualCF income />
              </>
            </TabPane>
          ) : null}
        </>
      ) : null}
    </Tabs>
  );
}
