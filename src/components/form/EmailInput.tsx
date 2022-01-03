import { Form, Input } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React from 'react';

interface EmailInputProps {
	setEmail: Function;
	label: string;
	emailError?: string;
	setDisabled: Function;
}

export default function EmailInput({ setEmail, label, emailError, setDisabled }: EmailInputProps) {
	const [ form ] = useForm();
	const handleFormChange = () => {
		setDisabled(
			form.getFieldError('email').length > 0 ||
				!form.isFieldTouched('email') ||
				form.getFieldValue('email').length === 0
		);
	};

	return (
		<Form name="emailChange" layout="vertical" form={form} onFieldsChange={handleFormChange}>
			<Form.Item
				name="email"
				label={label}
				validateStatus={emailError ? 'error' : undefined}
				help={emailError ? emailError : null}
				rules={[
					{
						pattern: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
						message: 'This is not a valid email address'
					}
				]}
				hasFeedback
			>
				<Input onChange={(e) => setEmail(e.currentTarget.value)} />
			</Form.Item>
		</Form>
	);
}
