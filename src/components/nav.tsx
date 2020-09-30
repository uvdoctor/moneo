import React, { useState } from "react";
import LogoWithName from "./logowithname";

interface NavProps {
  joinRef?: any;
  calculateRef?: any;
  featuresRef?: any;
}

const Nav = ({ joinRef, calculateRef, featuresRef }: NavProps) => {
  const [isOpen, setOpen] = useState(false);

  return (
    <header
      className="md:flex md:justify-between md:items-center md:px-4 md:py-3 fixed w-full md:pl-0 z-20"
      style={{
        maxWidth: "1280px",
        paddingRight: "1rem",
        paddingLeft: "1rem",
      }}
    >
      <div className="flex items-center justify-between px-4 py-3 md:p-0">
        <LogoWithName />
        <div className="md:hidden">
          <button
            type="button"
            className="block text-gray-500 hover:text-white focus:text-white focus:outline-none"
            onClick={() => setOpen(!isOpen)}
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24">
              {isOpen && (
                <path
                  fillRule="evenodd"
                  d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                />
              )}
              {!isOpen && (
                <path
                  fillRule="evenodd"
                  d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                />
              )}
            </svg>
          </button>
        </div>
      </div>
      <nav
        className={`site-nav px-2 pt-2 pb-4 md:flex md:p-0 md:text-base lg:text-lg ${
          isOpen ? "block bg-white shadow-lg" : "hidden"
        }`}
      >
        <a
          className="cursor-pointer block px-2 py-1 font-semibold rounded"
          onClick={() => {
            calculateRef.current.scrollIntoView({ behavior: "smooth" });
          }}
        >
          Calculate
        </a>
        <div className="site-nav-dropdown relative">
          <span className="mt-1 cursor-pointer block px-2 py-1 font-semibold rounded md:mt-0 md:ml-2">
            About
          </span>
          <div className="pl-8 md:p-5 md:hidden md:absolute md:bg-white md:shadow-lg md:pl-0">
            <div
              className="cursor-pointer hover:text-green-primary mt-1 block px-2 py-1 font-semibold rounded md:mt-0 md:ml-2"
              onClick={() =>
                featuresRef.current.scrollIntoView({ behavior: "smooth" })
              }
            >
              Features
            </div>
            <div className="cursor-pointer hover:text-green-primary mt-1 block px-2 py-1 font-semibold rounded md:mt-0 md:ml-2">
              Pricing
            </div>
            <div className="cursor-pointer hover:text-green-primary mt-1 block px-2 py-1 font-semibold rounded md:mt-0 md:ml-2">
              Company
            </div>
          </div>
        </div>
        <a
          className="cursor-pointer mt-1 block px-2 py-1 font-semibold rounded md:mt-0 md:ml-2"
          onClick={() => joinRef.current.scrollIntoView({ behavior: "smooth" })}
        >
          Earn up to $200 credit*
        </a>
      </nav>
    </header>
  );
};

export default Nav;
