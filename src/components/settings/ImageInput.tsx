import React, { useContext, useRef, useState } from "react";
import { Avatar, Button, Modal, notification, Spin, Tooltip } from "antd";
import { goalImgStorage } from "../goals/goalutils";
import { Auth } from "aws-amplify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const updateProfile = async (url: any, key: any) => {
    try {
      await Auth.updateUserAttributes(user, { picture: url,  profile: key});
      //await Auth.updateUserAttributes(user, { ["profile"]: key });
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
        }
      });
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
        style={{ backgroundColor: "gray" }}
        size={size}
        alt="Profile"
        src={src || <UserOutlined />}
        icon={<FontAwesomeIcon icon={src} />}
      />
    );
  };

  const removeImage = async () => {
    try {
      setLoader(true);
      validateCaptcha("image_change").then(async (success: boolean) => {
        if (!success) return;
        if (user?.attributes.profile)
          await goalImgStorage.removeGoalImg(user?.attributes.profile);
        await updateProfile("", "");
        setLoader(false);
        setIsModalVisible(false);
      });
    } catch (error) {
      notification.error({
        message: "Error while deleting profile picture",
        description: `${error}`,
      });
      setLoader(false);
    }
  };

  return (
    <>
      <span className="image-holder">
        <span
          onClick={
            user?.attributes.picture
              ? () => setIsModalVisible(true)
              : openBrowse
          }
        >
          {avatar(170, user?.attributes.picture)}
        </span>
        <Tooltip className="edit-icon" title={"Edit Photo"}>
          <Button
            type="link"
            style={{ color: "black" }}
            icon={<EditOutlined />}
            onClick={
              user?.attributes.picture
                ? () => setIsModalVisible(true)
                : openBrowse
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
