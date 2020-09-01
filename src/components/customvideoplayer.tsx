import React, { Fragment } from "react";
import SVGClose from "./svgclose";
import VideoPlayer from "./videoplayer";

interface CustomVideoPlayerProps {
  videoUrl: string;
  videoHandler: Function;
}

export default function CustomVideoPlayer(props: CustomVideoPlayerProps) {
  return (
    <Fragment>
      <div
        className="w-full flex justify-end p-1"
        onClick={() => props.videoHandler("")}
      >
        <label className="text-blue-600 mr-1 hover:text-blue-800 cursor-pointer">
          Close
        </label>
        <SVGClose disable={false} />
      </div>
      <VideoPlayer url={props.videoUrl} urlHandler={props.videoHandler} />
    </Fragment>
  );
}
