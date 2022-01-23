import React, { Fragment, useContext, useState } from "react";
import { Avatar, Menu } from "antd";
import FSToggle from "./FSToggle";
import { calcList } from "./landing/Calculator";
import { COLORS, ROUTES } from "../CONSTANTS";
import { useRouter } from "next/router";
import { menuItem } from "./utils";
import { AppContext } from "./AppContext";
import { UserOutlined, PoweroffOutlined } from "@ant-design/icons";
import { Auth, Hub } from "aws-amplify";
import Link from "next/link";
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

  return userChecked ? (
    <>
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
            <Menu.Item
              key={ROUTES.SETTINGS}
              icon={
                user?.attributes?.picture ? (
                  <Avatar size="large" src={user?.attributes.picture} />
                ) : selectedKey === ROUTES.SETTINGS ? (
                  <Avatar
                    size="large"
                    icon={<UserOutlined />}
                    style={{
                      backgroundColor: COLORS.GREEN,
                    }}
                  />
                ) : (
                  <Avatar
                    size="small"
                    icon={<UserOutlined />}
                    style={{
                      backgroundColor: COLORS.DEFAULT,
                    }}
                  />
                )
              }>
              <Link href={ROUTES.SETTINGS}>
                <a></a>
              </Link>
            </Menu.Item>
            <Menu.Item
              key="logout"
              icon={<PoweroffOutlined style={{ color: COLORS.RED }} />}
              onClick={handleLogout}
            />
          </Fragment>
        ) : (
          <Fragment>
            {menuItem("About", ROUTES.ABOUT, selectedKey)}
            {menuItem("Contact Us", ROUTES.CONTACT_US, selectedKey)}
          </Fragment>
        )}
      </Menu>
    </>
  ) : null;
}
