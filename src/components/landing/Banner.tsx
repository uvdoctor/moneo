import React from "react";
import ResImg from "../ResImg";
import BannerContent from "./BannerContent";
import Join from "./Join";
import "./Banner.less";
/*import SocialShare from "../socialshare";
import BannerContent from "./BannerContent";
import Join from "./Join";*/

export default function Banner() {
	return (
		<div className="site-banner">
			<ResImg name="cover" />
			<div className="site-banner-content">
				<BannerContent />
				<Join />
			</div>

			{/*<div className="w-full p-5 -mt-24 text-left md:mt-0 md:absolute md:top-20 lg:top-32 xl:top-48">
				<BannerContent />

				<div className="text-sm bg-white border border-gray-400 p-5 rounded mt-4 shadow sm:text-base md:w-2/4 md:text-sm md:p-3 lg:text-base lg:w-4/12">
					<SocialShare url={`https://dollardarwin.com`} />
				</div>
			</div>*/}
		</div>
	);
}
