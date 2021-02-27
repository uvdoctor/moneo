import { Alert, Button, Col, PageHeader, Row } from 'antd';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { EditOutlined } from '@ant-design/icons';
import { PlanContext } from './PlanContext';

export default function FISummaryHeader() {
	const { ffGoal, planError, ffYear, editGoal }: any = useContext(PlanContext);

	const getSummary = () => {
		let result = 'Financial Independence ';
		result += ffYear ? `at ${ffYear - ffGoal.sy}` : 'Not Achievable';
		return result;
	};

	const [ summary, setSummary ] = useState(getSummary());

	useEffect(() => setSummary(getSummary()), [ ffYear ]);

	return (
		<Fragment>
			{planError && <Alert type="error" message={planError} />}
			{summary ? (
				<Row>
					<Col span={24} className="primary-header">
						<PageHeader
							title={summary}
							extra={[
								<Button key="Edit" className="steps-start-btn" onClick={() => editGoal(ffGoal.id)}>
									<EditOutlined /> Edit
								</Button>
							]}
						/>
					</Col>
				</Row>
			) : null}
		</Fragment>
	);
}
