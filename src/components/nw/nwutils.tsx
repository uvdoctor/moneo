import * as mutations from '../../graphql/mutations';
import { API, graphqlOperation } from 'aws-amplify';
import * as APIt from '../../api/goals';
import * as queries from '../../graphql/queries';
import { ALL_FAMILY } from './FamilyInput';

export const createEmptyHoldings = () => {
	return {
		instruments: [],
		property: [],
		pm: [],
		ppf: [],
		epf: [],
		nps: [],
		vehicles: [],
		crypto: [],
		deposits: [],
		lendings: [],
		savings: [],
		ins: [],
		loans: []
	}
};

export const createNewItem = async (item: APIt.CreateItemInput) => {
	console.log('Going to create item...', item);
	try {
		const { data } = (await API.graphql(graphqlOperation(mutations.createItem, { input: item }))) as {
			data: APIt.CreateItemMutation;
		};
		console.log('New item created in db: ', data ? data.createItem : '');
		return data.createItem as APIt.CreateItemInput;
	} catch (e) {
		console.log('Error while creating item: ', e);
		return null;
	}
};

export const createNewAccount = async (account: APIt.CreateAccountInput) => {
	console.log('Going to create account...', account);
	try {
		const { data } = (await API.graphql(graphqlOperation(mutations.createAccount, { input: account }))) as {
			data: APIt.CreateAccountMutation;
		};
		console.log('New account created in db: ', data ? data.createAccount : '');
		return data.createAccount as APIt.CreateAccountInput;
	} catch (e) {
		console.log('Error while creating account: ', e);
		return null;
	}
};

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
	const { data: { listHoldingss } } = (await API.graphql(graphqlOperation(queries.listHoldingss))) as {
		data: APIt.ListHoldingssQuery;
	};
	return listHoldingss && listHoldingss.items?.length ? (listHoldingss.items as Array<APIt.CreateHoldingsInput>)[0] : createEmptyHoldings();
};

export const loadFXCommCryptoRates = async () => {
	const { data: { listEODPricess } } = (await API.graphql(graphqlOperation(queries.listEodPricess))) as {
		data: APIt.ListEodPricessQuery;
	};
	return listEODPricess?.items?.length ? (listEODPricess.items as Array<APIt.CreateEODPricesInput>) : null;
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

export const checkIfMemberExists = (allFamily: any, taxId: string) => {
	if(!allFamily) return null;
	let keys = Object.keys(allFamily);
	if(!keys.length || !keys[0]) return null;
	let filteredEntries = keys.filter((key: string) => allFamily[key].taxId === taxId);
	return filteredEntries.length ? filteredEntries[0] : null;
};

export const checkIfMemberIsSelected = (allFamily: any, selectedMembers: Array<string>, taxId: string) => {
	if(!allFamily) return null;
	if(!selectedMembers.length || !selectedMembers[0]) return null;
	let filteredEntries = selectedMembers.filter((key: string) => allFamily[key].taxId === taxId);
	return filteredEntries.length ? filteredEntries[0] : null;
};

export const addFamilyMemberSilently = async (allFamily: any, allFamilySetter: Function, taxId: string) => {
	let id = checkIfMemberExists(allFamily, taxId);
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

export const getFamilyNames = (selectedMembers: string[], allFamily: any) => {
	if (!selectedMembers || !selectedMembers.length || !selectedMembers[0]) return '';
	if (selectedMembers.includes(ALL_FAMILY)) return 'Family';
	if (!allFamily || !Object.keys(allFamily).length) return '';
	let result: string = allFamily[selectedMembers[0]].name;
	selectedMembers.forEach((key: string, index: number) => {
		if (index) result += `, ${allFamily[key].name}`;
	});
	return result;
};

export const getRelatedCurrencies = (holdings: APIt.CreateHoldingsInput, defaultCurrency: string) => {
	let currencyList: any = {[defaultCurrency]: defaultCurrency};
	if(!holdings || !Object.keys(holdings).length) return currencyList;
	Object.keys(holdings).forEach((key) => {
		//@ts-ignore
		let arr: Array<any> = holdings[key];
		arr.forEach((obj: any) => {
			if(!currencyList(obj.curr)) currencyList[obj.curr] = obj.curr;
		})
	})
	return currencyList;
}

const getORIdList = (list: Array<any>, ids: Array<string>) => {
	ids.forEach((id: string) => list.push({id: {eq: id}}));
	return {or: list};
}

export const loadMatchingINExchange = async (isins: Array<string>) => {
	if(!isins.length) return null;
	let idList: Array<APIt.ModelINExchangeFilterInput> = [];
	const { data: { listINExchanges } } = (await API.graphql(graphqlOperation(queries.listInExchanges, {limit: 10000, filter: getORIdList(idList, isins)}))) as {
		data: APIt.ListInExchangesQuery;
	};
	return listINExchanges?.items?.length ? listINExchanges.items as Array<APIt.INExchange> : null;
}

export const loadMatchingINMF = async (isins: Array<string>) => {
	if(!isins.length) return null;
	let idList: Array<APIt.ModelINMFFilterInput> = [];
	const { data: { listINMFs } } = (await API.graphql(graphqlOperation(queries.listInmFs, {limit: 20000, filter: getORIdList(idList, isins)}))) as {
		data: APIt.ListInmFsQuery;
	};
	return listINMFs?.items?.length ? listINMFs.items as Array<APIt.INMF> : null;
}

export const loadMatchingINBond = async (isins: Array<string>) => {
	if(!isins.length) return null;
	let idList: Array<APIt.ModelINBondFilterInput> = [];
	const { data: { listINBonds } } = (await API.graphql(graphqlOperation(queries.listInBonds, {limit: 10000, filter: getORIdList(idList, isins)}))) as {
		data: APIt.ListInBondsQuery;
	};
	return listINBonds?.items?.length ? listINBonds.items as Array<APIt.INBond> : null;
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
		[APIt.AssetSubType.GBO]: "Public Bond",
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
