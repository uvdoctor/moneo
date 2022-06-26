// import React from "react";
// import { AppContext } from "../../AppContext";
// import UserSettings from "../UserSettingsView";
// import { mount } from "enzyme";
// import { UserSettingsContext } from "../UserSettingsContext";

// describe("Settings Page", () => {
//   describe("before login", () => {
//     let wrapper;
//     beforeEach(() => {
//       wrapper = mount(
//         <AppContext.Provider
//           value={{
//             user: {},
//             setDiscountRate: jest.fn(),
//           }}
//         >
//           <UserSettings />
//         </AppContext.Provider>
//       );
//     });

//     test("should have title", () => {
//       expect(wrapper.find(".ant-page-header-heading-title").text()).toContain(
//         "Settings"
//       );
//     });
//   });

//   describe("after login", () => {
//     let wrapper;

//     const value = {
//       updatePersonalTab: jest.fn(),
//       updateProfileTab: jest.fn(),
//       updatePrefUsername: jest.fn(),
//       updateAccountTab: jest.fn()
//     };

//     beforeEach(() => {
//       wrapper = mount(
//         <AppContext.Provider
//           value={{
//             user: {
//               attributes: {},
//             },
//             setDiscountRate: jest.fn(),
//             appContextLoaded: true,
//             validateCaptcha: jest.fn(),
//           }}
//         >
//           <UserSettingsContext.Provider value={value}>
//             <UserSettings />
//           </UserSettingsContext.Provider>
//         </AppContext.Provider>
//       );
//     });
//     test("should show tabs", () => {
//       expect(wrapper.find("#rc-tabs-test-tab-1").text()).toContain("Personal");
//       expect(wrapper.find("#rc-tabs-test-tab-2").text()).toContain("Profile");
//       expect(wrapper.find("#rc-tabs-test-tab-3").text()).toContain("Account");
//       expect(wrapper.find("#rc-tabs-test-tab-4").text()).toContain("Password");
//       expect(wrapper.find("#rc-tabs-test-tab-5").text()).toContain("Delete");
//     });

//     test("should show personal tab as active", () => {
//       expect(wrapper.find(".ant-tabs-tab-active").text()).toEqual("Personal");
//     });

//     test("should show 3 input fields", () => {
//       expect(wrapper.find("input").length).toEqual(3);
//     });

//     test("should call Save Button Function of Personal Tab", () => {
//       const button = wrapper.find(".ant-btn-primary");
//       button.simulate("click");
//       expect(value.updatePersonalTab).toHaveBeenCalled();
//     });

//     test("should call Save Button Function of Profile Tab", () => {
//       wrapper.find("#rc-tabs-test-tab-2").simulate("click");
//       const button = wrapper.find(".ant-tabs-tabpane-active .ant-btn-primary");
//       button.simulate("click");
//       expect(value.updateProfileTab).toHaveBeenCalled();
//     });

//     test("Account Tab", () => {
//       wrapper.find("#rc-tabs-test-tab-3").simulate("click");
//       wrapper.find(".ant-tabs-tabpane-active .ant-input-group").forEach((node, index) => {
//         if(index === 0) {
//           node.instance().value = "Mehz";
//           node.simulate("change");
//           expect(node.instance().value).toEqual("Mehz");
//           node.find('button').simulate('click');
//           expect(value.updatePrefUsername).toHaveBeenCalled();
//         }
//         if(index === 1) {
//           node.instance().value = "xyz@gmail.com";
//           node.simulate("change");
//           expect(node.instance().value).toEqual("xyz@gmail.com");
//         }
//         if(index === 2) {
//           node.instance().value = "8268552115";
//           node.simulate("change");
//           expect(node.instance().value).toEqual("8268552115");
//         }
//         // if(index === 3) {
//         //   node.instance().value = "8268552115";
//         //   node.simulate("change");
//         //   expect(node.instance().value).toEqual("8268552115");
//         //   node.find('button').simulate('click')
//         //   expect(value.updateAccountTab).toHaveBeenCalled();
//         // }
//       });
//     });
//   });
// });
