import React, { useEffect, useContext, useState } from "react";
import { Alert, Button, Col, Divider, Empty, List, Row } from "antd";
import { HoldingInput, InstrumentInput, PurchaseInput } from "../../api/goals";
import { toHumanFriendlyCurrency } from "../utils";
import DateInput from "../form/DateInput";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import NumberInput from "../form/numberinput";
import { NWContext } from "./NWContext";
const today = new Date();

interface PurchaseProps {
  record: InstrumentInput | HoldingInput;
  data: Array<InstrumentInput | HoldingInput>;
  dataHandler: Function;
  purChange?: boolean;
  purChangeHandler?: Function;
}

export default function Purchase({
  record,
  data,
  dataHandler,
  purChange,
  purChangeHandler,
}: PurchaseProps) {
  const [purchaseDetails, setPurchaseDetails] = useState<Array<PurchaseInput>>(
    record.pur ? record.pur : []
  );
  const { selectedCurrency }: any = useContext(NWContext);

  const deleteEntry = (record: any) => {
    setPurchaseDetails([
      ...purchaseDetails.filter((item: PurchaseInput) => item !== record),
    ]);
  };

  useEffect(() => {
    record.pur = [...purchaseDetails];
    if (purChangeHandler) purChangeHandler(true);
    else dataHandler([...data]);
  }, [purchaseDetails]);

  useEffect(() => {
    if (!purChange) return;
    dataHandler([...data]);
  }, [purChange]);

  const calculateBoughtQuantity = () => {
    let totalqty = 0;
    purchaseDetails.forEach((item: any) => (totalqty += Number(item.qty)));
    return totalqty;
  };

  return (
    <Row justify="center">
      <Button
        type="dashed"
        disabled={calculateBoughtQuantity() === record.qty}
        onClick={() => {
          const totalQty = calculateBoughtQuantity();
          if (totalQty < record.qty) {
            purchaseDetails.push({
              amt: 0,
              qty: record.qty - totalQty,
              day: today.getDate(),
              month: today.getMonth(),
              year: today.getFullYear(),
            });
            setPurchaseDetails([...purchaseDetails]);
          }
        }}
        icon={<PlusOutlined />}>
        Add transaction
      </Button>
      <p>&nbsp;</p>
      {purchaseDetails.length ? (
        calculateBoughtQuantity() !== record.qty && (
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
                          setPurchaseDetails([...purchaseDetails]);
                        }
                      }}
                      noRangeFactor
                      inline
                    />
                  </Col>
                  <Col xs={12} lg={6}>
                    <DateInput
                      title="on"
                      startMonthHandler={(val: any) => {
                        if (record) {
                          record.month = val;
                          setPurchaseDetails([...purchaseDetails]);
                        }
                      }}
                      startYearHandler={(val: any) => {
                        if (record) {
                          record.year = val;
                          setPurchaseDetails([...purchaseDetails]);
                        }
                      }}
                      startDateHandler={(val: any) => {
                        if (record) {
                          record.day = val;
                          setPurchaseDetails([...purchaseDetails]);
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
                          setPurchaseDetails([...purchaseDetails]);
                        }
                      }}
                      currency={selectedCurrency}
                      noRangeFactor
                      inline
                    />
                  </Col>
                  <Col xs={12} lg={6}>
                    <Row justify="end">
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
                    </Row>
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
