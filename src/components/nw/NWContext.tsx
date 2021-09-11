import React, { createContext, useContext, useEffect, useState } from 'react';
import './nw.less';
import NWView from './NWView';
import { AppContext, LOCAL_DATA_TTL, LOCAL_INS_DATA_KEY } from '../AppContext';
import {
	addHoldings,
	doesHoldingMatch,
	doesMemberMatch,
	getCommodityRate,
	getRelatedCurrencies,
	loadAllFamilyMembers,
	loadHoldings,
	loadMatchingINBond,
	loadMatchingINExchange,
	loadMatchingINMutual,
	updateHoldings
} from './nwutils';
import { notification } from 'antd';
import {
	AssetSubType,
	AssetType,
	BalanceInput,
	CreateHoldingsInput,
	DepositInput,
	HoldingInput,
	INBond,
	INExchg,
	INMutual,
	InsType,
	InsuranceInput,
	LiabilityInput,
	PropertyInput,
	UpdateHoldingsInput
} from '../../api/goals';
import InstrumentValuation from './InstrumentValuation';
import { includesAny, initOptions } from '../utils';
import ViewHoldingInput from './ViewHoldingInput';
import simpleStorage from "simplestorage.js";

const NWContext = createContext({});

export const GOLD = 'GC';
export const SILVER = 'SI';
export const PLATINUM = 'PL';
export const PALLADIUM = 'PA';
export const BTC = 'BTC';
export const BTC_CASH = 'BCH';
export const ETHEREUM = 'ETH';
export const RIPPLE = 'XRP';
export const LITECOIN = 'LTC';
export const DASH = 'DASH';
export const MONERO = 'XMR';
export const ETHEREUM_CLASSIC = 'ETC';
export const DOGECOIN = 'DOGE';
export const STELLAR = 'XLM';
export const PM_TAB = 'Precious Metals';
export const FIN_TAB = 'Financial';

function NWContextProvider() {
	const { defaultCurrency, appContextLoaded, insData, setInsData, ratesData }: any = useContext(AppContext);
	const [ allFamily, setAllFamily ] = useState<any | null>(null);
	const [ instruments, setInstruments ] = useState<Array<HoldingInput>>([]);
	const [ preciousMetals, setPreciousMetals ] = useState<Array<HoldingInput>>([]);
	const [ properties, setProperties ] = useState<Array<PropertyInput>>([]);
	const [ vehicles, setVehicles ] = useState<Array<HoldingInput>>([]);
	const [ deposits, setDeposits ] = useState<Array<DepositInput>>([]);
	const [ lendings, setLendings ] = useState<Array<DepositInput>>([]);
	const [ savings, setSavings ] = useState<Array<BalanceInput>>([]);
	const [ ppf, setPPF ] = useState<Array<HoldingInput>>([]);
	const [ nps, setNPS ] = useState<Array<HoldingInput>>([]);
	const [ epf, setEPF ] = useState<Array<HoldingInput>>([]);
	const [ vpf, setVPF ] = useState<Array<HoldingInput>>([]);
	const [ memberships, setMemberships ] = useState<Array<HoldingInput>>([]);
	const [ others, setOthers ] = useState<Array<HoldingInput>>([]);
	const [ angel, setAngel ] = useState<Array<HoldingInput>>([]);
	const [ crypto, setCrypto ] = useState<Array<HoldingInput>>([]);
	const [ loans, setLoans ] = useState<Array<LiabilityInput>>([]);
	const [ insurance, setInsurance ] = useState<Array<InsuranceInput>>([]);
	const [ selectedMembers, setSelectedMembers ] = useState<Array<string>>([]);
	const [ currencyList, setCurrencyList ] = useState<any>({});
	const [ selectedCurrency, setSelectedCurrency ] = useState<string>('');
	const [ nw, setNW ] = useState<number>(0);
	const [ totalAssets, setTotalAssets ] = useState<number>(0);
	const [ totalInstruments, setTotalInstruments ] = useState<number>(0);
	const [ totalPM, setTotalPM ] = useState<number>(0);
	const [ totalProperties, setTotalProperties ] = useState<number>(0);
	const [ totalFRE, setTotalFRE ] = useState<number>(0);
	const [ totalVehicles, setTotalVehicles ] = useState<number>(0);
	const [ totalCrypto, setTotalCrypto ] = useState<number>(0);
	const [ totalSavings, setTotalSavings ] = useState<number>(0);
	const [ totalDeposits, setTotalDeposits ] = useState<number>(0);
	const [ totalPPF, setTotalPPF ] = useState<number>(0);
	const [ totalEPF, setTotalEPF ] = useState<number>(0);
	const [ totalVPF, setTotalVPF ] = useState<number>(0);
	const [ totalNPS, setTotalNPS ] = useState<number>(0);
	const [ totalLendings, setTotalLendings ] = useState<number>(0);
	const [ totalLoans, setTotalLoans ] = useState<number>(0);
	const [ totalInsurance, setTotalInsurance ] = useState<number>(0);
	const [ totalLiabilities, setTotalLiabilities ] = useState<number>(0);
	const [ totalMemberships, setTotalMemberships ] = useState<number>(0);
	const [ totalOthers, setTotalOthers ] = useState<number>(0);
	const [ totalAngel, setTotalAngel ] = useState<number>(0);
	const [ totalEquity, setTotalEquity ] = useState<number>(0);
	const [ totalFixed, setTotalFixed ] = useState<number>(0);
	const [ totalAlternative, setTotalAlternative ] = useState<number>(0);
	const [ totalPGold, setTotalPGold ] = useState<number>(0);
	const [ totalFGold, setTotalFGold ] = useState<number>(0);
	const [ showInsUpload, setShowInsUpload ] = useState<boolean>(false);
	const [ activeTab, setActiveTab ] = useState<string>(FIN_TAB);
	const [ activeTabSum, setActiveTabSum ] = useState<number>(0);
	const [ results, setResults ] = useState<Array<any>>([]);
	const [ loadingFamily, setLoadingFamily ] = useState<boolean>(true);
	const [ loadingHoldings, setLoadingHoldings ] = useState<boolean>(true);
	const [ id, setId ] = useState<string | null | undefined>(null);
	const [ childTab, setChildTab ] = useState<string>('');

	const tabs = {
		[FIN_TAB]: {
			label: FIN_TAB,
			hasUploader: true,
			data: instruments,
			setData: setInstruments,
			total: totalInstruments,
			contentComp: <InstrumentValuation />
		},
		Physical: {
			label: 'Physical',
			children: {
				Properties: {
					label: 'Properties',
					data: properties,
					setData: setProperties,
					total: totalProperties,
					contentComp: <InstrumentValuation />,
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
					contentComp: <InstrumentValuation />,
				},
				[PM_TAB]: {
					label: PM_TAB,
					data: preciousMetals,
					setData: setPreciousMetals,
					total: totalPM,
					subCategoryOptions: {
						[AssetSubType.Gold]: initOptions(8, 16),
						[SILVER]: {
							'100': 'Pure',
							'95.8': 'Brittania (95.8%)',
							'92.5': 'Sterling (92.5%)',
							'90': 'Coin (90%)',
							'80': 'Jewellery (80%)'
						},
						[PLATINUM]: {
							'100': 'Pure',
							'95': '95%',
							'90': '90%',
							'85': '85%',
							'80': '80%',
							'50': '50%'
						},
						[PALLADIUM]: {
							'100': 'Pure',
							'95': '95%',
							'90%': '90%',
							'85': '85%',
							'80': '80%',
							'50': '50%'
						}
					},
					categoryOptions: {
						[AssetSubType.Gold]: 'Gold',
						[SILVER]: 'Silver',
						[PLATINUM]: 'Platinum',
						[PALLADIUM]: 'Palladium'
					},
					viewComp: ViewHoldingInput,
				}
			},
		},
		Cash: {
			label: 'Cash',
			children: {
				'Deposits': {
					label: 'Deposits',
					data: deposits,
					setData: setDeposits,
					total: totalDeposits,
					contentComp: <InstrumentValuation />
				},
				'Saving Accounts': {
					label: 'Saving Accounts',
					data: savings,
					setData: setSavings,
					total: totalSavings,
					contentComp: <InstrumentValuation />
				},
				'Money Lent': {
					label: 'Money Lent',
					data: lendings,
					setData: setLendings,
					total: totalLendings,
					contentComp: <InstrumentValuation />
				},
			}
		},
		Retirement: {
			label: 'Retirement',
			children: {
				PPF: {
					label: 'PPF',
					data: ppf,
					setData: setPPF,
					total: totalPPF,
					contentComp: <InstrumentValuation />
				},
				'Employee PF': {
					label: 'Employee PF',
					data: epf,
					setData: setEPF,
					total: totalEPF,
					contentComp: <InstrumentValuation />
				},
				'Voluntary PF': {
					label: 'Voluntary PF',
					data: vpf,
					setData: setVPF,
					total: totalVPF,
					contentComp: <InstrumentValuation />
				},
				NPS: {
					label: 'NPS',
					data: nps,
					setData: setNPS,
					total: totalNPS,
					contentComp: <InstrumentValuation />
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
					viewComp: ViewHoldingInput,
				},
				Crypto: {
					label: 'Crypto',
					data: crypto,
					setData: setCrypto,
					total: totalCrypto,
					viewComp: ViewHoldingInput,
					categoryOptions: {
						[BTC]: 'Bitcoin',
						[BTC_CASH]: 'Bitcoin Cash',
						[DASH]: 'Dash',
						[DOGECOIN]: 'Dogecoin',
						[ETHEREUM]: 'Ethereum',
						[ETHEREUM_CLASSIC]: 'Ethereum Classic',
						[RIPPLE]: 'Ripple XRP',
						[LITECOIN]: 'Litecoin',
						[MONERO]: 'Monero',
						[STELLAR]: 'Stellar'
					}
				},
				'Angel Investments': {
					label: 'Angel Investments',
					data: angel,
					setData: setAngel,
					total: totalAngel,
					viewComp: ViewHoldingInput,
				},
				Other: {
					label: 'Other',
					data: crypto,
					setData: setCrypto,
					total: totalCrypto,
					viewComp: ViewHoldingInput,
				}, 
			}
		},
		Loans: {
			label: 'Loans',
			data: loans,
			setData: setLoans,
			total: totalLoans,
			contentComp: <InstrumentValuation />,
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
			contentComp: <InstrumentValuation />
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


	const initializeInsData = async (instruments: Array<HoldingInput>) => {
		let bondIds: Set<string> = new Set();
		let otherIds: Set<string> = new Set();
		let initFromDB = false;
		instruments.forEach((ins: HoldingInput) => {
			if(ins.type === AssetType.F) bondIds.add(ins.id);
			else otherIds.add(ins.id);
			if(!initFromDB && insData && !insData[ins.id]) initFromDB = true;
		});
		if(!initFromDB) return insData;
		let insCache: any = {};
		let bonds: Array<INBond> | null = null;
		if(bondIds.size) bonds = await loadMatchingINBond(Array.from(bondIds));
		if(bonds) bonds.forEach((bond: INBond) => {
			insCache[bond.id as string] = bond;
			bondIds.delete(bond.id as string);
		});
		bondIds.forEach((id:string) => otherIds.add(id));
		let mfs: Array<INMutual> | null = null;
		if(otherIds.size) mfs = await loadMatchingINMutual(Array.from(otherIds));
		if(mfs) mfs.forEach((mf: INMutual) => {
			insCache[mf.id as string] = mf;
			otherIds.delete(mf.id as string);
		});
		if(otherIds.size) {
			let exchgEntries: Array<INExchg> | null = await loadMatchingINExchange(Array.from(otherIds));
			exchgEntries?.forEach((entry: INExchg) => insCache[entry.id as string] = entry);
		}
		setInsData(insCache);
		simpleStorage.set(LOCAL_INS_DATA_KEY, insCache, LOCAL_DATA_TTL);
		return insCache;
	};

	const initializeHoldings = async () => {
		initializeFamilyList();
		let allHoldings: CreateHoldingsInput | null = null;
		try {
			allHoldings = await loadHoldings();
		} catch (err) {
			notification.error({ message: 'Holdings not loaded', description: 'Sorry! Unable to fetch holdings.' });
		}
		let currencyList = getRelatedCurrencies(allHoldings, defaultCurrency);
		setSelectedCurrency(Object.keys(currencyList)[0]);
		setCurrencyList(currencyList);
		setId(allHoldings?.id);
		if(id && allHoldings?.instruments?.length) 
			await initializeInsData(allHoldings?.instruments);
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
		setLoadingHoldings(false);
	};

	useEffect(
		() => {
			if (appContextLoaded) initializeHoldings();
		},
		[ appContextLoaded ]
	);

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

	useEffect(() => {
		setTotalAlternative(totalOthers + totalVehicles + totalProperties + totalPM + totalCrypto + totalMemberships + totalFGold + totalFRE);
	}, [totalOthers, totalVehicles, totalProperties, totalCrypto, totalMemberships, totalPM, totalFGold, totalFRE]);

	const pricePM = () => {
		if(!preciousMetals.length) {
			setTotalPM(0);
			setTotalPGold(0);
			return;
		}
		let total = 0;
		let totalPGold = 0;
		preciousMetals.forEach((instrument: HoldingInput) => {
			let rate = getCommodityRate(ratesData, instrument.subt as string, instrument.name as string, selectedCurrency);
			if(rate && doesMemberMatch(instrument, selectedMembers)) {
				total += instrument.qty * rate;
				if(instrument.subt === AssetSubType.Gold) totalPGold += instrument.qty * rate;
			}
		})
		setTotalPM(total);
		setTotalPGold(totalPGold);
	};

	const priceInstruments = () => {
		if(!instruments.length) {
			setTotalInstruments(0);
			setTotalFGold(0);
			setTotalFRE(0);
			setTotalEquity(0);
			setTotalFixed(0);
			return;
		}
		let total = 0;
		let totalFGold = 0;
		let totalFRE = 0;
		let totalEquity = 0;
		let totalFixed = 0;
		let cachedData = simpleStorage.get(LOCAL_INS_DATA_KEY);
		if(!cachedData) cachedData = insData;
		instruments.forEach((instrument: HoldingInput) => {
			if(insData[instrument.id] && doesHoldingMatch(instrument, selectedMembers, selectedCurrency)) {
				let value = instrument.qty * cachedData[instrument.id].price;
				total += value;
				if(instrument.subt === AssetSubType.GoldB) totalFGold += value;
				else if(insData[instrument.id].itype && cachedData[instrument.id].itype === InsType.REIT) 
					totalFRE += value;
				else if(instrument.type === AssetType.E) 
					totalEquity += value;
				else if(instrument.type === AssetType.F)
					totalFixed += value;
				else if(instrument.type === AssetType.H) {
					if(includesAny(instrument.name as string, ["conservative"])) {
						totalFixed += 0.7 * value;
						totalEquity += 0.3 * value;
					} else if(includesAny(instrument.name as string, ["multi-asset"])) {
						totalFGold += 0.1 * value;
						totalEquity += 0.6 * value;
						totalFixed += 0.3 * value;
					} else if(includesAny(instrument.name as string, ["balanced"])) {
						totalEquity += 0.6 * value;
						totalFixed += 0.4 * value;
					} else {
						totalFixed += 0.7 * value;
						totalEquity += 0.3 * value;
					}
				}
			}
		})
		setTotalInstruments(total);
		setTotalFGold(totalFGold);
		setTotalEquity(totalEquity);
		setTotalFixed(totalFixed);
		setTotalFRE(totalFRE);
	};

	const saveHoldings = async () => {
		let updatedHoldings: CreateHoldingsInput = {};
		if(instruments.length) updatedHoldings.instruments = instruments;
		if(savings.length) updatedHoldings.savings = savings;
		if(deposits.length) updatedHoldings.deposits = deposits;
		if(epf.length) updatedHoldings.epf = epf;
		if(ppf.length) updatedHoldings.ppf = ppf;
		if(vpf.length) updatedHoldings.vpf = vpf;
		if(loans.length) updatedHoldings.loans = loans;
		if(lendings.length) updatedHoldings.lendings = lendings;
		if(preciousMetals.length) updatedHoldings.pm = preciousMetals;
		if(vehicles.length) updatedHoldings.vehicles = vehicles;
		if(properties.length) updatedHoldings.property = properties;
		if(memberships.length) updatedHoldings.mem = memberships;
		if(angel.length) updatedHoldings.angel = angel;
		if(others.length) updatedHoldings.other = others;
		if(nps.length) updatedHoldings.nps = nps;
		if(crypto.length) updatedHoldings.crypto = crypto;
		if(id) updatedHoldings.id = id;
		try {
			if(id) await updateHoldings(updatedHoldings as UpdateHoldingsInput);
			else await addHoldings(updatedHoldings);
			notification.success({message: 'Data saved', description: 'All holdings data has been saved.'})
		} catch(e) {
			notification.error({message: 'Unable to save holdings', description: 'Sorry! An unexpected error occurred while trying to save the data.'});
		}
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

	const priceVPF = () => {
		setTotalVPF(0);
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
		priceVPF();
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
		priceVPF();
	}, [vpf]);

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
				totalVPF,
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
				vpf,
				setVPF,
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
				setAngel,
				totalEquity,
				totalPGold,
				totalFGold,
				totalFixed,
				totalAlternative,
				totalFRE,
				saveHoldings,
				childTab,
				setChildTab
			}}
		>
			<NWView />
		</NWContext.Provider>
	);
}

export { NWContext, NWContextProvider };
