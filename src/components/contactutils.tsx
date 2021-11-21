import { GRAPHQL_AUTH_MODE } from '@aws-amplify/api-graphql';
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';
import { API } from 'aws-amplify';
import { ListContactssQuery, RegByImQuery, RegByMobQuery } from '../api/goals';
import { float } from 'aws-sdk/clients/lightsail';

export const doesEmailExist = async (email: string, authMode?: string) => {
	let nextToken = null;
	try {
		do {
			let variables: any = { limit: 20000, email: email };
			if (nextToken) variables.nextToken = nextToken;
			const { data: { listContactss } } = (await API.graphql({
				query: queries.listContactss,
				variables: variables,
				authMode: authMode === 'AWS_IAM' ? GRAPHQL_AUTH_MODE.AWS_IAM :GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
			})) as { data: ListContactssQuery };
			console.log(listContactss?.items);
			
			if(listContactss?.items?.length) return true;
			nextToken = listContactss?.nextToken;
		} while (nextToken);
		return false;
	} catch (e) {
		console.log('Error while checking if email address is unique: ', e);
	}
};

export const doesMobExist = async (mob: float) => {
	let nextToken = null;
	try {
		do {
			let variables: any = { limit: 20000, mob: mob };
			if (nextToken) variables.nextToken = nextToken;
			const { data: { regByMob } } = (await API.graphql({
				query: queries.regByMob,
				variables: variables,
			})) as { data: RegByMobQuery };
			console.log(regByMob?.items);
			if(regByMob?.items?.length) return true;
			nextToken = regByMob?.nextToken;
		} while (nextToken);
		return false;
	} catch (e) {
		console.log('Error while checking if mobile number is unique: ', e);
	}
};

export const doesImExist = async (im: float) => {
	let nextToken = null;
	try {
		do {
			let variables: any = { limit: 20000, im: im };
			if (nextToken) variables.nextToken = nextToken;
			const { data: { regByIM } } = (await API.graphql({
				query: queries.regByIm,
				variables: variables,
			})) as { data: RegByImQuery };
			console.log(regByIM?.items);
			if(regByIM?.items?.length) return true;
			nextToken = regByIM?.nextToken;
		} while (nextToken);
		return false;
	} catch (e) {
		console.log('Error while checking if email address is unique: ', e);
	}
};

export const createContact = async (email: string, mob: float, im: float, notify: boolean ) => {
	try {
		const data = await API.graphql({
			query: mutations.createContacts,
			variables: { input: { email, mob: mob ? mob : 0, im: im ? im : 0, notify } },
		});
		console.log(data);
	} catch (e) {
		console.log('Error while adding email in table', e);
	}
};

export const updateMobInContact = async (email:string, mob: float) => {
	try {
		const data = await API.graphql({
			query: mutations.updateContacts,
			variables: { input: { email, mob } },
		});
		console.log(data);
	} catch (e) {
		console.log('Error while adding mobile in table', e);
	}
};

export const updateImInContact = async (email: string, im: float) => {
	try {
		const data = await API.graphql({
			query: mutations.updateContacts,
			variables: { input: { email, im } },
		});
		console.log(data);
	} catch (e) {
		console.log('Error while adding im in table', e);
	}
};

export const updateEmailInContact = async (email: string, mob: float, im: float, notify: boolean ) => {
	try {
		const data = await API.graphql({
			query: mutations.updateContacts,
			variables: { input: { email, mob, im, notify } }
		});
		console.log(data);
	} catch (e) {
		console.log('Error while updating email in table', e);
	}
};

export const deleteContact = async (email: string) => {
	try {
		const data = await API.graphql({
			query: mutations.deleteContacts,
			variables: { input: { email } },
		});
		console.log(data);
	} catch (e) {
		console.log('Error while deleting contacts in table', e);
	}
};
