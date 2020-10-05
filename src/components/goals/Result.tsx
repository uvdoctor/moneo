import React, { Fragment, ReactNode, useRef } from "react";
import { useFullScreen } from "react-browser-hooks";
import SVGFullScreen from "../svgfullscreen";
import SVGExitFullScreen from "../svgexitfullscreen";
import DynamicSlider from "../dynamicslider";
import Tabs from "../tabs";
interface ResultProps {
  result: ReactNode;
  resultTabOptions: Array<any>;
  showResultTab: string;
  children: ReactNode;
  showResultTabHandler: Function;
}

export default function Result(props: ResultProps) {
  const chartDiv = useRef(null);
  const { toggle, fullScreen } = useFullScreen({ element: chartDiv });

  return (
    <div
      ref={chartDiv}
      className={`w-full transition-width duration-1000 ease-in-out`}
    >
      <Fragment>
        {props.result}
        <div className="flex w-full items-center mt-2 mb-2">
          <div className="ml-1 mr-4 cursor-pointer" onClick={toggle}>
            {!fullScreen ? <SVGFullScreen /> : <SVGExitFullScreen />}
          </div>
          <div className="w-full">
            {props.resultTabOptions.length > 1 ? (
              <Tabs
                tabs={props.resultTabOptions}
                selectedTab={props.showResultTab}
                selectedTabHandler={props.showResultTabHandler}
                capacity={props.resultTabOptions.length}
                allInputDone
                keepCentered
              />
            ) : (
              <div className="w-full mt-2 flex justify-center items-center">
                {props.resultTabOptions.map((tab, i) => (
                  <Fragment key={"t" + i}>
                    <tab.svg selected />
                    <label className="ml-1">{tab.label}</label>
                  </Fragment>
                ))}
              </div>
            )}
          </div>
        </div>
        <DynamicSlider
          setSlide={props.showResultTabHandler}
          totalItems={props.resultTabOptions}
          currentItem={props.showResultTab}
        >
          {React.Children.map(props.children, (child: any) =>
            child ? child : null
          )}
        </DynamicSlider>
      </Fragment>
    </div>
  );
}
