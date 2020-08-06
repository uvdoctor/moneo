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

const createFFGoalInput = (currency: string) => {
    let nowYear = new Date().getFullYear()
    return {
        id: '',
        name: 'Financial Freedom',
        sy: nowYear,
        ey: nowYear + 30,
        by: nowYear + 1,
        tdr: 0,
        tdl: 0,
        ccy: currency,
        type: APIt.GoalType.FF,
        imp: APIt.LMH.H,
        manual: 0,
        amper: 5,
        amsy: nowYear + 10,
        chg: nowYear, 
        aiper: 1.5,
        aisy: nowYear + 10,
        tbi: 0,
        cp: 0,
        sa: 0,
        achg: 5,
        dr: 0,
        pg: [],
        pl: [],
        tbr: 0,
        btr: 3
    } as APIt.CreateGoalInput
}

const createBaseGoalInput = (goalType: APIt.GoalType, currency: string) => {
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
        ccy: currency,
        cp: 0,
        chg: 3,
        type: goalType,
        tgts: [],
        dr: 6,
        imp: APIt.LMH.M,
        manual: 0
    } as APIt.CreateGoalInput
}

/*const createSellGoalInput = () => {
    let nowYear = new Date().getFullYear()
    return {
        name: name,
        sy: nowYear - 5,
        ey: nowYear,
        by: nowYear,
        tdr: 0,
        tdl: 0,
        ccy: 'USD',
        cp: 0,
        chg: 3,
        type: APIt.GoalType.S,
        tgts: [],
        dr: 6,
        imp: APIt.LMH.L,
        manual: 0,
        amper: 2,
        amsy: nowYear,
        aiper: 0,
        aisy: nowYear,
        tbr: 0
    }
}*/

export const createNewGoalInput = (goalType: APIt.GoalType, currency: string) => {
    if (goalType === APIt.GoalType.FF) return createFFGoalInput(currency)
    let bg: APIt.CreateGoalInput = createBaseGoalInput(goalType, currency)
    if (goalType === APIt.GoalType.B || goalType === APIt.GoalType.E) {
        bg.tbi = 0
        bg.tdli = 0
        bg.emi = { rate: 4, dur: 10, per: 0, ry: bg.sy }
    }
    if (goalType === APIt.GoalType.B) {
        bg.sa = 5
        bg.achg = 3
        bg.amper = 2
        bg.amsy = bg.sy
        bg.aiper = 0
        bg.aisy = bg.sy
        bg.tbr = 0
    }
    return bg
}

export const getGoalTypes = () => {
    return {
        "B": "BUY",
        "R": "RENT",
        "E": "EDUCATE",
        "T": "TRAVEL",
        "X": "EXPERIENCE",
        "C": "CELEBRATE",
        "D": "DONATE",
        "S": "START-UP",
        "O": "OTHER",
        "FF": "FINANCIAL FREEDOM"
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
