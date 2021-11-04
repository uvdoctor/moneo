import React from "react";
import BasicPage from "../components/BasicPage";
import Content from "../components/Content";
import { Row, Col, Statistic, Button } from "antd";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//@ts-ignore
require("./pricing-table.less");

interface FeatureProps {
	offerings?: any;
}

interface OfferingsProps {
	title: any;
	features?: any;
	notSupported?: any;
}

const Feature = ({ offerings }: FeatureProps) =>
	offerings.map(({ title, notSupported, features }: OfferingsProps) => (
		<Col key={title} className={notSupported ? "not-supported" : ""} span={24}>
			<h3>
				{notSupported ? (
					<FontAwesomeIcon icon={faTimes} />
				) : (
					<FontAwesomeIcon icon={faCheck} />
				)}{" "}
				{title}
			</h3>
			{features && (
				<ul>
					{features.map((feature: any, index: number) => (
						<li key={"f" + index}>{feature}</li>
					))}
				</ul>
			)}
		</Col>
	));

export default function FeaturesPage() {
	const basicCalculators = {
		title: "Basic Calculators",
		features: ["Education Loan", "Asset Allocation"],
	};
	const advanceCalculators = {
		title: "Advance Calculators",
		features: ["Education Loan", "Asset Allocation"],
	};
	const savePreferences = {
		title: "Save Preferences",
	};
	const support = {
		title: "Customer Suppport",
	};
	const config = [
		{
			title: "Free",
			currency: "$",
			price: "0",
			plan: "mo",
			offerings: [
				basicCalculators,
				{ ...advanceCalculators, notSupported: true },
				{ ...savePreferences, notSupported: true },
				{ ...support, notSupported: true },
			],
		},
		{
			recommended: true,
			title: "Gold",
			currency: "$",
			price: "50",
			plan: "mo",
			offerings: [
				basicCalculators,
				advanceCalculators,
				{ ...savePreferences, notSupported: true },
				{ ...support, notSupported: true },
			],
		},
		{
			title: "Platinum",
			currency: "$",
			price: "99",
			plan: "mo",
			offerings: [
				basicCalculators,
				advanceCalculators,
				savePreferences,
				support,
			],
		},
	];

	function onBuyClick(title: any, price: any) {
		console.log(title, price);
	}

	return (
		<BasicPage title="Features">
			<Content>
				<Row
					className="price-table"
					justify="center"
					align="middle"
					gutter={10}
				>
					{config.map(
						({ recommended, title, currency, price, plan, offerings }) => (
							<Col key={title} xs={24} lg={8}>
								<Row
									className={`price-box ${recommended ? "recommended" : ""}`}
								>
									<Col span={24}>
										<Statistic
											title={title}
											value={price}
											prefix={currency}
											suffix={`/${plan}`}
										/>
									</Col>
									<Feature offerings={offerings} />
									<Col className="buy-now-btn" span={24}>
										<Button
											type="primary"
											onClick={() => onBuyClick(title, price)}
										>
											Buy Now
										</Button>
									</Col>
								</Row>
							</Col>
						)
					)}
				</Row>
			</Content>
		</BasicPage>
	);
}
