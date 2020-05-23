import '@aws-amplify/ui/dist/style.css'
import Amplify from 'aws-amplify'
import Header from '../components/header'
import { Fragment } from 'react'
import { AppProps } from 'next/app'
import '../styles/index.css'
import awsconfig from '../aws-exports'

Amplify.configure(awsconfig)

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Fragment>
      <Header />
      <Component {...pageProps} />
    </Fragment>
  )
}