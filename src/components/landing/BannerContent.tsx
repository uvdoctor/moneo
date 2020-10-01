import React, { Fragment } from "react";
import GoalImages from "../goalimages";

const BannerContent = () => {
	return (
		<Fragment>
			<p className="text-lg font-bold sm:text-xl md:text-lg lg:text-xl">
				Your Financial Analyst
			</p>
			<h2 className="text-xl text-green-primary font-bold sm:text-3xl md:text-xl lg:text-3xl">
				Stress-free Savings &amp; Investments
			</h2>
			<div className="flex items-center">
				<p className="text-lg font-bold sm:text-xl md:text-lg lg:text-xl">
					Meet Your Goals
				</p>
				<GoalImages />
			</div>
		</Fragment>
	);
};

export default BannerContent;
