import React, { createContext, useContext, useState, useEffect } from "react";
import { NWContext } from "../NWContext";
import formConfig from "./formConfig";

const Context = createContext({});

interface ContextProviderProp {
	children?: any;
}

function ContextProvider({ children }: ContextProviderProp) {
	const { activeTab }: any = useContext(NWContext);
	const [selectedType, setSelectedType] = useState(activeTab);
	const [selectedFormConfig, setSelectedFormConfig] = useState(
		//@ts-ignore
		formConfig[selectedType]
	);

	useEffect(() => {
		setSelectedType(activeTab);
	}, [activeTab]);

	function getHoldingOptions() {
		return Object.keys(formConfig);
	}

	function onHoldingTypeChange(value: any) {
		setSelectedType(value);
		//@ts-ignore
		setSelectedFormConfig(formConfig[value]);
	}

	return (
		<Context.Provider
			value={{
				selectedType,
				selectedFormConfig,
				getHoldingOptions,
				onHoldingTypeChange,
			}}
		>
			{children}
		</Context.Provider>
	);
}

export { Context, ContextProvider };
