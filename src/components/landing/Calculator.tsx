import React, { useState } from "react";
import Link from "next/link";
import ItemDisplay from "../calc/ItemDisplay";
import SVGScale from "../svgscale";
import SVGFreedom from "../svgfreedom";
import SVGEduLoan from "../svgeduloan";
import SVGScissor from "../svgscissor";
import SVGAnalyze from "../svganalyze";
import SVGLoan from "../svgloan";
import { CALC_NAMES, ROUTES, COLORS } from "../../CONSTANTS";

interface CalculatorProps {
	calculateRef: string;
}

export default function Calculator({ calculateRef }: CalculatorProps) {
	const [calcIndex, setCalcIndex] = useState<number>(-1);
	const calcList: Array<any> = [
		{
			name: CALC_NAMES.FI,
			link: ROUTES.FI,
			svg: SVGFreedom,
			desc:
				"Figure out Earliest Possible Year & Minimum Savings needed for FI.",
		},
		{
			name: CALC_NAMES.BR,
			link: ROUTES.BR,
			svg: SVGScale,
			desc:
				"Find out whether its cheaper to Buy or Rent & Invest remaining amount, as well as duration for which the option is cheaper.",
		},
		{
			name: CALC_NAMES.EDU_LOAN,
			link: ROUTES.EDUCATION,
			svg: SVGEduLoan,
			desc:
				"Analyze the simple interest to be paid while studying, and EMI payments to be made after study is over.",
		},
		{
			name: CALC_NAMES.DR,
			link: ROUTES.LOAN,
			svg: SVGScissor,
			desc:
				"Identify the optimal sequence of paying various loans that makes sense for You.",
		},
		{
			name: CALC_NAMES.CI,
			link: ROUTES.LOAN,
			svg: SVGAnalyze,
			desc:
				"Assess impact on Your credit score for various factors such as hard inquiry, delayed payment, etc.",
		},
		{
			name: CALC_NAMES.LOAN,
			link: ROUTES.LOAN,
			svg: SVGLoan,
			desc:
				"Understand the amortization schedule and total interest to be paid for a simple loan.",
		},
	];

	return (
		<div
			className="max-w-screen-md border rounded-lg p-3 m-auto"
			style={{
				backgroundColor: "#c3c3c3",
				backgroundImage: "linear-gradient(to bottom, #c3c3c3, #959595)",
				boxShadow: "0 0 10px #8b8b8b",
			}}
		>
			<div
				ref={calculateRef}
				className="bg-white border rounded-lg p-10 pb-16"
				style={{
					backgroundImage: "linear-gradient(to bottom, #ebebeb, #d1d1d1)",
				}}
			>
				<div
					className="border rounded-lg p-3 shadow-inner"
					style={{
						backgroundColor: "#d0d0d0",
						border: "1px solid #afafaf",
					}}
				>
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

				<div
					className={`grid grid-cols-3 gap-10 justify-items-stretch mt-10 h-64`}
				>
					{calcList.map((calc: any, i: number) => (
						<Link key={"calc" + i} href={calc.link}>
							<a>
								<div
									className={`calc-btn linear ${
										calcIndex === i ? "selected" : ""
									} ${
										calcIndex >= 0 && calcIndex !== i
											? "scale-50 opacity-0"
											: calcIndex === i &&
											  "text-green-primary md:text-xl lg:text-2xl"
									}`}
									style={{
										width: calcIndex === i ? "660px" : "",
										height: calcIndex === i ? "280px" : "",
										transform:
											calcIndex === i
												? `translate(${
														i === 5
															? "-465px, -150px"
															: i === 2
															? "-465px, 0px"
															: i === 3
															? "0px, -150px"
															: i === 4
															? "-235px, -150px"
															: i === 1
															? "-235px, 0px"
															: ""
												  })`
												: "",
									}}
									onMouseEnter={() => setCalcIndex(i)}
									onMouseLeave={() => setCalcIndex(-1)}
								>
									<div>
										<ItemDisplay
											svg={
												<calc.svg
													disabled={calcIndex !== i}
													selected={calcIndex === i}
												/>
											}
											result={calc.name}
											vertical
										/>
										{calcIndex === i && (
											<div
												className="mt-4 text-center text-lg text-white "
												style={{ animation: "fadeIn 1s 1" }}
											>
												{calc.desc}
											</div>
										)}
									</div>
								</div>
							</a>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}
