import { Tabs } from "antd";
import React, { useContext, useState } from "react";
import { CalcContext } from "../calc/CalcContext";
import NumberInput from "../form/numberinput";
import RadialInput from "../form/radialinput";
import Section from "../form/section";
import { toStringArr } from "../utils";
import Care from "./Care";
import FIAssetPerformance from "./FIAssetPerformance";
import FIBenefit from "./FIBenefit";
import { FIGoalContext } from "./FIGoalContext";
import FIMoneyOutflow from "./FIMoneyOutflow";

export default function FIAdvanced() {
  const { TabPane } = Tabs;
  const { currency }: any = useContext(CalcContext);
  const {
    emergencyFundChgRate,
    setEmergencyFundChgRate,
    taxRate,
    setTaxRate,
    planDuration,
    setPlanDuration,
    retirementAge,
    setRetirementAge,
  }: any = useContext(FIGoalContext);
  const [tabIndex, setTabIndex] = useState<number>(0);

  return (
    <Tabs
      onTabClick={(key: string) => setTabIndex(parseInt(key))}
      defaultActiveKey={"" + tabIndex}
      type="card">
      <TabPane key={0} tab="General">
        <Section title="General configuration">
          <NumberInput
            pre="Emergency fund increases"
            value={emergencyFundChgRate}
            changeHandler={setEmergencyFundChgRate}
            min={0}
            max={10}
            step={0.1}
            unit="% yearly"
            info="Emergency fund to be increased every year based on inflation."
          />
          <NumberInput
            info="Applicable tax rate, in case you have to pay capital gains tax or income tax for withdrawing from retirement accounts beyond the allowed yearly limit."
            pre="Applicable tax rate"
            min={0}
            max={30}
            step={0.1}
            value={taxRate}
            changeHandler={setTaxRate}
            unit="%"
            post="after achieving FI"
          />
          <RadialInput
            pre="Life expectancy"
            label="Years"
            value={planDuration}
            changeHandler={setPlanDuration}
            step={1}
            data={toStringArr(70, 100, 1)}
            labelBottom
            info="This will be used to define the duration for which Financial Planning is Needed."
          />
          <RadialInput
            pre="FI target age"
            label="years"
            value={retirementAge}
            changeHandler={setRetirementAge}
            step={1}
            data={toStringArr(40, 67, 1)}
            labelBottom
            info="This is the age by which you wish to achieve Financial Independence (FI)."
          />
        </Section>
      </TabPane>
      <TabPane key={1} tab="Benefits">
        <FIBenefit />
      </TabPane>
      <TabPane key={2} tab="Spends">
        <FIMoneyOutflow />
      </TabPane>
      <TabPane key={3} tab="Performance">
        <FIAssetPerformance />
      </TabPane>
      {currency === "USD" || currency === "CAD" || currency === "GBP" ? (
        <TabPane key={4} tab="Care">
          <Care />
        </TabPane>
      ) : null}
    </Tabs>
  );
}
