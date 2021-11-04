import React from "react";
import { Row, Col, Button } from "antd";
import { RightOutlined, CalculatorOutlined } from "@ant-design/icons";
import { CALC_NAMES, ROUTES } from "../../CONSTANTS";

require("./Calculator.less");

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
		name: CALC_NAMES.TC,
		link: ROUTES.TRUE_COST,
		desc:
			"Understand true cost over long term as well as time cost for One-time, Monthly & Yearly spends.",
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
					<h2>Calculators</h2>
					<div className="bg-white border rounded-lg p-4 text-center">
						<img
							className="inline-block"
							src="images/try-advance-calculator.jpg"
						/>
					</div>
				</div>

				<Row
					className="calculator-btns"
					gutter={[
						{ xs: 0, sm: 0, md: 30, lg: 30 },
						{ xs: 0, sm: 0, md: 30, lg: 30 },
					]}
				>
					{calcList.map(({ name, desc, link }: any, i: number) => (
						<Col key={"calc" + i} xs={24} sm={24} md={8} lg={8} xl={8}>
							<div className="calculator-btn">
								<div>
									<a href={link}>
										<h3>{name}</h3>
										<p>{desc}</p>
										<Button className="btn-calc" icon={<CalculatorOutlined />}>
											Launch
										</Button>
										<Button shape="circle" icon={<RightOutlined />} />
									</a>
								</div>
							</div>
						</Col>
					))}
				</Row>
			</div>
		</div>
	);
}
