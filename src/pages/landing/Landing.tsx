import React, { useEffect, useRef, useState } from "react";
import { useScroll } from "react-browser-hooks";

import Nav from "../../components/Nav";
import * as gtag from "../../lib/gtag";
import DDPage from "../../components/ddpage";
import TakeQuickStep from "./TakeQuickStep";
import Security from "./Security";
import GetRich from "./GetRich";
import HelloFinancialIndep from "./HelloFinancialIndep";
import GetNetWorth from "./GetNetWorth";
import SetGoals from "./SetGoals";
import MakeMoneyWork from "./MakeMoneyWork";
import GettingStarted from "./GettingStarted";
import Calculator from "./Calculator";
import Banner from "./Banner";

export default function Landing() {
  const { top } = useScroll();
  const [scrolledToSec, setScrolledToSec] = useState<boolean>(false);
  const joinRef: any = useRef();
  const calculateRef: any = useRef();
  const featuresRef: any = useRef();
  const securityRef: any = useRef();

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
          setScrolledToSec(true);
          gtag.event({
            category: "Home",
            action: "Scroll",
            label: "Section",
            value: "Security",
          });
        } else setScrolledToSec(false);
      });
    };

    const featuresScrollObserver = new IntersectionObserver(
      featuresCallback,
      opts
    );
    featuresScrollObserver.observe(featuresRef.current);
    const secScrollObserver = new IntersectionObserver(secCallback, opts);
    secScrollObserver.observe(securityRef.current);
    return () => {
      featuresScrollObserver.disconnect();
      secScrollObserver.disconnect();
    };
  }, []);

  return (
    <DDPage title="DollarDarwin">
      <div
        className={`fixed w-full h-16 left-0 z-10 ${top > 10 && "shadow-lg"}`}
        style={{
          backgroundImage:
            top > 10
              ? "linear-gradient(to bottom, #fff, #fff)"
              : "linear-gradient(to bottom, #dbedca, rgba(246,246,246,0))",
        }}
      ></div>
      <div className="max-w-screen-xl m-auto">
        <Nav
          joinRef={joinRef}
          calculateRef={calculateRef}
          featuresRef={featuresRef}
        />
        <Banner joinRef={joinRef} />
      </div>

      <div className="max-w-screen-xl m-auto">
        <div
          className="p-20 pl-0"
          style={{
            maxWidth: "1280px",
            paddingRight: "1rem",
            paddingLeft: "1rem",
          }}
        >
          <Calculator calculateRef={calculateRef} />
          <HelloFinancialIndep />
          <div className="w-full flex flex-wrap">
            <GetNetWorth />
            <SetGoals />
            <MakeMoneyWork />
            <GettingStarted />
          </div>

          <Security securityRef={securityRef} scrolledToSec={scrolledToSec} />
        </div>
      </div>

      <GetRich featuresRef={featuresRef} />
      <TakeQuickStep />

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
