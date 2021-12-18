import React from "react";
import BasicPage from "../../components/BasicPage";

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