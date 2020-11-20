import React, { Fragment, useState } from 'react';
import { Button, Col, Row } from 'antd';
import MonthlyLoanSchedule from '../calc/MonthlyLoanSchedule';
import LoanScheduleChart from '../goals/LoanScheduleChart';

export default function LoanSchedule() {
	const [ monthlySchedule, setMonthlySchedule ] = useState<boolean>(false);

	return (
		<Fragment>
			<Row justify="end">
				<Button type="link" onClick={() => setMonthlySchedule(!monthlySchedule)}>
					{`View ${monthlySchedule ? 'Yearly Chart' : 'Monthly Schedule'}`}
				</Button>
			</Row>
			<Col span={24}>{monthlySchedule ? <MonthlyLoanSchedule /> : <LoanScheduleChart />}</Col>
		</Fragment>
	);
}
