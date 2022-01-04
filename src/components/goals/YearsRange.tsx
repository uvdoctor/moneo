import { Col, Row } from 'antd';
import React, { useContext } from 'react';
import { CalcContext } from '../calc/CalcContext';
import RadioInput from '../form/RadioInput';

export default function YearsRange() {
    const { analyzeFor, setAnalyzeFor }: any = useContext(CalcContext);
    return (
        <Row align="middle" justify="center">
			<Col xs={24} sm={24} md={24} lg={12}>
				<RadioInput from={10} to={50} increment={10} value={analyzeFor} changeHandler={setAnalyzeFor} unit="years" />
			</Col>
		</Row>
    )
}