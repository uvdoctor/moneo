import * as mutations from "../../graphql/mutations";
import { API, graphqlOperation } from "aws-amplify";
import * as APIt from "../../api/goals";
import * as queries from "../../graphql/queries";
import { ALL_FAMILY } from "./FamilyInput";
import {
  DEFAULT_TID,
  NATIONAL_SAVINGS_CERTIFICATE,
  PALLADIUM,
  PLATINUM,
  RISK_TAB,
  SILVER,
  SUKANYA_SAMRIDDHI_YOJANA,
  TAB,
} from "./NWContext";
import {
  getFXRate,
  getPrice,
  initOptions,
  toHumanFriendlyCurrency,
  toReadableNumber,
} from "../utils";
import {
  COLORS,
  LOCAL_DATA_TTL,
  LOCAL_EXCHG_DATA_KEY,
  LOCAL_FUN_DATA_KEY,
  LOCAL_INDEX_PERF_KEY,
  LOCAL_INS_DATA_KEY,
  LOCAL_NPS_DATA_KEY,
} from "../../CONSTANTS";
import simpleStorage from "simplestorage.js";
import {
  calculateCompundingIncome,
  calculateCrypto,
  calculateLoan,
  calculateNPS,
  calculatePM,
  calculateProvidentFund,
  calculateVehicle,
} from "./valuationutils";
import { AssetSubType, InsType, PropertyType } from "../../api/goals";
import { GRAPHQL_AUTH_MODE } from "@aws-amplify/api-graphql";

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
        tax: val.tax,
      };
    }
  });
  return Object.keys(familyList).length ? familyList : null;
};

export const loadAllHoldings = async (uname: string) => {
  const {
    data: { getUserHoldings },
  } = (await API.graphql(
    graphqlOperation(queries.getUserHoldings, { uname: uname })
  )) as {
    data: APIt.GetUserHoldingsQuery;
  };
  return getUserHoldings ? getUserHoldings : null;
};

export const loadInsHoldings = async (uname: string) => {
  const {
    data: { getUserIns },
  } = (await API.graphql(
    graphqlOperation(queries.getUserIns, { uname: uname })
  )) as {
    data: APIt.GetUserInsQuery;
  };
  return getUserIns ? getUserIns : null;
};

export const addFamilyMember = async (
  name: string,
  taxId: string,
  tax: APIt.TaxLiability
) => {
  try {
    const { data } = (await API.graphql(
      graphqlOperation(mutations.createFamily, {
        input: { name: name, tid: taxId, tax },
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
    return Object.keys(allFamily)[0];
  }
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
  if (
    !subType ||
    ![APIt.AssetSubType.Gold, SILVER, PALLADIUM, PLATINUM].includes(subType)
  ) {
    if (instrument.curr !== selectedCurrency) return false;
  }
  return doesMemberMatch(instrument, selectedMembers);
};

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
  let tidAlreadyExists = getFamilyMemberKey(allFamily, taxId);
  if (tidAlreadyExists) return tidAlreadyExists;
  const id = memberKeys[0];
  if(memberKeys.length === 1 && allFamily[id].taxId === DEFAULT_TID) {
    const { name, tax } = allFamily[id];
    let member = await updateFamilyMember({id, name, tid: taxId, tax});
    allFamily[id] = { name: member?.name, taxId: member?.tid, tax: member?.tax };
    return member?.id;
  }
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

export const updateHoldings = async (
  holdings: APIt.UpdateUserHoldingsInput
) => {
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

const getORIdList = (list: Array<any>, ids: Array<string>) => {
  ids.forEach((id: string) => {
    if (!id) return;
    list.push({ id: { eq: id } });
  });
  return {
    or: list,
  };
};

const getORNameList = (list: Array<any>, ids: Array<string>) => {
  ids.forEach((id: string) => {
    if (!id) return;
    list.push({ name: { eq: id } });
  });
  return {
    or: list,
  };
};

export const loadMatchingINExchange = async (ids: Array<string>, user:boolean) => {
  if (!ids.length) return null;
  const isins = JSON.parse(JSON.stringify(ids));
  let returnList: Array<APIt.INExchgPrice> = [];
  const maxLimit = 50;
  const isinChunks: Array<Array<string>> = new Array(
    Math.ceil(isins.length / maxLimit)
  )
    .fill("")
    .map((_) => isins.splice(0, maxLimit));
  for (let isinChunk of isinChunks) {
    let idList: Array<APIt.ModelINExchgPriceFilterInput> = [];
    let nextToken = null;
    do {
      let variables: any = {
        limit: 5000,
        filter: getORIdList(idList, isinChunk),
      };
      if (nextToken) variables.nextToken = nextToken;
      const {
        data: { listINExchgPrices },
      } = await API.graphql({
        query: queries.listINExchgPrices,
        variables: variables,
        authMode: !user
            ? GRAPHQL_AUTH_MODE.AWS_IAM
            : GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
      }) as {
        data: APIt.ListINExchgPricesQuery;
      };
      if (listINExchgPrices?.items?.length)
        returnList.push(
          ...(listINExchgPrices.items as Array<APIt.INExchgPrice>)
        );
      nextToken = listINExchgPrices?.nextToken;
    } while (nextToken);
  }
  return returnList.length ? returnList : null;
};

export const loadMatchingINMutual = async (isins: Array<string>, user:boolean) => {
  if (!isins.length) return null;
  let idList: Array<APIt.ModelINMFPriceFilterInput> = [];
  let returnList: Array<APIt.INMFPrice> = [];
  let nextToken = null;
  do {
    let variables: any = { limit: 5000, filter: getORIdList(idList, isins) };
    if (nextToken) variables.nextToken = nextToken;
    const {
      data: { listINMFPrices },
    } = await API.graphql({
      query: queries.listINMFPrices,
      variables: variables,
      authMode: !user
          ? GRAPHQL_AUTH_MODE.AWS_IAM
          : GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
    }) as {
      data: APIt.ListINMFPricesQuery;
    };
    if (listINMFPrices?.items?.length)
      returnList.push(...(listINMFPrices.items as Array<APIt.INMFPrice>));
    nextToken = listINMFPrices?.nextToken;
  } while (nextToken);
  return returnList.length ? returnList : null;
};

export const loadMatchingINBond = async (isins: Array<string>, user:boolean) => {
  if (!isins.length) return null;
  let idList: Array<APIt.ModelINBondPriceFilterInput> = [];
  let returnList: Array<APIt.INBondPrice> = [];
  let nextToken = null;
  do {
    let variables: any = { limit: 5000, filter: getORIdList(idList, isins) };
    if (nextToken) variables.nextToken = nextToken;
    const {
      data: { listINBondPrices },
    } = await API.graphql({
      query: queries.listINBondPrices,
      variables: variables,
      authMode: !user
          ? GRAPHQL_AUTH_MODE.AWS_IAM
          : GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
    }) as {
      data: APIt.ListINBondPricesQuery;
    };
    if (listINBondPrices?.items?.length)
      returnList.push(...(listINBondPrices.items as Array<APIt.INBondPrice>));
    nextToken = listINBondPrices?.nextToken;
  } while (nextToken);
  return returnList.length ? returnList : null;
};

export const loadMatchingIndices = async (isins: Array<string>, user:boolean) => {
  if (!isins.length) return null;
  let idList: Array<APIt.ModelAllIndicesFilterInput> = [];
  let returnList: Array<APIt.AllIndices> = [];
  let nextToken = null;
  do {
    let variables: any = { limit: 5000, filter: getORIdList(idList, isins) };
    if (nextToken) variables.nextToken = nextToken;
    const {
      data: { listAllIndicess },
    } = await API.graphql({
      query: queries.listAllIndicess,
      variables: variables,
      authMode: !user
          ? GRAPHQL_AUTH_MODE.AWS_IAM
          : GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
    }) as {
      data: APIt.ListAllIndicessQuery;
    };
    if (listAllIndicess?.items?.length)
      returnList.push(...(listAllIndicess.items as Array<APIt.AllIndices>));
    nextToken = listAllIndicess?.nextToken;
  } while (nextToken);
  return returnList.length ? returnList : null;
};

export const loadMatchingInsPerf = async (ids: Array<string>, user:boolean) => {
  if (!ids.length) return null;
  const isins = JSON.parse(JSON.stringify(ids));
  let returnList: Array<APIt.InsHistPerf> = [];
  const maxLimit = 50;
  const isinChunks: Array<Array<string>> = new Array(
    Math.ceil(isins.length / maxLimit)
  )
    .fill("")
    .map((_) => isins.splice(0, maxLimit));
  for (let isinChunk of isinChunks) {
    let idList: Array<APIt.ModelInsHistPerfFilterInput> = [];
    let nextToken = null;
    do {
      let variables: any = {
        limit: 5000,
        filter: getORIdList(idList, isinChunk),
      };
      if (nextToken) variables.nextToken = nextToken;
      const {
        data: { listInsHistPerfs },
      } = await API.graphql({
        query: queries.listInsHistPerfs,
        variables: variables,
        authMode: !user
            ? GRAPHQL_AUTH_MODE.AWS_IAM
            : GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
      }) as {
        data: APIt.ListInsHistPerfsQuery;
      };
      if (listInsHistPerfs?.items?.length)
        returnList.push(...(listInsHistPerfs.items as Array<APIt.InsHistPerf>));
       nextToken = listInsHistPerfs?.nextToken;
    } while (nextToken);
  }
  return returnList.length ? returnList : null;
};

export const loadMatchingIndexPerf = async (isins: Array<string>, user:boolean) => {
  if (!isins.length) return null;
  let idList: Array<APIt.ModelIndiceHistPerfFilterInput> = [];
  let returnList: Array<APIt.IndiceHistPerf> = [];
  let nextToken = null;
  do {
    let variables: any = { limit: 5000, filter: getORNameList(idList, isins) };
    if (nextToken) variables.nextToken = nextToken;
    const {
      data: { listIndiceHistPerfs },
    } = await API.graphql({
      query: queries.listIndiceHistPerfs,
      variables: variables,
      authMode: !user
          ? GRAPHQL_AUTH_MODE.AWS_IAM
          : GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
    }) as {
      data: APIt.ListIndiceHistPerfsQuery;
    };
    if (listIndiceHistPerfs?.items?.length)
      returnList.push(
        ...(listIndiceHistPerfs.items as Array<APIt.IndiceHistPerf>)
      );
    nextToken = listIndiceHistPerfs?.nextToken;
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

export const getStockMarketCap = () => {
  return {
    [APIt.MCap.Large]: "Large-cap",
    [APIt.MCap.Mid]: "Mid-cap",
    [APIt.MCap.Small]: "Small-cap",
  };
};

export const getMoversCategory = (isStockTab?: boolean) => {
  return isStockTab
    ? {
        gainers: "Gainers",
        losers: "Losers",
        movers: "Movers",
        yhighlow: "52-weeks high & low",
      }
    : {
        gainers: "Gainers",
        losers: "Losers",
      };
};

export const getMutualFundMarketCap = () => {
  let mCap: any = getStockMarketCap();
  mCap[APIt.MCap.Hybrid] = "Multi-cap";
  return mCap;
};

export const getFixedCategories = () => {
  return {
    CB: "Corporate Bonds",
    GovB: "Government Bonds",
    LF: "Liquid Funds",
    I: "Index Funds",
    IF: "Interval Funds",
    FMP: "Fixed Maturity Plans",
  };
};

export const getInsuranceType = () => {
  return {
    H: "Health",
    L: "Life",
    V: "Vehicle",
    P: "Property",
    O: "Other",
    A: "Accident",
  };
};

export const getRiskProfileType = () => {
  return {
    [APIt.RiskProfile.VC]: "No loss",
    [APIt.RiskProfile.C]: "Up to 10% loss",
    [APIt.RiskProfile.M]: "Up to 20% loss",
    [APIt.RiskProfile.A]: "Up to 30% loss",
    [APIt.RiskProfile.VA]: "Up to 50% loss",
    Exceeds: "Exceeds risk profile",
  };
};

export const getRiskAttributes = () => {
  return {
    [APIt.RiskProfile.VC]: { label: "No loss", color: COLORS.GREEN },
    [APIt.RiskProfile.C]: { label: "Up to 10% loss", color: "#ffc107" },
    [APIt.RiskProfile.M]: { label: "Up to 20% loss", color: "#ffa698" },
    [APIt.RiskProfile.A]: { label: "Up to 30% loss", color: COLORS.ORANGE },
    [APIt.RiskProfile.VA]: { label: "Up to 50% loss", color: COLORS.RED },
  };
};

export const getRiskAttributesByProfile = (risk: APIt.RiskProfile) =>
  getRiskAttributes()[risk];

export const getMarketCapLabel = (mCap: APIt.MCap) => {
  let marketCapMap: any = getStockMarketCap();
  return marketCapMap[mCap];
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
    [APIt.AssetSubType.Cash]: "Cash",
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
    case APIt.MCap.Large:
      return "#fdd0cb";
    case APIt.MCap.Mid:
      return "#e78284";
    case APIt.MCap.Small:
      return "#cf544e";
    // case APIt.AssetSubType.CB:
    // return COLORS.WHITE;
    default:
      return "#f9aaa6";
  }
};

export const getCommodityRate = async (
  subtype: string,
  purity: string,
  currency: string,
  fxRates: any,
  isPrev: boolean = false
) => {
  return await getPrice(
    subtype === APIt.AssetSubType.Gold ? "GC" : subtype,
    "COMM",
    isPrev
  )
    .then((result) => {
      if (!result || isNaN(result)) return 0;
      let rate = Number((result / 31.1).toFixed(2));
      if (subtype === APIt.AssetSubType.Gold || subtype === "SI") {
        rate = rate * 1.11;
      }
      return (
        rate *
        ((getFXRate(fxRates, currency) * Number.parseFloat(purity)) /
          (subtype === APIt.AssetSubType.Gold ? 24 : 100))
      );
    })
    .catch(() => 0);
};

export const getCryptoRate = (
  id: string,
  currency: string,
  fxRates: any,
  isPrev: boolean = false
) => {
  return getPrice(id, "CC", isPrev)
    .then((rate) => {
      if (!rate || isNaN(rate)) return 0;
      return rate * getFXRate(fxRates, currency);
    })
    .catch(() => 0);
};

export const getExchgRate = async (id: string, exchg: string) => {
  const data = await getPrice(id, "US", false, exchg);
  if (!data) return { prev: 0, price: 0 };
  return data;
};

export const getForexRate = (currency: string, isPrev: boolean = false) => {
  return getPrice(currency, "FOREX", isPrev)
    .then((rate) => {
      if (!rate || isNaN(rate)) return 0;
      return rate;
    })
    .catch(() => 0);
};

export const getNPSFundManagers = () => {
  return {
    L: "LIC",
    H: "HDFC",
    S: "SBI",
    A: "ADITYA BIRLA",
    I: "ICICI",
    U: "UTI",
    K: "KOTAK MAHINDRA",
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
        children: childOptions,
      });
    }
  });
  return options;
};

export const initializeNPSData = async () => {
  let npsData: Array<APIt.CreateNPSPriceInput> | null =
    simpleStorage.get(LOCAL_NPS_DATA_KEY);
  if (npsData) return npsData;
  const {
    data: { listNPSPrices },
  } = (await API.graphql(graphqlOperation(queries.listNPSPrices))) as {
    data: APIt.ListNPSPricesQuery;
  };
  npsData = listNPSPrices?.items?.length
    ? (listNPSPrices.items as Array<APIt.CreateNPSPriceInput>)
    : null;
  if (npsData) simpleStorage.set(LOCAL_NPS_DATA_KEY, npsData, LOCAL_DATA_TTL);
  return npsData;
};

export const loadIndexPerf = async (user:boolean) => {
  let indexPerfData: Array<APIt.CreateIndiceHistPerfInput> | null =
    simpleStorage.get(LOCAL_INDEX_PERF_KEY);
  if (indexPerfData) return indexPerfData;
  const {
    data: { listIndiceHistPerfs },
  } = await API.graphql({
    query: queries.listIndiceHistPerfs,
    authMode: !user
        ? GRAPHQL_AUTH_MODE.AWS_IAM
        : GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
  }) as {
    data: APIt.ListIndiceHistPerfsQuery;
  };
  indexPerfData = listIndiceHistPerfs?.items?.length
    ? (listIndiceHistPerfs.items as Array<APIt.CreateIndiceHistPerfInput>)
    : null;
  if (indexPerfData)
    simpleStorage.set(LOCAL_INDEX_PERF_KEY, indexPerfData, LOCAL_DATA_TTL);
  return indexPerfData;
};

export const getFinTabFilters = (option: string) => {
  const { STOCK, GOLDB, BOND, REIT, OIT, ETF } = TAB;
  switch (option) {
    case GOLDB:
      return { prop: "subt", value: AssetSubType.GoldB };
    case ETF:
      return { prop: "itype", value: InsType.ETF };
    case REIT:
      return { prop: "itype", value: InsType.REIT };
    case OIT:
      return { prop: "itype", value: InsType.InvIT };
    case STOCK:
      return { prop: "subt", value: AssetSubType.S };
    case BOND:
      return {
        prop: "subt",
        value: [AssetSubType.GB, AssetSubType.GBO, AssetSubType.CB],
      };
    default:
      return null;
  }
};

export const getInstrumentDataWithKey = async (key: { query: any, table: string }, option: string, user:boolean) => {
  const { STOCK } = TAB;
  let instrumentData = key.table === "Exchg"
      ? simpleStorage.get(LOCAL_EXCHG_DATA_KEY) || {}
      : simpleStorage.get(option) || {};
  const filter: { prop: string; value: string | Array<string> } | null = getFinTabFilters(option);
  const dataKeys: { [key: string]: string } = {
    Exchg: 'listINExchgPrices',
    Bonds: "listINBondPrices",
    Funds: "listINMFPrices",
    Indices: "listAllIndicess",
  };
  const getData = async (query: any, nextToken: any) => {
    return await API.graphql({
      query: query,
      variables: { limit: 20000, nextToken: nextToken },
      authMode: !user
          ? GRAPHQL_AUTH_MODE.AWS_IAM
          : GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
    });
  };

  try {
    if (!Object.keys(instrumentData).length) {
      let nextToken = undefined;
      let items: any = [];
      while (nextToken !== null) {
        const data: any = await getData(key.query, nextToken);
        const dataObj = data.data[dataKeys[key.table]];
        items = [...dataObj.items, ...items];
        nextToken = dataObj.nextToken;
      }
      instrumentData = items;
      if (key.table === 'Exchg') {
        simpleStorage.set(LOCAL_EXCHG_DATA_KEY, instrumentData, LOCAL_DATA_TTL);
      } else {
        simpleStorage.set(option, instrumentData, LOCAL_DATA_TTL);
      }
    }
    if (!filter) return instrumentData;
    const { prop, value } = filter;
    const data = instrumentData.filter((item: OptionTableMap) => {
      if (Array.isArray(value)) return value.includes(item[prop]);
      else {
        if (option === STOCK) return item[prop] === value && !item.itype;
        return item[prop] === value;
      }
    });
    simpleStorage.set(option, data, LOCAL_DATA_TTL);
    console.log(data.length);
    return data;
  } catch (e) {
    console.log("Error while fetching instrument data: ", e);
  }
};

export const isFund = (id: string) => id.substring(2, 3) === "F";

export const isBond = (id: string) => id.substring(2, 3) === "0";

export const isLargeCap = (data: any) => data?.mcapt === APIt.MCap.Large;

export const hasRisktab = (childTab: string) =>
  [
    TAB.HEALTH_INS,
    TAB.LIFE_INS,
    TAB.VEHICLE_INS,
    TAB.OTHERS_INS,
    TAB.PROPERTY_INS,
    TAB.ACCIDENT_INS,
  ].includes(childTab);

export const hasOnlyCategory = (childTab: string) =>
  [
    TAB.OTHER,
    TAB.VEHICLE,
    TAB.CRYPTO,
    TAB.PF,
    TAB.P2P,
    TAB.LTDEP,
    TAB.PROP,
  ].includes(childTab) || hasRisktab(childTab);
export const hasRate = (childTab: string) =>
  [
    TAB.PF,
    TAB.LENT,
    TAB.LOAN,
    TAB.P2P,
    TAB.LTDEP,
    TAB.HEALTH_INS,
    TAB.ACCIDENT_INS,
    TAB.PROPERTY_INS,
    TAB.OTHERS_INS,
    TAB.VEHICLE_INS,
  ].includes(childTab);
export const hasName = (childTab: string) =>
  ![
    TAB.PM,
    TAB.NPS,
    TAB.CRYPTO,
    TAB.PF,
    TAB.LIFE_INS,
    TAB.HEALTH_INS,
    TAB.ACCIDENT_INS,
    TAB.VEHICLE_INS,
    TAB.PROPERTY_INS,
    TAB.OTHERS_INS,
  ].includes(childTab);
export const hasQtyWithRate = (childTab: string) =>
  [TAB.PM, TAB.NPS, TAB.CRYPTO].includes(childTab);
export const isRangePicker = (childTab: string, category: string) =>
  [TAB.LENT, TAB.P2P, TAB.LTDEP].includes(childTab) &&
  category !== NATIONAL_SAVINGS_CERTIFICATE;
export const hasDate = (childTab: string) =>
  [
    TAB.VEHICLE,
    TAB.LENT,
    TAB.LOAN,
    TAB.P2P,
    TAB.LTDEP,
    TAB.LIFE_INS,
    TAB.PROPERTY_INS,
    TAB.OTHERS_INS,
    TAB.VEHICLE_INS,
  ].includes(childTab);
export const hasPF = (childTab: string) => [TAB.PF].includes(childTab);
export const hasOnlyEnddate = (childTab: string) =>
  [
    TAB.LOAN,
    TAB.LIFE_INS,
    TAB.PROPERTY_INS,
    TAB.OTHERS_INS,
    TAB.VEHICLE_INS,
  ].includes(childTab);
export const hasminimumCol = (childTab: string) =>
  [TAB.ANGEL, TAB.SAV, TAB.CREDIT].includes(childTab);
export const hasTags = (childTab: string): Boolean =>
  [TAB.STOCK, TAB.MF, TAB.BOND].includes(childTab);

export const calculateValuation = async (
  childTab: string,
  record: APIt.HoldingInput,
  selectedCurrency: string,
  fxRates: any
) => {
  const { PM, CRYPTO, LENT, NPS, PF, VEHICLE, LOAN, P2P, LTDEP } = TAB;
  let value = 0;
  switch (childTab) {
    case LOAN:
      value = calculateLoan(record);
      break;
    case CRYPTO:
      value = await calculateCrypto(record, selectedCurrency, fxRates);
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
      const result = await calculateNPS(record);
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
    [SUKANYA_SAMRIDDHI_YOJANA]: 7.6,
  };
  return funds[at];
};

export const getFieldsAndInfo = (tab: string) => {
  const {
    SAV,
    PM,
    CRYPTO,
    LENT,
    NPS,
    PF,
    VEHICLE,
    LOAN,
    P2P,
    LTDEP,
    PROP,
    OTHER,
    ANGEL,
    CREDIT,
  } = TAB;
  const fieldsAndInfo: { [key: string]: { fields: {}; info: {} } } = {
    [SAV]: {
      fields: { name: "Comment", amount: "Amount" },
      info: { amount: "Balance available in your bank account" },
    },
    [LENT]: {
      fields: {
        type: "Type & Interest",
        name: "Comment",
        amount: "Amount",
        date: "Start Date & Maturity Date",
        rate: "Rate",
      },
      info: {
        type: "Deposit type and Interest Payout Frequency",
        amount: "Deposits amount",
        date: "Date range",
        rate: "Interest Rate",
      },
    },
    [LTDEP]: {
      fields: {
        type: "Type",
        name: "Comment",
        amount: "Amount",
        date: "Start Date & Maturity Date",
        rate: "Rate",
        duration: "Duration",
      },
      info: {
        type: "Long Term Deposit Types",
        amount: "Deposits Amount",
        date: "Date Range",
        rate: "Interest Rate",
        duration: "Number of duration",
      },
    },
    [PF]: {
      fields: {
        name: "Comment",
        type: "Type",
        amount: "Amount",
        qty: "Contribution Per Year",
        rate: "Rate",
      },
      info: {
        type: "Pension Fund Type",
        amount: "Amount",
        qty: "Amount Contributed Every Year",
        rate: "Interest Rate",
      },
    },
    [PROP]: {
      fields: {
        type: "Type",
        name: "Comment",
        amount: "Purchase Amount",
        date: "Purchase Date",
        rate: "Appreciation Rate",
        mv: "Market Value",
        pin: "Pincode",
        address: "Address",
        owner: "Owners",
      },
      info: {
        type: "Property Type",
        amount: "Amount paid while buying property",
        date: "Purchase Date",
        rate: "Appreciation Rate",
        mv: "Value of the property in present time",
        pin: "Pincode",
        address: "Address",
        owner: "Add owners and their percentage shared",
      },
    },
    [VEHICLE]: {
      fields: {
        type: "Type",
        name: "Comment",
        amount: "Purchase Amount",
        date: "Purchase Date",
      },
      info: {
        type: "Vehicle Type",
        amount: "Purchase Amount",
        date: "Purchase Date",
      },
    },
    [PM]: {
      fields: { type: "Type & Purity", qty: "Quantity" },
      info: {
        type: "Metals type and purity",
        qty: "Specify the quantity in grams",
      },
    },
    [OTHER]: {
      fields: { type: "Type", name: "Comment", amount: "Amount" },
      info: { type: "Type", amount: "Amount" },
    },
    [CRYPTO]: {
      fields: { type: "Type", qty: "Quantity" },
      info: {
        type: "Type of CryptoCurrency you invested in",
        qty: "Quantity purchased in crypto",
      },
    },
    [ANGEL]: {
      fields: { name: "Comment", amount: "Amount" },
      info: { amount: "Amount invested in Startups" },
    },
    [P2P]: {
      fields: {
        name: "Comment",
        amount: "Amount",
        date: "Start Date & Maturity Date",
        rate: "Rate",
        type: "Interest",
      },
      info: {
        amount: "Amount lended to an individual",
        date: "Start Date & Maturity Date",
        rate: "Interest Rate",
        type: "Interest Payout Frequency",
      },
    },
    [NPS]: {
      fields: { type: "Fund Manager & Scheme", qty: "Quantity" },
      info: {
        type: "Specify the Fund manager and Scheme Type of National Pension Scheme",
        qty: "Quantity",
      },
    },
    [LOAN]: {
      fields: {
        name: "Comment",
        amount: "Monthly Installment",
        rate: "Interest Rate",
        date: "End date",
      },
      info: {
        amount: "Monthly Installment",
        rate: "Interest Rate",
        date: "End date",
      },
    },
    [CREDIT]: {
      fields: { name: "Comment", amount: "Amount" },
      info: { amount: "Amount" },
    },
    Risk: {
      fields: {
        type: "Premium Mode",
        amount: "Premium Amount",
        rate: "Premium increases",
        date: "End date",
        qty: "Sum Insured",
      },
      info: {
        type: "Premium Mode",
        amount: "Premium Amount",
        rate: "Premium increases",
        date: "End date",
        qty: "Total coverage amount of the policy",
      },
    },
  };
  return fieldsAndInfo[tab];
};

export const getCategoryOptions = (tab: string) => {
  const { PM, CRYPTO, LENT, PF, VEHICLE, LTDEP, PROP, OTHER } = TAB;
  const category: { [key: string]: {} } = {
    [LENT]: getCascaderOptions(
      {
        BD: "Bank Deposit",
        NBD: "Non-Bank Deposit",
      },
      {
        BD: {
          "4": "Accumulates every 3 months",
        },
        NBD: {
          "0": "Paid out",
          "4": "Accumulates every 3 months",
          "2": "Accumulates every 6 months",
          "1": "Accumulates every year",
        },
      },
      false
    ),
    [LTDEP]: getCascaderOptions({
      [NATIONAL_SAVINGS_CERTIFICATE]: "National Savings Certificate",
      [SUKANYA_SAMRIDDHI_YOJANA]: "Sukanya Samriddhi Yojana",
    }),
    [PF]: getCascaderOptions({
      PF: "Public (PPF)",
      EF: "Employee (EPF)",
      VF: "Voluntary (VPF)",
    }),
    [PROP]: getCascaderOptions({
      [PropertyType.P]: "Plot",
      [PropertyType.A]: "Apartment",
      [PropertyType.H]: "House",
      [PropertyType.C]: "Condominium",
      [PropertyType.COMM]: "Commercial",
      [PropertyType.T]: "Townhouse",
      [PropertyType.OTHER]: "Others",
    }),
    [VEHICLE]: getCascaderOptions({
      2: "Two-Wheeler",
      3: "Three-Wheeler",
      4: "Four-Wheeler",
    }),
    [PM]: getCascaderOptions(
      {
        [AssetSubType.Gold]: "Gold",
        [SILVER]: "Silver",
        [PLATINUM]: "Platinum",
        [PALLADIUM]: "Palladium",
      },
      {
        [AssetSubType.Gold]: initOptions(8, 16),
        [SILVER]: {
          "100": "Pure",
          "95.8": "Brittania (95.8%)",
          "92.5": "Sterling (92.5%)",
          "90": "Coin (90%)",
          "80": "Jewellery (80%)",
        },
        [PLATINUM]: {
          "100": "Pure",
          "95": "95%",
          "90": "90%",
          "85": "85%",
          "80": "80%",
          "50": "50%",
        },
        [PALLADIUM]: {
          "100": "Pure",
          "95": "95%",
          "90": "90%",
          "85": "85%",
          "80": "80%",
          "50": "50%",
        },
      },
      false
    ),
    [OTHER]: getCascaderOptions({
      Art: "Art",
      Watch: "Watch",
      Club: "Club Membership",
      Time: "Time Sharing Membership",
      Other: "Other",
    }),
    [CRYPTO]: {},
    "P2P Lending": getCascaderOptions({
      "0": "Paid out",
      "4": "Accumulates every 3 months",
      "2": "Accumulates every 6 months",
      "1": "Accumulates every 1 month",
    }),
    [RISK_TAB]: getCascaderOptions({ 1: "Yearly", 12: "Monthly" }),
  };
  return category[tab];
};

const getRiskTotalLabel = (type: string) => {
  switch (type) {
    case "stocks":
      return "Stocks";
    case "bonds":
      return "Bonds";
    case "mfs":
      return "Mutual funds";
    case "etfs":
      return "ETFs";
    default:
      return "Others";
  }
};

const getTooltipDescItem = (
  label: string,
  value: number,
  totalAssets: number,
  currency: string,
  isRiskItem?: boolean
) => {
  const amount = toHumanFriendlyCurrency(value, currency);
  const percentage = toReadableNumber((value / totalAssets) * 100, 2);
  return `${amount} (${percentage}%) of ${
    isRiskItem ? getRiskTotalLabel(label) : label
  }<br/><br/>`;
};

export const getTooltipDesc = (
  records: any,
  selectedCurrency: string,
  totalAssets: number,
  riskTotals?: any
) => {
  let data: any = "";
  Object.keys(records).map((value) => {
    if (!records[value]) return;
    data += getTooltipDescItem(
      value,
      records[value],
      totalAssets,
      selectedCurrency
    );
  });
  if (riskTotals)
    Object.keys(riskTotals).map((rt) => {
      if (!riskTotals[rt]) return;
      data += getTooltipDescItem(
        rt,
        riskTotals[rt],
        totalAssets,
        selectedCurrency,
        true
      );
    });
  return data ? `<br/><br/>Includes<br/><br/>${data}` : "";
};

export const getFamilyMemberOptions = (
  familyMemberKeys: string[],
  allFamily: any
) => {
  let opts: any = {};
  familyMemberKeys.forEach((key: string) => (opts[key] = allFamily[key].name));
  return opts;
};

export const doesExceedRisk = (
  risk: APIt.RiskProfile,
  riskProfile: APIt.RiskProfile
) => {
  const riskProfiles = Object.keys(APIt.RiskProfile);
  const higherRiskValues = riskProfiles.slice(
    riskProfiles.indexOf(riskProfile) + 1
  );
  return higherRiskValues.includes(risk);
};

export const filterRisk = (
  selectedTags: string[],
  risk: APIt.RiskProfile,
  riskProfile: APIt.RiskProfile
) => {
  return (
    selectedTags.includes(risk) ||
    (selectedTags.includes("Exceeds") && doesExceedRisk(risk, riskProfile))
  );
};

export const filterFixCategory = (
  selectedTags: string[],
  subt: string,
  mftype: string
) => {
  return (
    (selectedTags.includes(AssetSubType.CB) &&
      (subt === AssetSubType.CB || mftype === APIt.MFSchemeType.O)) ||
    (selectedTags.includes(AssetSubType.I) && subt === AssetSubType.I) ||
    (selectedTags.includes("GovB") &&
      (subt === AssetSubType.GB || subt === AssetSubType.GBO)) ||
    (selectedTags.includes("IF") &&
      subt === AssetSubType.HB &&
      mftype === APIt.MFSchemeType.I) ||
    (selectedTags.includes("FMP") &&
      subt === AssetSubType.HB &&
      mftype === APIt.MFSchemeType.C) ||
    (selectedTags.includes("LF") && subt === AssetSubType.L)
  );
};

export const loadMatchingINExchgFun = async (sids: Array<string>) => {
  if (!sids.length) return null;
  let idList: Array<APIt.ModelINExchgFunFilterInput> = [];
  let returnList: Array<APIt.INExchgFun> = [];
  let nextToken = null;
  do {
    let variables: any = { limit: 10000, filter: getORIdList(idList, sids) };
    if (nextToken) variables.nextToken = nextToken;
    const {
      data: { listINExchgFuns },
    } = (await API.graphql(
      graphqlOperation(queries.listINExchgFuns, variables)
    )) as {
      data: APIt.ListINExchgFunsQuery;
    };
    idList = [];
    if (listINExchgFuns?.items?.length)
      returnList.push(...(listINExchgFuns.items as Array<APIt.INExchgFun>));
    nextToken = listINExchgFuns?.nextToken;
  } while (nextToken);
  return returnList.length ? returnList : null;
};

export const isStock = (subType: string, id: string) =>
  subType === APIt.AssetSubType.S && !isFund(id);

export const initializeFundata = async (ids: Array<string>) => {
  const insData = simpleStorage.get(LOCAL_INS_DATA_KEY);
  if (!insData) return null;
  let sids: Set<string> = new Set();
  let initFromDB = false;
  const funData = simpleStorage.get(LOCAL_FUN_DATA_KEY);
  ids.forEach((id: string) => {
    const item = insData[id];
    if (
      !item ||
      !isStock(item?.subt, id) ||
      !item.sid ||
      !item.hasOwnProperty("beta") ||
      !item?.yhigh
    ) {
      return;
    }
    sids.add(item.sid as string);
    if (!initFromDB && (!funData || !funData[item.sid as string])) {
      initFromDB = true;
    }
  });
  if (!initFromDB) return funData;
  console.log(sids);
  let funCache: any = {};
  let funids: Array<APIt.INExchgFun> | null = null;
  if (sids.size) funids = await loadMatchingINExchgFun(Array.from(sids));
  if (funids)
    funids.forEach((fun: APIt.INExchgFun) => {
      funCache[fun.id as string] = fun;
    });
  simpleStorage.set(LOCAL_FUN_DATA_KEY, funCache, LOCAL_DATA_TTL);
  return funCache;
};

export const filterLosersGainers = (
  selectedTags: string[],
  id: string,
  gainers: any[],
  losers: any[]
) => {
  return (
    (losers.length &&
      selectedTags.includes("losers") &&
      losers.some((item: any) => item.id === id)) ||
    (gainers.length &&
      selectedTags.includes("gainers") &&
      gainers.some((item: any) => item.id === id))
  );
};

export const filterVolumeGL = (
  selectedTags: string[],
  id: string,
  movers: any[]
) => {
  return (
    movers.length &&
    selectedTags.includes("movers") &&
    movers.some((item: any) => item.id === id)
  );
};

export const filterYearHighLow = (
  selectedTags: string[],
  id: string,
  yhighlow: any[]
) => {
  return (
    yhighlow.length &&
    selectedTags.includes("yhighlow") &&
    yhighlow.some((item: any) => item.id === id)
  );
};

export const optionTableMap: { [key: string]: { query: any, table: string } } = {
  Stocks: { query: queries.listINExchgPrices, table: 'Exchg' },
  "Gold Bonds":  { query: queries.listINExchgPrices, table: 'Exchg' },
  ETFs:  { query: queries.listINExchgPrices, table: 'Exchg' },
  Bonds: { query: queries.listINBondPrices, table: 'Bonds' },
  "Mutual Funds": { query: queries.listINMFPrices, table: 'Funds' },
  REITs: { query: queries.listINExchgPrices, table: 'Exchg' },
  "Other Investments": { query: queries.listINExchgPrices, table: 'Exchg' },
  Index: { query: queries.listAllIndicess, table: 'Indices' }
} as const;

export const filterTabs = (data: any, childTab: string) => {
  const { STOCK, GOLDB, BOND, REIT, OIT, ETF, MF } = TAB;
  if (childTab === REIT) return data.itype === InsType.REIT;
  if (childTab === OIT) return data.itype === InsType.InvIT;
  if (childTab === ETF) return data.itype === InsType.ETF;
  if (childTab === MF) return isFund(data.id) && !data.itype;
  if (childTab === GOLDB) return data.subt === AssetSubType.GoldB;
  if (childTab === BOND)
    return (
      data.type === APIt.AssetType.F &&
      !isFund(data.id) &&
      data.subt !== AssetSubType.GoldB
    );
  if (childTab === STOCK) return isStock(data.subt as string, data.id);
};
