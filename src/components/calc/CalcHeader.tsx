import { Modal, PageHeader, Rate, Input, Row, Col } from 'antd';
import React, { Fragment, useContext, useState } from 'react';
import SelectInput from '../form/selectinput';
import { CalcContext } from './CalcContext';
import Draggable from 'react-draggable';
import * as gtag from '../../lib/gtag';

export default function CalcHeader() {
	const { TextArea } = Input;
	const {
		goal,
		currency,
		changeCurrency,
		rating,
		setRating,
		showFeedbackModal,
		setShowFeedbackModal,
		feedbackText,
		setFeedbackText
	}: any = useContext(CalcContext);
	const ratingLabels = [ '', 'Very Poor', 'Poor', 'Average', 'Good', 'Delighted!' ];
	const [ ratingLabel, setRatingLabel ] = useState<string>('');

	const saveFeedback = () => {
		if (!feedbackText) return;
		gtag.event({
			category: goal.name,
			action: 'Rating',
			label: 'Feedback',
			value: feedbackText
		});
		setFeedbackText('');
		setShowFeedbackModal(false);
	};

	return (
		<Fragment>
			<Row className="calculator-header">
				<Col span={24}>
					<PageHeader
						title={goal.name}
						extra={[
							<SelectInput
								key="currselect"
								pre=""
								value={currency}
								changeHandler={changeCurrency}
								currency
							/>
						]}
					/>
				</Col>
				<Col span={24} style={{ color: 'white' }}>
					<Row justify="center">
						<div style={{ width: '270px' }}>
							<span style={{ marginRight: '0.5rem' }}>Rate Us</span>
							<Rate
								allowClear
								value={rating}
								onChange={(rating: number) => setRating(rating)}
								onHoverChange={(rating: number) => setRatingLabel(ratingLabels[rating])}
							/>
							<span style={{ marginLeft: '0.5rem' }}>
								{ratingLabel ? ratingLabel : ratingLabels[rating]}
							</span>
						</div>
					</Row>
				</Col>
			</Row>
			{showFeedbackModal && (
				<Modal
					visible={showFeedbackModal}
					centered
					title="Please help Us to Improve"
					onCancel={() => setShowFeedbackModal(false)}
					onOk={() => saveFeedback()}
					//@ts-ignore
					modalRender={(modal: any) => <Draggable>{modal}</Draggable>}
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
