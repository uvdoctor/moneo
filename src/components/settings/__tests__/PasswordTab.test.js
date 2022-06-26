import * as React from "react";
import {
  render,
  screen,
  cleanup,
  fireEvent,
  waitFor,
} from "@testing-library/react";

jest.mock("aws-amplify");

import PasswordTab from "../PasswordTab";
import { AppContext } from "../../AppContext";

describe("App", function () {
  test("should display pass in number", function () {
    render(<PasswordTab />);

    const oldPassword = screen.getByPlaceholderText("Old Password");

    fireEvent.change(oldPassword, { target: { value: "ABC" } });

    expect(oldPassword.value).toEqual("ABC");
  });

  test("should display error", async function () {
    render(<PasswordTab />);

    const newPassword = screen.getByPlaceholderText("New Password");

    fireEvent.change(newPassword, { target: { value: "ABC" } });

    await waitFor(() => {
      const errorDiv = screen.getByText("Atleast one digit");

      expect(errorDiv.length).not.toBeNull();
    });
  });

  test("should disabled save button", async () => {
    render(<PasswordTab />);

    const button = document.querySelector("#save");

    expect(button.disabled).toEqual(true);
  });

  test("should enable save button", async () => {
    render(<PasswordTab />);

    const button = document.querySelector("#save");
    const oldPassword = screen.getByPlaceholderText("Old Password");
    const newPassword = screen.getByPlaceholderText("New Password");

    fireEvent.change(oldPassword, { target: { value: "Mehz@123" } });
    fireEvent.change(newPassword, { target: { value: "Mehz@123" } });

    await waitFor(() => {
      expect(button.disabled).toEqual(false);
    });
  });

  test("should disabled save button on click", async () => {
    render(
      <AppContext.Provider value={{ user: {}, validateCaptcha: () => {} }}>
        <PasswordTab />
      </AppContext.Provider>
    );

    const button = document.querySelector("#save");

    const oldPassword = screen.getByPlaceholderText("Old Password");
    const newPassword = screen.getByPlaceholderText("New Password");

    fireEvent.change(oldPassword, { target: { value: "Mehz@123" } });
    fireEvent.change(newPassword, { target: { value: "Mehz@123" } });

    fireEvent.click(button);

    await waitFor(() => {
      expect(button.disabled).toEqual(true);
    });
  });
});
