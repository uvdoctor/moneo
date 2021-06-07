import React, { Fragment, useContext, useEffect } from 'react';
import { Button, Steps, Row, Col, Space, Affix } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { CalcContext } from '../calc/CalcContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import VideoPlayer from '../VideoPlayer';

import './Input.less';
import ResultCarousel from '../ResultCarousel';

export default function Input() {
	const {
		inputTabs,
		inputTabIndex,
		setInputTabIndex,
		allInputDone,
		setAllInputDone,
		showOptionsForm,
		setOptionsVisibility,
		stepVideoUrl,
		error,
		handleStepChange,
		fsb,
	}: any = useContext(CalcContext);
	const { Step } = Steps;

	const isMobileDevice = () => fsb.info.innerWidth < 1200;

	useEffect(
		() => {
			if (fsb.info.innerWidth > 767) {
				document.body.classList.remove('no-scrollbar');
			} else {
				if (showOptionsForm) document.body.classList.add('no-scrollbar');
				else document.body.classList.remove('no-scrollbar');
			}
		},
		[ fsb.info.innerWidth, showOptionsForm ]
	);

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
							status={error ? 'error' : 'process'}
						>
							{inputTabs.map((tab: any) => (
								<Step
									key={tab.label}
									title={
										<Fragment>
											<FontAwesomeIcon icon={tab.svg} />
											<label>{tab.label}</label>
										</Fragment>
									}
									disabled={!tab.active}
								/>
							))}
						</Steps>
					</header>
					<section>
						<Row justify={stepVideoUrl ? 'space-between' : 'center'}>
							<Col span={stepVideoUrl ? 11 : 24}>
								{inputTabs[inputTabIndex].content}
								<Row align="middle">
									<Col span={24}>
										<Space>
											{inputTabIndex > 0 && (
												<Button onClick={() => handleStepChange(-1)}>Previous</Button>
											)}
											{inputTabIndex < inputTabs.length - 1 && (
												<Button
													type="primary"
													disabled={error}
													onClick={() => handleStepChange()}
												>
													Next
												</Button>
											)}
											{inputTabIndex === inputTabs.length - 1 && (
												<Button
													type="primary"
													onClick={() => {
														setAllInputDone(true);
														if (isMobileDevice()) setInputTabIndex(-1);
													}}
												>
													Done
												</Button>
											)}
										</Space>
									</Col>
								</Row>
							</Col>
							{stepVideoUrl && (
								<Col className="video-container" span={12}>
									<VideoPlayer url={stepVideoUrl} />
								</Col>
							)}
						</Row>
					</section>
				</div>
			) : (
				<Affix offsetTop={0}>
					<div className={`calculator-options ${showOptionsForm ? 'show-form' : 'hide-form'}`}>
						<div className="overlay" />
						<div>
							<Row justify="space-between">
								{inputTabs.map((tab: any, i: number) => (
									<Col
										key={i}
										className={`${inputTabIndex === i
											? error ? 'error' : !isMobileDevice() || showOptionsForm ? 'active' : ''
											: ''} ${!tab.active ? 'disabled' : ''}`}
										onClick={() => {
											if (tab.active) {
												setOptionsVisibility(
													isMobileDevice() && i === inputTabIndex ? !showOptionsForm : true
												);
												setInputTabIndex(i);
												if (isMobileDevice()) {
													!showOptionsForm
														? document.body.classList.add('no-scrollbar')
														: document.body.classList.remove('no-scrollbar');
												}
											}
										}}
									>
										<Row justify="center">
											<FontAwesomeIcon icon={tab.svg} />
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
								onClick={() => {
									setInputTabIndex(-1);
									setOptionsVisibility(false);
								}}
							>
								<CloseOutlined />
							</Button>
							{inputTabIndex >= 0 &&
							inputTabs[inputTabIndex].active && (
								<Fragment>
									{!error && (
										<div className="mobile-only-carousel">
											<ResultCarousel />
										</div>
									)}
									{inputTabs[inputTabIndex].content}
								</Fragment>
							)}
						</section>
					</div>
				</Affix>
			)}
		</Fragment>
	);
}
