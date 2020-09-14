import React, { useState } from "react";
//@ts-ignore
import { AwesomeButton } from "react-awesome-button";
import TextInput from "./form/textinput";
import GoalImages from "./goalimages";
import { isMobileDevice } from "./utils";
import { useFullScreenBrowser } from "react-browser-hooks";
import { HOME_ANCHORS } from "../CONSTANTS";
import Amplify, { API } from "aws-amplify";
import * as APIt from "../api/goals";
import * as queries from "../graphql/queries";
import * as mutations from "../graphql/mutations";
import { toast } from "react-toastify";
import awsconfig from "../aws-exports";
import { GRAPHQL_AUTH_MODE } from "@aws-amplify/api-graphql";

Amplify.configure(awsconfig);

export default function JoinUs() {
  const [email, setEmail] = useState<string>("");
  const fsb = useFullScreenBrowser();

  const doesEntryExist = async () => {
    try {
      const {
        data: { listRegistrations },
      } = (await API.graphql({
        query: queries.listRegistrations,
        variables: { email: email },
        authMode: GRAPHQL_AUTH_MODE.AWS_IAM,
      })) as { data: APIt.ListRegistrationsQuery };
      console.log("Existing list: ", listRegistrations);
      if (listRegistrations?.items && listRegistrations.items.length > 0) {
        toast.error(
          "This email has already been registered. Please try again with another email address."
        );
        return true;
      } else return false;
    } catch (e) {
      console.log("Error while checking for existing registration: ", e);
      return true;
    }
  };

  const handleEmail = async () => {
    if (await doesEntryExist()) return;
    try {
      console.log("Going to register...");
      await API.graphql({
        query: mutations.createRegistration, 
        variables: {
          input: {
            email: email,
            status: APIt.Status.N,
            code: "a123",
          },
        }, 
        authMode: GRAPHQL_AUTH_MODE.AWS_IAM
      });
      toast.success("Almost there...please verify the code emailed to You.");
    } catch (e) {
      console.log("Error while registering: ", e);
    }
  };

  return (
    <div
      id={HOME_ANCHORS.JOIN}
      className={`w-full flex flex-col ${
        isMobileDevice(fsb) ? "items-center" : "items-start"
      }`}
    >
      <div className="flex w-full justify-center md:justify-start items-center font-bold md:mt-2">
        <h1>Meet Your Goals</h1>
        <GoalImages />
      </div>
      <div className="mt-2 flex flex-col max-w-xs md:max-w-sm lg:max-w-md items-center md:items-start">
        <TextInput
          pre=""
          name="email"
          inputOrder={1}
          currentOrder={0}
          nextStepDisabled={false}
          nextStepHandler={() => true}
          allInputDone
          value={email}
          changeHandler={setEmail}
          placeholder="Enter email address"
          type="email"
          autofocus
        />
        <div className="mt-2 mb-4 md:mb-0">
          <AwesomeButton
            ripple
            type="primary"
            size="large"
            onPress={handleEmail}
          >
            JOIN WAITLIST
          </AwesomeButton>
        </div>
      </div>
    </div>
  );
}

//export default withAuthenticator(JoinUs);
