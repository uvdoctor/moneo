import { GRAPHQL_AUTH_MODE } from '@aws-amplify/api-graphql';
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';
import { API } from 'aws-amplify';
import { ListRegEmailsQuery, ListRegMobsQuery } from '../api/goals';

export const doesEmailExist = async (email: string, authMode?: string) => {
	let nextToken = null;
	try {
		do {
			let variables: any = { limit: 20000, email: email };
			if (nextToken) variables.nextToken = nextToken;
			const { data: { listRegEmails } } = (await API.graphql({
				query: queries.listRegEmails,
				variables: variables,
				authMode: authMode === 'AWS_IAM' ? GRAPHQL_AUTH_MODE.AWS_IAM :GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
			})) as { data: ListRegEmailsQuery };
			if(listRegEmails?.items?.length) return true;
			nextToken = listRegEmails?.nextToken;
		} while (nextToken);
		return false;
	} catch (e) {
		console.log('Error while checking if email address is unique: ', e);
	}
};

export const doesMobileExist = async (mob: number) => {
	let nextToken = null;
	try {
		do {
			let variables: any = { limit: 20000, mob: mob };
			if (nextToken) variables.nextToken = nextToken;
			const { data: { listRegMobs } } = (await API.graphql({
				query: queries.listRegMobs,
				variables: variables,
			})) as { data: ListRegMobsQuery };
			if(listRegMobs?.items?.length) return true;
			nextToken = listRegMobs?.nextToken;
		} while (nextToken);
		return false;
	} catch (e) {
		console.log('Error while checking if mobile number is unique: ', e);
	}
};

export const addEmailOnceVerify = async (email: string, notify: string) => {
	try {
		const data = await API.graphql({
			query: mutations.createRegEmail,
			variables: { input: { email: email, notify: notify } },
		});
		console.log(data);
	} catch (e) {
		console.log('Error while adding email in table', e);
	}
};

export const addMobOnceVerify = async (mob: number, notify: string, cc:number) => {
	try {
		const data = await API.graphql({
			query: mutations.createRegMob,
			variables: { input: { mob: mob, notify: notify, cc:cc } },
		});
		console.log(data);
	} catch (e) {
		console.log('Error while adding mobile in table', e);
	}
};

export const deleteEmailOnceUpdated = async (email: string) => {
	try {
		const data = await API.graphql({
			query: mutations.deleteRegEmail,
			variables: { input: { email: email } },
		});
		console.log(data);
	} catch (e) {
		console.log('Error while deleting email in table', e);
	}
};

export const deleteMobOnceUpdated = async (mob: number) => {
	try {
		const data = await API.graphql({
			query: mutations.deleteRegMob,
			variables: { input: { mob: mob } },
		});
		console.log(data);
	} catch (e) {
		console.log('Error while deleting mobile in table', e);
	}
};
