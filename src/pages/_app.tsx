import "@aws-amplify/ui/dist/style.css";
import "rc-slider/assets/index.css";
import "react-awesome-button/dist/styles.css";
import "react-toastify/dist/ReactToastify.css";
import { AppProps } from "next/app";
import "../styles/index.css";
import * as gtag from "../lib/gtag";
import { Router } from "next/router";
import React from "react";
import { Head, Html } from "next/document";

Router.events.on("routeChangeComplete", (url) => gtag.pageview(url));

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Html>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
      </Head>
      <body>
        <Component {...pageProps} />
      </body>
    </Html>
  );
}
