import React from "react";
import Amplify from "aws-amplify";
import awsmobile from "../../aws-exports";
import Policies from "../../components/policies/Policies";
import BasicPage from "../../components/BasicPage";

Amplify.configure(awsmobile);

export default function PolicyTC() {
  return (
    <BasicPage
      title="Terms and Conditions"
      hideMenu
      noFooter
      menuTitle="Policies"
    >
      <Policies type="terms-and-conditions" />
    </BasicPage>
  );
}
