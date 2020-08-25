import React from "react";
import ResultItem from "../calc/resultitem";
import SVGHourGlass from "../svghourglass";
import SVGInheritance from "./svginheritance";
import SVGPiggy from "../svgpiggy";
import { isFFPossible } from "./cfutils";

interface FFResultProps {
  endYear: number;
  result: any | null;
  ffNomineeAmt: number;
  currency: string;
  hideLabel?: boolean
}

export default function FFResult({
  endYear,
  result,
  ffNomineeAmt,
  currency,
  hideLabel
}: FFResultProps) {
  return (
    <div className="w-full">
      {isFFPossible(result, ffNomineeAmt) ? (
        <div className="py-2 flex flex-wrap justify-around w-full items-start bg-green-100">
          <ResultItem
            svg={<SVGHourGlass />}
            label="Achievable from"
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
          {!result.ffYear
            ? `Analyzed till ${endYear - 20}`
            : `You May Not have Enough Savings in ${result.ffYear}`}
          {`. Please try again with different inputs / goals.`}
        </p>
      )}
    </div>
  );
}
