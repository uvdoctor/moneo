import React, { useContext, useState, useEffect, useRef } from "react";
import { Input, Select, Button, Form, Alert, Space } from "antd";
import { FormInstance } from "antd/lib/form";
import { JoinContext } from "./JoinContext";
import countriesList from "../countriesList";

import "./Join.less";
import { Status } from "../../api/goals";

export default function Join() {
	const {
		email,
		error,
		status,
		country,
		isLoading,
		onFormSubmit,
		setShowVerifyModal,
	}: any = useContext(JoinContext);
	const { Option } = Select;
	const [form] = Form.useForm();
	const formRef = useRef<FormInstance>(null);
	const [showJoinForm, setJoinForm] = useState(true);

	useEffect(() => {
		if (formRef.current) {
			formRef.current.setFieldsValue({ email, country });
		}
	}, [email, country]);

	useEffect(() => {
		if (status === "Y" || status === "P") setJoinForm(false);
	}, [status]);

	return (
		<div className="dd-join">
			{!showJoinForm && (
				<Space>
					<Button type="primary" onClick={() => setJoinForm(true)}>
						Use another account
					</Button>
					{status === "P" && (
						<Button onClick={() => setShowVerifyModal(true)}>
							Verify security code
						</Button>
					)}
				</Space>
			)}
			{showJoinForm && (
				<Form
					form={form}
					ref={formRef}
					name="join"
					layout="inline"
					onFinish={onFormSubmit}
				>
					<Form.Item
						name="country"
						rules={[
							{
								type: "string",
								required: true,
								message: "Please select your country",
							},
						]}
					>
						<Select placeholder="Country" showSearch>
							{countriesList.map(({ name, code }) => (
								<Option key={code} value={code}>
									{name}
								</Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item
						name="email"
						rules={[
							{
								required: true,
								type: "email",
								message: "Please enter valid email address!",
							},
						]}
					>
						<Input placeholder="Enter email address" />
					</Form.Item>
					<Form.Item shouldUpdate={true}>
						{() => (
							<Button
								type="primary"
								htmlType="submit"
								disabled={
									!form.isFieldsTouched(true) ||
									form.getFieldsError().filter(({ errors }) => errors.length)
										.length > 0
								}
								loading={isLoading}
							>
								Join
							</Button>
						)}
					</Form.Item>
					<Form.Item>
						{status !== Status.N && (
							<Button onClick={() => setJoinForm(false)}>Cancel</Button>
						)}
					</Form.Item>
				</Form>
			)}

			{error.message && (
				<Alert message={error.message} type={error.type || "error"} showIcon />
			)}
		</div>
	);
}
