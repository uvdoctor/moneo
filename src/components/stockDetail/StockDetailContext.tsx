import React, { createContext } from "react";

const StockDetailContext = createContext({});

function StockDetailContextProvider({ stock, children }: any) {
	return (
		<StockDetailContext.Provider
			value={{
				stock,
			}}
		>
			{children}
		</StockDetailContext.Provider>
	);
}

export { StockDetailContext as default, StockDetailContextProvider };
