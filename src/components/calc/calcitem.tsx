import Link from "next/link";
import React, { useState } from "react";
import SVGPlay from "../svgplay";
import SVGStop from "../svgstop";
import VideoPlayer from "../videoplayer";

interface CalcItemProps {
  item: any;
  insideMenu?: boolean;
}

export default function CalcItem({ item, insideMenu }: CalcItemProps) {
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [showDesc, setShowDesc] = useState<boolean>(false);

  return (
      <div
        className={`m-1 w-full flex flex-col text-white cursor-pointer ${
          insideMenu && "max-w-xs md:ml-3 lg:ml-6 mr-3 lg:mr-6"
        } rounded-lg`}
        style={{
          backgroundColor: item.color,
          minHeight: !insideMenu ? "24rem" : "6rem",
        }}
        onMouseEnter={() => setShowDesc(true)}
        onMouseLeave={() => setShowDesc(false)}
      >
        <Link href={item.link}>
          <a>
            <div
              className="flex w-full"
              style={{ minHeight: !insideMenu ? "9rem" : "6rem" }}
            >
              <div
                className={`${showDesc ? "text-default" : "text-white"} ${
                  insideMenu
                    ? "w-full self-center"
                    : "w-2/3 md:w-1/2 text-2xl self-end"
                } flex flex-col items-center font-bold`}
              >
                <p>{item.title1}</p>
                <p>{item.title2}</p>
              </div>
              <div
                className={`w-full flex ${
                  insideMenu ? "text-base items-center" : "text-lg items-end"
                } font-normal`}
              >
                {(insideMenu || showDesc) && item.desc}
              </div>
            </div>
          </a>
        </Link>
        {!insideMenu && (
          <div className="w-full flex flex-col justify-end items-end">
            <div
              className="w-full p-1 flex items-end justify-end"
              onClick={() =>
                //@ts-ignore
                setVideoUrl(!videoUrl ? item.video : "")
              }
            >
              {!videoUrl ? <SVGPlay /> : <SVGStop />}
            </div>
            <div className="w-full flex items-end justify-end">
              <div className="w-1/2"></div>
              <div className="w-full h-full">
                {!videoUrl ? (
                  <Link href={item.link}>
                    <a>
                      <img
                        className="h-64 object-contain rounded-lg cursor-pointer"
                        src={item.img}
                      />
                    </a>
                  </Link>
                ) : (
                  <VideoPlayer url={videoUrl} urlHandler={setVideoUrl} />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
  );
}
