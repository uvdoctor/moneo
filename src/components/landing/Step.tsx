import React from "react";
import { Row, Col, Image } from "antd";
import "./Step.less";

interface StepProps {
  className: string;
  count: string;
  title: string;
  subTitle: string;
  content: string;
  imgSrc: any;
}

export default function Step({
  className,
  count,
  title,
  subTitle,
  content,
  imgSrc,
}: StepProps) {
  return (
    <Col xs={24} sm={24} md={12}>
      <div className={`step ${className}`}>
        <Row justify="space-around" align="middle">
          <Col span={4} className="count">
            {count}
          </Col>
          <Col span={20}>
            <hgroup>
              <h2>{title}</h2>
              <h3>{subTitle}</h3>
            </hgroup>
          </Col>
        </Row>
        <p>{content}</p>
        <Image src={imgSrc} />
      </div>
    </Col>
  );
}
