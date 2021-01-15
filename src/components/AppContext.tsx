import React, { createContext, useState } from 'react';

const AppContext = createContext({});

interface AppContextProviderProps {
	children: any;
}

function AppContextProvider({ children }: AppContextProviderProps) {
	const [ defaultCountry, setDefaultCountry ] = useState<string>('US');
	const [ defaultCurrency, setDefaultCurrency ] = useState<string>('USD');

	return (
		<AppContext.Provider
			value={{
				defaultCountry,
				setDefaultCountry,
				defaultCurrency,
				setDefaultCurrency
			}}
		>
			{children}
		</AppContext.Provider>
	);
}

export { AppContext, AppContextProvider };