import React, { useEffect, useState, Fragment } from 'react';
import { Button, Menu } from 'antd';
import FSToggle from './FSToggle';
import { calcList } from './landing/Calculator';
import Link from 'next/link';
import { ROUTES } from '../CONSTANTS';
import { Auth, Hub } from 'aws-amplify';
import { useRouter } from 'next/router';
import SVGOff from './svgoff';

interface MainMenuProps {
	mode?: any;
}

export default function MainMenu({ mode = 'horizontal' }: MainMenuProps) {
	const { SubMenu } = Menu;
	const [ username, setUsername ] = useState<string | null>(null);
	const router = useRouter();
	const secureRoutes: Array<string> = [
		ROUTES.GET,
		ROUTES.SET,
		ROUTES.SAVE,
		ROUTES.INVEST
	];

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

	const handleLogout = async (e: any) => {
		e.preventDefault();
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
		<Fragment>
			<FSToggle />
			<Menu mode={mode}>
				{username && secureRoutes.includes(router.pathname) ? (
					<Fragment>
						<Menu.Item>
							<Link href={ROUTES.GET}>
								<a>GET</a>
							</Link>
						</Menu.Item>
						<Menu.Item>
							<Link href={ROUTES.SET}>
								<a>SET</a>
							</Link>
						</Menu.Item>
						<Menu.Item>
							<Link href={ROUTES.SAVE}>
								<a>SAVE</a>
							</Link>
						</Menu.Item>
						<Menu.Item>
							<Link href={ROUTES.INVEST}>
								<a>INVEST</a>
							</Link>
						</Menu.Item>
						<Button type="link" danger icon={<SVGOff />} onClick={(e) => handleLogout(e)} />
					</Fragment>
				) : (
					<Fragment>
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
					</Fragment>
				)}
			</Menu>
		</Fragment>
	);
}
