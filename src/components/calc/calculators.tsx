import React from "react";
import Section from "../form/section";
import SVGScale from "../svgscale";
import { ROUTES } from "../../CONSTANTS";
import SVGFreedom from "../svgfreedom";
import SVGLoan from "../svgloan";

interface CalculatorsProps {
  insideMenu?: boolean;
  insideForm?: boolean;
}

export default function Calculators({
  insideMenu,
  insideForm,
}: CalculatorsProps) {
  const LIGHT_COLORS = {
    RED: "#EEA894",
    ORANGE: "#fbd38d",
    BLUE: "#90cdf4",
    TEAL: "#81e6d9",
    PURPLE: "#d6bcfa",
    YELLOW: "#faf089",
    GRAY: "#cbd5e0",
    PINK: "#f687b3",
    BROWN: "#D3B193",
    //GRAY: "#EEEBEA",
    //GREEN: "DBEAE9"
    GREEN: "#9ae6b4",
  };

  const calcItems = [
    {
      title1: "Financial",
      title2:"Freedom",
      svg: <SVGFreedom />,
      desc: "How much Money is Needed? When will I achieve it?",
      color: LIGHT_COLORS.BLUE,
      link: ROUTES.DASHBOARD,
      img: "images/step1.png",
      video: `https://www.youtube.com/watch?v=RH7t3p5zXNA&t=0s`,
    },
    {
      title1: "Buy v/s",
      title2: "Rent",
      svg: <SVGScale selected />,
      desc: "Is it cheaper to Buy or Rent? Till When?",
      color: LIGHT_COLORS.GREEN,
      link: ROUTES.DASHBOARD,
      img: "images/step2.png",
      video: `https://vimeo.com/455216214`,
    },
    {
      title1: "Mortgage",
      title2: "Loan",
      svg: <SVGLoan selected />,
      desc: "Should I pay by self or loan? How much total interest will I pay?",
      color: LIGHT_COLORS.BROWN,
      link: ROUTES.DASHBOARD,
      img: "images/step3.png",
      video: `https://www.youtube.com/watch?v=RH7t3p5zXNA&t=0s`,
    },
    {
      title1: "Education",
      title2: "Loan",
      svg: <SVGLoan selected />,
      desc: "Should I pay by self or loan? How much total interest will I pay?",
      color: LIGHT_COLORS.RED,
      link: ROUTES.DASHBOARD,
      img: "images/step3.png",
      video: `https://www.youtube.com/watch?v=RH7t3p5zXNA&t=0s`,
    },
    {
      title1: "Debt",
      title2: "Buster",
      svg: <SVGLoan selected />,
      desc: "Should I pay by self or loan? How much total interest will I pay?",
      color: LIGHT_COLORS.TEAL,
      link: ROUTES.DASHBOARD,
      img: "images/step3.png",
      video: `https://www.youtube.com/watch?v=RH7t3p5zXNA&t=0s`,
    },
    {
      title1: "Credit",
      title2: "Impact",
      svg: <SVGLoan selected />,
      desc: "How much will be credit score impact if I do not pay my bills?",
      color: LIGHT_COLORS.GRAY,
      link: ROUTES.DASHBOARD,
      img: "images/step3.png",
      video: `https://www.youtube.com/watch?v=RH7t3p5zXNA&t=0s`,
    },
  ];

  return (
    <div className="w-full flex flex-wrap items-start justify-center pb-1">
      {calcItems.map((item, i) => (
        <Section
          key={"citem" + i}
          title={
            <div className="w-full flex h-full ">
            <div className="w-1/3 h-full flex flex-col items-center justify-center bg-silver">
              {item.svg}
              <p>{item.title1}</p>
              <p>{item.title2}</p>
            </div>
            <div className="w-2/3 p-2 flex justify-center items-center text-base text-white font-normal">
            {item.desc}
          </div>
          </div>
          }
          hasResult
          insideForm={insideForm}
          insideMenu={insideMenu}
          color={item.color}
          imgSrc={item.img}
          videoSrc={item.video}
        />
      ))}
    </div>
  );
}
