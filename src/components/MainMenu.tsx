import React, { Fragment, useContext, useState } from 'react';
import { Button, Menu } from 'antd';
import FSToggle from './FSToggle';
import { calcList } from './landing/Calculator';
import Link from 'next/link';
import { ROUTES } from '../CONSTANTS';
import { useRouter } from 'next/router';
import SecureMenu from './SecureMenu';
import { AppContext } from './AppContext';
import { menuItem } from './utils';

export interface MainMenuProps {
	mode?: any;
}

export default function MainMenu({ mode = 'horizontal' }: MainMenuProps) {
	const router = useRouter();
	const { defaultCountry }: any = useContext(AppContext);
	const [ selectedKey, setSelectedKey ] = useState<string>(router.pathname);
	const { SubMenu } = Menu;
	const secureRoutes: Array<string> = [ ROUTES.GET, ROUTES.SET, ROUTES.GROW ];

	return (
		<Fragment>
			<FSToggle />
			{secureRoutes.includes(router.pathname) ? (
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
						</Menu.Item>*/}
					<Menu.Item>
						{defaultCountry === 'IN' ? (
							<Link href={ROUTES.SET}>
								<a>
									<Button type="link">Login</Button>
								</a>
							</Link>
						) : (
							<a href="https://ant.design" target="_blank" rel="noopener noreferrer">
								Earn up to $200 credit*
							</a>
						)}
					</Menu.Item>
				</Menu>
			)}
		</Fragment>
	);
}
