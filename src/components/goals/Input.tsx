import React, { Fragment, ReactNode, useContext, useState } from 'react';
import { Button, Steps, Space, Row, Col } from 'antd';
import { CloseOutlined } from "@ant-design/icons";
import ActionButtons from '../form/actionbuttons';
import { CalcContext } from '../calc/CalcContext';
interface InputProps {
	submitDisabled?: boolean;
	cancelDisabled?: boolean;
	children: ReactNode;
	handleSubmit?: Function | null;
}

export default function Input({ submitDisabled, cancelDisabled, children, handleSubmit }: InputProps) {
	const {
		inputTabs,
		showTab,
		setShowTab,
		allInputDone,
		setAllInputDone,
		cancelCalc,
		showOptionsForm,
		setOptionsVisibility
	}: any = useContext(CalcContext);
	const { Step } = Steps;
	const [ currentStep, setCurrentStep ] = useState<number>(0);

	const handleStepChange = (count: number = 1) => {
		let co = currentStep + count;
		if (co < 0 || !inputTabs[co]) return;
		if (!inputTabs[co].active) co += count;
		setShowTab(inputTabs[co].label);
		setCurrentStep(co);
	};

	return (
		<Fragment>
			{!allInputDone ? (
				<Fragment>
				<Steps current={currentStep}>
					{inputTabs.map((tab: any) => (
						<Step
							key={tab.label}
							title={
								<Space align="center" size="small">
									<tab.svg disabled={!tab.active} selected={showTab === tab.label} />
									{tab.label}
								</Space>
							}
							disabled={!tab.active}
						/>
					))}
				</Steps>
				{React.Children.map(children, (child: any) => (child ? child : null))}
				<div>
				{currentStep > 0 && (
					<Button style={{ margin: '0 8px' }} onClick={() => handleStepChange(-1)}>
						Previous
					</Button>
				)}
				{currentStep < inputTabs.length - 1 && (
					<Button type="primary" onClick={() => handleStepChange()}>
						Next
					</Button>
				)}
				{currentStep === inputTabs.length - 1 && (
					<Button
						type="primary"
						onClick={() => {
							setShowTab(inputTabs[inputTabs.length - 1].label);
							setAllInputDone(true);
						}}
					>
						Done
					</Button>
				)}
					</div>
					</Fragment>
			) : (
				<div className={`calculator-options ${showOptionsForm ? 'show-form' : 'hide-form'}`}>
				<div className="overlay"></div>
					<div>
				<Row justify="space-between">
						{inputTabs.map((tab: any) => (
							<Col
								key={tab.label}
								style={{ cursor: tab.active ? 'pointer' : 'cursor-not-allowed' }}
								onClick={() => {
									setOptionsVisibility(true);
									setShowTab(tab.label);
								}}
							>
								<tab.svg disabled={!tab.active} selected={showTab === tab.label} />
								<label>{tab.label}</label>
							</Col>
						))}
				</Row>
						</div>
						<section>
						<Button
							size="small"
							type="primary"
							className="close-btn"
							onClick={() => setOptionsVisibility(false)}
						>
							<CloseOutlined />
							</Button>
							{React.Children.map(children, (child: any) => (child ? child : null))}
							{handleSubmit && (
								<ActionButtons
									submitDisabled={submitDisabled ? submitDisabled : false}
									cancelDisabled={cancelDisabled ? cancelDisabled : false}
									cancelHandler={cancelCalc}
									submitHandler={handleSubmit}
									submitText="Save"
								/>)}
						</section>
						</div>
			)}
		</Fragment>
	);
}
