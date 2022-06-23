import { notification } from "antd";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Auth } from "aws-amplify";
import { countrylist } from "../utils";
import { AppContext } from "../AppContext";
import { doesImExist, updateUserDetails } from "../userinfoutils";
import { RiskProfile, TaxLiability } from "../../api/goals";
require("./UserSettings.less");

import UserSettingsView from "./UserSettingsView";
const UserSettingsContext = createContext({});

function UserSettingsContextProvider() {
  const {
    user,
    defaultCountry,
    owner,
    discountRate,
    setUserInfo,
    userInfo,
    validateCaptcha
  }: any = useContext(AppContext);
  const [email, setEmail] = useState<string>("");
  const [mobile, setMobile] = useState<any>("");
  const [error, setError] = useState<Array<string>>([]);
  const [name, setName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [prefuser, setPrefuser] = useState<string>("");
  const [dobMonth, setDobMonth] = useState<number>(4);
  const [dobYear, setDobYear] = useState<number>(2000);
  const [dobDate, setDobDate] = useState<number>(1);
  const [whatsapp, setWhatsapp] = useState<any>(0);
  const [riskProfile, setRiskProfile] = useState<RiskProfile>(RiskProfile.M);
  const [isDrManual, setIsDrManual] = useState<boolean | number>(false);
  const [notify, setNotify] = useState<boolean>(false);
  const [tax, setTax] = useState<TaxLiability>(TaxLiability.M);
  const [loading, setLoading] = useState<boolean>(false);

  const countryCode = countrylist.find(
    (item) => item.countryCode === defaultCountry
  );
  const countryCodeWithoutPlusSign = countryCode
    ? countryCode.value.slice(1)
    : "91";
  const success = (message: any) => notification.success({ message });
  const failure = (message: any) => notification.error({ message });
  const sendOtp = async () =>
    user?.attributes?.phone_number &&
    (await Auth.resendSignUp(user?.attributes?.phone_number));

  const updateAccountTab = async (
    input: string,
    func: Function,
    attr: String,
    updateAttr: any
  ) => {
    try {
      const data =
        attr === "Email" ? input : Number(countryCodeWithoutPlusSign + input);
      if (await func(data)) {
        failure(`${attr} is already used by another account`);
        return false;
      }
      await Auth.updateUserAttributes(user, updateAttr);
      success(
        `${attr} updated successfully. ${
          attr === "Whatsapp Number" ? "" : "Enter Otp to verify"
        }`
      );
      if (attr === "Whatsapp Number") {
        const result = await updateUserDetails({
          uname: owner,
          im: data as number,
        });
        setUserInfo(result);
      }
      return true;
    } catch (error) {
      failure(`Unable to update, ${error}`);
    }
  };

  const updateImIfSameAsMob = async () => {
    if (user?.attributes?.phone_number) {
      setWhatsapp(mobile);
      await updateAccountTab(mobile, doesImExist, "Whatsapp Number", {
        nickname: countryCode?.value + mobile,
      });
    } else {
      failure("Update your mobile, your mobile number is empty.");
    }
  };

  const updatePrefUsername = async () => {
    try {
      const success = await validateCaptcha('pref_username');
      if(!success) return;
      await Auth.updateUserAttributes(user, { preferred_username: prefuser });
      success("Preferred username updated successfully");
    } catch (error: any) {
      failure(`Unable to update ${error.message}`);
    }
  };

  const updatePersonalTab = async () => {
    setLoading(true);
    try {
      const success = await validateCaptcha('personal_settings');
      if(!success) return;
      const getStr = (num: number) => (num < 10 ? `0${num}` : "" + num);
      let input: { [key: string]: string } = {};
      if (user?.attributes.name !== name) input.name = name;
      if (user?.attributes.family_name !== lastName)
        input.family_name = lastName;
      if (Object.keys(input).length) {
        await Auth.updateUserAttributes(user, input);
      }
      const result = await updateUserDetails({
        uname: owner,
        dob: `${dobYear}-${getStr(dobMonth)}-${getStr(dobDate)}`,
      });
      setUserInfo(result);
      success("Updated Successfully");
    } catch (error) {
      failure(`Unable to update ${error}`);
    }
    setLoading(false);
  };

  const updateProfileTab = async () => {
    setLoading(true);
    try {
      const success = await validateCaptcha('profile_settings');
      if(!success) return;
      const results = await updateUserDetails({
        uname: owner,
        dr: isDrManual ? discountRate : 0,
        notify,
        rp: riskProfile,
        tax,
      });
      setUserInfo(results);
      success("Updated Successfully");
    } catch (error) {
      failure("Unable to update");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!user) return;
    const {
      phone_number,
      nickname,
      preferred_username,
      family_name,
      email,
      name,
    } = user?.attributes;
    const mobile = phone_number
      ? phone_number.replace(countryCode?.value, "")
      : "";
    const whatsapp = nickname ? nickname.replace(countryCode?.value, "") : "";
    // console.log(setName);
    setName(name);
    setEmail(email);
    setMobile(mobile);
    setWhatsapp(whatsapp);
    setLastName(family_name);
    setPrefuser(preferred_username);
  }, [countryCode?.value, user]);

  useEffect(() => {
    if (!userInfo) return;
    const { rp, notify, dr, tax, dob } = userInfo;
    const date = new Date(dob);
    setRiskProfile(rp);
    setTax(tax);
    setNotify(notify);
    setIsDrManual(!dr ? 0 : 1);
    setDobDate(Number(date.getDate()));
    setDobMonth(Number(date.getMonth() + 1));
    setDobYear(Number(date.getFullYear()));
  }, [userInfo]);

  return (
    <UserSettingsContext.Provider
      value={{
        email,
        setEmail,
        mobile,
        setMobile,
        error,
        setError,
        name,
        setName,
        lastName,
        setLastName,
        prefuser,
        setPrefuser,
        dobMonth,
        setDobMonth,
        dobYear,
        setDobYear,
        dobDate,
        setDobDate,
        whatsapp,
        setWhatsapp,
        riskProfile,
        setRiskProfile,
        isDrManual,
        setIsDrManual,
        notify,
        setNotify,
        tax,
        setTax,
        loading,
        setLoading,
        updateProfileTab,
        updatePersonalTab,
        updatePrefUsername,
        updateImIfSameAsMob,
        sendOtp,
        countryCode,
        countryCodeWithoutPlusSign,
        updateAccountTab
      }}
    >
      <UserSettingsView />
    </UserSettingsContext.Provider>
  );
}

export { UserSettingsContext, UserSettingsContextProvider };
