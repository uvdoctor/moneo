import React, { useState } from "react";
//@ts-ignore
import { AwesomeButton } from "react-awesome-button";
import * as APIt from "../api/goals";
import FFGoal from "../components/goals/ffgoal";
import { ASSET_TYPES } from "../CONSTANTS";
import CalcLayout from "../components/calc/calclayout";

export default function FI() {
  const [wipGoal, setWIPGoal] = useState<APIt.CreateGoalInput | null>(null);
  const nowYear = new Date().getFullYear();
  const [ffResult, setFFResult] = useState<any>({});

  const buildEmptyMergedCFs = () => {
    let mCFs = {};
    for (let year = nowYear + 1; year <= nowYear + 80; year++)
      //@ts-ignore
      mCFs[year] = 0;
    return mCFs;
  };

  const getPP = () => {
    return {
      [ASSET_TYPES.SAVINGS]: 0.5,
      [ASSET_TYPES.DEPOSITS]: 1.5,
      [ASSET_TYPES.SHORT_TERM_BONDS]: 2, //short term bond <1
      [ASSET_TYPES.MED_TERM_BONDS]: 3, // 1-5 medium term
      [ASSET_TYPES.TAX_EXEMPT_BONDS]: 3.5, //medium term tax efficient bonds
      [ASSET_TYPES.DOMESTIC_REIT]: 5,
      [ASSET_TYPES.INTERNATIONAL_REIT]: 5,
      [ASSET_TYPES.GOLD]: 3,
      [ASSET_TYPES.LARGE_CAP_STOCKS]: 5,
      [ASSET_TYPES.MID_CAP_STOCKS]: 6,
      [ASSET_TYPES.DIVIDEND_GROWTH_STOCKS]: 5,
      [ASSET_TYPES.INTERNATIONAL_STOCKS]: 9,
      [ASSET_TYPES.SMALL_CAP_STOCKS]: 9,
    };
  };

  return (
    <CalcLayout wipGoal={wipGoal} wipGoalHandler={setWIPGoal}>
      <FFGoal
        goal={wipGoal as APIt.CreateGoalInput}
        mustCFs={[]}
        tryCFs={[]}
        mergedCfs={buildEmptyMergedCFs()}
        cancelCallback={() => setWIPGoal(null)}
        ffResult={ffResult}
        ffResultHandler={setFFResult}
        pp={getPP()}
      />
    </CalcLayout>
  );
}
