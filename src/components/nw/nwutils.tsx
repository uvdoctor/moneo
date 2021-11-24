import * as mutations from "../../graphql/mutations";
import { API, graphqlOperation } from "aws-amplify";
import * as APIt from "../../api/goals";
import * as queries from "../../graphql/queries";
import { ALL_FAMILY } from "./FamilyInput";
import { GOLD } from "./NWContext";
import { getFXRate } from "../utils";
import { COLORS } from "../../CONSTANTS";
import simpleStorage from "simplestorage.js";
import { LOCAL_DATA_TTL, LOCAL_INSTRUMENT_RAW_DATA_KEY } from "../AppContext";

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

export const loadHoldings = async (uname: string) => {
  const { data: { getUserHoldings }} = 
    await API.graphql(graphqlOperation(queries.getUserHoldings, { uname: uname })) as {
    data: APIt.GetUserHoldingsQuery;
  };
  return getUserHoldings ? getUserHoldings : null;
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
  instrument: APIt.HoldingInput,
  selectedMembers: Array<string>
) =>
  selectedMembers.indexOf(ALL_FAMILY) > -1 ||
  selectedMembers.indexOf(instrument.fId) > -1;

export const doesHoldingMatch = (
  instrument: APIt.HoldingInput,
  selectedMembers: Array<string>,
  selectedCurrency: string
) =>
  doesMemberMatch(instrument, selectedMembers) &&
  instrument.curr === selectedCurrency;

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
  let idList: Array<APIt.ModelINExchgFilterInput> = [];
  const {
    data: { listINExchgs },
  } = (await API.graphql(
    graphqlOperation(queries.listInExchgs, {
      limit: 10000,
      filter: getORIdList(idList, isins),
    })
  )) as {
    data: APIt.ListInExchgsQuery;
  };
  return listINExchgs?.items?.length
    ? (listINExchgs.items as Array<APIt.INExchg>)
    : null;
};

export const loadMatchingINMutual = async (isins: Array<string>) => {
  if (!isins.length) return null;
  let idList: Array<APIt.ModelINMutualFilterInput> = [];
  let returnList: Array<APIt.INMutual> = [];
  let nextToken = null;
  do {
    let variables: any = { limit: 20000, filter: getORIdList(idList, isins) };
    if (nextToken) variables.nextToken = nextToken;
    const {
      data: { listINMutuals },
    } = (await API.graphql(
      graphqlOperation(queries.listInMutuals, variables)
    )) as {
      data: APIt.ListInMutualsQuery;
    };
    if (listINMutuals?.items?.length)
      returnList.push(...(listINMutuals.items as Array<APIt.INMutual>));
    nextToken = listINMutuals?.nextToken;
  } while (nextToken);
  return returnList.length ? returnList : null;
};

export const loadMatchingINBond = async (isins: Array<string>) => {
  if (!isins.length) return null;
  let idList: Array<APIt.ModelINBondFilterInput> = [];
  let returnList: Array<APIt.INBond> = [];
  let nextToken = null;
  do {
    let variables: any = { limit: 10000, filter: getORIdList(idList, isins) };
    if (nextToken) variables.nextToken = nextToken;
    const {
      data: { listINBonds },
    } = (await API.graphql(
      graphqlOperation(queries.listInBonds, variables)
    )) as {
      data: APIt.ListInBondsQuery;
    };
    if (listINBonds?.items?.length)
      returnList.push(...(listINBonds.items as Array<APIt.INBond>));
    nextToken = listINBonds?.nextToken;
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

export const getColourForAssetType = (at: APIt.AssetType) => {
  switch (at) {
    case APIt.AssetType.E:
      return COLORS.ORANGE;
    case APIt.AssetType.F:
      return COLORS.BLUE;
    case APIt.AssetType.A:
      return "#f6e05e";
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
      data: { listNPSs },
    } = (await API.graphql({
      query: queries.listNpSs,
    })) as { data: APIt.ListNpSsQuery };
    return listNPSs?.items;
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
    listInExchgs: "listINExchgs",
    listInBonds: "listINBonds",
    listInMutuals: "listINMutuals",
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
