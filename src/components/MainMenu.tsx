import React, { Fragment, useContext, useState } from "react";
import { Avatar, Menu, Skeleton } from "antd";
import FSToggle from "./FSToggle";
import { calcList } from "./landing/Calculator";
import { COLORS, ROUTES } from "../CONSTANTS";
import { useRouter } from "next/router";
import { menuItem } from "./utils";
import { AppContext } from "./AppContext";
import {
  UserOutlined,
  PoweroffOutlined,
  MailOutlined,
  CalculatorOutlined,
} from "@ant-design/icons";
import { Auth, Hub } from "aws-amplify";
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
        <SubMenu
          key="calcs"
          title=""
          icon={
            isPublicCalc() ? (
              <Avatar
                size="large"
                icon={<CalculatorOutlined />}
                style={{ backgroundColor: COLORS.GREEN }}
              />
            ) : (
              <CalculatorOutlined />
            )
          }
        >
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
            {menuItem(
              "",
              ROUTES.SETTINGS,
              selectedKey,
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
                <UserOutlined />
              )
            )}
            <Menu.Item
              key="logout"
              icon={<PoweroffOutlined style={{ color: COLORS.RED }} />}
              onClick={handleLogout}
            />
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
      </Menu>
    </>
  ) : (
    <Skeleton active />
  );
}
