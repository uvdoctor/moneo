import * as React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

jest.mock("aws-amplify");

import DeleteAccount from "../DeleteAccount";
import { AppContext } from "../../AppContext";

describe("App", function () {
  test("should change input value", function () {
    render(<DeleteAccount />);

    const deleteInput = screen.getByPlaceholderText("delete");
    fireEvent.change(deleteInput, { target: { value: "delete" } });
    expect(deleteInput.value).toEqual("delete");
  });

  test("should disable delete button on click", async () => {
    render(
      <AppContext.Provider
        value={{ owner: "", setUser: jest.fn(), validateCaptcha: () => {} }}
      >
        <DeleteAccount />
      </AppContext.Provider>
    );

    const button = document.querySelector("#delete");
    const deleteInput = screen.getByPlaceholderText("delete");
    fireEvent.change(deleteInput, { target: { value: "delete" } });
    fireEvent.click(button);
    await waitFor(() => {
      expect(button.disabled).toEqual(true);
    });
  });
});
