import React from "react";
import ReactPlayer from "react-player/lazy";

interface VideoPlayerProps {
  url: string;
  urlHandler: Function;
}

export default function VideoPlayer({ url, urlHandler }: VideoPlayerProps) {
  return (
    <div className="relative" style={{ paddingTop: "56.25%" }}>
      <ReactPlayer
        className="absolute top-0 left-0"
        url={url}
        width="100%"
        height="100%"
        playing={url ? true : false}
        controls
        onEnded={() => urlHandler("")}
        onError={() => {
          {
            /*toast.error(
            "Sorry, an error occurred while trying to play the video!"
          );*/
          }
          urlHandler("");
        }}
      />
    </div>
  );
}
