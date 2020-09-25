import React from "react";
import Main from "../components/main";
import DDPage from "../components/ddpage";
import { GetStaticProps } from "next";

interface HomeProps {
  isProduction: boolean
}

export default function Home({isProduction}: HomeProps) {
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
