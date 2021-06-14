import * as mutations from '../../graphql/mutations';
import { API, graphqlOperation } from 'aws-amplify';
import * as APIt from '../../api/goals';
import * as queries from '../../graphql/queries';

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
	try {
		const { data: { listFamilys } } = (await API.graphql(graphqlOperation(queries.listFamilys))) as {
			data: APIt.ListFamilysQuery;
		};
		let family: Array<APIt.CreateFamilyInput> | null = listFamilys
			? listFamilys.items as Array<APIt.CreateFamilyInput>
			: null;
		console.log('Got all family relations from db....', family);
		if(!family || !family.length) return {};
		let familyList: any = {};
		family.forEach((val: APIt.CreateFamilyInput) => {
			if(val.id) familyList[val.id as string] = {name: val.name, taxId: val.tid}
		});
		return familyList;
	} catch (e) {
		console.log('Error while getting family list: ', e);
		return null;
	}
};

export const addFamilyMember = async (name: string, taxId: string) => {
	try {
		const { data } = (await API.graphql(graphqlOperation(mutations.createFamily, { input: {name: name, tid: taxId} }))) as {
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
