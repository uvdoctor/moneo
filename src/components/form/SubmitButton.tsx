import React, { useContext } from 'react';
import { Button, Row } from 'antd';
import { SaveOutlined } from "@ant-design/icons";
import { GoalContext } from '../goals/GoalContext';

export default function SubmitButton() {
	const { handleSubmit, disableSubmit }: any = useContext(GoalContext);

	return (
		<Row justify="center">
			<Button type="primary"
				onClick={() => handleSubmit()}
				icon={<SaveOutlined />}
				disabled={disableSubmit}
				loading={disableSubmit}
			>
				Save
			</Button>
		</Row>
	);
}
