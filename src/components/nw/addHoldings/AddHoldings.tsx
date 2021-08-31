import React, { Fragment, ReactNode, useState } from 'react';
import { Modal, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface AddHoldingsProps {
	data: Array<any>;
	changeData: Function;
	isPrimary: boolean;
	children: ReactNode;
}

export default function AddHoldings({ data, changeData, isPrimary, children }: AddHoldingsProps) {
	const [ isModalVisible, setModalVisibility ] = useState(false);

	const add = () => {
		data.push();
		changeData([ ...data ]);
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
				title="Add"
				visible={isModalVisible}
				footer={null}
				onCancel={() => setModalVisibility(false)}
				onOk={add}
			>
				{children}
				{/*<ContextProvider>
					<FormGenerator onClose={onClose} />
				</ContextProvider>*/}
			</Modal>
		</Fragment>
	);
}
