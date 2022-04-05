import React, { Fragment, useState } from "react";
import { Typography } from "antd";
import { InstrumentInput } from "../../api/goals";
import Purchase from "./Purchase";

interface PurchaseButtonProps {
  holding: InstrumentInput;
  onSave: Function;
}

export default function PurchaseButton({
  holding,
  onSave,
}: PurchaseButtonProps) {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  return (
    <Fragment>
      <Typography.Link
        onClick={() => setIsModalVisible(isModalVisible ? false : true)}
      >
        Purchase Details
      </Typography.Link>
      {/*       
       : holding.avgp ? (
        <strong>
          Avg.Price - {toHumanFriendlyCurrency(holding.avgp, holding.curr)}
        </strong>
      )} */}
      <Purchase
        onSave={(pur: any) => onSave(pur)}
        open={isModalVisible}
        setIsOpen={setIsModalVisible}
        pur={holding.pur ? holding.pur : []}
        qty={Number(holding.qty)}
      />
    </Fragment>
  );
}
