import { API, graphqlOperation } from 'aws-amplify';
import React, { createContext, useEffect, useState } from 'react';
import simpleStorage from "simplestorage.js";
import { CreateEODPricesInput, ListEodPricessQuery } from '../api/goals';
import { listEodPricess } from '../graphql/queries';

const AppContext = createContext({});
export const LOCAL_INS_DATA_KEY = "insData";
export const LOCAL_RATES_DATA_KEY = "ratesData";
export const LOCAL_DATA_TTL = {TTL: 86400000}; //1 day

interface AppContextProviderProps {
	children: any;
}

function AppContextProvider({ children }: AppContextProviderProps) {
	const [ defaultCountry, setDefaultCountry ] = useState<string>('US');
	const [ defaultCurrency, setDefaultCurrency ] = useState<string>('USD');
	const [ username, setUsername ] = useState<string | null>(null);
	const [ appContextLoaded, setAppContextLoaded ] = useState<boolean>(false);
	const [ ratesData, setRatesData ] = useState<any>({});
	const [ insData, setInsData ] = useState<any>({});

	const loadFXCommCryptoRates = async () => {
		const { data: { listEODPricess } } = (await API.graphql(graphqlOperation(listEodPricess))) as {
			data: ListEodPricessQuery;
		};
		return listEODPricess?.items?.length ? (listEODPricess.items as Array<CreateEODPricesInput>) : null;
	};
	
	const initializeFXCommCryptoRates = async () => {
		let ratesData = simpleStorage.get(LOCAL_RATES_DATA_KEY);
		if(ratesData) {
			setRatesData(ratesData);
			return;
		}
		try {
			let result: Array<CreateEODPricesInput> | null = await loadFXCommCryptoRates();
			ratesData = {};
			if (result && result.length) {
				result.forEach((record: CreateEODPricesInput) => (ratesData[record.id] = record.price));
			}
			setRatesData(ratesData);
			simpleStorage.set(LOCAL_RATES_DATA_KEY, ratesData, LOCAL_DATA_TTL);
		} catch (err) {
			console.log('Unable to fetch fx, commodities & crypto rates: ', err);
			return false;
		}
	};

	useEffect(() => {
		const host = window.location.hostname;
		setDefaultCountry(host.endsWith('.in') || host.endsWith('host') ? 'IN' : host.endsWith('.uk') ? 'UK' : 'US');
		setDefaultCurrency(
			host.endsWith('.in') || host.endsWith('host') ? 'INR' : host.endsWith('.uk') ? 'GBP' : 'USD'
		);
		initializeFXCommCryptoRates();
		let localInsData = simpleStorage.get(LOCAL_INS_DATA_KEY);
		if(localInsData) setInsData(localInsData);
		setAppContextLoaded(true);
	}, []);

	return (
		<AppContext.Provider
			value={{
				defaultCountry,
				setDefaultCountry,
				defaultCurrency,
				setDefaultCurrency,
				username,
				setUsername,
				appContextLoaded,
				ratesData,
				insData,
				setInsData
			}}
		>
			{children}
		</AppContext.Provider>
	);
}

export { AppContext, AppContextProvider };
