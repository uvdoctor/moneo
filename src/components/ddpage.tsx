import React, { Fragment } from "react";
import { ParallaxProvider } from "react-scroll-parallax";
import { ToastContainer } from "react-toastify";
import UserHeader from "./userheader";
import UserMenu from "./usermenu";
import { isMobileDevice } from "./utils";
import { useFullScreenBrowser } from "react-browser-hooks";
import Head from "next/head";

interface DDPageProps {
  title: string;
  children: React.ReactNode;
  secure?: boolean;
}

export default function DDPage(props: DDPageProps) {
  const commonSecureComps: Array<React.ReactNode> = [
    <UserHeader />,
    <UserMenu />,
  ];
  const commonPublicComps: Array<React.ReactNode> = [];

  const getCommonComps = () =>
    props.secure ? commonSecureComps : commonPublicComps;

  const fsb = useFullScreenBrowser();

  return (
    <Fragment>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Your Financial Analyst" />
        <meta
          name="Personal finance management app"
          content="Automated Banking, Investing and Financial Planning, Stack,
Personal finance for Millennial, personal finance advisor, personal finance, Digital Banking, Social Banking, money management apps,
personal finance app, Budget goals, Budgeting,  Mutual Funds, Stock, Equity trading, personal money management, online money management, personal
finance plan, personal finance management, Banking App, Mobile Banking, Budgeting, Financial planning, Investing, Neo Banking Canada, Neo Banking USA"
        ></meta>
        <meta property="og:title" content="DollarDarwin - Your Financial Analyst" />
        <meta
          property="og:description"
          content="
          Hello! 🖐 

          I just got FREE 60 days offer for Stress-free Savings & Investments! 😄

          Get Yours Soon! 😎"
        />
        <meta
          property="og:image" itemProp="image"
          content="https://dollardarwin.com/images/icons/tlogo256.png"
        />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en-US" />
        <meta property="og:locale:alternate"  content="en-CA" />
        <meta property="og:url" content="https://dollardarwin.com" />
        <title>{props.title}</title>
      </Head>
      <main>
        <div className="text-lg">
          <ToastContainer />
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
        </div>
      </main>
    </Fragment>
  );
}
