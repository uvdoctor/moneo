import React from "react";
import Policies from "../../components/policies/Policies";
import BasicPage from "../../components/BasicPage";

export default function PolicyTC() {
  return (
    <BasicPage
      title="Terms and Conditions"
      hideMenu
      noFooter
      menuTitle="Policies"
    >
      <Policies type="Terms & Conditions" />
    </BasicPage>
  );
}
