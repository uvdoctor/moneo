import React from "react";
import { Row, Col } from "antd";
import ResImg from "../ResImg";
import BannerContent from "./BannerContent";
require("./Banner.less");
import GetStartedButton from "./GetStartedButton";
import WalletSVG from "../svgs/2d/wallet";
import LockSVG from "../svgs/2d/lock";
import SecuritySVG from "../svgs/2d/security";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { COLORS } from "../../CONSTANTS";

export default function Banner() {
  return (
    <div className="site-banner">
      <ResImg name="cover" width={1264} height={650} />
      <div className="site-banner-content">
        <BannerContent />
        <p>
          <GetStartedButton />
        </p>
        <Row align="middle" gutter={[5, 5]}>
          <Col xs={24} sm={12} md={8} lg={24}>
            <h3 className="h3-list">
              <FontAwesomeIcon icon={faEyeSlash} color={COLORS.GREEN} />
              No hidden fees
            </h3>
          </Col>
          <Col xs={24} sm={12} md={12} lg={24}>
            <h3 className="h3-list">
              <WalletSVG />
              Smart deals based on goals
            </h3>
          </Col>
          <Col xs={24} sm={12} md={8} lg={24}>
            <h3 className="h3-list">
              <LockSVG />
              Respects Privacy
            </h3>
          </Col>
          <Col xs={24} sm={12} md={12} lg={24}>
            <h3 className="h3-list">
              <SecuritySVG />
              Bank-grade Security
            </h3>
          </Col>
        </Row>
      </div>
      <p>&nbsp;</p>
    </div>
  );
}
