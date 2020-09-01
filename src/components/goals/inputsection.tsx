import React, { ReactNode } from "react";
import ActionButtons from "../form/actionbuttons";
import Tabs from "../tabs";

interface InputSectionProps {
  tabOptions: Array<any>;
  currentOrder: number;
  allInputDone: boolean;
  submitDisabled: boolean;
  cancelDisabled: boolean;
  showTab: string;
  children: ReactNode;
  showTabHandler: Function;
  cancelCallback: Function;
  handleSubmit: Function;
}

export default function InputSection({
  tabOptions,
  currentOrder,
  allInputDone,
  submitDisabled,
  cancelDisabled,
  showTab,
  children,
  showTabHandler,
  cancelCallback,
  handleSubmit,
}: InputSectionProps) {

  return (
    <div
      className={`w-full ${
        allInputDone && "lg:w-1/3 xl:w-1/4"
      } items-start transition-width duration-500 ease-in-out flex flex-col-reverse lg:flex-col`}
    >
      {(allInputDone || currentOrder >= tabOptions[0].order) && (
        <Tabs
          tabs={tabOptions}
          selectedTab={showTab}
          selectedTabHandler={showTabHandler}
          capacity={tabOptions.length}
          currentOrder={currentOrder}
          allInputDone={allInputDone}
        />
      )}
      <div className="w-full flex flex-wrap justify-center">
        {React.Children.map(children, (child: any) =>
          (allInputDone || currentOrder >= tabOptions[0].order) && child
            ? child
            : null
        )}
      </div>
      <ActionButtons
        submitDisabled={submitDisabled}
        cancelDisabled={cancelDisabled}
        cancelHandler={cancelCallback}
        submitHandler={handleSubmit}
        submitText="SAVE"
      />
    </div>
  );
}
