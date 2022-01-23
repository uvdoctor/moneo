import "@aws-amplify/ui/dist/style.css";
import * as gtag from "../lib/gtag";
import { Router } from "next/router";
import React from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { AppContextProvider } from "../components/AppContext";

require("../styles/index.less");

Router.events.on("routeChangeComplete", (url) => gtag.pageview(url));

interface MyAppProps {
  Component: any;
  pageProps: any;
  query: string;
  headers: any;
}

export default function MyApp({
  Component,
  pageProps,
  query,
  headers,
}: MyAppProps) {
  return (
    <GoogleReCaptchaProvider reCaptchaKey="6LdTyd8ZAAAAAHZqurv84AUu_qsMvb_j9V3W_8WP">
      <AppContextProvider query={query} headers={headers}>
        <Component {...pageProps} />;
      </AppContextProvider>
    </GoogleReCaptchaProvider>
  );
}

MyApp.getInitialProps = ({
  router: { query },
  ctx: { req: { headers } = {} } = {},
}: any) => ({ query, headers });
