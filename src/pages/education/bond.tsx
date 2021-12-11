import React from "react";
import Amplify from "aws-amplify";
import awsmobile from "../../aws-exports";
import BasicPage from "../../components/BasicPage";

Amplify.configure(awsmobile);

export default function Bond() {
  return (
    <BasicPage
      title="Bond"
      hideMenu
      noFooter
      menuTitle={"Financial Education"}
    >
    </BasicPage>
  );
}