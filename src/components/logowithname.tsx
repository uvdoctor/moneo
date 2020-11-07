import React from "react";
import DDLogo from "./DDLogo";

export default function LogoWithName() {
	return (
		<div className="flex items-end">
			<div className="w-full text-bold flex items-center text-default">
				<DDLogo />
				<h1 className="ml-2 mt-1 text-xl md:text-2xl lg:text-2xl">$Darwin</h1>
			</div>
		</div>
	);
}
