import React, { Fragment } from "react";
import { Layout } from "antd";
import Nav from "./Nav";
import UserHeader from "./userheader";
import SecureMenu from "./SecureMenu";
import DDFooter from "./DDFooter";
import Head from "next/head";

interface DDBasicPageProps {
  className?: string;
  title: string;
  children: React.ReactNode;
  secure?: boolean;
  onBack?: Function;
  fixedNav?: boolean;
  navScrollable?: boolean;
  noFooter?: boolean;
}

export default function DDBasicPage(props: DDBasicPageProps) {
  return (
    <Fragment>
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta
          name="apple-mobile-web-app-title"
          content="Moneo - Your Money Analyst"
        />
        <meta name="application-name" content="Moneo" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="description" content="Your Money Analyst" />
        <meta
          name="Personal finance management app"
          content="Automated Banking, Investing and Financial Planning, Moneo,
Personal finance for Millennial, personal finance advisor, personal finance, Digital Banking, Social Banking, money management apps,
personal finance app, Budget goals, Budgeting,  Mutual Funds, Stock, Equity trading, personal money management, online money management, personal
finance plan, personal finance management, Banking App, Mobile Banking, Budgeting, Financial planning, Investing, Neo Banking Canada, Neo Banking USA, Neo Banking India"
        />
        <meta
          property="og:title"
          content="Moneo - Your Money Analyst"
        />
        <meta
          property="og:description"
          content="
          Hello! 🖐 
          I just got up to $200 credit for Stress-free Savings & Investments to Meet My Goals! 😄
          Did You? 😎"
        />
        <meta
          property="og:image"
          itemProp="image"
          content="https://gomoneo.com/images/icons/tlogo256.png"
        />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en-US" />
        <meta property="og:locale:alternate" content="en-CA" />
        <meta property="og:url" content="https://gomoneo.com" />
        <meta name="twitter:card" content="Your Money Analyst" />
        <meta name="twitter:url" content="https://gomoneo.com" />
        <meta name="twitter:title" content="Moneo" />
        <meta
          name="twitter:description"
          content="Stress-free Savings & Investments to Meet Your Goals."
        />
        <meta
          name="twitter:image"
          content="https://gomoneo.com/images/icons/tlogo192.png"
        />
        <meta name="twitter:creator" content="@getmoneo" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="format-detection" content="telephone=no" />
        <title>{props.title}</title>
      </Head>
      <Layout className={`dd-site ${props.className}`}>
        {props.secure ? (
          <Fragment>
            <UserHeader />
            <SecureMenu />
          </Fragment>
        ) : (
          <Nav
            scrollable={props.navScrollable}
            isFixed={props.fixedNav}
            onBack={props.onBack}
          />
        )}
        {props.children}
        <DDFooter />
      </Layout>
    </Fragment>
  );
}
