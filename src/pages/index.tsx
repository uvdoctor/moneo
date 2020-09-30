import React from "react";
import Landing from "./landing/Landing";
import DDPage from "../components/ddpage";

export default function Home() {
  return (
    <DDPage title="DollarDarwin">
      <Landing />
    </DDPage>
  );
}

/*export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      isProduction: process.env.NODE_ENV === "production",
    },
  };
}*/
