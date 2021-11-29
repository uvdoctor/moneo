import { Col, InputNumber } from "antd";
import React, { } from "react";
import SelectInput from "../../form/selectinput";

interface DurationProps {
	value: number;
    changeHandler: Function;
    option?: any;
}

export default function Duration({value, changeHandler, option}: DurationProps) {
		return (
            <Col>
            {option 
                ? <SelectInput pre={''} value={value} options={option} changeHandler={changeHandler}/>
                : <InputNumber value={value} onChange={(val: number)=>changeHandler(val)}/>
            }
            </Col>       
	);
}
