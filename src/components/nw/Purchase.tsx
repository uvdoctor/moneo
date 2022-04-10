import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Empty, Row, Table } from "antd";
import { PurchaseInput } from "../../api/goals";
import { getStr, isMobileDevice, toHumanFriendlyCurrency } from "../utils";
import { useFullScreenBrowser } from "react-browser-hooks";
import DateInput from "../form/DateInput";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import NumberInput from "../form/numberinput";
const today = new Date();

interface PurchaseProps {
  qty: number;
  pur: Array<PurchaseInput>;
  currency: string;
  onSave: Function;
}

interface Item {
  key: string;
  amt: number;
  qty: number;
  date: string;
}

interface EditableCellProps {
  col: any;
  record: Item;
  index: number;
  currency: string;
  children: React.ReactNode;
  purchaseDetails: Array<any>;
  setPurchaseDetails: Function;
  onSave: Function;
}

const EditableCell: React.FC<EditableCellProps> = ({
  col,
  record,
  index,
  currency,
  children,
  setPurchaseDetails,
  purchaseDetails,
  onSave,
  ...restProps
}) => {
  const fsb = useFullScreenBrowser();
  let date = new Date();
  if (record && record.date) date = new Date(record.date);
  const [year, setYear] = useState<number>(date.getFullYear());
  const [day, setDay] = useState<number>(date.getDate());
  const [month, setMonth] = useState<number>(date.getMonth() + 1);
  const [qty, setQty] = useState<number>(record?.qty);
  const [amt, setAmt] = useState<number>(record?.amt);

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
        pre={pre ? pre : ''}
        value={type === "qty" ? qty : amt}
        changeHandler={type === "qty" ? setQty : setAmt}
        currency={type === "qty" ? "" : currency}
        noRangeFactor
      />
    ) : inputType === "date" ? (
      <DateInput
        title={ pre ? pre : "" }
        startMonthHandler={(val: any) => setMonth(val)}
        startYearHandler={(val: any) => setYear(val)}
        startDateHandler={(val: any) => setDay(val)}
        startDateValue={day as number}
        startMonthValue={month}
        startYearValue={year}
        size="middle"
      />
    ) : (
      record && (
        <span>
          <label>
            {toHumanFriendlyCurrency(record.qty * record.amt, "INR")}
          </label>
          <Button
            type="link"
            style={{ marginRight: 8 }}
            icon={<DeleteOutlined />}
            onClick={() => deleteEntry(record)}
          />
        </span>
      )
    );
  };

  useEffect(() => {
    const date = `${year}-${getStr(month)}-${getStr(day)}`;
    if (record) {
      record.date = date;
      save(record);
    }
  }, [day, month, year]);

  useEffect(() => {
    if (record) {
      record.qty = qty;
      save(record);
    }
  }, [qty]);

  useEffect(() => {
    if (record) {
      record.amt = amt;
      save(record);
    }
  }, [amt]);

  return (
    <td {...restProps}>
      {isMobileDevice(fsb) && record ? (
        inputType === "total" ? (
          inputNode("total")
        ) : (
          <Row gutter={[0, 8]}>
            <Col xs={24}>{inputNode("date", "", "Date")}</Col>
            <Col xs={24}>
              {inputNode("number", "qty", "Quantity")}
            </Col>
            <Col xs={24}>
              {inputNode("number", "amt", "Price")}
            </Col>
          </Row>
        )
      ) : (
        inputNode(inputType)
      )}
    </td>
  );
};

export default function Purchase({
  pur,
  qty,
  currency,
  onSave,
}: PurchaseProps) {
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
        currency: currency,
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
      const { day, month, year, qty, amt } = pur[i];
      const date = `${year}-${getStr(month)}-${getStr(day as number)}`;
      purchaseDetails.push({
        key: i,
        qty: qty,
        amt: amt,
        date: date,
      });
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
                amt: 100,
                qty: qty - totalQty,
                date: `${today.getFullYear()}-${getStr(
                  today.getMonth() - 1
                )}-1`,
              },
            ];
            setPurchaseDetails(purchase);
            onSave(purchase);
          }
        }}
        icon={<PlusOutlined />}>
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
