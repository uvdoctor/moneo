import React from "react";
import StepContainer from "./StepContainer";

interface StepProps {
  className: string;
  isPContainer?: boolean;
  y?: any;
  count: string;
  title: string;
  subTitle: string;
  content: string;
  imgAttrs?: any;
  bgColor: string;
  titleColor: string;
}

export default function Step({
  className,
  isPContainer = false,
  y = [],
  count,
  title,
  subTitle,
  content,
  bgColor,
  titleColor,
  imgAttrs,
}: StepProps) {
  const { className: imgClassname, ...rest } = imgAttrs;

  return (
    <StepContainer
      isPContainer={isPContainer}
      className="w-full mt-12 md:w-2/4"
      y={y}
    >
      <div className="step-box">
        <div className={className} style={{ backgroundColor: bgColor }}>
          <div className="grid grid-flow-col font-bold uppercase leading-6">
            <div className="row-span-2 text-6xl opacity-75 text-white leading-10">
              {count}
            </div>
            <div className="col-span-12 text-2xl" style={{ color: titleColor }}>
              {title}
            </div>
            <div className="col-span-12 text-xl">{subTitle}</div>
          </div>
          <p className="mt-5">{content}</p>
          <div className="text-center">
            <img className={`inline ${imgClassname}`} {...rest} />
          </div>
        </div>
      </div>
    </StepContainer>
  );
}
