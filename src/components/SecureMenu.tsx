import React, { useContext, Fragment, useState } from 'react';
import { Avatar, Menu } from 'antd';
import { AppContext } from './AppContext';
import { Auth, Hub } from 'aws-amplify';
import { MainMenuProps } from './MainMenu';
import Link from 'next/link';
import { COLORS, ROUTES } from '../CONSTANTS';
import { useRouter } from 'next/router';
import { calcList } from './landing/Calculator';
import { UserOutlined } from '@ant-design/icons';
import { menuItem } from './utils';

export default function SecureMenu({ mode = 'horizontal' }: MainMenuProps) {
	const router = useRouter();
	const { user }: any = useContext(AppContext);
	const [ selectedKey, setSelectedKey ] = useState<string>(router.pathname);
	const { SubMenu } = Menu;

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
		<Menu mode={mode} onSelect={(info: any) => setSelectedKey(info.key)}>
			<SubMenu title="Calculate">
				{calcList.map(({ name, link }) => (
					<Menu.Item key={name} className="multi-col-submenu">
						<Link href={link}>
							<a>{name}</a>
						</Link>
					</Menu.Item>
				))}
			</SubMenu>
			{menuItem('Get', ROUTES.GET, selectedKey)}
			{menuItem('Set', ROUTES.SET, selectedKey)}
			{menuItem('Grow', ROUTES.GROW, selectedKey)}
			{user && (
				<SubMenu
					title={
						<Fragment>
							<Avatar size="small" icon={<UserOutlined />} style={{ backgroundColor: COLORS.GREEN }} />
							&nbsp;{user.username}
						</Fragment>
					}
				>
					{menuItem('Settings', ROUTES.SETTINGS, selectedKey)}
					{menuItem('Support', ROUTES.CONTACT_US, selectedKey)}
					<Menu.Item onClick={handleLogout}>Logout</Menu.Item>
				</SubMenu>
			)}
		</Menu>
	);
}
