import React, { createContext, useState, useEffect, useContext } from 'react';
import * as queries from '../../graphql/queries';
import * as mutations from '../../graphql/mutations';
import awsconfig from '../../aws-exports';
import { GRAPHQL_AUTH_MODE } from '@aws-amplify/api-graphql';
import Amplify, { API } from 'aws-amplify';
import { Status } from '../../api/goals';
import { AppContext } from '../AppContext';

Amplify.configure(awsconfig);

const JoinContext = createContext({});
const JOIN_KEY = 'joinData';

interface JoinContextProviderProps {
	children: any;
}

function JoinContextProvider({ children }: JoinContextProviderProps) {
	const { defaultCountry, setDefaultCountry }: any = useContext(AppContext);
	const [ email, setEmail ] = useState<string>('');
	const [ country, setCountry ] = useState<string>();
	const [ status, setStatus ] = useState<Status>(Status.N);
	const [ isLoading, setLoading ] = useState<boolean>(false);
	const [ showVerifyModal, setShowVerifyModal ] = useState<boolean>(false);
	const [ error, setError ] = useState({});

	useEffect(() => {
		const { email, country, status } = JSON.parse(localStorage.getItem(JOIN_KEY) || '{}');
		let userCountry = country ? country : defaultCountry;
		if (country) setDefaultCountry(country);
		setDefaultCountry(userCountry);
		setCountry(userCountry);
		if (!email) return;
		setStatus(status);
		setEmail(email);
		setShowVerifyModal(status === Status.P);
		if (status === Status.Y)
			setError({
				type: 'warning',
				title: 'Already Registered',
				message: `You are already registered with ${email}`
			});
	}, []);

	const doesEntryExist = async (email: string) => {
		try {
			const { data: { listRegistrations: { items } } }: any = await API.graphql({
				query: queries.listRegistrations,
				variables: { email },
				authMode: GRAPHQL_AUTH_MODE.AWS_IAM
			});
			if (items.length === 0) return false;

			const { status } = items[0];

			setStatus(status);

			if (status === Status.P) setShowVerifyModal(true);
			if (email) {
				status === Status.P
					? setError({
							title: 'Email Already Registered',
							message: `${email} has already been registered. Either verify this account or try again with another email address.`
						})
					: setError({
							title: 'Email Already Registered',
							message: `${email} has already been registered. You can try with another email address.`
						});
			}
		} catch (e) {
			setError({
				title: 'Error while checking for existing registration',
				message: e.toString()
			});
			return true;
		}
	};

	const onFormSubmit = async ({ country, email }: any) => {
		setLoading(true);
		setCountry(country);
		setEmail(email);

		if (await doesEntryExist(email)) {
			setLoading(false);
			return;
		}

		try {
			const status = Status.P;
			const result = await API.graphql({
				query: mutations.createRegistration,
				variables: {
					input: {
						email,
						status,
						country,
						code: 'a123'
					}
				},
				authMode: GRAPHQL_AUTH_MODE.AWS_IAM
			});

			if (result) {
				localStorage.setItem(JOIN_KEY, JSON.stringify({ country, email, status }));
				setStatus(status);
			}
		} catch (e) {
			setError({
				title: 'Error while registering',
				message: e.errors ? e.errors[0].message : e.toString()
			});
		}

		setLoading(false);
	};

	const onSecurityCode = () => {
		setLoading(true);

		setTimeout(function() {
			setLoading(false);
			setStatus(Status.Y);
			localStorage.setItem(JOIN_KEY, JSON.stringify({ country, email, status: Status.Y }));
		}, 5000);
	};

	return (
		<JoinContext.Provider
			value={{
				email,
				country,
				isLoading,
				status,
				showVerifyModal,
				setShowVerifyModal,
				error,
				onFormSubmit,
				onSecurityCode
			}}
		>
			{children}
		</JoinContext.Provider>
	);
}

export { JoinContextProvider, JoinContext };
