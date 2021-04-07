import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useReducer,
} from "react";
import { NWContext } from "../NWContext";
import formConfig from "./formConfig";

const Context = createContext({});

interface ContextProviderProp {
	children?: any;
}

function ContextProvider({ children }: ContextProviderProp) {
	const { activeTab, onAddHoldings }: any = useContext(NWContext);
	const [selectedType, setSelectedType] = useState(activeTab);
	const [selectedFormConfig, setSelectedFormConfig] = useState(
		//@ts-ignore
		formConfig[selectedType]
	);
	const [formState, dispatch] = useReducer(
		reducer,
		getFormState(selectedFormConfig)
	);

	useEffect(() => {
		setSelectedType(activeTab);
		//@ts-ignore
		setSelectedFormConfig(formConfig[activeTab]);
		//@ts-ignore
		dispatch({
			type: "replace",
			//@ts-ignore
			data: formConfig[activeTab],
		});
	}, [activeTab]);

	function reducer(state: any, { type, name, value, data }: any) {
		switch (type) {
			case "fieldUpdate":
				return {
					...state,
					[name]: { value },
				};

			case "replace":
				return getFormState(data);
		}
	}

	function getHoldingOptions() {
		return Object.keys(formConfig);
	}

	function getFormState(data: any) {
		const formValues = {};

		data.forEach(({ name }: any) => {
			//@ts-ignore
			formValues[name] = {
				value: "",
			};
		});

		return formValues;
	}

	function onHoldingTypeChange(value: any) {
		setSelectedType(value);
		//@ts-ignore
		dispatch({
			type: "replace",
			//@ts-ignore
			data: formConfig[value],
		});
		//@ts-ignore
		setSelectedFormConfig(formConfig[value]);
	}

	function addHoldings() {
		onAddHoldings(formState);
	}

	return (
		<Context.Provider
			value={{
				selectedType,
				selectedFormConfig,
				getHoldingOptions,
				onHoldingTypeChange,
				formState,
				dispatch,
				addHoldings,
			}}
		>
			{children}
		</Context.Provider>
	);
}

export { Context, ContextProvider };
