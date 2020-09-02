import React from "react";
import Link from "next/link";
import { ROUTES } from "../../CONSTANTS";
import ActionableSVG from "./svgactionable";
import FunSVG from "./svgfun";
import PersonalizedSVG from "./svgpersonalized";
import SecureSVG from "./svgsecure";
import GlobalSVG from "./svgglobal";
import PrivateSVG from "./svgprivate";
//@ts-ignore
import { AwesomeButton } from "react-awesome-button";

interface Feature {
  svg: React.ReactNode;
  title: string;
  desc: string;
}

const Features = () => {
  const features: Array<Feature> = [
    {
      svg: <PersonalizedSVG />,
      title: "Personalized",
      desc: "Insights based on Your Goals, Risk Threshold & financial health.",
    },
    {
      svg: <FunSVG />,
      title: "Fun",
      desc: "Games to help You make Smart Money decisions.",
    },
    {
      svg: <ActionableSVG />,
      title: "Actionable",
      desc: "See what You have to achieve today & how it will affect tomorrow.",
    },
    {
      svg: <SecureSVG />,
      title: "Secure",
      desc:
        "Uses latest encryption technology to keep your Identity & Data secure.",
    },
    {
      svg: <GlobalSVG />,
      title: "Global",
      desc: "Time-tested money concepts that work wherever You are.",
    },
    {
      svg: <PrivateSVG />,
      title: "Private",
      desc: "Respects Data Privacy.",
    },
  ];

  return (
    <div className="w-screen mt-4 flex flex-col justify-center text-xl md:text-2xl">
      <p className="text-center lg:text-4xl font-black">
        Hello Financial Freedom!
      </p>
      <p className="mt-4 text-center">GET...SET...GO...</p>
      <div className="mt-4 flex flex-wrap items-center">
        <div className="w-full md:w-1/2 p-2 md:p-4">
          <Link href={ROUTES.DASHBOARD}>
            <a>
              <img alt="Step 1" src="images/step1.png" />
            </a>
          </Link>
        </div>
        <div className="w-full md:w-1/2 p-2 md:p-4">
          <Link href={ROUTES.DASHBOARD}>
            <a>
              <img alt="Step 2" src="images/step2.png" />
            </a>
          </Link>
        </div>
        <div className="w-full md:w-1/2 p-2 md:p-4">
          <Link href={ROUTES.DASHBOARD}>
            <a>
              <img alt="Step 3" src="images/step3.png" />
            </a>
          </Link>
        </div>
        <ul className="cursor w-full md:w-1/2">
          <li>
            <Link href={ROUTES.DASHBOARD}>
              <a>
                <div className="flex justify-center">
                  <AwesomeButton type="link" ripple>
                    GET STARTED
                  </AwesomeButton>
                </div>
              </a>
            </Link>
          </li>
          <li className="mt-4 text-center">
            Kick-start Your Financial Freedom.
          </li>
        </ul>
      </div>
      <div className="m-4 mt-8 text-center bg-green-100">
        <p className="mt-4 text-xl md:text-2xl lg:text-4xl font-black">
          Works Instantly.
        </p>
        <p className="mt-4">Keeps working offline too.</p>
        <p>No App Store Download Needed.</p>
        <img
          className="object-cover w-full mt-4"
          alt="Works across devices"
          src="images/relaxedwoman.jpeg"
        />
      </div>

      <div className="flex flex-wrap justify-around">
        {features.map((f: Feature, i: number) => (
          <ul
            key={i}
            className="w-full flex flex-col justify-center items-center md:w-1/2 lg:w-1/3 mt-4 ml-2 mr-2 text-center max-w-sm rounded overflow-hidden shadow-xl"
          >
            <li className="mt-4 w-12 h-12">{f.svg}</li>
            <li className="text-xl font-bold">{f.title}</li>
            <li className="ml-4 mt-2 text-lg font-normal">{f.desc}</li>
          </ul>
        ))}
      </div>
    </div>
  );
};

export default Features;
