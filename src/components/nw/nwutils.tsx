import * as mutations from '../../graphql/mutations';
import { API, graphqlOperation } from 'aws-amplify';
import * as APIt from '../../api/goals';
import * as queries from '../../graphql/queries';
import { ALL_FAMILY } from './FamilyInput';
import { NATIONAL_SAVINGS_CERTIFICATE, PALLADIUM, PLATINUM, SILVER, SUKANYA_SAMRIDDHI_YOJANA, TAB } from './NWContext';
import { cryptoList, getFXRate, getPrice, initOptions } from '../utils';
import { COLORS, LOCAL_DATA_TTL, LOCAL_INSTRUMENT_RAW_DATA_KEY } from '../../CONSTANTS';
import simpleStorage from 'simplestorage.js';
import {
	calculateCompundingIncome,
	calculateCrypto,
	calculateInsurance,
	calculateLoan,
	calculateNPS,
	calculatePM,
	calculateProvidentFund,
	calculateVehicle
} from './valuationutils';
import { AssetSubType, PropertyType } from '../../api/goals';

interface OptionTableMap {
	[Stock: string]: string;
}

export const getFamilysList = async () => {
  const {
    data: { listFamilys },
  } = (await API.graphql(graphqlOperation(queries.listFamilys))) as {
    data: APIt.ListFamilysQuery;
  };
  let family: Array<APIt.CreateFamilyInput> | null = listFamilys?.items?.length
    ? (listFamilys.items as Array<APIt.CreateFamilyInput>)
    : null;
  return family;
};

export const loadAllFamilyMembers = async () => {
	const family = await getFamilysList();
	if (!family) return;
	let familyList: any = {};
	family.forEach((val: APIt.CreateFamilyInput) => {
		if (val.id) {
			familyList[val.id as string] = {
				name: val.name,
				taxId: val.tid,
				tax: val.tax
			};
		}
	});
	return Object.keys(familyList).length ? familyList : null;
};

export const loadAllHoldings = async (uname: string) => {
	const { data: { getUserHoldings } } = (await API.graphql(
		graphqlOperation(queries.getUserHoldings, { uname: uname })
	)) as {
		data: APIt.GetUserHoldingsQuery;
	};
	return getUserHoldings ? getUserHoldings : null;
};

export const loadInsHoldings = async (uname: string) => {
	const { data: { getUserIns } } = (await API.graphql(graphqlOperation(queries.getUserIns, { uname: uname }))) as {
		data: APIt.GetUserInsQuery;
	};
	return getUserIns ? getUserIns : null;
};

export const addFamilyMember = async (name: string, taxId: string, tax: APIt.TaxLiability) => {
	try {
		const { data } = (await API.graphql(
			graphqlOperation(mutations.createFamily, {
				input: { name: name, tid: taxId, tax }
			})
		)) as {
			data: APIt.CreateFamilyMutation;
		};
		return data.createFamily as APIt.CreateFamilyInput;
	} catch (e) {
		console.log('Error while adding family member: ', e);
		return null;
	}
};

export const getFamilyMemberKey = (allFamily: any, taxId: string) => {
	if (!allFamily || !taxId) return null;
	let allKeys = Object.keys(allFamily);
	for (let i = 0; i < allKeys.length; i++) {
		if (allFamily[allKeys[i]].taxId === taxId) return allKeys[i];
	}
	return null;
};

export const getDefaultMember = (allFamily: any, selectedMembers: Array<string>) => {
	if (!selectedMembers[0] || selectedMembers.indexOf(ALL_FAMILY) > -1) {
		return Object.keys(allFamily)[0];
	}
	return selectedMembers[0];
};

export const doesMemberMatch = (instrument: APIt.HoldingInput | APIt.InstrumentInput, selectedMembers: Array<string>) =>
	selectedMembers.indexOf(ALL_FAMILY) > -1 || selectedMembers.indexOf(instrument.fId) > -1;

export const doesHoldingMatch = (
	instrument: APIt.HoldingInput | APIt.InstrumentInput,
	selectedMembers: Array<string>,
	selectedCurrency: string
) => {
	//@ts-ignore
	const subType = instrument.subt;
	if (!subType || ![ APIt.AssetSubType.Gold, SILVER, PALLADIUM, PLATINUM ].includes(subType)) {
		if (instrument.curr !== selectedCurrency) return false;
	}
	return doesMemberMatch(instrument, selectedMembers);
};

export const doesPropertyMatch = (
	property: APIt.PropertyInput,
	selectedMembers: Array<string>,
	selectedCurrency: string
) => doesPropertyOwnerMatch(property, selectedMembers) && property.curr === selectedCurrency;

export const doesPropertyOwnerMatch = (property: APIt.PropertyInput, selectedMembers: Array<string>) => {
	if (selectedMembers.indexOf(ALL_FAMILY) > -1) return true;
	for (let owner of property.own) {
		if (selectedMembers.indexOf(owner.fId) > -1) return true;
	}
	return false;
};

export const addMemberIfNeeded = async (
  allFamily: any,
  memberKeys: Array<string>,
  memberKeysSetter: Function,
  taxId: string
) => {
  let id = getFamilyMemberKey(allFamily, taxId);
  if (id) return id;
  let member = await addFamilyMember(taxId, taxId, APIt.TaxLiability.M);
  allFamily[member?.id as string] = {
    name: member?.name,
    taxId: member?.tid,
    tax: member?.tax,
  };
  memberKeys.push(member?.id as string);
  memberKeysSetter([...memberKeys]);
  return member?.id;
};

export const updateFamilyMember = async (member: APIt.UpdateFamilyInput) => {
	try {
		const { data } = (await API.graphql(graphqlOperation(mutations.updateFamily, { input: member }))) as {
			data: APIt.UpdateFamilyMutation;
		};
		return data.updateFamily as APIt.UpdateFamilyInput;
	} catch (e) {
		console.log('Error while updating family member: ', e);
		return null;
	}
};

export const addInsHoldings = async (holdings: APIt.CreateUserInsInput) => {
	try {
		const { data } = (await API.graphql(graphqlOperation(mutations.createUserIns, { input: holdings }))) as {
			data: APIt.CreateUserInsMutation;
		};
		return data.createUserIns as APIt.CreateUserInsInput;
	} catch (e) {
		console.log('Error while adding holdings: ', e);
		return null;
	}
};

export const updateInsHoldings = async (holdings: APIt.UpdateUserInsInput) => {
	try {
		const { data } = (await API.graphql(graphqlOperation(mutations.updateUserIns, { input: holdings }))) as {
			data: APIt.UpdateUserHoldingsMutation;
		};
		return data.updateUserHoldings as APIt.UpdateUserHoldingsInput;
	} catch (e) {
		console.log('Error while updating holdings: ', e);
		return null;
	}
};

export const addHoldings = async (holdings: APIt.CreateUserHoldingsInput) => {
	try {
		const { data } = (await API.graphql(graphqlOperation(mutations.createUserHoldings, { input: holdings }))) as {
			data: APIt.CreateUserHoldingsMutation;
		};
		return data.createUserHoldings as APIt.CreateUserHoldingsInput;
	} catch (e) {
		console.log('Error while adding holdings: ', e);
		return null;
	}
};

export const updateHoldings = async (holdings: APIt.UpdateUserHoldingsInput) => {
	try {
		const { data } = (await API.graphql(graphqlOperation(mutations.updateUserHoldings, { input: holdings }))) as {
			data: APIt.UpdateUserHoldingsMutation;
		};
		return data.updateUserHoldings as APIt.UpdateUserHoldingsInput;
	} catch (e) {
		console.log('Error while updating holdings: ', e);
		return null;
	}
};

export const getRelatedCurrencies = (holdings: APIt.CreateUserHoldingsInput | null, defaultCurrency: string) => {
	let currencyList: any = { [defaultCurrency]: defaultCurrency };
	if (!holdings || !Object.keys(holdings).length) return currencyList;
	Object.keys(holdings).forEach((key) => {
		//@ts-ignore
		let val: Array<any> | null | string = holdings[key];
		if (val && val instanceof Array) {
			val.forEach((obj: any) => {
				if (!currencyList[obj.curr]) currencyList[obj.curr] = obj.curr;
			});
		}
	});
	return currencyList;
};

const getORIdList = (list: Array<any>, ids: Array<string>) => {
	ids.forEach((id: string) => list.push({ id: { eq: id } }));
	return { or: list };
};

export const loadMatchingINExchange = async (isins: Array<string>) => {
  if (!isins.length) return null;
  let idList: Array<APIt.ModelINExchgPriceFilterInput> = [];
  const {
    data: { listINExchgPrices },
  } = (await API.graphql(
    graphqlOperation(queries.listInExchgPrices, {
      limit: 10000,
      filter: getORIdList(idList, isins),
    })
  )) as {
    data: APIt.ListInExchgPricesQuery;
  };
  return listINExchgPrices?.items?.length
    ? (listINExchgPrices.items as Array<APIt.INExchgPrice>)
    : null;
};

export const loadMatchingINMutual = async (isins: Array<string>) => {
  if (!isins.length) return null;
  let idList: Array<APIt.ModelINMFPriceFilterInput> = [];
  let returnList: Array<APIt.INMFPrice> = [];
  let nextToken = null;
  do {
    let variables: any = { limit: 20000, filter: getORIdList(idList, isins) };
    if (nextToken) variables.nextToken = nextToken;
    const {
      data: { listINMFPrices },
    } = (await API.graphql(
      graphqlOperation(queries.listInmfPrices, variables)
    )) as {
      data: APIt.ListInmfPricesQuery;
    };
    if (listINMFPrices?.items?.length)
      returnList.push(...(listINMFPrices.items as Array<APIt.INMFPrice>));
    nextToken = listINMFPrices?.nextToken;
  } while (nextToken);
  return returnList.length ? returnList : null;
};

export const loadMatchingINBond = async (isins: Array<string>) => {
  if (!isins.length) return null;
  let idList: Array<APIt.ModelINBondPriceFilterInput> = [];
  let returnList: Array<APIt.INBondPrice> = [];
  let nextToken = null;
  do {
    let variables: any = { limit: 10000, filter: getORIdList(idList, isins) };
    if (nextToken) variables.nextToken = nextToken;
    const {
      data: { listINBondPrices },
    } = (await API.graphql(
      graphqlOperation(queries.listInBondPrices, variables)
    )) as {
      data: APIt.ListInBondPricesQuery;
    };
    if (listINBondPrices?.items?.length)
      returnList.push(...(listINBondPrices.items as Array<APIt.INBondPrice>));
    nextToken = listINBondPrices?.nextToken;
  } while (nextToken);
  return returnList.length ? returnList : null;
};

export const getAssetTypes = () => {
	return {
		[APIt.AssetType.E]: 'Equity',
		[APIt.AssetType.F]: 'Fixed Income',
		[APIt.AssetType.H]: 'Hybrid',
		[APIt.AssetType.A]: 'Alternative'
	};
};

export const getMarketCap = () => {
	return {
		[APIt.MCap.L]: 'Large Cap',
		Multi: 'Multi Cap'
	};
};

export const getFixedCategories = () => {
	return {
		CB: 'Corporate Bonds',
		GovB: 'Government Bonds',
		LF: 'Liquid Funds',
		I: 'Index Funds',
		IF: 'Interval Funds',
		FMP: 'Fixed Maturity Plans'
	};
};

export const getAssetSubTypes = () => {
	return {
		[APIt.AssetSubType.CB]: 'Corporate Bond',
		[APIt.AssetSubType.GB]: 'Government Bond',
		[APIt.AssetSubType.GBO]: 'Government-backed Bond',
		[APIt.AssetSubType.Gold]: 'Gold',
		[APIt.AssetSubType.GoldB]: 'Gold Bond',
		[APIt.AssetSubType.I]: 'Index',
		[APIt.AssetSubType.L]: 'Liquid',
		[APIt.AssetSubType.R]: 'Real-estate',
		[APIt.AssetSubType.S]: 'Stock',
		[APIt.AssetSubType.C]: 'Crypto',
		[APIt.AssetSubType.V]: 'Vehicle',
		[APIt.AssetSubType.O]: 'Other',
		[APIt.AssetSubType.M]: 'Membership',
		[APIt.AssetSubType.Cash]: 'Cash'
	};
};

export const getFamilyOptions = (allFamily: any) => {
	if (!Object.keys(allFamily).length) return null;
	let options: any = {};
	Object.keys(allFamily).forEach((key) => (options[key] = allFamily[key].name));
	return options;
};

export const getGoldTypes = () => {
	return {
		24: '24',
		22: '22',
		20: '20',
		18: '18',
		16: '16',
		14: '14'
	};
};

export const getColourForAssetType = (at: string) => {
	switch (at) {
		case APIt.AssetType.E:
			return COLORS.ORANGE;
		case APIt.AssetType.F:
			return COLORS.BLUE;
		case APIt.AssetType.A:
			return '#f6e05e';
		case APIt.MCap.L:
			return '#fdd0cb';
		case APIt.MCap.M:
			return '#e78284';
		case APIt.MCap.S:
			return '#cf544e';
		// case APIt.AssetSubType.CB:
		// return COLORS.WHITE;
		default:
			return '#f9aaa6';
	}
};

export const getCommodityRate = async (subtype: string, purity: string, currency: string, fxRates: any) => {
	return await getPrice(subtype === APIt.AssetSubType.Gold ? 'GC' : subtype, 'COMM')
		.then((result) => {
			if (!result) return 0;
			const rate = Number((result / 31.1).toFixed(2));
			return (
				rate * (getFXRate(fxRates, currency) * (Number.parseFloat(purity)) / (subtype === APIt.AssetSubType.Gold ? 24 : 100))
			);
		})
		.catch(() => 0);
};

export const getCryptoRate = (id: string, currency: string) => {
	return getPrice(id, 'CC', currency).then((rate) => rate).catch(() => 0);
};

export const getIndustry = (at: APIt.Industry) => {
	const indData: any = {
		A: 'AUTOMOBILE',
		IM: 'INDUSTRIAL MANUFACTURING',
		F: 'FINANCIAL SERVICES',
		CG: 'CONSUMER GOODS',
		CC: 'CEMENT & CEMENT PRODUCTS',
		CH: 'CHEMICALS',
		CS: 'CONSUMER SERVICES',
		FP: 'FERTILISERS & PESTICIDES',
		C: 'CONSTRUCTION',
		H: 'HEALTHCARE SERVICES',
		PH: 'PHARMA',
		IT: 'IT',
		MED: 'MEDIA ENTERTAINMENT & PUBLICATION',
		MET: 'METALS',
		OG: 'OIL & GAS',
		POW: 'POWER',
		S: 'SERVICES',
		TC: 'TELECOM',
		TEX: 'TEXTILES',
		CAPG: 'CAPITAL GOODS',
		TECH: 'TECHNOLOGY',
		CD: 'CONSUMER DURABLES',
		E: 'ENERGY',
		CDGS: 'CONSUMER DISCRETIONARY GOODS AND SERVICES',
		BASM: 'BASIC MATERIALS',
		U: 'UTILITIES'
	};
	return indData[at];
};

export const getNPSFundManagers = () => {
	return {
		L: 'LIC',
		H: 'HDFC',
		S: 'SBI',
		A: 'ADITYA BIRLA',
		I: 'ICICI',
		U: 'UTI',
		K: 'KOTAK MAHINDRA'
	};
};

export const getCascaderOptions = (
	parent: { [key: string]: string },
	child?: { [key: string]: any },
	haveSameChildren?: boolean
) => {
	let options: Array<any> = [];
	Object.keys(parent).map((parentValue: string) => {
		let childOptions: Array<{ [key: string]: string }> = [];
		if (!child) {
			options.push({ value: parentValue, label: parent[parentValue] });
		} else {
			let children = !haveSameChildren ? child[parentValue] : child;
			if (!children) return;
			Object.keys(children).map((childValue: string) => {
				childOptions.push({ value: childValue, label: children[childValue] });
				if (haveSameChildren) return;
			});
			options.push({
				value: parentValue,
				label: parent[parentValue],
				children: childOptions
			});
		}
	});
	return options;
};

export const financialAssetTypes = [ 'Stock', 'Gold Bond', 'ETF', 'Bond', 'Mutual Fund' ];

export const getNPSData = async () => {
  try {
    const {
      data: { listNPSPrices },
    } = (await API.graphql({
      query: queries.listNpsPrices,
    })) as { data: APIt.ListNpsPricesQuery };
    return listNPSPrices?.items;
  } catch (e) {
    console.log("Error while fetching NPS data: ", e);
  }
};

export const getInstrumentDataWithKey = async (key: string, filter: { prop: string; value: string } | null) => {
	const instrumentData = simpleStorage.get('instrumentData') || {};
	const newQueries: OptionTableMap = Object.assign({}, queries);
	const dataKeys: OptionTableMap = {
		listInExchgPrices: 'listINExchgPrices',
		listInBondPrices: 'listINBondPrices',
		listInmfPrices: 'listINMFPrices'
	};
	const getData = async (query: any, nextToken: any) => {
		const data: any = await API.graphql({
			query: query,
			variables: { limit: 20000, nextToken: nextToken }
		});
		return data;
	};

	try {
		if (!instrumentData || !instrumentData[key]) {
			let nextToken = undefined;
			let items: any = [];
			while (nextToken !== null) {
				const data: any = await getData(newQueries[key], nextToken);
				const dataObj = data.data[dataKeys[key]];
				items = [ ...dataObj.items, ...items ];
				nextToken = dataObj.nextToken;
			}
			instrumentData[key] = items;
			simpleStorage.set(LOCAL_INSTRUMENT_RAW_DATA_KEY, instrumentData, LOCAL_DATA_TTL);
		}
		if (!filter) {
			return instrumentData[key];
		}
		const { prop, value } = filter;
		return instrumentData[key].filter((item: OptionTableMap) => item[prop] === value);
	} catch (e) {
		console.log('Error while fetching instrument data: ', e);
	}
};

export const isFund = (id: string) => id.substring(2, 3) === 'F';

export const isBond = (id: string) => id.substring(2, 3) === '0';

export const isLargeCap = (data: any) =>
    data?.meta?.mcap === APIt.MCap.L || data?.mcap === APIt.MCap.L;

export const hasOnlyCategory = (childTab: string) =>
	[ TAB.OTHER, TAB.VEHICLE, TAB.CRYPTO, TAB.PF, TAB.P2P, TAB.LTDEP, TAB.PROP ].includes(childTab);
export const hasRate = (childTab: string) => [ TAB.PF, TAB.LENT, TAB.LOAN, TAB.P2P, TAB.LTDEP ].includes(childTab);
export const hasName = (childTab: string) => ![ TAB.PM, TAB.NPS, TAB.CRYPTO, TAB.INS, TAB.PF ].includes(childTab);
export const hasQtyWithRate = (childTab: string) => [ TAB.PM, TAB.NPS, TAB.CRYPTO ].includes(childTab);
export const isRangePicker = (childTab: string, category: string) =>
	[ TAB.LENT, TAB.P2P, TAB.LTDEP ].includes(childTab) && category !== NATIONAL_SAVINGS_CERTIFICATE;
export const hasDate = (childTab: string, category: string | undefined) =>
	[ TAB.VEHICLE, TAB.LENT, TAB.LOAN, TAB.INS, TAB.P2P, TAB.LTDEP ].includes(childTab) && category !== 'H';
export const hasPF = (childTab: string) => [ TAB.PF ].includes(childTab);
export const hasOnlyEnddate = (childTab: string) => [ TAB.LOAN, TAB.INS ].includes(childTab);
export const hasminimumCol = (childTab: string) => [ TAB.ANGEL, TAB.SAV, TAB.CREDIT ].includes(childTab);

export const calculateValuation = async (
	childTab: string,
	record: APIt.HoldingInput,
	userInfo: any,
	discountRate: number,
	selectedCurrency: string,
	npsData: any,
	fxRates: any
) => {
	const { PM, CRYPTO, LENT, NPS, PF, VEHICLE, LOAN, INS, P2P, LTDEP } = TAB;
	let value = 0;
	switch (childTab) {
		case INS:
			if (discountRate) {
				value = calculateInsurance(
					record,
					discountRate,
					userInfo?.le,
					userInfo?.dob
				);
			}
			break;
		case LOAN:
			value = calculateLoan(record);
			break;
		case CRYPTO:
			value = await calculateCrypto(record, selectedCurrency);
			break;
		case PM:
			value = await calculatePM(record, selectedCurrency, fxRates);
			break;
		case LENT:
		case P2P:
		case LTDEP:
			value = calculateCompundingIncome(record).valuation;
			break;
		case NPS:
			const result = calculateNPS(record, npsData);
			value = result.value;
			break;
		case VEHICLE:
			value = calculateVehicle(record);
			break;
		case PF:
			value = calculateProvidentFund(record);
		default:
			value = record.amt as number;
			break;
	}
	return value;
};

export const getRateByCategory = (at: string) => {
	const funds: { [key: string]: number } = {
		PF: 7.1,
		EF: 8.5,
		VF: 8.5,
		[NATIONAL_SAVINGS_CERTIFICATE]: 6.8,
		[SUKANYA_SAMRIDDHI_YOJANA]: 7.6
	};
	return funds[at];
};

export const fields = (tab: string) => {
  const { SAV, PM, CRYPTO, LENT, NPS, PF, VEHICLE, LOAN, INS, P2P, LTDEP, PROP, OTHER, ANGEL, CREDIT } = TAB;
  const field: {[key: string]: {}} = {
  [SAV]: { name: 'Comment', amount: 'Amount' },
  [LENT]: {
    type: 'Type & Interest',
    name: 'Comment',
    amount: 'Amount',
    date: 'Start Date & Maturity Date',
    rate: 'Rate'
  },
  [LTDEP]: {
    type: 'Type',
    name: 'Comment',
    amount: 'Amount',
    date: 'Start Date',
    rate: 'Rate',
    duration: 'Duration'
  },
  [PF]: {
    name: 'Comment',
    type: 'Type',
    amount: 'Amount',
    qty: 'Contribution Per Year',
    rate: 'Rate'
  },
  [PROP]: {
    type: 'Type',
    name: 'Comment',
    amount: 'Purchase Amount',
    date: 'Purchase Date',
    rate: 'Appreciation Rate',
    mv: 'Market Value',
    pin: 'Pincode',
    address: 'Address',
    owner: 'Owners'
  },
  [VEHICLE]: {
    type: 'Type',
    name: 'Comment',
    amount: 'Purchase Amount',
    date: 'Purchase Date'
  },
  [PM]: { type: 'Type & Purity', qty: 'Quantity' },
  [OTHER]: { type: 'Type', name: 'Comment', amount: 'Amount' },
  [CRYPTO]: { type: 'Type', qty: 'Quantity' },
  [ANGEL]: { name: 'Comment', amount: 'Amount' },
  [P2P]: {
    name: 'Comment',
    amount: 'Amount',
    date: 'Start Date & Maturity Date',
    rate: 'Rate',
    type: 'Interest'
  },
  [NPS]: { type: 'Fund Manager & Scheme', qty: 'Quantity' },
  [LOAN]: {
    name: 'Comment',
    amount: 'Monthly Installment',
    rate: 'Rate of Interest',
    date: 'End date'
  },
	[INS]: {
    type: 'Type & Premium Mode',
    name: 'Comment',
    amount: 'Premium Amount',
    rate: 'Premium increases',
    date: 'End date'
  },
  [CREDIT]: { name: 'Comment', amount: 'Amount' }
  }
  return field[tab]
}

export const categoryOptions = (tab: string) => {
  const { PM, CRYPTO, LENT, PF, VEHICLE, INS, LTDEP, PROP, OTHER } = TAB;
  const category: {[key: string]: {}} = {
	[LENT]: getCascaderOptions(
    {
      BD: 'Bank Deposit',
      NBD: 'Non-Bank Deposit'
    },
    {
      BD: {
        '4': 'Accumulates every 3 months'
      },
      NBD: {
        '0': 'Paid out',
        '4': 'Accumulates every 3 months',
        '2': 'Accumulates every 6 months',
        '1': 'Accumulates every year'
      }
    },
    false
  ),
	[LTDEP]: getCascaderOptions({
    [NATIONAL_SAVINGS_CERTIFICATE]: 'National Savings Certificate',
    [SUKANYA_SAMRIDDHI_YOJANA]: 'Sukanya Samriddhi Yojana'
	}),
	[PF]: getCascaderOptions({
    PF: 'Pension Fund',
    EF: 'Employee Fund',
    VF: 'Voluntary Fund'
	}),
	[PROP]: getCascaderOptions({
    [PropertyType.P]: 'Plot',
    [PropertyType.A]: 'Apartment',
    [PropertyType.H]: 'House',
    [PropertyType.C]: 'Condominium',
    [PropertyType.COMM]: 'Commercial',
    [PropertyType.T]: 'Townhouse',
    [PropertyType.OTHER]: 'Others'
	}),
	[VEHICLE]: getCascaderOptions({
    2: 'Two-Wheeler',
    3: 'Three-Wheeler',
    4: 'Four-Wheeler'
	}),
	[PM]: getCascaderOptions(
    {
      [AssetSubType.Gold]: 'Gold',
      [SILVER]: 'Silver',
      [PLATINUM]: 'Platinum',
      [PALLADIUM]: 'Palladium'
    },
    {
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
    false
  ),
	[OTHER]: getCascaderOptions({
    Art: 'Art',
    Watch: 'Watch',
    Club: 'Club Membership',
    Time: 'Time Sharing Membership',
    Other: 'Other'
  }),
	[CRYPTO]: getCascaderOptions(cryptoList),
	"P2P Lending": getCascaderOptions({
    '0': 'Paid out',
    '4': 'Accumulates every 3 months',
    '2': 'Accumulates every 6 months',
    '1': 'Accumulates every 1 months'
	}),
	[INS]: getCascaderOptions(
    {
      L: 'Life',
      H: 'Health',
      P: 'Property',
      V: 'Vehicle',
      O: 'Others'
    },
    { 1: 'Yearly', 12: 'Monthly' },
    true
  ),
  }
  return category[tab];
};
