import React, { useEffect, useRef } from "react";
import { INPUT_HIGHLIGHT } from "../../CONSTANTS";
import NextStep from "./nextstep";

interface TextInputProps {
  inputOrder: number;
  currentOrder: number;
  nextStepDisabled: boolean;
  nextStepHandler: Function;
  allInputDone: boolean;
  pre: string;
  post?: string;
  value: string;
  width?: string;
  name: string;
  placeholder?: string;
  changeHandler: Function;
}

export default function TextInput(props: TextInputProps) {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // @ts-ignore: Object is possibly 'null'.
    if (formRef) formRef.current.reportValidity();
  }, [formRef]);

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <div className="w-full flex items-center justify-center">
      {((!props.allInputDone && props.inputOrder <= props.currentOrder) ||
        props.allInputDone) && (
        <form
          ref={formRef}
          className={`flex flex-col 
                    ${
                      !props.allInputDone &&
                      props.inputOrder === props.currentOrder &&
                      INPUT_HIGHLIGHT
                    }`}
        >
          {props.pre && <label>{props.pre}</label>}
          <input
            className="input"
            type="text"
            name={props.name}
            placeholder={props.placeholder}
            value={props.value}
            onChange={(e) => props.changeHandler(e.currentTarget.value)}
            required
            style={{ width: `${props.width}` }}
            onKeyDown={handleKeyDown}
          />
          {props.post && <label>{props.post}</label>}
        </form>
      )}
      {!props.allInputDone && props.inputOrder === props.currentOrder && (
        <NextStep
          nextStepHandler={props.nextStepHandler}
          disabled={props.nextStepDisabled}
        />
      )}
    </div>
  );
}
