import React from "react";
import { Row, Col } from "antd";
import DDContent from "../DDContent";
import TorchSVG from "../svgs/3d/TorchSVG";
import BarChartSVG from "../svgs/3d/BarChartSVG";
import DartSVG from "../svgs/3d/DartSVG";
import MoneyLeaksSVG from "../svgs/3d/MoneyLeaksSVG";
import BarChart2SVG from "../svgs/3d/BarChart2SVG";
import AbacusSVG from "../svgs/3d/AbacusSVG";
import AdaptablePlanSVG from "../svgs/3d/AdaptablePlanSVG";
import CashBunchSVG from "../svgs/3d/CashBunchSVG";
import SwimRingSVG from "../svgs/3d/SwimRingSVG";

import "./GetRich.less";

interface GetRichProps {
  featuresRef?: string;
}

export default function GetRich({ featuresRef }: GetRichProps) {
  const featuresList = [
    {
      label: "Holistic Financial Health",
      svg: TorchSVG,
      desc:
        "Analyzes Your Net Worth Across Currencies & if Your Money is working hard enough.",
    },
    {
      label: "Goal-based Savings",
      svg: DartSVG,
      desc:
        "To Identify what has to be achieved today & how it will affect tomorrow.",
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
        "To Maximize Earning Opportunities & Reduce Risk of over-reliance on 1 Country & Currency. ",
    },
    {
      label: "Adaptable Financial Plan",
      svg: AdaptablePlanSVG,
      desc:
        "That Evolves with Your Goals. Understand long-term impact of Your decisions.",
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
        "No complex jargons. Helps You to take simple clear steps towards Your Financial Independence.",
    },
  ];

  return (
    <DDContent>
      <div className="get-rich" ref={featuresRef}>
        <h2>Get Rich Slowly</h2>
        <p>
          No More Boring Budgets or Confusing Investment Choices. DollarDarwin
          helps You to Grow Your Money without taking any undue stress.
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
    </DDContent>
  );
}
