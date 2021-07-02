import React, { Fragment } from "react";
import { Layout } from "antd";
import Nav from "./Nav";
import Footer from "./Footer";
import Head from "next/head";
import { AppContextProvider } from "./AppContext";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

interface BasicPageProps {
  className?: string;
  title: string;
  children: React.ReactNode;
  onBack?: Function | undefined | null;
  fixedNav?: boolean;
  navScrollable?: boolean;
  noFooter?: boolean;
}

export default function BasicPage(props: BasicPageProps) {
  const RECAPTCHA_CLIENT_TOKEN = "6LdTyd8ZAAAAAHZqurv84AUu_qsMvb_j9V3W_8WP";
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
          content="Moneo - Your Money Coach"
        />
        <meta name="application-name" content="Moneo" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="description" content="Your Money Coach" />
        <meta
          name="Personal finance management app"
          content="Automated Banking, Investing and Financial Planning, Moneo, Finance coach, Money Coach,
Personal finance for Millennial, personal finance advisor, personal finance, Digital Banking, Social Banking, money management apps,
personal finance app, Budget goals, Budgeting,  Mutual Funds, Stock, Equity trading, personal money management, online money management, personal
finance plan, personal finance management, Banking App, Mobile Banking, Budgeting, Financial planning, Investing, Neo Banking Canada, Neo Banking USA, Neo Banking India"
        />
        <meta property="og:title" content="Moneo - Your Money Coach" />
        <meta
          property="og:description"
          content="
          Hello! 🖐 
          I just got up to $200 credit for Stress-free Financial Independence and Achieving My Goals! 😄
          Did You? 😎"
        />
        <meta
          property="og:image"
          itemProp="image"
          content="https://moneo.money/images/icons/tlogo256.png"
        />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en-US" />
        <meta property="og:locale:alternate" content="en-CA" />
        <meta property="og:url" content="https://moneo.money" />
        <meta name="twitter:card" content="Your Money Coach" />
        <meta name="twitter:url" content="https://moneo.money" />
        <meta name="twitter:title" content="Moneo" />
        <meta
          name="twitter:description"
          content="Your Money Coach for Stress-free Financial Independence & Achieving Goals."
        />
        <meta
          name="twitter:image"
          content="https://moneo.money/images/icons/tlogo192.png"
        />
        <meta name="twitter:creator" content="@moneocoach" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="format-detection" content="telephone=no" />
        <title>{props.title}</title>
      </Head>
      <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_CLIENT_TOKEN}>
        <AppContextProvider>
          <Layout className={`dd-site ${props.className}`}>
            <Nav
              scrollable={props.navScrollable ? props.navScrollable : false}
              isFixed={props.fixedNav ? props.fixedNav : false}
              onBack={props.onBack}
            />
            {props.children}
            <Footer />
          </Layout>
        </AppContextProvider>
      </GoogleReCaptchaProvider>
    </Fragment>
  );
}
