import React from 'react'
import { NextPage } from 'next'
import Link from 'next/link'
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'

interface Props {}

const Dashboard: NextPage<Props> = () => (
  <ul>
      <li className="font-black">Dashboard</li>
      <li><Link href="/"><a>Home</a></Link></li>
      <AmplifySignOut />
  </ul>
)

export default withAuthenticator(Dashboard)