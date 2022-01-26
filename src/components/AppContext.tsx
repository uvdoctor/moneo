import React, { createContext, useEffect, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import simpleStorage from "simplestorage.js";
import { CreateEODPricesInput, ListEodPricessQuery } from "../api/goals";
import { LOCAL_DATA_TTL, LOCAL_RATES_DATA_KEY, ROUTES } from "../CONSTANTS";
import { listEodPricess } from "../graphql/queries";
import { API, graphqlOperation } from "aws-amplify";
import { useRouter } from "next/router";
import { getUserDetails } from "./userinfoutils";
import { getDiscountRate } from "./utils";

const AppContext = createContext({});
interface AppContextProviderProps {
  children: any;
}

function AppContextProvider({ children }: AppContextProviderProps) {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [user, setUser] = useState<any | null>(null);
  const [defaultCountry, setDefaultCountry] = useState<string>("US");
  const [defaultCurrency, setDefaultCurrency] = useState<string>("USD");
  const [appContextLoaded, setAppContextLoaded] = useState<boolean>(false);
  const [userChecked, setUserChecked] = useState<boolean>(false);
  const [owner, setOwner] = useState<string>("");
  const [userInfo, setUserInfo] = useState<any>();
  const [discountRate, setDiscountRate] = useState<number>();
  const router = useRouter();

  const validateCaptcha = async (action: string) => {
    //@ts-ignore
    const token = await executeRecaptcha(action);
    let result = await fetch("/api/verifycaptcha", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({
        token: token,
      }),
    })
      .then((captchRes: any) => captchRes.json())
      .then((data: any) => data.success)
      .catch((e: any) => {
        console.log("error while validating captcha ", e);
        return false;
      });
    return result;
  };

  useEffect(() => {
    const host = window.location.hostname;
    setDefaultCountry(
      host.endsWith(".in") || host.endsWith("host")
        ? "IN"
        : host.endsWith(".uk")
        ? "UK"
        : "US"
    );
    setDefaultCurrency(
      host.endsWith(".in") || host.endsWith("host")
        ? "INR"
        : host.endsWith(".uk")
        ? "GBP"
        : "USD"
    );
  }, []);

  useEffect(() => {
    if (!user) return;
    if (user.signInUserSession?.accessToken) {
      setOwner(user.signInUserSession.accessToken.payload.username);
      setUserChecked(true);
    }
  }, [user]);

  useEffect(() => {
    if (!owner) return;
    initData();
    userInfo ? setAppContextLoaded(true) : loadUserInfo();
  }, [owner]);

  const initData = async () => {
    if (!user) return;
    let route = router.pathname;
    if (route === ROUTES.GET || route === ROUTES.SET) {
      await initializeFXCommCryptoRates();
    }
  };

  const loadUserInfo = async () => {
    const userDetails = await getUserDetails(owner);
    if (userDetails) {
      setUserInfo(userDetails);
      setDiscountRate(
        !userDetails?.dr
          ? getDiscountRate(userDetails?.rp, defaultCountry)
          : userDetails?.dr
      );
      setAppContextLoaded(true);
    }
  };

  const initializeFXCommCryptoRates = async () => {
    let ratesData = simpleStorage.get(LOCAL_RATES_DATA_KEY);
    if (ratesData) {
      return;
    }
    try {
      let result: Array<CreateEODPricesInput> | null =
        await loadFXCommCryptoRates();
      ratesData = {};
      if (result && result.length) {
        result.forEach(
          (record: CreateEODPricesInput) =>
            (ratesData[record.id] = record.price)
        );
      }
      simpleStorage.set(LOCAL_RATES_DATA_KEY, ratesData, LOCAL_DATA_TTL);
    } catch (err) {
      console.log("Unable to fetch fx, commodities & crypto rates: ", err);
      return false;
    }
  };

  const loadFXCommCryptoRates = async () => {
    const {
      data: { listEODPricess },
    } = (await API.graphql(graphqlOperation(listEodPricess))) as {
      data: ListEodPricessQuery;
    };
    return listEODPricess?.items?.length
      ? (listEODPricess.items as Array<CreateEODPricesInput>)
      : null;
  };

  return (
    <AppContext.Provider
      value={{
        defaultCountry,
        setDefaultCountry,
        defaultCurrency,
        setDefaultCurrency,
        user,
        appContextLoaded,
        validateCaptcha,
        owner,
        userInfo,
        setUserInfo,
        discountRate,
        setDiscountRate,
        setAppContextLoaded,
        setOwner,
        setUser,
        userChecked,
        setUserChecked,
      }}>
      {children}
    </AppContext.Provider>
  );
}

export { AppContext, AppContextProvider };
