import React, { useState } from 'react'
import { withAuthenticator } from '@aws-amplify/ui-react'
import Goals from '../components/goals/goals'

const SecureDash = () => {
    const netWorthLabel = "Net Worth"
    const goalsLabel = "Plan"
    const saveLabel = "Save"
    const investLabel = "Invest"
    const viewItems = [netWorthLabel, goalsLabel, saveLabel, investLabel]
    const [viewMode, setViewMode] = useState(netWorthLabel)

    const changeViewMode = (e: any) => {
        setViewMode(e.target.innerText)
    }

    return (
        <div className="mt-12 z-1">
            <ul className="flex bg-black w-screen">
                {viewItems.map((item, i) => (
                    <li key={"viewItem" + i} className="ml-2">
                        <button onClick={changeViewMode} style={{ color: viewMode === item ? "green" : "white", backgroundColor: viewMode === item ? "white" : "transparent" }} className="dashmi md:mt-4 md:px-4 hover:bg-white hover:border-t hover:text-green-600 focus:outline-none">{item}</button>
                    </li>))}
            </ul>
            {viewMode === goalsLabel && <Goals />}
        </div>
    )
}

export default withAuthenticator(SecureDash)