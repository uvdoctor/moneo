import { Button, Divider, Input, Modal, notification } from "antd";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import {
  CoachingStatus,
  CoachingType,
  CreateCoachingReqInput,
  CreateCoachingReqMutation,
} from "../api/goals";
import { ROUTES } from "../CONSTANTS";
import * as mutations from "../graphql/mutations";
import { API, graphqlOperation } from "aws-amplify";
import { AppContext } from "./AppContext";
import RadioInput from "./form/RadioInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCheck } from "@fortawesome/free-solid-svg-icons";

export default function CoachingRequest() {
  const router = useRouter();
  const { defaultCurrency }: any = useContext(AppContext);
  const path = router.pathname;
  const [duration, setDuration] = useState<number>(30);
  const [text, setText] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const { TextArea } = Input;

  const createRequest = async () => {
    let newRequest = {
      dur: duration,
      page: path,
      text,
      type:
        path === ROUTES.SET || ROUTES.DASHBOARD
          ? CoachingType.FI
          : CoachingType.Inv,
      status: CoachingStatus.P,
      payment: 0,
      curr: defaultCurrency,
      paid: false,
    };
    try {
      const { data } = (await API.graphql(
        graphqlOperation(mutations.createCoachingReq, { input: newRequest })
      )) as {
        data: CreateCoachingReqMutation;
      };
      setText("");
      setDuration(30);
      notification.success({
        message: "Coaching request created",
        description: "A coach will contact you shortly.",
      });
      return data.createCoachingReq as CreateCoachingReqInput;
    } catch (e) {
      notification.error({
        message: "Unable to create coaching request",
        description:
          "Sorry! An unexpected error occurred while trying to create a coaching request.",
      });
      return null;
    } finally {
      setShowModal(false);
    }
  };

  return (
    <>
      <Button
        size="large"
        className="steps-start-btn"
        icon={<FontAwesomeIcon icon={faUserCheck} />}
        onClick={() => setShowModal(true)}>
        &nbsp;Ask a Coach
      </Button>
      {showModal && (
        <Modal
          centered
          title="Request video call with a Financial Coach"
          onCancel={() => setShowModal(false)}
          onOk={createRequest}
          destroyOnClose
          visible={showModal}>
          <span>
            Coaching duration &nbsp;
            <RadioInput
              from={30}
              to={60}
              increment={30}
              value={duration}
              changeHandler={setDuration}
              unit="minutes"
            />
          </span>
          <Divider />
          <TextArea
            rows={4}
            placeholder="What do you wish to ask?"
            value={text}
            onChange={(e: any) => setText(e.currentTarget.value)}
          />
        </Modal>
      )}
    </>
  );
}
