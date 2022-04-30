import { notification } from "antd";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  AssetSubType,
  CreateUserHoldingsInput,
  CreateUserInsInput,
  InstrumentInput,
  InsWatchInput,
  UpdateUserInsInput,
} from "../../api/goals";
import { AppContext } from "../AppContext";
import { ALL_FAMILY } from "../nw/FamilyInput";
import {
  addInsHoldings,
  getCommodityRate,
  getForexRate,
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
import DBView from "./DBView";
const DBContext = createContext({});

function DBContextProvider({ fxRates }: any) {
  const { defaultCurrency, owner, user }: any = useContext(AppContext);
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
  const [aa, setAA] = useState<any>({});

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
      const watch = await initializeWatchlist(
        insHoldings?.watch,
        insHoldings?.ins,
        allHoldings?.crypto
      );
      if (!watchlist.length && watch) {
        setWatchlist([...watch]);
        await saveHoldings(watch, false);
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
    const gold = await getCommodityRate(
      AssetSubType.Gold,
      "24",
      defaultCurrency,
      fxRates
    );
    const usd = await getForexRate(defaultCurrency);
    const silver = await getCommodityRate(
      "SI",
      "100",
      defaultCurrency,
      fxRates
    );
    const headerlist = [
      { label: "Gold", price: gold * 10 },
      { label: "Silver", price: silver * 10 },
      { label: "USD", price: usd },
    ];
    setHeaderlist([...headerlist]);
  };

  const initializeData = async () => {
    await initializeHoldings();
    await initializeHeader();
  };

  const saveHoldings = async (
    watch?: Array<InsWatchInput>,
    notify: boolean = true
  ) => {
    let updatedInsHoldings: CreateUserInsInput = {
      uname: owner,
      ins: instruments,
      watch: watch ? watch : watchlist,
    };
    try {
      if (insholdings) {
        await updateInsHoldings(updatedInsHoldings as UpdateUserInsInput);
      } else {
        await addInsHoldings(updatedInsHoldings);
        setInsholdings(true);
      }
      if (notify) {
        notification.success({
          message: "Data saved",
          description: "All holdings data has been saved.",
        });
      }
    } catch (e) {
      if (notify) {
        notification.error({
          message: "Unable to save holdings",
          description:
            "Sorry! An unexpected error occurred while trying to save the data.",
        });
      }
    }
  };

  useEffect(() => {
    if (!owner || !user) return;
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
        headerlist,
        aa,
        setAA,
      }}
    >
      <DBView />
    </DBContext.Provider>
  );
}

export { DBContext, DBContextProvider };
