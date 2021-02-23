import { Modal, PageHeader, Rate, Row, Col, Tooltip } from 'antd';
import React, { Fragment, useContext, useState } from 'react';
import { ShareAltOutlined } from '@ant-design/icons';
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
	const { goal, currency, setCurrency, rating, setRating, showFeedbackModal, setShowFeedbackModal }: any = useContext(
		CalcContext
	);
	const { name, setName, impLevel, setImpLevel }: any = useContext(GoalContext);
	const ratingLabels = [ 'Rate Calculator', 'Very Poor', 'Poor', 'Average', 'Good', 'Awesome!' ];
	const [ ratingLabel, setRatingLabel ] = useState<string>('');

	const closeModal = () => setShowFeedbackModal(false);

	const goalTitle = () => (
		<TextInput
			name="name"
			pre={(getGoalTypes() as any)[goal.type]}
			post={<SelectInput
				pre="Importance"
				value={impLevel}
				changeHandler={setImpLevel}
				options={getImpLevels()}
			/>}
			placeholder="Goal Name"
			value={name}
			changeHandler={setName}
		/>
	);

	return (
		<Fragment>
			<div className="primary-header">
				<Row>
					<Col span={24}>
						<PageHeader
							title={isPublicCalc || goal.type === GoalType.FF ? goal.name : goalTitle()}
							extra={[
								<Fragment key="rating">
									<Row justify="center" style={{ color: COLORS.WHITE }}>{ratingLabel ? ratingLabel : ratingLabels[rating]}</Row>
									<Row justify="center">
										<Rate
											allowClear
											value={rating}
											onChange={(rating: number) => setRating(rating)}
											onHoverChange={(rating: number) => setRatingLabel(ratingLabels[rating])}
										/>
									</Row>
								</Fragment>
							]}
						/>
					</Col>
					<Col span={24} className="secondary-header">
						<Row justify="start" align="middle">
							<Col flex="auto">
								<SelectInput
									key="currselect"
									pre="Currency"
									value={currency}
									changeHandler={setCurrency}
									currency
								/>
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
