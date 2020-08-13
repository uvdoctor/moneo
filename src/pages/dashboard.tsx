import React from "react";
import Amplify from "aws-amplify";
import SecureDash from "../components/securedash";
import UserHeader from "../components/userheader";
import awsconfig from "../aws-exports";
import { ToastContainer } from "react-toastify";
//import dynamic from "next/dynamic";
import {useFullScreen} from "react-browser-hooks"
Amplify.configure(awsconfig);

//@ts-ignore
//const {useFullScreen} = dynamic(() => import("react-browser-hooks"), { ssr: false });

export default function Dashboard() {
  const {toggle, fullScreen} = useFullScreen()

  return (
      <div className="text-lg">
        <ToastContainer />
        <UserHeader fullScreen={fullScreen} fullScreenHandler={toggle} />
        <SecureDash />
      </div>
  );
}
