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
			title: 'Number',
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
	];

	const getDataItem = (index: number, payment: number, year: number) => {
		return {
			key: '' + index,
			num: '' + index,
			year: '' + year,
			mp: toCurrency(payment, currency, true),
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
		let existingPrepayment: TargetInput | null | undefined = findAdditionalPrincipalPayment(loanPrepayments, installmentNum);
		if (existingPrepayment)
			additionalPayment
				? (existingPrepayment.val = additionalPayment)
				: removeFromArray(loanPrepayments, 'num', installmentNum);
		else loanPrepayments.push(createNewTarget(installmentNum, additionalPayment));
		setLoanPrepayments([...loanPrepayments]);
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
				result.push(getDataItem(i + 1, iSchedule[i] + pSchedule[i], year));
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
		let result = findAdditionalPrincipalPayment(loanPrepayments, installmentNum);
		return result ? result.val : 0;
	};

	return (
		<Table
			dataSource={data}
			//@ts-ignore
			columns={columns}
			onChange={handleChange}
			size="small"
			bordered
			expandable={{
				expandedRowRender: (record) => (
					<Fragment>
						<Row justify="space-around">
							<Col>
								<ItemDisplay
									label="Interest Paid"
									result={iSchedule[parseInt(record.num) - 1]}
									currency={currency}
									decimal={2}
								/>
							</Col>
							<Col>
								<ItemDisplay
									label="Total Interest Paid"
									result={getTotalInterestPaid(record.num)}
									currency={currency}
									decimal={2}
								/>
							</Col>
						</Row>
						<Row justify="space-around" style={{marginTop: '1rem'}}>
							<Col>
								<ItemDisplay
									label="Principal Paid"
									result={pSchedule[parseInt(record.num) - 1]}
									currency={currency}
									decimal={2}
								/>
							</Col>
							<Col>
								<ItemDisplay
									label="Total Principal Paid"
									result={getTotalPrincipalPaid(parseInt(record.num))}
									currency={currency}
									decimal={2}
								/>
							</Col>
						</Row>
						<Row justify="center">
							<Col>
								<ItemDisplay
									label="Principal Due"
									result={getPrincipalDue(parseInt(record.num))}
									currency={currency}
									decimal={2}
								/>
							</Col>
						</Row>
						{editable &&
						record.num !== '' + iSchedule.length && (
							<div style={{ marginTop: '1rem' }}>
								<NumberInput
									pre="Additional Principal Payment"
									value={getPrepayment(parseInt(record.num))}
									changeHandler={(val: number) => changeLoanPrepayments(parseInt(record.num), val)}
									min={0}
									max={getPrepayment(parseInt(record.num)) + getPrincipalDue(parseInt(record.num))}
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
