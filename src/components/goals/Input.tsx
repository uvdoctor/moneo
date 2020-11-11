import React, { Fragment, useContext } from "react";
import { Button, Steps, Row, Col, Space } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { SaveOutlined } from "@ant-design/icons";
import { CalcContext } from "../calc/CalcContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DDVideoPlayer from "../DDVideoPlayer";

import "./Input.less";
import ResultCarousel from "../ResultCarousel";
import { isMobileDevice } from "../utils";

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
		error,
		handleStepChange,
		fsb
	}: any = useContext(CalcContext);
	const { Step } = Steps;

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
							status={error ? "error" : "process"}
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
						<Row justify={stepVideoUrl ? "space-between" : "center"}>
							<Col span={stepVideoUrl ? 11 : 24}>
								{inputTabs[inputTabIndex].content}
								<Row align="middle">
									<Space>
										{inputTabIndex > 0 && (
											<Button onClick={() => handleStepChange(-1)}>
												Previous
											</Button>
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
												onClick={() => setAllInputDone(true)}
											>
												Done
											</Button>
										)}
									</Space>
								</Row>
							</Col>
							{stepVideoUrl && (
								<Col span={12}>
									<DDVideoPlayer url={stepVideoUrl} />
								</Col>
							)}
						</Row>
					</section>
				</div>
			) : (
				<div
					className={`calculator-options ${
						showOptionsForm ? "show-form" : "hide-form"
					}`}
				>
					<div className="overlay" />
					<div>
						<Row justify="space-between">
							{inputTabs.map((tab: any, i: number) => (
								<Col
									key={i}
									className={`${
										inputTabIndex === i ? (error ? "error" : !isMobileDevice(fsb) || showOptionsForm ? "active" : "") : ""
									} ${!tab.active ? "disabled" : ""}`}
									onClick={() => {
										if (tab.active) {
											setOptionsVisibility(isMobileDevice(fsb) ? !showOptionsForm : true);
											setInputTabIndex(i);
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
							onClick={() => setOptionsVisibility(false)}
						>
							<CloseOutlined />
						</Button>
						{inputTabs[inputTabIndex].active && (
							<Fragment>
									{!error && <Col span={24}>
										<ResultCarousel />
									</Col>}
								<Col span={24}>{inputTabs[inputTabIndex].content}</Col>
							</Fragment>
						)}
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
