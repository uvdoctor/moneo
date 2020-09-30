import React from "react";
import PContainer from "../../components/pcontainer";

export default function GetNetWorth() {
  return (
    <PContainer format="w-full mt-12 md:w-2/4 md:-mt-8" y={[20, 0]}>
      <div className="step-box">
        <div className="md:mr-3 lg:mr-5" style={{ backgroundColor: "#dff1c7" }}>
          <div className="grid grid-flow-col font-bold uppercase leading-6">
            <div className="row-span-2 text-6xl opacity-75 text-white leading-10">
              01
            </div>
            <div className="col-span-12 text-2xl" style={{ color: "#499824" }}>
              Get
            </div>
            <div className="col-span-12 text-xl">Net Worth</div>
          </div>
          <p className="mt-5">
            Link with various accounts to automatically calculate, what you own
            minus, what you owe.
          </p>
          <img className="mt-5" src="images/step1.jpg" />
        </div>
      </div>
    </PContainer>
  );
}
