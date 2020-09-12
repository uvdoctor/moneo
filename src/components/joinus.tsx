import React, { useState } from "react";
//@ts-ignore
import { AwesomeButton } from "react-awesome-button";
import TextInput from "./form/textinput";
import GoalImages from "./goalimages";
import { isMobileDevice } from "./utils";
import {useFullScreenBrowser} from "react-browser-hooks"
export default function JoinUs() {
  const [email, setEmail] = useState<string>("");
  const fsb = useFullScreenBrowser()

  return (
    <div id="join" className={`w-full flex flex-col ${isMobileDevice(fsb) ? 'items-center' : 'items-start'}`}>
      <div className="flex items-center font-bold md:mt-4 md:mt-0">
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
          <AwesomeButton ripple type="primary" size="large">
            JOIN WAITLIST
          </AwesomeButton>
        </div>
      </div>
    </div>
  );
}
