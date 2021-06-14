import { Alert, Button, Col, Modal, Row, Select, Tooltip, notification } from 'antd';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { NWContext } from './NWContext';
import { UserAddOutlined, EditOutlined, SaveOutlined, UserOutlined } from '@ant-design/icons';
import { COLORS } from '../../CONSTANTS';
import TextInput from '../form/textinput';
import { addFamilyMember, loadAllFamilyMembers, updateFamilyMember } from './nwutils';
import { CreateFamilyInput, UpdateFamilyInput } from '../../api/goals';

export const ALL_FAMILY = 'All';

const ADD_MODE = 'Add';
const EDIT_MODE = 'Edit';

export default function FamilyInput() {
	const { allFamily, selectedMembers, setSelectedMembers, setAllFamily }: any = useContext(NWContext);
	const { Option } = Select;
    const [ mode, setMode ] = useState<string>('');
    const [ id, setId ] = useState<string>('');
    const [ name, setName ] = useState<string>('');
    const [ taxId, setTaxId ] = useState<string>('');
    const [ error, setError ] = useState<string>('');
    const [ loading, setLoading ] = useState<boolean>(true);
    const [ includeAllOption, setIncludeAllOption ] = useState<boolean>(false);

    const getDefaultFamilySelection = (familyList?: any) => {
        let list = familyList ? familyList : allFamily;
        let keys = Object.keys(list);
        return !keys.length ? '' : keys.length > 1 ? ALL_FAMILY : keys[0];
    }

    const initializeFamilyList = async () => {
        try {
            let familyList = await loadAllFamilyMembers();
            setAllFamily(familyList);
        } catch(err) {
            notification.error({message: 'Family list not loaded', description: 'Sorry! Unable to fetch details of your family members.'});
            return false;
        }
    };

    useEffect(() => {
        initializeFamilyList().then(() => setLoading(false));
    }
    , []);

    useEffect(() => {
        if(loading) return;
        setSelectedMembers([...[getDefaultFamilySelection()]]);
    }, [loading]);

	useEffect(() => {
        setIncludeAllOption(Object.keys(allFamily).length > 1);
    }, [ Object.keys(allFamily).length ]);

	const selectMember = (val: string[]) => {
        if (!val.length) {
			setSelectedMembers([ ...[ getDefaultFamilySelection() ] ]);
			return;
		}
        if(val.length === 1) {
            setSelectedMembers([...val]);
            return;
        }
        let filteredOpts = val.filter((key: string) => key !== ALL_FAMILY);
		setSelectedMembers([ ...filteredOpts ]);
	};

    const resetState = () => {
        setId('');
        setName('');
        setTaxId('');
    };

    useEffect(() => {
        if(!mode || mode !== EDIT_MODE) {
            resetState();
            return;
        }
        setId(Object.keys(allFamily)[0]);
    }, [mode]);

    useEffect(() => {
        if(!id) {
            resetState();
            return;
        }
        setName(allFamily[id].name);
        setTaxId(allFamily[id].taxId);
    }, [id]);

    const addMember = async () => {
        let member: CreateFamilyInput | null = null;
        try {
            member = await addFamilyMember(name, taxId);
            if(member) allFamily[member?.id as string] = {name: member.name, taxId: member.tid};
            setAllFamily(allFamily);
            setMode('');
            notification.success({ message: 'New Family Member Added', description: `Success! ${name} has been added to your family list.`});
            return true;
        } catch (err) {
            notification.error({ message: 'Family Member not added', description: "Sorry! Unable to add this family member: " + err });
            return false;
        }
    }

    const changeMember = async () => {
        let member: UpdateFamilyInput | null = null;
        try {
            member = await updateFamilyMember({id: id, name: name, tid: taxId});
            if(member) allFamily[id] = {name: member.name, taxId: member.tid};
            setAllFamily(allFamily);
            setMode('');
            notification.success({ message: 'Family Member Updated', description: `Success! Details of ${name} have been updated.`})
            return true;
        } catch (err) {
            notification.error({ message: 'Family Member not updated', description: "Sorry! Unable to update this family member: " + err });
            return false;
        }
    }

	return (
        <Fragment>
            {Object.keys(allFamily).length ? 
                <Row align="middle">
                    <Col>
                        Family List &nbsp;
                    </Col>
                    <Col>
                    <Select showSearch
                        mode="multiple"
                        value={selectedMembers}
                        onChange={(val: string[]) => selectMember(val)}
                        showArrow={Object.keys(allFamily).length > 1}
                        loading={loading}
                        filterOption={(input, option) =>
                            option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        size="middle"
                        maxTagCount={1}
                    >
                        {Object.keys(allFamily).map((key: string) => (
                            <Option key={key} value={key}>
                                {allFamily[key].name}
                            </Option>
                        ))}
                        {includeAllOption ? 
                            <Option key={ALL_FAMILY} value={ALL_FAMILY} disabled>
                                All Family Members
                            </Option>
                        : null}
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
            : <Button icon={<UserAddOutlined />} onClick={() => addMember()} loading={loading}>Set up Family List</Button>}
            {mode && 
                <Modal title={`${mode} Family Member`} visible={mode.length > 0} onCancel={() => setMode('')}
                onOk={() => mode === ADD_MODE ? addMember() : changeMember()}
                okText={"Save"} okButtonProps={{icon: <SaveOutlined />, disabled: !name || !taxId || error ? true : false}}>
                    {error ? 
                        <Fragment>
                            <Alert type="error" message={error} />
                            <p>&nbsp;</p> 
                        </Fragment>
                    : null}
                    {id ? 
                        <Fragment>
                         Family Member &nbsp;   
                        <Select showSearch
                            value={id}
                            onChange={(val: string) => setId(val)}
                        >
                            {Object.keys(allFamily).map((key: string) => 
                                <Option key={key} value={key}>
                                    {allFamily[key].name}
                                </Option>
                            )}
                        </Select>
                        <p>&nbsp;</p>
                        </Fragment>
                    : null}
                    <TextInput pre={<UserOutlined />} placeholder="Member Name" value={name} changeHandler={setName} minLength={3} 
                        setError={setError} fieldName="Member name" />
                    <p>&nbsp;</p>
                    <TextInput pre="PAN Number" placeholder="XXXXX1234X" value={taxId} changeHandler={setTaxId} minLength={10} 
                        setError={setError} pattern='[A-Z]{5}[0-9]{4}[A-Z]{1}' fieldName="PAN number" />
                </Modal>}
        </Fragment>
    );
}
