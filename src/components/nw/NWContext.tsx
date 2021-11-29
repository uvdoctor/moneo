import React, { createContext, useContext, useEffect, useState } from 'react';
require('./nw.less');
import NWView from './NWView';
import { AppContext, LOCAL_DATA_TTL, LOCAL_INS_DATA_KEY } from '../AppContext';
import {
	addHoldings,
	doesHoldingMatch,
	doesMemberMatch,
	doesOwnershipMatch,
	getCommodityRate,
	getCryptoRate,
	getNPSData,
	getNPSFundManagers,
	getRelatedCurrencies,
	getRemainingDuration,
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
	CreateUserHoldingsInput,
	CreateNPSInput,
	HoldingInput,
	INBond,
	INExchg,
	INMutual,
	InsType,
	PropertyInput,
	UpdateUserHoldingsInput
} from '../../api/goals';
import InstrumentValuation from './InstrumentValuation';
import { includesAny, initOptions } from '../utils';
import ViewHoldingInput from './ViewHoldingInput';
import simpleStorage from "simplestorage.js";
import { getCompoundedIncome, getNPV } from '../calc/finance';

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

export const TAB = {
	PM: 'Precious Metals',
	CRYPTO: 'Crypto',
	FIN: 'Financial',
	STOCK: 'Stock',
	MF: 'Mutual Fund',
	BOND: 'Bond',
	ETF: 'ETF',
	GOLDB: 'Gold Bond',
	SAV: 'Saving Accounts',
	LENT: 'Lendings',
	OTHER: 'Others',
	NPS: 'NPS',
	PF: 'Provident Funds',
	VEHICLE: 'Vehicles',
	ANGEL: 'Angel Investments',
	PROP: 'Properties',
	LOAN: 'Loans',
	INS: 'Insurance',
	CREDIT: 'Credit'
};

function NWContextProvider() {
	const { defaultCurrency, appContextLoaded, insData, setInsData, ratesData, owner }: any = useContext(AppContext);
	const [ allFamily, setAllFamily ] = useState<any | null>(null);
	const [ instruments, setInstruments ] = useState<Array<HoldingInput>>([]);
	const [ preciousMetals, setPreciousMetals ] = useState<Array<HoldingInput>>([]);
	const [ properties, setProperties ] = useState<Array<PropertyInput>>([]);
	const [ vehicles, setVehicles ] = useState<Array<HoldingInput>>([]);
	const [ lendings, setLendings ] = useState<Array<HoldingInput>>([]);
	const [ savings, setSavings ] = useState<Array<HoldingInput>>([]);
	const [ pf, setPF ] = useState<Array<HoldingInput>>([]);
	const [ nps, setNPS ] = useState<Array<HoldingInput>>([]);
	const [ others, setOthers ] = useState<Array<HoldingInput>>([]);
	const [ crypto, setCrypto ] = useState<Array<HoldingInput>>([]);
	const [ angel, setAngel ] = useState<Array<HoldingInput>>([]);
	const [ loans, setLoans ] = useState<Array<HoldingInput>>([]);
	const [ insurance, setInsurance ] = useState<Array<HoldingInput>>([]);
	const [ credit, setCredit ] = useState<Array<HoldingInput>>([]);
	const [ selectedMembers, setSelectedMembers ] = useState<Array<string>>([]);
	const [ currencyList, setCurrencyList ] = useState<any>({});
	const [ selectedCurrency, setSelectedCurrency ] = useState<string>('');
	const [ nw, setNW ] = useState<number>(0);
	const [ totalAssets, setTotalAssets ] = useState<number>(0);
	const [ totalInstruments, setTotalInstruments ] = useState<number>(0);
	const [ totalPM, setTotalPM ] = useState<number>(0);
	const [ totalProperties, setTotalProperties ] = useState<number>(0);
	const [ totalFRE, setTotalFRE ] = useState<number>(0);
	const [ totalFEquity, setTotalFEquity ] = useState<number>(0);
	const [ totalNPSEquity, setTotalNPSEquity ] = useState<number>(0);
	const [ totalFFixed, setTotalFFixed ] = useState<number>(0);
	const [ totalNPSFixed, setTotalNPSFixed ] = useState<number>(0);
	const [ totalVehicles, setTotalVehicles ] = useState<number>(0);
	const [ totalCrypto, setTotalCrypto ] = useState<number>(0);
	const [ totalSavings, setTotalSavings ] = useState<number>(0);
	const [ totalPF, setTotalPF ] = useState<number>(0);
	const [ totalNPS, setTotalNPS ] = useState<number>(0);
	const [ totalAngel, setTotalAngel ] = useState<number>(0);
	const [ totalLendings, setTotalLendings ] = useState<number>(0);
	const [ totalLoans, setTotalLoans ] = useState<number>(0);
	const [ totalInsurance, setTotalInsurance ] = useState<number>(0);
	const [ totalCredit, setTotalCredit ] = useState<number>(0);
	const [ totalLiabilities, setTotalLiabilities ] = useState<number>(0);
	const [ totalOthers, setTotalOthers ] = useState<number>(0);
	const [ totalEquity, setTotalEquity ] = useState<number>(0);
	const [ totalFixed, setTotalFixed ] = useState<number>(0);
	const [ totalAlternative, setTotalAlternative ] = useState<number>(0);
	const [ totalPGold, setTotalPGold ] = useState<number>(0);
	const [ totalFGold, setTotalFGold ] = useState<number>(0);
	const [ showInsUpload, setShowInsUpload ] = useState<boolean>(false);
	const [ activeTab, setActiveTab ] = useState<string>(TAB.FIN);
	const [ activeTabSum, setActiveTabSum ] = useState<number>(0);
	const [ results, setResults ] = useState<Array<any>>([]);
	const [ loadingFamily, setLoadingFamily ] = useState<boolean>(true);
	const [ loadingHoldings, setLoadingHoldings ] = useState<boolean>(true);
	const [ uname, setUname ] = useState<string | null | undefined>(owner);
	const [ childTab, setChildTab ] = useState<string>('');
	const [ npsData, setNPSData] = useState<Array<CreateNPSInput>>([]);	
	const [ isDirty, setIsDirty]  = useState<boolean>(false);

	const loadNPSSubCategories = async () => {
		let npsData: Array<CreateNPSInput> | undefined = await getNPSData();
		if (npsData) {
			setNPSData([...npsData]);
			let subCategories: any = getNPSFundManagers();
			Object.keys(subCategories).forEach((key: string) => subCategories[key] = {});
			for(let item of npsData) {
				subCategories[item.pfm][item.id] = item.name;
			}
			return subCategories;
		}
	};

	const tabs = {
		Cash: {
			label: 'Cash',
			children: {
				[TAB.LENT]: {
					label: TAB.LENT,
					data: lendings,
					setData: setLendings,
					total: totalLendings,
					categoryOptions: { No : 'Non-Cummulative', Yes: 'Cummulative' },
					subCategoryOptions:{ Yes: {
						1: 'Anually',
						2: 'Bi-Anually',
						4: 'Quarterly',
						12: 'Monthly'}},
					viewComp: ViewHoldingInput
				},
				[TAB.SAV]: {
					label: TAB.SAV,
					data: savings,
					setData: setSavings,
					total: totalSavings,
					viewComp: ViewHoldingInput,
				},
			}
		},
		Physical: {
			label: 'Physical',
			children: {
				[TAB.PROP]: {
					label: TAB.PROP,
					data: properties,
					setData: setProperties,
					total: totalProperties,
					categoryOptions: {
						P: "Plot",
						A: "Apartment",
						H: "Home",
						C: "Condominium",	
						O: "Office",
						T: "Townhouse",
						OTHER: 'Others'
					},
				},
				[TAB.VEHICLE]: {
					label: TAB.VEHICLE,
					data: vehicles,
					setData: setVehicles,
					total: totalVehicles,
					categoryOptions: {
						2: 'Two-Wheeler',
						3: 'Three-Wheeler',
						4: 'Four-Wheeler'
					},
					viewComp: ViewHoldingInput,
				},
				[TAB.PM]: {
					label: TAB.PM,
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
							'90': '90%',
							'85': '85%',
							'80': '80%',
							'50': '50%'
						}
					},
					categoryOptions: {
						[AssetSubType.Gold]: 'Gold',
						[SILVER]: 'Silver',
						[PLATINUM]: 'Platinum',
						[PALLADIUM]: 'Palladium',
					},
					viewComp: ViewHoldingInput,
				},
				[TAB.OTHER]: {
					label: TAB.OTHER,
					data: others,
					setData: setOthers,
					total: totalOthers,
					categoryOptions: {
						Art: 'Art',
						Watch: 'Watch',
						Club: 'Club Membership',
						Time: 'Time Sharing Membership',
						Other: 'Other'
					},
					viewComp: ViewHoldingInput,
				}, 
			},
		},
		Financial: {
			label: 'Financial',
			children: {
				[TAB.STOCK]: {
					label: TAB.STOCK,
					hasUploader: true,
					data: instruments,
					setData: setInstruments,
					total: totalInstruments,
					contentComp: <InstrumentValuation />
				},
				[TAB.MF]: {
					label: TAB.MF,
					hasUploader: true,
					data: instruments,
					setData: setInstruments,
					total: totalInstruments,
					contentComp: <InstrumentValuation />
				},
				[TAB.BOND]: {
					label: TAB.BOND,
					hasUploader: true,
					data: instruments,
					setData: setInstruments,
					total: totalInstruments,
					contentComp: <InstrumentValuation />
				},
				[TAB.GOLDB]: {
					label: TAB.GOLDB,
					hasUploader: true,
					data: instruments,
					setData: setInstruments,
					total: totalInstruments,
					contentComp: <InstrumentValuation />
				},
				[TAB.ETF]: {
					label: TAB.ETF,
					hasUploader: true,
					data: instruments,
					setData: setInstruments,
					total: totalInstruments,
					contentComp: <InstrumentValuation />
				},
				[TAB.CRYPTO]: {
					label: TAB.CRYPTO,
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
				[TAB.ANGEL]: {
					label: TAB.ANGEL,
					data: angel,
					setData: setAngel,
					total: totalAngel,
					viewComp: ViewHoldingInput,
				}, 
			}
		},
		Retirement: {
			label: 'Retirement',
			children: {
				[TAB.PF]: {
					label: TAB.PF,
					data: pf,
					setData: setPF,
					total: totalPF,
					categoryOptions : {
						PF: 'Pension Fund',
						EF: 'Employee Fund',
						VF: 'Voluntary Fund',
					},
					viewComp: ViewHoldingInput
				},
				[TAB.NPS]: {
					label: TAB.NPS,
					data: nps,
					setData: setNPS,
					total: totalNPS,
					categoryOptions: getNPSFundManagers(),
					subCategoryOptions: loadNPSSubCategories,
					viewComp: ViewHoldingInput
				},
			}
		},
		Liabilities: {
			label: 'Liabilities',
			children: {
				[TAB.LOAN] : {
					label: TAB.LOAN,
					data: loans,
					setData: setLoans,
					total: totalLoans,
					viewComp: ViewHoldingInput,
				},
				[TAB.INS]: {
					label: TAB.INS,
					data: insurance,
					total: totalInsurance,
					setData: setInsurance,
					categoryOptions: {
						L: 'Life',
						H: 'Health',
						P: 'Property',
						V: 'Vehicle',
						O: 'Others'
					},
					viewComp: ViewHoldingInput
				},
				[TAB.CREDIT]:{
					label: TAB.CREDIT,
					data: credit,
					total: totalCredit,
					setData: setCredit,
					viewComp: ViewHoldingInput
				}
			}
		}
	};

	const initializeFamilyList = async () => {
		try {
			let allFamilyMembers = await loadAllFamilyMembers();
			let allFamilyKeys = Object.keys(allFamilyMembers);
			if(allFamilyKeys.length === 1) setSelectedMembers([...[allFamilyKeys[0]]]);
			setAllFamily(allFamilyMembers);
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
		let allHoldings: CreateUserHoldingsInput | null = null;
		try {
			allHoldings = await loadHoldings(owner);
		} catch (err) {
			notification.error({ message: 'Holdings not loaded', description: 'Sorry! Unable to fetch holdings.' });
		}
		let currencyList = getRelatedCurrencies(allHoldings, defaultCurrency);
		setSelectedCurrency(Object.keys(currencyList)[0]);
		setCurrencyList(currencyList);
		setUname(allHoldings?.uname);
		if(allHoldings?.uname && allHoldings?.instruments?.length) 
			await initializeInsData(allHoldings?.instruments);
		setInstruments([ ...(allHoldings?.instruments ? allHoldings.instruments : []) ]);
		setPreciousMetals([ ...(allHoldings?.pm ? allHoldings.pm : []) ]);
		setPF([ ...(allHoldings?.pf ? allHoldings.pf : []) ]);
		setNPS([ ...(allHoldings?.nps ? allHoldings.nps : []) ]);
		setCrypto([ ...(allHoldings?.crypto ? allHoldings.crypto : []) ]);
		setVehicles([ ...(allHoldings?.vehicles ? allHoldings.vehicles : []) ]);
		setProperties([ ...(allHoldings?.property ? allHoldings.property: []) ]);
		setLoans([ ...(allHoldings?.loans ? allHoldings.loans : []) ]);
		setInsurance([ ...(allHoldings?.ins ? allHoldings.ins : []) ]);
		setCredit([...(allHoldings?.credit ? allHoldings.credit : []) ]);
		setSavings([ ...(allHoldings?.savings ? allHoldings.savings : []) ]);
		setLendings([ ...(allHoldings?.lendings ? allHoldings.lendings : []) ]);
		setOthers([ ...(allHoldings?.other ? allHoldings.other : []) ]);
		setAngel([ ...(allHoldings?.angel ? allHoldings.angel : []) ]);
		setLoadingHoldings(false);
	};

	useEffect(
		() => {
			if (appContextLoaded) initializeHoldings();
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
			setTotalLiabilities(totalLoans + totalInsurance + totalCredit);
		},
		[totalLoans, totalInsurance, totalCredit]
	);

	useEffect(
		() => {
			setTotalAssets(
					totalAlternative +
					totalSavings +
					totalLendings +
					totalEquity +	
					totalFixed
			);
		},
		[totalSavings, totalAlternative, totalEquity, totalFixed, totalLendings]
	);

	useEffect(() => {
		setTotalAlternative(totalOthers + totalVehicles + totalProperties + totalPM + totalCrypto + totalFGold + totalFRE);
	}, [totalOthers, totalVehicles, totalProperties, totalCrypto, totalPM, totalFGold, totalFRE]);

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
			setTotalFEquity(0);
			setTotalFFixed(0);
			return;
		}
		let total = 0;
		let totalFGold = 0;
		let totalFRE = 0;
		let totalFFixed = 0;
		let totalFEquity = 0;
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
					totalFEquity += value;
				else if(instrument.type === AssetType.F)
					totalFFixed += value;
				else if(instrument.type === AssetType.H) {
					if(includesAny(instrument.name as string, ["conservative"])) {
						totalFFixed += 0.7 * value;
						totalFEquity += 0.3 * value;
					} else if(includesAny(instrument.name as string, ["multi-asset"])) {
						totalFGold += 0.1 * value;
						totalFEquity += 0.6 * value;
						totalFFixed += 0.3 * value;
					} else if(includesAny(instrument.name as string, ["balanced"])) {
						totalFEquity += 0.6 * value;
						totalFFixed += 0.4 * value;
					} else {
						totalFFixed += 0.7 * value;
						totalFEquity += 0.3 * value;
					}
				}
			}
		})
		setTotalInstruments(total);
		setTotalFGold(totalFGold);
		setTotalFEquity(totalFEquity);
		setTotalFFixed(totalFFixed);
		setTotalFRE(totalFRE);
	};

	const saveHoldings = async () => {
		let updatedHoldings: CreateUserHoldingsInput = { uname: owner };
		updatedHoldings.instruments = instruments;
		updatedHoldings.savings = savings;
		updatedHoldings.lendings = lendings;
		updatedHoldings.angel = angel;
		updatedHoldings.pf = pf;
		updatedHoldings.loans = loans;
		updatedHoldings.pm = preciousMetals;
		updatedHoldings.vehicles = vehicles;
		updatedHoldings.property = properties;
		updatedHoldings.other = others;
		updatedHoldings.nps = nps;
		updatedHoldings.crypto = crypto;
		updatedHoldings.credit = credit; 
		updatedHoldings.ins = insurance;
		if(uname) updatedHoldings.uname = uname;
		try {
			if(uname) await updateHoldings(updatedHoldings as UpdateUserHoldingsInput);
			else await addHoldings(updatedHoldings);
			notification.success({message: 'Data saved', description: 'All holdings data has been saved.'})
		} catch(e) {
			notification.error({message: 'Unable to save holdings', description: 'Sorry! An unexpected error occurred while trying to save the data.'});
		}
		setIsDirty(false);
	};

	const calculateNPV = (records: Array<HoldingInput>, setTotal: Function,) => {
		if(!records.length) return setTotal(0);			
		let total = 0;
		let isMonth = true;
		records.forEach((record: HoldingInput) => {
			if(record && doesHoldingMatch(record, selectedMembers, selectedCurrency)) {
				if ( record.pur && record.chg ) {
					if(record.chgF === 1) isMonth = false;
					const duration = getRemainingDuration(record.pur[0].year, record.pur[0].month, record.pur[0].qty, isMonth);
						if(duration) {
							const durLeft = record.pur[0].qty - (isMonth ? duration.months : duration.years);
							const getCashFlows = Array(Math.round(durLeft)).fill(record.pur[0].amt);
							console.log(getCashFlows);
							const value = getNPV(record.chg, getCashFlows, 0, (isMonth ? true : false), true);
							total += value;
						}
					}
				}
			})
		setTotal(total);
	}

	const priceLoans = () => {
		calculateNPV(loans, setTotalLoans);
	};

	const priceInsurance = () => {
		calculateNPV(insurance, setTotalInsurance);
	};

	const calculateCompundingIncome = (records: Array<HoldingInput>, setTotal: Function) => {
		if(!records.length) return setTotal(0);
		let total = 0;
		records.forEach((record: HoldingInput)=>{
			if(record && doesHoldingMatch(record, selectedMembers, selectedCurrency)) {
				if(record.chg && record.pur) {
					const duration = getRemainingDuration(record.pur[0].year, record.pur[0].month);
					if(!duration) return;
					if(record.chgF===1 && duration?.years > record.pur[0].qty) return;
					if(record.chgF===2 && duration?.months/6 > record.pur[0].qty) return;
					if(record.chgF===4 && duration?.months/4 > record.pur[0].qty) return;
					if(record.chgF===12 && duration?.months > record.pur[0].qty) return;
					if(!record.chgF) {
						total+=record.pur[0].amt;
						return setTotal(total);
					};
					const value = getCompoundedIncome(record.chg, record.pur[0].amt, duration.years, record.chgF );
					total+= value;
				}
			};
		})
		setTotal(total);
	};

	const priceLendings = () => {
		calculateCompundingIncome(lendings, setTotalLendings);
	};

	const calculateBalance = (records: Array<HoldingInput>, setTotal: Function) => {
		if(!records.length) return setTotal(0);			
		let total = 0;
		records.forEach((record: HoldingInput) => {
			if(record && doesHoldingMatch(record, selectedMembers, selectedCurrency)) {
				const value = record.qty;
				total += value;
			}
		})
		setTotal(total);
	};

	const priceCredit = () => {
		calculateBalance(credit, setTotalCredit);
	};

	const priceSavings = () => {
		calculateBalance(savings, setTotalSavings);
	};

	const priceOthers = () => {
		calculateBalance(others, setTotalOthers);
	};

	const priceAngel = () => {
		calculateBalance(angel, setTotalAngel);
	}

	const priceProperties = () => {
		if(!properties.length) return setTotalProperties(0);
		let total = 0;
		properties.forEach((property: PropertyInput) => {
			if(allFamily){
				if(property && doesOwnershipMatch(property.own, allFamily)) {
					// @ts-ignore
					const duration = getRemainingDuration(property.mvy, property.mvm);
					// @ts-ignore
					const value = getCompoundedIncome(property.rate, property.mv, duration?.years);
					total += value;
				}
			}
		})
		setTotalProperties(total);
	};

	const priceVehicles = () => {
		if(!vehicles.length) return setTotalVehicles(0);
		let total = 0;
		vehicles.forEach((vehicle: HoldingInput) => {
			if(vehicle && doesHoldingMatch(vehicle, selectedMembers, selectedCurrency)) {
				if(vehicle.pur && vehicle.chg) {
					const duration = getRemainingDuration(vehicle.pur[0].year, vehicle.pur[0].month);
					if(duration) {
						const value = getCompoundedIncome(-(vehicle.chg), vehicle.pur[0].amt, duration.years) ;
						total += value;
					}
				}
			}
		})
		setTotalVehicles(total);
	};

	const priceCrypto = () => {
		if(!crypto.length) return setTotalCrypto(0);
		let total = 0;
		crypto.forEach((instrument: HoldingInput) => {
			let rate = getCryptoRate(ratesData, instrument.subt as string, selectedCurrency);
			if(rate && doesMemberMatch(instrument, selectedMembers)) {
				total += instrument.qty * rate;
			}
		})
		setTotalCrypto(total);
	};

	const calculatePensionFund = (records: Array<HoldingInput>, setTotal: Function) => {
		if(!records.length) return setTotal(0);
		let total = 0;
		const month = new Date().getMonth()+1;
		records.forEach((record: HoldingInput) => {
			if(record.pur && doesHoldingMatch(record, selectedMembers, selectedCurrency)) {
				const amount = record.pur[0].amt;
				if (month === 4) {
					const duration = getRemainingDuration(record.pur[0].year, record.pur[0].month);
					if(!duration?.months) return;
					// @ts-ignore
					const value = amount + (amount * (1+(record.chg*(duration?.months/12))));
					total += value;
				}else total+= amount;
			}
		})
		setTotal(total);
	}

	const pricePF = () => {
		calculatePensionFund(pf, setTotalPF);
	};

	const priceNPS = () => {
		if(!nps.length) {
			setTotalNPS(0);
			setTotalNPSEquity(0);
			setTotalNPSFixed(0);
			return;
		}
		let total = 0;
		let totalNPSFixed = 0;
		let totalNPSEquity = 0;
		nps.forEach((npsItem: HoldingInput) => {
			const data = npsData.find((item)=>item.id === npsItem.name);
			if(data && doesHoldingMatch(npsItem, selectedMembers, selectedCurrency)) {
				let value = npsItem.qty * data.price;
				total += value;
			if(data.type === AssetType.E) totalNPSEquity += value;
			else if(data.type === AssetType.F) totalNPSFixed += value;
			else if(data.type === AssetType.H) {
				totalNPSFixed += 0.8 * value;
				totalNPSEquity += 0.2 * value;
				}
			}
		})
		setTotalNPS(total);
		setTotalNPSEquity(totalNPSEquity);
		setTotalNPSFixed(totalNPSFixed);
	};

	useEffect(() => {
		setTotalEquity(totalAngel + totalFEquity + totalNPSEquity);
	}, [totalAngel, totalFEquity, totalNPSEquity]);

	useEffect(() => {
		setTotalFixed(totalFFixed + totalNPSFixed + totalPF);
	}, [totalPF, totalFFixed, totalNPSFixed])

	useEffect(() => {
		priceInstruments();
		pricePM();
		pricePF();
		priceNPS();
		priceProperties();
		priceVehicles();
		priceOthers();
		priceCrypto();
		priceLendings();
		priceInsurance();
		priceLoans();
		priceCredit();
		priceSavings();
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
		priceOthers();
	}, [others]);

	useEffect(() => {
		pricePF();
	}, [pf]);

	useEffect(() => {
		priceNPS();
	}, [nps]);

	useEffect(() => {
		priceLoans();
	}, [loans]);

	useEffect(()=>{
		priceCredit();
	},[credit]);

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
		priceInstruments();
	}, [instruments]);

	useEffect(() => {
		priceLendings();
	}, [lendings]);

	useEffect(() => {
		priceSavings();
	}, [savings]);

	useEffect(()=>{
		setIsDirty(true);
	},[instruments, 
		savings, 
		lendings, 
		properties, 
		preciousMetals, 
		crypto,
		pf, 
		loans, 
		insurance, 
		credit, 
		angel, 
		others, 
		nps, 
		vehicles])

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
				totalSavings,
				totalPF,
				totalNPS,
				totalAngel,
				totalLendings,
				totalInsurance,
				totalLoans,
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
				pf,
				setPF,
				nps,
				setNPS,
				crypto,
				setCrypto,
				savings,
				setSavings,
				lendings,
				setLendings,
				properties,
				setProperties,
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
				totalFEquity,
				saveHoldings,
				childTab,
				setChildTab,
				npsData,
				setNPSData,
				loadNPSSubCategories,
				credit,
				setCredit,
				totalCredit,
				isDirty,
				setIsDirty
			}}
		>
			<NWView />
		</NWContext.Provider>
	);
}

export { NWContext, NWContextProvider };
