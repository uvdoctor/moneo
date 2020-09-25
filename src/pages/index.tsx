import React from "react";
import Main from "../components/main";
import DDPage from "../components/ddpage";

export default function Home() {
  return (
    <DDPage>
      <Main />
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
