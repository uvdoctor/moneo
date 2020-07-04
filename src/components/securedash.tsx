import React, { useState, Fragment } from 'react'
import { withAuthenticator } from '@aws-amplify/ui-react'
import Goals from '../components/goals/goals'
import Snapshot from './nw/snapshot'

const SecureDash = () => {
    const netWorthLabel = "Net Worth"
    const goalsLabel = "Plan"
    const saveLabel = "Save"
    const investLabel = "Invest"
    const viewItems = [netWorthLabel, goalsLabel, saveLabel, investLabel]
    const [viewMode, setViewMode] = useState(netWorthLabel)
    const [showModal, setShowModal] = useState<boolean>(false)
    
    const changeViewMode = (e: any) => {
        setViewMode(e.target.innerText)
    }

    return (
        <Fragment>
            {!showModal && <ul className="flex mt-12 bg-black w-screen">
                {viewItems.map((item, i) => (
                    <li key={"viewItem" + i} className="ml-2">
                        <button onClick={changeViewMode} style={{ color: viewMode === item ? "green" : "white", backgroundColor: viewMode === item ? "white" : "transparent" }} className="dashmi md:mt-4 md:px-4 hover:bg-white hover:border-t hover:text-green-600 focus:outline-none">{item}</button>
                    </li>))}
            </ul>}
            {viewMode === netWorthLabel && <Snapshot />}
            {viewMode === goalsLabel && <Goals showModalHandler={setShowModal} />}
        </Fragment>
    )
}

export default withAuthenticator(SecureDash)