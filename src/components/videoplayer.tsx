import React from "react";
import ReactPlayer from "react-player/lazy";

interface VideoPlayerProps {
  url: string;
}

export default function VideoPlayer({ url }: VideoPlayerProps) {
  
  return (
      <div className="relative" style={{ paddingTop: "56.25%" }}>
        <ReactPlayer
          className="absolute top-0 left-0"
          url={url}
          width="100%"
          height="100%"
          target="_parent"
        />
      </div>
  );
}
