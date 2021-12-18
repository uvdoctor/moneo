import React from "react";
import Policies from "../../components/policies/Policies";
import BasicPage from "../../components/BasicPage";

export default function PolicyPrivacy() {
  return (
    <BasicPage
      title="Privacy Policy"
      hideMenu
      noFooter
      menuTitle={"Policies"}
    >
      <Policies type={"Privacy"} />
    </BasicPage>
  );
}
