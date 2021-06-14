import { Button, Col, Modal, Row, Select, Tooltip } from 'antd';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { NWContext } from './NWContext';
import { UserAddOutlined, EditOutlined, SaveOutlined, UserOutlined } from '@ant-design/icons';
import { COLORS } from '../../CONSTANTS';
import TextInput from '../form/textinput';

export const ALL_FAMILY = 'All';

const ADD_MODE = 'Add';
const EDIT_MODE = 'Edit';

export default function FamilyInput() {
	const { allFamily, selectedMembers, setSelectedMembers }: any = useContext(NWContext);
	const { Option } = Select;
	const [ options, setOptions ] = useState<any>({ [ALL_FAMILY]: 'All Family Members' });
    const [ mode, setMode ] = useState<string>('');
    const [ id, setId ] = useState<string>('');
    const [ name, setName ] = useState<string>('');
    const [ taxId, setTaxId ] = useState<string>('');
    const [ error, setError ] = useState<string>('');

	useEffect(
		() => {
			if (Object.keys(allFamily).length) {
                let opts: any = {};
                Object.keys(options).forEach((key: string) => opts[key] = allFamily[key].name);
                setOptions(opts);
            }
		},
		[ allFamily ]
	);

	const selectMember = (val: string[]) => {
		if (selectedMembers.includes(val)) return;
		if (!val.length) {
			setSelectedMembers([ ...[ ALL_FAMILY ] ]);
			return;
		}
		let filteredMembers = val.filter((val: string) => val !== ALL_FAMILY);
		setSelectedMembers([ ...filteredMembers ]);
	};

	return (
        <Fragment>
            <Row align="middle">
                <Col>
                    <Select showSearch
                        mode="multiple"
                        value={selectedMembers}
                        onChange={(val: string[]) => selectMember(val)}
                        showArrow
                        filterOption={(input, option) =>
                            option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        size="middle"
                        maxTagCount={1}
                    >
                        {Object.keys(options).map((key) => (
                            <Option key={key} value={key} disabled={key === ALL_FAMILY}>
                                {options[key]}
                            </Option>
                        ))}
                    </Select>
                </Col>
                <Col>
                    <Tooltip title='Add Family Member'>
                        <Button type="link" style={{color: COLORS.WHITE}} icon={<UserAddOutlined />} onClick={() => setMode(ADD_MODE)} />
                    </Tooltip>
                </Col>
                {Object.keys(allFamily).length ?
                    <Col>
                        <Tooltip title='Edit Family Member'>
                            <Button type="link" style={{color: COLORS.WHITE}} icon={<EditOutlined />} onClick={() => setMode(EDIT_MODE)} />
                        </Tooltip>
                    </Col> : null}
            </Row>
            {mode && 
                <Modal title={`${mode} Family Member`} visible={mode.length > 0} onCancel={() => setMode('')}
                okText={"Save"} okButtonProps={{icon: <SaveOutlined />, disabled: !name || !taxId || error ? true : false}}>
                    {error ? <Row>{error}</Row> : null}
                    <TextInput pre={<UserOutlined />} placeholder="Member Name" value={name} changeHandler={setName} minLength={3} 
                        setError={setError} fieldName="Member name" />
                    <p>&nbsp;</p>
                    <TextInput pre="PAN Number" placeholder="XXXXX1234X" value={taxId} changeHandler={setTaxId} minLength={10} 
                        setError={setError} pattern='[A-Z]{5}[0-9]{4}[A-Z]{1}' fieldName="PAN number" />
                </Modal>}
        </Fragment>
    );
}
