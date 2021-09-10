import React, { Fragment, useState } from 'react';
import { Modal, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import AddHoldingInput from '../AddHoldingInput';

interface AddHoldingsProps {
	data: Array<any>;
	changeData: Function;
	isPrimary: boolean;
	title: string;
	categoryOptions: any;
	subCategoryOptions?: any;
}

export default function AddHoldings({
	data,
	changeData,
	isPrimary,
	title,
	categoryOptions,
	subCategoryOptions
}: AddHoldingsProps) {
	const [ isModalVisible, setModalVisibility ] = useState<boolean>(false);
	const [ okDisabled, setOkDisabled ] = useState<boolean>(true);
	const [ newRec, setNewRec ] = useState<any>({});

	const close = () => {
		setModalVisibility(false);
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
					setInput={setNewRec}
					disableOk={setOkDisabled}
					categoryOptions={categoryOptions}
					subCategoryOptions={subCategoryOptions}
				/>
			</Modal>
		</Fragment>
	);
}
