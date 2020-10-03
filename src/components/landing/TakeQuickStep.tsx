import React from "react";
import Button from "../Button";

export default function TakeQuickStep() {
  return (
    <div
      className="p-5 m-auto mt-10"
      style={{
        maxWidth: "1280px",
      }}
    >
      <div className="flex flex-wrap justify-items-auto md:flex-no-wrap">
        <div className="w-full">
          <h2 className="text-3xl">Take quick step</h2>
          <p className="mt-5">
            Unlock money and make your future safe and secure.
          </p>
          <div className="w-full bg-white border border-gray-500 rounded-md p-1 mt-5 md:text-base lg:w-5/6 lg:text-lg">
            <input
              className="w-3/4 p-2"
              type="text"
              placeholder="Enter email address"
            />
            <Button className="w-1/4" label="Join" />
          </div>
        </div>
        <div className="w-full flex items-center">
          <img src="images/quick-step.jpg" />
        </div>
      </div>
    </div>
  );
}
