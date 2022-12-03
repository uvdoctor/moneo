import React from "react";
import { Amplify } from "aws-amplify";
import awsexports from "../aws-exports";
import BasicPage from "../components/BasicPage";
import { UserSettingsContextProvider } from "../components/settings/UserSettingsContext";

Amplify.configure({ ...awsexports, ssr: true });

export default function Settings() {
  return (
    <BasicPage title="Settings" secure>
      <UserSettingsContextProvider />
    </BasicPage>
  );
}
