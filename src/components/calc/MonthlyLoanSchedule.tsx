import { Table } from 'antd';
import React, { useContext, useState } from 'react';
import { GoalContext } from '../goals/GoalContext';
import { toCurrency } from '../utils';
import { CalcContext } from './CalcContext';

export default function MonthlyLoanSchedule() {
	const { currency }: any = useContext(CalcContext);
	const { loanBorrowAmount, emi, loanRepaymentSY }: any = useContext(GoalContext);
  const [filteredInfo, setFilteredInfo] = useState<any | null>({});
  
  const columns = [
		{
			title: 'Number',
			dataIndex: 'num',
      key: 'num',
      filteredValue: filteredInfo.num || null,
      filters: [{ text: '0', value: '0' }, { text: '1', value: '1' }],
			onFilter: (value: Array<any>, record: any) => record.num.includes(value)
		},
		{
			title: 'Year',
			dataIndex: 'year',
      key: 'year',
      filteredValue: filteredInfo.year || null,
			filters: [
				{ text: '' + loanRepaymentSY, value: '' + loanRepaymentSY },
				{ text: '' + (loanRepaymentSY + 1), value: '' + (loanRepaymentSY + 1) }
			],
      onFilter: (value: Array<any>, record: any) => record.year.includes(value)
		},
		{
			title: 'Monthly Payment',
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
		},
		{
			title: 'Principal Due',
			dataIndex: 'pd',
			key: 'pd'
		}
	];

	const dataSource = [
		{
			key: '0',
			num: '0',
			year: '' + loanRepaymentSY,
			mp: toCurrency(0, currency),
			ip: toCurrency(0, currency),
			pp: toCurrency(0, currency),
			pd: toCurrency(loanBorrowAmount, currency)
		},
		{
			key: '1',
			num: '1',
			year: '' + loanRepaymentSY,
			mp: toCurrency(emi, currency),
			ip: toCurrency(0, currency),
			pp: toCurrency(0, currency),
			pd: toCurrency(loanBorrowAmount - emi, currency)
		}
	];

  //@ts-ignore
  const handleChange = (pagination: any, filters: any, sorters: any) => {
		setFilteredInfo(filters);
	};

  return (
    //@ts-ignore
		<Table dataSource={dataSource} columns={columns} onChange={handleChange} />
	);
}
