import React, { createContext, useEffect, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { getUserDetails } from "./userinfoutils";
import { getDiscountRate } from "./utils";
import { Storage } from "aws-amplify";

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
  const [userInfo, setUserInfo] = useState<any | null>(null);
  const [discountRate, setDiscountRate] = useState<number>();

  const validateCaptcha = async (action: string) => {
    if (!executeRecaptcha) return false;
    try {
      const token = await executeRecaptcha(action);
      let captchaRes = await fetch("/api/verifycaptcha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({
          token: token,
        }),
      });
      let result = await captchaRes.json();
      return result.success;
    } catch (e) {
      console.log(`Error while validating captcha for ${action}: ${e}`);
      return false;
    }
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
    Storage.configure({ level: "private" });
    console.log("Going to load user info....");
    loadUserInfo().then(() => true);
  }, [owner]);

  useEffect(() => {
    console.log("User info loaded....");
    setDiscountRate(
      !userInfo?.dr
        ? getDiscountRate(userInfo?.rp, defaultCountry)
        : userInfo?.dr
    );
    setAppContextLoaded(true);
  }, [userInfo]);

  const loadUserInfo = async () => setUserInfo(await getUserDetails(owner));

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
