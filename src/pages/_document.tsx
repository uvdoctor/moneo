import NextDocument, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";
import React, { Fragment } from "react";
import { GA_TRACKING_ID } from "../lib/gtag";

interface DDDocumentProps {
  readonly isProduction: boolean;
}

class DDDocument extends NextDocument<DDDocumentProps> {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await NextDocument.getInitialProps(ctx);
    const isProduction = process.env.NODE_ENV === "production";
    return {
      ...initialProps,
      isProduction,
    };
  }

  render() {
    const { isProduction } = this.props;

    return (
      <Html>
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
        <body>
          <Main />
          <NextScript />
        </body>
        <footer>
          {isProduction && (
            <Fragment>
              <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
              />
              <script
                dangerouslySetInnerHTML={{
                  __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_TRACKING_ID}', {
            page_path: window.location.pathname,
          });
        `,
                }}
              />
            </Fragment>
          )}
        </footer>
      </Html>
    );
  }
}

export default DDDocument;
