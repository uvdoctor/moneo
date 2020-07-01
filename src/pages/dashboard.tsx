import React from 'react'
import Amplify from 'aws-amplify'
import SecureDash from '../components/securedash'
import UserHeader from '../components/userheader'
import awsconfig from '../aws-exports'

Amplify.configure(awsconfig)

export default function Dashboard() {
  return (
    <div className="text-lg">
      <UserHeader />
      <SecureDash />
    </div>
  )

}