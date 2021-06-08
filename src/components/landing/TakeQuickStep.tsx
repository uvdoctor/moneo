import React, { useContext } from 'react';
import { Row, Col } from 'antd';
import Content from '../Content';
import { JoinContext } from './JoinContext';
import Join from './Join';
import { Status } from '../../api/goals';

import './TakeQuickStep.less';
import { AppContext } from '../AppContext';
import SetGoalsButton from './SetGoalsButton';

export default function TakeQuickStep() {
	const { defaultCountry }: any = useContext(AppContext);
	const { status }: any = useContext(JoinContext);

	return status !== Status.Y ? (
		<Content className="take-quick-step" whiteBg>
			<Row align="middle" gutter={[ 50, 0 ]}>
				<Col xs={24} sm={24} md={12}>
					<h2 className="text-green-primary">Just 15 minutes for a better future</h2>
					<p>Set Your Goals to get a personalized Financial Plan.</p>
					{defaultCountry === 'IN' ? <SetGoalsButton /> : <Join />}
				</Col>
				<Col xs={24} sm={24} md={12}>
					<img src="images/quick-step.jpg" />
				</Col>
			</Row>
		</Content>
	) : null;
}
