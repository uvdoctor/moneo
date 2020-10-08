import React from "react";
import { Row, Col, Button } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { CALC_NAMES, ROUTES } from "../../CONSTANTS";

import "./Calculator.less";

interface CalculatorProps {
	calculateRef?: string;
}

export const calcList: Array<any> = [
	{
		name: CALC_NAMES.FI,
		link: ROUTES.FI,
		desc: "Figure out Earliest Possible Year & Minimum Savings needed for FI.",
	},
	{
		name: CALC_NAMES.BR,
		link: ROUTES.BR,
		desc:
			"Find out whether its cheaper to Buy or Rent & Invest remaining amount, as well as duration for which the option is cheaper.",
	},
	{
		name: CALC_NAMES.EDU_LOAN,
		link: ROUTES.EDUCATION,
		desc:
			"Analyze the simple interest to be paid while studying, and EMI payments to be made after study is over.",
	},
	{
		name: CALC_NAMES.DR,
		link: ROUTES.LOAN,
		desc:
			"Identify the optimal sequence of paying various loans that makes sense for You.",
	},
	{
		name: CALC_NAMES.CI,
		link: ROUTES.LOAN,
		desc:
			"Assess impact on Your credit score for various factors such as hard inquiry, delayed payment, etc.",
	},
	{
		name: CALC_NAMES.LOAN,
		link: ROUTES.LOAN,
		desc:
			"Understand the amortization schedule and total interest to be paid for a simple loan.",
	},
];

export default function Calculator({ calculateRef }: CalculatorProps) {
	return (
		<div ref={calculateRef} className="calculator">
			<div>
				<div className="calculator-title">
					<div
						className="bg-white border rounded-lg p-4 text-center"
						style={{
							backgroundImage: "linear-gradient(to left, #b5be93, #d2d6bc)",
							border: "5px solid #989898",
						}}
					>
						<img
							className="inline-block"
							src="images/try-advance-calculator.jpg"
						/>
					</div>
				</div>

				<Row className="calculator-btns" gutter={[30, 30]}>
					{calcList.map(({ name, desc, link }: any, i: number) => (
						<Col key={"calc" + i} span={8}>
							<div className="calculator-btn">
								<div>
									<h3>{name}</h3>
									<p>{desc}</p>
									<Button shape="circle" icon={<RightOutlined />} href={link} />
								</div>
							</div>
						</Col>
					))}
				</Row>
			</div>
		</div>
	);
}
