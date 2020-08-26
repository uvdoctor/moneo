import React from "react";
import ResultItem from "../calc/resultitem";
import SVGHourGlass from "../svghourglass";
import SVGInheritance from "./svginheritance";
import SVGPiggy from "../svgpiggy";
import { isFFPossible } from "./cfutils";
import SelectInput from "../form/selectinput";
import { changeSelection } from "../utils";
interface FFResultProps {
  endYear: number;
  ffYear: number | null;
  result: any | null;
  ffNomineeAmt: number;
  currency: string;
  hideLabel?: boolean;
  ffYearHandler?: Function;
  ffYearOptions?: any
}

export default function FFResult({
  endYear,
  ffYear,
  result,
  ffNomineeAmt,
  currency,
  hideLabel,
  ffYearHandler,
  ffYearOptions
}: FFResultProps) {
  
  return (
    <div className="w-full">
      {ffYear && isFFPossible(result, ffNomineeAmt) ? (
        <div className="py-2 flex flex-wrap justify-around w-full items-start bg-green-100">
          {!ffYearHandler ? (
            <ResultItem
              svg={<SVGHourGlass />}
              label="Age"
              result={(result.ffYear - (endYear - 100)).toString()}
              noResultFormat
              info={`${result.ffYear} may be the Earliest You can Achieve Financial Freedom.`}
              hideLabel={hideLabel}
              unit="Years"
              imp={
                result.oom
                  ? `You May Not Have Enough Savings in Years ${result.oom.map(
                      (year: number) => ` ${year}`
                    )}`
                  : ""
              }
            />
          ) : (
            <SelectInput
              name="ffy"
              inputOrder={1}
              currentOrder={0}
              allInputDone
              nextStepDisabled={false}
              nextStepHandler={() => true}
              pre="Age"
              unit="Years"
              value={result.ffYear - (endYear - 100)}
              changeHandler={(val: string) => changeSelection(val, ffYearHandler, endYear - 100)}
              options={ffYearOptions}
            />
          )}
          <ResultItem
            result={result.ffAmt}
            svg={<SVGPiggy />}
            label={`Savings by ${result.ffYear - 1}`}
            hideLabel={hideLabel}
            currency={currency}
            info={`You can Withdraw from this Savings for Your expenses from ${result.ffYear} onwards`}
          />
          <ResultItem
            result={result.leftAmt}
            svg={<SVGInheritance />}
            label={`Savings by ${endYear}`}
            currency={currency}
            hideLabel={hideLabel}
            info={`This is the savings amount by end of ${endYear}, which may be inherited by Your Nominees. 
                        This includes the Inheritance Amount for Nominees as per the Plan.`}
          />
        </div>
      ) : (
        <p className="text-center bg-red-100 font-semibold py-2">
          May not be possible till You turn 70. Please try again with different inputs
          / goals.
        </p>
      )}
    </div>
  );
}
