import React, { useState } from "react";
//@ts-ignore
import { AwesomeButton } from "react-awesome-button";
import TextInput from "./form/textinput";
import GoalImages from "./goalimages";
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

  const doesEntryExist = async () => {
    try {
      const result = await API.graphql({
        query: queries.listRegistrations,
        variables: { email: email },
        authMode: GRAPHQL_AUTH_MODE.AWS_IAM,
      });
      console.log("Result is ", result);
      /*if (result?.data && result?.data.items.length > 0) {
        toast.error(
          "This email has already been registered. Please try again with another email address."
        );
        return true;
      } else return false;*/
      return false;
    } catch (e) {
      console.log("Error while checking for existing registration: ", e);
      return true;
    }
  };

  const handleEmail = async () => {
    if (await doesEntryExist()) return;
    try {
      console.log("Going to register...");
      const result = await API.graphql({
        query: mutations.createRegistration,
        variables: {
          input: {
            email: email,
            status: APIt.Status.N,
            code: "a123",
          },
        },
        authMode: GRAPHQL_AUTH_MODE.AWS_IAM,
      });
      console.log("Result is ", result);
      toast.success("Almost there...please verify the code emailed to You.");
    } catch (e) {
      console.log("Error while registering: ", e);
    }
  };

  return (
    <div
      id={HOME_ANCHORS.JOIN}
    >
      <div className="flex flex-col md:flex-row max-w-xs md:max-w-sm lg:max-w-md">
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
        <div className="mt-2 md:mt-0">
          <AwesomeButton
            ripple
            type="primary"
            size="small"
            onPress={handleEmail}
          >
            JOIN
          </AwesomeButton>
        </div>
      </div>
      <div className="mt-4 flex font-bold">
        <h1>Meet Your Goals</h1>
        <GoalImages />
      </div>
    </div>
  );
}

//export default withAuthenticator(JoinUs);
