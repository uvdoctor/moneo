import React, { Fragment, useContext } from 'react';
import { Button, Steps, Space, Row, Col } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import SubmitButton from '../form/SubmitButton';
import TabContent from './TabContent';
interface InputProps {
	contextType: any;
}

export default function Input({ contextType }: InputProps) {
	const {
		inputTabs,
		inputTabIndex,
		setInputTabIndex,
		allInputDone,
		setAllInputDone,
		showOptionsForm,
		setOptionsVisibility,
		isPublicCalc
	}: any = useContext(contextType);
	const { Step } = Steps;

	const handleStepChange = (count: number = 1) => {
		let co = inputTabIndex + count;
		if (co < 0 || !inputTabs[co]) return;
		if (!inputTabs[co].active) co += count;
		setInputTabIndex(co);
	};

	return (
		<Fragment>
			{!allInputDone ? (
				<Row align="middle" justify="space-around">
					<Col>
						<Steps direction="vertical" current={inputTabIndex}>
							{inputTabs.map((tab: any, i: number) => (
								<Step
									key={tab.label}
									title={
										<Space align="center" size="small">
											<tab.svg disabled={!tab.active} selected={i === inputTabIndex} />
											{tab.label}
										</Space>
									}
									disabled={!tab.active}
								/>
							))}
						</Steps>
					</Col>
					<Col>
						<Row style={{ margin: '1rem' }}>
							<TabContent contextType={contextType} />
						</Row>
						<Row justify="center" style={{ marginBottom: '1rem' }}>
							{inputTabIndex > 0 && (
								<Button style={{ margin: '0 8px' }} onClick={() => handleStepChange(-1)}>
									Previous
								</Button>
							)}
							{inputTabIndex < inputTabs.length - 1 && (
								<Button type="primary" onClick={() => handleStepChange()}>
									Next
								</Button>
							)}
							{inputTabIndex === inputTabs.length - 1 && (
								<Button
									type="primary"
									onClick={() => setAllInputDone(true)}>
									Done
								</Button>
							)}
						</Row>
					</Col>
				</Row>
			) : (
				<div className={`calculator-options ${showOptionsForm ? 'show-form' : 'hide-form'}`}>
					<div className="overlay" />
					<div>
						<Row justify="space-between">
							{inputTabs.map((tab: any, i: number) => (
								<Col
									key={tab.label}
									style={{ cursor: tab.active ? 'pointer' : 'cursor-not-allowed' }}
									className={inputTabIndex === i ? 'active' : ''}
									onClick={() => {
										setOptionsVisibility(true);
										setInputTabIndex(i);
									}}
								>
									<tab.svg disabled={!tab.active} selected={inputTabIndex === i} />
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
						<TabContent contextType={contextType} />
						{!isPublicCalc && <SubmitButton />}
					</section>
				</div>
			)}
		</Fragment>
	);
}
