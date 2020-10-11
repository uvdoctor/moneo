import React, { Fragment, ReactNode, useState } from 'react';
import { Button, Steps, Tabs, Row, Col } from 'antd';
import ActionButtons from '../form/actionbuttons';
import './Input.less';
interface InputProps {
	tabOptions: Array<any>;
	submitDisabled: boolean;
	cancelDisabled: boolean;
	showTab: string;
	showTabHandler: Function;
	children: ReactNode;
	cancelCallback: Function;
	handleSubmit?: Function | null;
	allInputDone: boolean;
	allInputDoneHandler: Function;
}

export default function Input({
	tabOptions,
	submitDisabled,
	cancelDisabled,
	showTab,
	showTabHandler,
	children,
	cancelCallback,
	handleSubmit,
	allInputDone,
	allInputDoneHandler
}: InputProps) {
	const { Step } = Steps;
	const { TabPane } = Tabs;
	const [ currentStep, setCurrentStep ] = useState<number>(0);

	const handleStepChange = (count: number = 1) => {
		let co = currentStep + count;
		if (co < 0 || !tabOptions[co]) return;
		if (!tabOptions[co].active) handleStepChange(count);
		else {
			showTabHandler(tabOptions[co].label);
			setCurrentStep(co);
		}
	};

	return (
		<Fragment>
			<Row>
				<Col>
			{!allInputDone ? (
				<Steps current={currentStep}>
					{tabOptions.map((tab, i) => {
						<Step
							key={'tab' + i}
							title={tab.label}
							icon={<tab.svg disabled={!tab.active} selected={showTab === tab.label} />}
							disabled={!tab.active}
						/>
					})}
				</Steps>
			) : (
				<Tabs defaultActiveKey={tabOptions[0].label} onTabClick={(e: any) => showTabHandler(e.key)}>
					{tabOptions.map((tab) => (
						<TabPane
							key={tab.label}
							disabled={!tab.active}
							tab={
								<span>
									<tab.svg disabled={!tab.active} selected={showTab === tab.label} />
									{tab.label}
								</span>
							}
						/>
					))}
				</Tabs>
						)}
					</Col>
				</Row>
			<div className="steps-content">{React.Children.map(children, (child: any) => (child ? child : null))}</div>

			{!allInputDone ? (
				<div className="steps-action">
					{currentStep < tabOptions.length - 1 && (
						<Button type="primary" onClick={() => handleStepChange()}>
							Next
						</Button>
					)}
					{currentStep === tabOptions.length - 1 && (
						<Button type="primary" onClick={() => allInputDoneHandler(true)}>
							Done
						</Button>
					)}
					{currentStep > 0 && (
						<Button style={{ margin: '0 8px' }} onClick={() => handleStepChange(-1)}>
							Previous
						</Button>
					)}
				</div>
			) : handleSubmit && (
				<ActionButtons
					submitDisabled={submitDisabled}
					cancelDisabled={cancelDisabled}
					cancelHandler={cancelCallback}
					submitHandler={handleSubmit}
					submitText="Save"
				/>
			)}
		</Fragment>
	);
}
