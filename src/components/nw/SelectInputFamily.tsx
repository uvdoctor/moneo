import { Button, Col, Modal, Row, Select, Tooltip } from 'antd';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { NWContext } from './NWContext';
import { PlusOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import { COLORS } from '../../CONSTANTS';

export const ALL_FAMILY = 'All';

export default function SelectInputFamily() {
	const { allFamily, selectedMembers, setSelectedMembers }: any = useContext(NWContext);
	const { Option } = Select;
	const [ options, setOptions ] = useState<any>({ [ALL_FAMILY]: 'All Family Members' });
    const [ mode, setMode ] = useState<string>('');
    const ADD_MODE = 'Add';
    const EDIT_MODE = 'Edit';

	useEffect(
		() => {
			if (Object.keys(allFamily).length) setOptions(Object.assign(options, allFamily));
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
                        <Button type="link" style={{color: COLORS.WHITE}} icon={<PlusOutlined />} onClick={() => setMode(ADD_MODE)} />
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
                okText={"Save"} okButtonProps={{icon: <SaveOutlined />}}>
                </Modal>}
        </Fragment>
    );
}
