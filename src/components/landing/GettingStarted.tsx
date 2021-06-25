import React, { useContext } from 'react';
import { Col, Image } from 'antd';
import { JoinContext } from './JoinContext';
import Join from './Join';
import './GettingStarted.less';
import { Status } from '../../api/goals';
import { AppContext } from '../AppContext';
import GetStartedButton from './GetStartedButton';

export default function GettingStarted() {
	const { defaultCountry }: any = useContext(AppContext);
	const { status }: any = useContext(JoinContext);

	return (
		<Col xs={24} sm={24} md={12} className="getting-started">
			<h2>One-stop solution for Your family's financial concerns</h2>
			<Image preview={false} src="images/kick-start.jpg" />
			<p style={{ textAlign: 'center' }}>
				{defaultCountry === 'IN' ? <GetStartedButton /> : status !== Status.Y ? <Join /> : null}
			</p>
		</Col>
	);
}
