import React, { createContext } from "react";
import "./nw.less";
import HoldingsParser from "./HoldingsParser";

const NWContext = createContext({});

function NWContextProvider() {

	return (
		<NWContext.Provider value={{

		}}>
			<HoldingsParser />
		</NWContext.Provider>
	);
}

export { NWContext, NWContextProvider }