import React from "react";
import Landing from "../components/landing/Landing";
import DDPage from "../components/DDPage";
import Logo from "../components/Logo";

function callback(key) {
  console.log(key);
}

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
