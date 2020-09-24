import React, { Fragment } from "react";
import Head from "next/head";
import Main from "../components/main";
interface HomeProps {
  isProduction: boolean;
}

export default function Home({ isProduction }: HomeProps) {
  const gaId = "UA-176180938-1";

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
        {isProduction && (
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
          gtag("js", new Date());
          gtag("config", ${gaId}, {
            page_path: window.location.pathname,
          });
        `,
              }}
            />
          </Fragment>
        )}
      </Head>
      <main>
        <Main />
      </main>
    </Fragment>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      isProduction: process.env.NODE_ENV === "production",
    },
  };
}
