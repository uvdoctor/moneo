import NextDocument, {
	DocumentContext,
	Head,
	Html,
	Main,
	NextScript,
} from "next/document";
import React, { Fragment } from "react";
import { GA_TRACKING_ID } from "../lib/gtag";

export interface CustomDocProps {
	readonly isProduction: boolean;
}

class CustomDoc extends NextDocument<CustomDocProps> {
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
					<link rel="icon" href="images/icons/favicon.ico" />
					<link rel="shortcut icon" href="images/icons/favicon.ico" />
					<link rel="apple-touch-icon" href="images/icons/logo57.png" />
					<link
						href="https://fonts.googleapis.com/css2?family=Jost:wght@400;700&display=swap"
						rel="stylesheet"
					/>
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

export default CustomDoc;
