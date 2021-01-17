import React, { Fragment } from 'react';
import { Menu } from 'antd';
import { calcList } from './landing/Calculator';
import FSToggle from './FSToggle';
import Link from 'next/link';
import { ROUTES } from '../CONSTANTS';

interface MainMenuProps {
	mode?: any;
}

export default function MainMenu({ mode = 'horizontal' }: MainMenuProps) {
	const { SubMenu } = Menu;

	return (
		<Fragment>
			<FSToggle />
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
					<Link href={ROUTES.ABOUT}>
						<a>About</a>
					</Link>
				</Menu.Item>
				<Menu.Item>
					<Link href={ROUTES.CONTACT_US}>
						<a>Contact Us</a>
					</Link>
				</Menu.Item>
				<Menu.Item>
					<Link href={ROUTES.FEATURES}>
						<a>Features</a>
					</Link>
				</Menu.Item>
				<Menu.Item>
					<a href="https://ant.design" target="_blank" rel="noopener noreferrer">
						Earn up to $200 credit*
					</a>
				</Menu.Item>
			</Menu>
		</Fragment>
	);
}
