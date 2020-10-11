import React, { Fragment, useState } from "react";
import VideoPlayer from "../videoplayer";
import SVGPlay from "../svgplay";
import SVGStop from "../svgstop";
import Link from "next/link";
import { Row, Col } from "antd";
interface SectionProps {
  title: any;
  left?: any;
  right?: any;
  bottomLeft?: any;
  bottomRight?: any;
  bottom?: any;
  footer?: any;
  toggle?: any;
  manualInput?: any;
  manualMode?: number;
  hasResult?: boolean;
  insideForm?: boolean;
  color?: string;
  videoSrc?: string;
  link?: string;
}

export default function Section(props: SectionProps) {
  const [videoUrl, setVideoUrl] = useState<string>("");

  return (
    <Fragment>
    <div
      className="m-1 w-full max-w-sm md:max-w-md xl:max-w-lg
      rounded-lg shadow-lg md:shadow-xl"
      style={{ backgroundColor: props.color ? props.color : "transparent" }}
    >
      <div
        className={`w-full ${
          props.insideForm && "bg-gray-700 text-white"
        } flex justify-between relative"
        }`}
        >
          <Row>
            <Col span={8}>
        <Link href={props.link ? props.link : ""}>
          <a>
            <div
              className={`p-1 ${
                !props.insideForm && "hover:text-green-primary cursor-pointer"
              }`}
            >
              {props.title}
            </div>
          </a>
              </Link>
              </Col>
            {props.videoSrc && (
              <Col span={4} offset={12}>
          <div
            className="p-1 flex items-center justify-end"
            onClick={() =>
              setVideoUrl(!videoUrl ? props.videoSrc as string : "")
            }>
            {!videoUrl ? <SVGPlay /> : <SVGStop />}
            <label
              className={`ml-1 cursor-pointer ${
                videoUrl && "text-red-600"
              } hover:text-red-600`}
            >
              Video
            </label>
          </div>
                </Col>
            )}
            </Row>
      </div>
      {videoUrl && <VideoPlayer url={videoUrl} urlHandler={setVideoUrl} />}
      {props.toggle && (
        <div className="flex justify-end mt-2 mr-4">{props.toggle}</div>
      )}
      {props.manualMode && props.manualMode > 0 ? (
        props.manualInput
      ) : (
        <Row>
          {(props.left || props.right) && (
            <Row>
              {props.left && (
                    <Col span={props.hasResult ? 20 : 10} offset={2}>
                  {props.left}
                </Col>
              )}
              {props.right && <Col span={10} offset={2}>{props.right}</Col>}
            </Row>
          )}
          {props.bottom && (
                <Row>
                  {props.bottomLeft && <Col span={4} offset={2}>
                    {props.bottomLeft}
                  </Col>}
                  <Col span={12}>
                    {props.bottom}
                  </Col>
                  {props.bottomRight && <Col span={4} offset={2}>
                    {props.bottomRight}
                  </Col>}
            </Row>
          )}
          {props.footer && (
            <div className="mt-2 flex justify-center text-base">
              {props.footer}
            </div>
          )}
        </Row>
      )}
      </div>
      </Fragment>
  );
}
