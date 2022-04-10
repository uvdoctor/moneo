import React, { useEffect, useContext, useState } from "react";
import { Alert, Button, Col, Divider, Empty, List, Row } from "antd";
import { PurchaseInput } from "../../api/goals";
import { toHumanFriendlyCurrency } from "../utils";
import DateInput from "../form/DateInput";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import NumberInput from "../form/numberinput";
import { NWContext } from "./NWContext";
const today = new Date();

interface PurchaseProps {
  qty: number;
  pur: Array<PurchaseInput>;
  onSave: Function;
}

export default function Purchase({ pur, qty, onSave }: PurchaseProps) {
  const [purchaseDetails, setPurchaseDetails] = useState<any>([]);
  const { selectedCurrency }: any = useContext(NWContext);

  const deleteEntry = (record: any) => {
    purchaseDetails.splice(record.key, 1);
    setPurchaseDetails([...purchaseDetails]);
    onSave(purchaseDetails);
  };

  const save = (record: any) => {
    const item = purchaseDetails[record.key];
    purchaseDetails.splice(record.key, 1, {
      ...item,
      ...record,
    });
    setPurchaseDetails([...purchaseDetails]);
    onSave(purchaseDetails);
  };

  useEffect(() => {
    let purchaseDetails: Array<any> = [];
    setPurchaseDetails([...[]]);
    if (!pur || !pur.length) return;
    for (let i = 0; i < pur.length; ++i) {
      purchaseDetails.push({ key: i, ...pur[i] });
    }
    setPurchaseDetails([...purchaseDetails]);
  }, [pur]);

  const totalqty = () => {
    let totalqty = 0;
    purchaseDetails.map((item: any) => (totalqty += Number(item.qty)));
    return totalqty;
  };

  return (
    <Row justify="center">
      <Button
        type="dashed"
        disabled={totalqty() === qty || totalqty() > qty}
        onClick={() => {
          const totalQty = totalqty();
          if (totalQty < qty) {
            const purchase = [
              ...purchaseDetails,
              {
                key: purchaseDetails.length ? purchaseDetails.length : 0,
                amt: 0,
                qty: qty - totalQty,
                day: today.getDate(),
                month: today.getMonth(),
                year: today.getFullYear(),
              },
            ];
            setPurchaseDetails(purchase);
            onSave(purchase);
          }
        }}
        icon={<PlusOutlined />}
      >
        Add transaction
      </Button>
      <p>&nbsp;</p>
      {purchaseDetails.length ? (
        (totalqty() > qty || totalqty() < qty) && (
          <Col xs={24}>
            <Alert
              type={"error"}
              message={
                "Total quantity bought should be equal to the quantity held"
              }
            />
          </Col>
        )
      ) : (
        <></>
      )}
      <Col xs={24}>
        {purchaseDetails.length ? (
          <List
            itemLayout="horizontal"
            dataSource={purchaseDetails}
            renderItem={(record: any) => (
              <>
                <Row justify="space-between">
                  <Col xs={12} lg={6}>
                    <NumberInput
                      pre="Bought"
                      value={record?.qty}
                      autoFocus
                      changeHandler={(val: any) => {
                        if (record) {
                          record.qty = val;
                          save(record);
                        }
                      }}
                      noRangeFactor
                      // inline
                    />
                  </Col>
                  <Col xs={12} lg={6}>
                    <DateInput
                      title="on"
                      startMonthHandler={(val: any) => {
                        if (record) {
                          record.month = val;
                          save(record);
                        }
                      }}
                      startYearHandler={(val: any) => {
                        if (record) {
                          record.year = val;
                          save(record);
                        }
                      }}
                      startDateHandler={(val: any) => {
                        if (record) {
                          record.day = val;
                          save(record);
                        }
                      }}
                      startDateValue={record?.day}
                      startMonthValue={record?.month}
                      startYearValue={record?.year}
                      size="middle"
                      inline
                    />
                  </Col>
                  <Col xs={12} lg={6}>
                    <NumberInput
                      pre="at price of "
                      value={record?.amt || 0}
                      autoFocus
                      changeHandler={(val: any) => {
                        if (record) {
                          record.amt = val;
                          save(record);
                        }
                      }}
                      currency={selectedCurrency}
                      noRangeFactor
                      // inline
                    />
                  </Col>
                  <Col xs={12} lg={6}>
                    {`Total ${toHumanFriendlyCurrency(
                      record.qty * record.amt,
                      selectedCurrency
                    )}`}
                    <Button
                      type="link"
                      danger
                      style={{ marginRight: 8 }}
                      icon={<DeleteOutlined />}
                      onClick={() => deleteEntry(record)}
                    />
                  </Col>
                </Row>
                <Divider />
              </>
            )}
          />
        ) : (
          <Empty description={<p>No data found.</p>} />
        )}
      </Col>
    </Row>
  );
}
