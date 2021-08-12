import React, { useContext } from "react";
import { Row } from "antd";
import { Parallax } from "rc-scroll-anim";
import Content from "../Content";
import { JoinContextProvider } from "./JoinContext";
import Banner from "./Banner";
import VerifyCodeModal from "./VerifyCodeModal";
import Calculator from "./Calculator";
import HelloFinancialIndep from "./HelloFinancialIndep";
import Step from "./Step";
import GettingStarted from "./GettingStarted";
import Security from "./Security";
import GetRich from "./GetRich";
import Testimonials from "./Testimonials";
import FinancialIndependence from "./FinancialIndependence";
import { ROUTES } from "../../CONSTANTS";

import "./Landing.less";
import { AppContext } from "../AppContext";

export default function Landing() {
  const { defaultCountry }: any = useContext(AppContext);

  return (
    <JoinContextProvider>
      <Content className="with-banner">
        <Banner />
        <VerifyCodeModal />
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
              subTitle="Real-time Analysis"
              link="#"
              content="Automatically track your net worth, i.e. what you own minus what you owe, across bank accounts, credit cards, deposits, NPS, loans, etc; and investment portfolio performance."
              imgSrc={
                defaultCountry === "IN"
                  ? "images/step1-india.jpg"
                  : "images/step1.jpg"
              }
            />
            <Step
              className="step2"
              count="02"
              title="Set"
              subTitle="Goals"
              link="#"
              content="Define your life goals to get a persoalized Financial Plan, including analysis of money and time needed to achieve Financial Independence."
              imgSrc="images/step2.jpg"
            />
            <Step
              className="step3"
              count="03"
              title="Grow"
              subTitle="Wealth"
              link="#"
              content="Improve savings by identifying money leaks and unwanted expenses, and invest money based on your financial plan, risk appetite and ethics."
              imgSrc="images/step3.jpg"
            />
            <GettingStarted />
          </Row>
        </Parallax>
        <Calculator />
        <Testimonials />
      </Content>
      <Security />
      <GetRich />
      <FinancialIndependence />
    </JoinContextProvider>
  );
}
