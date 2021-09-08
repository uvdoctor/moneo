import * as mutations from '../../graphql/mutations';
import { API, graphqlOperation } from 'aws-amplify';
import * as APIt from '../../api/goals';
import * as queries from '../../graphql/queries';
import { ALL_FAMILY } from './FamilyInput';
import { GOLD } from './NWContext';
import { getFXRate } from '../utils';
import { COLORS } from '../../CONSTANTS';

export const loadAllFamilyMembers = async () => {
	const { data: { listFamilys } } = (await API.graphql(graphqlOperation(queries.listFamilys))) as {
		data: APIt.ListFamilysQuery;
	};
	let family: Array<APIt.CreateFamilyInput> | null = listFamilys
		? listFamilys.items as Array<APIt.CreateFamilyInput>
		: null;
	if (!family || !family.length) return {};
	let familyList: any = {};
	family.forEach((val: APIt.CreateFamilyInput) => {
		if (val.id) familyList[val.id as string] = { name: val.name, taxId: val.tid };
	});
	return familyList;
};

export const loadHoldings = async () => {
	console.log("Going to query listHoldingss");
	const { data: { listHoldingss } } = (await API.graphql(graphqlOperation(queries.getHoldings))) as {
		data: APIt.ListHoldingssQuery;
	};
	console.log("Holdings data: ", listHoldingss?.items);
	return listHoldingss?.items?.length ? listHoldingss.items as APIt.CreateHoldingsInput : null;
};

export const addFamilyMember = async (name: string, taxId: string) => {
	try {
		const { data } = (await API.graphql(
			graphqlOperation(mutations.createFamily, { input: { name: name, tid: taxId } })
		)) as {
			data: APIt.CreateFamilyMutation;
		};
		return data.createFamily as APIt.CreateFamilyInput;
	} catch (e) {
		console.log('Error while adding family member: ', e);
		return null;
	}
};

export const getFamilyMemberKey = (allFamily: any, taxId: string) => {
	if(!allFamily || !taxId) return null;
	let allKeys = Object.keys(allFamily);
	for(let i = 0; i < allKeys.length; i++) {
		if(allFamily[allKeys[i]].taxId === taxId) return allKeys[i];
	}
	return null;
}

export const doesMemberMatch = (instrument: APIt.HoldingInput, selectedMembers: Array<string>) =>
	selectedMembers.indexOf(ALL_FAMILY) > -1 || selectedMembers.indexOf(instrument.fIds[0]) > -1

export const doesHoldingMatch = (instrument: APIt.HoldingInput, selectedMembers: Array<string>, selectedCurrency: string) =>
	doesMemberMatch(instrument, selectedMembers)&& instrument.curr === selectedCurrency

export const addMemberIfNeeded = async (allFamily: any, allFamilySetter: Function, taxId: string) => {
	let id = getFamilyMemberKey(allFamily, taxId);
	if(id) return id;
	let member = await addFamilyMember(taxId, taxId);
	allFamily[member?.id as string] = {name: member?.name, taxId: member?.tid};
	allFamilySetter(allFamily);
	return member?.id;
};

export const updateFamilyMember = async (member: APIt.UpdateFamilyInput) => {
	try {
		const { data } = (await API.graphql(graphqlOperation(mutations.updateFamily, { input: member }))) as {
			data: APIt.UpdateFamilyMutation;
		};
		return data.updateFamily as APIt.UpdateFamilyInput;
	} catch (e) {
		console.log('Error while updating family member: ', e);
		return null;
	}
};

export const addHoldings = async (holdings: APIt.CreateHoldingsInput) => {
	try {
		const { data } = (await API.graphql(graphqlOperation(mutations.createHoldings, { input: holdings }))) as {
			data: APIt.CreateHoldingsMutation;
		};
		return data.createHoldings as APIt.CreateHoldingsInput;
	} catch (e) {
		console.log('Error while adding holdings: ', e);
		return null;
	}
};

export const updateHoldings = async (holdings: APIt.UpdateHoldingsInput) => {
	try {
		const { data } = (await API.graphql(graphqlOperation(mutations.updateHoldings, { input: holdings }))) as {
			data: APIt.UpdateHoldingsMutation;
		};
		return data.updateHoldings as APIt.UpdateHoldingsInput;
	} catch (e) {
		console.log('Error while updating holdings: ', e);
		return null;
	}
};

export const getRelatedCurrencies = (holdings: APIt.CreateHoldingsInput | null, defaultCurrency: string) => {
	let currencyList: any = {[defaultCurrency]: defaultCurrency};
	if(!holdings || !Object.keys(holdings).length) return currencyList;
	Object.keys(holdings).forEach((key) => {
		//@ts-ignore
		let val: Array<any> | null | string = holdings[key];
		if(val && val instanceof Array) {
			val.forEach((obj: any) => {
				if(!currencyList[obj.curr]) currencyList[obj.curr] = obj.curr;
			})
		}
	})
	return currencyList;
}

const getORIdList = (list: Array<any>, ids: Array<string>) => {
	ids.forEach((id: string) => list.push({id: {eq: id}}));
	return {or: list};
}

export const loadMatchingINExchange = async (isins: Array<string>) => {
	if(!isins.length) return null;
	let idList: Array<APIt.ModelINExchgFilterInput> = [];
	const { data: { listINExchgs } } = (await API.graphql(graphqlOperation(queries.listInExchgs, {limit: 10000, filter: getORIdList(idList, isins)}))) as {
		data: APIt.ListInExchgsQuery;
	};
	return listINExchgs?.items?.length ? listINExchgs.items as Array<APIt.INExchg> : null;
}

export const loadMatchingINMutual = async (isins: Array<string>) => {
	if(!isins.length) return null;
	let idList: Array<APIt.ModelINMutualFilterInput> = [];
	let returnList: Array<APIt.INMutual> = [];
	let nextToken = null;
	do {
		let variables:any = {limit: 20000, filter: getORIdList(idList, isins)};
		if(nextToken) variables.nextToken = nextToken;
		const { data: { listINMutuals } } = (await API.graphql(graphqlOperation(queries.listInMutuals, variables))) as {
			data: APIt.ListInMutualsQuery;
		};
		if(listINMutuals?.items?.length) returnList.push(...listINMutuals.items as Array<APIt.INMutual>);
		nextToken = listINMutuals?.nextToken;
	} while(nextToken);
	return returnList.length ? returnList : null;
}

export const loadMatchingINBond = async (isins: Array<string>) => {
	if(!isins.length) return null;
	let idList: Array<APIt.ModelINBondFilterInput> = [];
	let returnList: Array<APIt.INBond> = [];
	let nextToken = null;
	do {
		let variables:any = {limit: 10000, filter: getORIdList(idList, isins)};
		if(nextToken) variables.nextToken = nextToken;
		const { data: { listINBonds } } = (await API.graphql(graphqlOperation(queries.listInBonds, variables))) as {
			data: APIt.ListInBondsQuery;
		};
		if(listINBonds?.items?.length) returnList.push(...listINBonds.items as Array<APIt.INBond>);
		nextToken = listINBonds?.nextToken;
	} while(nextToken);
	return returnList.length ? returnList : null;
}

export const getAssetTypes = () => {
	return {
		[APIt.AssetType.E]: "Equity",
		[APIt.AssetType.F]: "Fixed Income",
		[APIt.AssetType.H]: "Hybrid",
		[APIt.AssetType.A]: "Alternative"
	}
}

export const getAssetSubTypes = () => {
	return {
		[APIt.AssetSubType.CB]: "Corporate Bond",
		[APIt.AssetSubType.GB]: "Government Bond",
		[APIt.AssetSubType.GBO]: "Government-backed Bond",
		[APIt.AssetSubType.Gold]: "Gold",
		[APIt.AssetSubType.GoldB]: "Gold Bond",
		[APIt.AssetSubType.I]: "Index",
		[APIt.AssetSubType.L]: "Liquid",
		[APIt.AssetSubType.R]: "Real-estate",
		[APIt.AssetSubType.S]: "Stock"
	}
}

export const getFamilyOptions = (allFamily: any) => {
	if(!Object.keys(allFamily).length) return null;
	let options: any = {};
	Object.keys(allFamily).forEach((key) => options[key] = allFamily[key].name);
	return options;
}

export const getGoldTypes = () => {
	return {
		24: "24",
		22: "22",
		20: "20",
		18: "18",
		16: "16",
		14: "14"
	}
}

export const getColourForAssetType = (at: APIt.AssetType) => {
	switch(at) {
		case APIt.AssetType.E: 
			return COLORS.ORANGE;
		case APIt.AssetType.F:
			return COLORS.BLUE;
		case APIt.AssetType.A:
			return "#f6e05e";
		default:
			return "#f9aaa6";
	}
}

export const getCommodityRate = (ratesData: any, subtype: string, purity: string, currency: string) => {
	let rate = subtype === APIt.AssetSubType.Gold ? ratesData[GOLD] : ratesData[subtype];
	if(!rate) return 0;
	return rate * getFXRate(ratesData, currency) * Number.parseFloat(purity) / (subtype === APIt.AssetSubType.Gold ? 24 : 100);
}

export const getCryptoRate = (ratesData: any, cryptoCode: string, currency: string) => {
	let rate = ratesData[cryptoCode]
	if(!rate) return 0;
	return rate * getFXRate(ratesData, currency);
}