import React, { Fragment, useContext } from "react";
import { Button, Steps, Space, Row, Col } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import TabContent from "./TabContent";
import { SaveOutlined } from "@ant-design/icons";
import { CalcContext } from "../calc/CalcContext";

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
							current={inputTabIndex}
							onChange={(index: number) => {
								if (index < inputTabIndex) setInputTabIndex(index);
							}}
						>
							{inputTabs.map((tab: any, i: number) => (
								<Step
									key={tab.label}
									title={
										<Space align="center" size="small">
											<tab.svg
												disabled={!tab.active}
												selected={i === inputTabIndex}
											/>
											{tab.label}
										</Space>
									}
									disabled={!tab.active || i > inputTabIndex}
								/>
							))}
						</Steps>
					</header>
					<section>
						<Row>
							<Col md={24} lg={10}>
								<TabContent />
								<div>
									{inputTabIndex > 0 && (
										<Button
											style={{ margin: "0 8px" }}
											onClick={() => handleStepChange(-1)}
										>
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
											onClick={() => setAllInputDone(true)}
										>
											Done
										</Button>
									)}
								</div>
							</Col>
							<Col className="video-container" md={24} lg={14}>
								<iframe
									src="https://www.youtube.com/embed/uYMTsmeZyfU"
									frameborder="0"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowfullscreen
								></iframe>
							</Col>
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
										<tab.svg
											disabled={!tab.active}
											selected={inputTabIndex === i}
										/>
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
						<TabContent />
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
