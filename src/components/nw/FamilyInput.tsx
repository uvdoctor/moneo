import { Alert, Button, Col, Modal, Row, Select, Tooltip, notification } from 'antd';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { NWContext } from './NWContext';
import { UserAddOutlined, EditOutlined, SaveOutlined, UserOutlined } from '@ant-design/icons';
import { COLORS } from '../../CONSTANTS';
import TextInput from '../form/textinput';
import { addFamilyMember, updateFamilyMember } from './nwutils';
import { CreateFamilyInput, UpdateFamilyInput } from '../../api/goals';
import SelectInput from '../form/selectinput';

export const ALL_FAMILY = 'All';

const ADD_MODE = 'Add';
const EDIT_MODE = 'Edit';

export default function FamilyInput() {
	const { allFamily, selectedMembers, setSelectedMembers, loadingFamily }: any = useContext(NWContext);
	const { Option } = Select;
    const [ mode, setMode ] = useState<string>('');
    const [ id, setId ] = useState<string>('');
    const [ name, setName ] = useState<string>('');
    const [ taxId, setTaxId ] = useState<string>('');
    const [ error, setError ] = useState<string>('');
    const [ memberKeys, setMemberKeys ] = useState<Array<string>>([]);

    useEffect(() => {
        if(loadingFamily) return;
        let allFamilyKeys = Object.keys(allFamily);
        setMemberKeys([...allFamilyKeys]);
        setSelectedMembers([... [allFamilyKeys.length > 1 ? ALL_FAMILY: allFamilyKeys[0]]]);
    }, [loadingFamily]);

	const selectMember = (val: string[]) => {
        if (!val.length) {
			setSelectedMembers([ ...[ALL_FAMILY] ]);
			return;
		}
        if(val.length === 1 && val[0] && !selectedMembers.length) {
            setSelectedMembers([...val]);
            return;
        }
        let filteredOpts = val.filter((key: string) => key && key !== ALL_FAMILY);
		setSelectedMembers([ ...filteredOpts ]);
	};

    const resetState = () => {
        setId('');
        setName('');
        setTaxId('');
    };

    const getFamilyMemberOptions = () => {
        let opts: any = {};
        memberKeys.forEach((key: string) => opts[key] = allFamily[key].name)
        return opts;
    }

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
            setMode('');
            setSelectedMembers([...[member?.id]]);
            memberKeys.push(member?.id as string);
            setMemberKeys([...memberKeys]);
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
            setMode('');
            notification.success({ message: 'Family Member Updated', description: `Success! Family member details have been updated.`})
            return true;
        } catch (err) {
            notification.error({ message: 'Family Member not updated', description: "Sorry! Unable to update this family member: " + err });
            return false;
        }
    }

	return (
        <Fragment>
            {memberKeys.length && allFamily ? <Row align="middle">
                    <Col>
                    {memberKeys.length > 1 ? 
                    (<Select showSearch
                        mode="multiple"
                        value={selectedMembers}
                        onChange={(val: string[]) => selectMember(val)}
                        showArrow={memberKeys.length > 1}
                        loading={loadingFamily}
                        filterOption={(input, option) =>
                            option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        size="middle"
                        maxTagCount={1}
                    >
                        {memberKeys.length > 1 && (memberKeys.map((key: string) => (
                            <Option key={key} value={key}>
                                {allFamily[key] && allFamily[key].name}
                            </Option>
                        )))}
                        <Option key={ALL_FAMILY} value={ALL_FAMILY} disabled>
                            All Members
                        </Option>
                    </Select>)
                    : (<label>{(memberKeys.length && allFamily) ? allFamily[memberKeys[0]].name : ''}</label>)}
                    </Col>
                    <Col>
                    <Tooltip title='Add Family Member'>
                        <Button type="link" style={{color: COLORS.WHITE}} icon={<UserAddOutlined />} onClick={() => setMode(ADD_MODE)} />
                    </Tooltip>
                    </Col>
                    {memberKeys.length ?
                    <Col>
                        <Tooltip title='Edit Family Member'>
                            <Button type="link" style={{color: COLORS.WHITE}} icon={<EditOutlined />} onClick={() => setMode(EDIT_MODE)} />
                        </Tooltip>
                    </Col> : null}
            </Row> : null}
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
                    {memberKeys.length > 1 && id ? 
                        <SelectInput pre="Family Member" value={id}
                            changeHandler={setId} options={getFamilyMemberOptions()}
                        />
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
