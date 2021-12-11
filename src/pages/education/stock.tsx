import React from "react";
import Amplify from "aws-amplify";
import awsmobile from "../../aws-exports";
import BasicPage from "../../components/BasicPage";

Amplify.configure(awsmobile);

export default function Stock() {
  return (
    <BasicPage
      title="Stock"
      hideMenu
      noFooter
      menuTitle={"Financial Education"}
    >
        <h1>Finance</h1>
    </BasicPage>
  );
}