import { Alert, Button, Col, PageHeader, Row } from 'antd';
import React, { Fragment, useContext, useEffect } from 'react';
import { isFFPossible } from './cfutils';
import { EditOutlined } from '@ant-design/icons';
import { PlanContext } from './PlanContext';

export default function FISummaryHeader() {
	const { ffGoal, ffResult, setGoal, allGoals, planError, setPlanError, rr }: any = useContext(PlanContext);
	
	const checkFIError = () => {
		if (!isFFPossible(ffResult, ffGoal?.sa as number)) {
      setPlanError(`Please try again with different inputs / goals so that Financial Independence is Achievable by Age of ${ffGoal.loan?.rate}.`);
    } else {
      setPlanError("");
    }
	};

	useEffect(() => checkFIError(), []);

	useEffect(() => checkFIError(), [rr]);

	return (
		<Fragment>
			{planError && <Alert type="error" message={planError} />}
			{ffGoal && allGoals ? <Row>
				<Col span={24} className="primary-header">
					<PageHeader
						title={`Financial Independence ${isFFPossible(ffResult, ffGoal.sa as number)
							? `at ${ffResult.ffYear - ffGoal.sy}`
							: `Not Achievable`}`}
						extra={[
							<Button key="Edit" className="steps-start-btn" onClick={() => setGoal(Object.assign({}, ffGoal))}>
								<EditOutlined /> Edit
						</Button>
						]}
					/>
				</Col>
			</Row> : null}
		</Fragment>
	);
}
