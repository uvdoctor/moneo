import * as React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

jest.mock("aws-amplify");

import AccountTab from "../AccountTab";
import { UserSettingsContext } from "../UserSettingsContext";
import { AppContext } from "../../AppContext";

describe("App", function () {
  const value = {
    // error: ,
    setError: jest.fn(),
    // prefuser,
    setPrefuser: jest.fn(),
    // email,
    setEmail: jest.fn(),
    // mobile,
    setMobile: jest.fn(),
    // whatsapp,
    setWhatsapp: jest.fn(),
    updatePrefUsername: jest.fn(),
    updateAccountTab: jest.fn(),
    // countryCodeWithoutPlusSign,
    // countryCode,
    updateImIfSameAsMob: jest.fn(),
  };
  test("should change input value", function () {
    render(
      <UserSettingsContext.Provider value={value}>
        <AccountTab />
      </UserSettingsContext.Provider>
    );

    const loginName = screen.getByPlaceholderText("Login Name");
    fireEvent.change(loginName, { target: { value: "abcd" } });
    expect(loginName.value).toEqual("abcd");

    const email = screen.getByPlaceholderText("abc@xyz.com");
    fireEvent.change(email, { target: { value: "abc@gmail.com" } });
    expect(email.value).toEqual("abc@gmail.com");

    const mobile = screen.getByPlaceholderText("Mobile");
    fireEvent.change(mobile, { target: { value: "123456789" } });
    expect(mobile.value).toEqual("123456789");

    const whatsapp = screen.getByPlaceholderText("Whatsapp");
    fireEvent.change(whatsapp, { target: { value: "123456789" } });
    expect(whatsapp.value).toEqual("123456789");
  });

  test("should call onclick function on save button - Login Name", async () => {
    render(
      <UserSettingsContext.Provider value={value}>
        <AccountTab />
      </UserSettingsContext.Provider>
    );

    const loginName = screen.getByPlaceholderText("Login Name");
    fireEvent.change(loginName, { target: { value: "abcd" } });

    const button = document.querySelector("#login_save");
    fireEvent.click(button);

    await waitFor(() => {
      expect(value.updatePrefUsername).toHaveBeenCalled();
    });
  });

  test("should call onclick function on save button - Whatsapp", async () => {
    render(
      <AppContext.Provider
        value={{
          user: {
            attributes: {
              email: "xyz@gmail.com",
              nickname: "912123456897",
            },
          },
        }}
      >
        <UserSettingsContext.Provider value={value}>
          <AccountTab />
        </UserSettingsContext.Provider>
      </AppContext.Provider>
    );
    const loginName = screen.getByPlaceholderText("Whatsapp");
    fireEvent.change(loginName, { target: { value: "1234567908" } });

    const button = document.querySelector("#whatsapp_number");
    fireEvent.click(button);

    await waitFor(() => {
      expect(value.updateAccountTab).toHaveBeenCalled();
    });
  });

  test("should call be disable if email not change  - Email", async () => {
    const value = {
      setError: jest.fn(),
      setPrefuser: jest.fn(),
      email: "xyz@gmail.com",
      setEmail: jest.fn(),
      setMobile: jest.fn(),
      setWhatsapp: jest.fn(),
      updatePrefUsername: jest.fn(),
      updateAccountTab: jest.fn(),
      updateImIfSameAsMob: jest.fn(),
    };
    render(
      <AppContext.Provider
        value={{
          user: {
            attributes: {
              email: "xyz@gmail.com",
            },
          },
        }}
      >
        <UserSettingsContext.Provider value={value}>
          <AccountTab />
        </UserSettingsContext.Provider>
      </AppContext.Provider>
    );

    const button = document.querySelector("#email");
    expect(button.disabled).toEqual(true);
  });

  test("should call be enable if email changes  - Email", async () => {
    const value = {
      setError: jest.fn(),
      setPrefuser: jest.fn(),
      email: "xyz@gmail.com",
      setEmail: jest.fn(),
      setMobile: jest.fn(),
      setWhatsapp: jest.fn(),
      updatePrefUsername: jest.fn(),
      updateAccountTab: jest.fn(),
      updateImIfSameAsMob: jest.fn(),
    };
    render(
      <AppContext.Provider
        value={{
          user: {
            attributes: {
              email: "xyz@gmail.com",
            },
          },
        }}
      >
        <UserSettingsContext.Provider value={value}>
          <AccountTab />
        </UserSettingsContext.Provider>
      </AppContext.Provider>
    );

    const button = document.querySelector("#email");
    const email = screen.getByPlaceholderText("abc@xyz.com");
    fireEvent.change(email, { target: { value: "abc@gmail.com" } });
    expect(button.disabled).toEqual(false);
  });

  test("should call onclick function on save button - Email", async () => {
    const value = {
      setError: jest.fn(),
      setPrefuser: jest.fn(),
      email: "xyz@gmail.com",
      setEmail: jest.fn(),
      setMobile: jest.fn(),
      setWhatsapp: jest.fn(),
      updatePrefUsername: jest.fn(),
      updateAccountTab: jest.fn(),
      updateImIfSameAsMob: jest.fn(),
    };
    render(
      <AppContext.Provider
        value={{
          user: {
            attributes: {
              email: "xyz@gmail.com",
            },
          },
        }}
      >
        <UserSettingsContext.Provider value={value}>
          <AccountTab />
        </UserSettingsContext.Provider>
      </AppContext.Provider>
    );

    const button = document.querySelector("#email");
    const email = screen.getByPlaceholderText("abc@xyz.com");
    fireEvent.change(email, { target: { value: "abc@gmail.com" } });
    fireEvent.click(button);

    await waitFor(() => {
      // expect(value.updateAccountTab).toHaveBeenCalled();
      expect(button.disabled).toEqual(true);
      expect(button.loading).toEqual(true);
      // expect(screen.getByTitle("Enter Otp")).toBeInTheDocument();
    });
  });

});
