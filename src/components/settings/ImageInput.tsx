import React, { useContext, useRef, useState } from "react";
import { Avatar, Button, Modal, notification, Spin, Tooltip } from "antd";
import { goalImgStorage } from "../goals/goalutils";
import { Auth } from "aws-amplify";
import EditOutlined from "@ant-design/icons/lib/icons/EditOutlined";
import { UserOutlined } from "@ant-design/icons";
import { AppContext } from "../AppContext";

interface ImageInputProps {
  user: any;
}

export default function ImageInput({ user }: ImageInputProps) {
  const { validateCaptcha }: any = useContext(AppContext);
  const inputEl = useRef<HTMLInputElement>(null);
  const [loader, setLoader] = useState<Boolean>(false);
  const [isButtonVisible, setIsButtonVisible] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const updateProfile = async (url: any, key: any) => {
    try {
      await Auth.updateUserAttributes(user, { picture: url, profile: key });
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
      setIsButtonVisible(true);
      validateCaptcha("image_change").then(async (success: boolean) => {
        if (!success) return;
        if (inputEl?.current?.files?.length) {
          setLoader(true);
          const file = inputEl.current.files[0];
          goalImgStorage.validateImg(file);
          const result: any = await goalImgStorage.storeGoalImg(file);
          const url = await goalImgStorage.getUrlFromKey(result.key);
          if (user?.attributes.profile !== result.key)
            await goalImgStorage.removeGoalImg(user?.attributes.profile);
          await updateProfile(url, result.key);
          inputEl.current.value = "";
          setLoader(false);
          setIsModalVisible(false);
          setIsButtonVisible(false);
        }
      });
    } catch (error) {
      notification.error({
        message: "Error while uploading goal image",
        description: `${error}`,
      });
      setLoader(false);
      setIsButtonVisible(false);
    }
  };

  const avatar = (size: any) => {
    return (
      <Avatar
        style={{ backgroundColor: "gray" }}
        size={size}
        alt="Profile"
        src={user?.attributes.picture || <UserOutlined />}
        icon={user?.attributes.picture || <UserOutlined />}
      />
    );
  };

  const removeImage = async () => {
    try {
      setIsButtonVisible(true);
      setLoader(true);
      validateCaptcha("image_change").then(async (success: boolean) => {
        if (!success) return;
        if (user?.attributes.profile)
          await goalImgStorage.removeGoalImg(user?.attributes.profile);
        await updateProfile("", "");
        setLoader(false);
        setIsModalVisible(false);
        setIsButtonVisible(false);
      });
    } catch (error) {
      notification.error({
        message: "Error while deleting profile picture",
        description: `${error}`,
      });
      setLoader(false);
      setIsButtonVisible(false);
    }
  };

  return (
    <>
      <span className="image-holder">
        <span
          onClick={
            user?.attributes.picture ? () => setIsModalVisible(true) : openBrowse
          }
        >
          {avatar(170)}
        </span>
        <Tooltip className="edit-icon" title={"Edit Photo"}>
          <Button
            type="link"
            style={{ color: "black" }}
            icon={<EditOutlined />}
            onClick={
              user?.attributes.picture ? () => setIsModalVisible(true) : openBrowse
            }
          />
        </Tooltip>
        <input type="file" ref={inputEl} onChange={getImage} />
      </span>
      <Modal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button
            type="link"
            key="close"
            className="image-upload-modal-button"
            onClick={() => setIsModalVisible(false)}
            disabled={isButtonVisible}
          >
            Cancel
          </Button>,
          user?.attributes.picture && (
            <Button
              type="link"
              key="Cancel"
              className="image-upload-modal-button"
              disabled={isButtonVisible}
              onClick={removeImage}
            >
              Remove
            </Button>
          ),
          <Button
            type="primary"
            key="Upload"
            className="image-upload-modal-button"
            onClick={openBrowse}
            disabled={isButtonVisible}
          >
            Update
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
            {user?.attributes.picture ? (
              <img width="100%" src={user?.attributes.picture} />
            ) : (
              <span onClick={openBrowse}>{avatar(300)}</span>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}
