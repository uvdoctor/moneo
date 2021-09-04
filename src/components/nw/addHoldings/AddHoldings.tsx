import React, { Fragment, useState } from 'react';
import { Modal, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface AddHoldingsProps {
	data: Array<any>;
	changeData: Function;
	input: any;
	inputComp: any;
	isPrimary: boolean;
	title: string;
}

export default function AddHoldings({ data, changeData, input, inputComp, isPrimary, title }: AddHoldingsProps) {
	const [ isModalVisible, setModalVisibility ] = useState<boolean>(false);
	const [ okDisabled, setOkDisabled ] = useState<boolean>(true);
	const [ newRec, setNewRec ] = useState<any>(Object.assign({}, input));

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
			>
				{React.createElement(inputComp, { input: newRec, disableOk: setOkDisabled })}
			</Modal>
		</Fragment>
	);
}
