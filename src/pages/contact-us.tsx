import React from "react";
import BasicPage from "../components/BasicPage";
import Feedback from "../components/feedback/Feedback";
import { FeedbackContextProvider } from "../components/feedback/FeedbackContext";

export default function ContactUs() {
	return (
    <BasicPage title="Contact Us">
      <FeedbackContextProvider>
        <Feedback />
      </FeedbackContextProvider>
    </BasicPage>
  );
}
