import React, { useState } from 'react';
import { Layout, Drawer, Button, Affix } from 'antd';
import { useScroll } from 'react-browser-hooks';
import { MenuOutlined } from '@ant-design/icons';
import DDMenu from './DDMenu';
import Logo from './Logo';

import './Nav.less';

interface NavProps {
	onBack?: Function;
}

const Nav = ({ onBack }: NavProps) => {
	const { top } = useScroll();
	const { Header } = Layout;
	const [ showDrawer, setShowDrawer ] = useState(false);
	const onShowDrawer = () => setShowDrawer(true);
	const onCloseDrawer = () => setShowDrawer(false);

	return (
		<Affix offsetTop={0}>
			<Header className={`dd-header ${top > 10 ? 'fixed-nav' : ''}`}>
				<Logo onBack={onBack} />
				<DDMenu />
				<Button type="text" onClick={onShowDrawer}>
					<MenuOutlined />
				</Button>
				<Drawer placement="right" closable onClose={onCloseDrawer} visible={showDrawer}>
					<DDMenu mode="inline" />
				</Drawer>
			</Header>
		</Affix>
	);
};

export default Nav;
