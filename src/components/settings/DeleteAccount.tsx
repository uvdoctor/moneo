import React, { Fragment, useContext, useState } from 'react';
import { Button, Menu, Modal, notification, Space } from 'antd';
import { AppContext } from '../AppContext';
import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined';
import Text from 'antd/lib/typography/Text';
import TextInput from '../form/textinput';
import Auth from '@aws-amplify/auth';
import { deleteContact } from '../registrationutils';
import { GoalContext } from '../goals/GoalContext';
import { API, graphqlOperation, Storage } from 'aws-amplify';
import * as mutations from '../../graphql/mutations';
import { getGoalsList } from '../goals/goalutils';
import { getFamilysList, loadHoldings } from '../nw/nwutils';

export default function DeleteAccount() {
	const { handleLogout }: any = useContext(AppContext);
	const { goalImgKey }: any = useContext(GoalContext);
	const { validateCaptcha }: any = useContext(AppContext);
	const [ loading, setLoading ] = useState<boolean>(false);
	const [ isModalVisible, setIsModalVisible ] = useState<boolean>(false);
	const [ input, setInput ] = useState<string>('');

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	const showModal = () => {
		setIsModalVisible(true);
	};

	const deleteGoal = async () => {
		try {
			const goalList = await getGoalsList();
			if (goalList) {
				for (const goal of goalList) {
					const result = await API.graphql(
						graphqlOperation(mutations.deleteGoal, { input: { id: goal.id } })
					);
					console.log(result);
				}
			}
		} catch (e) {
			console.log('Error while deleting: ', e);
		}
	};

	const deleteFamilyList = async () => {
		try {
			const familyList = await getFamilysList();
			if (familyList) {
				for (const family of familyList) {
					const result = await API.graphql(
						graphqlOperation(mutations.deleteFamily, { input: { id: family.id } })
					);
					console.log(result);
				}
			}
		} catch (e) {
			console.log('Error while deleting: ', e);
		}
	};

	const deleteHoldings = async () => {
		try {
			const holdings = await loadHoldings();
			if (holdings) {
				const result = await API.graphql(
					graphqlOperation(mutations.deleteHoldings, { input: { id: holdings.id } })
				);
				console.log(result);
			}
		} catch (e) {
			console.log('Error while deleting: ', e);
		}
	};

	const handleOk = () => {
		setLoading(true);
		if (input === 'delete') {
			try {
				validateCaptcha('delete_change').then(async (success: boolean) => {
					if (!success) return;
					const user = await Auth.currentAuthenticatedUser();
					await deleteGoal();
					await deleteHoldings();
					await deleteFamilyList();
					user.attributes.profile ? await Storage.remove(user.attributes.profile) : null;
					goalImgKey ? await Storage.remove(goalImgKey) : null;
					await deleteContact(user.attributes.email);
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
			<Menu.Item onClick={showModal} key='delete'>Delete Account</Menu.Item>
			<Modal
				title={'Delete Account'}
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				okText={'Delete My Account'}
				footer={[
					<Button key="cancel" type="link" onClick={handleCancel}>
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
