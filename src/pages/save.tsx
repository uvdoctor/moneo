import { withAuthenticator } from '@aws-amplify/ui-react'
import Amplify from 'aws-amplify'
import React from 'react'
import awsmobile from '../aws-exports'
import SecurePage from '../components/securepage'

Amplify.configure(awsmobile)

const Save = () => {
    return (
        <SecurePage>
            <div />
        </SecurePage>
    )
}

export default withAuthenticator(Save)