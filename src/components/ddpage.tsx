import Head from "next/head";
import React, { Fragment } from "react";
import { ParallaxProvider } from "react-scroll-parallax";
import { isMobileDevice } from "./utils";
import { useFullScreenBrowser } from "react-browser-hooks";
import { ToastContainer } from "react-toastify";
import UserHeader from "./userheader";
import UserMenu from "./usermenu";

export interface EnvProps {
  readonly isProduction?: boolean
}
interface DDPageProps extends EnvProps {
  children: React.ReactNode;
  secure?: boolean;
}

export default function DDPage(props: DDPageProps) {
  const gaId = "UA-176180938-1";
  const fsb = useFullScreenBrowser();
  const commonSecureComps: Array<React.ReactNode> = [
    <UserHeader />,
    <UserMenu />,
  ];
  const commonPublicComps: Array<React.ReactNode> = [];

  const getCommonComps = () =>
    props.secure ? commonSecureComps : commonPublicComps;

  return (
    <Fragment>
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="images/icons/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Your Financial Analyst" />
        <link rel="apple-touch-icon" href="images/icons/logo57.png" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,500"
        />
        <title>DollarDarwin</title>
        <link rel="manifest" href="manifest.json" />
      </Head>
      <main>
        <div className="text-lg">
          <ToastContainer />
          {!isMobileDevice(fsb) ? (
            <ParallaxProvider>
              {getCommonComps().map(child => child)}
              {props.children}
            </ParallaxProvider>
          ) : (
            <Fragment>
              {getCommonComps().map(child => child)}
              {props.children}
            </Fragment>
          )}
        </div>
      </main>
      <footer>
        {props.isProduction && (
          <Fragment>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            page_path: window.location.pathname,
          });
        `,
              }}
            />
          </Fragment>
        )}
      </footer>
    </Fragment>
  );
}
