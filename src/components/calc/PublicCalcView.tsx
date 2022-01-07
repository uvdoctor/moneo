import { Button, Col, PageHeader, Row, Tabs } from 'antd';
import React, { useContext, Fragment } from 'react';
import { isMobileDevice } from '../utils';
import { RocketOutlined } from '@ant-design/icons';
import { useFullScreenBrowser } from 'react-browser-hooks';
import { AppContext } from '../AppContext';
import { createNewGoalInput, isLoanEligible } from '../goals/goalutils';
import * as gtag from '../../lib/gtag';
import { GoalType } from '../../api/goals';
import MajorAssumptions from './blog/MajorAssumptions';
import ExpectedResults from './blog/ExpectedResults';
import KeyFeatures from './blog/KeyFeatures';
import { useRouter } from 'next/router';
import { ROUTES } from '../../CONSTANTS';

interface PublicCalcViewProps {
	type?: GoalType | undefined;
	title: string;
	features: Array<any>;
	assumptions: Array<any>;
	results: Array<any>;
	terms: Array<any>;
	demoUrl: string;
	setWIP: Function;
}

export default function PublicCalcView(props: PublicCalcViewProps) {
	const { defaultCurrency }: any = useContext(AppContext);
	const fsb = useFullScreenBrowser();
	const router = useRouter();
	const { TabPane } = Tabs;

	const endingAssumptions = [
		router.pathname !== ROUTES.TRUE_COST && props.type !== GoalType.FF && isLoanEligible(props.type as GoalType) && {
			title: 'No loan prepayment penalty.',
			content: 'When a loan is prepaid, calculation assumes that there is no prepayment penalty.'
		},
		router.pathname !== ROUTES.TRUE_COST && props.type !== GoalType.FF && isLoanEligible(props.type as GoalType) && {
			title: 'Penalty not considered in case loan repayment starts late.',
			content:
				'When a loan repayment starts later than scheduled, calculation adds due interest to the borrowed amount. However, there may be additional cost due to penalties and credit score impact.'
		},
		router.pathname !== ROUTES.TRUE_COST && props.type !== GoalType.FF &&  {
			title: 'Yearly tax benefit considered as positive cash flow for next year.',
			content: `As you pay lesser tax next year due to eligible tax benefit, cash flow analysis considers tax benefit as positive cash flow in next year.`
		},
		router.pathname !== ROUTES.TRUE_COST && props.type !== GoalType.FF && {
			title: 'Cash Flows happen on the 1st day of the specified year or month.',
			content: `This is to simplify certain calculations. Actual timelines may vary, but it won't have any significant impact on what-if analysis estimates as time difference between cash flows remains similar.`
		},
		{
			title: 'Non-financial aspects are out of scope.',
			content: `Please consider other factors such as emotions, convenience, etc so that it is the right decision for You.`
		},
		{
			title: 'Estimates Only. No Advice.',
			content: `Financial estimates are useful for what-if analysis. Please consult a registered financial / tax advisor for specific advice.`
		}
	];

	/*const genericTerms = [
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
	];*/

	const endingResults = [
		router.pathname !== ROUTES.TRUE_COST && isLoanEligible(props.type as GoalType) ? 'Total loan interest to be paid.' : '',
		router.pathname !== ROUTES.TRUE_COST && isLoanEligible(props.type as GoalType) ? 'Principal & Interest schedule for a loan.' : '',
		router.pathname !== ROUTES.TRUE_COST && props.type !== GoalType.FF ? 'Total tax benefit that can be availed.' : '',
		props.type !== GoalType.FF ? 'Impact of spending money rather than investing.' : '',
		router.pathname !== ROUTES.TRUE_COST && props.type !== GoalType.FF ? 'Yearly cash flows.' : ''
	];

	const startingFeatures = [
		{
			title: 'Financial analysis made simpler',
			content:
				'Implements time-tested principles and best practices for money management with extensive configuration.'
		},
		{
			title: 'Ease of use',
			content: 'Avoids jargons and complex charts so that it is as easy to understand and use as possible.'
		}
	];

	const endingFeatures = [
		isLoanEligible(props.type as GoalType) &&
		{
			title: 'Analyzes tax benefit due to claiming deduction / credit',
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
			title: 'Works anywhere',
			content: 'Calculation works seamlessly for different currencies.'
		},
		{
			title: 'Keeps working offline',
			content: 'Calculator keeps working even when connection is not available.'
		}
	];

	const sections: any = {
		//Demo: <VideoPlayer url={props.demoUrl} />,
		'Expected Results': <ExpectedResults elements={[ ...props.results, ...endingResults ]} />,
		'Key Features': <KeyFeatures elements={[ ...startingFeatures, ...props.features, ...endingFeatures ]} />,
		'Major Assumptions': 
			<MajorAssumptions elements={[ ...props.assumptions, ...endingAssumptions ]} />
		
		//Definitions: <CommonTerms elements={[ ...props.terms, ...genericTerms ]} />
	};

	const createGoal = () => {
		let g: any = null;
		if (props.type) g = createNewGoalInput(props.type, defaultCurrency, props.title.endsWith('Loan'));
		else g = { ccy: defaultCurrency };
		g.name = props.title;
		gtag.event({
			category: 'Calculator',
			action: 'Start',
			label: 'type',
			value: props.type ? props.type : props.title
		});
		props.setWIP(g);
	};

	return (
		<Fragment>
			<Row className="primary-header">
				<Col>
					<PageHeader title={props.title} />
				</Col>
			</Row>
			<Row justify="center" style={{ marginTop: '10px', marginBottom: '10px' }}>
				<Col>
					<Button size="large" key="startbtn" className="steps-start-btn" onClick={() => createGoal()}>
						<RocketOutlined /> Start Analysis
					</Button>
				</Col>
			</Row>
			<Row className="steps-content">
				<Col span={24}>
				<Tabs
					tabPosition={isMobileDevice(fsb) ? 'top' : 'left'}
					type={isMobileDevice(fsb) ? 'card' : 'line'}
					animated
				>
					{Object.keys(sections).map((key, i) => (
						<TabPane key={`${i + 1}`} tab={key}>
							{sections[key]}
						</TabPane>
					))}
					</Tabs>
				</Col>
			</Row>
		</Fragment>
	);
}
