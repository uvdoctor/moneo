import * as React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

jest.mock("aws-amplify");

import ProfileTab from "../ProfileTab";
import { UserSettingsContext } from "../UserSettingsContext";
import { AppContext } from "../../AppContext";

describe("App", function () {
  const appValue = {
    discountRate: 9,
    setDiscountRate: jest.fn(),
  };
  const nwvalue = {
    isDrManual: true,
    notify: true,
    riskProfile: "M",
    tax: "M",
    setIsDrManual: jest.fn(),
    setNotify: jest.fn(),
    setRiskProfile: jest.fn(),
    setTax: jest.fn(),
    updateProfileTab: jest.fn(),
  };

  test("should have state value", function () {
    render(
      <AppContext.Provider value={appValue}>
        <UserSettingsContext.Provider value={nwvalue}>
          <ProfileTab />
        </UserSettingsContext.Provider>
      </AppContext.Provider>
    );

    const discountRate = document.querySelector(
      "div > div:nth-child(1) > div > div > div.ant-input-number > div.ant-input-number-input-wrap > input"
    );
    expect(discountRate.value).toEqual("9");
    // const offers = document.querySelector(
    //   ".ant-radio-group"
    // );
    // expect(offers.value).toEqual(9);
    // expect(document.querySelector(".ant-radio-button-wrapper-checked").value()).toEqual(
            // "Send"
          // );

          // const risk = document.querySelector("div > div.ant-col.ant-col-24 >div > div:nth-child(3) > div")
          // expect(risk.value).toEqual(9);
          
    // const lastName = screen.getByPlaceholderText("Last Name");
    // expect(lastName.value).toEqual("Choudhari");
    // const dob = screen.getByPlaceholderText("Select date");
    // expect(dob.value).toEqual("01-Apr-2000");
  });
})