import React, { useEffect, useContext, Fragment } from 'react';
import { Avatar, Menu } from 'antd';
import { AppContext } from './AppContext';
import { Auth, Hub } from 'aws-amplify';
import { MainMenuProps } from './MainMenu';
import Link from 'next/link';
import { COLORS, ROUTES } from '../CONSTANTS';
import { useRouter } from 'next/router';
import { calcList } from './landing/Calculator';
import { UserOutlined } from '@ant-design/icons';

export default function SecureMenu({ mode = 'horizontal' }: MainMenuProps) {
	const { username, setUsername }: any = useContext(AppContext);
	const router = useRouter();
	const { SubMenu } = Menu;

	const updateUser = (username: string | null) => {
		if (username) {
			localStorage.setItem('username', username);
			setUsername(username);
		} else {
			localStorage.removeItem('username');
			setUsername(null);
		}
	};

	const listener = (capsule: any) => {
		let eventType: string = capsule.payload.event;
		if (eventType === 'signIn') updateUser(capsule.payload.data.username);
		else updateUser(null);
	};

	const getUsername = async () => {
		try {
			let user = await Auth.currentAuthenticatedUser();
			if (user) updateUser(user.username);
		} catch (e) {
			console.log('Error while logging in: ', e);
			updateUser(null);
		}
	};

	useEffect(() => {
		Hub.listen('auth', listener);
		let username = localStorage.getItem('username');
		username ? setUsername(username) : getUsername();
		return () => Hub.remove('auth', listener);
	}, []);

	const handleLogout = async () => {
		try {
			await Auth.signOut();
			Hub.dispatch('auth', { event: 'signOut' });
		} catch (error) {
			console.log('error signing out: ', error);
		} finally {
			router.reload();
		}
	};

	return (
		<Menu mode={mode}>
			<SubMenu title="Calculate">
				{calcList.map(({ name, link }) => (
					<Menu.Item key={name} className="multi-col-submenu">
						<Link href={link}>
							<a>{name}</a>
						</Link>
					</Menu.Item>
				))}
			</SubMenu>
			<Menu.Item>
				<Link href={ROUTES.GET}>
					<a>Get</a>
				</Link>
			</Menu.Item>
			<Menu.Item>
				<Link href={ROUTES.SET}>
					<a>Set</a>
				</Link>
			</Menu.Item>
			<Menu.Item>
				<Link href={ROUTES.SAVE}>
					<a>Save</a>
				</Link>
			</Menu.Item>
			<Menu.Item>
				<Link href={ROUTES.INVEST}>
					<a>Invest</a>
				</Link>
			</Menu.Item>
			{username && (
				<SubMenu
					title={
						<Fragment>
							<Avatar size="small" icon={<UserOutlined />} style={{backgroundColor: COLORS.GREEN}} />
							&nbsp;{username}
						</Fragment>
					}
				>
					<Menu.Item>
						<Link href="#">
							<a>Settings</a>
						</Link>
					</Menu.Item>
					<Menu.Item>
						<Link href={ROUTES.CONTACT_US}>
							<a>Support</a>
						</Link>
					</Menu.Item>
					<Menu.Item onClick={handleLogout}>
							Logout
					</Menu.Item>
				</SubMenu>
			)}
		</Menu>
	);
}
