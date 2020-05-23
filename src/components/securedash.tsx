import React, { useState } from 'react'
import { withAuthenticator } from '@aws-amplify/ui-react'
import { change } from '../components/utils'
import Input from '../components/input'
import Link from 'next/link'
import { API, graphqlOperation } from 'aws-amplify'
import * as mutations from '../graphql/mutations'
//import * as queries from '../graphql/queries';

const SecureDash = () => {
    const [year, setYear] = useState(2021)
    const [val, setVal] = useState(0)
    const [name, setName] = useState("")

    const updateActiveStyle = (e: any) => {
        let allItems = document.querySelectorAll(".dashmi");
        allItems.forEach(item => {
            if(item === e.target) {
                if(!e.target.style.color) {
                    e.target.style.color = "green"
                    e.target.style.backgroundColor = "white"
                } 
            } else {
                let htmlElem = item as HTMLElement
                htmlElem.style.color = ""
                htmlElem.style.backgroundColor = ""
            } 
        })
    }

    const createNewGoal = async () => {
        const newGoal = {
            name: name,
            targets: [{
                year: year,
                val: val
            }],
            imp: 'H'
        }
        const createdGoal = await API.graphql(graphqlOperation(mutations.createGoal, { input: newGoal }))
        console.log("New goal created in db: ", createdGoal)
        //const allGoals = await API.graphql(graphqlOperation(queries.listGoals))
    }

    return (
        <div className="mt-12">
            <ul className="flex bg-black">
                <li className="ml-1 md:ml-4 md:mr-4">
                    <Link href="#"><a><button onClick={updateActiveStyle} className="dashmi md:mt-4 md:px-4 hover:bg-white hover:border-t hover:text-green-600 focus:outline-none">Net Worth</button></a></Link>
                </li>
                <li className="mr-1 md:mr-4">
                <Link href="#"><a><button onClick={updateActiveStyle} className="dashmi md:mt-4 md:px-4 hover:bg-white hover:border-t hover:text-green-600 focus:outline-none">Plan</button></a></Link>
                </li>
                <li className="mr-1 md:mr-4">
                    <Link href="#"><a><button onClick={updateActiveStyle} className="dashmi md:mt-4 md:px-4 hover:bg-white hover:border-t hover:text-green-600 focus:outline-none">Save</button></a></Link>
                </li>
                <li>
                    <Link href="#"><a><button onClick={updateActiveStyle} className="dashmi md:mt-4 md:px-4 hover:bg-white hover:border-t hover:text-green-600 focus:outline-none">Invest</button></a></Link>
                </li>
            </ul>
            <div className="flex flex-col mt-4">
                <div className="flex items-center justify-center">
                    Name
        <input className="ml-2 inner-block px-2 font-bold appearance-none border border-2 focus:border-indigo-800" type="text" name="name"
                        placeholder="My Goal" value={name} onChange={(e: React.FormEvent<HTMLInputElement>) => setName(e.currentTarget.value)}
                        width="200px" required />
                </div>
                <div className="flex justify-center">
                    <Input
                        pre="Year"
                        value={`${year}`}
                        changeHandler={(e: React.FormEvent<HTMLInputElement>) => change(e, setYear)}
                        width="100px"
                        min="0"
                    />
                    <Input
                        pre="Value"
                        value={`${val}`}
                        changeHandler={(e: React.FormEvent<HTMLInputElement>) => change(e, setVal)}
                        width="100px"
                        min="0"
                    /></div>
            </div>
            <div className="flex justify-center mt-4 mb-4">
                <label className="mt-4 button" onClick={createNewGoal}>
                    Create Goal
						</label>
            </div>
        </div>
    )
}

export default withAuthenticator(SecureDash)