import React, { useContext } from "react";
import { Layout, Skeleton } from "antd";
import Nav from "./Nav";
import Footer from "./Footer";
import BasicAuthenticator from "./BasicAuthenticator";
import { AppContext } from "./AppContext";

interface BasicLayoutProps {
  className?: string;
  children: React.ReactNode;
  onBack?: Function | undefined | null;
  fixedNav?: boolean;
  navScrollable?: boolean;
  noFooter?: boolean;
  hideMenu?: boolean;
  title?: string;
  secure?: boolean;
}

export default function BasicLayout(props: BasicLayoutProps) {
  const { userChecked, user }: any = useContext(AppContext);
  return (
    <Layout className={`dd-site ${props.className}`}>
      <Nav
        scrollable={props.navScrollable ? props.navScrollable : false}
        isFixed={props.fixedNav ? props.fixedNav : false}
        onBack={props.onBack}
        hideMenu={props.hideMenu}
        title={props.title}
      />
      {props.secure ? (
        userChecked ? (
          user ? (
            props.children
          ) : (
            <BasicAuthenticator>{props.children}</BasicAuthenticator>
          )
        ) : (
          <Skeleton active />
        )
      ) : (
        props.children
      )}
      {!props.secure && !props.noFooter && <Footer />}
    </Layout>
  );
}
