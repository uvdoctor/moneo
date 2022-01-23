import "@aws-amplify/ui/dist/style.css";
import { AppProps } from "next/app";
require("../styles/index.less");
import * as gtag from "../lib/gtag";
import { Router } from "next/router";
import React from "react";

Router.events.on("routeChangeComplete", (url) => gtag.pageview(url));

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
