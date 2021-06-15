import React, { useContext, useRef, useState, useLayoutEffect } from "react";
import { Avatar, Spin, notification } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { getDefaultIconForGoalType, goalImgStorage } from "../goals/goalutils";
import { CalcContext } from "./CalcContext";
import { GoalContext } from "../goals/GoalContext";

export default function GoalImage() {
  const { goalImgUrl, setGoalImgUrl, goalImgKey, setGoalImgKey }: any =
    useContext(GoalContext);
  const { uploadGoalImage, goal }: any = useContext(CalcContext);
  const inputEl = useRef<HTMLInputElement>(null);
  const [loader, setLoader] = useState<Boolean>(false);

  const openBrowse = () => {
    if (inputEl !== null && inputEl.current !== null) inputEl.current.click();
  };

  useLayoutEffect(() => {
    setLoader(false);
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
        if (prevGoalImgKey !== key) {
          await goalImgStorage.removeGoalImg(prevGoalImgKey);
        }
        inputEl.current.value = "";
      }
    } catch (error) {
      notification.error({
        message: `${error.toString()}`,
      });
      setLoader(false);
    }
  };

  return (
    <span className="image-holder" onClick={openBrowse}>
      {loader && (
        <span className="goal-image-loader">
          <Spin />
        </span>
      )}
      <Avatar
        size={50}
        src={goalImgUrl}
        icon={<FontAwesomeIcon icon={getDefaultIconForGoalType(goal.type)} />}
      />
      <span className="image-edit-icon">
        <FontAwesomeIcon icon={faEdit} />
      </span>
      <input type="file" ref={inputEl} onChange={getImage} />
    </span>
  );
}
