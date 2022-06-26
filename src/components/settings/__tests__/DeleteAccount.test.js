// import React from "react";
// import DeleteAccount from "../DeleteAccount";
// import { mount } from "enzyme";
// import { AppContext } from "../../AppContext";

// describe("Delete Account", () => {
//   let wrapper;
//   beforeEach(() => {
//     wrapper = mount(
//       <AppContext.Provider
//         value={{
//           setUser: jest.fn(),
//           owner: "mehz",
//           validateCaptcha: jest.fn(),
//         }}
//       >
//         <DeleteAccount />
//       </AppContext.Provider>
//     );
//   });

//   test("input fields should change ", () => {
//     const input = wrapper.find('input[placeholder="delete"]');
//     input.instance().value = "delete";
//     input.simulate("change");
//     expect(input.instance().value).toEqual("delete");
//   });

//   test("should click on delete", () => {
//     const wrapper = mount(<DeleteAccount />);
//     const button = wrapper.find("button");
//     expect(button.prop("disabled")).toBeFalsy();
//     button.props().onClick();
//     wrapper.update();
//     expect(wrapper.find(".ant-btn-loading-icon")).toHaveLength(1);
//   });
// });
