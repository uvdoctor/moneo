import { Tabs } from "antd";
import React, { useContext, useState } from "react";
import { BuyType, GoalType } from "../../api/goals";
import RadialInput from "../form/radialinput";
import AnnualCF from "../goals/AnnualCF";
import { GoalContext } from "../goals/GoalContext";
import { toStringArr } from "../utils";
import { CalcContext } from "./CalcContext";
import TaxAdjustment from "./TaxAdjustment";

export default function Advanced() {
  const { goal }: any = useContext(CalcContext);
  const { sellAfter, setSellAfter, buyType }: any = useContext(GoalContext);
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
        <TabPane key={1} tab="Other">
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
          {buyType === BuyType.P || buyType === BuyType.V ? (
            <>
              <AnnualCF />
              <AnnualCF income />
            </>
          ) : null}
        </TabPane>
      ) : null}
    </Tabs>
  );
}
