import React from "react";
import DeleteAccount from "../DeleteAccount";
import { mount, shallow } from "enzyme";
import { AppContext } from "../../AppContext";

describe("Settings Page", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(
      <AppContext.Provider
        value={{
          setUser: jest.fn(),
          owner: "mehz",
          validateCaptcha: jest.fn(),
        }}
      >
        <DeleteAccount />
      </AppContext.Provider>
    );
  });

  test("should click on delete", () => {
    const input = wrapper.find('input[placeholder="delete"]');
    input.instance().value = 'delete';
    input.simulate('change');
    expect(input.instance().value).toEqual('delete');
    const button = wrapper.find('button');
    expect(button.prop('disabled')).toBeFalsy()
    button.simulate('click');
    // console.log(button.instance());
    // wrapper.update()
    // expect(button.prop('disabled')).toBeTruthy()
  });
});
