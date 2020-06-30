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
    console.log("Going to create goal...", goal)
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

export const changeGoal = async (goal: APIt.UpdateGoalInput) => {
    try {
        const { data } = (await API.graphql(graphqlOperation(mutations.updateGoal, { input: goal }))) as {
            data: APIt.UpdateGoalMutation
        }
        console.log("Goal updated in db: ", data ? data.updateGoal : "")
        return data.updateGoal as APIt.UpdateGoalInput
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

export const getDuration = (sellAfter: number | null | undefined, startYear: number, endYear: number) => sellAfter ? sellAfter : endYear - startYear + 1

export const createNewTarget = (year: number, val: number) => {
    return {
        year: year,
        val: val
    }
}

const createBaseGoalInput = (goalType: APIt.GoalType) => {
    let nowYear = new Date().getFullYear()
    let startYear = nowYear + 1
    return {
        id: '',
        name: '',
        sy: startYear,
        ey: startYear,
        by: nowYear,
        tdr: 0,
        tdl: 0,
        ccy: 'USD',
        cp: 0,
        chg: 3,
        type: goalType,
        tgts: [],
        dr: 6,
        imp: APIt.LMH.M,
        manual: 0,
    } as APIt.CreateGoalInput
}

export const createNewGoalInput = (goalType: APIt.GoalType) => {
    let bg: APIt.CreateGoalInput = createBaseGoalInput(goalType)
    if(goalType !== APIt.GoalType.D) bg.btr = 10
    if(goalType === APIt.GoalType.B || goalType === APIt.GoalType.L) {
        bg.tbi = 0
        bg.emi = { rate: 4, dur: 10, per: 0, ry: bg.sy }
    }
    if(goalType === APIt.GoalType.B) {
        bg.sa = 5 
        bg.achg = 3
        bg.amper = 2
        bg.amsy = bg.sy
        bg.aiper = 0
        bg.aisy = bg.sy
    }
    return bg
}

export const getGoalTypes = () => {
    return {
        "B": "Buy",
        "R": "Rent",
        "X": "Experience",
        "L": "Learn",
        "C": "Celebrate",
        "F": "Provide",
        "FF": "Retire",
        "D": "Donate",
        "O": "Other"
    }
}

export function getImpLevels() {
    return {
        "H": "Must Meet", "M": "Try Best", "L": "Optional"
    }
}

export function getImpOptions() {
    return {
        "": "All", "H": "Must Meet", "M": "Try Best", "L": "Optional"
    }
}

export function getRAOptions() {
    return {
        "L": "Up to 0%", "M": "Up to 20%", "H": "Up to 50%"
    }
}
