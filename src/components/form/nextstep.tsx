import React from "react";
//@ts-ignore
import { AwesomeButton } from "react-awesome-button";
import SVGNext from "../svgnext";
interface NextStepProps {
  nextStepHandler: Function;
  disabled: boolean;
  actionCount?: number;
}

export default function NextStep({
  nextStepHandler,
  disabled,
  actionCount,
}: NextStepProps) {
  return (
    <div
      className={`mt-2 flex justify-center w-full ${
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      }`}
      onClick={() =>
        !disabled && nextStepHandler(actionCount ? actionCount : 1)
      }
    >
      <SVGNext disabled={disabled} />
    </div>
  );
}
