import React from "react";
import Main from "../components/main";
import DDPage, { EnvProps } from "../components/ddpage";
import { GetStaticProps } from "next";

export default function Home({isProduction}: EnvProps) {
  return (
    <DDPage isProduction={isProduction}>
      <Main />
    </DDPage>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      isProduction: process.env.NODE_ENV === "production",
    },
  };
}
