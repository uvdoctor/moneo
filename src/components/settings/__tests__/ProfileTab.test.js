import React from "react";
import ProfileTab from "../ProfileTab";
import { mount } from "enzyme";
import { UserSettingsContext } from "../UserSettingsContext";
import { AppContext } from "../../AppContext";

describe("Profile Tab", () => {
  let wrapper = "";
  beforeEach(() => {
    wrapper = mount(
      <AppContext.Provider
        value={{
          discountRate: 9,
          setDiscountRate: jest.fn(),
        }}
      >
        <UserSettingsContext.Provider
          value={{
            isDrManual: true,
            notify: true,
            riskProfile: "M",
            tax: "M",
            setIsDrManual: jest.fn(),
            setNotify: jest.fn(),
            setRiskProfile: jest.fn(),
            setTax: jest.fn(),
          }}
        >
          <ProfileTab />
        </UserSettingsContext.Provider>
      </AppContext.Provider>
    );
  });

  test("should have 6 input fields", () => {
    expect(wrapper.find("input").length).toEqual(6);
  });

  test("should have input values", () => {
    // expect(wrapper.find(".ant-input-number-group-addon .ant-select-selector").text()).toEqual('Manual');
    expect(
      wrapper
        .find(".ant-input-number-input-wrap .ant-input-number-input")
        .get(0).props.value
    ).toEqual("9");
    expect(wrapper.find(".ant-radio-button-wrapper-checked").text()).toEqual(
      "Send"
    );
    wrapper.find(".ant-select-selector").forEach((node, index) => {
      if (index === 0) expect(node.text()).toEqual("Manual");
      if (index === 1) expect(node.text()).toEqual("Up to 20%");
      if (index === 2) expect(node.text()).toEqual("Between 7 to 10 lakhs");
    });
  });
});
