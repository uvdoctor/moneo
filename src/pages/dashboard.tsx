import React, { useState } from 'react'
import { NextPage } from 'next'
import { change } from '../components/utils';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'
import Input from '../components/input'
import { API, graphqlOperation } from 'aws-amplify'
import * as mutations from '../graphql/mutations';
import * as queries from '../graphql/queries';

interface Props { }

const Dashboard: NextPage<Props> = () => {

  const [year, setYear] = useState(2021)
  const [val, setVal] = useState(0)
  const [name, setName] = useState("")

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
    console.log("New goal created in db: ", createdGoal);
    listAllGoals();
  }

  const listAllGoals = async() => {
    const allGoals = await API.graphql(graphqlOperation(queries.listGoals));
    console.log(allGoals);
  }

  return (
    <div>
      <AmplifySignOut />
      <div className="flex flex-col mt-4">
        <div className="flex flex-align-center justify-center">
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
        <label className="mt-4 mb-4 px-4 py-2 rounded bg-red-600 text-white font-bold" onClick={createNewGoal}>
          Create Goal
						</label>
      </div>
      <ul className="mt-4">

      </ul>
    </div>
  )

}

export default withAuthenticator(Dashboard)