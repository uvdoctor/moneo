import React from "react";

export default function GettingStarted() {
  return (
    <div className="step-box md:w-2/4 translate-neg-40 lg:mt-5">
      <div
        className="mt-10 md:ml-3 md:mt-6 lg:ml-5"
        style={{ backgroundColor: "#dce7ef" }}
      >
        <h2 className="text-2xl">Kick-start Your Financial Independence</h2>
        <button
          className="px-5 border rounded-md text-white p-2 mt-5"
          style={{ backgroundColor: "#499824" }}
        >
          Get Started
        </button>
        <img className="mt-16" src="images/kick-start.jpg" />
      </div>
    </div>
  );
}
