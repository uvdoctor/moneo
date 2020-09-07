import React, { useEffect, useState } from "react";
//@ts-ignore
import { AwesomeButton } from "react-awesome-button";
import SVGClose from "../svgclose";
import SVGProgress from "../svgprogress";
import SVGSave from "../svgsave";

interface ActionButtonsProps {
  submitDisabled: boolean;
  cancelDisabled: boolean;
  submitText: string;
  cancelHandler: Function;
  submitHandler: Function;
}

export default function ActionButtons(props: ActionButtonsProps) {
  const [actionInProgress, setActionInProgress] = useState<boolean>(false);

  useEffect(() => {
    if(!props.submitDisabled) setActionInProgress(false);
  }, [props.submitDisabled]);

  return (
    <footer className="w-full py-2 flex justify-center">
      <AwesomeButton
        type="secondary"
        size="medium"
        disabled={props.cancelDisabled}
        onPress={props.cancelHandler}
      >
        <SVGClose disable={props.cancelDisabled} />
        CANCEL
      </AwesomeButton>

      <AwesomeButton
        className={`ml-8 ${
          props.submitDisabled ? "cursor-not-allowed" : "cursor-pointer"
        }`}
        type="primary"
        size="medium"
        ripple
        onPress={() => {
          console.log("Button is pressed...")
          setActionInProgress(true);
          props.submitHandler();
        }}
        disabled={props.submitDisabled}
      >
        {props.submitDisabled && actionInProgress ? (
          <SVGProgress />
        ) : (
          <SVGSave disable={props.submitDisabled} />
        )}
        <span className="ml-1">
          {props.submitDisabled && actionInProgress
            ? "Processing"
            : props.submitText}
        </span>
      </AwesomeButton>
    </footer>
  );
}
