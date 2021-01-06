import React from "react";
import Landing from "../components/landing/Landing";
import BasicPage from "../components/BasicPage";

export default function Home() {
  return (
    <BasicPage title="Moneo">
      <Landing />
    </BasicPage>
  );
}
