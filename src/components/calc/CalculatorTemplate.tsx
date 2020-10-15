import React, { Fragment } from "react";
import { useState } from "react";
import { getRangeFactor } from "../utils";
import {
	PageHeader,
	Steps,
	Divider,
	Button,
	Row,
	Col,
	Select,
	Card,
	Tabs,
	Statistic,
} from "antd";
import { FullscreenOutlined } from "@ant-design/icons";
import TitleSection from "../goals/TitleSection";
import SelectInput from "../form/selectinput";

interface CalculatorTemplateProps {
	calc: any;
	title: string;
	cancelCallback: Function;
}

export interface CalcTypeProps {
	currency: string;
	rangeFactor: number;
	tabOptions: Array<any>;
	showTab: string;
	showTabHandler: Function;
	allInputDone: boolean;
	allInputDoneHandler: Function;
	cancelCallback: Function;
}

export default function CalculatorTemplate({
	calc,
	title,
	cancelCallback,
}: CalculatorTemplateProps) {
	const { Option } = Select;
	const { TabPane } = Tabs;
	const { Step } = Steps;
	const [currency, setCurrency] = useState<string>("USD");
	const [rangeFactor, setRangeFactor] = useState<number>(
		getRangeFactor(currency)
	);
	const [allInputDone, setAllInputDone] = useState<boolean>(false);
	const [showTab, setShowTab] = useState<string>(calc.tabOptions[0].label);
	const changeCurrency = (curr: string) => {
		setRangeFactor(Math.round(getRangeFactor(curr) / getRangeFactor(currency)));
		setCurrency(curr);
	};

	return (
		<Fragment>
			<PageHeader
				className="steps-page-header"
				title={`${title} Calculator`}
				onBack={cancelCallback}
				ghost={false}
				extra={[
					<SelectInput
						pre=""
						value={currency}
						changeHandler={changeCurrency}
						currency
					/>,
				]}
			>
				<Divider />
				<Steps current={1}>
					<Step title="Spend" />
					<Step title="Save" />
					<Step title="Invest" />
				</Steps>
			</PageHeader>
			<Card
				className="steps-card"
				title="Enter Spend Details"
				actions={[<Button type="primary">Next</Button>]}
				style={{ marginBottom: "150px" }}
			>
				<Row>
					<Col span={12}>
						<div>Spend</div>
						<Select defaultValue="lucy">
							<Option value="jack">Jack</Option>
							<Option value="lucy">Lucy</Option>
							<Option value="disabled" disabled>
								Disabled
							</Option>
							<Option value="Yiminghe">yiminghe</Option>
						</Select>
					</Col>
					<Col span={12}>
						<div>Spend</div>
						<Select defaultValue="lucy">
							<Option value="jack">Jack</Option>
							<Option value="lucy">Lucy</Option>
							<Option value="disabled" disabled>
								Disabled
							</Option>
							<Option value="Yiminghe">yiminghe</Option>
						</Select>
					</Col>
				</Row>
			</Card>

			{/*<TitleSection
				title={title + " Calculator"}
				cancelCallback={cancelCallback}
				currency={currency}
				currencyHandler={setCurrency}
				rangeFactorHandler={setRangeFactor}
			/>*/}
			<calc.type
				currency={currency}
				rangeFactor={rangeFactor}
				allInputDone={allInputDone}
				allInputDoneHandler={setAllInputDone}
				showTab={showTab}
				showTabHandler={setShowTab}
				tabOptions={calc.tabOptions}
				cancelCallback={cancelCallback}
			/>
		</Fragment>
	);
}
