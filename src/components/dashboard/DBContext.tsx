import { notification } from "antd";
import React, { createContext, useContext, useEffect, useState } from "react";
import simpleStorage from "simplestorage.js";
import {
  CreateUserHoldingsInput,
  CreateUserInsInput,
  InstrumentInput,
  InsWatchInput,
  UpdateUserInsInput,
} from "../../api/goals";
import { LOCAL_INS_DATA_KEY } from "../../CONSTANTS";
import { AppContext } from "../AppContext";
import { ALL_FAMILY } from "../nw/FamilyInput";
import {
  addInsHoldings,
  getCommodityRate,
  loadAllHoldings,
  loadInsHoldings,
  updateInsHoldings,
} from "../nw/nwutils";
import {
  calculateAlerts,
  calculateTotalAssets,
  calculateTotalLiabilities,
  initializeWatchlist,
} from "../nw/valuationutils";
import { getFXRate } from "../utils";
import DBView from "./DBView";
const DBContext = createContext({});

export const NIFTY50 = "Nifty 50";
export const SENSEX = "BSE30";

function DBContextProvider({ fxRates }: any) {
  const { defaultCurrency, owner }: any = useContext(AppContext);
  const [totalAssets, setTotalAssets] = useState<number>(0);
  const [totalLiabilities, setTotalLiabilities] = useState<number>(0);
  const [gainers, setGainers] = useState<Array<any>>([]);
  const [losers, setLosers] = useState<Array<any>>([]);
  const [yhigh, setYhigh] = useState<Array<any>>([]);
  const [ylow, setYlow] = useState<Array<any>>([]);
  const [volGainers, setVolGainers] = useState<Array<any>>([]);
  const [volLosers, setVolLosers] = useState<Array<any>>([]);
  const [watchlist, setWatchlist] = useState<Array<InsWatchInput>>([]);
  const [instruments, setInstruments] = useState<Array<InstrumentInput>>([]);
  const [insholdings, setInsholdings] = useState<boolean>(false);
  const [holdingsLoaded, setHoldingsLoaded] = useState<boolean>(false);
  const [headerlist, setHeaderlist] = useState<any[]>([]);

  const initializeHoldings = async () => {
    try {
      let allHoldings: CreateUserHoldingsInput | null = await loadAllHoldings(
        owner
      );
      let insHoldings: CreateUserInsInput | null = await loadInsHoldings(owner);
      const { totalAssets } = await calculateTotalAssets(
        allHoldings,
        insHoldings,
        [ALL_FAMILY],
        defaultCurrency,
        fxRates
      );
      if (insHoldings) setInsholdings(true);
      if (insHoldings?.watch) {
        await initializeWatchlist(insHoldings?.watch);
        setWatchlist([...insHoldings?.watch]);
      }
      if (insHoldings?.ins) setInstruments([...insHoldings?.ins]);
      setTotalAssets(totalAssets);
      const data = await calculateAlerts(
        allHoldings,
        insHoldings,
        fxRates,
        defaultCurrency
      );
      setGainers(data.gainers);
      setLosers(data.losers);
      setYhigh(data.yhighList);
      setYlow(data.ylowList);
      setVolGainers(data.volGainers);
      setVolLosers(data.volLosers);
      if (allHoldings) {
        const liabilities = calculateTotalLiabilities(
          allHoldings,
          [ALL_FAMILY],
          defaultCurrency
        );
        setTotalLiabilities(liabilities);
      }
    } catch (err) {
      notification.error({
        message: "Holdings not loaded",
        description: "Sorry! Unable to fetch holdings.",
      });
    }
  };

  const initializeHeader = async () => {
    const gold = await getCommodityRate("Gold", "24", defaultCurrency, fxRates);
    const goldPrev = await getCommodityRate("Gold", "24", defaultCurrency, fxRates, true);
    const silver = await getCommodityRate(
      "SI",
      "100",
      defaultCurrency,
      fxRates
    );
    const silverPrev = await getCommodityRate(
      "SI",
      "100",
      defaultCurrency,
      fxRates,
      true
    );
    const usd = getFXRate(fxRates, defaultCurrency);
    const insData = simpleStorage.get(LOCAL_INS_DATA_KEY);
    const nifty = insData && insData[NIFTY50] ? insData[NIFTY50] : {price:0,prev:0}; 
    const sensex = insData && insData[SENSEX] ? insData[SENSEX] : {price:0,prev:0}; 
    const headerlist = [
      { label: "Gold", prev: goldPrev * 10, price: gold * 10 },
      { label: "Silver", prev: silverPrev * 10, price: silver * 10 },
      { label: "Sensex", prev: sensex?.prev, price: sensex?.price },
      { label: "Nifty 50", prev: nifty?.prev, price: nifty?.price },
      { label: "Petrol", prev: 115, price: 110 },
      { label: "Diesel", prev: 95, price: 90 },
      { label: "USD", prev: usd, price: usd },
    ];
    setHeaderlist([ ...headerlist ]);
  };

  const initializeData = async () => {
    await initializeHoldings();
    await initializeHeader();
  };

  const saveHoldings = async () => {
    let updatedInsHoldings: CreateUserInsInput = {
      uname: owner,
      ins: instruments,
      watch: watchlist,
    };
    try {
      if (insholdings) {
        await updateInsHoldings(updatedInsHoldings as UpdateUserInsInput);
      } else {
        await addInsHoldings(updatedInsHoldings);
        setInsholdings(true);
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
  };

  useEffect(() => {
    if (!owner) return;
    initializeData().then(() => setHoldingsLoaded(true));
  }, [owner]);

  return (
    <DBContext.Provider
      value={{
        fxRates,
        totalLiabilities,
        totalAssets,
        gainers,
        losers,
        yhigh,
        ylow,
        volLosers,
        volGainers,
        watchlist,
        setWatchlist,
        saveHoldings,
        holdingsLoaded,
        headerlist
      }}
    >
      <DBView />
    </DBContext.Provider>
  );
}

export { DBContext, DBContextProvider };
