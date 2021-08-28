import React, { createContext, useContext, useEffect, useState } from 'react';
import './nw.less';
import NWView from './NWView';
import { AppContext } from '../AppContext';
import {
	doesHoldingMatch,
	getRelatedCurrencies,
	loadAllFamilyMembers,
	loadFXCommCryptoRates,
	loadHoldings
} from './nwutils';
import { notification } from 'antd';
import {
	BalanceInput,
	CreateEODPricesInput,
	CreateHoldingsInput,
	DepositInput,
	HoldingInput,
	InsuranceInput,
	LiabilityInput,
	Property
} from '../../api/goals';
import InstrumentValuation from './InstrumentValuation';
import PMValuation from './PMValuation';

const NWContext = createContext({});

function NWContextProvider() {
	const { defaultCurrency, appContextLoaded }: any = useContext(AppContext);
	const [ allFamily, setAllFamily ] = useState<any>({});
	const [ instruments, setInstruments ] = useState<Array<HoldingInput>>([]);
	const [ preciousMetals, setPreciousMetals ] = useState<Array<HoldingInput>>([]);
	const [ properties, setProperties ] = useState<Array<Property>>([]);
	const [ vehicles, setVehicles ] = useState<Array<HoldingInput>>([]);
	const [ deposits, setDeposits ] = useState<Array<DepositInput>>([]);
	const [ lendings, setLendings ] = useState<Array<DepositInput>>([]);
	const [ savings, setSavings ] = useState<Array<BalanceInput>>([]);
	const [ ppf, setPPF ] = useState<Array<HoldingInput>>([]);
	const [ nps, setNPS ] = useState<Array<HoldingInput>>([]);
	const [ epf, setEPF ] = useState<Array<HoldingInput>>([]);
	const [ crypto, setCrypto ] = useState<Array<HoldingInput>>([]);
	const [ loans, setLoans ] = useState<Array<LiabilityInput>>([]);
	const [ insurance, setInsurance ] = useState<Array<InsuranceInput>>([]);
	const [ selectedMembers, setSelectedMembers ] = useState<Array<string>>([ '' ]);
	const [ currencyList, setCurrencyList ] = useState<any>({});
	const [ selectedCurrency, setSelectedCurrency ] = useState<string>('');
	const [ nw, setNW ] = useState<number>(0);
	const [ totalAssets, setTotalAssets ] = useState<number>(0);
	const [ totalInstruments, setTotalInstruments ] = useState<number>(0);
	const [ totalPM, setTotalPM ] = useState<number>(0);
	const [ totalProperty, setTotalProperty ] = useState<number>(0);
	const [ totalVehicles, setTotalVehicles ] = useState<number>(0);
	const [ totalCrypto, setTotalCrypto ] = useState<number>(0);
	const [ totalSavings, setTotalSavings ] = useState<number>(0);
	const [ totalDeposits, setTotalDeposits ] = useState<number>(0);
	const [ totalPPF, setTotalPPF ] = useState<number>(0);
	const [ totalEPF, setTotalEPF ] = useState<number>(0);
	const [ totalNPS, setTotalNPS ] = useState<number>(0);
	const [ totalLendings, setTotalLendings ] = useState<number>(0);
	const [ totalLoans, setTotalLoans ] = useState<number>(0);
	const [ totalInsurance, setTotalInsurance ] = useState<number>(0);
	const [ totalLiabilities, setTotalLiabilities ] = useState<number>(0);
	const [ showInsUpload, setShowInsUpload ] = useState<boolean>(false);
	const [ taxId, setTaxId ] = useState<string>('');
	const [ activeTab, setActiveTab ] = useState<string>('Demat Holdings');
	const [ activeTabSum, setActiveTabSum ] = useState<number>(0);
	const [ results, setResults ] = useState<Array<any>>([]);
	const [ loadingFamily, setLoadingFamily ] = useState<boolean>(true);
	const [ loadingHoldings, setLoadingHoldings ] = useState<boolean>(true);
	const [ insData, setInsData ] = useState<any>({});
	const [ ratesData, setRatesData ] = useState<any>({});

	const tabs = {
		'Demat Holdings': {
			label: 'Demat Holdings',
			hasUploader: true,
			data: instruments,
			content: <InstrumentValuation />
		},
		Properties: {
			label: 'Properties',
			data: properties,
			content: <InstrumentValuation />,
			formConfig: [
				{
					label: 'Name',
					name: 'name',
					type: 'text'
				},
				{
					label: 'Qty',
					name: 'qty',
					type: 'text'
				}
			]
		},
		Vehicles: {
			label: 'Vehicles',
			data: vehicles,
			content: <InstrumentValuation />
		},
		'Precious Metals': {
			label: 'Precious Metals',
			data: preciousMetals,
			content: <PMValuation />
		},
		Deposits: {
			label: 'Deposits',
			data: deposits,
			content: <InstrumentValuation />
		},
		Savings: {
			label: 'Savings',
			data: savings,
			content: <InstrumentValuation />
		},
		PPF: {
			label: 'PPF',
			data: ppf,
			content: <InstrumentValuation />
		},
		EPF: {
			label: 'EPF',
			data: epf,
			content: <InstrumentValuation />
		},
		NPS: {
			label: 'NPS',
			data: nps,
			content: <InstrumentValuation />
		},
		Loans: {
			label: 'Loans',
			data: loans,
			content: <InstrumentValuation />,
			formConfig: [
				{
					label: 'Bank Name',
					name: 'bankName',
					type: 'text'
				},
				{
					label: 'Bank Name',
					name: 'bankName',
					type: 'select'
				},
				{
					label: 'Amount',
					name: 'amount',
					type: 'text'
				},
				{
					label: 'Duration',
					name: 'duration',
					type: 'text'
				},
				{
					label: 'Interest Rate',
					name: 'interestRate',
					type: 'text'
				}
			]
		},
		Insurance: {
			label: 'Insurance',
			data: insurance,
			content: <InstrumentValuation />
		},
		Lendings: {
			label: 'Lendings',
			data: lendings,
			content: <InstrumentValuation />
		},
		Crypto: {
			label: 'Crypto',
			data: crypto,
			content: <InstrumentValuation />
		}
	};

	const initializeFamilyList = async () => {
		try {
			setAllFamily(await loadAllFamilyMembers());
			setLoadingFamily(false);
		} catch (err) {
			notification.error({
				message: 'Family list not loaded',
				description: 'Sorry! Unable to fetch details of your family members.'
			});
			return false;
		}
	};

	const initializeFXCommCryptoRates = async () => {
		try {
			let result: Array<CreateEODPricesInput> | null = await loadFXCommCryptoRates();
			if (result && result.length) {
				result.forEach((record: CreateEODPricesInput) => (ratesData[record.id] = record.price));
			}
			setRatesData(ratesData);
		} catch (err) {
			console.log('Unable to fetch fx, commodities & crypto rates.');
			return false;
		}
	};

	const initializeHoldings = async () => {
		try {
			let allHoldings: CreateHoldingsInput | null = await loadHoldings();
			let currencyList = getRelatedCurrencies(allHoldings, defaultCurrency);
			setSelectedCurrency(Object.keys(currencyList)[0]);
			setCurrencyList(currencyList);
			setLoadingHoldings(false);
			setInstruments([ ...(allHoldings?.instruments ? allHoldings.instruments : []) ]);
			setPreciousMetals([ ...(allHoldings?.pm ? allHoldings.pm : []) ]);
			setPPF([ ...(allHoldings?.ppf ? allHoldings.ppf : []) ]);
			setEPF([ ...(allHoldings?.epf ? allHoldings.epf : []) ]);
			setNPS([ ...(allHoldings?.nps ? allHoldings.nps : []) ]);
			setCrypto([ ...(allHoldings?.crypto ? allHoldings.crypto : []) ]);
			setVehicles([ ...(allHoldings?.vehicles ? allHoldings.vehicles : []) ]);
			setLoans([ ...(allHoldings?.loans ? allHoldings.loans : []) ]);
			setInsurance([ ...(allHoldings?.ins ? allHoldings.ins : []) ]);
			setVehicles([ ...(allHoldings?.vehicles ? allHoldings.vehicles : []) ]);
			setDeposits([ ...(allHoldings?.deposits ? allHoldings.deposits : []) ]);
			setSavings([ ...(allHoldings?.savings ? allHoldings.savings : []) ]);
			setLendings([ ...(allHoldings?.lendings ? allHoldings.lendings : []) ]);
		} catch (err) {
			notification.error({ message: 'Holdings not loaded', description: 'Sorry! Unable to fetch holdings.' });
			return false;
		}
	};

	useEffect(
		() => {
			if (appContextLoaded) initializeHoldings();
		},
		[ appContextLoaded ]
	);

	useEffect(() => {
		initializeFamilyList();
		initializeFXCommCryptoRates();
	}, []);

	useEffect(
		() => {
			setNW(totalAssets - totalLiabilities);
		},
		[ totalAssets, totalLiabilities ]
	);

	useEffect(
		() => {
			setTotalLiabilities(totalLoans + totalInsurance);
		},
		[ totalLoans, totalInsurance ]
	);

	useEffect(
		() => {
			setTotalAssets(
				totalInstruments +
					totalVehicles +
					totalPM +
					totalProperty +
					totalCrypto +
					totalSavings +
					totalDeposits +
					totalLendings +
					totalPPF +
					totalEPF +
					totalNPS
			);
		},
		[
			totalInstruments,
			totalVehicles,
			totalPM,
			totalProperty,
			totalCrypto,
			totalSavings,
			totalDeposits,
			totalLendings,
			totalPPF,
			totalEPF,
			totalNPS
		]
	);

	const priceInstruments = () => {
		let total = 0;
		instruments.forEach((instrument: HoldingInput) => {
			if(insData[instrument.id] && doesHoldingMatch(instrument, selectedMembers, selectedCurrency)) {
				console.log("Going to price: ", instrument.id);
				console.log(instrument.qty * insData[instrument.id].price);
				total += instrument.qty * insData[instrument.id].price;
			}
		})
		console.log("Total is: ", total);
		setTotalInstruments(total);
	};

	useEffect(() => {
		priceInstruments();
	}, [instruments, selectedMembers, selectedCurrency]);

	return (
		<NWContext.Provider
			value={{
				tabs,
				activeTab,
				setActiveTab,
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
				totalInstruments,
				setTotalInstruments,
				totalProperty,
				setTotalProperty,
				totalCrypto,
				setTotalCrypto,
				totalVehicles,
				setTotalVehicles,
				totalPM,
				setTotalPM,
				totalDeposits,
				setTotalDeposits,
				totalSavings,
				setTotalSavings,
				totalPPF,
				setTotalPPF,
				totalEPF,
				setTotalEPF,
				totalNPS,
				setTotalNPS,
				totalLendings,
				setTotalLendings,
				totalInsurance,
				setTotalInsurance,
				totalLoans,
				setTotalLoans,
				instruments,
				setInstruments,
				preciousMetals,
				setPreciousMetals,
				loans,
				setLoans,
				insurance,
				setInsurance,
				vehicles,
				setVehicles,
				ppf,
				setPPF,
				epf,
				setEPF,
				nps,
				setNPS,
				crypto,
				setCrypto,
				savings,
				setSavings,
				deposits,
				setDeposits,
				lendings,
				setLendings,
				properties,
				setProperties
			}}
		>
			<NWView />
		</NWContext.Provider>
	);
}

export { NWContext, NWContextProvider };
