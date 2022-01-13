import { Cascader, Col, Row, Select } from 'antd';
import React, { useContext } from 'react';
import { HoldingInput } from '../../api/goals';
import SelectInput from '../form/selectinput';
import { isMobileDevice } from '../utils';
import { NWContext, TAB } from './NWContext';
import { useFullScreenBrowser } from 'react-browser-hooks';
interface CategoryProps {
	data: Array<HoldingInput>;
	changeData: Function;
	categoryOptions: any;
	cascaderOptions: any;
	record: HoldingInput;
}

export default function Category({ data, changeData, categoryOptions, cascaderOptions, record }: CategoryProps) {
	const { childTab }: any = useContext(NWContext);
	const { CRYPTO, INS } = TAB;
	const fsb = useFullScreenBrowser();
	const { Option, OptGroup } = Select;

	const changeCategory = (subtype: string) => {
		childTab === CRYPTO ? (record.name = subtype) : (record.subt = subtype);
		changeData([ ...data ]);
	};

	const changeSubCategory = (value: any) => {
		record.subt = value[0];
		childTab === INS ? (record.chgF = Number(value[1])) : (record.name = value[1]);
		changeData([ ...data ]);
	};

	return (
		<Row gutter={[ 10, 10 ]}>
			{categoryOptions && (
				<Col>
					<SelectInput
						pre=""
						value={childTab === CRYPTO ? record.name as string : record.subt as string}
						options={categoryOptions}
						changeHandler={(val: string) => changeCategory(val)}
					/>
				</Col>
			)}
			{cascaderOptions && (
				<Col>
					<Cascader
						defaultValue={[
							record.subt as string,
							childTab === INS ? record.chgF as number : record.name as string
						]}
						onChange={changeSubCategory}
						options={cascaderOptions}
						style={{ width: isMobileDevice(fsb) ? 120 : 200 }}
					/>
				</Col>
			)}
			{(record.subt === 'BD' || record.subt === 'P2P') && (
				<Col>
					<Select
						defaultValue={record.chgF as number}
						style={{ width: 150 }}
						onChange={(value) => {
							record.chgF = Number(value);
							changeData([ ...data ]);
						}}
					>
						<Option value={0}>Pay Out</Option>
						<OptGroup label="Accumulates Interest Every">
							<Option value={1}>Year</Option>
							<Option value={2}>Six Months</Option>
							<Option value={4}>Three Months</Option>
							<Option value={12}>Month</Option>
						</OptGroup>
					</Select>
				</Col>
			)}
		</Row>
	);
}
