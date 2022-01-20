import { Button, Col, Row } from 'antd';
import React, { useContext } from 'react';
import { AppContext } from '../AppContext';
import { COLORS } from '../../CONSTANTS';
import { SaveOutlined } from '@ant-design/icons';

interface SaveButtonProps {
	loading?: boolean;
	error?: any;
	onClick: Function;
	action: string;
	disabledForm?: boolean;
}

export default function SaveButton({ loading, error, onClick, action, disabledForm }: SaveButtonProps) {
	const { validateCaptcha }: any = useContext(AppContext);

	return (
		<Row justify="center">
			<Col>
				<Button
					type="primary"
					loading={loading}
					size='middle'
					style={{ color: COLORS.WHITE, background: COLORS.GREEN }}
					icon={<SaveOutlined />}
					disabled={disabledForm ? disabledForm : (error && error.length > 0 ? true : false)}
					onClick={() => {
						validateCaptcha(`${action}_settings`).then((success: boolean) => {
							if (!success) return;
							onClick();
						});
					}}
				>
					Save
				</Button>
			</Col>
		</Row>
	);
}
