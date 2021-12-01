import React, { Fragment, useState, useContext } from 'react';
import { Modal, Button } from 'antd';
import { PlusOutlined, SaveOutlined } from '@ant-design/icons';
import AddHoldingInput from '../AddHoldingInput';
import AddHoldingFiancialInput from '../AddHoldingFinancialInput';
import { NWContext, TAB } from '../NWContext';
import AddPropertiesInput from '../AddPropertiesInput';

require('./AddHoldings.less');

interface AddHoldingsProps {
	data: Array<any>;
	changeData: Function;
	isPrimary: boolean;
	title: string;
	categoryOptions?: any;
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
	const { setInstruments, instruments, childTab, saveHoldings, isDirty }: any = useContext(NWContext);
	const [ instrumentsList, setInstrumentsList ] = useState<any>([]);

	const close = () => {
		setModalVisibility(false);
	};

	const hasInstruments = (childTab: string) => [ TAB.BOND, TAB.STOCK, TAB.ETF, TAB.MF, TAB.GOLDB, TAB.IT ].includes(childTab);

	const addHolding = () => {
		if (hasInstruments(childTab)) {
			setInstruments(instrumentsList);
			setInstrumentsList([]);
		} else {
			data.push(newRec);
			changeData([ ...data ]);
		}
		close();
	};

	const updateInstruments = (instrumentsToAdd: []) => {
		setInstrumentsList([ ...instrumentsToAdd, ...instruments ]);
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
			&nbsp;&nbsp;
			<Button
				key="save"
				type="primary"
				disabled={!isDirty}
				icon={<SaveOutlined />}
				onClick={() => saveHoldings()}
				className="steps-start-btn"
			>
				Save
			</Button>
			<Modal
				className="add-holdings"
				title={title}
				visible={isModalVisible}
				onCancel={close}
				onOk={() => addHolding()}
				okButtonProps={{ disabled: okDisabled }}
				destroyOnClose
				centered
				width="800px"
			>
				{hasInstruments(childTab) ? (
					<AddHoldingFiancialInput updateInstruments={updateInstruments} disableOk={setOkDisabled} />
				) : childTab === TAB.PROP ? (
					<AddPropertiesInput
						setInput={setNewRec}
						disableOk={setOkDisabled}
						categoryOptions={categoryOptions}
					/>
				) : (
					<AddHoldingInput
						setInput={setNewRec}
						disableOk={setOkDisabled}
						categoryOptions={categoryOptions}
						subCategoryOptions={subCategoryOptions}
					/>
				)}
			</Modal>
		</Fragment>
	);
}
