import React from "react";

export default function SetGoals() {
  return (
    <div className="step-box mt-10 md:w-2/4">
      <div
        className="md:ml-3 lg:ml-5 translate-neg-130"
        style={{ backgroundColor: "#fcebcf" }}
      >
        <div className="grid grid-flow-col font-bold uppercase leading-6">
          <div className="row-span-2 text-6xl opacity-75 text-white leading-10">
            02
          </div>
          <div className="col-span-12 text-2xl" style={{ color: "#e99507" }}>
            Set
          </div>
          <div className="col-span-12 text-xl">Goals</div>
        </div>
        <p className="mt-5">
          Estimate money required across multiple currencies using in-built
          templates and calculators.
        </p>
        <img className="mt-20" src="images/step2.jpg" />
      </div>
    </div>
  );
}
