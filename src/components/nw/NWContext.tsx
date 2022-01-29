import React, { createContext, useContext, useEffect, useState } from "react";
require("./nw.less");
import NWView from "./NWView";
import {
  addFamilyMember,
  addHoldings,
  addInsHoldings,
  getCascaderOptions,
  getFamilysList,
  getNPSData,
  getNPSFundManagers,
  getRelatedCurrencies,
  loadAllFamilyMembers,
  loadAllHoldings,
  loadInsHoldings,
  loadMatchingINBond,
  loadMatchingINExchange,
  loadMatchingINMutual,
  updateHoldings,
  updateInsHoldings,
} from "./nwutils";
import { notification } from "antd";
import {
  AssetSubType,
  CreateUserHoldingsInput,
  CreateNPSPriceInput,
  HoldingInput,
  INBondPrice,
  INExchgPrice,
  INMFPrice,
  PropertyInput,
  UpdateUserHoldingsInput,
  InstrumentInput,
  CreateUserInsInput,
  UpdateUserInsInput,
  PropertyType,
} from "../../api/goals";
import InstrumentValuation from "./InstrumentValuation";
import { cryptoList, initOptions } from "../utils";
import {
  priceInstruments,
  pricePM,
  priceInsurance,
  priceLoans,
  priceLendings,
  priceLtdep,
  priceP2P,
  priceAngel,
  priceOthers,
  priceCredit,
  priceSavings,
  priceProperties,
  priceNPS,
  pricePF,
  priceVehicles,
  priceCrypto,
} from "./valuationutils";
import simpleStorage from "simplestorage.js";
import { LOCAL_DATA_TTL, LOCAL_INS_DATA_KEY, ROUTES } from "../../CONSTANTS";
import { ALL_FAMILY } from "./FamilyInput";
import { AppContext } from "../AppContext";

const NWContext = createContext({});

export const NATIONAL_SAVINGS_CERTIFICATE = "NSC";
export const SUKANYA_SAMRIDDHI_YOJANA = "SSY";
export const GOLD = "GC";
export const SILVER = "SI";
export const PLATINUM = "PL";
export const PALLADIUM = "PA";

export const TAB = {
  PM: "Precious Metals",
  CRYPTO: "Crypto",
  STOCK: "Stocks",
  MF: "Mutual Funds",
  BOND: "Bonds",
  ETF: "ETFs",
  GOLDB: "Gold Bonds",
  SAV: "Saving Accounts",
  LENT: "Deposits",
  OTHER: "Others",
  NPS: "NPS",
  PF: "Provident Funds",
  VEHICLE: "Vehicles",
  ANGEL: "Start-ups",
  PROP: "Properties",
  LOAN: "Loans",
  INS: "Insurance",
  CREDIT: "Credit",
  REIT: "REITs",
  OIT: "Other Investments",
  P2P: "P2P Lending",
  SUMMARY: "Allocation",
  LTDEP: "Long-term Schemes",
};

export const LIABILITIES_TAB = "Liabilities";
export const ASSETS_VIEW = "assets";
export const LIABILITIES_VIEW = "liabilities";

function NWContextProvider({fxRates}: any) {
  const { defaultCurrency, owner, user, discountRate, userInfo }: any =
    useContext(AppContext);
  const [allFamily, setAllFamily] = useState<any | null>(null);
  const [instruments, setInstruments] = useState<Array<InstrumentInput>>([]);
  const [preciousMetals, setPreciousMetals] = useState<Array<HoldingInput>>([]);
  const [properties, setProperties] = useState<Array<PropertyInput>>([]);
  const [vehicles, setVehicles] = useState<Array<HoldingInput>>([]);
  const [lendings, setLendings] = useState<Array<HoldingInput>>([]);
  const [ltdep, setLtdep] = useState<Array<HoldingInput>>([]);
  const [savings, setSavings] = useState<Array<HoldingInput>>([]);
  const [pf, setPF] = useState<Array<HoldingInput>>([]);
  const [nps, setNPS] = useState<Array<HoldingInput>>([]);
  const [others, setOthers] = useState<Array<HoldingInput>>([]);
  const [crypto, setCrypto] = useState<Array<HoldingInput>>([]);
  const [angel, setAngel] = useState<Array<HoldingInput>>([]);
  const [loans, setLoans] = useState<Array<HoldingInput>>([]);
  const [insurance, setInsurance] = useState<Array<HoldingInput>>([]);
  const [credit, setCredit] = useState<Array<HoldingInput>>([]);
  const [p2p, setP2P] = useState<Array<HoldingInput>>([]);
  const [selectedMembers, setSelectedMembers] = useState<Array<string>>([]);
  const [currencyList, setCurrencyList] = useState<any>({});
  const [selectedCurrency, setSelectedCurrency] = useState<string>("");
  const [nw, setNW] = useState<number>(0);
  const [totalAssets, setTotalAssets] = useState<number>(0);
  const [totalInstruments, setTotalInstruments] = useState<number>(0);
  const [totalPM, setTotalPM] = useState<number>(0);
  const [totalProperties, setTotalProperties] = useState<number>(0);
  const [totalFRE, setTotalFRE] = useState<number>(0);
  const [totalFInv, setTotalFInv] = useState<number>(0);
  const [totalFEquity, setTotalFEquity] = useState<number>(0);
  const [totalNPSEquity, setTotalNPSEquity] = useState<number>(0);
  const [totalFFixed, setTotalFFixed] = useState<number>(0);
  const [totalNPSFixed, setTotalNPSFixed] = useState<number>(0);
  const [totalVehicles, setTotalVehicles] = useState<number>(0);
  const [totalCrypto, setTotalCrypto] = useState<number>(0);
  const [totalSavings, setTotalSavings] = useState<number>(0);
  const [totalPF, setTotalPF] = useState<number>(0);
  const [totalNPS, setTotalNPS] = useState<number>(0);
  const [totalAngel, setTotalAngel] = useState<number>(0);
  const [totalLendings, setTotalLendings] = useState<number>(0);
  const [totalLoans, setTotalLoans] = useState<number>(0);
  const [totalInsurance, setTotalInsurance] = useState<number>(0);
  const [totalCredit, setTotalCredit] = useState<number>(0);
  const [totalLiabilities, setTotalLiabilities] = useState<number>(0);
  const [totalOthers, setTotalOthers] = useState<number>(0);
  const [totalEquity, setTotalEquity] = useState<number>(0);
  const [totalFixed, setTotalFixed] = useState<number>(0);
  const [totalMFs, setTotalMFs] = useState<number>(0);
  const [totalETFs, setTotalETFs] = useState<number>(0);
  const [totalStocks, setTotalStocks] = useState<number>(0);
  const [totalBonds, setTotalBonds] = useState<number>(0);
  const [totalLargeCapStocks, setTotalLargeCapStocks] = useState<number>(0);
  const [totalLargeCapFunds, setTotalLargeCapFunds] = useState<number>(0);
  const [totalMultiCap, setTotalMultiCap] = useState<number>(0);
  const [totalLargeCapETF, setTotalLargeCapETF] = useState<number>(0);
  const [totalFMP, setTotalFMP] = useState<number>(0);
  const [totalIndexFunds, setTotalIndexFunds] = useState<number>(0);
  const [totalIntervalFunds, setTotalIntervalFunds] = useState<number>(0);
  const [totalLiquidFunds, setTotalLiquidFunds] = useState<number>(0);
  const [totalAlternative, setTotalAlternative] = useState<number>(0);
  const [totalPGold, setTotalPGold] = useState<number>(0);
  const [totalFGold, setTotalFGold] = useState<number>(0);
  const [totalCash, setTotalCash] = useState<number>(0);
  const [totalPhysical, setTotalPhysical] = useState<number>(0);
  const [totalFinancial, setTotalFinancial] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>("Financial");
  const [activeTabSum, setActiveTabSum] = useState<number>(0);
  const [results, setResults] = useState<Array<any>>([]);
  const [loadingHoldings, setLoadingHoldings] = useState<boolean>(true);
  const [holdings, setHoldings] = useState<boolean>(false);
  const [insHoldings, setInsholdings] = useState<boolean>(false);
  const [childTab, setChildTab] = useState<string>("");
  const [npsData, setNPSData] = useState<Array<CreateNPSPriceInput>>([]);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [totalOtherProperty, setTotalOtherProperty] = useState<number>(0);
  const [totalResidential, setTotalResidential] = useState<number>(0);
  const [totalCommercial, setTotalCommercial] = useState<number>(0);
  const [totalPlot, setTotalPolt] = useState<number>(0);
  const [totalPPF, setTotalPPF] = useState<number>(0);
  const [totalVPF, setTotalVPF] = useState<number>(0);
  const [totalEPF, setTotalEPF] = useState<number>(0);
  const [totalP2P, setTotalP2P] = useState<number>(0);
  const [familyMemberKeys, setFamilyMemberKeys] = useState<Array<string>>([]);
  const [totalLtdep, setTotalLtdep] = useState<number>(0);
  const [view, setView] = useState<string>(ASSETS_VIEW);
  const [npsSubcategory, setNpsSubcategory] = useState<Object>({});

  const loadNPSSubCategories = async () => {
    // @ts-ignore
    let npsData: Array<CreateNPSPriceInput> | undefined = await getNPSData();
    if (npsData) {
      setNPSData([...npsData]);
      let subCategories: any = getNPSFundManagers();
      Object.keys(subCategories).forEach(
        (key: string) => (subCategories[key] = {})
      );
      for (let item of npsData) {
        const name = item.name.includes("SCHEME -")
          ? item.name.split("SCHEME -")
          : item.name.split("SCHEME ");
        subCategories[item.pfm][item.id] = name[1];
      }
      setNpsSubcategory(subCategories);
      return subCategories;
    }
  };

  const tabs = {
    Cash: {
      label: "Cash",
      total: totalCash,
      children: {
        [TAB.SAV]: {
          label: TAB.SAV,
          data: savings,
          setData: setSavings,
          total: totalSavings,
          fields: {
            name: "Comment",
            amount: "Amount",
          },
        },
        [TAB.LENT]: {
          label: TAB.LENT,
          data: lendings,
          setData: setLendings,
          total: totalLendings,
          rate: selectedCurrency === "INR" ? 5.5 : 1,
          categoryOptions: getCascaderOptions(
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
          fields: {
            type: "Type & Interest",
            name: "Comment",
            amount: "Amount",
            date: "Start Date & Maturity Date",
            rate: "Rate",
          },
        },
        [TAB.LTDEP]: {
          label: TAB.LTDEP,
          data: ltdep,
          setData: setLtdep,
          total: totalLtdep,
          categoryOptions: getCascaderOptions({
            [NATIONAL_SAVINGS_CERTIFICATE]: "National Savings Certificate",
            [SUKANYA_SAMRIDDHI_YOJANA]: "Sukanya Samriddhi Yojana",
          }),
          rate: 6.8,
          fields: {
            type: "Type",
            name: "Comment",
            amount: "Amount",
            date: "Start Date",
            rate: "Rate",
            duration: "Duration",
          },
        },
        [TAB.PF]: {
          label: TAB.PF,
          info: "Example",
          link: ROUTES.PRIVACY,
          data: pf,
          setData: setPF,
          total: totalPF,
          rate: 7.1,
          categoryOptions: getCascaderOptions({
            PF: "Pension Fund",
            EF: "Employee Fund",
            VF: "Voluntary Fund",
          }),
          fields: {
            name: "Comment",
            type: "Type",
            amount: "Amount",
            qty: "Contribution Per Year",
            rate: "Rate",
          },
        },
      },
    },
    Physical: {
      label: "Physical",
      total: totalPhysical,
      children: {
        [TAB.PROP]: {
          label: TAB.PROP,
          data: properties,
          setData: setProperties,
          total: totalProperties,
          categoryOptions: getCascaderOptions({
            [PropertyType.P]: "Plot",
            [PropertyType.A]: "Apartment",
            [PropertyType.H]: "House",
            [PropertyType.C]: "Condominium",
            [PropertyType.COMM]: "Commercial",
            [PropertyType.T]: "Townhouse",
            [PropertyType.OTHER]: "Others",
          }),
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
        },
        [TAB.VEHICLE]: {
          label: TAB.VEHICLE,
          data: vehicles,
          setData: setVehicles,
          total: totalVehicles,
          categoryOptions: getCascaderOptions({
            2: "Two-Wheeler",
            3: "Three-Wheeler",
            4: "Four-Wheeler",
          }),
          fields: {
            type: "Type",
            name: "Comment",
            amount: "Purchase Amount",
            date: "Purchase Date",
          },
        },
        [TAB.PM]: {
          label: TAB.PM,
          data: preciousMetals,
          setData: setPreciousMetals,
          total: totalPM,
          categoryOptions: getCascaderOptions(
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
          fields: {
            type: "Type & Purity",
            qty: "Quantity",
          },
        },
        [TAB.OTHER]: {
          label: TAB.OTHER,
          data: others,
          setData: setOthers,
          total: totalOthers,
          categoryOptions: getCascaderOptions({
            Art: "Art",
            Watch: "Watch",
            Club: "Club Membership",
            Time: "Time Sharing Membership",
            Other: "Other",
          }),
          fields: {
            type: "Type",
            name: "Comment",
            amount: "Amount",
          },
        },
      },
    },
    Financial: {
      label: "Financial",
      total: totalFinancial,
      children: {
        [TAB.STOCK]: {
          label: TAB.STOCK,
          info: "Example",
          link: ROUTES.PRIVACY,
          data: instruments,
          setData: setInstruments,
          total: totalStocks,
          contentComp: <InstrumentValuation />,
        },
        [TAB.MF]: {
          label: TAB.MF,
          info: "Example",
          link: ROUTES.PRIVACY,
          data: instruments,
          setData: setInstruments,
          total: totalMFs,
          contentComp: <InstrumentValuation />,
        },
        [TAB.BOND]: {
          label: TAB.BOND,
          info: "Example",
          link: ROUTES.PRIVACY,
          data: instruments,
          setData: setInstruments,
          total: totalBonds,
          contentComp: <InstrumentValuation />,
        },
        [TAB.GOLDB]: {
          label: TAB.GOLDB,
          info: "Example",
          link: ROUTES.PRIVACY,
          data: instruments,
          setData: setInstruments,
          total: totalFGold,
          contentComp: <InstrumentValuation />,
        },
        [TAB.ETF]: {
          label: TAB.ETF,
          info: "Example",
          link: ROUTES.PRIVACY,
          data: instruments,
          setData: setInstruments,
          total: totalETFs,
          contentComp: <InstrumentValuation />,
        },
        [TAB.REIT]: {
          label: TAB.REIT,
          info: "Real Estate Investment Trust",
          link: ROUTES.PRIVACY,
          data: instruments,
          setData: setInstruments,
          total: totalFRE,
          contentComp: <InstrumentValuation />,
        },
        [TAB.OIT]: {
          label: TAB.OIT,
          info: "Investment Trust",
          link: ROUTES.PRIVACY,
          data: instruments,
          setData: setInstruments,
          total: totalFInv,
          contentComp: <InstrumentValuation />,
        },
        [TAB.CRYPTO]: {
          label: TAB.CRYPTO,
          info: "Example",
          link: ROUTES.PRIVACY,
          data: crypto,
          setData: setCrypto,
          total: totalCrypto,
          categoryOptions: getCascaderOptions(cryptoList),
          fields: {
            type: "Type",
            qty: "Quantity",
          },
        },
        [TAB.ANGEL]: {
          label: TAB.ANGEL,
          info: "Example",
          link: ROUTES.PRIVACY,
          data: angel,
          setData: setAngel,
          total: totalAngel,
          fields: {
            name: "Comment",
            amount: "Amount",
          },
        },
        [TAB.P2P]: {
          label: TAB.P2P,
          data: p2p,
          setData: setP2P,
          total: totalP2P,
          rate: 5,
          categoryOptions: getCascaderOptions({
            "0": "Paid out",
            "4": "Accumulates every 3 months",
            "2": "Accumulates every 6 months",
            "1": "Accumulates every 1 months",
          }),
          fields: {
            name: "Comment",
            amount: "Amount",
            date: "Start Date & Maturity Date",
            rate: "Rate",
            type: "Interest",
          },
        },
        [TAB.NPS]: {
          label: TAB.NPS,
          info: "Example",
          link: ROUTES.PRIVACY,
          data: nps,
          setData: setNPS,
          total: totalNPS,
          categoryOptions: getCascaderOptions(
            getNPSFundManagers(),
            npsSubcategory,
            false
          ),
          fields: {
            type: "Fund Manager & Scheme",
            qty: "Quantity",
          },
        },
      },
    },
    [LIABILITIES_TAB]: {
      label: LIABILITIES_TAB,
      children: {
        [TAB.LOAN]: {
          label: TAB.LOAN,
          data: loans,
          setData: setLoans,
          total: totalLoans,
          rate: 6,
          fields: {
            name: "Comment",
            amount: "Monthly Installment",
            rate: "Rate of Interest",
            date: "End date",
          },
        },
        [TAB.INS]: {
          label: TAB.INS,
          data: insurance,
          total: totalInsurance,
          setData: setInsurance,
          rate: 6,
          categoryOptions: getCascaderOptions(
            {
              L: "Life",
              H: "Health",
              P: "Property",
              V: "Vehicle",
              O: "Others",
            },
            { 1: "Yearly", 12: "Monthly" },
            true
          ),
          fields: {
            type: "Type & Premium Mode",
            name: "Comment",
            amount: "Premium Amount",
            rate: "Premium increases",
            date: "End date",
          },
        },
        [TAB.CREDIT]: {
          label: TAB.CREDIT,
          data: credit,
          total: totalCredit,
          setData: setCredit,
          fields: {
            name: "Comment",
            amount: "Amount",
          },
        },
      },
    },
  };

  const initializeFamilyList = async () => {
    try {
      let allFamilyMembers = await loadAllFamilyMembers();
      if (!allFamilyMembers) return;
      setAllFamily(allFamilyMembers);
      let allFamilyKeys = Object.keys(allFamilyMembers);
      setSelectedMembers([
        ...[allFamilyKeys.length > 1 ? ALL_FAMILY : allFamilyKeys[0]],
      ]);
      setFamilyMemberKeys([...allFamilyKeys]);
    } catch (err) {
      notification.error({
        message: "Family list not loaded",
        description: "Sorry! Unable to fetch details of your family members.",
      });
      return false;
    }
  };

  const addSelfMember = async () => {
    const family = await getFamilysList();
    if (!family || !family.length) {
      let member = await addFamilyMember("Self", "XXXXX1234X", userInfo?.tax);
      if (!member) return;
      setAllFamily({
        [member.id as string]: {
          name: member.name,
          taxId: member.tid,
          tax: member.tax,
        },
      });
      setFamilyMemberKeys([...[member.id as string]]);
      setSelectedMembers([...[member.id as string]]);
    }
  };

  const initializeInsData = async (instruments: Array<InstrumentInput>) => {
    let mfIds: Set<string> = new Set();
    let otherIds: Set<string> = new Set();
    let initFromDB = false;
    const insData = simpleStorage.get(LOCAL_INS_DATA_KEY);
    instruments.forEach((ins: InstrumentInput) => {
      if (ins.id.startsWith("INF")) mfIds.add(ins.id);
      else otherIds.add(ins.id);
      if (!initFromDB && insData && !insData[ins.id]) initFromDB = true;
    });
    if (!initFromDB) return insData;
    let insCache: any = {};
    let mfs: Array<INMFPrice> | null = null;
    if (mfIds.size) mfs = await loadMatchingINMutual(Array.from(mfIds));
    if (mfs)
      mfs.forEach((mf: INMFPrice) => {
        insCache[mf.id as string] = mf;
        mfIds.delete(mf.id as string);
      });
    mfIds.forEach((id: string) => otherIds.add(id));
    let bonds: Array<INBondPrice> | null = null;
    if (otherIds.size) bonds = await loadMatchingINBond(Array.from(otherIds));
    if (bonds)
      bonds.forEach((bond: INBondPrice) => {
        insCache[bond.id as string] = bond;
        otherIds.delete(bond.id as string);
      });
    if (otherIds.size) {
      let exchgEntries: Array<INExchgPrice> | null =
        await loadMatchingINExchange(Array.from(otherIds));
      exchgEntries?.forEach(
        (entry: INExchgPrice) => (insCache[entry.id as string] = entry)
      );
    }
    simpleStorage.set(LOCAL_INS_DATA_KEY, insCache, LOCAL_DATA_TTL);
    return insCache;
  };

  const initializeHoldings = async () => {
    await initializeFamilyList();
    let allHoldings: CreateUserHoldingsInput | null = null;
    let insHoldings: CreateUserInsInput | null = null;
    try {
      allHoldings = await loadAllHoldings(owner);
      insHoldings = await loadInsHoldings(owner);
    } catch (err) {
      notification.error({
        message: "Holdings not loaded",
        description: "Sorry! Unable to fetch holdings.",
      });
    }
    let currencyList = getRelatedCurrencies(allHoldings, defaultCurrency);
    setSelectedCurrency(Object.keys(currencyList)[0]);
    setCurrencyList(currencyList);
    if (allHoldings) setHoldings(true);
    if (insHoldings) setInsholdings(true);
    if (insHoldings?.uname && insHoldings?.ins?.length)
      await initializeInsData(insHoldings?.ins);
    setInstruments([...(insHoldings?.ins ? insHoldings.ins : [])]);
    setPreciousMetals([...(allHoldings?.pm ? allHoldings.pm : [])]);
    setPF([...(allHoldings?.pf ? allHoldings.pf : [])]);
    setNPS([...(allHoldings?.nps ? allHoldings.nps : [])]);
    setCrypto([...(allHoldings?.crypto ? allHoldings.crypto : [])]);
    setVehicles([...(allHoldings?.vehicles ? allHoldings.vehicles : [])]);
    setProperties([...(allHoldings?.property ? allHoldings.property : [])]);
    setLoans([...(allHoldings?.loans ? allHoldings.loans : [])]);
    setInsurance([...(allHoldings?.ins ? allHoldings.ins : [])]);
    setCredit([...(allHoldings?.credit ? allHoldings.credit : [])]);
    setSavings([...(allHoldings?.savings ? allHoldings.savings : [])]);
    setLendings([...(allHoldings?.dep ? allHoldings.dep : [])]);
    setLtdep([...(allHoldings?.ltdep ? allHoldings?.ltdep : [])]);
    setOthers([...(allHoldings?.other ? allHoldings.other : [])]);
    setAngel([...(allHoldings?.angel ? allHoldings.angel : [])]);
    setP2P([...(allHoldings?.p2p ? allHoldings.p2p : [])]);
    setLoadingHoldings(false);
  };

  useEffect(() => {
    if (!user || !owner) return;
    initializeHoldings();
  }, [user, owner]);

  useEffect(() => {
    setNW(totalAssets - totalLiabilities);
  }, [totalAssets, totalLiabilities]);

  useEffect(() => {
    setTotalCash(
      totalSavings + totalLendings + totalLtdep + totalPF + totalLiquidFunds
    );
  }, [totalSavings, totalLendings, totalLtdep, totalPF, totalLiquidFunds]);

  useEffect(() => {
    setTotalPhysical(totalProperties + totalVehicles + totalPM + totalOthers);
  }, [totalProperties, totalVehicles, totalPM, totalOthers]);

  useEffect(() => {
    setTotalFinancial(
      totalInstruments +
        totalAngel +
        totalCrypto +
        totalP2P +
        totalNPS -
        totalLiquidFunds
    );
  }, [
    totalInstruments,
    totalAngel,
    totalCrypto,
    totalP2P,
    totalNPS,
    totalLiquidFunds,
  ]);

  useEffect(() => {
    setTotalLiabilities(totalLoans + totalInsurance + totalCredit);
  }, [totalLoans, totalInsurance, totalCredit]);

  useEffect(() => {
    setTotalAssets(totalCash + totalPhysical + totalFinancial);
  }, [totalCash, totalPhysical, totalFinancial]);

  useEffect(() => {
    setTotalAlternative(
      totalOthers +
        totalVehicles +
        totalProperties +
        totalPM +
        totalCrypto +
        totalFGold +
        totalFRE +
        totalFInv
    );
  }, [
    totalOthers,
    totalVehicles,
    totalProperties,
    totalCrypto,
    totalPM,
    totalFGold,
    totalFRE,
    totalFInv,
  ]);

  const saveHoldings = async () => {
    let updatedInsHoldings: CreateUserInsInput = {
      uname: owner,
      ins: instruments,
    };
    let updatedHoldings: CreateUserHoldingsInput = { uname: owner };
    updatedHoldings.savings = savings;
    updatedHoldings.dep = lendings;
    updatedHoldings.ltdep = ltdep;
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
      if (holdings) {
        await updateHoldings(updatedHoldings as UpdateUserHoldingsInput);
      } else {
        await addHoldings(updatedHoldings);
        setHoldings(true);
      }
      if (instruments.length) {
        if (insHoldings) {
          await updateInsHoldings(updatedInsHoldings as UpdateUserInsInput);
        } else {
          await addInsHoldings(updatedInsHoldings);
          setInsholdings(true);
        }
      }
      notification.success({
        message: "Data saved",
        description: "All holdings data has been saved.",
      });
    } catch (e) {
      notification.error({
        message: "Unable to save holdings",
        description:
          "Sorry! An unexpected error occurred while trying to save the data.",
      });
    }
    setIsDirty(false);
  };

  useEffect(() => {
    setTotalEquity(totalAngel + totalFEquity + totalNPSEquity);
  }, [totalAngel, totalFEquity, totalNPSEquity]);

  useEffect(() => {
    setTotalFixed(totalFFixed + totalNPSFixed + totalP2P);
  }, [totalFFixed, totalNPSFixed, totalP2P]);

  useEffect(() => {
    const { 
      total,
      totalFGold,
      totalFEquity,
      totalFRE,
      totalFFixed,
      totalInv,
      totalStocks,
      totalBonds,
      totalETFs,
      totalMFs,
      largeCapStocks,
      largeCapFunds,
      largeCapETFs,
      multiCap,
      indexFunds,
      fmp,
      intervalFunds,
      liquidFunds } = priceInstruments(instruments, selectedMembers, selectedCurrency);
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
    setTotalLargeCapStocks(largeCapStocks);
    setTotalLargeCapFunds(largeCapFunds);
    setTotalLargeCapETF(largeCapETFs);
    setTotalMultiCap(multiCap);
    setTotalIndexFunds(indexFunds);
    setTotalFMP(fmp);
    setTotalIntervalFunds(intervalFunds);
    setTotalLiquidFunds(liquidFunds);
  }, [instruments, selectedMembers, selectedCurrency]);

  useEffect(() => {
    const getValue = async() => {
      const { total, totalPGold } = await pricePM(preciousMetals, selectedMembers, selectedCurrency, fxRates);
      setTotalPM(total);
      setTotalPGold(totalPGold);
    }
    getValue();
  }, [ preciousMetals, selectedMembers, selectedCurrency ]);

  useEffect(() => {
    const getValue = async() => {
      const total = await priceCrypto(crypto, selectedMembers, selectedCurrency);
      setTotalCrypto(total);
    }
    getValue();
  }, [crypto, preciousMetals, selectedCurrency, selectedMembers]);

  useEffect(() => {
    const total = priceAngel(angel, selectedMembers, selectedCurrency);
    setTotalAngel(total);
  }, [angel, selectedCurrency, selectedMembers]);

  useEffect(() => {
    const total = priceOthers(others, selectedMembers, selectedCurrency);
    setTotalOthers(total);
  }, [others, selectedCurrency, selectedMembers]);

  useEffect(() => {
    const { total, totalPPF, totalVPF, totalEPF } = pricePF(pf, selectedMembers, selectedCurrency);
    setTotalPF(total);
    setTotalEPF(totalEPF);
    setTotalVPF(totalVPF);
    setTotalPPF(totalPPF)
  }, [pf, selectedCurrency, selectedMembers]);

  useEffect(() => {
    const { total, totalNPSEquity, totalNPSFixed } = priceNPS(nps, selectedMembers, selectedCurrency, npsData);
    setTotalNPS(total);
    setTotalNPSEquity(totalNPSEquity);
    setTotalNPSFixed(totalNPSFixed);
  }, [nps, selectedCurrency, selectedMembers]);

  useEffect(() => {
    const total = priceLoans(loans, selectedMembers, selectedCurrency);
    setTotalLoans(total)
  }, [loans, selectedMembers, selectedCurrency]);

  useEffect(() => {
    const total = priceCredit(credit, selectedMembers, selectedCurrency);
    setTotalCredit(total)
  }, [credit, selectedCurrency, selectedMembers]);

  useEffect(() => {
    const total = priceInsurance(insurance, selectedMembers, selectedCurrency, discountRate, userInfo);
    setTotalInsurance(total)
  }, [insurance, discountRate, selectedCurrency, userInfo, selectedMembers]);

  useEffect(() => {
    const { total, totalOtherProperty, totalCommercial, totalResidential, totalPlot } 
      = priceProperties(properties, selectedMembers, selectedCurrency);
    setTotalProperties(total);
    setTotalOtherProperty(totalOtherProperty);
    setTotalCommercial(totalCommercial);
    setTotalResidential(totalResidential);
    setTotalPolt(totalPlot);
  }, [properties, selectedCurrency, selectedMembers]);

  useEffect(() => {
    const total = priceVehicles(vehicles, selectedMembers, selectedCurrency);
    setTotalVehicles(total);
  }, [selectedCurrency, selectedMembers, vehicles]);

  useEffect(() => {
    const total = priceLendings(lendings, selectedMembers, selectedCurrency);
    setTotalLendings(total);
  }, [lendings, selectedCurrency, selectedMembers]);

  useEffect(() => {
    const total = priceLtdep(ltdep, selectedMembers, selectedCurrency);
    setTotalLtdep(total)
  }, [ltdep, selectedCurrency, selectedMembers]);

  useEffect(() => {
    const total = priceP2P(p2p, selectedMembers, selectedCurrency);
    setTotalP2P(total);
  }, [p2p, selectedCurrency, selectedMembers]);

  useEffect(() => {
    const total = priceSavings(savings, selectedMembers, selectedCurrency);
    setTotalSavings(total);
  }, [savings, selectedCurrency, selectedMembers]);

  useEffect(() => {
    setIsDirty(true);
  }, [
    instruments,
    savings,
    lendings,
    ltdep,
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
    vehicles,
    p2p,
  ]);

  return (
    <NWContext.Provider
      value={{
        tabs,
        activeTab,
        setActiveTab,
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
        totalLtdep,
        totalInsurance,
        totalLoans,
        totalOthers,
        instruments,
        setInstruments,
        preciousMetals,
        setPreciousMetals,
        loans,
        ltdep,
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
        p2p,
        setP2P,
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
        totalP2P,
        view,
        setView,
        addSelfMember,
        npsSubcategory,
        totalLargeCapStocks,
        totalLargeCapFunds,
        totalLargeCapETF,
        totalMultiCap,
        totalIndexFunds,
        totalIntervalFunds,
        totalLiquidFunds,
        totalFMP,
        totalBonds,
        totalNPSEquity,
        totalNPSFixed,
        familyMemberKeys,
        setFamilyMemberKeys,
        fxRates
      }}>
      <NWView />
    </NWContext.Provider>
  );
}

export { NWContext, NWContextProvider };
