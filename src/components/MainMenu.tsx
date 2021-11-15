import React, { Fragment, useContext, useState } from "react";
import { Avatar, Menu, Row } from "antd";
import FSToggle from "./FSToggle";
import { calcList } from "./landing/Calculator";
import Link from "next/link";
import { COLORS, ROUTES } from "../CONSTANTS";
import { useRouter } from "next/router";
import { menuItem } from "./utils";
import { AppContext } from "./AppContext";
import { UserOutlined } from "@ant-design/icons";
import DeleteAccount from "./settings/DeleteAccount";
export interface MainMenuProps {
  mode?: any;
  hideMenu?: boolean;
  title?: string;
}

export default function MainMenu({
  mode = "horizontal",
  hideMenu,
  title,
}: MainMenuProps) {
  const { user, appContextLoaded, handleLogout }: any = useContext(AppContext);
  const router = useRouter();
  const [selectedKey, setSelectedKey] = useState<string>(router.pathname);
  const { SubMenu } = Menu;

  return hideMenu ? 
        <>
          <FSToggle />
          {title && 
              <Row justify="center">
                <h2>
                  <strong>{title}</strong>
                </h2>
              </Row>}
        </>
  : appContextLoaded ? (
    <Fragment>
          <FSToggle />
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
            {user ? (
              <Fragment>
                {menuItem("Get", ROUTES.GET, selectedKey)}
                {menuItem("Set", ROUTES.SET, selectedKey)}
                {menuItem("Grow", ROUTES.GROW, selectedKey)}
                {menuItem("Contact Us", ROUTES.CONTACT_US, selectedKey)}
                <SubMenu
                  title={
                    <Fragment>
                      {user?.attributes.picture ? (
                        <Avatar size="large" src={user?.attributes.picture} />
                      ) : (
                        <Avatar
                          size="small"
                          icon={<UserOutlined />}
                          style={{ backgroundColor: COLORS.GREEN }}
                        />
                      )}
                      &nbsp;
                      {user?.attributes.name
                        ? user?.attributes.name 
                        : user?.attributes.preferred_username ? user?.attributes.preferred_username : user.username}
                    </Fragment>
                  }
                >
                  {menuItem("Settings", ROUTES.SETTINGS, selectedKey)}
                  <DeleteAccount/> 
                  <Menu.Item key='logout' onClick={handleLogout}>Logout</Menu.Item>
                </SubMenu>
              </Fragment>
            ) : (
              <Fragment>
                {menuItem("About", ROUTES.ABOUT, selectedKey)}
                {menuItem("Contact Us", ROUTES.CONTACT_US, selectedKey)}
              </Fragment>
            )}
            {/**<Menu.Item>
                <Link href={ROUTES.FEATURES}>
                    <a>Features</a>
                </Link>
            </Menu.Item>
        */}
          </Menu>
    </Fragment>
  ) : null;
}
