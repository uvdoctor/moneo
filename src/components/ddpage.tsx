import React, { Fragment } from "react";
import { ParallaxProvider } from "react-scroll-parallax";
import { ToastContainer } from "react-toastify";
import UserHeader from "./userheader";
import UserMenu from "./usermenu";
import { isMobileDevice } from "./utils";
import { useFullScreenBrowser } from "react-browser-hooks";

interface DDPageProps {
  children: React.ReactNode;
  secure?: boolean;
}

export default function DDPage(props: DDPageProps) {
  const commonSecureComps: Array<React.ReactNode> = [
    <UserHeader />,
    <UserMenu />,
  ];
  const commonPublicComps: Array<React.ReactNode> = [];

  const getCommonComps = () =>
    props.secure ? commonSecureComps : commonPublicComps;

  const fsb = useFullScreenBrowser();

  return (
    <div className="text-lg">
      <ToastContainer />
      {!isMobileDevice(fsb) ? (
        <ParallaxProvider>
          {getCommonComps().map((child) => child)}
          {props.children}
        </ParallaxProvider>
      ) : (
        <Fragment>
          {getCommonComps().map((child) => child)}
          {props.children}
        </Fragment>
      )}
    </div>
  );
}
