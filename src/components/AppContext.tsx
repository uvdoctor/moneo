import React, { createContext, useEffect, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

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
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export { AppContext, AppContextProvider };
