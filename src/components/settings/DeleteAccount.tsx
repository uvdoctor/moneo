import React, { useContext, useState } from "react";
import { Button, Modal, notification, Space, Tooltip } from "antd";
import { COLORS } from "../../CONSTANTS";
import { AppContext } from "../AppContext";
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";
import Text from "antd/lib/typography/Text";
import TextInput from "../form/textinput";
import Auth from "@aws-amplify/auth";
import { Hub } from "@aws-amplify/core";
import router from "next/router";
import { deleteEmail, deleteMobile } from "../registrationutils";

interface DeleteAccountProps {
  mobile?: number;
  email: string;
}

export default function DeleteAccount({ mobile, email }: DeleteAccountProps) {
  const { validateCaptcha }: any = useContext(AppContext);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleLogout = async () => {
    try {
      await Auth.signOut();
      Hub.dispatch("auth", { event: "signOut" });
    } catch (error) {
      console.log("error signing out: ", error);
    } finally {
      router.reload();
    }
  };

  const handleOk = () => {
    if (input === "delete") {
      try {
        validateCaptcha("delete_change").then(async (success: boolean) => {
          if (!success) return;
          const user = await Auth.currentAuthenticatedUser();
          mobile ? await deleteMobile(mobile) : null;
          await deleteEmail(email);
          user.deleteUser((error: any, data: any) => {
            if (error) {
              console.log(error);
              throw error;
            }
            console.log(data);
            handleLogout();
          });
          notification.success({
            message: "Deleted sucessfully",
            description: "Your account will be logged out automatically.",
          });
        });
      } catch (err) {
        notification.error({
          message: "Unable to delete your account",
          description: `${err}`,
        });
      }
    } else {
      notification.error({ message: "Enter the input correctly" });
    }
    setIsModalVisible(false);
  };

  
  return (
    <>
      <Tooltip title="Save">
        <Button
          type="link"
          style={{ color: COLORS.RED }}
          icon={<DeleteOutlined />}
          onClick={showModal}
        >
          Delete Account
        </Button>
      </Tooltip>
      <Modal
        title={"Delete Account"}
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={handleOk}
        okText={"Delete My Account"}
        okType="danger"
        style={{ color: COLORS.RED }}
        okButtonProps={{ icon: <DeleteOutlined /> }}
      >
        <Space direction="vertical">
          <Text strong>Are you sure you want to delete this account?</Text>
          <Text>
            This action cannot be undone. This will permanently delete your
            account and all your data will be deleted.
          </Text>
          <Text>
            To confirm deletion, enter<Text italic strong>delete</Text>
          </Text>
        </Space>
        <TextInput pre={""} value={input} changeHandler={setInput} />
      </Modal>
    </>
  );
}
