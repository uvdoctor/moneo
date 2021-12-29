import { GRAPHQL_AUTH_MODE } from '@aws-amplify/api-graphql';
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';
import { API, graphqlOperation } from 'aws-amplify';
import { RegByImQuery, RegByMobQuery, RegByEmailQuery, RiskProfile } from '../api/goals';
import * as APIt from "../api/goals"

export const doesEmailExist = async (email: string, authMode?: string) => {
	let nextToken = null;
	try {
		do {
			let variables: any = { limit: 20000, email: email };
			if (nextToken) variables.nextToken = nextToken;
			const { data: { regByEmail } } = (await API.graphql({
				query: queries.regByEmail,
				variables: variables,
				authMode: authMode === 'AWS_IAM' ? GRAPHQL_AUTH_MODE.AWS_IAM :GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS
			})) as { data: RegByEmailQuery };
			console.log(regByEmail?.items);
			if(regByEmail?.items?.length) return true;
			nextToken = regByEmail?.nextToken;
		} while (nextToken);
		return false;
	} catch (e) {
		console.log('Error while checking if mobile number is unique: ', e);
	}
};

export const doesMobExist = async (mob: Number) => {
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

export const doesImExist = async (im: Number) => {
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

export const updateMobile = async (uname:string, mob: Number) => {
	try {
		const data = await API.graphql({
			query: mutations.updateUserInfo,
			variables: { input: { uname, mob } },
		});
		console.log(data);
	} catch (e) {
		console.log('Error while adding mobile in table', e);
	}
};

export const updateIm = async (uname: string, im: Number) => {
	try {
		const data = await API.graphql({
			query: mutations.updateUserInfo,
			variables: { input: { uname, im } },
		});
		console.log(data);
	} catch (e) {
		console.log('Error while adding im in table', e);
	}
};

export const updateEmail = async (uname: string, email: string) => {
	try {
		const data = await API.graphql({
			query: mutations.updateUserInfo,
			variables: { input: { uname, email } }
		});
		console.log(data);
	} catch (e) {
		console.log('Error while updating email in table', e);
	}
};

export const deleteContact = async (uname: string) => {
	try {
		const data = await API.graphql({
			query: mutations.deleteUserInfo,
			variables: { input: { uname } },
		});
		console.log(data);
	} catch (e) {
		console.log('Error while deleting contacts in table', e);
	}
};

export const createUserinfo = async (uname: string, email: string, notify: boolean, rp: RiskProfile, dr: number, tc: string) => {
	try {
		const data = await API.graphql({
			query: mutations.createUserInfo,
			variables: { input: {  uname, email, notify, rp, dr, tc } },
			authMode: GRAPHQL_AUTH_MODE.AWS_IAM
		});
		console.log(data);
	} catch(e) {
		console.log('Error while creating contacts in table', e);
	}
}
