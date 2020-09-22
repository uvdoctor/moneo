import React, { Fragment } from "react";
import { useScroll } from "react-browser-hooks";
import { ToastContainer } from "react-toastify";

import LogoWithName from "./logowithname";
import { HOME_ANCHORS } from "../CONSTANTS";

export default function Main() {
  const { top } = useScroll();

  return (
    <Fragment>
      <ToastContainer />
      <div className="max-w-screen-xl m-auto">
        <div
          className={`fixed w-full h-16 left-0 z-10 ${
            top > 10 ? "shadow-lg" : ""
          }`}
          style={{
            backgroundImage:
              top > 10
                ? "linear-gradient(to bottom, #fff, #fff)"
                : "linear-gradient(to bottom, #dbedca, rgba(246,246,246,0))",
          }}
        ></div>
        <header
          className="sm:flex sm:justify-between sm:items-center sm:px-4 sm:py-3 fixed w-full sm:pl-0 z-20"
          style={{
            maxWidth: "1280px",
            paddingRight: "1rem",
            paddingLeft: "1rem",
          }}
        >
          <div className="flex items-center justify-between px-4 py-3 sm:p-0">
            <LogoWithName />
            <div className="sm:hidden">
              <button
                type="button"
                className="block text-gray-500 hover:text-white focus:text-white focus:outline-none"
              >
                <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                  <path
                    v-if="isOpen"
                    fillRule="evenodd"
                    d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                  />
                  <path
                    v-if="!isOpen"
                    fillRule="evenodd"
                    d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                  />
                </svg>
              </button>
            </div>
          </div>
          <nav className="site-nav px-2 pt-2 pb-4 sm:flex sm:p-0">
            <a href="#" className="block px-2 py-1 font-semibold rounded">
              Calculate
            </a>
            <div className="site-nav-dropdown relative">
              <span className="mt-1 cursor-pointer block px-2 py-1 font-semibold rounded sm:mt-0 sm:ml-2">
                About
              </span>
              <div className="absolute bg-white hidden p-5 pl-0 shadow-lg">
                <a
                  href={HOME_ANCHORS.FEATURES}
                  className="mt-1 block px-2 py-1 font-semibold rounded sm:mt-0 sm:ml-2"
                >
                  Features
                </a>
                <a
                  href={HOME_ANCHORS.PRICE}
                  className="mt-1 block px-2 py-1 font-semibold rounded sm:mt-0 sm:ml-2"
                >
                  Pricing
                </a>
                <a
                  href={HOME_ANCHORS.COMPANY}
                  className="mt-1 block px-2 py-1 font-semibold rounded sm:mt-0 sm:ml-2"
                >
                  Company
                </a>
              </div>
            </div>
            <a
              href="#"
              className="mt-1 block px-2 py-1 font-semibold rounded sm:mt-0 sm:ml-2"
            >
              Join Waitlist
            </a>
          </nav>
        </header>
        <div className="relative">
          <div
            className="absolute w-full mt-20"
            style={{ top: "90px", left: "1rem" }}
          >
            <p className="text-xl font-bold">Your financial analyst</p>
            <h2 className="text-3xl font-bold" style={{ color: "#499824" }}>
              Stress-free savings &amp; Investments
            </h2>
            <p className="text-xl font-bold">Meet my goals</p>

            <h2
              className="text-xl mt-20 font-bold"
              style={{ color: "#499824" }}
            >
              Avail Special offer
            </h2>
            <p className="w-4/12">
              For importing CSS required by a third party component, you can do
              so in your component. For example:
            </p>

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

              <div className="grid grid-cols-3 gap-10 justify-items-stretch h-56 mt-10">
                <div
                  className="bg-gray-400 flex justify-center items-center px-4 py-2 text-white rounded-lg"
                  style={{
                    backgroundColor: "#525252",
                    backgroundImage:
                      "linear-gradient(to left, #6f6f6f, #4a4a4a)",
                    border: "5px solid #8b8b8b",
                  }}
                >
                  Financial Freedom
                </div>
                <div
                  className="justify-self-auto bg-gray-500 flex justify-center items-center px-4 py-2 text-white rounded-lg"
                  style={{
                    backgroundColor: "#525252",
                    backgroundImage:
                      "linear-gradient(to left, #6f6f6f, #4a4a4a)",
                    border: "5px solid #8b8b8b",
                  }}
                >
                  Buy v/s Rent
                </div>
                <div
                  className="bg-gray-400 flex justify-center items-center px-4 py-2 text-white rounded-lg"
                  style={{
                    backgroundColor: "#525252",
                    backgroundImage:
                      "linear-gradient(to left, #6f6f6f, #4a4a4a)",
                    border: "5px solid #8b8b8b",
                  }}
                >
                  Education Loan
                </div>
                <div
                  className="bg-gray-400 flex justify-center items-center px-4 py-2 text-white rounded-lg"
                  style={{
                    backgroundColor: "#525252",
                    backgroundImage:
                      "linear-gradient(to left, #6f6f6f, #4a4a4a)",
                    border: "5px solid #8b8b8b",
                  }}
                >
                  Debt Buster
                </div>
                <div
                  className="bg-gray-400 flex justify-center items-center px-4 py-2 text-white rounded-lg"
                  style={{
                    backgroundColor: "#525252",
                    backgroundImage:
                      "linear-gradient(to left, #6f6f6f, #4a4a4a)",
                    border: "5px solid #8b8b8b",
                  }}
                >
                  Credit Impact
                </div>
                <div
                  className="bg-gray-400 flex justify-center items-center px-4 py-2 text-white rounded-lg"
                  style={{
                    backgroundColor: "#525252",
                    backgroundImage:
                      "linear-gradient(to left, #6f6f6f, #4a4a4a)",
                    border: "5px solid #8b8b8b",
                  }}
                >
                  Mortgage Loan
                </div>
              </div>
            </div>
          </div>

          <div className="mt-32" style={{ paddingRight: "50%" }}>
            <h2 className="text-3xl">Hello Financial Freedom!</h2>
            <p>
              This is dummy content and will replace in future. Link with
              various accounts to automatically calculate, what you own minus,
              what you owe.
            </p>
          </div>
          <div className="flex flex-wrap mt-10">
            <div className="w-2/4">
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
            <div className="w-2/4">
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
                <img className="mt-5" src="images/step3.jpg" />
              </div>
            </div>
            <div
              className="w-2/4"
              style={{ transform: "translate3d(0,-130px,0)" }}
            >
              <div
                className="rounded-lg p-16 ml-5 mt-10"
                style={{ backgroundColor: "#dce7ef" }}
              >
                <h2 className="text-2xl">Kick-start your financial freedom</h2>
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

          <div className="flex justify-items-auto mt-32">
            <div className="flex-1 flex items-center">
              <div>
                <h2 className="text-3xl">
                  We gives <span style={{ color: "#499824" }}>security</span>{" "}
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

      <div className="bg-white">
        <div
          className="pt-10 m-auto"
          style={{
            maxWidth: "1280px",
            paddingRight: "1rem",
            paddingLeft: "1rem",
          }}
        >
          <div className="flex justify-items-auto">
            <div className="flex-1">
              <h2 className="text-3xl" style={{ color: "#499824" }}>
                Track &amp; Manage Your Money
              </h2>
              <dl className="mt-5">
                <dt className="font-bold mt-2">Personalized</dt>
                <dd>
                  Insights based on Your Goals, Risk Threshold &amp; financial
                  health.
                </dd>
                <dt className="font-bold mt-2">Fun</dt>
                <dd>Games to help You make Smart Money decisions.</dd>
                <dt className="font-bold mt-2">Actionable</dt>
                <dd>
                  See what You have to achieve today &amp; how it will affect
                  tomorrow.
                </dd>
                <dt className="font-bold mt-2">Secure</dt>
                <dd>
                  Uses latest encryption technology to keep your Identity &amp;
                  Data secure.
                </dd>
                <dt className="font-bold mt-2">Global</dt>
                <dd>Time-tested money concepts that work wherever You are.</dd>
                <dt className="font-bold mt-2">Private</dt>
                <dd>Respects Data Privacy.</dd>
              </dl>
            </div>
            <div className="flex-1 flex items-bottom">
              <img src="images/track-money.jpg" />
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

      {/*<div className="overflow-x-none overflow-y-auto">
	      <ToastContainer />
	      {top > 0 && <Header />}
	      <Landing />
	      <Features />
	    </div>*/}
    </Fragment>
  );
}
