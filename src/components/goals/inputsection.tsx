import React, { ReactNode, useEffect, useState } from "react";
import ActionButtons from "../form/actionbuttons";
import Tabs from "../tabs";
import { useFullScreenBrowser } from "react-browser-hooks";

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
  const fsb = useFullScreenBrowser();
  const [tabsCapacity, setTabsCapacity] = useState<number>(3);

  useEffect(() => {
    let width = fsb.info.innerWidth
    if(width >= 1024) setTabsCapacity(3)
    else setTabsCapacity(Math.floor(fsb.info.innerWidth / 100));
  }, [fsb.info.innerWidth]);

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
          capacity={tabsCapacity}
          currentOrder={currentOrder}
          allInputDone={allInputDone}
          bottomRounded
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
