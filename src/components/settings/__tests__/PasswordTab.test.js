import * as React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
// import { act } from "react-dom/test-utils";
// import * as ReactDOM from "react-dom";
import PasswordTab from "../PasswordTab";

describe("App", function () {
  test("should display pass in number", function () {
    const { getByPlaceholderText, getByText } = render(
      <PasswordTab />
    );

    // console.log(getByLabelText("oldpass"));
    const oldPassword = getByText("Old Password");
    // console.log(oldPassword.value, oldPassword.firstChild);
    // fireEvent.change(oldPassword, { target: { value: "Mehz" } });
    // console.log(getByPlaceholderText("Old Password"), oldPassword);
    // expect(oldPassword.value).toBe("Mehz");

    //  expect(getByLabelText("first item").checked).toBe(true);
    // console.log(container);
  });

  test("should click on save button", () => {
    const { getByText, getByRole } = render(<PasswordTab />);
    const button = getByText('Save')
    console.log(button);
    // expect(button).toHaveAttribute('loading', 'true')
    expect(button).toBeEnabled();
    fireEvent.click(button)
    expect(button).toBeDisabled();




    //     button.props().onClick();
    //     // expect(button.prop("disabled")).toBeTruthy();
    //     // expect(wrapper.find(".ant-btn-loading")).toHaveLength(1);
    //   });
});
})