import React, { createContext, useEffect, useState } from 'react';

const AppContext = createContext({});

interface AppContextProviderProps {
	children: any;
}

function AppContextProvider({ children }: AppContextProviderProps) {
	const [ defaultCountry, setDefaultCountry ] = useState<string>('US');
	const [ defaultCurrency, setDefaultCurrency ] = useState<string>('USD');

	useEffect(() => {
		const host = window.location.hostname;
		if (host.endsWith('.in')) {
			setDefaultCountry('IN');
			setDefaultCurrency('INR');
		} else if (host.endsWith('.uk')) {
			setDefaultCountry('UK');
			setDefaultCurrency('GBP');
		}
	}, []);

	return (
		<AppContext.Provider
			value={{
				defaultCountry,
				defaultCurrency
			}}
		>
			{children}
		</AppContext.Provider>
	);
}

export { AppContext, AppContextProvider };