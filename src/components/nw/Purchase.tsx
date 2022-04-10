import React, { useEffect, useContext, useState } from "react";
import { Alert, Button, Col, Empty, Row, Table } from "antd";
import { PurchaseInput } from "../../api/goals";
import { isMobileDevice, toHumanFriendlyCurrency } from "../utils";
import { useFullScreenBrowser } from "react-browser-hooks";
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

interface Item {
  key: string;
  amt: number;
  qty: number;
  month: number;
  year: number;
  day: number;
}

interface EditableCellProps {
  col: any;
  record: Item;
  index: number;
  children: React.ReactNode;
  purchaseDetails: Array<any>;
  setPurchaseDetails: Function;
  onSave: Function;
}

const EditableCell: React.FC<EditableCellProps> = ({
  col,
  record,
  index,
  children,
  setPurchaseDetails,
  purchaseDetails,
  onSave,
  ...restProps
}) => {
  const fsb = useFullScreenBrowser();
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
    setPurchaseDetails(purchaseDetails);
    onSave(purchaseDetails);
  };

  const inputType = col.dataIndex;

  const inputNode = (inputType: string, key?: string, pre?: string) => {
    const type = key ? key : col.key;
    return inputType === "number" ? (
      <NumberInput
        pre={pre ? pre : ""}
        value={type === "qty" ? record?.qty : record?.amt}
        autoFocus
        changeHandler={(val: any) => {
          if (record) {
            type === "qty" ? (record.qty = val) : (record.amt = val);
            save(record);
          }
        }}
        currency={type === "qty" ? "" : selectedCurrency}
        noRangeFactor
      />
    ) : inputType === "date" ? (
      <DateInput
        title={pre ? pre : ""}
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
      />
    ) : (
      record && (
        <span>
          <label>
            {toHumanFriendlyCurrency(record.qty * record.amt, selectedCurrency)}
          </label>
          <Button
            type="link"
            danger
            style={{ marginRight: 8 }}
            icon={<DeleteOutlined />}
            onClick={() => deleteEntry(record)}
          />
        </span>
      )
    );
  };

  return (
    <td {...restProps}>
      {isMobileDevice(fsb) && record ? (
        inputType === "total" ? (
          inputNode("total")
        ) : (
          <Row gutter={[0, 8]}>
            <Col xs={24}>{inputNode("date", "", "Date")}</Col>
            <Col xs={24}>{inputNode("number", "qty", "Quantity")}</Col>
            <Col xs={24}>{inputNode("number", "amt", "Price")}</Col>
          </Row>
        )
      ) : (
        inputNode(inputType)
      )}
    </td>
  );
};

export default function Purchase({ pur, qty, onSave }: PurchaseProps) {
  const [purchaseDetails, setPurchaseDetails] = useState<any>([]);
  const fsb = useFullScreenBrowser();

  const columns = [
    {
      title: "Date",
      key: "date",
      dataIndex: "date",
      responsive: ["md"],
    },
    {
      title: isMobileDevice(fsb) ? "Details" : "Quantity",
      dataIndex: "number",
      key: "qty",
    },
    {
      title: "Price",
      key: "amt",
      dataIndex: "number",
      responsive: ["md"],
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
    },
  ];

  const mergedColumns = columns.map((col) => {
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        col: col,
        setPurchaseDetails: setPurchaseDetails,
        purchaseDetails: purchaseDetails,
        onSave: onSave,
      }),
    };
  });

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
    <Row justify="center" gutter={[8, 8]}>
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
          <Table
            className="list-holdings"
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            bordered
            // @ts-ignore
            pagination={purchaseDetails.length < 10 ? false : true}
            // @ts-ignore
            columns={mergedColumns}
            dataSource={purchaseDetails}
            size="small"
          />
        ) : (
          <Empty description={<p>No data found.</p>} />
        )}
      </Col>
    </Row>
  );
}
