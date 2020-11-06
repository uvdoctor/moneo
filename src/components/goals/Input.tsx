import React, { Fragment, useContext } from "react";
import { Button, Steps, Row, Col, Space } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { SaveOutlined } from "@ant-design/icons";
import { CalcContext } from "../calc/CalcContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import VideoPlayer from "../VideoPlayer";
import { COLORS } from "../../CONSTANTS";

import "./Input.less";

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
							status={error ? "error" : "process"}
						>
							{inputTabs.map((tab: any, i: number) => (
								<Step
									key={tab.label}
									title={
										<Fragment>
											<FontAwesomeIcon icon={tab.svg} />
											<label>{tab.label}</label>
										</Fragment>
									}
									disabled={!tab.active || i > inputTabIndex}
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
									{error && <div class="error-txt">{error}</div>}
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
									key={tab.label}
									style={{
										cursor: tab.active ? "pointer" : "cursor-not-allowed",
									}}
									className={inputTabIndex === i ? "active" : ""}
									onClick={() => {
										setOptionsVisibility(true);
										setInputTabIndex(i);
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
						<Col span={24}>{inputTabs[inputTabIndex].content}</Col>
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
