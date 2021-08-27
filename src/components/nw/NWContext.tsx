import React, { createContext, useContext, useEffect, useState } from "react";
import "./nw.less";
import NWView from "./NWView";
import { AppContext } from "../AppContext";
import { createEmptyHoldings, getRelatedCurrencies, loadAllFamilyMembers, loadFXCommCryptoRates, loadHoldings } from "./nwutils";
import { notification } from "antd";
import { CreateEODPricesInput, CreateHoldingsInput } from "../../api/goals";
import InstrumentValuation from "./InstrumentValuation";
import PMValuation from "./PMValuation";

const NWContext = createContext({});

function NWContextProvider() {
	const { defaultCurrency, appContextLoaded }: any = useContext(AppContext);
	const [allFamily, setAllFamily] = useState<any>({});
	const [holdings, setHoldings] = useState<CreateHoldingsInput>(createEmptyHoldings());
	const [selectedMembers, setSelectedMembers] = useState<Array<string>>(['']);
	const [ currencyList, setCurrencyList ] = useState<any>({});
	const [selectedCurrency, setSelectedCurrency] = useState<string>('');
	const [nw, setNW] = useState<number>(0);
	const [totalAssets, setTotalAssets] = useState<number>(0);
	const [totalDemat, setTotalDemat] = useState<number>(0);
	const [totalPM, setTotalPM] = useState<number>(0);
	const [totalProperty, setTotalProperty] = useState<number>(0);
	const [totalVehicles, setTotalVehicles] = useState<number>(0);
	const [totalCrypto, setTotalCrypto] = useState<number>(0);
	const [totalLiabilities, setTotalLiabilities] = useState<number>(0);
	const [showInsUpload, setShowInsUpload] = useState<boolean>(false);
	const [taxId, setTaxId] = useState<string>("");
	const [activeTab, setActiveTab] = useState<string>("Demat Holdings");
	const [activeTabSum, setActiveTabSum] = useState<number>(0);
	const [results, setResults] = useState<Array<any>>([]);
	const [ loadingFamily, setLoadingFamily ] = useState<boolean>(true);
	const [ loadingHoldings, setLoadingHoldings ] = useState<boolean>(true);
	const [insData, setInsData] = useState<any>({});
	const [ratesData, setRatesData] = useState<any>({});

	const tabs = {
		"Demat Holdings": {
			label: "Demat Holdings",
			hasUploader: true,
			data: holdings?.instruments,
			content: <InstrumentValuation />
		},
		Properties: {
			label: "Properties",
			data: holdings?.property,
			content: <InstrumentValuation />,
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
			content: <InstrumentValuation />
		},
		"Precious Metals": {
			label: "Precious Metals",
			data: holdings?.pm,
			content: <PMValuation />
		},
		Deposits: {
			label: "Deposits",
			data: holdings?.deposits,
			content: <InstrumentValuation />
		},
		Savings: {
			label: "Savings",
			data: holdings?.savings,
			content: <InstrumentValuation />
		},
		PPF: {
			label: "PPF",
			data: holdings?.ppf,
			content: <InstrumentValuation />
		},
		EPF: {
			label: "EPF",
			data: holdings?.epf,
			content: <InstrumentValuation />
		},
		NPS: {
			label: "NPS",
			data: holdings?.nps,
			content: <InstrumentValuation />
		},
		Loans: {
			label: "Loans",
			data: holdings?.loans,
			content: <InstrumentValuation />,
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
			content: <InstrumentValuation />
		},
		Lendings: {
			label: "Lendings",
			data: holdings?.lendings,
			content: <InstrumentValuation />
		},
		Crypto: {
			label: "Crypto",
			data: holdings?.crypto,
			content: <InstrumentValuation />
		},
	};

	const initializeFamilyList = async () => {
        try {
            setAllFamily(await loadAllFamilyMembers());
			setLoadingFamily(false);
        } catch(err) {
            notification.error({message: 'Family list not loaded', description: 'Sorry! Unable to fetch details of your family members.'});
            return false;
        }
    };

	const initializeFXCommCryptoRates = async () => {
        try {
            let result: Array<CreateEODPricesInput> | null = await loadFXCommCryptoRates();
			if(result && result.length) {
				result.forEach((record: CreateEODPricesInput) => ratesData[record.id] = record.price);
			}
			setRatesData(ratesData);
        } catch(err) {
            console.log('Unable to fetch fx, commodities & crypto rates.');
            return false;
        }
    };

	const initializeHoldings = async () => {
        try {
			let allHoldings: CreateHoldingsInput = await loadHoldings();
			setHoldings(allHoldings);
			let currencyList = getRelatedCurrencies(allHoldings, defaultCurrency);
			setSelectedCurrency(Object.keys(currencyList)[0]);
			setCurrencyList(currencyList);
			setLoadingHoldings(false);
        } catch(err) {
            notification.error({message: 'Holdings not loaded', description: 'Sorry! Unable to fetch holdings.'});
            return false;
        }
    };

	useEffect(() => {
		if(appContextLoaded) initializeHoldings();
	}, [appContextLoaded]);

    useEffect(() => {
        initializeFamilyList();
		initializeFXCommCryptoRates();
    }
    , []);

	useEffect(() => {
		setNW(totalAssets - totalLiabilities);
	}, [totalAssets, totalLiabilities]);

	useEffect(() => {
		setTotalAssets(totalDemat + totalVehicles + totalPM + totalProperty + totalCrypto);
	}, [totalDemat, totalVehicles, totalPM, totalProperty, totalCrypto]);

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
				loadingFamily,
				loadingHoldings,
				currencyList,
				setCurrencyList,
				insData,
				setInsData,
				totalDemat,
				setTotalDemat,
				totalProperty,
				setTotalProperty,
				totalCrypto,
				setTotalCrypto,
				totalVehicles,
				setTotalVehicles,
				totalPM,
				setTotalPM,
			}}
		>
			<NWView />
		</NWContext.Provider>
	);
}

export { NWContext, NWContextProvider };
