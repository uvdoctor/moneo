import React from 'react';
import MonthlyLoanSchedule from '../calc/MonthlyLoanSchedule';
import LoanScheduleChart from '../goals/LoanScheduleChart';
import DataSwitcher from '../DataSwitcher';

export default function LoanSchedule() {
	const { Chart, List: DataSwitcherList } = DataSwitcher;

	return (
		<DataSwitcher>
			<Chart>
				<LoanScheduleChart />
			</Chart>
			<DataSwitcherList>
				<MonthlyLoanSchedule editable />
			</DataSwitcherList>
		</DataSwitcher>
	);
}
