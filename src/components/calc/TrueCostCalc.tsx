import React, { Fragment, useEffect, useState } from "react";
import { SPEND } from "../../pages/truecost";
import { getOrderByTabLabel } from "../goals/goalutils";
import { CalcTypeProps } from "./calculator";
import SpendAmt from "./spendamt";

export default function TrueCostCalc(props: CalcTypeProps) {
  const [amt, setAmt] = useState<number>(0);
  const [freq, setFreq] = useState<string>("one");
  const [duration, setDuration] = useState<number>(0);

  useEffect(() => {
    props.cfsHandler([])
  }, [props.currency, props.dr, amt, freq])

  return (
    <Fragment>
      {props.showTab === SPEND && (
        <SpendAmt
          currency={props.currency}
          rangeFactor={props.rangeFactor}
          allInputDone={props.allInputDone}
          currentOrder={props.currentOrder}
          inputOrder={getOrderByTabLabel(props.tabOptions, SPEND)}
          nextStepHandler={props.nextStepHandler}
          freq={freq}
          freqHandler={setFreq}
          amt={amt}
          amtHandler={setAmt}
          duration={duration}
          durationHandler={setDuration}
        />
      )}
    </Fragment>
  );
}
