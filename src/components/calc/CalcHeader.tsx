import { Modal, PageHeader, Rate, Row, Col, Tooltip, Button } from 'antd';
import React, { Fragment, useContext, useState } from 'react';
import { ShareAltOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import SelectInput from '../form/selectinput';
import { CalcContext } from './CalcContext';
import SocialShare from '../SocialShare';
import Feedback from '../feedback/Feedback';
import { getGoalTypes, getImpLevels } from '../goals/goalutils';
import { PlanContext } from '../goals/PlanContext';
import TextInput from '../form/textinput';
import { GoalContext } from '../goals/GoalContext';
import { GoalType } from '../../api/goals';
import { COLORS } from '../../CONSTANTS';

export default function CalcHeader() {
	const { isPublicCalc }: any = useContext(PlanContext);
	const {
		goal,
		rating,
		setRating,
		showFeedbackModal,
		setShowFeedbackModal,
		disableSubmit,
		handleSubmit,
		btnClicked,
		setError,
		allInputDone
	}: any = useContext(CalcContext);
	const { name, setName, impLevel, setImpLevel }: any = useContext(GoalContext);
	const ratingLabels = [ 'Rate Calculator', 'Very Poor', 'Poor', 'Average', 'Good', 'Awesome!' ];
	const [ ratingLabel, setRatingLabel ] = useState<string>('');

	const closeModal = () => setShowFeedbackModal(false);

	return (
		<Fragment>
			<div className="primary-header">
				<Row>
					<Col span={24}>
						<PageHeader
							title={
								isPublicCalc ? (
									goal.name
								) : goal.type === GoalType.FF ? (
									goal.name
								) : (
									<TextInput
										pre={(getGoalTypes() as any)[goal.type]}
										post={
											<SelectInput
												pre=""
												value={impLevel}
												changeHandler={setImpLevel}
												options={getImpLevels()}
											/>
										}
										placeholder="Goal Name"
										value={name}
										changeHandler={setName}
										fieldName="Goal Name"
										minLength={3}
										setError={setError}
									/>
								)
							}
							extra={[
								isPublicCalc ? (
									<Tooltip
										title={
											<div className="tooltip-share">
												<SocialShare />
											</div>
										}
									>
										<Button
											type="link"
											icon={<ShareAltOutlined />}
											style={{ color: COLORS.WHITE }}
										/>
									</Tooltip>
								) : (
									<Button
										icon={<SaveOutlined />}
										loading={btnClicked}
										disabled={disableSubmit || !allInputDone}
										onClick={() => handleSubmit()}
										size="large"
										className="steps-start-btn"
									>
										Submit
									</Button>
								)
							]}
						/>
					</Col>
					<Col span={24} className="secondary-header">
						<Row justify="space-between" align="middle">
							<Col style={{ color: COLORS.WHITE }}>
								<Rate
									allowClear
									value={rating}
									onChange={(rating: number) => setRating(rating)}
									onHoverChange={(rating: number) => setRatingLabel(ratingLabels[rating])}
								/>
								&nbsp;&nbsp;{ratingLabel ? ratingLabel : ratingLabels[rating]}
							</Col>
							{!isPublicCalc && (
								<Col>
									<Row>
										<Tooltip
											title={
												<div className="tooltip-share">
													<SocialShare />
												</div>
											}
										>
											<ShareAltOutlined />
										</Tooltip>
										&nbsp;&nbsp;
										<div
											onClick={() => handleSubmit(true)}
											style={{ color: COLORS.WHITE, cursor: 'pointer' }}
										>
											<CloseOutlined />
										</div>
									</Row>
								</Col>
							)}
						</Row>
					</Col>
				</Row>
			</div>
			{showFeedbackModal && (
				<Modal
					visible={showFeedbackModal}
					centered
					title="Please help Us to Improve"
					footer={null}
					maskClosable
					onCancel={closeModal}
				>
					<Feedback />
				</Modal>
			)}
		</Fragment>
	);
}
