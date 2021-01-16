import React, { createContext, useState } from "react";
import * as mutations from "../../graphql/mutations";
import awsconfig from "../../aws-exports";
import { GRAPHQL_AUTH_MODE } from "@aws-amplify/api-graphql";
import Amplify, { API } from "aws-amplify";
import { FeedbackType } from "../../api/goals";

Amplify.configure(awsconfig);

const FeedbackContext = createContext({});

interface FeedbackContextProviderProps {
  children: any;
}

function FeedbackContextProvider({ children }: FeedbackContextProviderProps) {
  const [feedbackType, setFeedbackType] = useState<FeedbackType>(
    FeedbackType.C
  );
  const [feedback, setFeedback] = useState<String>("");
  const [firstName, setFirstName] = useState<String>("");
  const [lastName, setLastName] = useState<String>("");
  const [email, setEmail] = useState<String>("");
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState({});

  const onFormSubmit = async ({
    feedbackType,
    feedback,
    firstName,
    lastName,
    email,
  }: any) => {
    setLoading(true);
    setFeedbackType(feedbackType);
    setFeedback(feedback);
    setFirstName(firstName);
    setLastName(lastName);
    setEmail(email);
   console.log("feedbackType", feedbackType);
    try {
      await API.graphql({
        query: mutations.createFeedback,
        variables: {
          input: {
            feedbackType,
            feedback,
            firstName,
            lastName,
            email
          },
        },
        authMode: GRAPHQL_AUTH_MODE.AWS_IAM,
      });
    } catch (e) {
      setError({
        title: "Error while creating feedback",
        message: e.errors ? e.errors[0].message : e.toString(),
      });
    }
    setLoading(false);
  };

  return (
    <FeedbackContext.Provider
      value={{
        feedbackType,
        feedback,
        firstName,
        lastName,
        isLoading,
        onFormSubmit,
        email,
        error,
        setFeedbackType,
        setFeedback,
        setFirstName,
        setLastName,
        setEmail
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
}

export { FeedbackContextProvider, FeedbackContext };
