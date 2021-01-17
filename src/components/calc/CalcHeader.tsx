import { Modal, PageHeader, Rate, Input, Row, Col, Tooltip } from "antd";
import React, { Fragment, ReactNode, useContext, useState } from "react";
import { ShareAltOutlined } from "@ant-design/icons";
import SelectInput from "../form/selectinput";
import { CalcContext } from "./CalcContext";
import Draggable from "react-draggable";
import SocialShare from "../SocialShare";
//import * as gtag from "../../lib/gtag";
interface CalcHeaderProps {
	children?: any;
	title?: ReactNode;
}

export default function CalcHeader({ title, children }: CalcHeaderProps) {
	const { TextArea } = Input;
	const {
		goal,
		currency,
		setCurrency,
		rating,
		setRating,
		showFeedbackModal,
		setShowFeedbackModal,
		feedbackText,
		setFeedbackText,
		fsb
	}: any = useContext(CalcContext);
	const ratingLabels = ["", "Very Poor", "Poor", "Average", "Good", "Awesome!"];
	const [ratingLabel, setRatingLabel] = useState<string>("");

	const saveFeedback = () => {
		if (!feedbackText) return;
		/*
		gtag.event({
			category: goal.name,
			action: "Rating",
			label: "Feedback",
			value: feedbackText,
		});*/
		setFeedbackText("");
		setShowFeedbackModal(false);
	};

	return (
		<Fragment>
			<div className="primary-header">
				<Row>
					<Col span={24}>
						<PageHeader
							title={title ? title : goal.name}
							extra={[
								<SelectInput
									key="currselect"
									pre=""
									value={currency}
									changeHandler={setCurrency}
									currency
								/>,
							]}
						/>
					</Col>
					<Col span={24} className="secondary-header">
						<Row justify={children ? "space-around" : "start"} align="middle">
							{children && <Col>{children}</Col>}
							<Col flex="auto">
								<span style={{ marginRight: "0.5rem" }}>Rate Calculator</span>
								<Rate
									allowClear
									value={rating}
									onChange={(rating: number) => setRating(rating)}
									onHoverChange={(rating: number) =>
										setRatingLabel(ratingLabels[rating])
									}
								/>
								<span style={{ marginLeft: "0.5rem" }}>
									{ratingLabel ? ratingLabel : ratingLabels[rating]}
								</span>
							</Col>
							<Col flex="20px">
								<Tooltip
									title={
										<div className="tooltip-share">
											<SocialShare />
										</div>
									}
								>
									<ShareAltOutlined />
								</Tooltip>
							</Col>
						</Row>
					</Col>
				</Row>
			</div>
			{showFeedbackModal && (
				<Modal
					visible={showFeedbackModal}
					centered
					title="Please help Us to Improve"
					onCancel={() => setShowFeedbackModal(false)}
					onOk={() => saveFeedback()}
					maskClosable
					//@ts-ignore
					modalRender={(modal: any) => (
						<Draggable disabled={fsb.info.innerWidth < 1200}>{modal}</Draggable>
					)}
				>
					<TextArea
						rows={4}
						value={feedbackText}
						placeholder="Your feedback"
						onChange={(e: any) => setFeedbackText(e.currentTarget.value)}
					/>
				</Modal>
			)}
		</Fragment>
	);
}
