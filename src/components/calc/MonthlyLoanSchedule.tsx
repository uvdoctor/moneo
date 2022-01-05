import { Col, Row, Table } from 'antd';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { TargetInput } from '../../api/goals';
import NumberInput from '../form/numberinput';
import Section from '../form/section';
import { getClosestTargetVal } from '../goals/cfutils';
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
	const { currency, startYear, startMonth }: any = useContext(CalcContext);
	const {
		loanRepaymentMonths,
		loanPrepayments,
		setLoanPrepayments,
		loanIntRate,
		loanIRAdjustments,
		setLoanIRAdjustments,
		iSchedule,
		pSchedule,
		eduLoanPDueSchedule,
		insSchedule,
		loanBorrowAmt
	}: any = useContext(GoalContext);
	const [ filteredInfo, setFilteredInfo ] = useState<any | null>({});
	const [ data, setData ] = useState<Array<any>>([]);
	const [ numFilterValues, setNumFilterValues ] = useState<Array<any>>([ {} ]);
	const [ yearFilterValues, setYearFilterValues ] = useState<Array<any>>([ {} ]);
	const [ hasMonthlyInsurance, setHasMonthlyInsurance ] = useState<boolean>(false);

	const isEduLoanSIPayment = (installmentNum: number) =>
		eduLoanPDueSchedule && installmentNum <= eduLoanPDueSchedule.length;

	useEffect(
		() => {
			for (let p of insSchedule) {
				if (p) {
					setHasMonthlyInsurance(true);
					return;
				}
			}
			setHasMonthlyInsurance(false);
		},
		[ insSchedule ]
	);

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
			key: 'month'
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
		let existingPrepayment: TargetInput | null | undefined = findTarget(loanPrepayments, installmentNum);
		if (existingPrepayment)
			additionalPayment || isEduLoanSIPayment(installmentNum)
				? (existingPrepayment.val = additionalPayment)
				: removeFromArray(loanPrepayments, 'num', installmentNum);
		else loanPrepayments.push(createNewTarget(installmentNum, additionalPayment));
		setLoanPrepayments([ ...loanPrepayments ]);
	};

	const changeLoanIRAdjustments = (installmentNum: number, newIR: number) => {
		let existingIRAdjustment: TargetInput | null | undefined = findTarget(loanIRAdjustments, installmentNum);
		if (existingIRAdjustment) existingIRAdjustment.val = newIR;
		else loanIRAdjustments.push(createNewTarget(installmentNum, newIR));
		loanIRAdjustments.sort((a: TargetInput, b: TargetInput) => a.num - b.num);
		setLoanIRAdjustments([ ...loanIRAdjustments ]);
	};

	const getPrincipalDue = (installmentNum: number) => {
		if (isEduLoanSIPayment(installmentNum)) return eduLoanPDueSchedule[installmentNum];
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

	const getMonthlyInsAmt = (installmentNum: number) =>
		insSchedule[installmentNum - 1] ? insSchedule[installmentNum - 1] : 0;

	useEffect(
		() => {
			let result = [];
			let numFilterValues = [];
			let year = startYear;
			let startingMonth = startMonth + loanRepaymentMonths;
			if (startingMonth > 12) {
				year++;
				startingMonth = startingMonth % 12;
			}
			let yearFilterValues = [ getFilterItem(year) ];
			for (let i = 0; i < pSchedule.length; i++) {
				numFilterValues.push(getFilterItem(i + 1));
				if (i && (i + startingMonth - 1) % 12 === 0) {
					year++;
					yearFilterValues.push(getFilterItem(year));
				}
				let totalVal = iSchedule[i] + pSchedule[i];
				if (insSchedule[i]) totalVal += insSchedule[i];
				result.push(getDataItem(i + 1, totalVal, year, startingMonth));
			}
			setYearFilterValues([ ...yearFilterValues ]);
			setNumFilterValues([ ...numFilterValues ]);
			setData([ ...result ]);
		},
		[ pSchedule, startYear, startMonth ]
	);

	//@ts-ignore
	const handleChange = (pagination: any, filters: any, sorters: any) => {
		setFilteredInfo(filters);
	};

	const getPrepayment = (installmentNum: number) => {
		let result = findTarget(loanPrepayments, installmentNum);
		return result ? result.val : isEduLoanSIPayment(installmentNum) ? iSchedule[installmentNum - 1] : 0;
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
				expandedRowRender: (record) => {
					const num = parseInt(record.num);
					const isEditable =
						editable && (hasAdjustmentsInLastInstallments() || (num > 6 && num <= iSchedule.length - 6));
					return (
						<Fragment>
							<Row align="middle">
								<Col lg={isEditable ? 12 : 24}>
									<Row>
										<Col
											xs={24}
											sm={12}
											md={12}
											lg={isEditable ? 24 : 12}
											xxl={isEditable ? 24 : 8}
										>
											<ItemDisplay
												label="Interest Paid"
												result={iSchedule[num - 1]}
												currency={currency}
												decimal={2}
											/>
										</Col>
										<Col
											xs={24}
											sm={12}
											md={12}
											lg={isEditable ? 24 : 12}
											xxl={isEditable ? 24 : 8}
										>
											<ItemDisplay
												label="Total Interest Paid"
												result={getTotalInterestPaid(record.num)}
												currency={currency}
												decimal={2}
											/>
										</Col>
										<Col
											xs={24}
											sm={12}
											md={12}
											lg={isEditable ? 24 : 12}
											xxl={isEditable ? 24 : 8}
										>
											<ItemDisplay
												label="Principal Paid"
												result={pSchedule[num - 1]}
												currency={currency}
												decimal={2}
											/>
										</Col>
										<Col
											xs={24}
											sm={12}
											md={12}
											lg={isEditable ? 24 : 12}
											xxl={isEditable ? 24 : 8}
										>
											<ItemDisplay
												label="Total Principal Paid"
												result={getTotalPrincipalPaid(num)}
												currency={currency}
												decimal={2}
											/>
										</Col>
										{hasMonthlyInsurance && getMonthlyInsAmt(num) ? (
											<Col
												xs={24}
												sm={12}
												md={12}
												lg={isEditable ? 24 : 12}
												xxl={isEditable ? 24 : 8}
											>
												<ItemDisplay
													label="Repayment Insurance"
													result={getMonthlyInsAmt(num)}
													currency={currency}
												/>
											</Col>
										) : null}
										<Col
											xs={24}
											sm={12}
											md={12}
											lg={isEditable ? 24 : 12}
											xxl={isEditable ? 24 : 8}
										>
											<ItemDisplay label="Remaining Months" result={getRemMonths(num)} />
										</Col>
										<Col
											xs={24}
											sm={12}
											md={12}
											lg={isEditable ? 24 : 12}
											xxl={isEditable ? 24 : 8}
										>
											<ItemDisplay
												label="Remaining Principal"
												result={getPrincipalDue(num)}
												currency={currency}
												decimal={2}
											/>
										</Col>
									</Row>
								</Col>
								{isEditable && (
									<Col className="configurations" lg={12}>
										<Section title="Adjust Loan Schedule">
											<Row gutter={[ 0, 10 ]}>
												<Col span={24}>
													<NumberInput
														pre="Payment"
														value={getPrepayment(num)}
														changeHandler={(val: number) => changeLoanPrepayments(num, val)}
														max={Math.floor(getPrincipalDue(num - 1))}
														currency={currency}
														noRangeFactor
													/>
												</Col>
												<Col span={24}>
													{record.num !== '1' ? (
														<NumberInput
															pre="Rate"
															value={getClosestTargetVal(
																loanIRAdjustments,
																parseInt(record.num),
																loanIntRate
															)}
															changeHandler={(val: number) =>
																changeLoanIRAdjustments(num, val)}
															min={
																getClosestTargetVal(
																	loanIRAdjustments,
																	num - 1,
																	loanIntRate
																) -
																	3 <
																0 ? (
																	0
																) : (
																	getClosestTargetVal(
																		loanIRAdjustments,
																		num - 1,
																		loanIntRate
																	) - 3
																)
															}
															max={
																getClosestTargetVal(
																	loanIRAdjustments,
																	num - 1,
																	loanIntRate
																) + 3
															}
															step={0.01}
															unit="%"
														/>
													) : null}
												</Col>
											</Row>
										</Section>
									</Col>
								)}
							</Row>
						</Fragment>
					);
				}
			}}
		/>
	);
}
