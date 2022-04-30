import { Form, Input } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React from 'react';

interface EmailInputProps {
	setEmail: Function;
	label: string;
	emailError?: string;
}

export default function EmailInput({ setEmail, label, emailError }: EmailInputProps) {
	const [ form ] = useForm();

	return (
		<Form name="emailChange" layout="vertical" form={form}>
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
