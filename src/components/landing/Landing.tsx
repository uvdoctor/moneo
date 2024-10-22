import React, { Fragment, useContext } from 'react';
import { Row } from 'antd';
import { Parallax } from 'rc-scroll-anim';
import Content from '../Content';
import Banner from './Banner';
import Calculator from './Calculator';
import HelloFinancialIndep from './HelloFinancialIndep';
import Step from './Step';
import GettingStarted from './GettingStarted';
import CouponsBanner from './CouponsBanner';
import Security from './Security';
import GetRich from './GetRich';
import Testimonials from './Testimonials';
import FinancialIndependence from './FinancialIndependence';

require('./Landing.less');
import { AppContext } from '../AppContext';

export default function Landing() {
	const { defaultCountry }: any = useContext(AppContext);

	return (
		<Fragment>
			<Content className="with-banner">
				<Banner />
				<Parallax
					animation={[
						{
							x: 0,
							opacity: 1,
							playScale: [
								0,
								0.6
							]
						},
						{
							y: 0,
							playScale: [
								0,
								1
							]
						}
					]}
					style={{
						transform: 'translateX(-100px)',
						opacity: 0,
						position: 'relative',
						top: '0',
						bottom: '0',
						left: '0',
						right: '0',
						margin: 'auto',
						width: '100%',
						height: 'auto'
					}}>
					<HelloFinancialIndep />
					<Row
						className="steps"
						gutter={[
							{ xs: 0, sm: 0, md: 24, lg: 32 },
							{ xs: 20, sm: 20, md: 24, lg: 32 }
						]}>
						<Step
							className="step1"
							count="01"
							title="Get"
							subTitle="Real-time Analysis"
							content="Automatically track your net worth, i.e. what you own minus what you owe, across bank accounts, credit cards, deposits, NPS, loans, etc; and investment portfolio performance."
							imgSrc={defaultCountry === 'IN' ? 'images/step1-india.jpg' : 'images/step1.jpg'}
							link="#"
						/>
						<Step
							className="step2"
							count="02"
							title="Set"
							subTitle="Goals"
							content="Define your life goals to get a persoalized Financial Plan, including analysis of money and time needed to achieve Financial Independence."
							imgSrc="images/step2.jpg"
							link="#"
						/>
						<Step
							className="step3"
							count="03"
							title="Grow"
							subTitle="Wealth"
							content="Improve savings by identifying money leaks and unwanted expenses, and invest money based on your financial plan, risk appetite and ethics."
							imgSrc="images/step3.jpg"
							link="#"
						/>
						<GettingStarted />
					</Row>
				</Parallax>
			</Content>
			<CouponsBanner />
			<Calculator />
			<Testimonials />
			<Security />
			<GetRich />
			<FinancialIndependence />
		</Fragment>
	);
}
