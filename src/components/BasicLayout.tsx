import React from 'react';
import { Layout } from 'antd';
import Nav from './Nav';
import Footer from './Footer';

interface BasicLayoutProps {
	className?: string;
	children: React.ReactNode;
	onBack?: Function | undefined | null;
	fixedNav?: boolean;
	navScrollable?: boolean;
	noFooter?: boolean;
	hideMenu?: boolean;
	title?: string;
}

export default function BasicLayout(props: BasicLayoutProps) {
	return (
		<Layout className={`dd-site ${props.className}`}>
			<Nav
				scrollable={props.navScrollable ? props.navScrollable : false}
				isFixed={props.fixedNav ? props.fixedNav : false}
				onBack={props.onBack}
				hideMenu={props.hideMenu}
				title={props.title}
			/>
			{props.children}
			{!props.noFooter && <Footer />}
		</Layout>
	);
}
