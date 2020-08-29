import React, { Fragment, ReactNode, useEffect, useRef, useState } from "react";
import { useFullScreen, useFullScreenBrowser } from "react-browser-hooks";
import SVGFullScreen from "../svgfullscreen";
import SVGExitFullScreen from "../svgexitfullscreen";
import DynamicSlider from "../dynamicslider";
import Tabs, { RESULT_TAB_STYLE } from "../tabs";
import VideoPlayer from "../videoplayer";
interface ResultSectionProps {
  result: ReactNode;
  resultTabOptions: Array<any>;
  showResultTab: string;
  children: ReactNode;
  showResultTabHandler: Function;
  chartFullScreenHandler: Function;
  videoUrl: string;
}

export default function ResultSection(props: ResultSectionProps) {
  const chartDiv = useRef(null);
  const { toggle, fullScreen } = useFullScreen({ element: chartDiv });
  const fsb = useFullScreenBrowser();
  const getNumOfTabs = () =>
    fsb.info.innerWidth <= 600 ? 1 : fsb.info.screenWidth <= 800 ? 2 : 3;
  const [numOfTabs, setNumOfTabs] = useState<number>(getNumOfTabs());

  useEffect(() => {
    props.chartFullScreenHandler(fullScreen);
    setNumOfTabs(getNumOfTabs());
  }, [fullScreen]);

  useEffect(() => {
    setNumOfTabs(getNumOfTabs());
  }, [fsb.info.innerWidth]);

  return (
    <div
      ref={chartDiv}
      className={`w-full lg:w-2/3 xl:w-3/4 transition-width duration-1000 ease-in-out`}
    >
      {props.videoUrl ? (
        <VideoPlayer url={props.videoUrl} />
      ) : (
        <Fragment>
          {props.result}
          <div className="flex w-full items-center font-semibold">
            <div className="ml-1 w-1/12 cursor-pointer" onClick={toggle}>
              {!fullScreen ? <SVGFullScreen /> : <SVGExitFullScreen />}
            </div>
            <div className="w-11/12">
              {props.resultTabOptions.length > 1 ? (
                <Tabs
                  tabs={props.resultTabOptions}
                  selectedTab={props.showResultTab}
                  selectedTabHandler={props.showResultTabHandler}
                  capacity={numOfTabs}
                  customStyle={RESULT_TAB_STYLE}
                  allInputDone
                />
              ) : (
                <div className="w-full mt-2 flex justify-center items-center">
                  {props.resultTabOptions[0].svg}
                  <label className="ml-1">
                    {props.resultTabOptions[0].label}
                  </label>
                </div>
              )}
            </div>
          </div>
          <DynamicSlider
            setSlide={props.showResultTabHandler}
            totalItems={props.resultTabOptions}
            currentItem={props.showResultTab}
          >
            {props.children}
          </DynamicSlider>
        </Fragment>
      )}
    </div>
  );
}
