import React, { useContext, useEffect } from "react";
import { Layout, Skeleton } from "antd";
import Nav from "./Nav";
import Footer from "./Footer";
import BasicAuthenticator from "./BasicAuthenticator";
import { AppContext } from "./AppContext";
import { Auth } from "aws-amplify";
import Otp from "./form/Otp";

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
  setVerifyPhone?: Function;
  verifyPhone?: boolean;
}
export default function BasicLayout(props: BasicLayoutProps) {
  const { userChecked, user, userInfo, setUser }: any = useContext(AppContext);

  useEffect(() => {
    if (user && userInfo?.mob && !user?.attributes?.phone_number) {
      (async () =>
        await Auth.updateUserAttributes(user, {
          phone_number: "+" + userInfo.mob,
        }))();
    }
  }, [user, userInfo]);

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
            user?.attributes?.phone_number_verified ? (
            // !user?.attributes?.phone_number_verified ? (
              <Otp
                setVerifyPhone={props.setVerifyPhone}
                action="phone_number"
                mob={userInfo?.mob}
                signupDone={true}
                title="Verify your Phone Number"
              />
            ) : (
              props.children
            )
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
