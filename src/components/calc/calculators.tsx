import React from "react";
import { Parallax } from "react-scroll-parallax";
import { ROUTES } from "../../CONSTANTS";
import { isTopBottomLayout } from "../utils";
import CalcItem from "./calcitem";
import { useFullScreenBrowser } from "react-browser-hooks";

interface CalculatorsProps {
  insideMenu?: boolean;
}

export default function Calculators({ insideMenu }: CalculatorsProps) {
  const fsb = useFullScreenBrowser();
  const LIGHT_COLORS = {
    RED: "#FEB2B2",
    ORANGE: "#fbd38d",
    BLUE: "#BEE3F8",
    TEAL: "#B2F5EA",
    INDIGO: "#a3bffa",
    YELLOW: "#faf089",
    GRAY: "#cbd5e0",
    PINK: "#FBB6CE",
    BROWN: "#D3B193",
    //GRAY: "#EEEBEA",
    //GREEN: "DBEAE9"
    GREEN: "#F0FFF4",
    PURPLE: "#E9D8FD",
  };

  const calcItems = [
    {
      title1: "Financial",
      title2: "Freedom",
      desc: "How much Money is Needed?",
      color: LIGHT_COLORS.GRAY,
      link: ROUTES.DASHBOARD,
      img: "images/hero-dashboard-v3.png",
      video: `https://www.youtube.com/watch?v=RH7t3p5zXNA&t=0s`,
    },
    {
      title1: "Buy v/s",
      title2: "Rent",
      desc: "Is it cheaper to Buy or Rent?",
      color: LIGHT_COLORS.BROWN,
      link: ROUTES.DASHBOARD,
      img: "images/sample2.png",
      video: `https://vimeo.com/455216214`,
    },
    {
      title1: "Mortgage",
      title2: "Loan",
      desc: "Should I pay by self or loan?",
      color: LIGHT_COLORS.INDIGO,
      link: ROUTES.DASHBOARD,
      img: "images/sample3.png",
      video: `https://www.youtube.com/watch?v=RH7t3p5zXNA&t=0s`,
    },
    {
      title1: "Education",
      title2: "Loan",
      desc: "Should I pay by self or loan?",
      color: LIGHT_COLORS.ORANGE,
      link: ROUTES.DASHBOARD,
      img: "images/step1.png",
      video: `https://www.youtube.com/watch?v=RH7t3p5zXNA&t=0s`,
    },
    {
      title1: "Debt",
      title2: "Buster",
      desc: "Should I pay by self or loan?",
      color: LIGHT_COLORS.PINK,
      link: ROUTES.DASHBOARD,
      img: "images/step2.png",
      video: `https://www.youtube.com/watch?v=RH7t3p5zXNA&t=0s`,
    },
    {
      title1: "Credit",
      title2: "Impact",
      desc: "How much will be credit score impact if I do not pay my bills?",
      color: LIGHT_COLORS.RED,
      link: ROUTES.DASHBOARD,
      img: "images/step3.png",
      video: `https://www.youtube.com/watch?v=RH7t3p5zXNA&t=0s`,
    },
  ];

  return (
    <div
      className={`w-full flex flex-wrap items-start justify-center pb-1 ${
        !insideMenu && "bg-green-100"
      }`}
    >
      {calcItems.map((item, i) =>
        insideMenu || isTopBottomLayout(fsb) ? (
          <CalcItem key={"cmi" + i} item={item} insideMenu={insideMenu} />
        ) : (
          <Parallax
            className={`w-full h-full m-1 ${i % 2 === 0 ? 'lg:m-8 xl:m-16' : 'py-8'} max-w-sm md:max-w-md xl:max-w-lg`}
            y={[i % 2 === 0 ? 50 : 0, 0]}
          >
            <CalcItem key={"ci" + i} item={item} />
          </Parallax>
        )
      )}
    </div>
  );
}
