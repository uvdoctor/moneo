import * as mutations from '../../graphql/mutations'
import { API, graphqlOperation } from 'aws-amplify'
import * as APIt from '../../api/goals'
import * as queries from '../../graphql/queries'

export const getGoalsList = async () => {
    try {
        const { data: { listGoals } } = (await API.graphql(graphqlOperation(queries.listGoals))) as {
            data: APIt.ListGoalsQuery
        }
        let goals: Array<APIt.CreateGoalInput> | null = listGoals ? listGoals.items as Array<APIt.CreateGoalInput> : null
        console.log("Got all goals from db....", goals)
        return goals
    } catch (e) {
        console.log("Error while getting list of goals: ", e)
        return null
    }
}

export const createNewGoal = async (goal: APIt.CreateGoalInput) => {
    try {
        const { data } = (await API.graphql(graphqlOperation(mutations.createGoal, { input: goal }))) as {
            data: APIt.CreateGoalMutation
        }
        console.log("New goal created in db: ", data ? data.createGoal : "")
        return data.createGoal as APIt.CreateGoalInput
    } catch (e) {
        console.log("Error while creating goal: ", e)
        return null
    }
}

export const changeGoal = async (goal: APIt.CreateGoalInput) => {
    try {
        const { data } = (await API.graphql(graphqlOperation(mutations.updateGoal, { input: goal }))) as {
            data: APIt.UpdateGoalMutation
        }
        console.log("Goal updated in db: ", data ? data.updateGoal : "")
        return data.updateGoal as APIt.CreateGoalInput
    } catch (e) {
        console.log("Error while updating goal: ", e)
        return null
    }
}

export const deleteGoal = async (id: string) => {
    try {
        await API.graphql(graphqlOperation(mutations.deleteGoal, { input: { id: id } }))
        return true
    } catch (e) {
        console.log("Error while deleting goal: ", e)
        return false
    }
}

export const getDuration = (type: string, sellAfter: number, startYear: number, endYear: number) => type === APIt.GoalType.B ? sellAfter : endYear - startYear

export const createNewTarget = (year: number, val: number, curr: string, fx: number) => {
    return {
        year: year,
        val: val,
        curr: curr,
        fx: fx
    }
}

export const getGoalTypes = () => {
    return {
        "B": "Buy",
        "R": "Rent",
        "X": "Experience",
        "L": "Learn",
        "C": "Celebrate",
        "F": "Provide for Family",
        "FF": "Be Financially Free",
        "D": "Donate",
        "O": "Spend for Other Things"
    }
}

export function getCriticalityOptions() {
    return {
        "H": "Must Meet", "M": "Try Best", "L": "OK if Not Met"
    }
}

export function getRAOptions() {
    return {
        "L": "Up to 0%", "M": "Up to 20%", "H": "Up to 50%"
    }
}
