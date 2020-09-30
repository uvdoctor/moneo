import React, { Fragment } from "react";
import GoalImages from "../../components/goalimages";

const BannerContent = () => {
	return (
		<Fragment>
			<p className="text-xl font-bold md:text-lg lg:text-xl">
				Your Financial Analyst
			</p>
			<h2 className="text-3xl text-green-primary font-bold md:text-xl lg:text-3xl">
				Stress-free Savings &amp; Investments
			</h2>
			<div className="flex items-center">
				<p className="text-xl font-bold md:text-lg lg:text-xl">
					Meet Your Goals
				</p>
				<GoalImages />
			</div>
		</Fragment>
	);
};

export default BannerContent;
