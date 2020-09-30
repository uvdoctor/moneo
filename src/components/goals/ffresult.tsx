import React from "react";
import ItemDisplay from "../calc/ItemDisplay";
import SVGHourGlass from "../svghourglass";
import SVGPiggy from "../svgpiggy";
import { isFFPossible } from "./cfutils";
import { getAge } from "./goalutils";
interface FFResultProps {
  endYear: number;
  result: any | null;
  ffNomineeAmt: number;
  currency: string;
  ffYearOptions?: any;
}

export default function FFResult({
  endYear,
  result,
  ffNomineeAmt,
  currency,
}: FFResultProps) {
  return (
    <div className="w-full">
      {isFFPossible(result, ffNomineeAmt) ? (
        <div className="py-2 flex justify-around w-full items-start bg-green-100">
            <ItemDisplay
              svg={<SVGHourGlass />}
              label="Earliest At"
              result={getAge(result.ffYear, endYear).toString()}
              noResultFormat
              info={`You May achieve Financial Independence earliest at an age of ${
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
          <ItemDisplay
            result={result.ffAmt}
            svg={<SVGPiggy disabled={false} selected />}
            label={`Potential Savings`}
            currency={currency}
            info="You can Withdraw from this Savings for Your expenses after gaining Financial Independence."
          />
        </div>
      ) : (
        <p className="text-center bg-red-100 font-semibold py-2">
          Financial Independence May not be possible till You turn 70. Please try
          again with different Goals / Inputs.
        </p>
      )}
    </div>
  );
}
