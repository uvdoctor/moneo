import React, { Fragment } from "react";
import Head from "next/head";
import { NextPage } from "next";
import Main from "../components/main";
interface Props {}

const Home: NextPage<Props> = () => (
  <Fragment>
    <Head>
      <meta charSet="utf-8" />
      <link rel="icon" href="images/icons/favicon.ico" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />
      <meta name="description" content="Your Financial Analyst" />
      <link rel="apple-touch-icon" href="images/icons/logo57.png" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,500" />
      <title>DollarDarwin</title>
      <link rel="manifest" href="manifest.json" />
    </Head>
    <main>
      <Main />
    </main>
  </Fragment>
);

export default Home;
