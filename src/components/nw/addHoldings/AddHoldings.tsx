import React, { Fragment, useContext, useState } from 'react';
import { Modal, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import AddHoldingInput from '../AddHoldingInput';
import { AssetSubType, AssetType } from '../../../api/goals';
import { BTC, NWContext, PM_TAB } from '../NWContext';

interface AddHoldingsProps {
	data: Array<any>;
	changeData: Function;
	input: any;
	isPrimary: boolean;
	title: string;
	categoryOptions: any;
	subCategoryOptions?: any;
}

export default function AddHoldings({
	data,
	changeData,
	input,
	isPrimary,
	title,
	categoryOptions,
	subCategoryOptions
}: AddHoldingsProps) {
	const { allFamily, childTab }: any = useContext(NWContext);
	const [ isModalVisible, setModalVisibility ] = useState<boolean>(false);
	const [ okDisabled, setOkDisabled ] = useState<boolean>(true);
	const [ newRec, setNewRec ] = useState<any>(
		Object.assign(
			{},
			{
				id: '',
				type: AssetType.A,
				subt: childTab === PM_TAB ? AssetSubType.Gold : BTC,
				fIds: [ Object.keys(allFamily)[0] ],
				qty: 0,
				curr: 'USD',
				name: childTab === PM_TAB ? '24' : ''
			}
		)
	);
	const close = () => {
		setModalVisibility(false);
		setNewRec(Object.assign({}, input));
	};

	const addHolding = () => {
		data.push(newRec);
		changeData([ ...data ]);
		close();
	};

	return (
		<Fragment>
			&nbsp;&nbsp;
			<Button
				type={isPrimary ? 'primary' : 'default'}
				icon={<PlusOutlined />}
				onClick={() => setModalVisibility(true)}
			>
				{isPrimary ? 'Add' : 'Add Manually'}
			</Button>
			<Modal
				title={title}
				visible={isModalVisible}
				onCancel={close}
				onOk={() => addHolding()}
				okButtonProps={{ disabled: okDisabled }}
				destroyOnClose
				centered
			>
				<AddHoldingInput
					input={newRec}
					disableOk={setOkDisabled}
					categoryOptions={categoryOptions}
					subCategoryOptions={subCategoryOptions}
				/>
			</Modal>
		</Fragment>
	);
}
