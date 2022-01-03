import React, { Fragment } from 'react';
import { Form, Input } from 'antd';
import { Translations } from '@aws-amplify/ui-components';
import EmailInput from './form/EmailInput';
import { useForm } from 'antd/lib/form/Form';

interface StepOneProps {
	setEmail: Function;
	setPassword: Function;
	emailError: string;
	setDisable: Function;
}

export default function StepOne({ setEmail, setPassword, emailError, setDisable }: StepOneProps) {
	const [ form ] = useForm();

	const handleFormChange = () =>
		setDisable(form.getFieldError('password').length > 0 || !form.isFieldTouched('password'));

	return (
		<Fragment>
			<EmailInput
				setEmail={setEmail}
				label={Translations.EMAIL_LABEL}
				setDisabled={setDisable}
				emailError={emailError}
			/>
			<Form name="password" form={form} onFieldsChange={handleFormChange} layout="vertical">
				<Form.Item
					name="password"
					label={Translations.PASSWORD_LABEL}
					rules={[
						{
							min: 8,
							max: 20,
							message: 'Password must be between 8-20 characters'
						},
						{
							pattern: new RegExp('(?=.*[a-z])'),
							message: 'At least one lowercase'
						},
						{
							pattern: new RegExp('(?=.*[A-Z])'),
							message: 'At least one uppercase'
						},
						{
							pattern: new RegExp('.*[0-9].*'),
							message: 'At least one digit'
						},
						{
							pattern: new RegExp('(?=.*[!@#$%^&*])'),
							message: 'At least one special character'
						}
					]}
					hasFeedback
				>
					<Input.Password allowClear onChange={(e) => setPassword(e.currentTarget.value)} />
				</Form.Item>
			</Form>
		</Fragment>
	);
}
