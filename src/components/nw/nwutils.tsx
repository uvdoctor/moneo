import * as mutations from '../../graphql/mutations';
import { API, graphqlOperation } from 'aws-amplify';
import * as APIt from '../../api/goals';

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

export const getAllFamilyMembers = () => {
	return {
		all: 'All Family Members',
		self: 'My Name (PAN: AAPD0000R)',
		partner: 'My Partner (PAN: AAPD0001R)',
		father: 'My Father (PAN: AAPD0002R)',
		mother: 'My Mother (PAN: AAPD0000R)',
		son: 'My Son (PAN: AAPD0001R)',
		daughter: 'My Daughter (PAN: AAPD0002R)'
	};
};
