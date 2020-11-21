import { Col, Row, Table } from 'antd';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { TargetInput } from '../../api/goals';
import NumberInput from '../form/numberinput';
import { GoalContext } from '../goals/GoalContext';
import { createNewTarget } from '../goals/goalutils';
import { removeFromArray, toCurrency } from '../utils';
import { CalcContext } from './CalcContext';
import { findAdditionalPrincipalPayment } from './finance';
import ItemDisplay from './ItemDisplay';
interface MonthlyLoanScheduleProps {
	editable?: boolean;
}

export default function MonthlyLoanSchedule({ editable }: MonthlyLoanScheduleProps) {
	const { currency }: any = useContext(CalcContext);
	const {
		loanRepaymentSY,
		loanPrepayments,
		setLoanPrepayments,
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
			title: 'Installment #',
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
			title: 'Payment',
			dataIndex: 'mp',
			key: 'mp'
		},
		{
			title: 'Interest Paid',
			dataIndex: 'ip',
			key: 'ip'
		},
		{
			title: 'Principal Paid',
			dataIndex: 'pp',
			key: 'pp'
		}
	];

	const getDataItem = (index: number, payment: number, year: number, intAmt: number, pAmt: number) => {
		return {
			key: '' + index,
			num: '' + index,
			year: '' + year,
			mp: toCurrency(payment, currency, true),
			ip: toCurrency(intAmt, currency, true),
			pp: toCurrency(pAmt, currency, true)
		};
	};

	const getFilterItem = (val: number) => {
		return {
			text: '' + val,
			value: '' + val
		};
	};

	const changeLoanPrepayments = (index: number, additionalPayment: number) => {
		if (!additionalPayment) return;
		let existingPrepayment: TargetInput | null | undefined = findAdditionalPrincipalPayment(loanPrepayments, index);
		if (existingPrepayment)
			additionalPayment
				? (existingPrepayment.val = additionalPayment)
				: removeFromArray(loanPrepayments, 'num', index);
		else loanPrepayments.push(createNewTarget(index, additionalPayment));
		setLoanPrepayments([ ...loanPrepayments ]);
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

	const getMonthlyPayment = (installmentNum: number) =>
		iSchedule[installmentNum - 1] + pSchedule[installmentNum - 1];

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
				let monthlyInt = iSchedule[i];
				let monthlyPrincipal = pSchedule[i];
				let monthlyPayment = monthlyInt + monthlyPrincipal;
				result.push(getDataItem(i + 1, monthlyPayment, year, monthlyInt, monthlyPrincipal));
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

	return (
		<Table
			dataSource={data}
			//@ts-ignore
			columns={columns}
			onChange={handleChange}
			bordered
			expandable={{
				expandedRowRender: (record) => (
					<Fragment>
						<Row justify="space-around">
							<Col>
								<ItemDisplay
									label="Total Interest Paid"
									result={getTotalInterestPaid(record.num)}
									currency={currency}
									decimal={2}
								/>
							</Col>
							<Col>
								<ItemDisplay
									label="Total Principal Paid"
									result={getTotalPrincipalPaid(record.num)}
									currency={currency}
									decimal={2}
								/>
							</Col>
							<Col>
								<ItemDisplay
									label="Principal Due"
									result={getPrincipalDue(record.num)}
									currency={currency}
									decimal={2}
								/>
							</Col>
						</Row>
						{editable &&
						record.num !== '' + iSchedule.length && (
							<div style={{ marginTop: '1rem' }}>
								<NumberInput
									pre="Make Additional Payment"
									value={getMonthlyPayment(record.num)}
									changeHandler={(val: number) => changeLoanPrepayments(parseInt(record.num), val)}
									min={0}
									max={getMonthlyPayment(record.num) + getPrincipalDue(record.num)}
									step={10}
									currency={currency}
								/>
							</div>
						)}
					</Fragment>
				)
			}}
		/>
	);
}
