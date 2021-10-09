import { Alert, Button, Col, Modal, Row, Tooltip, notification, Skeleton, Form, Input } from 'antd';
import React, { Fragment, useContext, useState, useEffect } from 'react';
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
	const [ email, setEmail ] = useState<string>('');
	const [ fullName, setFullName ] = useState<string>('');
	const [ name, setName ] = useState<string>('');
	const [ middleName, setMiddleName ] = useState<string>('');
	const [ dob , setDob ] = useState<any>({});
	const [ surname, setSurname ] = useState<string>('');
	const [ oldPass, setOldPass ] = useState<string>('');
	const [ newPass, setNewPass ] = useState<string>('');
	const [ disabledForm, setDisabledForm ] = useState(true);
	const [ contact, setContact ] = useState<string>('');
	const [ error, setError ] = useState<string>('');
	const [ otp, setOtp ] = useState<string>('');

	let attrName = '';
	const counCode = countrylist.find((item) => item.countryCode === defaultCountry);
	const [ form ] = useForm();

	const handleFormChange = () =>
		setDisabledForm(form.getFieldsError().some(({ errors }) => errors.length) || !form.isFieldsTouched(true));

	const update = async (attr: any , attrValue: any, mode: string) => {
		for (const ind in attr){	
		try {
			attrName = attr[ind]
			await Auth.updateUserAttributes(user, { [attr[ind]]: attrValue[ind] });
			notification.success({
				message: `${attr[ind]} Updated Successfully`,
				description: `Enter your otp to verify`
			});
			setMode(mode);
		} catch (error) {
			notification.error({
				message: `Unable to update ${attr[ind]}`,
				description: `${error}`
			});
		}
	}
	};

	const confirmOtp = async (attrValue: any) => {
		Auth.verifyCurrentUserAttributeSubmit(attrName, attrValue)
			.then(() => {
				notification.success({
					message: `${attrName} Verified`,
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
				setMode('');
				return false;
			});
	};

	const editPassword = async () => {
		Auth.changePassword(user, oldPass, newPass)
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
			console.log(user);
			setName(user.attributes.name)
			setMiddleName(user.attributes.middle_name)
			setSurname(user.attributes.family_name)
			setContact(user.attributes.phone_number);
			setFullName(`${user.attributes.name} ${user.attributes.middle_name} ${user.attributes.family_name}`);
			setEmail(user.attributes.email);
			setDob(user.attributes.birthdate)
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
						<TextInput
						pre="Name"
						value={fullName}
						changeHandler={setFullName}
						setError={setError}
						fieldName="name"
						disabled={true}
					/>
					</Col>
					<Col>
						<Tooltip title="Save">
							<Button
							type="link"
							style={{ color: COLORS.GREEN }}
							icon={<EditOutlined />}
							onClick={() => {  setMode("EditOne") }}
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
							<TextInput
								pre="Password"
								value={'************'}
								changeHandler={() => {}}
								fieldName="password"
								disabled={true}
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
					<DatePicker style={{ width: '70%'}} defaultValue={parse(dob, dateFormat, new Date()) }
      		format={dateFormat} size='large' onChange={(_, ds)=>
					
						//@ts-ignore
						setDob(ds.toString()) 
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
								update(['birthdate'], [dob], "" ) }}
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
								value={oldPass}
								onChange={(e) => setOldPass(e.currentTarget.value)}
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
								value={newPass}
								onChange={(e) => setNewPass(e.currentTarget.value)}
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
					visible={mode === 'EditOne'}
					onCancel={() => setMode('')}
					onOk={ () =>
					(mode === 'EditOne' ? update(['name', 'middle_name', 'family_name'],[name, middleName, surname], "") : null)
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
							required={true}
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
						<Input allowClear placeholder={name} value={name} onChange={(e) => setName(e.currentTarget.value)} />
						</Form.Item>
						<Form.Item
							name="middleName"
							label="Enter your Middle Name"
							// valuePropName={middleName}
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
							placeholder={middleName}
							value={middleName} 
							onChange={(e) => setMiddleName(e.currentTarget.value)}
							/>
						</Form.Item>
						<Form.Item
							name="surname"
							label="Enter your Surname"
							// valuePropName={surname}
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
							<Input allowClear  placeholder={surname} value={surname}  onChange={(e) => setSurname(e.currentTarget.value)} />
						</Form.Item>
					</Form>
				</Modal>
			)}
		</Fragment>
	);
}
