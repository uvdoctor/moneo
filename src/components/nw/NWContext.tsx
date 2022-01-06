import React, { createContext, useContext, useEffect, useState } from 'react';
require('./nw.less');
import NWView from './NWView';
import { AppContext, LOCAL_DATA_TTL, LOCAL_INS_DATA_KEY } from '../AppContext';
import {
	addFamilyMember,
	addHoldings,
	addInsHoldings,
	doesHoldingMatch,
	doesMemberMatch,
	doesPropertyMatch,
	getFamilysList,
	getNPSData,
	getNPSFundManagers,
	getRelatedCurrencies,
	isFund,
	loadAllFamilyMembers,
	loadAllHoldings,
	loadInsHoldings,
	loadMatchingINBond,
	loadMatchingINExchange,
	loadMatchingINMutual,
	updateHoldings,
	updateInsHoldings
} from './nwutils';
import { notification } from 'antd';
import {
	AssetSubType,
	AssetType,
	CreateUserHoldingsInput,
	CreateNPSPriceInput,
	HoldingInput,
	INBondPrice,
	INExchgPrice,
	INMFPrice,
	InsType,
	PropertyInput,
	UpdateUserHoldingsInput,
	InstrumentInput,
	CreateUserInsInput,
	UpdateUserInsInput,
	PropertyType
} from '../../api/goals';
import InstrumentValuation from './InstrumentValuation';
import { includesAny, initOptions } from '../utils';
import { calculateCrypto, calculateNPS, calculateProvidentFund, calculateProperty, calculateVehicle, calculateCompundingIncome, calculateInsurance, calculatePM, calculateLoan } from './valuationutils'
import simpleStorage from "simplestorage.js";
import { ROUTES } from '../../CONSTANTS';
import * as APIt from '../../api/goals';

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
	STOCK: 'Stocks',
	MF: 'Mutual Funds',
	BOND: 'Bonds',
	ETF: 'ETFs',
	GOLDB: 'Gold Bonds',
	SAV: 'Saving Accounts',
	LENT: 'Deposits',
	OTHER: 'Others',
	NPS: 'NPS',
	PF: 'Provident Funds',
	VEHICLE: 'Vehicles',
	ANGEL: 'Start-ups',
	PROP: 'Properties',
	LOAN: 'Loans',
	INS: 'Insurance',
	CREDIT: 'Credit',
	REIT: 'REITs',
	OIT: 'Other Investments',
	SUMMARY: 'Summary'
};

export const LIABILITIES_TAB = 'Liabilities';
export const ASSETS_VIEW = 'assets';
export const LIABILITIES_VIEW = 'liabilities';

export const NATIONAL_SAVINGS_CERTIFICATE = 'NSC';

function NWContextProvider() {
	const { defaultCurrency, insData, setInsData, ratesData, owner, user, discountRate, userInfo }: any = useContext(AppContext);
	const [ allFamily, setAllFamily ] = useState<any | null>(null);
	const [ instruments, setInstruments ] = useState<Array<InstrumentInput>>([]);
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
	const [ totalFInv, setTotalFInv ] = useState<number>(0);
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
	const [ totalMFs, setTotalMFs ] = useState<number>(0);
	const [ totalETFs, setTotalETFs ] = useState<number>(0);
	const [ totalStocks, setTotalStocks ] = useState<number>(0);
	const [ totalBonds, setTotalBonds ] = useState<number>(0);
	const [ totalAlternative, setTotalAlternative ] = useState<number>(0);
	const [ totalPGold, setTotalPGold ] = useState<number>(0);
	const [ totalFGold, setTotalFGold ] = useState<number>(0);
	const [ totalCash, setTotalCash ] = useState<number>(0);
	const [ totalPhysical, setTotalPhysical ] = useState<number>(0);
	const [ totalFinancial, setTotalFinancial ] = useState<number>(0);
	const [ totalRetirement, setTotalRetirement ] = useState<number>(0);
	const [ showInsUpload, setShowInsUpload ] = useState<boolean>(false);
	const [ activeTab, setActiveTab ] = useState<string>('Financial');
	const [ activeTabSum, setActiveTabSum ] = useState<number>(0);
	const [ results, setResults ] = useState<Array<any>>([]);
	const [ loadingFamily, setLoadingFamily ] = useState<boolean>(true);
	const [ loadingHoldings, setLoadingHoldings ] = useState<boolean>(true);
	const [ uname, setUname ] = useState<string | null | undefined>(owner);
	const [ insUname, setInsUname ] = useState<string | null | undefined>(owner);
	const [ childTab, setChildTab ] = useState<string>('');
	const [ npsData, setNPSData] = useState<Array<CreateNPSPriceInput>>([]);
	const [ isDirty, setIsDirty]  = useState<boolean>(false);
	const [ totalOtherProperty, setTotalOtherProperty ] = useState<number>(0);
	const [ totalResidential, setTotalResidential ] = useState<number>(0);
	const [ totalCommercial, setTotalCommercial ] = useState<number>(0);
	const [ totalPlot, setTotalPolt ] = useState<number>(0);
	const [ totalPPF, setTotalPPF ] = useState<number>(0);
	const [ totalVPF, setTotalVPF ] = useState<number>(0);
	const [ totalEPF, setTotalEPF ] = useState<number>(0);
	const [	view, setView ] = useState<string>(ASSETS_VIEW);

	const loadNPSSubCategories = async () => {
		let npsData: Array<CreateNPSPriceInput> | undefined = await getNPSData();
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
			total: totalCash,
			children: {
				[TAB.SAV]: {
					label: TAB.SAV,
					data: savings,
					setData: setSavings,
					total: totalSavings,
				},
				[TAB.LENT]: {
					label: TAB.LENT,
					data: lendings,
					setData: setLendings,
					total: totalLendings,
					categoryOptions: {
						BD: 'Deposit',
						[NATIONAL_SAVINGS_CERTIFICATE]: 'National Savings Certificate',
						P2P: 'Lent to an individual',
					},
					subCategoryOptions:{
						BD: {
							0: 'Pay Out',
							1: 'Accumulates Every Year',
							2: 'Accumulates Every Six Months',
							4: 'Accumulates Every Three Months',
							12: 'Accumulates Every Month' },
						ML: {
							0: 'Pay Out',
							1: 'Accumulates Every Year',
							2: 'Accumulates Every Six Months',
							4: 'Accumulates Every Three Months',
							12: 'Accumulates Every Month' },
						},
				},
			}
		},
		Physical: {
			label: 'Physical',
			total: totalPhysical,
			children: {
				[TAB.PROP]: {
					label: TAB.PROP,
					data: properties,
					setData: setProperties,
					total: totalProperties,
					categoryOptions: {
						[PropertyType.P]: "Plot",
						[PropertyType.A]: "Apartment",
						[PropertyType.H]: "House",
						[PropertyType.C]: "Condominium",
						[PropertyType.COMM]: "Commercial",
						[PropertyType.T]: "Townhouse",
						[PropertyType.OTHER]: 'Others'
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
				},
			},
		},
		Financial: {
			label: 'Financial',
			total: totalFinancial,
			children: {
				[TAB.STOCK]: {
					label: TAB.STOCK,
					info: "Example",
					link: ROUTES.PRIVACY,
					hasUploader: true,
					data: instruments,
					setData: setInstruments,
					total: totalStocks,
					contentComp: <InstrumentValuation />
				},
				[TAB.MF]: {
					label: TAB.MF,
					info: "Example",
					link: ROUTES.PRIVACY,
					hasUploader: true,
					data: instruments,
					setData: setInstruments,
					total: totalMFs,
					contentComp: <InstrumentValuation />
				},
				[TAB.BOND]: {
					label: TAB.BOND,
					info: "Example",
					link: ROUTES.PRIVACY,
					hasUploader: true,
					data: instruments,
					setData: setInstruments,
					total: totalBonds,
					contentComp: <InstrumentValuation />
				},
				[TAB.GOLDB]: {
					label: TAB.GOLDB,
					info: "Example",
					link: ROUTES.PRIVACY,
					hasUploader: true,
					data: instruments,
					setData: setInstruments,
					total: totalFGold,
					contentComp: <InstrumentValuation />
				},
				[TAB.ETF]: {
					label: TAB.ETF,
					info: "Example",
					link: ROUTES.PRIVACY,
					hasUploader: true,
					data: instruments,
					setData: setInstruments,
					total: totalETFs,
					contentComp: <InstrumentValuation/>
				},
				[TAB.REIT]: {
					label: TAB.REIT,
					info: "Investment Trust",
					link: ROUTES.PRIVACY,
					hasUploader: true,
					data: instruments,
					setData: setInstruments,
					total: totalFRE,
					contentComp: <InstrumentValuation/>
				},
				[TAB.CRYPTO]: {
					label: TAB.CRYPTO,
					info: 'Example',
					link: ROUTES.PRIVACY,
					data: crypto,
					setData: setCrypto,
					total: totalCrypto,
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
					info: "Example",
					link: ROUTES.PRIVACY,
					data: angel,
					setData: setAngel,
					total: totalAngel,
				},
				[TAB.OIT]: {
					label: TAB.OIT,
					info: "Investment Trust",
					link: ROUTES.PRIVACY,
					hasUploader: true,
					data: instruments,
					setData: setInstruments,
					total: totalFInv,
					contentComp: <InstrumentValuation/>
				}
			}
		},
		Retirement: {
			label: 'Retirement',
			total: totalRetirement,
			children: {
				[TAB.PF]: {
					label: TAB.PF,
					info: "Example",
					link: ROUTES.PRIVACY,
					data: pf,
					setData: setPF,
					total: totalPF,
					categoryOptions : {
						PF: 'Pension Fund',
						EF: 'Employee Fund',
						VF: 'Voluntary Fund',
					},
				},
				[TAB.NPS]: {
					label: TAB.NPS,
					info: "Example",
					link: ROUTES.PRIVACY,
					data: nps,
					setData: setNPS,
					total: totalNPS,
					categoryOptions: getNPSFundManagers(),
					subCategoryOptions: loadNPSSubCategories,
				},
			}
		},
		[LIABILITIES_TAB]: {
			label: LIABILITIES_TAB,
			children: {
				[TAB.LOAN] : {
					label: TAB.LOAN,
					data: loans,
					setData: setLoans,
					total: totalLoans,
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
					subCategoryOptions: {
						L: { 1: 'Yearly', 12: 'Monthly' },
						H: { 1: 'Yearly', 12: 'Monthly' },
						P: { 1: 'Yearly', 12: 'Monthly' },
						V: { 1: 'Yearly', 12: 'Monthly' },
						O: { 1: 'Yearly', 12: 'Monthly' }
					},
				},
				[TAB.CREDIT]:{
					label: TAB.CREDIT,
					data: credit,
					total: totalCredit,
					setData: setCredit,
				}
			}
		}
	};

	const initializeFamilyList = async () => {
		try {
			let allFamilyMembers = await loadAllFamilyMembers();
			setAllFamily(allFamilyMembers);			
			let allFamilyKeys = Object.keys(allFamilyMembers);
			if(allFamilyKeys.length === 1) {
				setSelectedMembers([...[allFamilyKeys[0]]]);
			}
			setLoadingFamily(false);
			if(allFamilyMembers) return true;
		} catch (err) {
			notification.error({
				message: 'Family list not loaded',
				description: 'Sorry! Unable to fetch details of your family members.'
			});
			return false;
		}
	};

	const addSelfMember = async () => {
		const family = await getFamilysList();
		if (!family || !family.length) {
			let member = await addFamilyMember("Self", "XXXXX1234X", APIt.TaxLiability.M);
			if (member) {
				setAllFamily ({[member.id as string]: { name: member.name, taxId: member.tid }});
				setSelectedMembers([...[member.id as string]])
				setLoadingFamily(false);
				return;
			}
		}
	}

	const initializeInsData = async (instruments: Array<InstrumentInput>) => {
		let mfIds: Set<string> = new Set();
		let otherIds: Set<string> = new Set();
		let initFromDB = false;
		instruments.forEach((ins: InstrumentInput) => {
			if(ins.id.startsWith('INF')) mfIds.add(ins.id);
			else otherIds.add(ins.id);
			if(!initFromDB && insData && !insData[ins.id]) initFromDB = true;
		});
		if(!initFromDB) return insData;
		let insCache: any = {};
		let mfs: Array<INMFPrice> | null = null;
		if(mfIds.size) mfs = await loadMatchingINMutual(Array.from(mfIds));
		if(mfs) mfs.forEach((mf: INMFPrice) => {
			insCache[mf.id as string] = mf;
			mfIds.delete(mf.id as string);
		});
		mfIds.forEach((id:string) => otherIds.add(id));
		let bonds: Array<INBondPrice> | null = null;
		if(otherIds.size) bonds = await loadMatchingINBond(Array.from(otherIds));
		if(bonds) bonds.forEach((bond: INBondPrice) => {
			insCache[bond.id as string] = bond;
			otherIds.delete(bond.id as string);
		});
		if(otherIds.size) {
			let exchgEntries: Array<INExchgPrice> | null = await loadMatchingINExchange(Array.from(otherIds));
			exchgEntries?.forEach((entry: INExchgPrice) => insCache[entry.id as string] = entry);
		}
		setInsData(insCache);
		simpleStorage.set(LOCAL_INS_DATA_KEY, insCache, LOCAL_DATA_TTL);
		return insCache;
	};

	const initializeHoldings = async () => {
		const familyMemberExists = await initializeFamilyList();
		if(!familyMemberExists) return;
		let allHoldings: CreateUserHoldingsInput | null = null;
		let insHoldings: CreateUserInsInput | null = null;
		try {
			allHoldings = await loadAllHoldings(owner);
			insHoldings = await loadInsHoldings(owner);
		} catch (err) {
			notification.error({ message: 'Holdings not loaded', description: 'Sorry! Unable to fetch holdings.' });
		}
		let currencyList = getRelatedCurrencies(allHoldings, defaultCurrency);
		setSelectedCurrency(Object.keys(currencyList)[0]);
		setCurrencyList(currencyList);
		setUname(allHoldings?.uname);
		setInsUname(insHoldings?.uname);
		if(insHoldings?.uname && insHoldings?.ins?.length)
			await initializeInsData(insHoldings?.ins);
		setInstruments([ ...(insHoldings?.ins ? insHoldings.ins : []) ]);
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
			if(!user) return;
			initializeHoldings();
		},[ user ]
	);

	useEffect(
		() => {
			setNW(totalAssets - totalLiabilities);
		},
		[ totalAssets, totalLiabilities ]
	);

	useEffect(() => {
		setTotalCash(totalSavings + totalLendings);
	}, [totalSavings, totalLendings]);

	useEffect(() => {
		setTotalPhysical(totalProperties + totalVehicles + totalPM + totalOthers);
	}, [totalProperties, totalVehicles, totalPM, totalOthers]);

	useEffect(() => {
		setTotalFinancial(totalInstruments + totalAngel + totalCrypto);
	}, [totalInstruments, totalAngel, totalCrypto]);

	useEffect(() => {
		setTotalRetirement(totalPPF + totalVPF + totalEPF + totalNPS);
	}, [totalPPF, totalVPF, totalEPF, totalNPS]);

	useEffect(
		() => {
			setTotalLiabilities(totalLoans + totalInsurance + totalCredit);
		},
		[totalLoans, totalInsurance, totalCredit]
	);

	useEffect(
		() => {
			setTotalAssets(
					totalCash +
					totalPhysical +
					totalFinancial +
					totalRetirement
			);
		},
		[totalCash, totalPhysical, totalFinancial, totalRetirement]
	);

	useEffect(() => {
		setTotalAlternative(totalOthers + totalVehicles + totalProperties + totalPM + totalCrypto + totalFGold + totalFRE + totalFInv);
	}, [totalOthers, totalVehicles, totalProperties, totalCrypto, totalPM, totalFGold, totalFRE, totalFInv]);

	const pricePM = () => {
		if(!preciousMetals.length) {
			setTotalPM(0);
			setTotalPGold(0);
			return;
		}
		let total = 0;
		let totalPGold = 0;
		preciousMetals.forEach((holding: HoldingInput) => {
			if(doesMemberMatch(holding, selectedMembers)) {
				const value = calculatePM(holding, ratesData, selectedCurrency);
				total += value
				if(holding.subt === AssetSubType.Gold) totalPGold += value;
			}
		})
		setTotalPM(total);
		setTotalPGold(totalPGold);
	};

	const priceInstruments = () => {
		let total = 0;
		let totalFGold = 0;
		let totalFRE = 0;
		let totalInv = 0;
		let totalFFixed = 0;
		let totalFEquity = 0;
		let totalBonds = 0;
		let totalStocks = 0;
		let totalMFs = 0;
		let totalETFs = 0;
		let cachedData = simpleStorage.get(LOCAL_INS_DATA_KEY);
		if(!cachedData) cachedData = insData;
		instruments.forEach((instrument: InstrumentInput) => {
			const data = insData[instrument.id];
			if(data && doesHoldingMatch(instrument, selectedMembers, selectedCurrency)) {
				let value = instrument.qty * cachedData[instrument.id].price;
				total += value;
				if(data.itype === InsType.ETF) totalETFs += value;
				else if(isFund(instrument.id)) totalMFs += value;
				if(data.subt === AssetSubType.GoldB) totalFGold += value;
				else if(data.itype && cachedData[instrument.id].itype === InsType.REIT)
					totalFRE += value;
				else if(data.itype && cachedData[instrument.id].itype === InsType.InvIT)
					totalInv += value;
				else if(data.type === AssetType.E) {
					totalFEquity += value;
					if(!isFund(instrument.id) && !data.itype) totalStocks += value;
				} else if(data.type === AssetType.F) {
					totalFFixed += value;
					if(!isFund(instrument.id) && !data.itype) totalBonds += value;
				} else if(data.type === AssetType.H) {
					if(includesAny(data.name as string, ["conservative"])) {
						totalFFixed += 0.7 * value;
						totalFEquity += 0.3 * value;
					} else if(includesAny(data.name as string, ["multi-asset"])) {
						totalFGold += 0.1 * value;
						totalFEquity += 0.6 * value;
						totalFFixed += 0.3 * value;
					} else if(includesAny(data.name as string, ["balanced"])) {
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
		setTotalFInv(totalInv);
		setTotalStocks(totalStocks);
		setTotalBonds(totalBonds);
		setTotalETFs(totalETFs);
		setTotalMFs(totalMFs);
	};

	const saveHoldings = async () => {
		let updatedInsHoldings: CreateUserInsInput = {
			uname: owner,
			ins: instruments
		};
		let updatedHoldings: CreateUserHoldingsInput = { uname: owner };
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
		
		try {
			uname ? await updateHoldings(updatedHoldings as UpdateUserHoldingsInput) : await addHoldings(updatedHoldings);
			if (instruments.length)  {
				insUname ? await updateInsHoldings(updatedInsHoldings as UpdateUserInsInput)
						 : await addInsHoldings(updatedInsHoldings);
			}
			notification.success({message: 'Data saved', description: 'All holdings data has been saved.'})
		} catch(e) {
			notification.error({message: 'Unable to save holdings', description: 'Sorry! An unexpected error occurred while trying to save the data.'});
		}
		setIsDirty(false);
	};

const calculateNPV = (holdings: Array<HoldingInput>, setTotal: Function) => {
	if (!holdings.length) return setTotal(0);
	let total = 0;
	holdings.forEach((holding: HoldingInput) => {
		if (holding && doesHoldingMatch(holding, selectedMembers, selectedCurrency)) {
			total += calculateInsurance(holding, discountRate, userInfo.le, user?.attributes?.birthdate);
		}
	});
	setTotal(total);
};

	const priceLoans = () => {
		if(!loans.length) return setTotalLoans(0);
		let total = 0;
		loans.forEach((holding: HoldingInput)=>{
			if(holding && doesHoldingMatch(holding, selectedMembers, selectedCurrency)) {
				total += calculateLoan(holding);
			};
		})
		setTotalLoans(total);
	};

	const priceInsurance = () => {
		calculateNPV(insurance, setTotalInsurance);
	};

	const priceLendings = () => {
		if(!lendings.length) return setTotalLendings(0);
		let total = 0;
		lendings.forEach((holding: HoldingInput)=>{
			if(holding && doesHoldingMatch(holding, selectedMembers, selectedCurrency)) {
				total += calculateCompundingIncome(holding);
			};
		})
		setTotalLendings(total);
	};

	const calculateBalance = (records: Array<HoldingInput>, setTotal: Function) => {
		if(!records.length) return setTotal(0);
		let total = 0;
		records.forEach((record: HoldingInput) => {
			if(record && doesHoldingMatch(record, selectedMembers, selectedCurrency)) {
				total += record.amt as number;
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
		if(!properties.length) return;
		let total = 0;
		let totalOtherProperty = 0;
		let totalCommercial = 0;
		let totalResidential = 0;
		let totalPlot = 0;
		properties.forEach((property: PropertyInput) => {
			if(!doesPropertyMatch(property, selectedMembers, selectedCurrency)) return;
			const value = calculateProperty(property);
			total += value;
			if(property.type === PropertyType.P) totalPlot += value;
			if(property.type === PropertyType.OTHER) totalOtherProperty += value;
			if(property.type === PropertyType.A || property.type === PropertyType.H ||
				property.type === PropertyType.C || property.type === PropertyType.T) totalResidential += value;
			if(property.type === PropertyType.COMM) totalCommercial += value;
		})
		setTotalProperties(total);
		setTotalOtherProperty(totalOtherProperty);
		setTotalCommercial(totalCommercial);
		setTotalResidential(totalResidential);
		setTotalPolt(totalPlot);
	};

	const priceVehicles = () => {
		if(!vehicles.length) return;
		let total = 0;
		vehicles.forEach((vehicle: HoldingInput) => {
			if(vehicle && doesHoldingMatch(vehicle, selectedMembers, selectedCurrency)) {
				total += calculateVehicle(vehicle)
			}
		})
		setTotalVehicles(total);
	};

	const priceCrypto = () => {
		if(!crypto.length) return;
		let total = 0;
		crypto.forEach((holding: HoldingInput) => {
			if(doesMemberMatch(holding, selectedMembers)) {
				total += calculateCrypto(holding, ratesData, selectedCurrency);
			}
		})
		setTotalCrypto(total);
	};

	const pricePF = () => {
		if(!pf.length) return;
		let total = 0;
		let totalPPF = 0;
		let totalVPF = 0;
		let totalEPF = 0;
		pf.forEach((record: HoldingInput) => {
			if(doesHoldingMatch(record, selectedMembers, selectedCurrency)) {
				total = calculateProvidentFund(record);
				if(record.subt === 'PF') totalPPF += total;
				if(record.subt === 'VF') totalVPF += total;
				if(record.subt === 'EF') totalEPF += total;
			}
		})
		setTotalPF(total);
		setTotalPPF(totalPPF);
		setTotalVPF(totalVPF);
		setTotalEPF(totalEPF);
	};

	const priceNPS = () => {
		if(!nps.length) return;
		let total = 0;
		let totalNPSFixed = 0;
		let totalNPSEquity = 0;
		nps.forEach((holding: HoldingInput) => {
			if (doesHoldingMatch(holding, selectedMembers, selectedCurrency)) {
				const { value, fixed, equity } = calculateNPS(holding, npsData);
				total += value;
				totalNPSFixed += fixed;
				totalNPSEquity += equity;
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
	}, [loans, discountRate]);

	useEffect(()=>{
		priceCredit();
	},[credit]);

	useEffect(() => {
		priceInsurance();
	}, [insurance, discountRate]);

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
				totalFInv,
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
				setIsDirty,
				totalOtherProperty,
				totalCommercial,
				totalResidential,
				totalPlot,
				totalEPF,
				totalVPF,
				totalPPF,
				view,
				setView,
				addSelfMember
			}}
		>
			<NWView />
		</NWContext.Provider>
	);
}

export { NWContext, NWContextProvider };
