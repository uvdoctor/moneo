import React, { Fragment } from "react";
import { Menu, Button } from "antd";
import { calcList } from "./landing/Calculator";
import { ArrowLeftOutlined } from '@ant-design/icons';
import FSToggle from "./FSToggle";

interface DDMenuProps {
	mode?: any;
	onBack?: Function;
}

export default function DDMenu({ mode = "horizontal", onBack }: DDMenuProps) {
	const { SubMenu } = Menu;

	return (
		<Menu mode={mode}>
			<SubMenu title="Calculate">
				{calcList.map(({ name, link }) => (
					<Menu.Item key={name} className="multi-col-submenu">
						<a href={link}>{name}</a>
					</Menu.Item>
				))}
			</SubMenu>
			<SubMenu title="About">
				<Menu.Item>Features</Menu.Item>
				<Menu.Item>Pricing</Menu.Item>
				<Menu.Item>Company</Menu.Item>
			</SubMenu>
			<Menu.Item>
				<a href="https://ant.design" target="_blank" rel="noopener noreferrer">
					Earn up to $200 credit*
				</a>
			</Menu.Item>
			<Menu.Item>
				<FSToggle />
			</Menu.Item>
			{onBack ? <Menu.Item>
				<Button type="text" icon={<ArrowLeftOutlined />} onClick={() => onBack()} />
			</Menu.Item> : <Fragment/>}
		</Menu>
	);
}
