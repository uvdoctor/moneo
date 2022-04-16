import { Button, Col, Divider, Row } from "antd";
import React, { useContext, useState } from "react";
import simpleStorage from "simplestorage.js";
import { InsWatchInput } from "../../api/goals";
import { LOCAL_INS_DATA_KEY } from "../../CONSTANTS";
import NumberInput from "../form/numberinput";
import { toHumanFriendlyCurrency } from "../utils";
import { DBContext } from "./DBContext";
import {
  DeleteOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import { AppContext } from "../AppContext";

interface WatchlistRowProps {
  record: InsWatchInput;
}

export default function WatchlistRow({ record }: WatchlistRowProps) {
  const { defaultCurrency }: any = useContext(AppContext);
  const { watchlist, setWatchlist }: any = useContext(DBContext);
  const insData = simpleStorage.get(LOCAL_INS_DATA_KEY);
  const watchIns = insData && insData[record.id] ? insData[record.id] : null;
  const [isEditMode, setEditMode] = useState(false);

  const onEdit = () => setEditMode(true);

  const onCancel = () => setEditMode(false);

  const onDelete = (id: string) => {
    const index = watchlist.findIndex((item: any) => item.id === id);
    if (index > -1) {
      watchlist.splice(index, 1);
      setWatchlist([...watchlist]);
    }
  };

  return (
    <>
      <Row justify="space-between" align="middle">
        <Col>{watchIns.name}</Col>
        <Col>{toHumanFriendlyCurrency(watchIns.price, defaultCurrency)}</Col>
        <Col>
          <Button
            type="link"
            icon={isEditMode ? <SaveOutlined /> : <EditOutlined />}
            onClick={isEditMode ? onCancel : onEdit}
          >
            Alerts
          </Button>
          <Button
            type="link"
            icon={isEditMode ? <CloseOutlined /> : <DeleteOutlined />}
            onClick={() => (isEditMode ? onCancel() : onDelete(record.id))}
            danger
          />
        </Col>
        <Col>
          <Row align="middle" justify="end" gutter={[4,4]}>
            <Col xs={12}>
              {isEditMode ? (
                <NumberInput
                  value={record.hight as number}
                  changeHandler={(val: any) => {
                    record.hight = val;
                    setWatchlist([...watchlist]);
                  }}
                  pre="High"
                />
              ) : (
                record.hight ?  <label>
                  {toHumanFriendlyCurrency(record.hight as number, defaultCurrency)} <ArrowUpOutlined />
                </label> : <></>
              )}
            </Col>
            <Col xs={12}>
              {isEditMode ? (
                <NumberInput
                  value={record.lowt as number}
                  changeHandler={(val: any) => {
                    record.lowt = val;
                    setWatchlist([...watchlist]);
                  }}
                  pre="Low"
                />
              ) : (
                record.lowt ?  <label>
                  {toHumanFriendlyCurrency(record.lowt as number, defaultCurrency)}{" "}
                  <ArrowDownOutlined /> 
                </label> : <></>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
      <Divider />
    </>
  );
}
