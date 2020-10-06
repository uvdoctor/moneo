import React from "react";
import { COLORS } from "../CONSTANTS";

export default function SVGEdit() {
	return (
		<svg viewBox="0 0 24 24">
			<path
				fill="none"
				stroke={COLORS.BLUE}
				d="M4 14a1 1 0 0 1 .3-.7l11-11a1 1 0 0 1 1.4 0l3 3a1 1 0 0 1 0 1.4l-11 11a1 1 0 0 1-.7.3H5a1 1 0 0 1-1-1v-3z"
			/>
			<rect fill={COLORS.BLUE} width="20" height="2" x="2" y="20" rx="1" />
		</svg>
	);
}
