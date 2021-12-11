import React from "react";
import Amplify from "aws-amplify";
import awsmobile from "../../aws-exports";
import BasicPage from "../../components/BasicPage";

Amplify.configure(awsmobile);

export default function GoldBond() {
  return (
    <BasicPage
      title="Gold Bond"
      hideMenu
      noFooter
      menuTitle={"Financial Education"}
    >
    </BasicPage>
  );
}