import React, { Fragment, useContext, useEffect } from "react";
import { API, Auth, graphqlOperation, Hub } from "aws-amplify";
import Head from "next/head";
import BasicLayout from "./BasicLayout";
import { AppContext } from "./AppContext";
import simpleStorage from "simplestorage.js";
import { CreateEODPricesInput, ListEodPricessQuery } from "../api/goals";
import { ROUTES } from "../CONSTANTS";
import { listEodPricess } from "../graphql/queries";
import { useRouter } from "next/router";
import { getUserDetails } from "./userinfoutils";
import { getDiscountRate } from "./utils";

interface BasicPageProps {
  className?: string;
  title: string;
  children: React.ReactNode;
  onBack?: Function | undefined | null;
  fixedNav?: boolean;
  navScrollable?: boolean;
  noFooter?: boolean;
  hideMenu?: boolean;
  secure?: boolean;
  menuTitle?: string;
}

export const LOCAL_INS_DATA_KEY = "insData";
export const LOCAL_RATES_DATA_KEY = "ratesData";
export const LOCAL_INSTRUMENT_RAW_DATA_KEY = "instrumentData";
export const LOCAL_DATA_TTL = { TTL: 86400000 }; //1 day

export default function BasicPage(props: BasicPageProps) {
  const {
    setAppContextLoaded,
    setUserInfo,
    setDiscountRate,
    user,
    owner,
    setUser,
    setOwner,
    userInfo,
    defaultCountry,
    setUserChecked,
  }: any = useContext(AppContext);
  const router = useRouter();

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

  useEffect(() => {
    if (!props.secure) {
      setUserChecked(true);
      setAppContextLoaded(true);
      return;
    }
    Hub.listen("auth", initUser);
    initUser();
    return () => Hub.remove("auth", initUser);
  }, []);

  const initData = async () => {
    if (!user) return;
    let route = router.pathname;
    if (route === ROUTES.GET || route === ROUTES.SET) {
      await initializeFXCommCryptoRates();
    }
  };

  const initUser = async () => {
    let user = null;
    try {
      user = await Auth.currentAuthenticatedUser();
      setUser(user);
    } catch (e) {
      console.log("Unable to authenticate user");
      setUser(null);
      setUserChecked(true);
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

  return (
    <Fragment>
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, maximum-scale=2, width=device-width, shrink-to-fit=no, user-scalable=yes, viewport-fit=cover"
        />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta
          name="apple-mobile-web-app-title"
          content="Moneo - Get. Set. Grow."
        />
        <meta name="application-name" content="Moneo" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="description" content="Your family's financial coach" />
        <meta
          name="Personal finance management app"
          content="Automated Banking, Investing and Financial Planning, Moneo, Finance coach, Money Coach,
Personal finance for Millennial, personal finance advisor, personal finance, Digital Banking, Social Banking, money management apps,
personal finance app, Budget goals, Budgeting,  Mutual Funds, Stock, Equity trading, personal money management, online money management, personal
finance plan, personal finance management, Banking App, Mobile Banking, Budgeting, Financial planning, Investing, Neo Banking Canada, Neo Banking USA, Neo Banking India"
        />
        <meta property="og:title" content="Moneo - Get. Set. Grow." />
        <meta
          property="og:description"
          content="
          Hello! 🖐 
          I just got up to $200 credit for Stress-free Financial Independence and Achieving My Goals! 😄
          Did You? 😎"
        />
        <meta
          property="og:image"
          itemProp="image"
          content="https://moneo.in/images/icons/tlogo256.png"
        />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en-IN" />
        <meta property="og:locale:alternate" content="en-US" />
        <meta property="og:url" content="https://moneo.in" />
        <meta name="twitter:card" content="Your family's financial coach" />
        <meta name="twitter:url" content="https://moneo.in" />
        <meta name="twitter:title" content="Moneo" />
        <meta
          name="twitter:description"
          content="Your Money Coach for Stress-free Financial Independence & Achieving Goals."
        />
        <meta
          name="twitter:image"
          content="https://moneo.in/images/icons/tlogo192.png"
        />
        <meta name="twitter:creator" content="@moneocoach" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="format-detection" content="telephone=no" />
        <title>{props.title}</title>
      </Head>
      <BasicLayout
        className={props.className}
        onBack={props.onBack}
        fixedNav={props.fixedNav}
        navScrollable={props.navScrollable}
        noFooter={props.noFooter}
        hideMenu={props.hideMenu}
        title={props.menuTitle}
        secure={props.secure}>
        {props.children}
      </BasicLayout>
    </Fragment>
  );
}
