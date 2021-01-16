import React from "react";
import BasicPage from "../components/BasicPage";
import Feedback from "../components/feedback/Feedback";
import { FeedbackContextProvider } from "../components/feedback/FeedbackContext";

export default function FeedbackPage() {
	return (
    <BasicPage title="Feedback">
      <FeedbackContextProvider>
        <Feedback />
      </FeedbackContextProvider>
    </BasicPage>
  );
}
