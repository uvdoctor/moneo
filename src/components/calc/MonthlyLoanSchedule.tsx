import { Col, Row, Table } from 'antd';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { TargetInput } from '../../api/goals';
import NumberInput from '../form/numberinput';
import Section from '../form/section';
import { GoalContext } from '../goals/GoalContext';
import { createNewTarget } from '../goals/goalutils';
import { getMonthName, removeFromArray, toCurrency } from '../utils';
import { CalcContext } from './CalcContext';
import { findTarget } from './finance';
import ItemDisplay from './ItemDisplay';
interface MonthlyLoanScheduleProps {
	editable?: boolean;
}

export default function MonthlyLoanSchedule({ editable }: MonthlyLoanScheduleProps) {
	const { currency, startMonth }: any = useContext(CalcContext);
	const {
		loanRepaymentSY,
		loanPrepayments,
		setLoanPrepayments,
		loanIntRate,
		loanIRAdjustments,
		setLoanIRAdjustments,
		iSchedule,
		pSchedule,
		loanBorrowAmt
	}: any = useContext(GoalContext);
	const [ filteredInfo, setFilteredInfo ] = useState<any | null>({});
	const [ data, setData ] = useState<Array<any>>([]);
	const [ numFilterValues, setNumFilterValues ] = useState<Array<any>>([ {} ]);
	const [ yearFilterValues, setYearFilterValues ] = useState<Array<any>>([ {} ]);

	const columns = [
		{
			title: 'Num',
			dataIndex: 'num',
			key: 'num',
			filteredValue: filteredInfo.num || null,
			filters: numFilterValues,
			onFilter: (value: Array<any>, record: any) => record.num.includes(value)
		},
		{
			title: 'Year',
			dataIndex: 'year',
			key: 'year',
			filteredValue: filteredInfo.year || null,
			filters: yearFilterValues,
			onFilter: (value: Array<any>, record: any) => record.year.includes(value)
		},
		{
			title: 'Month',
			dataIndex: 'month',
			key: 'month',
		},
		{
			title: 'Payment',
			dataIndex: 'mp',
			key: 'mp'
		}
	];

	const getDataItem = (index: number, payment: number, year: number, startingMonth: number) => {
		let monthIndex = index + startingMonth - 1;
		let monthNum = monthIndex % 12 === 0 ? 12 : monthIndex % 12;
		return {
			key: '' + index,
			num: '' + index,
			year: '' + year,
			month: getMonthName(monthNum, true),
			mp: toCurrency(payment, currency, true)
		};
	};

	const getFilterItem = (val: number) => {
		return {
			text: '' + val,
			value: '' + val
		};
	};

	const changeLoanPrepayments = (installmentNum: number, additionalPayment: number) => {
		let principalDue = getPrincipalDue(installmentNum);
		if (additionalPayment > principalDue) additionalPayment = principalDue;
		let existingPrepayment: TargetInput | null | undefined = findTarget(loanPrepayments, installmentNum);
		if (existingPrepayment)
			additionalPayment
				? (existingPrepayment.val = additionalPayment)
				: removeFromArray(loanPrepayments, 'num', installmentNum);
		else loanPrepayments.push(createNewTarget(installmentNum, additionalPayment));
		setLoanPrepayments([ ...loanPrepayments ]);
	};

	const changeLoanIRAdjustments = (installmentNum: number, newIR: number) => {
		let existingIRAdjustment: TargetInput | null | undefined = findTarget(loanIRAdjustments, installmentNum);
		if (existingIRAdjustment) existingIRAdjustment.val = newIR;
		else loanIRAdjustments.push(createNewTarget(installmentNum, newIR));
		setLoanIRAdjustments([ ...loanIRAdjustments ]);
	};

	const getPrincipalDue = (installmentNum: number) => {
		let principal = loanBorrowAmt;
		for (let i = 0; i < installmentNum; i++) principal -= pSchedule[i];
		return principal;
	};

	const getTotalInterestPaid = (installmentNum: number) => {
		let totalInt = 0;
		for (let i = 0; i < installmentNum; i++) totalInt += iSchedule[i];
		return totalInt;
	};

	const getTotalPrincipalPaid = (installmentNum: number) => {
		let totalPrincipalPaid = 0;
		for (let i = 0; i < installmentNum; i++) totalPrincipalPaid += pSchedule[i];
		return totalPrincipalPaid;
	};

	const getRemMonths = (installmentNum: number) => iSchedule.length - installmentNum;

	useEffect(
		() => {
			let result = [];
			let numFilterValues = [];
			let year = loanRepaymentSY;
			let yearFilterValues = [ getFilterItem(year) ];
			for (let i = 0; i < pSchedule.length; i++) {
				numFilterValues.push(getFilterItem(i + 1));
				if (i && i % 12 === 0) {
					year++;
					yearFilterValues.push(getFilterItem(year));
				}
				result.push(getDataItem(i + 1, iSchedule[i] + pSchedule[i], year, startMonth));
			}
			setYearFilterValues([ ...yearFilterValues ]);
			setNumFilterValues([ ...numFilterValues ]);
			setData([ ...result ]);
		},
		[ pSchedule ]
	);

	//@ts-ignore
	const handleChange = (pagination: any, filters: any, sorters: any) => {
		setFilteredInfo(filters);
	};

	const getPrepayment = (installmentNum: number) => {
		let result = findTarget(loanPrepayments, installmentNum);
		return result ? result.val : 0;
	};

	const getIRAdjustment = (installmentNum: number) => {
		let result = findTarget(loanIRAdjustments, installmentNum);
		return result ? result.val : loanIntRate;
	};

	const hasAdjustmentsInLastInstallments = () => {
		if ((!loanPrepayments || !loanPrepayments.length) && (!loanIRAdjustments || !loanIRAdjustments.length))
			return false;
		let numToCompare = iSchedule.length - 6;
		if (loanPrepayments.length > 1) loanPrepayments.sort((a: any, b: any) => b.value - a.value);
		if (loanPrepayments[0] && loanPrepayments[0].num >= numToCompare) return true;
		if (loanIRAdjustments.length > 1) loanIRAdjustments.sort((a: any, b: any) => b.value - a.value);
		if (loanIRAdjustments[0] && loanIRAdjustments[0].num >= numToCompare) return true;
		return false;
	};

	return (
		<Table
			className="loan-schedule-table"
			dataSource={data}
			//@ts-ignore
			columns={columns}
			onChange={handleChange}
			size="small"
			bordered
			expandable={{
				expandedRowRender: (record) => (
					<Fragment>
						<Row align="middle">
							<Col lg={12}>
								<Row>
									<Col xs={24} sm={12} md={12} lg={24}>
										<ItemDisplay
											label="Interest Paid"
											result={iSchedule[parseInt(record.num) - 1]}
											currency={currency}
											decimal={2}
										/>
									</Col>
									<Col xs={24} sm={12} md={12} lg={24}>
										<ItemDisplay
											label="Total Interest Paid"
											result={getTotalInterestPaid(record.num)}
											currency={currency}
											decimal={2}
										/>
									</Col>
									<Col xs={24} sm={12} md={12} lg={24}>
										<ItemDisplay
											label="Principal Paid"
											result={pSchedule[parseInt(record.num) - 1]}
											currency={currency}
											decimal={2}
										/>
									</Col>
									<Col xs={24} sm={12} md={12} lg={24}>
										<ItemDisplay
											label="Total Principal Paid"
											result={getTotalPrincipalPaid(parseInt(record.num))}
											currency={currency}
											decimal={2}
										/>
									</Col>
									<Col xs={24} sm={12} md={12} lg={24}>
										<ItemDisplay
											label="Remaining Months"
											result={getRemMonths(parseInt(record.num))}
										/>
									</Col>
									<Col xs={24} sm={12} md={12} lg={24}>
										<ItemDisplay
											label="Remaining Principal"
											result={getPrincipalDue(parseInt(record.num))}
											currency={currency}
											decimal={2}
										/>
									</Col>
								</Row>
							</Col>
							{editable &&
							(hasAdjustmentsInLastInstallments() || parseInt(record.num) <= iSchedule.length - 6) && (
								<Col className="configurations" lg={12}>
									<Section title="Adjust Loan Details">
										<NumberInput
											pre="Additional Principal Payment"
											value={getPrepayment(parseInt(record.num))}
											changeHandler={(val: number) =>
												changeLoanPrepayments(parseInt(record.num), val)}
											min={0}
											max={
												getPrepayment(parseInt(record.num)) +
												getPrincipalDue(parseInt(record.num))
											}
											step={100}
											currency={currency}
										/>
										<NumberInput
											pre="Adjust Interest Rate"
											value={getIRAdjustment(parseInt(record.num))}
											changeHandler={(val: number) =>
												changeLoanIRAdjustments(parseInt(record.num), val)}
											min={loanIntRate - 3 < 0 ? 0 : loanIntRate - 3}
											max={loanIntRate + 3}
											step={0.1}
											unit="%"
											additionalMarks={[ loanIntRate ]}
										/>
									</Section>
								</Col>
							)}
						</Row>
					</Fragment>
				)
			}}
		/>
	);
}
