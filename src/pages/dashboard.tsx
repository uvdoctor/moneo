import React from 'react'
import Amplify from 'aws-amplify'
import SecureDash from '../components/securedash'
import UserHeader from '../components/userheader'
import awsconfig from '../aws-exports'

Amplify.configure(awsconfig)

const Dashboard = () => {
  
  return (
    <div>
      <UserHeader />
      <SecureDash />
    </div>
  )

}

export default Dashboard