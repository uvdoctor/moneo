import React from "react";
import About from "../components/about/About";
import BasicPage from "../components/BasicPage";

export default function Home() {
	return (
		<BasicPage title="Moneo">
			<About />
		</BasicPage>
	);
}
