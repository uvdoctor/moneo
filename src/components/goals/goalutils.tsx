import * as mutations from '../../graphql/mutations';
import { API, graphqlOperation } from 'aws-amplify';
import * as APIt from '../../api/goals';
import * as queries from '../../graphql/queries';
import { getRangeFactor } from '../utils';
import {
	faUserGraduate,
	faShoppingCart,
	faSuitcaseRolling,
	faBirthdayCake,
	faDonate,
	faCrosshairs,
	faUserSecret,
	faParachuteBox,
	faFileContract
} from '@fortawesome/free-solid-svg-icons';
import { Storage } from 'aws-amplify';

export const getGoalsList = async () => {
	try {
		const { data: { listGoals } } = (await API.graphql(graphqlOperation(queries.listGoals))) as {
			data: APIt.ListGoalsQuery;
		};
		let goals: Array<APIt.CreateGoalInput> | null = listGoals
			? listGoals.items as Array<APIt.CreateGoalInput>
			: null;
		console.log('Got all goals from db....', goals);
		return goals;
	} catch (e) {
		console.log('Error while getting list of goals: ', e);
		return null;
	}
};

export const createNewGoal = async (goal: APIt.CreateGoalInput) => {
	try {
		const { data } = (await API.graphql(graphqlOperation(mutations.createGoal, { input: goal }))) as {
			data: APIt.CreateGoalMutation;
		};
		return data.createGoal as APIt.CreateGoalInput;
	} catch (e) {
		console.log('Error while creating goal: ', e);
		return null;
	}
};

export const changeGoal = async (goal: APIt.UpdateGoalInput) => {
	//@ts-ignore
	if (goal.hasOwnProperty('createdAt')) delete goal.createdAt;
	//@ts-ignore
	if (goal.hasOwnProperty('updatedAt')) delete goal.updatedAt;
	//@ts-ignore
	if (goal.hasOwnProperty('owner')) delete goal.owner;
	try {
		const { data } = (await API.graphql(graphqlOperation(mutations.updateGoal, { input: goal }))) as {
			data: APIt.UpdateGoalMutation;
		};
		return data.updateGoal as APIt.UpdateGoalInput;
	} catch (e) {
		console.log('Error while updating goal: ', e);
		return null;
	}
};

export const deleteGoal = async (id: string) => {
	try {
		await API.graphql(graphqlOperation(mutations.deleteGoal, { input: { id: id } }));
		return true;
	} catch (e) {
		console.log('Error while deleting goal: ', e);
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
	isEduLoan: boolean = false
) => {
	let dur = endYear - startYear + 1;
	if (sellAfter) dur = sellAfter;
	else if (manualMode < 1 && loanPer && loanMonths) {
		let loanYears = Math.round(loanMonths / 12);
		if (isEduLoan) dur += loanYears;
		else dur = loanYears;
	}
	if (startMonth > 1 || loanRM) dur++;
	if (loanRM && startMonth + loanRM > 12) dur++;
	return dur;
};

export const createNewTarget = (num: number, val: number) => {
	return {
		num: num,
		val: val
	};
};

const createFFGoalInput = (currency: string) => {
	let nowYear = new Date().getFullYear();
	const rf = getRangeFactor(currency);
	return {
		name: 'Financial Independence',
		loan: {
			emi: 12000 * rf,
			ry: nowYear,
			per: 3,
			dur: 85,
			rate: 50,
			type: APIt.LoanType.A,
			pmi: 6000 * rf
		},
		sy: nowYear - 30,
		ey: nowYear,
		by: nowYear + 1,
		tdr: 0,
		tdl: 0,
		ccy: currency,
		type: APIt.GoalType.FF,
		imp: APIt.LMH.H,
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
		tdli: 20000 * rf,
		btr: 3,
		ra: 50000 * rf,
		rachg: 1000 * rf
	} as APIt.CreateGoalInput;
};

const createBaseGoalInput = (goalType: APIt.GoalType, currency: string) => {
	let nowYear = new Date().getFullYear();
	let startYear = nowYear + 1;
	return {
		name: '',
		sy: startYear,
		sm: 1,
		ey: startYear,
		by: nowYear,
		tdr: 0,
		tdl: isTaxCreditEligible(goalType) ? 0 : 2000 * getRangeFactor(currency),
		ccy: currency,
		cp: goalType === APIt.GoalType.B ? 500000 * getRangeFactor(currency) : 20000 * getRangeFactor(currency),
		chg: 0,
		type: goalType,
		tgts: [],
		dr: 5,
		imp: APIt.LMH.M,
		manual: 0,
		img: ''
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
	goalType !== APIt.GoalType.D && goalType !== APIt.GoalType.R && goalType !== APIt.GoalType.FF;

export const isTaxCreditEligible = (goalType: APIt.GoalType) =>
	goalType === APIt.GoalType.T || goalType === APIt.GoalType.X || goalType === APIt.GoalType.C;

export const createNewGoalInput = (goalType: APIt.GoalType, currency: string, isPublicLoanCalc?: boolean) => {
	if (goalType === APIt.GoalType.FF) return createFFGoalInput(currency);
	let bg: APIt.CreateGoalInput = createBaseGoalInput(goalType, currency);
	if (isLoanEligible(goalType)) {
		bg.tbi = 0;
		bg.tdli = 2000 * getRangeFactor(currency);
		bg.loan = {
			rate: 3 + (3 * getRangeFactor(currency) / 100),
			dur: 120,
			per: isPublicLoanCalc ? 100 : 0,
			ry: 0,
			type: APIt.LoanType.A,
			pp: [],
			ira: [],
			pmi: 0,
			peper: 80
		};
	}
	if (goalType === APIt.GoalType.B) {
		bg.sa = 10;
		bg.achg = 3;
		bg.amper = 2;
		bg.amsy = bg.sy;
		bg.aiper = 0;
		bg.aisy = bg.sy;
		bg.tbr = 0;
		bg.ra = 0;
		bg.rachg = 5;
	} else if (goalType === APIt.GoalType.E) {
		bg.tbr = 0;
		bg.achg = 0;
	}
	return bg;
};

export const getGoalTypes = () => {
	return {
		B: 'BUY',
		R: 'RENT',
		E: 'EDUCATE',
		T: 'TRAVEL',
		X: 'EXPERIENCE',
		C: 'CELEBRATE',
		D: 'DONATE',
		S: 'START-UP',
		O: 'OTHER',
		FF: 'Financial Independence'
	};
};

export function getImpLevels() {
	return {
		H: 'Must Meet',
		M: 'Try Best',
		L: 'Optional'
	};
}

export function getImpOptions() {
	return {
		'': 'All Goals',
		H: 'Must Meet Goals only',
		M: 'Try Best Goals only',
		L: 'Optional Goals only'
	};
}

export function getRAOptions() {
	return {
		L: 'Up to 0%',
		M: 'Up to 20%',
		H: 'Up to 50%'
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

Storage.configure({ level: 'private' });

export const goalImgStorage = {
	getUrlFromKey: async (key: string) => {
		return Storage.vault.get(key, { expires: 9999 })
	},
	storeGoalImg: async (file: File) => {
		return await Storage.put(file.name, file, {
			contentType: 'image'
		});
	},
	removeGoalImg: async (key: string) => {
		return await Storage.remove(key);
	},
	validateImg: (file:File) => {
		// size validation
		const maxAllowedSize = 250000
		const isImage = file.type.split('/')[0] === 'image'
		if(!isImage) throw new Error(`Only image file is allowed, e.g .png, .jpg, .jpeg or .gif`)
		if(file.size > maxAllowedSize) throw new Error(`Image size should not exceed ${maxAllowedSize/1000} KB`);
		
		return true
	},
	imageShared: (allGoals: any, goalId: string, goalImgKey: string) => {
		return allGoals.some((curGoal: any) => {
			return curGoal.id !== goalId && curGoal.img === goalImgKey;
	  	});
	}
}

