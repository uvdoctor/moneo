import React, { useEffect, useState, useContext } from 'react';
import { GoalType } from '../../api/goals';
import BasicPage from '../BasicPage';
import { createNewGoalInput, isLoanEligible } from '../goals/goalutils';
import * as gtag from '../../lib/gtag';
import { Button, Row, Col, PageHeader, Tabs } from 'antd';
import { useFullScreenBrowser } from 'react-browser-hooks';
import { RocketOutlined } from '@ant-design/icons';
import { CalcContextProvider } from './CalcContext';
import { GoalContextProvider } from '../goals/GoalContext';
import { FIGoalContextProvider } from '../goals/FIGoalContext';
import { isMobileDevice } from '../utils';
import VideoPlayer from '../VideoPlayer';
import ExpectedResults from './blog/ExpectedResults';

import './Layout.less';
import KeyFeatures from './blog/KeyFeatures';
import MajorAssumptions from './blog/MajorAssumptions';
import CommonTerms from './blog/CommonTerms';
import { AppContext } from '../AppContext';

export interface BlogInputProps {
	elements: Array<any>;
}
interface LayoutProps {
	tabOptions?: Array<any>;
	resultTabOptions?: Array<any>;
	calc?: any;
	type?: GoalType;
	title: string;
	features: Array<any>;
	assumptions: Array<any>;
	results: Array<any>;
	terms: Array<any>;
	demoUrl: string;
}

export default function Layout(props: LayoutProps) {
	const { defaultCurrency }: any = useContext(AppContext);
	const fsb = useFullScreenBrowser();
	const { TabPane } = Tabs;
	const [ wip, setWIP ] = useState<any | null>(null);
	const [ demoVideoPlay, setDemoVideoPlay ] = useState<boolean>(true);
	const nowYear = new Date().getFullYear();
	const startingAssumptions = [
		{
			title: 'Estimates Only. No Advice.',
			content: `Financial estimates are useful for what-if analysis. Please consult a registered financial / tax advisor for specific advice.`
		}
	];
	const endingAssumptions = [
		isLoanEligible(props.type as GoalType) && {
			title: 'Loan has fixed interest rate.',
			content:
				"For the purpose of estimates, it is assumed that interest rate remains fixed throughout the loan duration. In reality, loan interest rate may adjust based on market rate. However, this shouldn't make a significant impact to Your decision."
		},
		isLoanEligible(props.type as GoalType) && {
			title: 'No loan prepayment penalty.',
			content: 'When a loan is prepaid, calculation assumes that there is no prepayment penalty.'
		},
		isLoanEligible(props.type as GoalType) && {
			title: 'Additional cost not considered in case loan repayment starts late.',
			content:
				'When a loan repayment starts later than scheduled, calculation adds due interest to the borrowed amount. However, there may be additional cost due to penalties and credit score impact.'
		},
		{
			title: 'Yearly tax benefit considered as positive cash flow for next year.',
			content: `As you pay lesser tax next year due to eligible tax benefit, cash flow analysis considers tax benefit as positive cash flow in next year.`
		},
		{
			title: 'Cash Flows happen on the 1st day of the specified year or month.',
			content: `This is to simplify certain calculations. Actual timelines may vary, but it won't have any significant impact on what-if analysis estimates as time difference between cash flows remains similar.`
		},
		{
			title: 'Non-financial aspects are out of scope.',
			content: `Please consider other factors such as emotions, convenience, etc so that it is the right decision for You.`
		}
	];

	const genericTerms = [
		{
			title: 'Cash Flow',
			content:
				'Cash flow indicates flow of money. Positive cash flow indicates You Receive money, while Negative cash flow indicates You Pay money.'
		},
		{
			title: 'Tax Rate',
			content:
				'Your Income Tax Percentage. You can input Tax Rate for a year based on Income Tax Percentage You expect to pay in that year.'
		},
		{
			title: 'Tax Deduction',
			content:
				'This is an expense that You can subtract from Your Gross Income to arrive at the Taxable Income. For instance, if You make $5,000 interest payment for a mortgage loan in a year, You may be eligible to deduct this expense from Your Gross Income thereby lowering Your Taxable Income by $5,000. Typically, there is an upper limit up to which deduction is allowed as per the tax law. Calculator refers to this limit as Maximum Allowable Tax Deduction.'
		},
		{
			title: 'Tax Credit',
			content:
				'This is an expense that You can directly subtract from Your tax bill. Hence, Tax Credit is more beneficial than Tax Deduction as Tax Deduction only reduces Taxable Income, while Tax Credit directly reduces the Tax Owed. For instance, consider a $1,000 expense and Tax Rate of 10%. If the expense is eligible for Tax Deduction, then Your tax bill will reduce by $1,000 * 10% = $100. On the other hand, if the expense is eligible for Tax Credit, then Your tax bill will reduce by $1,000. Hence, higher the Income Tax You pay, higher is the benefit from Tax Credit compared to Tax Deduction.'
		},
		{
			title: 'Tax Benefit',
			content:
				'This is actual reduction in tax bill due to an eligible expense. In case of Tax Credit, this equals Tax Benefit. In case of Tax Deduction, as explained above, actual tax benefit depends on the Income Tax Rate.'
		},
		isLoanEligible(props.type as GoalType) && {
			title: 'Loan Principal',
			content:
				'Outstanding Loan Amount. For instance, if You borrow $10,000, then $10,000 is the Loan Principal on which interest is calculated. If you then make $1,000 payment towards the Principal, then updated Loan Principal balance will be $9,000.'
		},
		isLoanEligible(props.type as GoalType) && {
			title: 'Amortized Loan',
			content:
				'Borrower makes scheduled (eg: monthly) payments, consisting of both Interest & Principal. Interest component is paid first, and remaining payment is then applied to reduce the Principal amount.'
		}
	];

	const endingResults = [
		isLoanEligible(props.type as GoalType) && 'Total Interest to be paid for a Loan.',
		isLoanEligible(props.type as GoalType) && 'Principal & Interest Schedule for a Loan.',
		'Total Tax Benefit that can be availed.',
		'Impact of Spending Money rather than Investing.',
		'Yearly Cash Flows.'
	];

	const startingFeatures = [
		{
			title: 'Financial Analysis Made Simpler',
			content:
				'Implements time-tested principles and best practices for money management with extensive configuration.'
		},
		{
			title: 'Ease of use',
			content: 'Avoids jargons and complex charts so that it is as easy to understand and use as possible.'
		}
	];

	const endingFeatures = [
		isLoanEligible(props.type as GoalType) && props.type !== GoalType.E && {
			title: 'Supports Amortizing and Balloon Loans',
			content:
				'Calculation will automatically calculate monthly installment, payment schedule and total interest for both these loan types.'
		},
		{
			title: 'Tax benefit adjustment',
			content:
				'Easily configure tax information to analyze potential tax benefit. Tax benefit can be computed for both Principal and Interest in case of a loan.'
		},
		{
			title: 'Understand impact of every input factor',
			content:
				'Results change dynamically with every input change so that impact can be understood for what-if analysis.'
		},
		{
			title: 'Highly configurable',
			content:
				'Allows custom configuration of payment schedule, loan details, tax benefit, etc so that estimates are as accurate and personalized as possible.'
		},
		{
			title: 'Works Anywhere',
			content: 'Calculation works seamlessly for different currencies.'
		},
		{
			title: 'Keeps working offline',
			content: 'Calculator keeps working even when connection is not available.'
		}
	];

	const sections: any = {
		Demo: <VideoPlayer url={props.demoUrl} play={demoVideoPlay} />,
		'Expected Results': <ExpectedResults elements={[ ...props.results, ...endingResults ]} />,
		'Key Features': <KeyFeatures elements={[ ...startingFeatures, ...props.features, ...endingFeatures ]} />,
		'Major Assumptions': (
			<MajorAssumptions elements={[ ...startingAssumptions, ...props.assumptions, ...endingAssumptions ]} />
		),
		Definitions: <CommonTerms elements={[ ...props.terms, ...genericTerms ]} />
	};
	const [activeTab, setActiveTab] = useState<string>('1');

	const buildEmptyMergedCFs = () => {
		let mCFs: any = {};
		for (let year = nowYear + 1; year <= nowYear + 80; year++) mCFs[year] = 0;
		return mCFs;
	};

	const createGoal = () => {
		let g: any = null;
		if (props.type) g = createNewGoalInput(props.type, defaultCurrency, props.title.endsWith("Loan"));
		else g = { ccy: defaultCurrency };
		g.name = props.title;
		gtag.event({
			category: 'Calculator',
			action: 'Start',
			label: 'type',
			value: props.type ? props.type : props.title
		});
		setWIP(g);
	};

	useEffect(() => {
		setDemoVideoPlay(activeTab === '1');
	}, [activeTab]);

	return (
		<BasicPage
			className="calculator-container steps-landing"
			title={props.title}
			onBack={wip ? () => setWIP(null) : null}
			navScrollable
			fixedNav
		>
			{!wip ? (
				<Row>
					<Col span={24} className="primary-header">
						<PageHeader
							title={props.title}
							extra={[
								<Button key="startbtn" className="steps-start-btn" onClick={() => createGoal()}>
									<RocketOutlined /> Calculate
								</Button>
							]}
						/>
						<Col span={24} className="secondary-header">
							<Row justify="center">Hit Calculate for Action. Details below for Geeks.</Row>
						</Col>
					</Col>
					<Col className="steps-content" span={24}>
						<Tabs
							tabPosition={isMobileDevice(fsb) ? 'top' : 'left'}
							type={isMobileDevice(fsb) ? 'card' : 'line'}
							animated
							onChange={(key: string) => {
								setActiveTab(key);
							}}
						>
							{Object.keys(sections).map((key, i) => (
								<TabPane key={`${i + 1}`} tab={key}>
									{sections[key]}
								</TabPane>
							))}
						</Tabs>
					</Col>
				</Row>
			) : (
				<CalcContextProvider goal={wip} tabOptions={props.tabOptions} resultTabOptions={props.resultTabOptions}>
					{props.type ? props.type === GoalType.FF ? (
						<FIGoalContextProvider mustCFs={[]} tryCFs={[]} mergedCFs={buildEmptyMergedCFs()} />
					) : (
						<GoalContextProvider ffGoalEndYear={nowYear + 50} />
					) : (
						<props.calc />
					)}
				</CalcContextProvider>
			)}
		</BasicPage>
	);
}
