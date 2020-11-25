import React from "react";
import { Row } from "antd";
import { Parallax } from "rc-scroll-anim";
import DDContent from "../DDContent";
import { JoinContextProvider } from "./JoinContext";
import Banner from "./Banner";
import VerifyCodeModal from "./VerifyCodeModal";
import Calculator from "./Calculator";
import HelloFinancialIndep from "./HelloFinancialIndep";
import Step from "./Step";
import GettingStarted from "./GettingStarted";
import Security from "./Security";
import GetRich from "./GetRich";
import TakeQuickStep from "./TakeQuickStep";

import "./Landing.less";

export default function Landing() {
  return (
    <JoinContextProvider>
      <DDContent className="with-banner">
        <Banner />
        <VerifyCodeModal />
        <Calculator />
        <Parallax
          animation={[
            { x: 0, opacity: 1, playScale: [0, 0.6] },
            { y: 0, playScale: [0, 1] },
          ]}
          style={{
            transform: "translateX(-100px)",
            opacity: 0,
            position: "relative",
            top: "0",
            bottom: "0",
            left: "0",
            right: "0",
            margin: "auto",
            width: "100%",
            height: "auto",
          }}
        >
          <HelloFinancialIndep />
          <Row
            className="steps"
            gutter={[
              { xs: 0, sm: 0, md: 24, lg: 32 },
              { xs: 20, sm: 20, md: 24, lg: 32 },
            ]}
          >
            <Step
              className="step1"
              count="01"
              title="Get"
              subTitle="Net Worth"
              content="Link with various accounts to automatically calculate, what you own minus, what you owe."
              imgSrc="images/step1.jpg"
            />
            <Step
              className="step2"
              count="02"
              title="Set"
              subTitle="Goals"
              content="Estimate money required across multiple currencies using in-built templates and calculators."
              imgSrc="images/step2.jpg"
            />
            <Step
              className="step3"
              count="03"
              title="Go"
              subTitle="Make Money Work"
              content="Helps you to not only align savings &amp; investements to goals, but also become more financially savvy via engaging games."
              imgSrc="images/step3.jpg"
            />
            <GettingStarted />
          </Row>
        </Parallax>
      </DDContent>

      <Security />
      <GetRich />
      <TakeQuickStep />
    </JoinContextProvider>
  );
}
