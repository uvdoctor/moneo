import * as React from "react";
import { render, screen } from "@testing-library/react";
import UserSettingsView from "../UserSettingsView";
import { AppContext } from "../../AppContext";

describe("Settings Page - Before login", () => {
  test("should have title", () => {
    render(
      <AppContext.Provider
        value={{
          setDiscountRate: jest.fn(),
          appContextLoaded: true,
          validateCaptcha: jest.fn(),
        }}
      >
        <UserSettingsView />
      </AppContext.Provider>
    );
    const title = document.querySelector(
      ".ant-page-header-heading-title"
    ).textContent;
    expect(title).toEqual("Settings");
  });
});

describe("Settings Page - After login", () => {
  test("should show tabs", () => {
    render(
      <AppContext.Provider
        value={{
          user: {
            attributes: {},
          },
          setDiscountRate: jest.fn(),
          appContextLoaded: true,
          validateCaptcha: jest.fn(),
        }}
      >
        <UserSettingsView />
      </AppContext.Provider>
    );

    expect(screen.getByText("Personal")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Account")).toBeInTheDocument();
    expect(screen.getByText("Password")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  test("should show personal tab as active", () => {
    render(
      <AppContext.Provider
        value={{
          user: {
            attributes: {},
          },
          setDiscountRate: jest.fn(),
          appContextLoaded: true,
          validateCaptcha: jest.fn(),
        }}
      >
        <UserSettingsView />
      </AppContext.Provider>
    );
    expect(screen.getByText("Personal")).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });
});
