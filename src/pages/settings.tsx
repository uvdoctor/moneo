import React from "react";
import Amplify from "aws-amplify";
import awsexports from "../aws-exports";
import BasicPage from "../components/BasicPage";
import UserSettings from "../components/settings/UserSettings";

Amplify.configure({...awsexports, ssr: true});

export default function Settings() {
  return (
    <BasicPage title="Settings" secure>
      <UserSettings />
    </BasicPage>
  );
}
