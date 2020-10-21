import React, { ReactNode, useContext, useState } from 'react';
import { Button, Steps, Tabs, Space, Statistic } from 'antd';
import ActionButtons from '../form/actionbuttons';
import { CalcContext } from '../calc/CalcContext';
interface InputProps {
	submitDisabled?: boolean;
	cancelDisabled?: boolean;
	children: ReactNode;
	handleSubmit?: Function | null;
}

export default function Input({
	submitDisabled,
	cancelDisabled,
	children,
	handleSubmit,
}: InputProps) {
	const { inputTabs, showTab, setShowTab, allInputDone, setAllInputDone, cancelCalc }: any = useContext(CalcContext);
	const { Step } = Steps;
	const { TabPane } = Tabs;
	const [ currentStep, setCurrentStep ] = useState<number>(0);

	const handleStepChange = (count: number = 1) => {
		let co = currentStep + count;
		if (co < 0 || !inputTabs[co]) return;
		if (!inputTabs[co].active) co += count;
		setShowTab(inputTabs[co].label);
		setCurrentStep(co);
	};

	return (
		<Space align="center" direction="vertical" style={{ width: '100%' }}>
			<Space align="center">
				{!allInputDone ? (
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
				) : (
					<Tabs defaultActiveKey={showTab} onTabClick={(key: string) => setShowTab(key)}>
						{inputTabs.map((tab: any) => (
							<TabPane
								key={tab.label}
								disabled={!tab.active}
								tab={
									<Statistic
										title=""
										value={tab.label}
										prefix={<tab.svg disabled={!tab.active} selected={showTab === tab.label} />}
									/>
								}
							/>
						))}
					</Tabs>
				)}
			</Space>
			<Space align="center">{React.Children.map(children, (child: any) => (child ? child : null))}</Space>
			{!allInputDone ? (
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
			) : (
				handleSubmit && (
					<ActionButtons
						submitDisabled={submitDisabled ? submitDisabled : false}
						cancelDisabled={cancelDisabled ? cancelDisabled : false}
						cancelHandler={cancelCalc}
						submitHandler={handleSubmit}
						submitText="Save"
					/>
				)
			)}
		</Space>
	);
}
