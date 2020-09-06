import React from "react";
import Section from "../form/section";
import SVGHourGlass from "../svghourglass";
import SVGScale from "../svgscale";
import { ROUTES } from "../../CONSTANTS";
import SVGBalance from "./svgbalance";
import SVGFreedom from "../svgfreedom";
import SVGPiggy from "../svgpiggy";
import SVGMoneyBag from "./svgmoneybag";
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

  const calcItems1 = [
    {
      title: "Financial Freedom",
      svg: <SVGFreedom />,
      questions: {
        "How much Money?": <SVGPiggy selected />,
        "By When?": <SVGHourGlass />,
      },
      color: LIGHT_COLORS.RED,
      link: ROUTES.DASHBOARD,
      img: "images/step1.png",
      video: `https://www.youtube.com/watch?v=RH7t3p5zXNA&t=0s`,
    },
    {
      title: "Buy v/s Rent",
      svg: <SVGScale selected />,
      questions: {
        "Which is Cheaper?": <SVGBalance />,
        "For how many Years?": <SVGHourGlass />,
      },
      color: LIGHT_COLORS.BROWN,
      link: ROUTES.DASHBOARD,
      img: "images/step2.png",
      video: `https://vimeo.com/455216214`,
    },
  ];

  const calcItems2 = [
    {
      title: "Mortgage Loan",
      svg: <SVGLoan selected />,
      questions: {
        "Pay by Self or Loan?": <SVGBalance />,
        "How much Total Interest?": <SVGMoneyBag selected />,
      },
      color: LIGHT_COLORS.ORANGE,
      link: ROUTES.DASHBOARD,
      img: "images/step3.png",
      video: `https://www.youtube.com/watch?v=RH7t3p5zXNA&t=0s`,
    },
    {
      title: "Education Loan",
      svg: <SVGLoan selected />,
      questions: {
        "Pay by Self or Loan?": <SVGBalance />,
        "How much Total Interest?": <SVGMoneyBag selected />,
      },
      color: LIGHT_COLORS.PINK,
      link: ROUTES.DASHBOARD,
      img: "images/step3.png",
      video: `https://www.youtube.com/watch?v=RH7t3p5zXNA&t=0s`,
    },
  ]

  return (
    <div className="w-full flex flex-wrap items-start justify-around pb-1 text-white">
      <div className="flex flex-col text-default">
        <div className="w-full text-center h-24">
        <p>Calculators</p>
          <p>Estimates Only. No Advice.</p>
        </div>
        {calcItems2.map((item) => (
          <Section
            title={item.title}
            titleSVG={item.svg}
            left={
              <div
                className={`flex ${
                  insideMenu
                    ? "flex-col"
                    : "flex-wrap items-center justify-around"
                }`}
              >
                {Object.keys(
                  //@ts-ignore
                  item.questions
                ).map((key) => (
                  <div className="flex items-center mb-1">
                    {
                      //@ts-ignore
                      item.questions[key]
                    }
                    <span className="ml-1">{key}</span>
                  </div>
                ))}
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
      <div className="flex flex-col">
        {calcItems1.map((item) => (
          <Section
            title={item.title}
            titleSVG={item.svg}
            left={
              <div
                className={`flex ${
                  insideMenu
                    ? "flex-col"
                    : "flex-wrap items-center justify-around"
                }`}
              >
                {Object.keys(
                  //@ts-ignore
                  item.questions
                ).map((key) => (
                  <div className="flex items-center mb-1">
                    {
                      //@ts-ignore
                      item.questions[key]
                    }
                    <span className="ml-1">{key}</span>
                  </div>
                ))}
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
    </div>
  );
}
