import React, { ReactNode, useEffect, useRef } from "react";
import { useFullScreen } from "react-browser-hooks";
import SVGFullScreen from "../svgfullscreen";
import SVGExitFullScreen from "../svgexitfullscreen";
import Slider from "../Slider";
import Tabs from "../tabs"
interface ResultSectionProps {
    result: ReactNode
    resultTabOptions: Array<any>
    showResultTab: string
    children: ReactNode
    showResultTabHandler: Function
    chartFullScreenHandler: Function
}

export default function ResultSection(props: ResultSectionProps) {
  const chartDiv = useRef(null);
  const { toggle, fullScreen } = useFullScreen({ element: chartDiv });
  
  useEffect(() => {
    props.chartFullScreenHandler(fullScreen)
  }, [fullScreen])

  return (
    <div
      ref={chartDiv}
      className={`w-full lg:w-2/3 transition-width duration-1000 ease-in-out`}
    >
      {props.result}
      <div className="flex w-full items-center font-semibold">
        <div className="ml-1 w-1/12 cursor-pointer" onClick={toggle}>
          {!fullScreen ? <SVGFullScreen /> : <SVGExitFullScreen />}
        </div>
        <div className="w-11/12">
          <Tabs
            tabs={props.resultTabOptions}
            selectedTab={props.showResultTab}
            selectedTabHandler={props.showResultTabHandler}
            capacity={2}
            customStyle="resultTab"
            allInputDone
          />
        </div>
      </div>
      <Slider
        setSlide={props.showResultTabHandler}
        totalItems={props.resultTabOptions}
        currentItem={props.showResultTab}
      >
        {props.children}
      </Slider>
    </div>
  );
}
