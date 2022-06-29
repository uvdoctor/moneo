import * as React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";

jest.mock("aws-amplify");

import ImageInput from "../ImageInput";
import { AppContext } from "../../AppContext";

describe("App", function () {
  test("should have image file on change", async () => {
    render(
      <AppContext.Provider
        value={{
          user: {
            attributes: {},
          },
          validateCaptcha: () => {},
        }}
      >
        <ImageInput />
      </AppContext.Provider>
    );

    const fakeFile = new File(["hello"], "hello.png", { type: "image/png" });
    const imageInput = document.querySelector("#image_input");
    await waitFor(() =>
      fireEvent.change(imageInput, {
        target: { files: [fakeFile] },
      })
    );

    let image = document.querySelector("#image_input");
    // check if the file is there
    expect(image.files[0].name).toBe("hello.png");
    expect(image.files.length).toBe(1);
  });

  test("should open modal if file exists on click", async () => {
    render(
      <AppContext.Provider
        value={{
          user: {
            attributes: {
              picture:
                "https://media.istockphoto.com/photos/paperless-workplace-idea-esigning-electronic-signature-document-an-picture-id1349390515?s=612x612",
            },
          },
          validateCaptcha: () => {},
        }}
      >
        <ImageInput />
      </AppContext.Provider>
    );

    const imageInput = document.querySelector("#image_input");
    await waitFor(() => {
      fireEvent.click(imageInput);
    });

    expect(document.querySelector("#modal")).toBeInTheDocument();
  });

  test("should close modal on cancel", async () => {
    render(
      <AppContext.Provider
        value={{
          user: {
            attributes: {
              picture:
                "https://media.istockphoto.com/photos/paperless-workplace-idea-esigning-electronic-signature-document-an-picture-id1349390515?s=612x612",
            },
          },
          validateCaptcha: () => {},
        }}
      >
        <ImageInput />
      </AppContext.Provider>
    );

    const button = screen.getByRole("button", { name: /edit/i });
    // await waitFor(() => {
      fireEvent.click(button);
    // });
  //   await waitFor( () => {
  //   const modal = document.querySelector("#modal");
  //   const cancelButton = document.querySelector("#cancel");
  //   fireEvent.click(cancelButton);
  //   await waitFor(() => {
  //     expect(document.querySelector("#modal")).not.toBeInTheDocument();
  //     // expect(document.querySelector("#cancel")).not.toBeInTheDocument();
  //   });
  // })
    // await waitForElementToBeRemoved(() => {
    //   modal;
    // });
  });

  // test("should remove image", async () => {
  //   const value = {
  //     user: {
  //       attributes: {
  //         picture:
  //           "https://media.istockphoto.com/photos/paperless-workplace-idea-esigning-electronic-signature-document-an-picture-id1349390515?s=612x612",
  //       },
  //     },
  //     validateCaptcha: () => {},
  //   };
  //   render(
  //     <AppContext.Provider value={value}>
  //       <ImageInput />
  //     </AppContext.Provider>
  //   );

  //   const button = screen.getByRole("button", { name: /edit/i });
  //   await waitFor(() => {
  //     fireEvent.click(button);
  //   });
  //   const modal = document.querySelector("#modal");
  //   const cancelButton = document.querySelector("#remove");
  //   await waitFor(() => {
  //     fireEvent.click(cancelButton);
  //   });
    
  //   // await waitFor(() => {
  //     // expect().not.toBeInTheDocument();
  //     // expect(document.querySelector("#cancel")).not.toBeInTheDocument();
  //   // });
  //   // await waitForElementToBeRemoved(() => {
  //     // modal;
  //   // });
  // });
});
