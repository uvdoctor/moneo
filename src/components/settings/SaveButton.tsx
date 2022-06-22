import { Button, Col, Row } from "antd";
import React from "react";
import { COLORS } from "../../CONSTANTS";
import { SaveOutlined } from "@ant-design/icons";

interface SaveButtonProps {
  loading?: boolean;
  error?: any;
  onClick: Function;
  disabledForm?: boolean;
}

export default function SaveButton({
  loading,
  error,
  onClick,
  disabledForm,
}: SaveButtonProps) {

  return (
    <Row justify="center">
      <Col>
        <Button
          id="save"
          type="primary"
          loading={loading}
          size="middle"
          style={{ color: COLORS.WHITE, background: COLORS.GREEN }}
          icon={<SaveOutlined />}
          disabled={
            disabledForm
              ? disabledForm
              : error && error.length > 0
              ? true
              : false
          }
          onClick={async() => {
            await onClick();
          }}
        >
          Save
        </Button>
      </Col>
    </Row>
  );
}
