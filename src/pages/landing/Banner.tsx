import React from "react";
import { useFullScreenBrowser } from "react-browser-hooks";
import SocialShare from "../../components/socialshare";
import { isMobileDevice } from "../../components/utils";
import BannerContent from "./BannerContent";
import Join from "./Join";

interface BannerProps {
	joinRef?: any;
}

export default function Banner({ joinRef }: BannerProps) {
	const fsb = useFullScreenBrowser();

	return (
		<div className="relative text-center">
			{isMobileDevice(fsb) ? (
				<img className="inline" src="images/cover-mobile.jpg" />
			) : (
				<img src="images/cover.jpg" />
			)}
			<div className="w-full p-5 -mt-32 text-left md:mt-0 md:absolute md:top-20 lg:top-32 xl:top-48">
				<BannerContent />
				<Join joinRef={joinRef} />
				<div className="bg-white border border-gray-400 p-5 rounded mt-4 shadow md:w-2/4 md:text-sm md:p-3 lg:text-base lg:w-4/12">
					<SocialShare url={`https://dollardarwin.com`} />
				</div>
			</div>
		</div>
	);
}
