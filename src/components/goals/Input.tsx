import React, { ReactNode, useState } from 'react';
import { Button, Steps, Tabs, Space, Statistic } from 'antd';
import ActionButtons from '../form/actionbuttons';
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
		if (!tabOptions[co].active) co += count;
		showTabHandler(tabOptions[co].label);
		setCurrentStep(co);
	};

	return (
		<Space align="center" direction="vertical" size="large" style={{ width: '100%' }}>
			<Space align="center">
				{!allInputDone ? (
					<Steps current={currentStep}>
						{tabOptions.map((tab) => (
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
					<Tabs defaultActiveKey={showTab} onTabClick={(key: string) => showTabHandler(key)}>
						{tabOptions.map((tab) => (
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
					{currentStep < tabOptions.length - 1 && (
						<Button type="primary" onClick={() => handleStepChange()}>
							Next
						</Button>
					)}
					{currentStep === tabOptions.length - 1 && (
						<Button
							type="primary"
							onClick={() => {
								showTabHandler(tabOptions[tabOptions.length - 1].label);
								allInputDoneHandler(true);
							}}
						>
							Done
						</Button>
					)}
				</div>
			) : (
				handleSubmit && (
					<ActionButtons
						submitDisabled={submitDisabled}
						cancelDisabled={cancelDisabled}
						cancelHandler={cancelCallback}
						submitHandler={handleSubmit}
						submitText="Save"
					/>
				)
			)}
		</Space>
	);
}
