import React, { useContext, useEffect } from 'react';
import xirr from "xirr";
import { GoalContext } from '../goals/GoalContext';
import { CalcContext } from './CalcContext';
import ItemDisplay from './ItemDisplay';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { createYearlyFromMonthlyLoanCFs } from './finance';
import { calculateBuyAnnualNetCF } from '../goals/cfutils';

export default function BuyReturnResult() {
	const { startYear, startMonth, cfs }: any = useContext(CalcContext);
	const { price, sellAfter, sellPrice, loanRepaymentSY, iSchedule, pSchedule, assetChgRate, amStartYear, amCostPer, aiStartYear, aiPer, annualReturnPer, setAnnualReturnPer }: any = useContext(GoalContext);

	const getXIRRLoanEntries = () => {
		let loanXIRRCFs: Array<any> = [];
		let month = startMonth <= 1 ? 0 : startMonth - 1;
		let year = loanRepaymentSY;
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
	}
	
	const getXIRRMonthlyNetExpenseEntries = (annualNetCF: number, year: number, startMonth: number, endMonth: number) => {
		let netExpenseXIRRCFs: Array<any> = [];
		let month = startMonth <= 1 ? 0 : startMonth - 1;
		let monthlyCF = annualNetCF / (12 - month);
		for (let i = month; i < endMonth; i++) {
			netExpenseXIRRCFs.push({
				amount: monthlyCF,
				when: new Date(year, i, 7)
			});
		}
		return netExpenseXIRRCFs;
	};
	
	const calculateXIRR = () => {
		if (!price || !sellPrice || !cfs) return null;
		let xirrCFs: Array<any> = [];
		let yearlyLoanPayments: any = {};
		let endMonth = startMonth <= 1 ? 11 : startMonth - 1;
		if (iSchedule && pSchedule) yearlyLoanPayments = createYearlyFromMonthlyLoanCFs(iSchedule, pSchedule, startMonth);
		cfs.forEach((cf: number, i: number) => {
			if (i === sellAfter - 1) {
				cf -= sellPrice;
			}
			let netCF = calculateBuyAnnualNetCF(startYear, amCostPer, amStartYear, assetChgRate, i, price, aiPer, aiStartYear);
			cf -= netCF;
			if(netCF) xirrCFs.push(...getXIRRMonthlyNetExpenseEntries(netCF, startYear + i, startYear ? startMonth : 1, i === sellAfter - 1 ? endMonth + 1 : 12));
			if (loanRepaymentSY && iSchedule && pSchedule) {
				let index = startYear + i - loanRepaymentSY;
				if (index >= 0 && yearlyLoanPayments.interest[index]) cf += yearlyLoanPayments.interest[index] + yearlyLoanPayments.principal[index];
			}
			xirrCFs.push({
				amount: cf,
				when: new Date(startYear + i, startMonth <= 1 ? 0 : startMonth - 1, 1),
			});
		});
		if (loanRepaymentSY && iSchedule && pSchedule) xirrCFs.push(...getXIRRLoanEntries());
		xirrCFs.push({
				amount: Math.round(sellPrice),
				when: new Date(startYear + sellAfter - 1, endMonth, 15),
		});
		try {
			return xirr(xirrCFs) * 100;
		} catch (e) {
			console.log("Error while calculating xirr: ", e);
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
