import React, { Fragment, useContext } from 'react';
import { Button, Steps, Space, Row, Col } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import TabContent from './TabContent';
import { SaveOutlined } from '@ant-design/icons';
import { CalcContext } from '../calc/CalcContext';

import './Input.less';
import VideoPlayer from '../VideoPlayer';

export default function Input() {
	const {
		inputTabs,
		inputTabIndex,
		setInputTabIndex,
		allInputDone,
		setAllInputDone,
		showOptionsForm,
		setOptionsVisibility,
		isPublicCalc,
		handleSubmit,
		disableSubmit,
		stepVideoUrl,
		errors
	}: any = useContext(CalcContext);
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
				<div className="goals-container">
					<header>
						<Steps
							current={inputTabIndex}
							onChange={(index: number) => {
								if (index < inputTabIndex) setInputTabIndex(index);
							}}
							status={errors.hasOwnProperty(inputTabIndex) && "error"}
						>
							{inputTabs.map((tab: any, i: number) => (
								<Step
									key={tab.label}
									title={
										<Space align="center" size="small">
											<tab.svg disabled={!tab.active} selected={i === inputTabIndex} />
											{tab.label}
										</Space>
									}
									disabled={!tab.active || i > inputTabIndex}
								/>
							))}
						</Steps>
					</header>
					<section style={{ maxWidth: '1200px' }}>
						<Row justify={stepVideoUrl ? 'space-between' : 'center'}>
							<Col span={stepVideoUrl ? 11 : 24} style={{ marginLeft: '1rem', maxWidth: '500px' }}>
								<TabContent />
								<Row>
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
										<Button type="primary" onClick={() => setAllInputDone(true)}>
											Done
										</Button>
									)}
								</Row>
							</Col>
							{stepVideoUrl && (
								<Col span={12}>
									<VideoPlayer url={stepVideoUrl} />
								</Col>
							)}
						</Row>
					</section>
				</div>
			) : (
				<div className={`calculator-options ${showOptionsForm ? 'show-form' : 'hide-form'}`}>
					<div className="overlay" />
					<div>
						<Row justify="space-between">
							{inputTabs.map((tab: any, i: number) => (
								<Col
									key={tab.label}
									style={{
										cursor: tab.active ? 'pointer' : 'cursor-not-allowed'
									}}
									className={inputTabIndex === i ? 'active' : ''}
									onClick={() => {
										setOptionsVisibility(true);
										setInputTabIndex(i);
									}}
								>
									<Row justify="center">
										<tab.svg disabled={!tab.active} selected={inputTabIndex === i} />
									</Row>
									<Row justify="center">{tab.label}</Row>
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
						<Col span={24}>
							<TabContent />
						</Col>
						{!isPublicCalc && handleSubmit ? (
							<Row justify="center">
								<Button
									type="primary"
									onClick={() => handleSubmit()}
									icon={<SaveOutlined />}
									disabled={disableSubmit}
									loading={disableSubmit}
								>
									Save
								</Button>
							</Row>
						) : null}
					</section>
				</div>
			)}
		</Fragment>
	);
}
