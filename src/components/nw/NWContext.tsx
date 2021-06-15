import React, { createContext, useContext, useEffect, useState } from "react";
import "./nw.less";
import HoldingsDetails from "./HoldingsDetails";
import { AppContext } from "../AppContext";
import { loadAllFamilyMembers, loadHoldings } from "./nwutils";
import { notification } from "antd";
import { CreateHoldingsInput } from "../../api/goals";

const NWContext = createContext({});

function NWContextProvider() {
	const { defaultCurrency }: any = useContext(AppContext);
	const [allFamily, setAllFamily] = useState<any>({});
	const [holdings, setHoldings] = useState<CreateHoldingsInput>({});
	const [selectedMembers, setSelectedMembers] = useState<Array<string>>(['']);
	const [selectedCurrency, setSelectedCurrency] = useState<string>(
		defaultCurrency
	);
	const [nw, setNW] = useState<number>(0);
	const [totalAssets, setTotalAssets] = useState<number>(0);
	const [totalLiabilities, setTotalLiabilities] = useState<number>(0);
	const [showInsUpload, setShowInsUpload] = useState<boolean>(false);
	const [taxId, setTaxId] = useState<string>("");
	const [activeTab, setActiveTab] = useState<string>("Demat Holdings");
	const [activeTabSum, setActiveTabSum] = useState<number>(0);
	const [results, setResults] = useState<Array<any>>([]);
	const [ loading, setLoading ] = useState<boolean>(true);

	const tabs = {
		"Demat Holdings": {
			label: "Demat Holdings",
			hasUploader: true,
			data: holdings?.instruments
		},
		Properties: {
			label: "Properties",
			data: holdings?.property,
			formConfig: [
				{
					label: "Name",
					name: "name",
					type: "text",
				},
				{
					label: "Qty",
					name: "qty",
					type: "text",
				},
			],
		},
		Vehicles: {
			label: "Vehicles",
			data: holdings?.vehicles,
		},
		"Precious Metals": {
			label: "Precious Metals",
			data: holdings?.pm,
		},
		Deposits: {
			label: "Deposits",
			data: holdings?.deposits,
		},
		Savings: {
			label: "Savings",
			data: holdings?.savings,
		},
		PPF: {
			label: "PPF",
			data: holdings?.ppf,
		},
		EPF: {
			label: "EPF",
			data: holdings?.epf,
		},
		NPS: {
			label: "NPS",
			data: holdings?.nps,
		},
		Loans: {
			label: "Loans",
			data: holdings?.loans,
			formConfig: [
				{
					label: "Bank Name",
					name: "bankName",
					type: "text",
				},
				{
					label: "Bank Name",
					name: "bankName",
					type: "slect",
				},
				{
					label: "Amount",
					name: "amount",
					type: "text",
				},
				{
					label: "Duration",
					name: "duration",
					type: "text",
				},
				{
					label: "Interest Rate",
					name: "interestRate",
					type: "text",
				},
			],
		},
		Insurance: {
			label: "Insurance",
			data: holdings?.ins,
		},
		Lendings: {
			label: "Lendings",
			data: holdings?.lendings,
		},
		"Digital Coins": {
			label: "Digital Coins",
			data: holdings?.crypto,
		},
	};

	const initializeFamilyList = async () => {
        try {
            setAllFamily(await loadAllFamilyMembers());
        } catch(err) {
            notification.error({message: 'Family list not loaded', description: 'Sorry! Unable to fetch details of your family members.'});
            return false;
        }
    };

	const initializeHoldings = async () => {
        try {
            setHoldings(await loadHoldings());
        } catch(err) {
            notification.error({message: 'Holdings not loaded', description: 'Sorry! Unable to fetch holdings.'});
            return false;
        }
    };

    useEffect(() => {
        initializeHoldings().then(() => initializeFamilyList().then(() => setLoading(false)));
    }
    , []);

	return (
		<NWContext.Provider
			value={{
				tabs,
				activeTab,
				setActiveTab,
				holdings,
				setHoldings,
				showInsUpload,
				setShowInsUpload,
				taxId,
				setTaxId,
				nw,
				setNW,
				totalAssets,
				setTotalAssets,
				totalLiabilities,
				setTotalLiabilities,
				results,
				setResults,
				allFamily,
				setAllFamily,
				selectedMembers,
				setSelectedMembers,
				selectedCurrency,
				setSelectedCurrency,
				activeTabSum,
				setActiveTabSum,
				loading
			}}
		>
			<HoldingsDetails />
		</NWContext.Provider>
	);
}

export { NWContext, NWContextProvider };
