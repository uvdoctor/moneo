import React, { useContext } from "react";
import ResImg from "../ResImg";
import BannerContent from "./BannerContent";
import SocialShare from "../SocialShare";
import Join from "./Join";
import "./Banner.less";
import { AppContext } from "../AppContext";
import GetStartedButton from "./GetStartedButton";
import WalletSVG from "../svgs/2d/wallet";
import LockSVG from "../svgs/2d/lock";
import SecuritySVG from "../svgs/2d/security";

export default function Banner() {
	const { defaultCountry }: any = useContext(AppContext);

	return (
		<div className="site-banner">
			<ResImg name="cover" />
			<div className="site-banner-content">
				<BannerContent />
				{defaultCountry === "IN" ? (
					<p>
						<GetStartedButton />
					</p>
				) : (
					<Join />
				)}
				<h3>
					<WalletSVG />
					No Commissions
				</h3>
				<h3>
					<LockSVG />
					Respects Privacy
				</h3>
				<h3>
					<SecuritySVG />
					Bank-grade Security
				</h3>
				{defaultCountry !== "IN" && <SocialShare />}
			</div>
		</div>
	);
}
