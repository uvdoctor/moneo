import { notification } from "antd";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  CreateNPSPriceInput,
  CreateUserHoldingsInput,
  CreateUserInsInput,
} from "../../api/goals";
import { AppContext } from "../AppContext";
import { ALL_FAMILY } from "../nw/FamilyInput";
import { getNPSData, loadAllHoldings, loadInsHoldings } from "../nw/nwutils";
import {
  calculateTotalAssets,
  calculateTotalLiabilities,
} from "../nw/valuationutils";
import DBView from "./DBView";
const DBContext = createContext({});

function DBContextProvider({ fxRates }: any) {
  const { defaultCurrency, owner }: any =
    useContext(AppContext);
  const [totalAssets, setTotalAssets] = useState<number>(0);
  const [totalLiabilities, setTotalLiabilities] = useState<number>(0);

  const initializeHoldings = async () => {
    try {
      let allHoldings: CreateUserHoldingsInput | null = await loadAllHoldings(
        owner
      );
      let insHoldings: CreateUserInsInput | null = await loadInsHoldings(owner);
      let npsData: Array<CreateNPSPriceInput> | null = await getNPSData();
      const { totalAssets } = await calculateTotalAssets(
        allHoldings,
        insHoldings,
        [ALL_FAMILY],
        defaultCurrency,
        fxRates,
        npsData
      );
      setTotalAssets(totalAssets);
      if (allHoldings) {
        const liabilities = calculateTotalLiabilities(
          allHoldings,
          [ALL_FAMILY],
          defaultCurrency,
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
    if(!owner ) return;
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
      }}
    >
      <DBView />
    </DBContext.Provider>
  );
}

export { DBContext, DBContextProvider };
