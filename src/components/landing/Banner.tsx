import React from "react";
import ResImg from "../ResImg";
import SocialShare from "../socialshare";
import BannerContent from "./BannerContent";
import Join from "./Join";

interface BannerProps {
	joinRef?: any;
}

export default function Banner({ joinRef }: BannerProps) {
	return (
		<div className="relative text-center">
			<ResImg className="inline" name="cover" />
			<div className="w-full p-5 -mt-24 text-left md:mt-0 md:absolute md:top-20 lg:top-32 xl:top-48">
				<BannerContent />
				<Join joinRef={joinRef} />
				<div className="text-sm bg-white border border-gray-400 p-5 rounded mt-4 shadow sm:text-base md:w-2/4 md:text-sm md:p-3 lg:text-base lg:w-4/12">
					<SocialShare url={`https://dollardarwin.com`} />
				</div>
			</div>
		</div>
	);
}
