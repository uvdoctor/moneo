import React from "react";
import Amplify from "aws-amplify";
import SecureDash from "../components/securedash";
import UserHeader from "../components/userheader";
import awsconfig from "../aws-exports";
import { ToastContainer } from "react-toastify";
import {useFullScreen} from "react-browser-hooks"
Amplify.configure(awsconfig);

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
