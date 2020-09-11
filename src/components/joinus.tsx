import React, { Fragment } from "react";
//@ts-ignore
import { AwesomeButton } from "react-awesome-button";
import GoalImages from "./goalimages";

export default function JoinUs() {
  return (
    <Fragment>
      <div className="w-full flex items-center">
        Meet Your Goals
        <GoalImages />
      </div>
      <form className="w-full flex items-center border-b-2 border-gray-700 focus:border-green-700 py-2 max-w-sm">
        <input
          className="appearance-none bg-transparent border-none w-full mr-3 py-1 px-2 leading-tight focus:outline-none"
          type="email"
          placeholder="abc@xyz.com"
          aria-label="Email address"
        />
        <AwesomeButton ripple type="primary" size="large">
          JOIN WAITLIST
        </AwesomeButton>
      </form>
    </Fragment>
  );
}
