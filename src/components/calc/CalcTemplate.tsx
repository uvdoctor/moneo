import React, { useContext, Fragment } from "react";
import Input from "../goals/Input";
import Result from "../goals/Result";
import { CalcContext } from "./CalcContext";
import CalcHeader from "./CalcHeader";

import "./CalcTemplate.less";

export default function CalcTemplate() {
	const { allInputDone, error }: any = useContext(CalcContext);

	return (
		<Fragment>
			{!allInputDone ? <CalcHeader /> : null}
			<div className={allInputDone ? "calculator-page" : ""}>
				<Input />
				{allInputDone && !error && <Result />}
			</div>
		</Fragment>
	);
}
