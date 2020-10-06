import React, { useState } from "react";
//@ts-ignore
import { AwesomeButton } from "react-awesome-button";
import GoalImages from "./GoalImages";
import Amplify, { API } from "aws-amplify";
import * as APIt from "../api/goals";
import * as queries from "../graphql/queries";
import * as mutations from "../graphql/mutations";
import awsconfig from "../aws-exports";
import { GRAPHQL_AUTH_MODE } from "@aws-amplify/api-graphql";

Amplify.configure(awsconfig);

export default function JoinUs() {
  const [email, setEmail] = useState<string>("");

  const doesEntryExist = async () => {
    try {
      const { data }: any = await API.graphql({
        query: queries.listRegistrations,
        variables: { email: email },
        authMode: GRAPHQL_AUTH_MODE.AWS_IAM,
      });
      if (data.listRegistrations.items.length > 0) {
        /*toast.error(
          "This email has already been registered. Please try again with another email address."
        );*/
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
      //toast.success("Almost there...please verify the code emailed to You.");
    } catch (e) {
      console.log("Error while registering: ", e);
    }
  };

  return (
    <div className="w-full max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg">
      <div className="flex justify-center md:justify-start items-center font-bold">
        <h1>Meet Your Goals</h1>
        <GoalImages />
      </div>
      <div className="w-full mt-1 md:mt-2 flex flex-col md:flex-row">
        <input
          className="w-full text-center md:text-left appearance-none bg-transparent outline-none border-b-2 border-silver-100"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          placeholder="Enter email address"
          autoFocus
        />
        <div className="w-full flex justify-center md:justify-start mt-1 md:mt-0 whitespace-no-wrap">
          <AwesomeButton ripple type="primary" onPress={handleEmail}>
            JOIN WAITLIST
          </AwesomeButton>
        </div>
      </div>
    </div>
  );
}
