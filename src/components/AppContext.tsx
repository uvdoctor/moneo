import { API, Auth, graphqlOperation, Hub } from 'aws-amplify';
import { useRouter } from 'next/router';
import React, { createContext, useEffect, useState } from 'react';
import simpleStorage from "simplestorage.js";
import { CreateEODPricesInput, ListEodPricessQuery } from '../api/goals';
import { ROUTES } from '../CONSTANTS';
import { listEodPricess } from '../graphql/queries';
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

const AppContext = createContext({});
export const LOCAL_INS_DATA_KEY = "insData";
export const LOCAL_RATES_DATA_KEY = "ratesData";
export const LOCAL_DATA_TTL = {TTL: 86400000}; //1 day
interface AppContextProviderProps {
	children: any;
}

function AppContextProvider({ children }: AppContextProviderProps) {
	const { executeRecaptcha } = useGoogleReCaptcha();
	const [ defaultCountry, setDefaultCountry ] = useState<string>('US');
	const [ defaultCurrency, setDefaultCurrency ] = useState<string>('USD');
	const [ user, setUser ] = useState<string | null>(null);
	const [ appContextLoaded, setAppContextLoaded ] = useState<boolean>(false);
	const [ ratesData, setRatesData ] = useState<any>({});
	
	const [ insData, setInsData ] = useState<any>({});
	const router = useRouter();
	
	const validateCaptcha = async (action: string) => {
		const token = await executeRecaptcha(action);
		let result = await fetch('/api/verifycaptcha', {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json;charset=utf-8'
		  },
		  body: JSON.stringify({
			token: token
		  })
		}).then((captchRes: any) => 
		  captchRes.json()
		).then((data: any) => data.success
		).catch((e : any) => {
		  console.log("error while validating captcha ", e);
		  return false;
		});
		return result;
	  }
	  
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

	const listener = async (capsule: any) => {
		let eventType: string = capsule.payload.event;
		if (eventType === 'signIn') setUser(capsule.payload.data);
		else if(eventType==="tokenRefresh")setUser(await Auth.currentAuthenticatedUser());
		else setUser(null);
	};

	const initData = async () => {
		let route = router.pathname;
		if(route === ROUTES.GET || route === ROUTES.SET) {
			await initializeFXCommCryptoRates();
			if(router.pathname === ROUTES.GET) {
				let localInsData = simpleStorage.get(LOCAL_INS_DATA_KEY);
				if(localInsData) setInsData(localInsData);
			}
		}
	};

	const initUserAndData = async () => {
		Hub.listen('auth', listener);
		let user = null;
		try {
			user = await Auth.currentAuthenticatedUser();
			if(user) await initData();
		} catch (e) {
			console.log('Error while logging in: ', e);
		} finally {
			setUser(user);
		}
	};

	const handleLogout = async () => {
		try {
			await Auth.signOut();
			Hub.dispatch('auth', { event: 'signOut' });
		} catch (error) {
			console.log('error signing out: ', error);
		} finally {
			router.reload();
		}
	};

	useEffect(() => {
		const host = window.location.hostname;
		setDefaultCountry(host.endsWith('.in') || host.endsWith('host') ? 'IN' : host.endsWith('.uk') ? 'UK' : 'US');
		setDefaultCurrency(
			host.endsWith('.in') || host.endsWith('host') ? 'INR' : host.endsWith('.uk') ? 'GBP' : 'USD'
		);
		initUserAndData().then(() => setAppContextLoaded(true));
		return () => Hub.remove('auth', listener);
	}, []);

	return (
		<AppContext.Provider
			value={{
				defaultCountry,
				setDefaultCountry,
				defaultCurrency,
				setDefaultCurrency,
				user,
				appContextLoaded,
				ratesData,
				insData,
				setInsData,
				handleLogout,
				validateCaptcha
			}}
		>
			{children}
		</AppContext.Provider>
	);
}

export { AppContext, AppContextProvider };
