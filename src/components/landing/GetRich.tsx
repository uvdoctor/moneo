import React from "react";
import { Row, Col } from "antd";
import Content from "../Content";
import TorchSVG from "../svgs/3d/TorchSVG";
import BarChartSVG from "../svgs/3d/BarChartSVG";
import DartSVG from "../svgs/3d/DartSVG";
import MoneyLeaksSVG from "../svgs/3d/MoneyLeaksSVG";
import AbacusSVG from "../svgs/3d/AbacusSVG";
import AdaptablePlanSVG from "../svgs/3d/AdaptablePlanSVG";
import CashBunchSVG from "../svgs/3d/CashBunchSVG";
import SwimRingSVG from "../svgs/3d/SwimRingSVG";

import "./GetRich.less";

export default function GetRich() {
  const featuresList = [
    {
      label: "Holistic Financial Analysis",
      svg: TorchSVG,
      desc:
        "Analyzes Your Net Worth Across Currencies & checks investment portfolio performance.",
    },
    {
      label: "Goal-based Savings",
      svg: DartSVG,
      desc:
        "Identify what has to be achieved today & how it will affect tomorrow.",
    },
    {
      label: "Uncover Money Leaks",
      svg: MoneyLeaksSVG,
      desc: "Such as hidden fees, unwanted subscriptions, bank charges, etc.",
    },
    {
      label: "Investment Insights",
      svg: BarChartSVG,
      desc: "Based on Your Goals, Risk Threshold & Financial Health.",
    },
    {
      label: "Diversify Globally",
      svg: AbacusSVG,
      desc:
        "Maximize Earning Opportunities & Reduce Risk of over-reliance on 1 Country & Currency. ",
    },
    {
      label: "Adaptable Financial Plan",
      svg: AdaptablePlanSVG,
      desc:
        "Evolve Your Plan with with Your Goals. Understand long-term impact of Your decisions.",
    },
    {
      label: "No Commissions. Ever.",
      svg: CashBunchSVG,
      desc:
        "Analysis that's driven solely by Your Financial Well-being. No hidden agenda or fees.",
    },
    {
      label: "Easy to Use",
      svg: SwimRingSVG,
      desc:
        "No complex jargon. Helps You to take simple clear steps towards Your Financial Independence.",
    },
  ];

  return (
    <Content>
      <div className="get-rich">
        <h2>Get Rich Slowly</h2>
        <p>
          No more budgeting or confusing investment choices. Grow your money slowly and steadily without taking any undue stress.
        </p>
        <Row
          gutter={[
            { xs: 0, sm: 15, md: 30, lg: 50 },
            { xs: 15, sm: 15, md: 30, lg: 50 },
          ]}
          align="middle"
        >
          {featuresList.map(({ svg: Svg, label, desc }, i) => (
            <Col
              key={"f" + i}
              className="flip-card"
              xs={24}
              sm={12}
              md={8}
              lg={6}
            >
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <Row justify="center" align="middle">
                    <Col span={24}>
                      <Svg />
                      <h3>{label}</h3>
                    </Col>
                  </Row>
                </div>
                <div className="flip-card-back">
                  <Row justify="center" align="middle">
                    <Col span={24}>
                      <p>{desc}</p>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </Content>
  );
}
