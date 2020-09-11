import React from "react";
//@ts-ignore
import {AwesomeButton} from "react-awesome-button";

export default function JoinUs() {
  return (
    <form className="md:ml-4 lg:ml-8 w-full flex justify-center items-center border-b border-teal-500 py-2 max-w-sm">
        <input
          className="appearance-none bg-transparent border-none w-full text-default mr-3 py-1 px-2 leading-tight focus:outline-none"
          type="email"
          placeholder="abc@xyz.com"
          aria-label="Email address"
        />
        <AwesomeButton ripple size="medium">JOIN</AwesomeButton>
    </form>
  );
}
