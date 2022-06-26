// import React from "react";
// import PersonalTab from "../PersonalTab";
// import { mount } from "enzyme";
// import { UserSettingsContext } from "../UserSettingsContext";

// describe("Personal Tab", () => {
//   let wrapper;
//   wrapper = mount(
//     <UserSettingsContext.Provider
//       value={{
//         name: "Mehz",
//         lastName: "Choudhari",
//         setName: jest.fn(),
//         setError: jest.fn(),
//         setLastName: jest.fn(),
//         dobDate: 19,
//         setDobDate: jest.fn(),
//         dobMonth: 4,
//         setDobMonth: jest.fn(),
//         dobYear: 2000,
//         setDobYear: jest.fn(),
//       }}
//     >
//       <PersonalTab />
//     </UserSettingsContext.Provider>
//   );

//   test("should have state values", () => {
//     expect(
//       wrapper.find('input[placeholder="Name"]').get(0).props.value
//     ).toEqual("Mehz");
//     expect(
//       wrapper.find('input[placeholder="Last Name"]').get(0).props.value
//     ).toEqual("Choudhari");
//     expect(wrapper.find('input[placeholder="Select date"]').get(0).props.value).toEqual("19-Apr-2000");
//   });

//   test("should have image input", () => {
//     expect(wrapper.find(".image-holder").length).toEqual(1);
//   });
// });
