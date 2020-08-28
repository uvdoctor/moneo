import React, { ReactNode, useEffect, useRef, useState } from "react";
import { useFullScreen, useFullScreenBrowser } from "react-browser-hooks";
import SVGFullScreen from "../svgfullscreen";
import SVGExitFullScreen from "../svgexitfullscreen";
import DynamicSlider from "../dynamicslider";
import Tabs, { RESULT_TAB_STYLE } from "../tabs"
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
  const fsb = useFullScreenBrowser()
  const getNumOfTabs = () => fsb.info.innerWidth <= 600 ? 1 : fsb.info.screenWidth <= 800 ? 2 : 3
  const [numOfTabs, setNumOfTabs] = useState<number>(getNumOfTabs())

  useEffect(() => {
    props.chartFullScreenHandler(fullScreen)
    setNumOfTabs(getNumOfTabs())
  }, [fullScreen])

  useEffect(() => {
    setNumOfTabs(getNumOfTabs())
  }, [fsb.info.innerWidth])

  return (
    <div
      ref={chartDiv}
      className={`w-full lg:w-2/3 xl:w-3/4 transition-width duration-1000 ease-in-out`}
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
            capacity={numOfTabs}
            customStyle={RESULT_TAB_STYLE}
            allInputDone
          />
        </div>
      </div>
      <DynamicSlider
        setSlide={props.showResultTabHandler}
        totalItems={props.resultTabOptions}
        currentItem={props.showResultTab}
      >
        {props.children}
      </DynamicSlider>
    </div>
  );
}
