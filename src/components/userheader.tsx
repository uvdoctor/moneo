import React, { Fragment, useEffect, useState } from 'react';
import Logo from './Logo';
import SVGOff from './svgoff';
import { Auth, Hub } from 'aws-amplify';
import { useRouter } from 'next/router';
import FullScreen from './fullscreen';
import { Layout, Affix, Menu, Button } from 'antd';
import { useScroll } from 'react-browser-hooks';

const UserHeader = () => {
	const [ username, setUsername ] = useState<string | null>(null);
	const router = useRouter();
	const { top } = useScroll();
	const { Header } = Layout;

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
		<Affix offsetTop={0}>
			<Header className={`dd-header ${top > 10 ? 'fixed-nav' : ''}`}>
				<Logo />
				<Menu mode="horizontal">
					<label>Estimates. No Advice.</label>
					{username ? (
						<Fragment>
                <Button type="link" icon={<FullScreen />}>
                </Button>
								<Button type="link" danger icon={<SVGOff />} onClick={(e) => handleLogout(e)}>
								</Button>
						</Fragment>
					) : (
						<label>DollarDarwin</label>
					)}
				</Menu>
			</Header>
		</Affix>
	);
};

export default UserHeader;
