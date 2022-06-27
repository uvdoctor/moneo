import * as React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

jest.mock("aws-amplify");

import PersonalTab from "../PersonalTab";
import { UserSettingsContext } from "../UserSettingsContext";

describe("App", function () {
  const value = {
    name: "Mehz",
    lastName: "Choudhari",
    setName: jest.fn(),
    setError: jest.fn(),
    setLastName: jest.fn(),
    dobDate: 1,
    setDobDate: jest.fn(),
    dobMonth: 4,
    setDobMonth: jest.fn(),
    dobYear: 2000,
    setDobYear: jest.fn(),
    updatePersonalTab: jest.fn(),
  };

  test("should have state value", function () {
    render(
      <UserSettingsContext.Provider value={value}>
        <PersonalTab />
      </UserSettingsContext.Provider>
    );

    const name = screen.getByPlaceholderText("Name");
    expect(name.value).toEqual("Mehz");
    const lastName = screen.getByPlaceholderText("Last Name");
    expect(lastName.value).toEqual("Choudhari");
    const dob = screen.getByPlaceholderText("Select date");
    expect(dob.value).toEqual("01-Apr-2000");
  });

  test("should have image input", () => {
    render(<PersonalTab />);
    const imageInput = document.querySelector(".image-holder");
    expect(imageInput).not.toBe(null);
  });

  test("should call onclick function on save button click", async () => {
    render(
      <UserSettingsContext.Provider value={value}>
        <PersonalTab />
      </UserSettingsContext.Provider>
    );

    const button = document.querySelector("#save");
    fireEvent.click(button);

    await waitFor(() => {
      expect(value.updatePersonalTab).toHaveBeenCalled();
    });
  });

  test("should change input values on change", async () => {
    render(
      <UserSettingsContext.Provider
        value={{
          setName: jest.fn(),
          setError: jest.fn(),
          setLastName: jest.fn(),
          dobDate: 1,
          setDobDate: jest.fn(),
          dobMonth: 4,
          setDobMonth: jest.fn(),
          dobYear: 2000,
          setDobYear: jest.fn(),
          updatePersonalTab: jest.fn(),
        }}
      >
        <PersonalTab />
      </UserSettingsContext.Provider>
    );

    const name = screen.getByPlaceholderText("Name");
    const lastName = screen.getByPlaceholderText("Last Name");

    fireEvent.change(name, { target: { value: "abc" } });
    fireEvent.change(lastName, { target: { value: "xyz" } });

    await waitFor(() => {
      expect(name.value).toEqual("abc");
      expect(lastName.value).toEqual("xyz");
    });
  });
});
