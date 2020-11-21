import { Table } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { GoalContext } from '../goals/GoalContext';
import { toCurrency } from '../utils';
import { CalcContext } from './CalcContext';

interface MonthlyLoanScheduleProps {
  editable?: boolean;
}

export default function MonthlyLoanSchedule({editable}: MonthlyLoanScheduleProps) {
	const { currency }: any = useContext(CalcContext);
	const { loanBorrowAmt, emi, loanIntRate, loanRepaymentSY, duration }: any = useContext(GoalContext);
  const [filteredInfo, setFilteredInfo] = useState<any | null>({});
  const [data, setData] = useState<Array<any>>([]);
  const [numFilterValues, setNumFilterValues] = useState<Array<any>>([{}]);
  const [yearFilterValues, setYearFilterValues] = useState<Array<any>>([{}]);
  
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
			title: 'Total Interest Paid',
			dataIndex: 'tip',
			key: 'tip'
		},
		{
			title: 'Total Principal Paid',
			dataIndex: 'tpp',
			key: 'tpp'
		},
		{
			title: 'Principal Due',
			dataIndex: 'pd',
			key: 'pd'
		}
	];

  const getDataItem = (index: number, payment: number, year: number,
    intAmt: number, pAmt: number, tiAmt: number, tpAmt: number, pDue: number) => {
    return {
			key: '' + index,
			num: '' + index,
			year: '' + year,
			mp: toCurrency(payment, currency),
			ip: toCurrency(intAmt, currency),
      pp: toCurrency(pAmt, currency),
      tip: toCurrency(tiAmt, currency),
      tpp: toCurrency(tpAmt, currency),
			pd: toCurrency(pDue, currency)
    }
  };

  const getFilterItem = (val: number) => {
    return {
      text: "" + val,
      value: "" + val
    }
  };

  useEffect(() => {
    let principal = loanBorrowAmt;
    let monthlyRate = loanIntRate / 1200;
    let result = [getDataItem(0, 0, loanRepaymentSY, 0, 0, 0, 0, principal)];
    let yearFilterValues = [getFilterItem(loanRepaymentSY)];
    let numFilterValues = [getFilterItem(0)];
    let monthsPaid = duration * 12;
    let year = loanRepaymentSY;
    let totalInterestPaid = 0;
    let totalPrincipalPaid = 0;
    let yearToBeIncremented = false;
    for (let i = 1; i <= monthsPaid && principal > 0; i++) {
      if (yearToBeIncremented) {
        year++;
        yearFilterValues.push(getFilterItem(year));
        yearToBeIncremented = false;
      }
      numFilterValues.push(getFilterItem(i));
      let monthlyInt = principal * monthlyRate;
      totalInterestPaid += monthlyInt;
      if (i % 12 === 0) yearToBeIncremented = true;
      let principalPaid = emi - monthlyInt;
      totalPrincipalPaid += principalPaid;
      principal -= principalPaid;
      result.push(getDataItem(i, emi, year, monthlyInt, principalPaid, totalInterestPaid, totalPrincipalPaid, principal));
    }
    setYearFilterValues([...yearFilterValues]);
    setNumFilterValues([...numFilterValues]);
    setData([...result]);
  }, [loanRepaymentSY, emi, duration]);

  //@ts-ignore
  const handleChange = (pagination: any, filters: any, sorters: any) => {
		setFilteredInfo(filters);
	};

  return (
    //@ts-ignore
    <Table dataSource={data} columns={columns} onChange={handleChange} bordered
    expandable={{
      expandedRowRender: record => <p style={{ margin: 0 }}>{record.mp}</p>,
      rowExpandable: record => editable && record.num !== '0' && record.num !== '' + (data.length - 1) ? true : false,
    }} />
	);
}
