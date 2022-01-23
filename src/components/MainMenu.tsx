import React, { Fragment, useContext, useState } from "react";
import { Avatar, Menu, Row } from "antd";
import FSToggle from "./FSToggle";
import { calcList } from "./landing/Calculator";
import { COLORS, ROUTES } from "../CONSTANTS";
import { useRouter } from "next/router";
import { menuItem } from "./utils";
import { AppContext } from "./AppContext";
import {
  UserOutlined,
  PoweroffOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Auth, Hub } from "aws-amplify";
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
  const { user, appContextLoaded, setUser, owner }: any =
    useContext(AppContext);
  const router = useRouter();
  const [selectedKey, setSelectedKey] = useState<string>(router.pathname);
  const { SubMenu } = Menu;

  const handleLogout = async () => {
    try {
      await Auth.signOut();
      Hub.dispatch("auth", { event: "signOut" });
      setUser(null);
    } catch (error) {
      console.log("error signing out: ", error);
    }
  };

  return hideMenu ? (
    <>
      <FSToggle />
      {title && (
        <Row justify="center">
          <h2>
            <strong>{title}</strong>
          </h2>
        </Row>
      )}
    </>
  ) : appContextLoaded ? (
    <Fragment>
      <FSToggle />
      <Menu mode={mode} onSelect={(info: any) => setSelectedKey(info.key)}>
        <SubMenu key="calcs" title="Calculate">
          {calcList.map(({ name, link }, index: number) =>
            menuItem(name, link, selectedKey, null, link + index, true)
          )}
        </SubMenu>
        {user ? (
          <Fragment>
            {menuItem("Get", ROUTES.GET, selectedKey)}
            {menuItem("Set", ROUTES.SET, selectedKey)}
            <Menu.Item key="Grow" disabled>
              Grow
            </Menu.Item>
            {menuItem("Contact Us", ROUTES.CONTACT_US, selectedKey)}
            <SubMenu
              key="usermenu"
              title={
                <Fragment>
                  {user?.attributes?.picture ? (
                    <Avatar size="large" src={user?.attributes.picture} />
                  ) : (
                    <Avatar
                      size="small"
                      icon={<UserOutlined />}
                      style={{ backgroundColor: COLORS.GREEN }}
                    />
                  )}
                  &nbsp;
                  {user && user?.attributes?.name
                    ? user?.attributes.name
                    : user?.attributes?.preferred_username
                    ? user?.attributes.preferred_username
                    : owner}
                </Fragment>
              }>
              {menuItem(
                "Settings",
                ROUTES.SETTINGS,
                selectedKey,
                <SettingOutlined />
              )}
              <Menu.Item key="logout" onClick={handleLogout}>
                <PoweroffOutlined style={{ color: COLORS.RED }} />
                &nbsp;Logout
              </Menu.Item>
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
