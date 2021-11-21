import React, { Fragment, useContext, useState } from 'react';
import { Button, Modal, notification, Spin, Tooltip } from 'antd';
import SaveOutlined from '@ant-design/icons/lib/icons/SaveOutlined';
import { COLORS } from '../../CONSTANTS';
import { AppContext } from '../AppContext';
import TextInput from '../form/textinput';
import { Auth } from 'aws-amplify';
import { createContact, updateMobInContact } from '../contactutils';
import Countdown from 'antd/lib/statistic/Countdown';

interface OtpInputProps {
	onClickAction: Function;
	disableButton: boolean;
	action: string;
	email?: any;
	mob?: any;
	im?: any;
	notify?: any;
	cc?: any;
	resendOtp?: Function;
	user?: any;
}

export default function OtpDialogue(props: OtpInputProps) {
	const { validateCaptcha }: any = useContext(AppContext);
	const [ isModalVisible, setIsModalVisible ] = useState<boolean>(false);
	const [ loading, setLoading ] = useState<boolean>(false);
	const [ otp, setOtp ] = useState<any>();
	const [ viewResendOtp, setViewResendOtp ] = useState<boolean>(false);
	const targetTime = Date.now() + 10 * 6000;

	const confirmOtp = async (attr: string) => {
		Auth.verifyCurrentUserAttributeSubmit(attr, otp)
			.then(async () => {
				notification.success({ message: 'Otp Verified Successfully' });
				if (attr === 'phone_number') {
					await Auth.updateUserAttributes(props.user, { phone_number_verified: 'true' });
					await updateMobInContact(props.email, props.mob);
				} else await createContact(props.email, props.mob, props.im, props.notify);
				setLoading(false);
				setIsModalVisible(false);
			})
			.catch((err) => {
				notification.error({ message: 'Wrong Otp ' + err.message });
				setLoading(false);
				setIsModalVisible(true);
			});
	};

	const onFinish = () => {
		setViewResendOtp(true);
	};

	const callResendOtp = () => {
		props.resendOtp && props.resendOtp();
		setViewResendOtp(false);
	};

	const handleOk = () => {
		setLoading(true);
		confirmOtp(props.action);
	};

	const handleCancel = () => {
		setLoading(false);
    setViewResendOtp(false);
		setIsModalVisible(false);
	};

	const showModal = () => {
		setIsModalVisible(true);
	};

	const onClick = () => {
		setLoading(true);
		validateCaptcha(props.action).then(async (success: boolean) => {
			if (!success) return;
			const data = await props.onClickAction();
			setLoading(false);
			if (!data) return;
			showModal();
		});
	};

	return (
		<Fragment>
			<Tooltip title="Save">
				<Button
					type="link"
					style={{ color: COLORS.GREEN }}
					icon={<SaveOutlined />}
					disabled={props.disableButton}
					onClick={onClick}
					loading={loading}
				/>
			</Tooltip>
			<Modal
        centered={true}
				title={'Enter Otp'}
				visible={isModalVisible}
        onCancel={handleCancel}
				footer={[
          <Button type="dashed" key="resend" onClick={callResendOtp}>
            {viewResendOtp 
              ? 'Resend Otp' 
              : <Countdown
                  valueStyle={{ fontSize: '15px', color:COLORS.GREEN}}
                  value={targetTime}
                  format={'ss'}
                  prefix={<><Spin size={'small'} /> Resend otp in</>}
                  suffix={'seconds'}
                  onFinish={onFinish}/>
        }
          </Button>,
					<Button type="link" key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
					<Button type="primary" key="submit" onClick={handleOk} icon={<SaveOutlined />} disabled={!otp} loading={loading}>
						Submit
					</Button>
				]}
			>
				<TextInput pre="Otp" value={otp} changeHandler={setOtp} />
			</Modal>
		</Fragment>
	);
}
