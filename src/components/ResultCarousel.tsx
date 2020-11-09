import React from "react";
import Carousel from "react-elastic-carousel";

interface ResultCarouselProps {
	results?: any;
}

export default function ResultCarousel({ results }: ResultCarouselProps) {
	const resultsLength = results.length || 0;
	const mobileSlideCount = 1;
	const tabletSlideCount = 2;
	const desktopSlideCount = resultsLength > 2 ? 3 : 2;

	return (
		<Carousel
			itemsToShow={2}
			breakPoints={[
				{
					width: 300,
					itemsToShow: mobileSlideCount,
					itemsToScroll: mobileSlideCount,
				},
				{
					width: 577,
					itemsToShow: tabletSlideCount,
					itemsToScroll: tabletSlideCount,
				},
				{
					width: 992,
					itemsToShow: desktopSlideCount,
					itemsToScroll: desktopSlideCount,
				},
			]}
			showArrows={false}
		>
			{results && results instanceof Array ? (
				results.length > 0 &&
				results.map((result, i) => (
					<div className="dd-stat" key={"result" + i}>
						{result}
					</div>
				))
			) : (
				<div className="dd-stat">{results}</div>
			)}
			<div className="dd-stat">RSR</div>
			<div className="dd-stat">RSR</div>
		</Carousel>
	);
}
