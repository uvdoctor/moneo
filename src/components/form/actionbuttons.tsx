import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { Space } from "antd";
import { CloseCircleOutlined, SaveOutlined } from "@ant-design/icons";
interface ActionButtonsProps {
	submitDisabled: boolean;
	cancelDisabled: boolean;
	submitText: string;
	cancelHandler: Function;
	submitHandler: Function;
}

export default function ActionButtons(props: ActionButtonsProps) {
	const [ actionInProgress, setActionInProgress ] = useState<boolean>(false);

	useEffect(
		() => {
			if (!props.submitDisabled) setActionInProgress(false);
		},
		[ props.submitDisabled ]
	);

	return (
		<Space align="center">
			<Button icon={<CloseCircleOutlined />} onClick={() => props.cancelHandler()} disabled={props.cancelDisabled}>
				Cancel
			</Button>
			<Button type="primary"
				onClick={() => {
					setActionInProgress(true);
					props.submitHandler();
				}}
				icon={<SaveOutlined />}
				disabled={props.submitDisabled}
				loading={props.submitDisabled && actionInProgress}
			>
				{props.submitText}
			</Button>
		</Space>
	);
}
