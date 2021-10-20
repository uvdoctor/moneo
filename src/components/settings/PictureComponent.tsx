import React, { useLayoutEffect, useRef, useState } from "react";
import { Avatar, Button, Modal, notification, Spin } from "antd";
import PictureOutlined from "@ant-design/icons/lib/icons/PictureOutlined";
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
  const imgUrl = useRef<string | Object>("");
  const [loader, setLoader] = useState<Boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const updateProfile = async () => {
    try {
      await Auth.updateUserAttributes(user, { ["picture"]: imgUrl.current });
      notification.success({ message: `Profile updated successfully` });
      setIsModalVisible(false);
    } catch (error) {
      console.log(error, imgUrl.current, 1);
      notification.error({ message: `Unable to update, ${error}` });
    }
  };

  const openBrowse = () => {
    if (inputEl?.current !== null) inputEl.current.click();
  };

  useLayoutEffect(() => {
    setLoader(false);
  }, [imgUrl]);

  const getImage = async () => {
    try {
      if (inputEl?.current?.files?.length) {
        setLoader(true);
        const file = inputEl.current.files[0];
        goalImgStorage.validateImg(file);
        const result: any = await goalImgStorage.storeGoalImg(file);
        const url = await goalImgStorage.getUrlFromKey(result.key);
        imgUrl.current = url;
        imgKey.current = result.key;
        updateProfile();
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

  return (
    <>
      <span className="image-holder">
        <span onClick={() => setIsModalVisible(true)}>
          {avatar(30, user?.attributes.picture || <PictureOutlined />)}
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
            {imgUrl ? (
              // @ts-ignore
              <img width="100%" src={imgUrl} />
            ) : (
              <span onClick={openBrowse}>
                {avatar(300, imgUrl || <PictureOutlined />)}
              </span>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}
