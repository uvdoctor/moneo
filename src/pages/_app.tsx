import '@aws-amplify/ui/dist/style.css'
import "nouislider/distribute/nouislider.css";
import { AppProps } from 'next/app'
import '../styles/index.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}