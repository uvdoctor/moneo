import React, { createElement, Fragment, useContext, useEffect, useState } from 'react';
import { Layout, Drawer, Button, Affix } from 'antd';
import { useScroll } from 'react-browser-hooks';
import { MenuOutlined } from '@ant-design/icons';
import MainMenu from './MainMenu';
import Logo from './Logo';

import './Nav.less';
import { AppContext } from './AppContext';

interface NavProps {
	onBack?: Function | undefined | null;
	isFixed?: boolean;
	scrollable?: boolean;
}

const Nav = ({ onBack, isFixed, scrollable }: NavProps) => {
	const { setDefaultCountry, setDefaultCurrency }: any = useContext(AppContext);
	const { top } = useScroll();
	const { Header } = Layout;
	const [ showDrawer, setShowDrawer ] = useState(false);
	const onShowDrawer = () => setShowDrawer(true);
	const onCloseDrawer = () => setShowDrawer(false);

	useEffect(() => {
    const host = window.location.hostname;
    alert(host);
		if (host.endsWith('.in')) {
			setDefaultCountry('IN');
			setDefaultCurrency('INR');
		} else if (host.endsWith('.uk')) {
			setDefaultCountry('UK');
			setDefaultCurrency('GBP');
		}
	}, []);

	return createElement(
		scrollable ? Fragment : Affix,
		//@ts-ignore
		scrollable ? {} : { offsetTop: scrollable ? '' : 0 },
		<Header className={`dd-header ${top > 10 || isFixed ? 'fixed-nav' : ''}`}>
			<Logo onBack={onBack} />
			<MainMenu />
			<Button type="text" onClick={onShowDrawer}>
				<MenuOutlined />
			</Button>
			<Drawer placement="right" closable onClose={onCloseDrawer} visible={showDrawer}>
				<MainMenu mode="inline" />
			</Drawer>
		</Header>
	);
};

export default Nav;
