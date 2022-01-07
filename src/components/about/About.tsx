import React from 'react';
import { Row, Col } from 'antd';
import { faQuoteLeft, faQuoteRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Card from './Card';
import Content from '../Content';
import Image from 'next/image'

require('./about.less');
import GetStartedButton from '../landing/GetStartedButton';

export default function Home() {
	const cardData = [
		{
			title: 'What',
			description:
				'Moneo is a one-stop financial coaching platform to help families achieve worry-free financial independence.',
			imageUrl: 'images/about-what.jpg'
		},
		{
			title: 'Why',
			description:
				'There is nothing personal about personal finance. Moneo is here to change that. No more budgeting or paying commissions.',
			imageUrl: 'images/about-why.jpg'
		},
		{
			title: 'How',
			description:
				'Moneo not only provides a personalized financial plan, but also helps you to invest according to the plan.',
			imageUrl: 'images/about-how.jpg'
		}
	];

	return (
		<div className="about">
			<Content className="founder-quote" whiteBg>
				<Image src="/images/founder.jpg" alt="founder image" width={780} height={576}/>
				<hgroup>
					<h2>
						<FontAwesomeIcon icon={faQuoteLeft} />
						We&apos;re building the world&apos;s most human digital financial coach.
						<FontAwesomeIcon icon={faQuoteRight} />
					</h2>
					<h4>- Umang Doctor, Founder</h4>
				</hgroup>
			</Content>
			<Content>
				<h2>
					<strong>We believe in Financial Independence for All</strong>
				</h2>
				<p>
					That is why we are building a platform for the masses that leverages time-tested financial practices
					in order to help them make smart financial choices. We do not sell any financial product or your
					data. We earn from providing unbiased coaching service with your interest at heart. We also have
					human coaches available on call.
				</p>
				<Row
					className="what-why-how"
					align="middle"
					justify="center"
					gutter={[
						{ xs: 0, sm: 15, md: 30, lg: 50 },
						{ xs: 50, sm: 50, md: 50, lg: 50 }
					]}>
					{cardData.map((data, i) => (
						<Col key={i} xs={24} sm={12} md={8}>
							<Card {...data} />
						</Col>
					))}
				</Row>
			</Content>
			<Content whiteBg>
				<h2>
					<strong>150+ years of global experience</strong>
				</h2>
				<p>
					We have hired leading financial and technology experts from around the world to build a global
					financial platform from the ground-up so that it leverages the best of human and machine
					capabilities, while ensuring security and data privacy.
				</p>
				<Row
					className="companies-logo"
					align="middle"
					gutter={[
						50,
						50
					]}>
					{[
						'blackrock',
						'jpmorgan',
						'barclays',
						'natwest',
						'thoughtworks',
						'sapient'
					].map((company, i) => (
						<Col key={i}>
							<div className={`${company}-logo`} />
						</Col>
					))}
				</Row>
				<Row align="middle">
					<Col xs={24} sm={24} md={12}>
						<Image src="/images/quick-step.jpg" alt="quick step image" width={590} height={400} layout='responsive'/>
					</Col>
					<Col xs={24} sm={24} md={12}>
						<h2>
							<strong>Break-free to live on your terms</strong>
						</h2>
						<h3>Just 15 minutes for a personalized financial plan</h3>
						<p>
							<GetStartedButton />
						</p>
					</Col>
				</Row>
			</Content>
		</div>
	);
}
