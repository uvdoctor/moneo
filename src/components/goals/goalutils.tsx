import * as mutations from "../../graphql/mutations";
import { API, graphqlOperation } from "aws-amplify";
import * as APIt from "../../api/goals";
import * as queries from "../../graphql/queries";
import { getRangeFactor, removeFromArray } from "../utils";
import {
  faUserGraduate,
  faShoppingCart,
  faSuitcaseRolling,
  faBirthdayCake,
  faDonate,
  faCrosshairs,
  faUserSecret,
  faParachuteBox,
  faFileContract,
} from "@fortawesome/free-solid-svg-icons";
import { Storage } from "aws-amplify";
import { BuyType } from "../../api/goals";
import { calculateCFs } from "./cfutils";

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
  //@ts-ignore
  if (goal.hasOwnProperty("createdAt")) delete goal.createdAt;
  //@ts-ignore
  if (goal.hasOwnProperty("updatedAt")) delete goal.updatedAt;
  //@ts-ignore
  if (goal.hasOwnProperty("owner")) delete goal.owner;
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
  startMonth: number,
  endYear: number,
  manualMode: number,
  loanPer: number | null | undefined,
  loanRM: number | null | undefined,
  loanMonths: number | null | undefined,
  isEduLoan: boolean = false,
  loanGracePeriod: number | null | undefined
) => {
  let dur = endYear - startYear + 1;
  if (sellAfter) dur = sellAfter;
  else if (manualMode < 1 && loanPer && loanMonths) {
    let loanYears = Math.round(loanMonths / 12);
    if (isEduLoan) dur += loanYears;
    else dur = loanYears;
  }
  if (startMonth > 1 || loanRM || loanGracePeriod) dur++;
  if (
    (loanRM && startMonth + loanRM > 12) ||
    (loanGracePeriod && startMonth + loanGracePeriod > 12)
  )
    dur++;
  return dur;
};

export const createNewTarget = (num: number, val: number) => {
  return {
    num: num,
    val: val,
  };
};

const createFFGoalInput = (currency: string) => {
  let nowYear = new Date().getFullYear();
  const rf = getRangeFactor(currency);
  const irDiff = currency === "INR" ? 3.5 : 0;
  return {
    name: "Financial Independence",
    loan: {
      emi: 3000 * rf,
      ry: nowYear,
      per: 3,
      dur: 90,
      rate: 60,
      type: APIt.LoanType.A,
      pmi: 2000 * rf,
    },
    sy: nowYear - 30,
    ey: nowYear,
    by: nowYear + 1,
    tdr: 0,
    tdl: 0,
    ccy: currency,
    type: APIt.GoalType.FF,
    imp: APIt.LMH.H,
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
    tdli: 10000 * rf,
    btr: 3,
    ra: 10000 * rf,
    rachg: 200 * rf,
    manual: 1,
    pp: {
      cash: 1.5 + irDiff,
      ltdep: 2.25 + irDiff,
      mtb: 3 + irDiff,
      imtb: currency === "INR" ? 3 : 3 + irDiff,
      hyb: 5 + irDiff,
      ihyb: currency === "INR" ? 5 : 5 + irDiff,
      teb: 3.5 + irDiff,
      reit: 9.5 + irDiff,
      reitETF: 8 + irDiff,
      ireit: currency === "INR" ? 9.5 : 9.5 + irDiff,
      ireitETF: currency === "INR" ? 8 : 8.5 + irDiff,
      re: 6.4 + irDiff,
      gold: 5.5 + irDiff,
      goldb: 7.5 + irDiff,
      lcs: 10 + irDiff,
      lcetf: 8 + irDiff,
      ilcs: currency === "INR" ? 10 : 10 + irDiff,
      ilcetf: currency === "INR" ? 8 : 8 + irDiff,
      mscs: 15 + irDiff,
      imscs: currency === "INR" ? 15 : 15 + irDiff,
      dgs: 10 + irDiff,
      uc: 12 + irDiff,
      crypto: 20,
      p2p: 8 + irDiff,
    },
  } as APIt.CreateGoalInput;
};

export const createDefaultFFGoalForUser = (
  birthYear: number,
  totalAssets: number,
  riskProfile: APIt.RiskProfile,
  monthlyExpense: number,
  monthlyInvestment: number,
  currency: string
) => {
  let goal: APIt.CreateGoalInput = createFFGoalInput(currency);
  goal.sy = birthYear;
  goal.ra = totalAssets;
  goal.rachg = monthlyInvestment;
  goal.tdli = monthlyExpense * 12;
  if (goal?.loan) goal.loan.emi = monthlyExpense * 6;
  goal.rp = riskProfile;
  goal.tbr = 0;
  return goal;
};

const createBaseGoalInput = (goalType: APIt.GoalType, currency: string) => {
  let nowYear = new Date().getFullYear();
  let startYear = nowYear + 1;
  return {
    name: "",
    sy: startYear,
    sm: 1,
    ey: startYear,
    by: nowYear,
    tdr: 0,
    tdl: isTaxCreditEligible(goalType) ? 0 : 2000 * getRangeFactor(currency),
    ccy: currency,
    cp:
      goalType === APIt.GoalType.B
        ? 200000 * getRangeFactor(currency)
        : 20000 * getRangeFactor(currency),
    chg: 0,
    type: goalType,
    tgts: [],
    dr: 5,
    imp: APIt.LMH.M,
    manual: 0,
    img: "",
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

export const isLoanEligible = (goalType: APIt.GoalType) =>
  goalType !== APIt.GoalType.D &&
  goalType !== APIt.GoalType.R &&
  goalType !== APIt.GoalType.FF;

export const isTaxCreditEligible = (goalType: APIt.GoalType) =>
  goalType === APIt.GoalType.T ||
  goalType === APIt.GoalType.X ||
  goalType === APIt.GoalType.C;

export const createNewGoalInput = (
  goalType: APIt.GoalType,
  currency: string,
  isPublicLoanCalc?: boolean
) => {
  if (goalType === APIt.GoalType.FF) return createFFGoalInput(currency);
  let bg: APIt.CreateGoalInput = createBaseGoalInput(goalType, currency);
  if (isLoanEligible(goalType)) {
    bg.tbi = 0;
    bg.tdli = 2000 * getRangeFactor(currency);
    bg.loan = {
      rate: 3 + (3 * getRangeFactor(currency)) / 100,
      dur: 120,
      per: isPublicLoanCalc ? 80 : 0,
      ry: 0,
      type: APIt.LoanType.A,
      pp: [],
      ira: [],
      pmi: 0,
      peper: 80,
    };
  }
  if (goalType === APIt.GoalType.B) {
    bg.sa = 20;
    bg.achg = 8;
    bg.amper = 2;
    bg.amsy = bg.sy;
    bg.aiper = 0;
    bg.aisy = bg.sy;
    bg.tbr = 0;
    bg.ra = 0;
    bg.rachg = 5;
    bg.bt = BuyType.P;
    bg.rc = 0;
    bg.rcchg = 3;
  } else if (goalType === APIt.GoalType.E) {
    bg.tbr = 0;
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
    "": "All Goals",
    H: "Must Meet Goals only",
    M: "Try Best Goals only",
    L: "Optional Goals only",
  };
}

export const getDefaultIconForGoalType = (goalType: APIt.GoalType) => {
  switch (goalType) {
    case APIt.GoalType.B:
      return faShoppingCart;
    case APIt.GoalType.R:
      return faFileContract;
    case APIt.GoalType.E:
      return faUserGraduate;
    case APIt.GoalType.T:
      return faSuitcaseRolling;
    case APIt.GoalType.C:
      return faBirthdayCake;
    case APIt.GoalType.X:
      return faParachuteBox;
    case APIt.GoalType.D:
      return faDonate;
    case APIt.GoalType.S:
      return faUserSecret;
    default:
      return faCrosshairs;
  }
};

export const goalImgStorage = {
  getUrlFromKey: async (key: string) =>
    Storage.vault.get(key, { expires: 9999 }),
  storeGoalImg: async (file: File) =>
    await Storage.put(file.name, file, {
      contentType: "image",
    }),
  removeGoalImg: async (key: string) => await Storage.remove(key),
  validateImg: (file: File) => {
    // size validation
    const maxAllowedSize = 250000;
    const isImage = file.type.split("/")[0] === "image";
    if (!isImage)
      throw new Error(
        `Only image file is allowed, e.g .png, .jpg, .jpeg or .gif`
      );
    if (file.size > maxAllowedSize)
      throw new Error(
        `Image size should not exceed ${maxAllowedSize / 1000} KB`
      );

    return true;
  },
  imageShared: (allGoals: any, goalId: string, goalImgKey: string) => {
    return allGoals.some((curGoal: any) => {
      return curGoal.id !== goalId && curGoal.img === goalImgKey;
    });
  },
};

export const loadStateFromUserInfo = (
  userInfo: any,
  g: APIt.CreateGoalInput
) => {
  if (!userInfo) return;
  g.sy = new Date(userInfo.dob).getFullYear();
  g.rp = userInfo.rp;
  g.manual =
    userInfo.tax === APIt.TaxLiability.NIL ||
    userInfo.tax === APIt.TaxLiability.L
      ? 0
      : 1;
};

export const loadAllGoals = async (userInfo: any) => {
  let goals: Array<APIt.CreateGoalInput> | null = await getGoalsList();
  if (!goals || !goals.length) {
    return { ffGoal: null, goals: [], allCFs: null };
  }
  let allCFs: any = {};
  let ffGoal: any = null;
  let ffGoalId = "";
  goals?.forEach((g) => {
    if (g.type === APIt.GoalType.FF) {
      ffGoal = g;
      loadStateFromUserInfo(userInfo, g);
      ffGoalId = g.id as string;
    } else {
      let result: any = calculateCFs(
        null,
        g,
        getDuration(
          g.sa as number,
          g.sy,
          g.sm as number,
          g.ey,
          g.manual,
          g.loan?.per as number,
          g.loan?.ry as number,
          g.loan?.dur as number,
          g.type === APIt.GoalType.E && (g?.loan?.per as number) > 0,
          g.achg as number
        )
      );
      allCFs[g.id as string] = result.cfs;
    }
  });
  removeFromArray(goals, "id", ffGoalId);
  return { ffGoal, goals, allCFs };
};
