import React from "react";
import ResultItem from "../calc/resultitem";
import SVGHourGlass from "../svghourglass";
import SVGInheritance from "./svginheritance";
import SVGPiggy from "../svgpiggy";
import { isFFPossible } from "./cfutils";
import SelectInput from "../form/selectinput";
import { changeSelection } from "../utils";
import { getAge } from "./goalutils";
import { PLAN_DURATION } from "../../CONSTANTS";
interface FFResultProps {
  endYear: number;
  ffYear: number | null;
  result: any | null;
  ffNomineeAmt: number;
  currency: string;
  ffYearHandler?: Function;
  ffYearOptions?: any;
}

export default function FFResult({
  endYear,
  ffYear,
  result,
  ffNomineeAmt,
  currency,
  ffYearHandler,
  ffYearOptions,
}: FFResultProps) {
  return (
    <div className="w-full">
      {ffYear && isFFPossible(result, ffNomineeAmt) ? (
        <div className="py-2 flex flex-wrap justify-around w-full items-start bg-green-100">
          {!ffYearHandler ? (
            <ResultItem
              svg={<SVGHourGlass />}
              label="Age"
              result={getAge(result.ffYear, endYear).toString()}
              noResultFormat
              info={`You May achieve Financial Freedom earliest at an age of ${
                getAge(result.ffYear, endYear)
              } Years.`}
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
              value={getAge(result.ffYear, endYear)}
              changeHandler={(val: string) =>
                changeSelection(val, ffYearHandler, endYear - PLAN_DURATION)
              }
              options={ffYearOptions}
            />
          )}
          <ResultItem
            result={result.ffAmt}
            svg={<SVGPiggy disabled={false} selected />}
            label={`Savings @ ${getAge(result.ffYear, endYear) - 1} Years`}
            currency={currency}
            info="You can Withdraw from this Savings for Your expenses after gaining Financial Freedom."
          />
          <ResultItem
            result={result.leftAmt}
            svg={<SVGInheritance disabled={false} selected />}
            label="Savings @ 100 Years"
            currency={currency}
            info={`This is the savings amount when You turn 100 Years old, which may be inherited by Your Nominees. 
                        This includes the Inheritance Amount for Nominees as per the Plan.`}
          />
        </div>
      ) : (
        <p className="text-center bg-red-100 font-semibold py-2">
          Financial Freedom May not be possible till You turn 70. Please try
          again with different Goals / Inputs.
        </p>
      )}
    </div>
  );
}
