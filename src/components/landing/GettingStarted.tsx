import React, { useContext } from 'react';
import { Col, Image } from 'antd';
import { JoinContext } from './JoinContext';
import Join from './Join';
import './GettingStarted.less';
import { Status } from '../../api/goals';
import { AppContext } from '../AppContext';
import SetGoalsButton from './SetGoalsButton';

export default function GettingStarted() {
	const { defaultCountry }: any = useContext(AppContext);
	const { status }: any = useContext(JoinContext);

	return (
		<Col xs={24} sm={24} md={12}>
			<div className="getting-started">
				<h2>Kick-start Your Financial Independence</h2>
				{defaultCountry === 'IN' ? <SetGoalsButton /> : status !== Status.Y ? <Join /> : null}
				<Image preview={false} src="images/kick-start.jpg" />
			</div>
		</Col>
	);
}
