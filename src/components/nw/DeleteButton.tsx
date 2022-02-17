import { Button } from "antd";
import React from "react";
import { DeleteOutlined } from "@ant-design/icons";

interface DeleteButtonProps {
  data: Array<any>;
  changeData: Function;
  index: number;
}

export default function DeleteButton({
  data,
  changeData,
  index,
}: DeleteButtonProps) {
  const removeHolding = (i: number) => {
    data.splice(i, 1);
    changeData([...data]);
  };

  return (
    <Button
      type="link"
      onClick={() => removeHolding(index)}
      danger
      icon={<DeleteOutlined />}
    />
  );
}
