import React from "react";
import { Menu } from "antd";
import { calcList } from "./landing/Calculator";
import FSToggle from "./FSToggle";

interface DDMenuProps {
	mode?: any;
}

export default function DDMenu({ mode = "horizontal" }: DDMenuProps) {
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
		</Menu>
	);
}
