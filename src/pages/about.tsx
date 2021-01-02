import React from "react";
import About from "../components/about/About";
import DDBasicPage from "../components/DDBasicPage";

export default function Home() {
	return (
		<DDBasicPage title="DollarDarwin">
			<About />
		</DDBasicPage>
	);
}
