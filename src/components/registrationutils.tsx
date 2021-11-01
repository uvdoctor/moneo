import { GRAPHQL_AUTH_MODE } from '@aws-amplify/api-graphql';
import * as queries from '../graphql/queries';
import { API } from 'aws-amplify';
import { ListRegEmailsQuery } from '../api/goals';

export const doesEmailExist = async (email: string) => {
	let nextToken = null;
	try {
		do {
			let variables:any = {limit: 20000, email: email};
			if(nextToken) variables.nextToken = nextToken;
			const { data: { listRegEmails } } = (await API.graphql({
				query: queries.listRegEmails,
				variables: variables,
				authMode: GRAPHQL_AUTH_MODE.AWS_IAM
			})) as { data: ListRegEmailsQuery };
			if(listRegEmails?.items?.length) return true;
			nextToken = listRegEmails?.nextToken;
		} while(nextToken);
		return false;
	} catch (e) {
        console.log("Error while checking if email address is unique: ", e);
	}
};
