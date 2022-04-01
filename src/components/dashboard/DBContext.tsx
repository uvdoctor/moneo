import { notification } from "antd";
import React, { createContext, useContext, useEffect, useState } from "react";
import { CreateUserHoldingsInput, CreateUserInsInput } from "../../api/goals";
import { AppContext } from "../AppContext";
import { ALL_FAMILY } from "../nw/FamilyInput";
import { loadAllHoldings, loadInsHoldings } from "../nw/nwutils";
import {
  calculateAlerts,
  calculateTotalAssets,
  calculateTotalLiabilities,
} from "../nw/valuationutils";
import DBView from "./DBView";
const DBContext = createContext({});

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
      setTotalAssets(totalAssets);
      const data = await calculateAlerts(allHoldings, insHoldings, fxRates, defaultCurrency);
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

  useEffect(() => {
    if (!owner) return;
    const initializeData = async () => {
      await initializeHoldings();
    };
    initializeData();
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
        volGainers
      }}
    >
      <DBView />
    </DBContext.Provider>
  );
}

export { DBContext, DBContextProvider };
