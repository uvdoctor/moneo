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

  // test("should have image input", () => {
  //   render(<ProfileTab />);
  //   const imageInput = document.querySelector(".image-holder");
  //   expect(imageInput).not.toBe(null);
  // });

  // test("should call onclick function on save button click", async () => {
  //   render(
  //     <UserSettingsContext.Provider value={value}>
  //       <ProfileTab />
  //     </UserSettingsContext.Provider>
  //   );

  //   const button = document.querySelector("#save");
  //   fireEvent.click(button);

  //   await waitFor(() => {
  //     expect(value.updatePersonalTab).toHaveBeenCalled();
  //   });
  // });

  // test("should change input values on change", async () => {
  //   render(
  //     <UserSettingsContext.Provider
  //       value={{
  //         setName: jest.fn(),
  //         setError: jest.fn(),
  //         setLastName: jest.fn(),
  //         dobDate: 1,
  //         setDobDate: jest.fn(),
  //         dobMonth: 4,
  //         setDobMonth: jest.fn(),
  //         dobYear: 2000,
  //         setDobYear: jest.fn(),
  //         updatePersonalTab: jest.fn(),
  //       }}
  //     >
  //       <ProfileTab />
  //     </UserSettingsContext.Provider>
  //   );

  //   const name = screen.getByPlaceholderText("Name");
  //   const lastName = screen.getByPlaceholderText("Last Name");

  //   fireEvent.change(name, { target: { value: "abc" } });
  //   fireEvent.change(lastName, { target: { value: "xyz" } });

  //   await waitFor(() => {
  //     expect(name.value).toEqual("abc");
  //     expect(lastName.value).toEqual("xyz");
  //   });
  // });
});

//   test("should have 6 input fields", () => {
//     expect(wrapper.find("input").length).toEqual(6);
//   });

//   test("should have input values", () => {
//     // expect(wrapper.find(".ant-input-number-group-addon .ant-select-selector").text()).toEqual('Manual');
//     expect(
//       wrapper
//         .find(".ant-input-number-input-wrap .ant-input-number-input")
//         .get(0).props.value
//     ).toEqual("9");
//     expect(wrapper.find(".ant-radio-button-wrapper-checked").text()).toEqual(
//       "Send"
//     );
//     wrapper.find(".ant-select-selector").forEach((node, index) => {
//       if (index === 0) expect(node.text()).toEqual("Manual");
//       if (index === 1) expect(node.text()).toEqual("Up to 20%");
//       if (index === 2) expect(node.text()).toEqual("Between 7 to 10 lakhs");
//     });
//   });
// });
