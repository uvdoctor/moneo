import React, {
  useContext,
  useRef,
  useState,
  useLayoutEffect,
  useEffect,
} from "react";
import { Avatar, Spin, notification, Modal, Image, Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getDefaultIconForGoalType, goalImgStorage } from "../goals/goalutils";
import { CalcContext } from "./CalcContext";
import { GoalContext } from "../goals/GoalContext";
import { PlanContext } from "../goals/PlanContext";

export default function GoalImage() {
  const { goalImgUrl, setGoalImgUrl, goalImgKey, setGoalImgKey }: any =
    useContext(GoalContext);
  const { uploadGoalImage, goal }: any = useContext(CalcContext);
  const { allGoals }: any = useContext(PlanContext);
  const inputEl = useRef<HTMLInputElement>(null);
  const [loader, setLoader] = useState<Boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isImageShared, setIsImageShared] = useState<boolean>(false);

  const openBrowse = () => {
    if (inputEl !== null && inputEl.current !== null) inputEl.current.click();
  };

  const imageShared: boolean = allGoals.some((curGoal: any) => {
    return curGoal.id !== goal.id && curGoal.img === goalImgKey;
  });

  useLayoutEffect(() => {
    setLoader(false);
  }, [goalImgUrl]);

  useEffect(() => {
    setIsImageShared(imageShared);
  }, [goalImgUrl]);

  const getImage = async () => {
    try {
      if (
        inputEl !== null &&
        inputEl.current !== null &&
        inputEl.current.files &&
        inputEl.current.files.length
      ) {
        setLoader(true);
        const { key, url } = await uploadGoalImage(
          inputEl.current.files[0],
          goalImgUrl
        );
        const prevGoalImgKey = goalImgKey;
        setGoalImgKey(key);
        setGoalImgUrl(url);
        if (prevGoalImgKey !== key && !isImageShared) {
          await goalImgStorage.removeGoalImg(prevGoalImgKey);
        }
        inputEl.current.value = "";
      }
    } catch (error) {
      notification.error({
        message: "Error while uploading goal image",
        description: `${error}`,
      });
      setLoader(false);
    }
  };

  const removeImage = async () => {
    try {
      setLoader(true);
      if (!isImageShared) await goalImgStorage.removeGoalImg(goalImgKey);
      setGoalImgKey(null);
      setGoalImgUrl(null);
      setLoader(false);
    } catch (error) {
      notification.error({
        message: "Error while deleting goal image",
        description: `${error}`,
      });
      setLoader(false);
    }
  };

  const avatar = (size: any) => {
    return (
      <Avatar
        size={size}
        alt="Goal image"
        src={goalImgUrl}
        icon={<FontAwesomeIcon icon={getDefaultIconForGoalType(goal.type)} />}
      />
    );
  };

  return (
    <>
      <span className="image-holder">
        <span onClick={() => setIsModalVisible(true)}>{avatar(30)}</span>
        <input type="file" ref={inputEl} onChange={getImage} />
      </span>
      <Modal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button
            type="dashed"
            key="Upload"
            className="image-upload-modal-button"
            onClick={openBrowse}
          >
            Upload Photo
          </Button>,
          goalImgUrl && <Button
            type="dashed"
            key="Cancel"
            className="image-upload-modal-button"
            style={{}}
            onClick={removeImage}
          >
            Remove Photo
          </Button>,
          <Button
            type="primary"
            key="close"
            className="image-upload-modal-button"
            onClick={() => setIsModalVisible(false)}
          >
            Close
          </Button>,
        ]}
      >
        <div className="preview-image-holder">
          {loader && (
            <span className="goal-image-loader">
              <Spin size="large" />
            </span>
          )}
          <div className="preview-image">
            {goalImgUrl ? (
              <Image width="100%" src={goalImgUrl} />
            ) : (
              <span onClick={openBrowse}>{avatar(300)}</span>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}
