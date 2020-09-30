import React from "react";
import PContainer from "../../components/pcontainer";

export default function MakeMoneyWork() {
  return (
    <PContainer format="w-full md:w-2/4" y={[20, -10]}>
      <div className="step-box">
        <div
          className="mt-10 md:mr-3 md:mt-0 lg:mr-5 lg:mt-5"
          style={{ backgroundColor: "#ffded8" }}
        >
          <div className="grid grid-flow-col font-bold uppercase leading-6">
            <div className="row-span-2 text-6xl opacity-75 text-white leading-10">
              03
            </div>
            <div className="col-span-12 text-2xl" style={{ color: "#d5492e" }}>
              Go
            </div>
            <div className="col-span-12 text-xl">Make Money work</div>
          </div>
          <p className="mt-5">
            Helps you to not only align savings &amp; investements to goals, but
            also become more financially savvy via engaging games.
          </p>
          <img className="w-full mt-5" src="images/laptopwithpig.png" />
        </div>
      </div>
    </PContainer>
  );
}
