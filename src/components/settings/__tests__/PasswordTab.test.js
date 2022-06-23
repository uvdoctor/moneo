import React from "react";
import PasswordTab from "../PasswordTab";
import { mount } from "enzyme";
import { AppContext } from "../../AppContext";

describe("Settings Page", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(
      <AppContext.Provider
        value={{
          user: {},
          validateCaptcha: jest.fn()
        }}
      >
        <PasswordTab />
      </AppContext.Provider>
    );
  });

  test("should have input values", () => {
    const oldPassword = wrapper.find('input[id="oldPassword"]');
    oldPassword.instance().value = 'Mehz';
    oldPassword.simulate('change');
    expect(oldPassword.instance().value).toEqual('Mehz');
    // expect(wrapper.find('.ant-form-item-explain-error')).toHaveLength(1);

    const newPassword = wrapper.find('input[id="newPassword"]');
    newPassword.instance().value = 'Mehz@1234';
    newPassword.simulate('change');
    expect(newPassword.instance().value).toEqual('Mehz@1234');
    // expect(wrapper.find('.ant-form-item-explain-error')).toHaveLength(1);
  
  });

  test("should click on save button", () => {
    button.props().onClick();
    // expect(button.prop("disabled")).toBeTruthy();
    // expect(wrapper.find(".ant-btn-loading")).toHaveLength(1);
  });
});
