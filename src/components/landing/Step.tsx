import React from 'react';
import { Row, Col, Image, Button } from 'antd';
import './Step.less';
import Link from 'next/link';
import { ROUTES } from '../../CONSTANTS';
import { RocketOutlined } from '@ant-design/icons';

interface StepProps {
	className: string;
	count: string;
	title: string;
	subTitle: string;
	content: string;
	imgSrc: any;
}

export default function Step({ className, count, title, subTitle, content, imgSrc }: StepProps) {
	return (
		<Col xs={24} sm={24} md={12}>
			<div className={`step ${className}`}>
				<Row justify="space-around" align="middle">
					<Col flex="90px" className="count">
						{count}
					</Col>
					<Col flex="auto">
						<hgroup>
							<h2>{title}</h2>
							<h3>{subTitle}</h3>
						</hgroup>
					</Col>
				</Row>
				<p>{content}</p>
				<Image preview={false} src={imgSrc} />
				<p style={{textAlign: 'center'}}>
					<Link href={ROUTES.GET}>
						<a>
							<Button icon={<RocketOutlined />} type="primary" className="steps-start-btn">Get Started</Button>
						</a>
					</Link>
				</p>
			</div>
		</Col>
	);
}
