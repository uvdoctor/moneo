import { Alert, Button, Col, Modal, Row, Tooltip, notification, Skeleton, Form, Input } from 'antd';
import React, { Fragment, useContext, useState, useEffect, useRef } from 'react';
import TextInput from '../form/textinput';
import { COLORS } from '../../CONSTANTS';
import { SaveOutlined, EditOutlined } from '@ant-design/icons';
import { AppContext } from '../AppContext';
import { Auth } from 'aws-amplify';
import { useForm } from 'antd/lib/form/Form';
import { countrylist } from './CountryCode';
import dateFnsGenerateConfig from "rc-picker/lib/generate/dateFns";
import 'antd/lib/date-picker/style/index';
import { parse } from "date-fns";
import generatePicker from 'antd/lib/date-picker/generatePicker';

const dateFormat = "yyyy-MM-dd";
const DatePicker = generatePicker<Date>(dateFnsGenerateConfig);

export default function UserSettings(): JSX.Element {
	const { validateCaptcha, user, appContextLoaded, defaultCountry }: any = useContext(AppContext);
	const [ mode, setMode ] = useState<string>('');
	const [ disabledForm, setDisabledForm ] = useState(true);
	const [ email, setEmail ]  = useState<string>(user?.attributes.email);
	const [ contact, setContact ]  = useState<string>(user?.attributes.phone_number);
	const [ error, setError ] = useState<string>('');
	const [ otp, setOtp ] = useState<string>('');
	const name = useRef<string>(user?.attributes.name);
	const middleName = useRef<string>(user?.attributes.middle_name);
	const surname = useRef<string>(user?.attributes.family_name);
	const dob = useRef<string>(user?.attributes.birthdate || '');
	const oldPass = useRef<string>('');
	const newPass = useRef<string>('');
	const attrName = useRef<string>('');
	const [ form ] = useForm();
	const counCode = countrylist.find((item) => item.countryCode === defaultCountry);
	
	const handleFormChange = () =>
		setDisabledForm(form.getFieldsError().some(({ errors }) => errors.length) || !form.isFieldsTouched(true));

	const update = async (attr: any, attrValue: any, mode: string) => {
		const dataValue = [];
		for (const ind in attr) {
			try {
				const data = await Auth.updateUserAttributes(user, { [attr[ind]]: attrValue[ind] });
				dataValue.push(data);
				setMode(mode);
			} catch (error) {
				dataValue.push(error);
			}
		}
		const check = (ele: any, _index: number, _array: any) => {
			return ele === "SUCCESS";
		};
		if (dataValue.every(check)) {
			notification.success({ message: 'Updated Successfully' });
		} else {
			notification.error({ message: `Unable to update, ${error}` });
		}
	};


	const confirmOtp = async (attrValue: any) => {
		Auth.verifyCurrentUserAttributeSubmit(attrName.current, attrValue)
			.then(() => {
				notification.success({
					message: `${attrName.current} Verified`,
					description: 'Otp Verified Successfully'
				});
				setMode('');
				return true;
			})
			.catch((err) => {
				notification.error({
					message: 'Wrong Otp',
					description: 'Sorry! Unable to update : ' + err.message
				});
				// setMode('');
				return false;
			});
	};

	const editPassword = async () => {
		Auth.changePassword(user, oldPass.current, newPass.current)
			.then((data) => {
				notification.success({
					message: 'Password Updated',
					description: `Password Updated Status: ${data}`
				});
				setMode('');
				return true;
			})
			.catch((err) => {
				notification.error({
					message: 'Wrong Credentials',
					description: 'Sorry! Unable to update : ' + err.message
				});
				setMode('');
				return false;
			});
	};

	useEffect(
		() => {
			if (!user) return;
			name.current = user.attributes.name || '';
			middleName.current = user.attributes.middle_name || '';
			surname.current =  user.attributes.family_name || '';
			setContact(user.attributes.phone_number);
			setEmail(user.attributes.email);
			setContact(user.attributes.phone_number.replace(counCode?.value, ""));
		},
		[ appContextLoaded ]
	);

	return (
		<Fragment>
			{error ? (
				<Fragment>
					<Alert type="error" message={error} />
				</Fragment>
			) : null}
			<p>&nbsp;</p>
			<Row justify="center" style={{ fontSize: 25 }}>
				Settings
			</Row>
			<p>&nbsp;</p>
			{appContextLoaded ? (
				<Fragment>
					<Row justify="center">
					<Col>
					<Input addonBefore="Name" value={`${name.current} ${middleName.current} ${surname.current}`} style={{width:400}}
						disabled={true} size={'large'} />
					</Col>
					<Col>
						<Tooltip title="Save">
							<Button
							type="link"
							style={{ color: COLORS.GREEN }}
							icon={<EditOutlined />}
							onClick={() => {  
								setMode("Edit Name") }}
						/>
						</Tooltip>
					</Col>
				</Row>
				<p>&nbsp;</p>
					<Row justify="center">
						<Col>
							<TextInput
								pre="Contact"
								prefix={counCode?.value}
								value={contact}
								changeHandler={setContact}
								fieldName="contact"
								pattern="^[0-9]"
								setError={setError}
								minLength={10}
								maxLength={10}
							/>
						</Col>
						<Col>
							<Tooltip title="Save">
								<Button
									type="link"
									style={{ color: COLORS.GREEN }}
									icon={<SaveOutlined />}
									disabled={
										user.attributes.phone_number === `${counCode?.value}${contact}` ? (
											true
										) : error.length > 0 ? (
											true
										) : (
											false
										)
									}
									onClick={() => {
										validateCaptcha('phone_change').then((success: boolean) => {
											if (!success) return;
											attrName.current = 'phone_number';
											update(['phone_number'], [`${counCode?.value}${contact}`], 'Save');
										});
									}}
								/>
							</Tooltip>
						</Col>
					</Row>
					<p>&nbsp;</p>
					<Row justify="center">
						<Col>
							<TextInput
								pre="Email Id"
								value={email}
								changeHandler={setEmail}
								pattern="^(?!.*(?:\.-|-\.))[^@]+@[^\W_](?:[\w-]*[^\W_])?(?:\.[^\W_](?:[\w-]*[^\W_])?)+$"
								setError={setError}
								fieldName="email"
							/>
						</Col>
						<Col>
							<Tooltip title="Save">
								<Button
									type="link"
									style={{ color: COLORS.GREEN }}
									icon={<SaveOutlined />}
									disabled={email === user.attributes.email ? true : error.length > 0 ? true : false}
									onClick={() => {
										validateCaptcha('email_change').then((success: boolean) => {
											if (!success) return;
											attrName.current = 'email';
											update( ['email'], [email], 'Save');
										});
									}}
								/>
							</Tooltip>
						</Col>
					</Row>
					<p>&nbsp;</p>
					<Row justify="center">
						<Col>
							<Input.Password
								addonBefore="Password" value={"********"} disabled={true} style={{width:400}} size={'large'}
							/>
						</Col>
						<Col>
							<Tooltip title="Edit">
								<Button
									type="link"
									style={{ color: COLORS.GREEN }}
									icon={<EditOutlined />}
									onClick={() => {
										validateCaptcha('password_change').then((success: boolean) => {
											if (!success) return;
											setMode("Edit");
										});
									}}
								/>
							</Tooltip>
						</Col>
					</Row>
					<p>&nbsp;</p>
					<Row justify="center">
					<Col>
					<Input.Group style={{ width: 400}} size='large'>
					<Input style={{ width: '30%'}} defaultValue="DOB" disabled={true}/>
					<DatePicker style={{ width: '70%'}} defaultValue={parse(user?.attributes.birthdate , dateFormat, new Date()) }
      		format={dateFormat} size='large' onChange={(_, ds)=>
						//@ts-ignore
						dob.current = ds.toString()
					}/>
					</Input.Group>
					</Col>
					<Col>
						<Tooltip title="Save">
							<Button
							type="link"
							style={{ color: COLORS.GREEN }}
							icon={<SaveOutlined />}
							onClick={() => {
								update(['birthdate'], [dob.current], "" ) }}
						/>
						</Tooltip>
					</Col>
				</Row>
				</Fragment>
			) : (
				<Skeleton active />
			)}
			{mode && (
				<Modal
					title={`${mode}`}
					visible={mode === 'Edit'}
					onCancel={() => setMode('')}
					onOk={() => (mode === 'Edit' ? editPassword() : null)}
					okText={'Save'}
					okButtonProps={{
						disabled: disabledForm,
						icon: <SaveOutlined />
					}}
				>
					<Form name="submit" layout="vertical" form={form} onFieldsChange={handleFormChange}>
						<Form.Item name="Old Password" label="Enter Your Old Password" required={true}>
							<Input.Password
								allowClear
								value={oldPass.current}
								onChange={(e) => oldPass.current = (e.currentTarget.value)}
							/>
						</Form.Item>
						<Form.Item
							name="newPassword"
							label="New Password"
							required={true}
							rules={[
								{
									min: 8,
									max: 20,
									message: 'Password must be between 8-20 length'
								},
								{
									pattern: new RegExp('(?=.*[a-z])'),
									message: 'Atleast one lowercase'
								},
								{
									pattern: new RegExp('(?=.*[A-Z])'),
									message: 'Atleast one uppercase'
								},
								{
									pattern: new RegExp('.*[0-9].*'),
									message: 'Atleast one digit'
								},
								{
									pattern: new RegExp('(?=.*[!@#$%^&*])'),
									message: 'Atleast one special characters'
								}
							]}
						>
							<Input.Password
								allowClear
								value={newPass.current}
								onChange={(e) => newPass.current = (e.currentTarget.value)}
							/>
						</Form.Item>
						<Form.Item
							name="reenterPassword"
							label="Re-enter Password"
							dependencies={[ 'newPassword' ]}
							rules={[
								{
									required: true,
									message: 'Please confirm your password!'
								},
								({ getFieldValue }) => ({
									validator(_, value) {
										if (getFieldValue('newPassword') === value) return Promise.resolve();
										return Promise.reject('The two passwords that you entered do not match!');
									}
								})
							]}
						>
							<Input.Password allowClear />
						</Form.Item>
					</Form>
				</Modal>
			)}
			{mode && (
				<Modal
					title={`${mode}`}
					visible={ mode === 'Save' }
					onCancel={() => setMode('')}
					onOk={() => (mode === 'Save' ? confirmOtp(otp) : null)}
					okText={'Save'}
					okButtonProps={{ icon: <SaveOutlined /> }}
				>
				<TextInput pre="OTP" value={otp} changeHandler={setOtp} fieldName="otp" setError={setError} />
				</Modal>
			)}
			{mode && (
				<Modal
					title={`${mode}`}
					visible={mode === 'Edit Name'}
					onCancel={() => setMode('')}
					onOk={ () =>
					(mode === 'Edit Name' ? update(['name', 'middle_name', 'family_name'],[name.current, middleName.current, surname.current], "") : null)
				}
					okText={'Save'}
					okButtonProps={{
						disabled: disabledForm,
						icon: <SaveOutlined />
					}}
				>
					<Form name="submit" layout="vertical" form={form} onFieldsChange={handleFormChange}>
						<Form.Item
							name="name"
							label="Enter your name"
							initialValue={name.current}
							rules={[
								{
									pattern: new RegExp("^[a-zA-Z'-.,]+$"),
									message: 'Invalid Format'
								},
								{
									required:true,
									min: 2,
									max: 20,
									message: 'Length 2-20'
								}
							]}
						>
						<Input allowClear value={name.current} onChange={(e) => name.current=(e.currentTarget.value)} />
						</Form.Item>
						<Form.Item
							name="middleName"
							label="Enter your Middle Name"
							initialValue={middleName.current}
							rules={[
								{
									pattern: new RegExp("^[a-zA-Z'-.,]+$"),
									message: 'Invalid Format'
								},
								{
									min: 2,
									max: 20,
									message: 'Length 2-20'
								}
							]}
						>
						<Input
							allowClear
							value={middleName.current} 
							onChange={(e) => middleName.current = (e.currentTarget.value)}
							/>
						</Form.Item>
						<Form.Item
							name="surname"
							label="Enter your Surname"
							initialValue={surname.current}
							rules={[
								{
									pattern: new RegExp("^[a-zA-Z'-.,]+$"),
									message: 'Invalid Format'
								},
								{
									min: 2,
									max: 20,
									message: 'Length 2-20'
								}
							]}
						>
							<Input allowClear value={surname.current}  onChange={(e) => surname.current =(e.currentTarget.value)} />
						</Form.Item>
					</Form>
				</Modal>
			)}
		</Fragment>
	);
}
