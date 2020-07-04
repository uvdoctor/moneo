import React, { useCallback, useEffect } from 'react'
import { usePlaidLink } from "react-plaid-link"
//@ts-ignore
import { AwesomeButton } from 'react-awesome-button'
//import { CreateItemInput } from '../../api/goals'

export default function Snapshot() {
    const onSuccess = useCallback((token, metadata) => {
        // send token to server
        /*let item: CreateItemInput = {
            pt: token,
            pid: '',
            pinstid: metadata.institution.institution_id,
            status: 'success',
        }*/
        console.log("Token is ", token)
        console.log("Metadata is ", metadata)
        //console.log("Item is ", item)
    }, []);

    const config = {
        clientName: 'DollarDarwin',
        env: 'sandbox',
        product: ['auth', 'transactions'],
        publicKey: '7596dc790fd92c79e1d6176b755148',
        onSuccess,
        // ...
    };

    const { open, ready, error, exit } = usePlaidLink(config);

    useEffect(() => {
        return function cleanup() {
            exit()
        }
    })
    return (
        <div className="mt-8">
            <AwesomeButton type="primary" ripple onPress={() => open()} disabled={!ready}>
                Add a bank account
            </AwesomeButton>
            {error && <div className="text-red">
                {error}
            </div>
            }
        </div>
    )
}