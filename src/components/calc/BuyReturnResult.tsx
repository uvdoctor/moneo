import React, { useContext, useEffect } from 'react';
import xirr from 'xirr';
import { GoalContext } from '../goals/GoalContext';
import { CalcContext } from './CalcContext';
import ItemDisplay from './ItemDisplay';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { createYearlyFromMonthlyLoanCFs } from './finance';

export default function BuyReturnResult() {
	const { startYear, startMonth, cfs }: any = useContext(CalcContext);
	const {
		price,
		sellAfter,
		sellPrice,
		loanRepaymentMonths,
		iSchedule,
		pSchedule,
		annualReturnPer,
		setAnnualReturnPer,
	}: any = useContext(GoalContext);

	const getXIRRLoanEntries = () => {
		let loanXIRRCFs: Array<any> = [];
		let month = startMonth <= 1 ? 0 : startMonth - 1;
		let year = startYear;
		if (loanRepaymentMonths) {
			month += loanRepaymentMonths;
			if (month > 11) {
				year++;
				month -= 12;
			}
			month += loanRepaymentMonths;
		}
		console.log("ISchedule length is ", iSchedule.length);
		for (let i = 0; i < iSchedule.length; i++, month++) {
			let monthlyPayment = iSchedule[i] + pSchedule[i];
			loanXIRRCFs.push({
				amount: -monthlyPayment,
				when: new Date(year, month, 28)
			});
			if (month === 11) {
				month = -1;
				year++;
			}
		}
		return loanXIRRCFs;
	};

	const calculateXIRR = () => {
		if (!price || !sellPrice || !cfs) return null;
		let xirrCFs: Array<any> = [];
		let yearlyLoanPayments: any = {};
		let endMonth = startMonth <= 1 ? 11 : startMonth - 2;
		let sellCFIndex = sellAfter - 1;
		if (startMonth > 1) sellCFIndex++;
		if (iSchedule && iSchedule.length)
			yearlyLoanPayments = createYearlyFromMonthlyLoanCFs(iSchedule, pSchedule, startMonth, loanRepaymentMonths);
		cfs.forEach((cf: number, i: number) => {
			if (i === sellCFIndex) {
				cf -= sellPrice;
			}
			let startingYear = startYear;
			if (iSchedule && iSchedule.length) {
				if (startMonth + loanRepaymentMonths > 12) startingYear++;
				let index = startYear + i - startingYear;
				if (index >= 0 && yearlyLoanPayments.interest[index])
					cf += yearlyLoanPayments.interest[index] + yearlyLoanPayments.principal[index];
			}
			xirrCFs.push({
				amount: cf,
				when: new Date(startYear + i, i > 0 || startMonth <= 1 ? 0 : startMonth - 1, 1)
			});
		});
		if (iSchedule && iSchedule.length) xirrCFs.push(...getXIRRLoanEntries());
		xirrCFs.push({
			amount: Math.round(sellPrice),
			when: new Date(startYear + sellCFIndex, endMonth, 21)
		});
		xirrCFs.sort((a, b) => a.when - b.when);
		console.log('XIRR cfs are: ', xirrCFs);
		try {
			return xirr(xirrCFs) * 100;
		} catch (e) {
			console.log('Error while calculating xirr: ', e);
			return null;
		}
	};

	useEffect(
		() => {
			setAnnualReturnPer(calculateXIRR());
		},
		[ cfs ]
	);

	return annualReturnPer !== null ? (
		<ItemDisplay
			svg={annualReturnPer > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
			label="Buy Yields"
			result={annualReturnPer}
			decimal={2}
			unit={`% Yearly ${annualReturnPer > 0 ? 'Gain' : 'Loss'}`}
			pl
		/>
	) : (
		<ItemDisplay label="Buy Yields" result="Unable to Calculate." />
	);
}
