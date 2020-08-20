import React from "react";
import { TargetInput } from "../../api/goals";
import DynamicTgtInput from "../form/dynamictgtinput";
import Section from "../form/section";

interface DynamicTargetsProps {
  title: string;
  inputOrder: number;
  currentOrder: number;
  allInputDone: boolean;
  nextStepHandler: Function;
  currency: string;
  rangeFactor: number;
  by: number;
  ey: number;
  tgts: Array<TargetInput>;
  tgtsHandler: Function;
  footer: string;
}

export default function DynamicTargets({
  title,
  inputOrder,
  currentOrder,
  allInputDone,
  nextStepHandler,
  currency,
  rangeFactor,
  by,
  ey,
  tgts,
  tgtsHandler,
  footer,
}: DynamicTargetsProps) {
  return (
    <Section
      title={title}
      left={
        <DynamicTgtInput
          inputOrder={inputOrder}
          currentOrder={currentOrder}
          nextStepDisabled={false}
          allInputDone={allInputDone}
          nextStepHandler={nextStepHandler}
          startYear={by}
          endYear={ey}
          currency={currency}
          rangeFactor={rangeFactor}
          tgts={tgts}
          tgtsHandler={tgtsHandler}
        />
      }
      insideForm
      footer={footer}
    />
  );
}
