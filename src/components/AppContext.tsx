import React, { createContext, useEffect, useState } from 'react';

const AppContext = createContext({});

interface AppContextProviderProps {
	children: any;
}

function AppContextProvider({ children }: AppContextProviderProps) {
	const [ defaultCountry, setDefaultCountry ] = useState<string>('US');
	const [ defaultCurrency, setDefaultCurrency ] = useState<string>('USD');
	const [ username, setUsername ] = useState<string | null>(null);
	const [ appContextLoaded, setAppContextLoaded ] = useState<boolean>(false);

	useEffect(() => {
		const host = window.location.hostname;
		setDefaultCountry(host.endsWith('.in') || host.endsWith('host') ? 'IN' : host.endsWith('.uk') ? 'UK' : 'US');
		setDefaultCurrency(
			host.endsWith('.in') || host.endsWith('host') ? 'INR' : host.endsWith('.uk') ? 'GBP' : 'USD'
		);
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
				appContextLoaded
			}}
		>
			{children}
		</AppContext.Provider>
	);
}

export { AppContext, AppContextProvider };
