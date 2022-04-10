import React, { useContext, useEffect, useState } from "react";
import { HoldingInput, InstrumentInput, PurchaseInput } from "../../api/goals";
import { toHumanFriendlyCurrency, toReadableNumber } from "../utils";
import InsPrice from "./InsPrice";
import { NWContext } from "./NWContext";
import xirr from "xirr";

interface ValuationWithReturnPerProps {
  valuation: number;
  holding: HoldingInput | InstrumentInput;
  purDetailsChanged?: boolean;
}

export default function ValuationWithReturnPer({
  valuation,
  holding,
  purDetailsChanged,
}: ValuationWithReturnPerProps) {
  const { selectedCurrency }: any = useContext(NWContext);
  const [returnPer, setReturnPer] = useState<number>(0);
  const [buyTotal, setBuyTotal] = useState<number>(0);
  const [annualReturnPer, setAnnualReturnPer] = useState<number>(0);

  const calculateAnnualReturn = (cfs: Array<any>) => {
    if (!cfs.length) return 0;
    let result = 0;
    try {
      result = xirr(cfs) * 100;
    } catch (e) {
      console.log("Error while calculating xirr for a holding: ", e);
    } finally {
      return result;
    }
  };

  useEffect(() => {
    if (!valuation || !holding.pur) {
      setReturnPer(0);
      setBuyTotal(0);
      setAnnualReturnPer(0);
      return;
    }
    let buyTotal = 0;
    let returnPer = 0;
    let annualReturnPer = 0;
    if (holding.pur && holding.pur.length) {
      let cfs: Array<any> = [];
      holding.pur.forEach((pur: PurchaseInput) => {
        if (!pur.qty || !pur.amt) return;
        buyTotal += pur.qty * pur.amt;
        cfs.push({
          amount: -(pur.qty * pur.amt),
          when: new Date(pur.year, pur.month, pur.day as number),
        });
      });
      if (cfs.length) {
        cfs.push({
          amount: valuation,
          when: new Date(),
        });
        annualReturnPer = calculateAnnualReturn(cfs);
      }
    }
    if (buyTotal) returnPer = (valuation / buyTotal - 1) * 100;
    setBuyTotal(buyTotal);
    setReturnPer(returnPer);
    setAnnualReturnPer(annualReturnPer);
  }, [valuation, holding.pur, purDetailsChanged]);

  return (
    <InsPrice
      price={valuation}
      currency={selectedCurrency}
      previousPrice={returnPer}
      noPerCalc
      noDecimal
      info={
        returnPer
          ? `Based on the buy transactions that you have input, your investment of ${toHumanFriendlyCurrency(
              buyTotal,
              selectedCurrency
            )} has ${
              returnPer > 0 ? "gained" : "lost"
            } by about ${toReadableNumber(Math.abs(returnPer), 2)}%.${
              annualReturnPer
                ? ` In terms of annual performance, this is about ${toReadableNumber(
                    Math.abs(annualReturnPer),
                    2
                  )}% ${annualReturnPer > 0 ? "gain" : "loss"} per year.`
                : ""
            }`
          : ""
      }
    />
  );
}
