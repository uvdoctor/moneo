import React, { useContext } from "react";
import { Row, Col } from "antd";
import ResImg from "../ResImg";
import BannerContent from "./BannerContent";
import SocialShare from "../SocialShare";
require("./Banner.less");
import { AppContext } from "../AppContext";
import GetStartedButton from "./GetStartedButton";
import WalletSVG from "../svgs/2d/wallet";
import LockSVG from "../svgs/2d/lock";
import SecuritySVG from "../svgs/2d/security";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { COLORS } from "../../CONSTANTS";

export default function Banner() {
	const { defaultCountry }: any = useContext(AppContext);

	return (
		<div className="site-banner">
			<ResImg name="cover" />
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
				{defaultCountry !== "IN" && <SocialShare />}
			</div>
		</div>
	);
}
