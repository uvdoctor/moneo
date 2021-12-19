import { Col, InputNumber } from 'antd';
import React from 'react';
import SelectInput from '../../form/selectinput';
import { toReadableNumber } from '../../utils';

interface DurationProps {
	value: number;
	changeHandler: Function;
	option?: any;
}

export default function Duration({ value, changeHandler, option }: DurationProps) {
	return (
		<><Col>
            {option ? (
                <SelectInput pre={''} value={value} options={option} changeHandler={changeHandler} />
            ) : (
                // <><NumberInput pre={''} min={6} max={10000} value={value} changeHandler={changeHandler} step={0.1} noSlider post='Months'/>
                <><InputNumber value={value} onChange={(val: number) => changeHandler(val)} />
                    <label>Months</label>
                </>
            )}
        </Col>
        {!option && 
            <Col>
                <label>{`${toReadableNumber(value / 12, 2)} Years`}</label>
            </Col>}
        </>
	);
}
