import * as mutations from "../../graphql/mutations";
import { API, graphqlOperation } from "aws-amplify";
import * as APIt from "../../api/goals";
import * as queries from "../../graphql/queries";
import { ALL_FAMILY } from "./FamilyInput";
import { GOLD, PALLADIUM, PLATINUM, SILVER } from "./NWContext";
import { getFXRate } from "../utils";
import { COLORS } from "../../CONSTANTS";
import simpleStorage from "simplestorage.js";
import { LOCAL_DATA_TTL, LOCAL_INSTRUMENT_RAW_DATA_KEY } from "../AppContext";
import { getCompoundedIncome } from "../calc/finance";

interface OptionTableMap {
  [Stock: string]: string;
}

export const getFamilysList = async () => {
  const {
    data: { listFamilys },
  } = (await API.graphql(graphqlOperation(queries.listFamilys))) as {
    data: APIt.ListFamilysQuery;
  };
  let family: Array<APIt.CreateFamilyInput> | null = listFamilys
    ? (listFamilys.items as Array<APIt.CreateFamilyInput>)
    : null;
  return family;
}

export const loadAllFamilyMembers = async () => {
  const family = await getFamilysList();
  if (!family || !family.length) {
    let member = await addFamilyMember("Self", "XXXXX1234X");
    if (member)
      return {
        [member.id as string]: { name: member.name, taxId: member.tid },
      };
    else return null;
  }
  let familyList: any = {};
  family.forEach((val: APIt.CreateFamilyInput) => {
    if (val.id)
      familyList[val.id as string] = { name: val.name, taxId: val.tid };
  });
  return Object.keys(familyList).length ? familyList : null;
};

export const loadAllHoldings = async (uname: string) => {
  const { data: { getUserHoldings }} = 
    await API.graphql(graphqlOperation(queries.getUserHoldings, { uname: uname })) as {
    data: APIt.GetUserHoldingsQuery;
  };
  return getUserHoldings ? getUserHoldings : null;
};

export const loadInsHoldings = async (uname: string) => {
  const { data: { getUserIns }} = 
    await API.graphql(graphqlOperation(queries.getUserIns, { uname: uname })) as {
    data: APIt.GetUserInsQuery;
  };
  return getUserIns ? getUserIns : null;
};

export const addFamilyMember = async (name: string, taxId: string) => {
  try {
    const { data } = (await API.graphql(
      graphqlOperation(mutations.createFamily, {
        input: { name: name, tid: taxId },
      })
    )) as {
      data: APIt.CreateFamilyMutation;
    };
    return data.createFamily as APIt.CreateFamilyInput;
  } catch (e) {
    console.log("Error while adding family member: ", e);
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

export const getDefaultMember = (
  allFamily: any,
  selectedMembers: Array<string>
) => {
  if (!selectedMembers[0] || selectedMembers.indexOf(ALL_FAMILY) > -1) {
    return Object.keys(allFamily)[0];}
  return selectedMembers[0];
};

export const doesMemberMatch = (
  instrument: APIt.HoldingInput | APIt.InstrumentInput,
  selectedMembers: Array<string>
) =>
  selectedMembers.indexOf(ALL_FAMILY) > -1 ||
  selectedMembers.indexOf(instrument.fId) > -1;

export const doesHoldingMatch = (
  instrument: APIt.HoldingInput | APIt.InstrumentInput,
  selectedMembers: Array<string>,
  selectedCurrency: string
) => {
  //@ts-ignore
  const subType = instrument.subt;
  if(!subType || ![APIt.AssetSubType.C, APIt.AssetSubType.Gold, SILVER, PALLADIUM, PLATINUM].includes(subType)) {
    return instrument.curr === selectedCurrency;
  }
  return doesMemberMatch(instrument, selectedMembers);
}

export const doesPropertyMatch = (
    property: APIt.PropertyInput,
    selectedMembers: Array<string>,
    selectedCurrency: string
  ) =>
    doesPropertyOwnerMatch(property, selectedMembers) &&
    property.curr === selectedCurrency;

export const doesPropertyOwnerMatch = (
  property: APIt.PropertyInput,
  selectedMembers: Array<string>
) => {
  if(selectedMembers.indexOf(ALL_FAMILY) > -1) return true;
  for(let owner of property.own) {
    if(selectedMembers.indexOf(owner.fId) > -1) return true;
  }
  return false;
}

export const addMemberIfNeeded = async (
  allFamily: any,
  allFamilySetter: Function,
  taxId: string
) => {
  let id = getFamilyMemberKey(allFamily, taxId);
  if (id) return id;
  let member = await addFamilyMember(taxId, taxId);
  allFamily[member?.id as string] = { name: member?.name, taxId: member?.tid };
  allFamilySetter(allFamily);
  return member?.id;
};

export const updateFamilyMember = async (member: APIt.UpdateFamilyInput) => {
  try {
    const { data } = (await API.graphql(
      graphqlOperation(mutations.updateFamily, { input: member })
    )) as {
      data: APIt.UpdateFamilyMutation;
    };
    return data.updateFamily as APIt.UpdateFamilyInput;
  } catch (e) {
    console.log("Error while updating family member: ", e);
    return null;
  }
};

export const addInsHoldings = async (holdings: APIt.CreateUserInsInput) => {
  try {
    const { data } = (await API.graphql(
      graphqlOperation(mutations.createUserIns, { input: holdings })
    )) as {
      data: APIt.CreateUserInsMutation;
    };
    return data.createUserIns as APIt.CreateUserInsInput;
  } catch (e) {
    console.log("Error while adding holdings: ", e);
    return null;
  }
};

export const updateInsHoldings = async (holdings: APIt.UpdateUserInsInput) => {
  try {
    const { data } = (await API.graphql(
      graphqlOperation(mutations.updateUserIns, { input: holdings })
    )) as {
      data: APIt.UpdateUserHoldingsMutation;
    };
    return data.updateUserHoldings as APIt.UpdateUserHoldingsInput;
  } catch (e) {
    console.log("Error while updating holdings: ", e);
    return null;
  }
};

export const addHoldings = async (holdings: APIt.CreateUserHoldingsInput) => {
  try {
    const { data } = (await API.graphql(
      graphqlOperation(mutations.createUserHoldings, { input: holdings })
    )) as {
      data: APIt.CreateUserHoldingsMutation;
    };
    return data.createUserHoldings as APIt.CreateUserHoldingsInput;
  } catch (e) {
    console.log("Error while adding holdings: ", e);
    return null;
  }
};

export const updateHoldings = async (holdings: APIt.UpdateUserHoldingsInput) => {
  try {
    const { data } = (await API.graphql(
      graphqlOperation(mutations.updateUserHoldings, { input: holdings })
    )) as {
      data: APIt.UpdateUserHoldingsMutation;
    };
    return data.updateUserHoldings as APIt.UpdateUserHoldingsInput;
  } catch (e) {
    console.log("Error while updating holdings: ", e);
    return null;
  }
};

export const getRelatedCurrencies = (
  holdings: APIt.CreateUserHoldingsInput | null,
  defaultCurrency: string
) => {
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
    [APIt.AssetType.E]: "Equity",
    [APIt.AssetType.F]: "Fixed Income",
    [APIt.AssetType.H]: "Hybrid",
    [APIt.AssetType.A]: "Alternative",
  };
};

export const getMarketCap = () => {
  return {
    [APIt.MCap.L]: 'Large Cap',
    [APIt.MCap.M]: 'Mid Cap',
    [APIt.MCap.S]: 'Small Cap',
    [APIt.MCap.H]: 'Hybrid Cap'
  }
}

export const getFixedCategories = () => {
  return {
    CB: 'Corporate Bonds', 
		GovB: 'Government Bonds',
		LF: 'Liquid Funds',
		I: 'Index Funds',
		IF: 'Interval Funds',
		FMP: 'Fixed Maturity Plans'
  }
};

export const getAssetSubTypes = () => {
  return {
    [APIt.AssetSubType.CB]: "Corporate Bond",
    [APIt.AssetSubType.GB]: "Government Bond",
    [APIt.AssetSubType.GBO]: "Government-backed Bond",
    [APIt.AssetSubType.Gold]: "Gold",
    [APIt.AssetSubType.GoldB]: "Gold Bond",
    [APIt.AssetSubType.I]: "Index",
    [APIt.AssetSubType.L]: "Liquid",
    [APIt.AssetSubType.R]: "Real-estate",
    [APIt.AssetSubType.S]: "Stock",
    [APIt.AssetSubType.C]: "Crypto",
    [APIt.AssetSubType.V]: "Vehicle",
    [APIt.AssetSubType.O]: "Other",
    [APIt.AssetSubType.M]: "Membership",
    [APIt.AssetSubType.Cash]: "Cash"
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
    24: "24",
    22: "22",
    20: "20",
    18: "18",
    16: "16",
    14: "14",
  };
};

export const getColourForAssetType = (at: string) => {
  switch (at) {
    case APIt.AssetType.E:
      return COLORS.ORANGE;
    case APIt.AssetType.F:
      return COLORS.BLUE;
    case APIt.AssetType.A:
      return "#f6e05e";
    case APIt.MCap.L:
      return "#fdd0cb";
    case APIt.MCap.M:
      return "#e78284";
    case APIt.MCap.S:
      return "#cf544e";
    // case APIt.AssetSubType.CB:
      // return COLORS.WHITE;
    default:
      return "#f9aaa6";
  }
};

export const getCommodityRate = (
  ratesData: any,
  subtype: string,
  purity: string,
  currency: string
) => {
  let rate =
    subtype === APIt.AssetSubType.Gold ? ratesData[GOLD] : ratesData[subtype];
  if (!rate) return 0;
  return (
    (rate * getFXRate(ratesData, currency) * Number.parseFloat(purity)) /
    (subtype === APIt.AssetSubType.Gold ? 24 : 100)
  );
};

export const getCryptoRate = (
  ratesData: any,
  cryptoCode: string,
  currency: string
) => {
  let rate = ratesData[cryptoCode];
  if (!rate) return 0;
  return rate * getFXRate(ratesData, currency);
};

export const getIndustry = (at: APIt.Industry) => {
  const indData: any = {
    A: "AUTOMOBILE",
    IM: "INDUSTRIAL MANUFACTURING",
    F: "FINANCIAL SERVICES",
    CG: "CONSUMER GOODS",
    CC: "CEMENT & CEMENT PRODUCTS",
    CH: "CHEMICALS",
    CS: "CONSUMER SERVICES",
    FP: "FERTILISERS & PESTICIDES",
    C: "CONSTRUCTION",
    H: "HEALTHCARE SERVICES",
    PH: "PHARMA",
    IT: "IT",
    MED: "MEDIA ENTERTAINMENT & PUBLICATION",
    MET: "METALS",
    OG: "OIL & GAS",
    POW: "POWER",
    S: "SERVICES",
    TC: "TELECOM",
    TEX: "TEXTILES",
    CAPG: "CAPITAL GOODS",
    TECH: "TECHNOLOGY",
    CD: "CONSUMER DURABLES",
    E: "ENERGY",
    CDGS: "CONSUMER DISCRETIONARY GOODS AND SERVICES",
    BASM: "BASIC MATERIALS",
    U: "UTILITIES",
  };
  return indData[at];
};

export const getNPSFundManagers = () => {
  return {
    L: "LIC PENSION FUND LIMITED",
    H: "HDFC PENSION MANAGEMENT COMPANY LIMITED",
    S: "SBI PENSION FUNDS PRIVATE LIMITED",
    A: "ADITYA BIRLA SUN LIFE PENSION MANAGEMENT LIMITED",
    I: "ICICI PRUDENTIAL PENSION FUNDS MANAGEMENT COMPANY LIMITED",
    U: "UTI RETIREMENT SOLUTIONS LIMITED",
    K: "KOTAK MAHINDRA PENSION FUND LIMITED",
  };
};

export const financialAssetTypes = [
  "Stock",
  "Gold Bond",
  "ETF",
  "Bond",
  "Mutual Fund",
];

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

export const getInstrumentDataWithKey = async (
  key: string,
  filter: { prop: string; value: string } | null
) => {
  const instrumentData = simpleStorage.get("instrumentData") || {};
  const newQueries: OptionTableMap = Object.assign({}, queries);
  const dataKeys: OptionTableMap = {
    listInExchgPrices: "listINExchgPrices",
    listInBondPrices: "listINBondPrices",
    listInmfPrices: "listINMFPrices",
  };
  const getData = async (query: any, nextToken: any) => {
    const data: any = await API.graphql({
      query: query,
      variables: { limit: 20000, nextToken: nextToken },
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
        items = [...dataObj.items, ...items];
        nextToken = dataObj.nextToken;
      }
      instrumentData[key] = items;
      simpleStorage.set(
        LOCAL_INSTRUMENT_RAW_DATA_KEY,
        instrumentData,
        LOCAL_DATA_TTL
      );
    }
    if (!filter) {
      return instrumentData[key];
    }
    const { prop, value } = filter;
    return instrumentData[key].filter(
      (item: OptionTableMap) => item[prop] === value
    );
  } catch (e) {
    console.log("Error while fetching instrument data: ", e);
  }
};

export const getRemainingDuration = (yr: number, mon: number, dur?: number, isMonth: boolean = true) => {
  const today = new Date();		
  const months = ((today.getFullYear() - yr) * 12) + ((today.getMonth()+1) - mon);
  const years = months/12;
  if (dur) {
    let duration = isMonth ? dur : dur*12;
    if (months > duration) return;
  }
  return { months, years };
};

export const getCashFlows = (amt: number, durationEnded: number, cashflows: any, durationLeft: number, rate: number, isMonth: boolean) => {
  const today = new Date();
  let count = 0;
  let time = 0;
  let monthLeftForCY = 0;
  let yrs = durationEnded - (durationEnded%1);
  if(durationEnded) {  
    amt = getCompoundedIncome(rate, amt, isMonth ? yrs/12 : durationEnded, isMonth ? 12 : 1);
  }
  if (isMonth) {
    if (durationEnded) { 
      monthLeftForCY = 12 - (today.getMonth());
      
      const cfs = Array(Math.round(monthLeftForCY)).fill(amt);
      time = durationEnded + monthLeftForCY;
      cashflows = cashflows.concat(cfs);
    }
    for (let index = 0; index < (durationLeft - monthLeftForCY); index++) {
      count++;
      if (count === 12) {
        time += count;
        amt = getCompoundedIncome(rate as number, amt, time / 12, 12);
        const cfs = Array(Math.round(12)).fill(amt);
        cashflows = cashflows.concat(cfs);
        count = 0;
      }
    }
    if (count < 12 && count > 0) {
      time += count;
      amt = getCompoundedIncome(rate as number, amt, time / 12, 12);
      const cfs = Array(Math.round(count)).fill(amt);
      cashflows = cashflows.concat(cfs);
    }
  } else {
    for (let index = 0; index < durationLeft; index++) {
        time += index+1;
        amt = getCompoundedIncome(rate as number, amt, time, 1);
        const cfs = Array(Math.round(1)).fill(amt);
        cashflows = cashflows.concat(cfs);
    }
  }
  return cashflows;
};
