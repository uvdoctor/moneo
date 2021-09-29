import React, { Fragment, useContext, useState } from 'react';
import { Menu } from 'antd';
import FSToggle from './FSToggle';
import { calcList } from './landing/Calculator';
import Link from 'next/link';
import { ROUTES } from '../CONSTANTS';
import { useRouter } from 'next/router';
import SecureMenu from './SecureMenu';
import { menuItem } from './utils';
import { AppContext } from './AppContext';

export interface MainMenuProps {
	mode?: any;
}

export default function MainMenu({ mode = 'horizontal' }: MainMenuProps) {
	const { user, appContextLoaded }: any = useContext(AppContext);
	const router = useRouter();
	const [
		selectedKey,
		setSelectedKey
	] = useState<string>(router.pathname);
	const { SubMenu } = Menu;

	return appContextLoaded ? (
		<Fragment>
			<FSToggle />
			{user ? (
				<SecureMenu mode={mode} />
			) : (
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
					{menuItem('About', ROUTES.ABOUT, selectedKey)}
					{menuItem('Contact Us', ROUTES.CONTACT_US, selectedKey)}
					{/**<Menu.Item>
							<Link href={ROUTES.FEATURES}>
								<a>Features</a>
							</Link>
						</Menu.Item>
					<Menu.Item>
						<Link href={ROUTES.SET}>
							<a>
								<Button type="link">Login</Button>
							</a>
						</Link>
					</Menu.Item>*/}
				</Menu>
			)}
		</Fragment>
	) : null;
}
