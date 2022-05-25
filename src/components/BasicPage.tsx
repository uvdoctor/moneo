import React, { Fragment, useContext, useEffect } from "react";
import { Auth, Hub } from "aws-amplify";
import Head from "next/head";
import BasicLayout from "./BasicLayout";
import { AppContext } from "./AppContext";
import { CognitoUser } from "@aws-amplify/auth";
import { AuthState } from "@aws-amplify/ui-components";
// import { useRouter } from "next/router";
// import { includesAny } from "./utils";

interface BasicPageProps {
  className?: string;
  title: string;
  children: React.ReactNode;
  onBack?: Function | undefined | null;
  fixedNav?: boolean;
  navScrollable?: boolean;
  noFooter?: boolean;
  hideMenu?: boolean;
  secure?: boolean;
  menuTitle?: string;
}

export default function BasicPage(props: BasicPageProps) {
  const { setAppContextLoaded, user, setUser, setUserChecked }: any =
    useContext(AppContext);
  // const router = useRouter();
  const listener = (data: any) => {
    const { payload } = data;
    if (
      payload.message === AuthState.SignedIn &&
      payload.data instanceof CognitoUser
    )
      setUser(payload.data);
  };

  useEffect(() => {
    // if (!props.secure && !includesAny(router.pathname, ["lookup"])) {
    //   setUserChecked(true);
    //   setAppContextLoaded(true);
    //   return;
    // }
    Hub.listen("UI Auth", listener);
    initUser();
    return () => Hub.remove("UI Auth", listener);
  }, []);

  const initUser = async () => {
    if (user) return;
    try {
      const user = await Auth.currentAuthenticatedUser();
      if (user) setUser(user);
    } catch (e) {
      console.log("Unable to authenticate user: ", e);
      setUserChecked(true);
      setAppContextLoaded(true);
    }
  };

  return (
    <Fragment>
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, maximum-scale=2, width=device-width, shrink-to-fit=no, user-scalable=yes, viewport-fit=cover"
        />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta
          name="apple-mobile-web-app-title"
          content="Moneo - Get. Set. Grow."
        />
        <meta name="application-name" content="Moneo" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta
          name="description"
          content="Your family financial coach that champions your goals"
        />
        <meta
          name="Personal finance management app"
          content="Automated Banking, Investing and Financial Planning, Moneo, Finance coach, Money Coach,
Personal finance for Millennial, personal finance advisor, personal finance, Digital Banking, Social Banking, money management apps,
personal finance app, Budget goals, Budgeting,  Mutual Funds, Stock, Equity trading, personal money management, online money management, personal
finance plan, personal finance management, Banking App, Mobile Banking, Budgeting, Financial planning, Investing, Neo Banking Canada, Neo Banking USA, Neo Banking India"
        />
        <meta
          property="og:title"
          content="Moneo - Get &#8594; Set &#8594; Grow"
        />
        <meta
          property="og:description"
          content="
          Hello! 🖐 
          I just signed up for worry-free financial independence! 😄
          Did You? 😎"
        />
        <meta
          property="og:image"
          itemProp="image"
          content="https://moneo.in/images/icons/tlogo256.png"
        />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en-IN" />
        <meta property="og:locale:alternate" content="en-US" />
        <meta property="og:url" content="https://moneo.in" />
        <meta name="twitter:card" content="Your family's financial coach" />
        <meta name="twitter:url" content="https://moneo.in" />
        <meta name="twitter:title" content="Moneo" />
        <meta
          name="twitter:description"
          content="Your family financial coach that champions your goals."
        />
        <meta
          name="twitter:image"
          content="https://moneo.in/images/icons/tlogo192.png"
        />
        <meta name="twitter:creator" content="@moneocoach" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="format-detection" content="telephone=no" />
        <title>{props.title}</title>
      </Head>
      <BasicLayout
        className={props.className}
        onBack={props.onBack}
        fixedNav={props.fixedNav}
        navScrollable={props.navScrollable}
        noFooter={props.noFooter}
        hideMenu={props.hideMenu}
        title={props.menuTitle}
        secure={props.secure}>
        {props.children}
      </BasicLayout>
    </Fragment>
  );
}
