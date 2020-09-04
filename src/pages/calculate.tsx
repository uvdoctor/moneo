import React from "react";
import Calculators from "../components/calc/calculators";
import { ToastContainer } from "react-toastify";
import Header from "../components/header";

export default function Calculate() {
  return (
    <div className="text-lg">
      <ToastContainer />
      <Header />
      <Calculators />
    </div>
  );
}
