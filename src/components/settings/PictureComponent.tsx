import React, { useRef, useState } from "react";
import { Avatar, Button, Modal, notification, Spin } from "antd";
import { goalImgStorage } from "../goals/goalutils";
import { Auth } from "aws-amplify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { COLORS } from "../../CONSTANTS";
interface PictureComponentProps {
  user: any;
}

export default function PictureComponent({ user }: PictureComponentProps) {
  const inputEl = useRef<HTMLInputElement>(null);
  const imgKey = useRef<any>("");
  const [loader, setLoader] = useState<Boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const updateProfile = async (url: any, key: any) => {
    try {
      await Auth.updateUserAttributes(user, { ["picture"]: url });
      await Auth.updateUserAttributes(user, { ["profile"]: key });
      notification.success({ message: `Profile updated successfully` });
    } catch (error) {
      notification.error({ message: `Unable to update, ${error}` });
    }
  };

  const openBrowse = () => {
    if (inputEl?.current !== null) inputEl.current.click();
  };

  const getImage = async () => {
    try {
      if (inputEl?.current?.files?.length) {
        setLoader(true);
        const file = inputEl.current.files[0];
        goalImgStorage.validateImg(file);
        const result: any = await goalImgStorage.storeGoalImg(file);
        const url = await goalImgStorage.getUrlFromKey(result.key);
        imgKey.current = result.key;
        console.log(imgKey.current);
        if (user?.attributes.profile !== imgKey.current)
          await goalImgStorage.removeGoalImg(user?.attributes.profile);
        await updateProfile(url, imgKey.current);
        inputEl.current.value = "";
        setLoader(false);
        setIsModalVisible(false);
      }
    } catch (error) {
      notification.error({
        message: "Error while uploading goal image",
        description: `${error}`,
      });
      setLoader(false);
    }
  };

  const avatar = (size: any, src: any) => {
    return (
      <Avatar
        style={{ color: COLORS.GREEN }}
        size={size}
        alt="Profile"
        src={src}
        icon={<FontAwesomeIcon icon={src} />}
      />
    );
  };

  const removeImage = async () => {
    try {
      setLoader(true);
      if (user?.attributes.profile)
        await goalImgStorage.removeGoalImg(user?.attributes.profile);
      await updateProfile("", "");
      imgKey.current = null;
      setLoader(false);
    } catch (error) {
      notification.error({
        message: "Error while deleting goal image",
        description: `${error}`,
      });
      setLoader(false);
    }
  };

  return (
    <>
      <span className="image-holder">
        <span onClick={() => setIsModalVisible(true)}>
          {avatar(30, user?.attributes.picture)}
        </span>
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
          user?.attributes.picture && (
            <Button
              type="dashed"
              key="Cancel"
              className="image-upload-modal-button"
              onClick={removeImage}
            >
              Remove Photo
            </Button>
          ),
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
            {user ? (
              <img width="100%" src={user?.attributes.picture} />
            ) : (
              <span onClick={openBrowse}>
                {avatar(300, user?.attributes.picture)}
              </span>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}
