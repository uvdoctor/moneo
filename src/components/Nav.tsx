import React, { useState } from "react";
import LogoWithName from "./logowithname";
import { calcList } from "./landing/Calculator";

interface NavProps {
  joinRef?: any;
  calculateRef?: any;
  featuresRef?: any;
}

const Nav = ({ joinRef, calculateRef, featuresRef }: NavProps) => {
  const [isOpen, setOpen] = useState(false);

  return (
    <header
      className="md:flex md:justify-between md:items-center fixed w-full z-20 md:py-2"
      style={{
        maxWidth: "1280px",
        paddingRight: "1rem",
        paddingLeft: "1rem",
      }}
    >
      <div className="flex items-center justify-between py-2 md:p-0">
        <LogoWithName />
        <div className="md:hidden">
          <button
            type="button"
            className="p-0 border-none block text-gray-500 hover:text-white focus:text-white focus:outline-none"
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
        className={`site-nav px-2 pt-2 pb-4 h-screen overflow-y-scroll overscroll-contain pb-16 md:h-auto md:flex md:p-0 md:text-base lg:text-lg ${
          isOpen ? "block bg-white shadow-lg" : "hidden"
        }`}
      >
        <div className="site-nav-dropdown">
          <a
            className="cursor-pointer block px-2 py-1 font-semibold rounded"
            onClick={() => {
              calculateRef.current.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Calculate
          </a>
          <div className="w-full pl-8 md:p-5 md:hidden md:absolute md:left-0 md:bg-white md:shadow-lg md:pl-0">
            <div className="grid grid-cols-1 md:grid-cols-2 md:px-5 md:gap-5">
              {calcList.map(({ name, link, svg: Svg, desc }) => (
                <div key={name} className="flex w-4/5">
                  <div className="pr-2 mt-2">
                    <Svg />
                  </div>
                  <div>
                    <a href={link}>
                      <h2 className="text-sm font-semibold">{name}</h2>
                      <p className="text-gray-600 text-sm leading-4">{desc}</p>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="site-nav-dropdown relative">
          <span className="mt-1 cursor-pointer block px-2 py-1 font-semibold rounded md:mt-0 md:ml-2">
            About
          </span>
          <div className="pl-8 text-base md:p-5 md:hidden md:absolute md:bg-white md:shadow-lg md:pl-0">
            <div
              className="cursor-pointer hover:text-green-primary mt-1 block px-2 rounded md:py-1 md:mt-0 md:ml-2"
              onClick={() =>
                featuresRef.current.scrollIntoView({ behavior: "smooth" })
              }
            >
              Features
            </div>
            <div className="cursor-pointer hover:text-green-primary mt-1 block px-2 rounded md:py-1 md:mt-0 md:ml-2">
              Pricing
            </div>
            <div className="cursor-pointer hover:text-green-primary mt-1 block px-2 rounded md:py-1 md:mt-0 md:ml-2">
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
