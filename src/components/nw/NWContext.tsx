import React, { createContext, useContext, useEffect, useState } from 'react';
import './nw.less';
import NWView from './NWView';
import { AppContext } from '../AppContext';
import {
	doesHoldingMatch,
	doesMemberMatch,
	getCommodityRate,
	getRelatedCurrencies,
	loadAllFamilyMembers,
	loadHoldings
} from './nwutils';
import { notification } from 'antd';
import {
	BalanceInput,
	CreateHoldingsInput,
	DepositInput,
	HoldingInput,
	InsuranceInput,
	LiabilityInput,
	Property
} from '../../api/goals';
import InstrumentValuation from './InstrumentValuation';
import DynamicHoldingInput from './DynamicHoldingInput';

const NWContext = createContext({});

export const GOLD = 'GC';
export const SILVER = 'SI';
export const PLATINUM = 'PL';
export const PALLADIUM = 'PA';

function NWContextProvider() {
	const { defaultCurrency, appContextLoaded, insData, ratesData }: any = useContext(AppContext);
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
	const [ memberships, setMemberships ] = useState<Array<HoldingInput>>([]);
	const [ others, setOthers ] = useState<Array<HoldingInput>>([]);
	const [ angel, setAngel ] = useState<Array<HoldingInput>>([]);
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
	const [ totalProperties, setTotalProperties ] = useState<number>(0);
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
	const [ totalMemberships, setTotalMemberships ] = useState<number>(0);
	const [ totalOthers, setTotalOthers ] = useState<number>(0);
	const [ totalAngel, setTotalAngel ] = useState<number>(0);
	const [ showInsUpload, setShowInsUpload ] = useState<boolean>(false);
	const [ taxId, setTaxId ] = useState<string>('');
	const [ activeTab, setActiveTab ] = useState<string>('Demat Holdings');
	const [ activeTabSum, setActiveTabSum ] = useState<number>(0);
	const [ results, setResults ] = useState<Array<any>>([]);
	const [ loadingFamily, setLoadingFamily ] = useState<boolean>(true);
	const [ loadingHoldings, setLoadingHoldings ] = useState<boolean>(true);

	const tabs = {
		Cash: {
			label: 'Cash',
			children: {
				'Deposits': {
					label: 'Deposits',
					data: deposits,
					setData: setDeposits,
					total: totalDeposits,
					content: <InstrumentValuation />
				},
				'Saving Accounts': {
					label: 'Saving Accounts',
					data: savings,
					setData: setSavings,
					total: totalSavings,
					content: <InstrumentValuation />
				},
				'Money Lent': {
					label: 'Money Lent',
					data: lendings,
					setData: setLendings,
					total: totalLendings,
					content: <InstrumentValuation />
				},
			}
		},
		Physical: {
			label: 'Physical',
			children: {
				Properties: {
					label: 'Properties',
					data: properties,
					setData: setProperties,
					total: totalProperties,
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
					setData: setVehicles,
					total: totalVehicles,
					content: <InstrumentValuation />,
				},
				'Precious Metals': {
					label: 'Precious Metals',
					data: preciousMetals,
					setData: setPreciousMetals,
					total: totalPM,
					content: <DynamicHoldingInput holdings={preciousMetals} changeHoldings={setPreciousMetals} />
				}
			},
		},
		Financial: {
			label: 'Financial',
			hasUploader: true,
			data: instruments,
			setData: setInstruments,
			total: totalInstruments,
			content: <InstrumentValuation />
		},
		Retirement: {
			label: 'Retirement',
			children: {
				PPF: {
					label: 'PPF',
					data: ppf,
					setData: setPPF,
					total: totalPPF,
					content: <InstrumentValuation />
				},
				EPF: {
					label: 'EPF',
					data: epf,
					setData: setEPF,
					total: totalEPF,
					content: <InstrumentValuation />
				},
				NPS: {
					label: 'NPS',
					data: nps,
					setData: setNPS,
					total: totalNPS,
					content: <InstrumentValuation />
				},
			}
		},
		Exotic: {
			label: 'Exotic',
			children: {
				Memberships: {
					label: 'Memberships',
					data: memberships,
					setData: setMemberships,
					total: totalMemberships,
					content: <DynamicHoldingInput holdings={crypto} changeHoldings={setCrypto} />
				},
				Crypto: {
					label: 'Crypto',
					data: crypto,
					setData: setCrypto,
					total: totalCrypto,
					content: <DynamicHoldingInput holdings={crypto} changeHoldings={setCrypto} />
				},
				'Angel Investments': {
					label: 'Angel Investments',
					data: angel,
					setData: setAngel,
					total: totalAngel,
					content: <DynamicHoldingInput holdings={crypto} changeHoldings={setCrypto} />
				},
				Other: {
					label: 'Other',
					data: crypto,
					setData: setCrypto,
					total: totalCrypto,
					content: <DynamicHoldingInput holdings={crypto} changeHoldings={setCrypto} />
				}, 
			}
		},
		Loans: {
			label: 'Loans',
			data: loans,
			setData: setLoans,
			total: totalLoans,
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
			total: totalInsurance,
			setData: setInsurance,
			content: <InstrumentValuation />
		},
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
			setAngel([ ...(allHoldings?.angel ? allHoldings.angel : []) ]);
			setMemberships([ ...(allHoldings?.mem ? allHoldings.mem : []) ]);
			setOthers([ ...(allHoldings?.other ? allHoldings.other : []) ]);
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
					totalProperties +
					totalCrypto +
					totalSavings +
					totalDeposits +
					totalLendings +
					totalPPF +
					totalEPF +
					totalNPS +
					totalAngel + 
					totalMemberships +
					totalOthers
			);
		},
		[
			totalInstruments,
			totalVehicles,
			totalPM,
			totalProperties,
			totalCrypto,
			totalSavings,
			totalDeposits,
			totalLendings,
			totalPPF,
			totalEPF,
			totalNPS,
			totalAngel,
			totalMemberships,
			totalOthers
		]
	);

	const pricePM = () => {
		let total = 0;
		preciousMetals.forEach((instrument: HoldingInput) => {
			let rate = getCommodityRate(ratesData, instrument.subt as string, instrument.name as string, selectedCurrency);
			if(rate && doesMemberMatch(instrument, selectedMembers)) total += instrument.qty * rate;
		})
		setTotalPM(total);
	};

	const priceInstruments = () => {
		let total = 0;
		instruments.forEach((instrument: HoldingInput) => {
			if(insData[instrument.id] && doesHoldingMatch(instrument, selectedMembers, selectedCurrency)) {
				total += instrument.qty * insData[instrument.id].price;
			}
		})
		setTotalInstruments(total);
	};

	const priceDeposits = () => {
		setTotalDeposits(0);
	};

	const priceLoans = () => {
		setTotalLoans(0);
	};

	const priceSavings = () => {
		setTotalSavings(0);
	};

	const priceMemberships = () => {
		setTotalMemberships(0);
	};

	const priceProperties = () => {
		setTotalProperties(0);
	};

	const priceVehicles = () => {
		setTotalVehicles(0);
	};

	const priceCrypto = () => {
		setTotalCrypto(0);
	};

	const priceAngel = () => {
		setTotalAngel(0);
	};

	const priceOthers = () => {
		setTotalOthers(0);
	};

	const pricePPF = () => {
		setTotalPPF(0);
	};

	const priceEPF = () => {
		setTotalEPF(0);
	};

	const priceNPS = () => {
		setTotalNPS(0);
	};

	const priceLendings = () => {
		setTotalLendings(0);
	};

	const priceInsurance = () => {
		setTotalInsurance(0);
	};

	useEffect(() => {
		priceInstruments();
		pricePM();
		pricePPF();
		priceNPS();
		priceEPF();
		priceAngel();
		priceProperties();
		priceVehicles();
		priceOthers();
		priceCrypto();
		priceLendings();
		priceInsurance();
		priceMemberships();
		priceLoans();
		priceSavings();
		priceDeposits();
	}, [selectedMembers, selectedCurrency]);

	useEffect(() => {
		priceInstruments();
	}, [instruments]);

	useEffect(() => {
		pricePM();
	}, [preciousMetals]);

	useEffect(() => {
		priceCrypto();
	}, [crypto]);

	useEffect(() => {
		priceAngel();
	}, [angel]);

	useEffect(() => {
		priceMemberships();
	}, [memberships]);

	useEffect(() => {
		priceOthers();
	}, [others]);

	useEffect(() => {
		pricePPF();
	}, [ppf]);

	useEffect(() => {
		priceEPF();
	}, [epf]);

	useEffect(() => {
		priceNPS();
	}, [nps]);

	useEffect(() => {
		priceLoans();
	}, [loans]);

	useEffect(() => {
		priceInsurance();
	}, [insurance]);

	useEffect(() => {
		priceProperties();
	}, [properties]);

	useEffect(() => {
		priceVehicles();
	}, [vehicles]);

	useEffect(() => {
		priceDeposits();
	}, [deposits]);

	useEffect(() => {
		priceInstruments();
	}, [instruments]);

	useEffect(() => {
		priceLendings();
	}, [lendings]);

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
				totalInstruments,
				totalProperties,
				totalCrypto,
				totalVehicles,
				totalPM,
				totalDeposits,
				totalSavings,
				totalPPF,
				totalEPF,
				totalNPS,
				totalLendings,
				totalInsurance,
				totalLoans,
				totalAngel,
				totalMemberships,
				totalOthers,
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
				setProperties,
				memberships,
				setMemberships,
				others,
				setOthers,
				angel,
				setAngel
			}}
		>
			<NWView />
		</NWContext.Provider>
	);
}

export { NWContext, NWContextProvider };
