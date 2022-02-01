import React, { Fragment, useState, useContext } from 'react';
import { Modal, Button, Dropdown, Menu } from 'antd';
import { PlusOutlined, SaveOutlined, DownOutlined, UserOutlined } from '@ant-design/icons';
import AddHoldingInput from '../AddHoldingInput';
import AddHoldingFiancialInput from '../AddHoldingFinancialInput';
import { NWContext, TAB } from '../NWContext';
import AddPropertiesInput from '../AddPropertiesInput';
import MenuItem from 'antd/lib/menu/MenuItem';
import { InstrumentInput } from '../../../api/goals';
require('./AddHoldings.less');

interface AddHoldingsProps {
	data: Array<any>;
	changeData: Function;
	title: string;
	categoryOptions?: any;
	fields: any;
	defaultRate: number;
	info: any;
}

export default function AddHoldings({
	data,
	changeData,
	title,
	categoryOptions,
	fields,
	defaultRate,
	info
}: AddHoldingsProps) {
	const [ isModalVisible, setModalVisibility ] = useState<boolean>(false);
	const [ okDisabled, setOkDisabled ] = useState<boolean>(true);
	const [ newRec, setNewRec ] = useState<any>({});
	const { setInstruments, instruments, childTab, saveHoldings, isDirty, familyOptions }: any = useContext(NWContext);
	const [ instrumentsList, setInstrumentsList ] = useState<Array<any>>([]);
	const { STOCK, GOLDB, BOND, REIT, OIT, ETF, MF, PROP } = TAB;

	const close = () => {
		setModalVisibility(false);
	};

	const familyList = Object.keys(familyOptions);
	const hasInstruments = (childTab: string) => [ MF, STOCK, GOLDB, BOND, REIT, OIT, ETF ].includes(childTab);

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

	const addFamilyMember = (fid: string) => {
		if (hasInstruments(childTab)) {
			instrumentsList.map((item: InstrumentInput) => (!item.fId ? item.fId = fid : '' ));
			setInstrumentsList([ ...instrumentsList ]);
		} else {
			const rec = newRec;
			rec.fId = fid;
			setNewRec(rec);
		}
	};

	const handleAddButtonClick = () => {
		if (childTab === PROP) {
			addHolding();
		} else if (familyList.length === 1) {
			const fid = familyList[0];
			addFamilyMember(fid);
			addHolding();
		}
	};

	const handleMenuClick = (e: any) => {
		const fid = e.key;
		addFamilyMember(fid);
		addHolding();
	};

	const menu = (
		<Menu onClick={handleMenuClick}>
			{Object.keys(familyOptions).map((key: string) => (
				<MenuItem key={key} icon={<UserOutlined />}>
					{familyOptions[key]}
				</MenuItem>
			))}
		</Menu>
	);

	const updateInstruments = (instrumentsToAdd: []) => {
		instrumentsToAdd.map((item: any) => {
			if (item.name) delete item.name;
			if (item.type) delete item.type;
			if (item.subt) delete item.subt;
		});
		setInstrumentsList([ ...instrumentsToAdd, ...instruments ]);
	};

	return (
		<Fragment>
			&nbsp;&nbsp;
			<Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisibility(true)}>
				Add
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
				okButtonProps={{ disabled: okDisabled }}
				destroyOnClose
				onCancel={close}
				centered
				width="800px"
				footer={[
					<Button key="cancel" type="link" onClick={close}>
						Cancel
					</Button>,
					familyList.length > 1 && childTab !== PROP ? (
						<Dropdown overlay={menu} key={'add'}>
							<Button key="addfamily" type="primary" onClick={handleAddButtonClick}>
								Add
								<DownOutlined />
							</Button>
						</Dropdown>
					) : (
						<Button key="viewfamily" type="primary" onClick={handleAddButtonClick}>
							Add
						</Button>
					)
				]}
			>
				{hasInstruments(childTab) ? (
					<AddHoldingFiancialInput updateInstruments={updateInstruments} disableOk={setOkDisabled} />
				) : childTab === TAB.PROP ? (
					<AddPropertiesInput
						setInput={setNewRec}
						categoryOptions={categoryOptions}
						fields={fields}
						info={info}
					/>
				) : (
					<AddHoldingInput
						setInput={setNewRec}
						disableOk={setOkDisabled}
						categoryOptions={categoryOptions}
						fields={fields}
						defaultRate={defaultRate}
						info={info}
					/>
				)}
			</Modal>
		</Fragment>
	);
}
