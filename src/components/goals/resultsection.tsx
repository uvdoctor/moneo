import React, { Fragment, ReactNode, useEffect, useRef } from "react";
import { useFullScreen } from "react-browser-hooks";
import SVGFullScreen from "../svgfullscreen";
import SVGExitFullScreen from "../svgexitfullscreen";
import DynamicSlider from "../dynamicslider";
import Tabs from "../tabs";
import VideoPlayer from "../videoplayer";
interface ResultSectionProps {
  result: ReactNode;
  resultTabOptions: Array<any>;
  showResultTab: string;
  children: ReactNode;
  showResultTabHandler: Function;
  chartFullScreenHandler: Function;
  videoUrl: string;
  videoHandler: Function
}

export default function ResultSection(props: ResultSectionProps) {
  const chartDiv = useRef(null);
  const { toggle, fullScreen } = useFullScreen({ element: chartDiv });

  useEffect(() => {
    props.chartFullScreenHandler(fullScreen);
  }, [fullScreen]);

  return (
    <div
      ref={chartDiv}
      className={`w-full lg:w-2/3 xl:w-3/4 transition-width duration-1000 ease-in-out`}
    >
      {props.videoUrl ? (
        <VideoPlayer url={props.videoUrl} urlHandler={props.videoHandler} />
      ) : (
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
