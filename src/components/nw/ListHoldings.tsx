import { Button, Col, Row } from 'antd';
import React, { Fragment, useContext } from 'react';
import { HoldingInput } from '../../api/goals';
import SelectInput from '../form/selectinput';
import { NWContext } from './NWContext';
import { getFamilyOptions } from './nwutils';
import { DeleteOutlined, UserOutlined } from '@ant-design/icons';

interface ListHoldingsProps {
	data: Array<HoldingInput>;
	changeData: Function;
	categoryOptions: any;
	viewComp: any;
	subCategoryOptions?: any;
	childTab?:any
}

export default function ListHoldings({ data, changeData, categoryOptions, viewComp, subCategoryOptions, childTab }: ListHoldingsProps) {
	const { allFamily }: any = useContext(NWContext);

	const changeOwner = (ownerKey: string, i: number) => {
		data[i].fIds[0] = ownerKey;
		changeData([ ...data ]);
	};

	const removeHolding = (i: number) => {
		data.splice(i, 1);
		changeData([ ...data ]);
	};

	return (
		<Row>
			{data &&
				data[0] &&
				data.map((holding: HoldingInput, i: number) => (
					<Fragment key={''+i}>
						<Col span={24} className="fields-divider" />
						<Col span={24}>
							<Row justify="space-between">
								{React.createElement(viewComp, {
									record: holding,
									data: data,
									changeData: changeData,
									categoryOptions: categoryOptions,
									subCategoryOptions: subCategoryOptions,
									childTab: childTab
								})}
								<Col>
									<SelectInput
										pre={<UserOutlined />}
										value={holding.fIds[0]}
										options={getFamilyOptions(allFamily)}
										changeHandler={(key: string) => changeOwner(key, i)}
										post={
											<Button type="link" onClick={() => removeHolding(i)} danger>
												<DeleteOutlined />
											</Button>
										}
									/>
								</Col>
							</Row>
						</Col>
					</Fragment>
				))}
		</Row>
	);
}
