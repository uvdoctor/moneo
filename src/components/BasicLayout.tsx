import React from "react";
import { Layout } from "antd";
import Nav from "./Nav";
import Footer from "./Footer";
import { AppContextProvider } from "./AppContext";

interface BasicLayoutProps {
  className?: string;
  children: React.ReactNode;
  onBack?: Function | undefined | null;
  fixedNav?: boolean;
  navScrollable?: boolean;
  noFooter?: boolean;
  hideMenu?: boolean;
  hidMenuTitle?: string;
}

export default function BasicLayout(props: BasicLayoutProps) {
  return (
    <AppContextProvider>
      <Layout className={`dd-site ${props.className}`}>
        <Nav
          scrollable={props.navScrollable ? props.navScrollable : false}
          isFixed={props.fixedNav ? props.fixedNav : false}
          onBack={props.onBack}
          hideMenu={props.hideMenu}
          hidMenuTitle={props.hidMenuTitle}
        />
        {props.children}
        {!props.noFooter && <Footer />}
      </Layout>
    </AppContextProvider>
  );
}
