import "@aws-amplify/ui/dist/style.css";
import { AppProps } from "next/app";
require("../styles/index.less");
import * as gtag from "../lib/gtag";
import { Router } from "next/router";
import React from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { AppContextProvider } from "../components/AppContext";

Router.events.on("routeChangeComplete", (url) => gtag.pageview(url));

export default function MyApp({
  Component,
  pageProps,
  query,
  headers,
}: AppProps) {
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
  ctx: {
    req: { headers },
  },
}) => ({ query, headers });
