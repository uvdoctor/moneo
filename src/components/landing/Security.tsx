import React from "react";

interface SecurityProps {
  securityRef: string;
  scrolledToSec: boolean;
}

export default function Security({
  securityRef,
  scrolledToSec,
}: SecurityProps) {
  return (
    <div ref={securityRef} className="bg-white">
      <div
        className="m-auto"
        style={{
          maxWidth: "1280px",
          paddingRight: "1rem",
          paddingLeft: "1rem",
          backgroundColor: scrolledToSec ? "#fcebcf" : "white",
          transition: 'background-color 1s linear 1s'
        }}
      >
        <div
          className="flex flex-wrap justify-items-auto mt-5 md:flex-no-wrap"
        >
          <div className="w-full flex items-center">
            <div>
              <h2 className="text-3xl">
                We give <span className="text-green-primary">security</span>{" "}
                &amp;{" "}
                <span className="text-green-primary">control on the go!</span>
              </h2>
              <p className="mt-5">
                This is dummy content and will replace in future. Link with
                various accounts to automatically calculate, what you own minus,
                what you owe.
              </p>
            </div>
          </div>
          <div className="w-full flex mt-10 items-center md:mt-0">
            <img src="images/security.jpg" />
          </div>
        </div>
      </div>
    </div>
  );
}
