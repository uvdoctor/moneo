import React, { useContext, useEffect, useState } from "react";
import { Alert, Button, Col, Empty, Popconfirm, Row, Table } from "antd";
import { PurchaseInput } from "../../api/goals";
import { getStr, isMobileDevice, toCurrency, toReadableNumber } from "../utils";
import { useFullScreenBrowser } from "react-browser-hooks";
import DateInput from "../form/DateInput";
import {
  SaveOutlined,
  EditOutlined,
  CloseOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
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
  date: string;
}

interface EditableCellProps {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "number" | "date";
  record: Item;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const fsb = useFullScreenBrowser();
  const { selectedCurrency }: any = useContext(NWContext);
  let date = new Date();
  if (record && record.date) date = new Date(record.date);
  const [year, setYear] = useState<number>(date.getFullYear());
  const [day, setDay] = useState<number>(date.getDate());
  const [month, setMonth] = useState<number>(date.getMonth() + 1);
  const [qty, setQty] = useState<number>(record?.qty);
  const [amt, setAmt] = useState<number>(record?.amt);
  const inputNode = (inputType: string, key?: string) => {
    const type = key ? key : dataIndex;
    return inputType === "number" && record ? (
      <NumberInput
        pre=""
        value={type === "qty" ? qty : amt}
        changeHandler={type === "qty" ? setQty : setAmt}
        currency={type === "qty" ? "" : selectedCurrency}
        noRangeFactor
      />
    ) : (
      <DateInput
        title={""}
        startMonthHandler={(val: any) => setMonth(val)}
        startYearHandler={(val: any) => setYear(val)}
        startDateHandler={(val: any) => setDay(val)}
        startDateValue={day as number}
        startMonthValue={month}
        startYearValue={year}
        size="middle"
      />
    );
  };

  useEffect(() => {
    const date = `${year}-${getStr(month)}-${getStr(day)}`;
    if (record) record.date = date;
  }, [day, month, year]);

  useEffect(() => {
    if (record) record.qty = qty;
  }, [qty]);

  useEffect(() => {
    if (record) record.amt = amt;
  }, [amt]);

  return (
    <td {...restProps}>
      {editing ? (
        isMobileDevice(fsb) && record ? (
          <Row gutter={[0, 8]}>
            <Col xs={24}>
              <label>Quantity: </label>
              {inputNode("number", "qty")}
            </Col>
            <Col xs={24}>
              <label>Amount: </label>
              {inputNode("number", "amt")}
            </Col>
            <Col xs={24}>{inputNode("date")}</Col>
          </Row>
        ) : (
          inputNode(inputType)
        )
      ) : isMobileDevice(fsb) && record ? (
        <>
          <label>
            Quantity: <strong>{toReadableNumber(record.qty, 2)}</strong>
          </label>
          <br />
          <label>
            Amount: <strong>{toCurrency(record.amt, selectedCurrency)}</strong>
          </label>{" "}
          <br />
          <label>
            Date: <strong>{record.date}</strong>
          </label>{" "}
          <br />
        </>
      ) : (
        children
      )}
    </td>
  );
};

export default function Purchase({ pur, qty, onSave }: PurchaseProps) {
  const [purchaseDetails, setPurchaseDetails] = useState<any>([]);
  const [editingKey, setEditingKey] = useState<string>("");
  const fsb = useFullScreenBrowser();

  const save = (record: any) => {
    const item = purchaseDetails[record.key];
    purchaseDetails.splice(record.key, 1, {
      ...item,
      ...record,
    });
    setPurchaseDetails(purchaseDetails);
    onSave(purchaseDetails);
    setEditingKey("");
  };

  const deleteEntry = (record: any) => {
    purchaseDetails.splice(record.key, 1);
    setPurchaseDetails([...purchaseDetails]);
    onSave(purchaseDetails);
    setEditingKey("");
  };

  const isEditing = (record: Item) => record.key === editingKey;
  const columns = [
    {
      title: isMobileDevice(fsb) ? "Details" : "Quantity",
      dataIndex: "qty",
      key: "qty",
      editable: true,
    },
    {
      title: "Amount",
      key: "amt",
      dataIndex: "amt",
      editable: true,
      responsive: ["md"],
    },
    {
      title: "Date",
      key: "date",
      dataIndex: "date",
      editable: true,
      responsive: ["md"],
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_: any, record: Item) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button
              type="link"
              onClick={() => save(record)}
              style={{ marginRight: 8 }}
              icon={<SaveOutlined />}
            />
            <Popconfirm
              title="Sure to cancel?"
              onConfirm={() => setEditingKey("")}>
              <Button type="link" icon={<CloseOutlined />} />
            </Popconfirm>
          </span>
        ) : (
          <span>
            <Button
              type="link"
              icon={<EditOutlined />}
              disabled={editingKey !== ""}
              onClick={() => setEditingKey(record.key)}
            />
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => deleteEntry(record)}>
              <Button
                type="link"
                style={{ marginRight: 8 }}
                disabled={editingKey !== ""}
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        inputType: col.dataIndex === "date" ? "date" : "number",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        responsive: col.responsive,
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
            setEditingKey(purchaseDetails.length ? purchaseDetails.length : 0);
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
