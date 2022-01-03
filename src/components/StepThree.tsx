import React, { Fragment } from 'react';
import { Alert, Checkbox, Form, Row } from 'antd';
import { ROUTES } from '../CONSTANTS';
import { useForm } from 'antd/lib/form/Form';

interface StepThreeProps {
	error: string;
	setNotify: Function;
	setDisable: Function;
}

export default function StepThree({ error, setNotify, setDisable }: StepThreeProps) {
	const [ form ] = useForm();

	const handleFormChange = () => setDisable(form.getFieldError('terms').length > 0 || !form.isFieldTouched('terms'));

	return (
		<Fragment>
			<Row>{error ? <Alert type="error" message={error} /> : null}</Row>
			<Form name="password" form={form} onFieldsChange={handleFormChange} layout="vertical">
				<Form.Item
					name="terms"
					valuePropName="checked"
					rules={[
						{
							validator: (_: any, value: any) =>
								value
									? Promise.resolve()
									: Promise.reject(new Error('Please verify that you agree to the policies'))
						}
					]}
				>
					<Checkbox defaultChecked={true}>
						I accept the{' '}
						<a target="_blank" href={ROUTES.TC} rel="noreferrer">
							Terms & Conditions
						</a>
						,&nbsp;
						<a target="_blank" href={ROUTES.PRIVACY} rel="noreferrer">
							Privacy Policy
						</a>{' '}
						&nbsp;and&nbsp;
						<a target="_blank" href={ROUTES.SECURITY} rel="noreferrer">
							Security Policy
						</a>
					</Checkbox>
				</Form.Item>
			</Form>
			<Checkbox defaultChecked={true} onChange={(e) => (e.target.checked ? setNotify(true) : setNotify(false))}>
				<strong>Get 20% off</strong>&nbsp; by signing up for emails and text
			</Checkbox>
		</Fragment>
	);
}
