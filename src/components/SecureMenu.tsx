import React, { useEffect, useContext } from 'react';
import { Button, Menu } from 'antd';
import { AppContext } from './AppContext';
import { Auth, Hub } from 'aws-amplify';
import { MainMenuProps } from './MainMenu';
import Link from 'next/link';
import { ROUTES } from '../CONSTANTS';
import { useRouter } from 'next/router';
import SVGOff from './svgoff';

export default function SecureMenu({ mode = 'horizontal' }: MainMenuProps) {
	const { username, setUsername }: any = useContext(AppContext);
	const router = useRouter();

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
		<Menu mode={mode}>
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
			{username && <Button type="link" danger icon={<SVGOff />} onClick={(e) => handleLogout(e)} />}
		</Menu>
	);
}
