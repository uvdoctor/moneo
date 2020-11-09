import React, { createElement, Fragment, useState } from "react";
import { Layout, Drawer, Button, Affix } from "antd";
import { useScroll } from "react-browser-hooks";
import { MenuOutlined } from "@ant-design/icons";
import DDMenu from "./DDMenu";
import DDLogo from "./DDLogo";

import "./Nav.less";

interface NavProps {
  onBack?: Function;
  isFixed?: boolean;
  scrollable?: boolean;
}

const Nav = ({ onBack, isFixed, scrollable }: NavProps) => {
  const { top } = useScroll();
  const { Header } = Layout;
  const [showDrawer, setShowDrawer] = useState(false);
  const onShowDrawer = () => setShowDrawer(true);
  const onCloseDrawer = () => setShowDrawer(false);

  return createElement(
    scrollable ? Fragment : Affix,
    //@ts-ignore
    scrollable ? {} : { offsetTop: scrollable ? "" : 0 },
    <Header className={`dd-header ${top > 10 || isFixed ? "fixed-nav" : ""}`}>
      <DDLogo onBack={onBack} />
      <DDMenu />
      <Button type="text" onClick={onShowDrawer}>
        <MenuOutlined />
      </Button>
      <Drawer
        placement="right"
        closable
        onClose={onCloseDrawer}
        visible={showDrawer}
      >
        <DDMenu mode="inline" />
      </Drawer>
    </Header>
  );
};

export default Nav;
