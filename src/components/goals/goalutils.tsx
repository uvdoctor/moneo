import * as mutations from "../../graphql/mutations";
import { API, graphqlOperation } from "aws-amplify";
import * as APIt from "../../api/goals";
import * as queries from "../../graphql/queries";
import { MAX_RETIREMENT_AGE, PLAN_DURATION } from "../../CONSTANTS";
import { getRangeFactor } from "../utils";

export const getGoalsList = async () => {
  try {
    const {
      data: { listGoals },
    } = (await API.graphql(graphqlOperation(queries.listGoals))) as {
      data: APIt.ListGoalsQuery;
    };
    let goals: Array<APIt.CreateGoalInput> | null = listGoals
      ? (listGoals.items as Array<APIt.CreateGoalInput>)
      : null;
    console.log("Got all goals from db....", goals);
    return goals;
  } catch (e) {
    console.log("Error while getting list of goals: ", e);
    return null;
  }
};

export const createNewGoal = async (goal: APIt.CreateGoalInput) => {
  try {
    const { data } = (await API.graphql(
      graphqlOperation(mutations.createGoal, { input: goal })
    )) as {
      data: APIt.CreateGoalMutation;
    };
    return data.createGoal as APIt.CreateGoalInput;
  } catch (e) {
    console.log("Error while creating goal: ", e);
    return null;
  }
};

export const changeGoal = async (goal: APIt.UpdateGoalInput) => {
  try {
    const { data } = (await API.graphql(
      graphqlOperation(mutations.updateGoal, { input: goal })
    )) as {
      data: APIt.UpdateGoalMutation;
    };
    return data.updateGoal as APIt.UpdateGoalInput;
  } catch (e) {
    console.log("Error while updating goal: ", e);
    return null;
  }
};

export const deleteGoal = async (id: string) => {
  try {
    await API.graphql(
      graphqlOperation(mutations.deleteGoal, { input: { id: id } })
    );
    return true;
  } catch (e) {
    console.log("Error while deleting goal: ", e);
    return false;
  }
};

export const getDuration = (
  sellAfter: number | null | undefined,
  startYear: number,
  endYear: number,
  manualMode: number,
  loanPer: number | null | undefined,
  loanRY: number | null | undefined,
  loanMonths: number | null | undefined
) => {
  if (sellAfter) return sellAfter;
  if (manualMode < 1 && loanPer && loanRY && loanMonths) {
    return Math.round(loanRY + loanMonths / 12) - startYear;
  }
  return endYear - startYear + 1;
};

export const createNewTarget = (num: number, val: number) => {
  return {
    num: num,
    val: val,
  };
};

const createFFGoalInput = (currency: string) => {
  let nowYear = new Date().getFullYear();
  return {
    id: "",
    name: "Financial Independence",
    sy: nowYear,
    ey: nowYear + 70,
    by: nowYear + 1,
    tdr: 0,
    tdl: 0,
    ccy: currency,
    type: APIt.GoalType.FF,
    imp: APIt.LMH.M,
    manual: 0,
    amper: 5,
    amsy: nowYear + 40,
    chg: nowYear,
    aiper: 1.5,
    aisy: nowYear + 40,
    tbi: 0,
    cp: 0,
    sa: 0,
    achg: 5,
    dr: 0,
    pg: [],
    pl: [],
    tbr: 1,
    tdli: 0,
    btr: 3,
    ra: 50000,
    rachg: 1000
  } as APIt.CreateGoalInput;
};

const createBaseGoalInput = (goalType: APIt.GoalType, currency: string) => {
  let nowYear = new Date().getFullYear();
  let startYear = nowYear + 1;
  return {
    id: "",
    name: "",
    sy: startYear,
    ey: startYear,
    by: nowYear,
    tdr: 0,
    tdl: 20000 * getRangeFactor(currency),
    ccy: currency,
    cp: goalType === APIt.GoalType.B ? 500000 : 20000,
    chg: 3,
    type: goalType,
    tgts: [],
    dr: 5,
    imp: APIt.LMH.M,
    manual: 0,
  } as APIt.CreateGoalInput;
};

export const getTabLabelByOrder = (tabOptions: Array<any>, order: number) => {
  let result = tabOptions.filter((t) => t.order === order && t.active);
  if (result && result.length === 1) return result[0].label;
  return null;
};

export const getOrderByTabLabel = (tabOptions: Array<any>, label: string) => {
  let result = tabOptions.filter((t) => t.label === label && t.active);
  if (result && result.length === 1) return result[0].order;
  return null;
};

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

export const isLoanEligible = (goalType: APIt.GoalType) =>
  goalType !== APIt.GoalType.D && goalType !== APIt.GoalType.R && goalType !== APIt.GoalType.FF;

export const isTaxCreditEligible = (goalType: APIt.GoalType) =>
  goalType === APIt.GoalType.T ||
  goalType === APIt.GoalType.X ||
  goalType === APIt.GoalType.C;

export const createNewGoalInput = (
  goalType: APIt.GoalType,
  currency: string
) => {
  if (goalType === APIt.GoalType.FF) return createFFGoalInput(currency);
  let bg: APIt.CreateGoalInput = createBaseGoalInput(goalType, currency);
  if (isLoanEligible(goalType)) {
    bg.tbi = 0;
    bg.tdli = 20000 * getRangeFactor(currency);
    bg.loan = {
      rate: 4,
      dur: 10,
      per: 0,
      ry: goalType === APIt.GoalType.E ? bg.ey + 1 : bg.sy,
      type: APIt.LoanType.A,
      pp: [],
      ira: [],
      dura: []
    };
  }
  if (goalType === APIt.GoalType.B) {
    bg.sa = 5;
    bg.achg = 3;
    bg.amper = 2;
    bg.amsy = bg.sy;
    bg.aiper = 0;
    bg.aisy = bg.sy;
    bg.tbr = 0;
    bg.ra = 0;
    bg.rachg = 5;
  } else if (goalType === APIt.GoalType.E) {
    bg.btr = 100;
    bg.tbr = 1;
    bg.achg = 0;
  }
  return bg;
};

export const getGoalTypes = () => {
  return {
    B: "BUY",
    R: "RENT",
    E: "EDUCATE",
    T: "TRAVEL",
    X: "EXPERIENCE",
    C: "CELEBRATE",
    D: "DONATE",
    S: "START-UP",
    O: "OTHER",
    FF: "Financial Independence",
  };
};

export function getImpLevels() {
  return {
    H: "Must Meet",
    M: "Try Best",
    L: "Optional",
  };
}

export function getImpOptions() {
  return {
    "": "All",
    H: "Must Meet",
    M: "Try Best",
    L: "Optional",
  };
}

export function getRAOptions() {
  return {
    L: "Up to 0%",
    M: "Up to 20%",
    H: "Up to 50%",
  };
}

export const getMinRetirementDuration = () => PLAN_DURATION - MAX_RETIREMENT_AGE

export const getLastPossibleFFYear = (endYear: number) => endYear - getMinRetirementDuration()