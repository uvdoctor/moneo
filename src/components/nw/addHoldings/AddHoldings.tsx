import React, { Fragment, useContext, useState } from 'react';
import { Modal, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import FormGenerator from './FormGenerator';
import { Context, ContextProvider } from './Context';

interface AddHoldingsProps {
	data: Array<any>;
	changeData: Function;
	isPrimary: boolean;
}

export default function AddHoldings({ data, changeData, isPrimary }: AddHoldingsProps) {
	const [ isModalVisible, setModalVisibility ] = useState(false);
	const { add }: any = useContext(Context);
	
	const onClose = () => setModalVisibility(false);

	const addHolding = (input: any) => {
		data.push(input);
		changeData([...data]);
	}

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
			<ContextProvider>
				<Modal
					title="Add"
					visible={isModalVisible}
					footer={null}
					onCancel={onClose}
					onOk={() => add((input: any) => addHolding(input))}
				>
					<FormGenerator onClose={onClose} />
				</Modal>
			</ContextProvider>
		</Fragment>
	);
}
