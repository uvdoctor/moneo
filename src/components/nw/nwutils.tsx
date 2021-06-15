import * as mutations from '../../graphql/mutations';
import { API, graphqlOperation } from 'aws-amplify';
import * as APIt from '../../api/goals';
import * as queries from '../../graphql/queries';
import { ALL_FAMILY } from './FamilyInput';

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
	let holdings: Array<APIt.CreateHoldingsInput> | null = listHoldingss
		? listHoldingss.items as Array<APIt.CreateHoldingsInput>
		: null;
	return holdings ? holdings[0] : null;
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
