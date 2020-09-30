import React, { Fragment } from "react";
import SVGHourGlass from "../svghourglass";
import ItemDisplay from "../calc/ItemDisplay";
import { MAX_RETIREMENT_AGE } from "../../CONSTANTS";

interface FFImpactProps {
  ffImpactYears: number | null;
  ffOOM: Array<number> | null;
  ffGoalEndYear: number;
}

export default function FFImpact(props: FFImpactProps) {
  const getUnit = () =>
    Math.abs(props.ffImpactYears as number) > 1 ? " Years " : " Year ";

  const getImpactText = () =>
    (props.ffImpactYears as number) > 0 ? "Earlier" : "Later";

  return (
    <Fragment>
      {props.ffImpactYears !== null ? (
        props.ffImpactYears === 0 ? (
          <ItemDisplay
            label="Impact"
            result="No Delay"
            info="This Goal does not delay Your Financial Independence Year."
          />
        ) : (
          <ItemDisplay
            svg={<SVGHourGlass />}
            label="Impact"
            pl
            unit={`${getUnit()}`}
            result={props.ffImpactYears}
            info={`You May Achieve Financial Independence ${Math.abs(
              props.ffImpactYears
            )} ${getUnit()} 
                        ${getImpactText()} due to this Goal.`}
          />
        )
      ) : (
        <ItemDisplay
          label="Impact"
          result="Unable to Determine"
          info={`Financial Independence Impact can only be determined if Financial Independence is Possible by ${MAX_RETIREMENT_AGE} Years of Age. Please change Your Goals / Inputs and try again.`}
        />
      )}
    </Fragment>
  );
}
