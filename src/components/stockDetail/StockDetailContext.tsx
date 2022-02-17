import React, { createContext } from "react";

const StockDetailContext = createContext({});

function StockDetailContextProvider({ name, children }: any) {
	return (
		<StockDetailContext.Provider
			value={{
				name,
			}}
		>
			{children}
		</StockDetailContext.Provider>
	);
}

export { StockDetailContext as default, StockDetailContextProvider };
