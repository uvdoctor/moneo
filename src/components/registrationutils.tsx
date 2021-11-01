import { GRAPHQL_AUTH_MODE } from '@aws-amplify/api-graphql';
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';
import { API } from 'aws-amplify';

export const doesEmailExist = async (email: string) => {
	try {
		const { data: { listRegEmails: { items } } }: any = await API.graphql({
			query: queries.listRegEmails,
			variables: { email },
			authMode: GRAPHQL_AUTH_MODE.AWS_IAM
		});
		return items.length > 0;
	} catch (e) {
        console.log("Error while checking if email address is unique: ", e);
	}
};

export const addEmailPostSignup = async (email: string, user: string, notify: string) => {
	try {
		const data = await API.graphql({
			query: mutations.createRegEmail,
			variables: { input: { email, user, notify } },
			authMode: GRAPHQL_AUTH_MODE.AWS_IAM
		});
        console.log(data);
		return true;
	} catch (e) {
		console.log("Error while adding email address post sign-up: ", e);
	}
};
