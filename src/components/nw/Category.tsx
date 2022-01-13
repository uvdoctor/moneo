import { Col, Row } from 'antd';
import React, { useContext } from 'react';
import { HoldingInput } from '../../api/goals';
import { NWContext, TAB } from './NWContext';
import CascaderInput from '../form/CascaderInput';
interface CategoryProps {
	data: Array<HoldingInput>;
	changeData: Function;
	categoryOptions: any;
	record: HoldingInput;
}

export default function Category({ data, changeData, categoryOptions, record }: CategoryProps) {
	const { childTab }: any = useContext(NWContext);
	const { CRYPTO, INS, LENT, OTHER, VEHICLE, PF } = TAB;

	const changeCategory = (value: any) => {
		childTab === CRYPTO ? (record.name = value) : (record.subt = value);
		changeData([ ...data ]);
	};

	const changeSubCategory = (value: any) => {
		childTab === INS ? (record.chgF = Number(value)) : (record.name = value);
		changeData([ ...data ]);
	};

	const hasSingleOption = (childTab: string) => [ LENT, OTHER, VEHICLE, CRYPTO, PF ].includes(childTab);

	return (
		<Row gutter={[ 10, 10 ]}>
			{categoryOptions && (
				<Col>
					<CascaderInput
						parentValue={childTab === CRYPTO ? record.name as string : record.subt as string}
						childValue={
							hasSingleOption(childTab) ? (
								''
							) : childTab === INS ? (
								record.chgF as number
							) : (
								record.name as string
							)
						}
						childChangeHandler={hasSingleOption(childTab) ? '' : changeSubCategory}
						parentChangeHandler={changeCategory}
						options={categoryOptions}
						pre={''}
					/>
				</Col>
			)}
		</Row>
	);
}
