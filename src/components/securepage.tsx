import React from "react";
import { ToastContainer } from "react-toastify";
import UserHeader from "./userheader";
import UserMenu from "./usermenu";

interface SecurePageProps {
  children: React.ReactNode;
}

export default function SecurePage({ children }: SecurePageProps) {
  return (
    <div className="text-lg">
      <ToastContainer />
      <UserHeader />
      <UserMenu />
      {children}
    </div>
  );
}
