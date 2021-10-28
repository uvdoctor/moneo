import React from "react";
import Amplify from "aws-amplify";
import awsmobile from "../../aws-exports";
import Policies from "../../components/policies/Policies";
import BasicPage from "../../components/BasicPage";

Amplify.configure(awsmobile);

export default function POLICYTC() {
  return (
    <BasicPage
      title="Privacy Policy"
      hideMenu
      noFooter
      hidMenuTitle={"Policies"}
    >
      <Policies stringParams={"terms-and-conditions"} />
    </BasicPage>
  );
}
