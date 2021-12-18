import React from "react";
import BasicPage from "../components/BasicPage";
import Feedback from "../components/feedback/Feedback";
import { FeedbackContextProvider } from "../components/feedback/FeedbackContext";
import Amplify from "aws-amplify";
import awsexports from "../aws-exports";

Amplify.configure({...awsexports, ssr: true});

export default function ContactUs() {
	return (
    <BasicPage title="Contact Us">
      <FeedbackContextProvider>
        <Feedback />
      </FeedbackContextProvider>
    </BasicPage>
  );
}
