import '@aws-amplify/ui/dist/style.css'
import 'rc-slider/assets/index.css';
import { AppProps } from 'next/app'
import '../styles/index.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}