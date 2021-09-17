import { Col, InputNumber, Row } from 'antd';
import React from 'react';
import SelectInput from '../form/selectinput';
import { initOptions, MONTHS } from '../utils';

interface PurchaseInputProps {
    amount: number;
    setAmount: Function;
    month: number;
    setMonth: Function;
    year: number;
    setYear: Function;
}

export default function PurchaseInput(props: PurchaseInputProps) {
    const currentYear = new Date().getFullYear();
    const yearOpts = initOptions(1970, currentYear - 1970);
	
    return (
        <Row align="middle">
            <Col>
                <InputNumber value={props.amount} onChange={(val: number) => props.setAmount(val)} />
            </Col>
            <Col>
                <SelectInput pre="Month" value={props.month} changeHandler={props.setMonth} options={MONTHS} />
            </Col>
            <Col>
                <SelectInput pre="Year" value={props.year} changeHandler={props.setYear} options={yearOpts} />
            </Col>
        </Row>
    )
}