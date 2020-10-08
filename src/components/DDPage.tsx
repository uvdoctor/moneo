import React, { Fragment } from "react";
import { ParallaxProvider } from "react-scroll-parallax";
import { Layout, Menu } from "antd";
import UserHeader from "./userheader";
import Logo from "../components/Logo";
import SecureMenu from "./SecureMenu";
import { isMobileDevice } from "./utils";
import { useFullScreenBrowser } from "react-browser-hooks";
import Head from "next/head";

interface DDPageProps {
  title: string;
  children: React.ReactNode;
  secure?: boolean;
}

export default function DDPage(props: DDPageProps) {
  const { Header, Footer, Content } = Layout;
  const { SubMenu } = Menu;
  const commonSecureComps: Array<React.ReactNode> = [
    <UserHeader />,
    <SecureMenu />,
  ];
  const commonPublicComps: Array<React.ReactNode> = [];

  const getCommonComps = () =>
    props.secure ? commonSecureComps : commonPublicComps;

  const fsb = useFullScreenBrowser();

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
          content="DollarDarwin - Your Financial Analyst"
        />
        <meta name="application-name" content="DollarDarwin" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="description" content="Your Financial Analyst" />
        <meta
          name="Personal finance management app"
          content="Automated Banking, Investing and Financial Planning, Stack,
Personal finance for Millennial, personal finance advisor, personal finance, Digital Banking, Social Banking, money management apps,
personal finance app, Budget goals, Budgeting,  Mutual Funds, Stock, Equity trading, personal money management, online money management, personal
finance plan, personal finance management, Banking App, Mobile Banking, Budgeting, Financial planning, Investing, Neo Banking Canada, Neo Banking USA"
        />
        <meta
          property="og:title"
          content="DollarDarwin - Your Financial Analyst"
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
          content="https://dollardarwin.com/images/icons/tlogo256.png"
        />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en-US" />
        <meta property="og:locale:alternate" content="en-CA" />
        <meta property="og:url" content="https://dollardarwin.com" />
        <meta name="twitter:card" content="Your Financial Analyst" />
        <meta name="twitter:url" content="https://dollardarwin.com" />
        <meta name="twitter:title" content="DollarDarwin" />
        <meta
          name="twitter:description"
          content="Stress-free Savings & Investments to Meet Your Goals."
        />
        <meta
          name="twitter:image"
          content="https://dollardarwin.com/images/icons/tlogo192.png"
        />
        <meta name="twitter:creator" content="@dollardarwin" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="format-detection" content="telephone=no" />
        <title>{props.title}</title>
      </Head>
      <Layout>
        <Header className="dd-header">
          <Logo />
          <Menu mode="horizontal">
            <Menu.Item key="mail">Calculate</Menu.Item>
            <SubMenu key="SubMenu" title="About">
              <Menu.Item key="setting:1">Features</Menu.Item>
              <Menu.Item key="setting:2">Pricing</Menu.Item>
              <Menu.Item key="setting:2">Company</Menu.Item>
            </SubMenu>
            <Menu.Item key="alipay">
              <a
                href="https://ant.design"
                target="_blank"
                rel="noopener noreferrer"
              >
                Earn up to $200 credit*
              </a>
            </Menu.Item>
          </Menu>
        </Header>
        <Content className="dd-content">
          {!isMobileDevice(fsb) ? (
            <ParallaxProvider>
              {getCommonComps().map((child) => child)}
              {props.children}
            </ParallaxProvider>
          ) : (
            <Fragment>
              {getCommonComps().map((child) => child)}
              {props.children}
            </Fragment>
          )}
        </Content>
        <Footer>Footer</Footer>
      </Layout>
    </Fragment>
  );
}
