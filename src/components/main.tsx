import React from "react";
import Features from "./features/features";
import Landing from "./landing";
import { useScroll } from "react-browser-hooks";
import Header from "./header";
import {ToastContainer} from "react-toastify"

export default function Main() {
  const { top } = useScroll();

  return (
    <div className="mx-auto container overflow-x-none overflow-y-auto">
      <ToastContainer />
      {top > 0 && <Header />}
      <Landing />
      <Features />
    </div>
  );
}
