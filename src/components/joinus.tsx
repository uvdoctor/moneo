import React, { useState } from "react";
//@ts-ignore
import { AwesomeButton } from "react-awesome-button";
import TextInput from "./form/textinput";
import GoalImages from "./goalimages";

export default function JoinUs() {
  const [email, setEmail] = useState<string>("");

  return (
    <div className="w-full flex flex-col items-center md:items-start">
      <div className="flex items-center font-bold mt-4 md:mt-0">
        Meet Your Goals
        <GoalImages />
      </div>
      <div className="mt-2 flex flex-col max-w-sm lg:max-w-md items-center md:items-start">
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
        />
        <div className="mt-2 mb-4 md:mb-0">
          <AwesomeButton ripple type="primary" size="large">
            JOIN WAITLIST
          </AwesomeButton>
        </div>
      </div>
    </div>
  );
}
