import React, { Fragment, useContext, useState } from "react";
import { Avatar, Menu, Skeleton } from "antd";
import {
  UserOutlined,
  PoweroffOutlined,
  MailOutlined,
  SettingOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { Auth, Hub } from "aws-amplify";
import { calcList } from "./landing/Calculator";
import { COLORS, ROUTES } from "../CONSTANTS";
import { useRouter } from "next/router";
import { menuItem } from "./utils";
import { AppContext } from "./AppContext";
import SocialShare from "./SocialShare";

export interface MainMenuProps {
  mode?: any;
}

export default function MainMenu({ mode = "horizontal" }: MainMenuProps) {
  const { user, userChecked, setUser }: any = useContext(AppContext);
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

  const isPublicCalc = () => {
    for (let calc of calcList) {
      if (calc.link === selectedKey) return true;
    }
    return false;
  };

  return userChecked ? (
    <>
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
            <SubMenu
              key="settingsmenu"
              icon={
                user?.attributes?.picture ? (
                  <Avatar size="large" src={user?.attributes.picture} />
                ) : (
                  <UserOutlined />
                )
              }>
              {menuItem(
                "Settings",
                ROUTES.SETTINGS,
                selectedKey,
                <SettingOutlined />
              )}
              <Menu.Item
                key="logout"
                icon={<PoweroffOutlined style={{ color: COLORS.RED }} />}
                onClick={handleLogout}>
                Logout
              </Menu.Item>
            </SubMenu>
          </Fragment>
        ) : null}
        {menuItem(
          "",
          ROUTES.CONTACT_US,
          selectedKey,
          selectedKey === ROUTES.CONTACT_US ? (
            <Avatar
              size="large"
              icon={<MailOutlined />}
              style={{
                backgroundColor: COLORS.GREEN,
              }}
            />
          ) : (
            <MailOutlined />
          )
        )}
        <SubMenu key="social-share" title="" icon={<ShareAltOutlined />}>
          <Menu.Item>
            <SocialShare nonExpandable />
          </Menu.Item>
        </SubMenu>
      </Menu>
    </>
  ) : (
    <Skeleton active />
  );
}
