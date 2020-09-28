import React, { useEffect, useRef, useState } from "react";
import { useScroll } from "react-browser-hooks";
import Nav from "./Nav";
import { CALC_NAMES, COLORS, ROUTES } from "../CONSTANTS";
import GoalImages from "./goalimages";
import FunSVG from "./features/svgfun";
import ActionableSVG from "./features/svgactionable";
import GlobalSVG from "./features/svgglobal";
import SVGPersonalized from "./features/svgpersonalized";
import ResultItem from "./calc/resultitem";
import SVGLoan from "./svgloan";
import SVGScale from "./svgscale";
import SVGFreedom from "./svgfreedom";
import SVGEduLoan from "./svgeduloan";
import SVGScissor from "./svgscissor";
import SVGAnalyze from "./svganalyze";
import Link from "next/link";
import PContainer from "./pcontainer";
import * as gtag from "../lib/gtag";
import SocialShare from "./socialshare";
import ExpandCollapse from "./form/expandcollapse";
import DDPage from "./ddpage";

export default function Main() {
  const { top } = useScroll();
  const [calcIndex, setCalcIndex] = useState<number>(-1);
  const [scrolledToSec, setScrolledToSec] = useState<boolean>(false);
  const joinRef: any = useRef();
  const calculateRef: any = useRef();
  const featuresRef: any = useRef();
  const securityRef: any = useRef();

  const calcList: Array<any> = [
    {
      name: CALC_NAMES.FI,
      link: ROUTES.FI,
      svg: SVGFreedom,
      desc:
        "Figure out Earliest Possible Year & Minimum Savings needed for FI.",
    },
    {
      name: CALC_NAMES.BR,
      link: ROUTES.BR,
      svg: SVGScale,
      desc:
        "Find out whether its cheaper to Buy or Rent & Invest remaining amount, as well as duration for which the option is cheaper.",
    },
    {
      name: CALC_NAMES.EDU_LOAN,
      link: ROUTES.EDUCATION,
      svg: SVGEduLoan,
      desc:
        "Analyze the simple interest to be paid while studying, and EMI payments to be made after study is over.",
    },
    {
      name: CALC_NAMES.DR,
      link: ROUTES.LOAN,
      svg: SVGScissor,
      desc:
        "Identify the optimal sequence of paying various loans that makes sense for You.",
    },
    {
      name: CALC_NAMES.CI,
      link: ROUTES.LOAN,
      svg: SVGAnalyze,
      desc:
        "Assess impact on Your credit score for various factors such as hard inquiry, delayed payment, etc.",
    },
    {
      name: CALC_NAMES.LOAN,
      link: ROUTES.LOAN,
      svg: SVGLoan,
      desc:
        "Understand the amortization schedule and total interest to be paid for a simple loan.",
    },
  ];

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

  useEffect(() => {
    const opts = {
      root: null,
      rootMargin: "0px",
      threshold: 0,
    };

    const featuresCallback = (list: Array<any>) => {
      list.forEach((entry: any) => {
        if (entry.isIntersecting) {
          gtag.event({
            category: "Home",
            action: "Scroll",
            label: "Section",
            value: "Features",
          });
        }
      });
    };

    const secCallback = (list: Array<any>) => {
      list.forEach((entry: any) => {
        if (entry.isIntersecting) {
          setScrolledToSec(true)
          gtag.event({
            category: "Home",
            action: "Scroll",
            label: "Section",
            value: "Security"
          });
        } else setScrolledToSec(false)
      });
    };

    const featuresScrollObserver = new IntersectionObserver(featuresCallback, opts);
    featuresScrollObserver.observe(featuresRef.current);
    const secScrollObserver = new IntersectionObserver(secCallback, opts);
    secScrollObserver.observe(securityRef.current);
    return () => {
      featuresScrollObserver.disconnect();
      secScrollObserver.disconnect();
    }
  }, []);

  return (
    <DDPage title="DollarDarwin">
      <div className="max-w-screen-xl m-auto">
        <div
          className={`fixed w-full h-16 left-0 z-10 ${top > 10 && "shadow-lg"}`}
          style={{
            backgroundImage:
              top > 10
                ? "linear-gradient(to bottom, #fff, #fff)"
                : "linear-gradient(to bottom, #dbedca, rgba(246,246,246,0))",
          }}
        ></div>
        <Nav
        	joinRef={joinRef}
        	calculateRef={calculateRef}
        	featuresRef={featuresRef}
        />
        <div className="relative">
          <div
            className="absolute w-full mt-20"
            style={{ top: "90px", left: "1rem" }}
          >
            <p className="text-xl font-bold">Your Financial Analyst</p>
            <h2 className="text-3xl font-bold" style={{ color: "#499824" }}>
              Stress-free Savings &amp; Investments
            </h2>
            <div className="flex items-center">
              <p className="text-xl font-bold">Meet Your Goals</p>
              <GoalImages />
            </div>
            <h2
              ref={joinRef}
              className="text-xl mt-20 w-4/12 font-bold"
              style={{ color: "#499824" }}
            >
              <ExpandCollapse title="Join Waitlist & Earn up to $200 credit*">
                <div className="w-full relative">
                  <ul className="w-full absolute z-10 bg-white text-center">
                    <li>First 100 get $200 credit</li>
                    <li>Next 900 get $150 credit</li>
                    <li>Next 2,000 get $100 credit</li>
                    <li>Next 3,000 get $75 credit</li>
                    <li>Next 4,000 get $50 credit</li>
                    <li>Next 5,000 get $30 credit</li>
                    <li>All others get $15 credit</li>
                  </ul>
                </div>
              </ExpandCollapse>
            </h2>

            <div className="w-4/12 bg-white border border-gray-500 rounded-md p-1 mt-5">
              <input
                className="w-3/4 p-2"
                type="text"
                placeholder="Enter email address"
              />
              <button
                className="w-1/4 border rounded-md text-white p-2"
                style={{ backgroundColor: "#499824" }}
              >
                Join
              </button>
            </div>
            <div className="mt-4 w-4/12">
              <SocialShare url={`https://dollardarwin.com`} />
            </div>
          </div>
          <img src="images/cover.jpg" />
        </div>
      </div>

      <div className="h-4" style={{ backgroundColor: "#3d4a53" }}></div>
      <div className="h-2" style={{ backgroundColor: "#499824" }}></div>

      <div className="max-w-screen-xl m-auto">
        <div
          className="p-20 pl-0"
          style={{
            maxWidth: "1280px",
            paddingRight: "1rem",
            paddingLeft: "1rem",
          }}
        >
          <div
            className="w-3/4 border rounded-lg p-3 m-auto"
            style={{
              backgroundColor: "#c3c3c3",
              boxShadow: "0 0 10px #8b8b8b",
            }}
          >
            <div
              ref={calculateRef}
              className="bg-white border rounded-lg p-10"
              style={{
                backgroundImage: "linear-gradient(to bottom, #ebebeb, #d1d1d1)",
              }}
            >
              <div
                className="border rounded-lg p-3"
                style={{
                  backgroundColor: "#d0d0d0",
                  border: "1px solid #afafaf",
                }}
              >
                <div
                  className="bg-white border rounded-lg p-4 text-center"
                  style={{
                    backgroundImage:
                      "linear-gradient(to left, #b5be93, #d2d6bc)",
                    border: "5px solid #989898",
                  }}
                >
                  <img
                    className="inline-block"
                    src="images/try-advance-calculator.jpg"
                  />
                </div>
              </div>

              <div
                className={`grid grid-cols-3 gap-10 justify-items-stretch mt-10 h-56`}
              >
                {calcList.map((calc: any, i: number) => (
                  <Link key={"calc" + i} href={calc.link}>
                    <a>
                      <div
                        className={`w-56 h-24 absolute cursor-pointer flex flex-col justify-center p-1 text-white rounded-lg transition-all transform duration-500 linear ${
                          calcIndex >= 0 && calcIndex !== i
                            ? "scale-50 opacity-0"
                            : calcIndex === i &&
                              "text-green-primary md:text-xl lg:text-2xl"
                        }`}
                        style={{
                          backgroundImage: `linear-gradient(to left, ${
                            calcIndex === i ? "white" : "#6f6f6f"
                          }, ${
                            calcIndex === i ? COLORS.LIGHT_GRAY : "#4a4a4a"
                          })`,
                          border: calcIndex === i ? "" : "5px solid #8b8b8b",
                          width: calcIndex === i ? "820px" : "",
                          height: calcIndex === i ? "250px" : "",
                          transform:
                            calcIndex === i
                              ? `translate(${
                                  i === 5
                                    ? "-570px, -150px"
                                    : i === 2
                                    ? "-570px, 0px"
                                    : i === 3
                                    ? "0px, -150px"
                                    : i === 4
                                    ? "-290px, -150px"
                                    : i === 1
                                    ? "-290px, 0px"
                                    : ""
                                })`
                              : "",
                        }}
                        onMouseEnter={() => setCalcIndex(i)}
                        onMouseLeave={() => setCalcIndex(-1)}
                      >
                        <ResultItem
                          svg={
                            <calc.svg
                              disabled={calcIndex !== i}
                              selected={calcIndex === i}
                            />
                          }
                          result={calc.name}
                          vertical
                        />
                        {calcIndex === i && (
                          <label
                            className="mt-4 text-default"
                            style={{ animation: "fadeIn 1s 1" }}
                          >
                            {calc.desc}
                          </label>
                        )}
                      </div>
                    </a>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-32" style={{ paddingRight: "50%" }}>
            <h2 className="text-3xl">Hello Financial Independence!</h2>
            <p className="text-xl mt-2">
              Stop Trading Time for Money. Live on Your Terms. Realize Your Full
              Potential. Fulfill Your Dreams.
            </p>
            <p className="text-xl mt-2 text-green-primary font-bold">
              Just 3 Steps: GET...SET...GO
            </p>
          </div>
          <div className="w-full flex flex-wrap">
            <PContainer format="w-full md:w-2/4 -mt-8" y={[20, 0]}>
              <div className="w-full">
                <div
                  className="rounded-lg p-16 pb-5 mr-5"
                  style={{ backgroundColor: "#dff1c7" }}
                >
                  <div className="grid grid-flow-col font-bold uppercase leading-6">
                    <div className="row-span-2 text-6xl opacity-75 text-white leading-10">
                      01
                    </div>
                    <div
                      className="col-span-12 text-2xl"
                      style={{ color: "#499824" }}
                    >
                      Get
                    </div>
                    <div className="col-span-12 text-xl">Net Worth</div>
                  </div>
                  <p className="mt-5">
                    Link with various accounts to automatically calculate, what
                    you own minus, what you owe.
                  </p>
                  <img className="mt-5" src="images/step1.jpg" />
                </div>
              </div>
            </PContainer>
            <div
              className="w-2/4"
              style={{ transform: "translate3d(0,-130px,0)" }}
            >
              <div
                className="rounded-lg p-16 pb-16 ml-5"
                style={{ backgroundColor: "#fcebcf" }}
              >
                <div className="grid grid-flow-col font-bold uppercase leading-6">
                  <div className="row-span-2 text-6xl opacity-75 text-white leading-10">
                    02
                  </div>
                  <div
                    className="col-span-12 text-2xl"
                    style={{ color: "#e99507" }}
                  >
                    Set
                  </div>
                  <div className="col-span-12 text-xl">Goals</div>
                </div>
                <p className="mt-5">
                  Estimate money required across multiple currencies using
                  in-built templates and calculators.
                </p>
                <img className="mt-24" src="images/step2.jpg" />
              </div>
            </div>
            <PContainer format="w-full md:w-2/4 -mt-12" y={[20, -10]}>
              <div className="w-full">
                <div
                  className="rounded-lg p-16 pb-5 mr-5 mt-10"
                  style={{ backgroundColor: "#ffded8" }}
                >
                  <div className="grid grid-flow-col font-bold uppercase leading-6">
                    <div className="row-span-2 text-6xl opacity-75 text-white leading-10">
                      03
                    </div>
                    <div
                      className="col-span-12 text-2xl"
                      style={{ color: "#d5492e" }}
                    >
                      Go
                    </div>
                    <div className="col-span-12 text-xl">Make Money work</div>
                  </div>
                  <p className="mt-5">
                    Helps you to not only align savings &amp; investements to
                    goals, but also become more financially savvy via engaging
                    games.
                  </p>
                  <img className="w-full mt-5" src="images/laptopwithpig.png" />
                </div>
              </div>
            </PContainer>
            <div
              className="w-2/4"
              style={{ transform: "translate3d(0,-130px,0)" }}
            >
              <div
                className="rounded-lg p-16 ml-5 mt-8"
                style={{ backgroundColor: "#dce7ef" }}
              >
                <h2 className="text-2xl">
                  Kick-start Your Financial Independence
                </h2>
                <button
                  className="w-1/4 border rounded-md text-white p-2 mt-5"
                  style={{ backgroundColor: "#499824" }}
                >
                  Get Started
                </button>
                <img className="mt-16" src="images/kick-start.jpg" />
              </div>
            </div>
          </div>

          <div ref={securityRef} className={`bg-transparent ${scrolledToSec && 'bg-green-100'} flex justify-items-auto mt-16 transition-colors duration-1000 ease-in-out`}>
            <div className="flex-1 flex items-center">
              <div>
                <h2 className="text-3xl">
                  We give <span style={{ color: "#499824" }}>security</span>{" "}
                  &amp;{" "}
                  <span style={{ color: "#499824" }}>control on the go!</span>
                </h2>
                <p className="mt-5">
                  This is dummy content and will replace in future. Link with
                  various accounts to automatically calculate, what you own
                  minus, what you owe.
                </p>
              </div>
            </div>
            <div className="flex-1 flex items-center">
              <img src="images/security.jpg" />
            </div>
          </div>
        </div>
      </div>

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
            <h2 className="text-3xl" style={{ color: "#499824" }}>
              Get Rich Slowly
            </h2>
            <p className="text-xl mt-2">
              No More Boring Budgets or Confusing Investment Choices.
              DollarDarwin helps You to Grow Your Money without taking any undue
              stress.
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
                      <div
                        className="flip-card-back text-white absolute w-full h-full rounded-lg p-1"
                        style={{ backgroundColor: "#499824" }}
                      >
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

      <div
        className="py-10 m-auto"
        style={{
          maxWidth: "1280px",
          paddingRight: "1rem",
          paddingLeft: "1rem",
        }}
      >
        <div className="flex justify-items-auto">
          <div className="flex-1">
            <h2 className="text-3xl">Take quick step</h2>
            <p className="mt-5">
              Unlock money and make your future safe and secure.
            </p>
            <div className="w-2/4 bg-white border border-gray-500 rounded-md p-1 mt-5">
              <input
                className="w-3/4 p-2"
                type="text"
                placeholder="Enter email address"
              />
              <button
                className="w-1/4 border rounded-md text-white p-2"
                style={{ backgroundColor: "#499824" }}
              >
                Join
              </button>
            </div>
          </div>
          <div className="flex-1 flex items-center">
            <img src="images/quick-step.jpg" />
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: "#d9e2e9" }}>
        <div
          className="py-10 m-auto"
          style={{
            maxWidth: "1280px",
            paddingRight: "1rem",
            paddingLeft: "1rem",
          }}
        >
          <div className="flex justify-items-auto">
            <div className="flex-1 pr-16">
              <h2 className="text-xl">About Us</h2>
              <p className="mt-3">
                We started by providing smart, simple investing, without the
                high fees and account minimums associated with traditional
                investment management. We invest your money in a globally
                diversified portfolio of low-cost index funds, and our
                cutting-edge technology helps you earn the best possible return,
                while optimizing your tax bill.
              </p>
            </div>
            <div className="flex-1">Links</div>
          </div>
        </div>
      </div>
    </DDPage>
  );
}
