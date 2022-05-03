import React from "react";
import { Col, Row } from "antd";
import { FacebookIcon, LinkedinIcon, TwitterIcon } from "react-share";
import { YoutubeFilled, InstagramFilled } from "@ant-design/icons";
import Content from "./Content";

require("./Footer.less");
import { COLORS, ROUTES } from "../CONSTANTS";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <Content className="footer">
      {/*<Row justify="center">
				<Col>
					<h3><strong>Moneo Advisors Private Limited</strong></h3>
					<p>
						1, Anita Society, Nr. Vishwakunj Cross-roads,<br />
						Narayan Nagar Road, Paldi.<br />
						Ahmedabad - 380007. Gujarat.
					</p>
				</Col>
	</Row>*/}
      <Row justify="center">
        <Col xs={24} sm={12} md={10} className="social-icons">
          <a
            target="_blank"
            href="https://facebook.com/moneoapp"
            rel="noopener noreferrer">
            <FacebookIcon round />
          </a>
          <a
            target="_blank"
            href="https://linkedin.com/company/moneomoney"
            rel="noopener noreferrer">
            <LinkedinIcon round />
          </a>
          <a
            target="_blank"
            href="https://twitter.com/moneomoneyapp"
            rel="noopener noreferrer">
            <TwitterIcon round />
          </a>
          <a
            target="_blank"
            href="https://www.youtube.com/channel/UCXkpjQtx3vAtuUQxpA6o70A"
            rel="noopener noreferrer">
            <YoutubeFilled />
          </a>
          <a
            target="_blank"
            href="https://instagram.com/moneoapp"
            rel="noopener noreferrer">
            <InstagramFilled />
          </a>
        </Col>
      </Row>
      <Row justify="center">
        <Col>
          <a target="_blank" href={ROUTES.ABOUT} rel="noreferrer">
            About us
          </a>
          &nbsp; | &nbsp;
        </Col>
        <Col>
          <a target="_blank" href={ROUTES.TC} rel="noreferrer">
            Terms & Conditions
          </a>
          &nbsp; | &nbsp;
        </Col>
        <Col>
          <a target="_blank" href={ROUTES.PRIVACY} rel="noreferrer">
            Privacy Policy
          </a>{" "}
          &nbsp; | &nbsp;
        </Col>
        <Col>
          <a target="_blank" href={ROUTES.SECURITY} rel="noreferrer">
            Security Policy
          </a>{" "}
          &nbsp;
        </Col>
      </Row>
      <Row justify="center">
        <Col>&copy; {year} Moneo. All rights reserved.</Col>
      </Row>
      <Row justify="center">
        <Col>
          Made with <span style={{ color: COLORS.RED }}>&#10084;</span> in
          India.
        </Col>
      </Row>
      <Row justify="center">
        <Col className="disclaimer">
          Disclaimer: This site is protected by reCAPTCHA and the Google{" "}
          <a target="_blank" href={ROUTES.PRIVACY} rel="noreferrer">
            Privacy Policy
          </a>{" "}
          and{" "}
          <a target="_blank" href={ROUTES.TC} rel="noreferrer">
            Terms of Service
          </a>{" "}
          apply.
        </Col>
      </Row>
    </Content>
  );
}
