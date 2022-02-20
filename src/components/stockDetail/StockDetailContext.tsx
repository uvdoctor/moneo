import React, { createContext, useEffect } from "react";
import useFetch from "../useFetch";

const StockDetailContext = createContext({});

function StockDetailContextProvider({ name, children }: any) {
	/* @ts-ignore */
	const [state, dispatch, loadData] = useFetch(`/api/details?name=${name}`);

	useEffect(() => {
		if (!name) return;
		loadData();
	}, [name]);

	return (
		<StockDetailContext.Provider
			value={{
				name,
				state,
			}}
		>
			{children}
		</StockDetailContext.Provider>
	);
}

export { StockDetailContext as default, StockDetailContextProvider };
