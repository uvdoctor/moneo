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
              label="Starts from"
              result={result.ffYear}
              noResultFormat
              info={`${result.ffYear} may be the Earliest You can Achieve Financial Freedom.`}
              hideLabel={hideLabel}
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
              pre=""
              value={result.ffYear}
              changeHandler={(val: string) => changeSelection(val, ffYearHandler)}
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
            label={`Nominees Get`}
            currency={currency}
            hideLabel={hideLabel}
            info={`This is the savings amount left over in ${endYear + 1}. 
                        As Your Plan ends in ${endYear}, this may be inherited by Your Nominees. 
                        This includes the Inheritance Amount for Nominees as per the Plan.`}
          />
        </div>
      ) : (
        <p className="text-center bg-red-100 font-semibold py-2">
          Analyzed till ${endYear - 30}. Please try again with different inputs
          / goals.
        </p>
      )}
    </div>
  );
}
