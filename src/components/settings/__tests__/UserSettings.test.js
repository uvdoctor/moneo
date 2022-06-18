import React from "react";
import { AppContext } from "../../AppContext";
import UserSettings from "../UserSettings";
import { mount } from "enzyme";

describe("Settings Page", () => {
  describe("before login", () => {
    let wrapper;

    beforeEach(() => {
      wrapper = mount(
        <AppContext.Provider
          value={{
            user: {
              name: "Sinvara",
              attributes: {
                phone_number: "9999999999",
              },
            },
            setDiscountRate: jest.fn(),
          }}
        >
          <UserSettings />
        </AppContext.Provider>
      );
    });

    test("should have title", () => {
      expect(wrapper.find(".ant-page-header-heading-title").text()).toContain(
        "Settings"
      );
    });
  });

  describe("after login", () => {
    let wrapper;

    beforeEach(() => {
      wrapper = mount(
        <AppContext.Provider
          value={{
            user: {
              name: "Sinvara",
              attributes: {
                phone_number: "9999999999",
              },
            },
            setDiscountRate: jest.fn(),
            appContextLoaded: true,
          }}
        >
          <UserSettings />
        </AppContext.Provider>
      );
    });

    test("should show tabs", () => {
      expect(wrapper.find("#rc-tabs-test-tab-1").text()).toContain("Personal");
    });
  });
});
