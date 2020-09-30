import React from "react";
import ActionableSVG from "../../components/features/svgactionable";
import FunSVG from "../../components/features/svgfun";
import GlobalSVG from "../../components/features/svgglobal";
import SVGPersonalized from "../../components/features/svgpersonalized";
import ResultItem from "../../components/calc/resultitem";

interface GetRichProps {
  featuresRef: string;
}

export default function GetRich({ featuresRef }: GetRichProps) {
  const featuresList = [
    {
      label: "Holistic Financial Health",
      svg: ActionableSVG,
      desc:
        "Analyzes Your Net Worth Across Currencies & if Your Money is working hard enough.",
    },
    {
      label: "Goal-based Savings",
      svg: ActionableSVG,
      desc:
        "To Identify what has to be achieved today & how it will affect tomorrow.",
    },
    {
      label: "Uncover Money Leaks",
      svg: FunSVG,
      desc: "Such as hidden fees, unwanted subscriptions, bank charges, etc.",
    },
    {
      label: "Investment Insights",
      svg: SVGPersonalized,
      desc: "Based on Your Goals, Risk Threshold & Financial Health.",
    },
    {
      label: "Diversify Globally",
      svg: GlobalSVG,
      desc:
        "To Maximize Earning Opportunities & Reduce Risk of over-reliance on 1 Country & Currency. ",
    },
    {
      label: "Adaptable Financial Plan",
      svg: GlobalSVG,
      desc:
        "That Evolves with Your Goals. Understand long-term impact of Your decisions.",
    },
    {
      label: "No Commissions. Ever.",
      svg: SVGPersonalized,
      desc:
        "Analysis that's driven solely by Your Financial Well-being. No hidden agenda or fees.",
    },
    {
      label: "Easy to Use",
      svg: FunSVG,
      desc:
        "No complex jargons. Helps You to take simple clear steps towards Your Financial Independence.",
    },
  ];

  return (
    <div className="bg-white pb-10">
      <div
        className="pt-10 m-auto"
        style={{
          maxWidth: "1280px",
          paddingRight: "1rem",
          paddingLeft: "1rem",
        }}
      >
        <div ref={featuresRef} className="flex-1">
          <h2 className="text-3xl text-green-primary">Get Rich Slowly</h2>
          <p className="text-xl mt-2">
            No More Boring Budgets or Confusing Investment Choices. DollarDarwin
            helps You to Grow Your Money without taking any undue stress.
          </p>
          <div className="w-full">
            <div className="w-full md:flex md:flex-wrap md:justify-around">
              {featuresList.map((feature, i) => (
                <div
                  key={"f" + i}
                  className={`mt-4 flip-card bg-transparent w-full md:w-64 h-40`}
                >
                  <div className="flip-card-inner relative w-full h-full shadow-lg rounded-lg">
                    <div className="flip-card-front bg-gray-100 text-default w-full h-full absolute flex items-center justify-center rounded-lg cursor-pointer">
                      <ResultItem
                        svg={<feature.svg />}
                        result={feature.label}
                        vertical
                      />
                    </div>
                    <div className="flip-card-back text-white absolute w-full h-full rounded-lg p-1 bg-green">
                      <ResultItem
                        svg={<feature.svg />}
                        result={feature.label}
                        vertical
                      />
                      <p className="mt-2 text-base">{feature.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
