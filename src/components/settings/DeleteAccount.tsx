import React, { Fragment, useContext, useState } from 'react';
import { Button, Menu, Modal, notification, Space } from 'antd';
import { AppContext } from '../AppContext';
import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined';
import Text from 'antd/lib/typography/Text';
import TextInput from '../form/textinput';
import Auth from '@aws-amplify/auth';
import { deleteContact } from '../userinfoutils';
import { API, graphqlOperation, Storage } from 'aws-amplify';
import * as mutations from '../../graphql/mutations';
import { getGoalsList } from '../goals/goalutils';
import { getFamilysList } from '../nw/nwutils';

export default function DeleteAccount() {
	const { handleLogout, owner }: any = useContext(AppContext);
	const { validateCaptcha }: any = useContext(AppContext);
	const [ loading, setLoading ] = useState<boolean>(false);
	const [ isModalVisible, setIsModalVisible ] = useState<boolean>(false);
	const [ input, setInput ] = useState<string>('');

	const deleteUserDetails = async (getData: Function, mutation: String, type: String) => {
		const goalImg = [];
		try {
			const listOfData = await getData();
			if (!listOfData) return;
			for (let data of listOfData) {
				if (type === 'Goals') {
					goalImg.push(data.img);
				}
				// @ts-ignore
				await API.graphql(graphqlOperation(mutations[mutation], { input: { id: data.id } }));
			}
			if (goalImg.length) {
				for (let img of goalImg) {
					if (!img) return;
					await Storage.remove(img);
				}
			}
		} catch (e) {
			console.log(`Error while deleting: ${type}`, e);
		}
	};

	const deleteHoldings = async (uname: string, mutation: String, type: String) => {
		try {
			// @ts-ignore
			const result = await API.graphql(graphqlOperation(mutations[mutation], { input: { uname: uname } }));
		} catch (e) {
			console.log(`Error while deleting ${type}: `, e);
		}
	};

	const handleOk = () => {
		setLoading(true);
		if (input === 'delete') {
			try {
				validateCaptcha('delete_change').then(async (success: boolean) => {
					if (!success) return;
					const user = await Auth.currentAuthenticatedUser();
					await deleteUserDetails(getGoalsList, 'deleteGoal', 'Goals');
					await deleteUserDetails(getFamilysList, 'deleteFamily', 'FamilyList');
					await deleteHoldings(owner, 'deleteUserHoldings', 'AllHoldings');
					await deleteHoldings(owner, 'deleteUserIns', 'Instrument Holdings');
					user.attributes.profile ? await Storage.remove(user.attributes.profile) : null;
					await deleteContact(owner);
					user.deleteUser((error: any, data: any) => {
						if (error) {
							console.log(error);
							throw error;
						}
						console.log(data);
						handleLogout();
					});
					notification.success({
						message: 'Deleted sucessfully',
						description: 'Your account will be logged out automatically.'
					});
				});
			} catch (err) {
				notification.error({
					message: 'Unable to delete your account',
					description: `${err}`
				});
			}
		} else {
			notification.error({ message: 'Enter the input correctly' });
		}
		setLoading(false);
	};

	return (
		<Fragment>
			<Menu.Item onClick={() => setIsModalVisible(true)} key="delete">
				Delete Account
			</Menu.Item>
			<Modal
				title={'Delete Account'}
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				okText={'Delete My Account'}
				footer={[
					<Button key="cancel" type="link" onClick={() => setIsModalVisible(false)}>
						Cancel
					</Button>,
					<Button
						key="delete"
						type="primary"
						onClick={handleOk}
						danger
						loading={loading}
						icon={<DeleteOutlined />}
					>
						Delete My Account
					</Button>
				]}
			>
				<Space direction="vertical">
					<Text strong>Are you sure you want to delete this account?</Text>
					<Text>
						This action cannot be undone. This will permanently delete your account and all your data will
						be deleted.
					</Text>
					<Text>
						To confirm deletion, enter{' '}
						<Text italic strong>
							delete
						</Text>
					</Text>
				</Space>
				<TextInput pre={''} value={input} changeHandler={setInput} />
			</Modal>
		</Fragment>
	);
}
