import { Button, Col, Divider, Row, Tooltip } from "antd";
import React, { useContext, useEffect, useState } from "react";
import simpleStorage from "simplestorage.js";
import { AssetSubType, InsWatchInput } from "../../api/goals";
import { COLORS, LOCAL_INS_DATA_KEY } from "../../CONSTANTS";
import NumberInput from "../form/numberinput";
import { DBContext } from "./DBContext";
import { AlertOutlined, DeleteOutlined } from "@ant-design/icons";
import { AppContext } from "../AppContext";
import InsPrice from "../nw/InsPrice";
import { getCryptoRate, getExchgRate } from "../nw/nwutils";
import { otherISIN } from "../nw/valuationutils";

interface WatchlistRowProps {
  record: InsWatchInput;
}

export default function WatchlistRow({ record }: WatchlistRowProps) {
  const { defaultCurrency }: any = useContext(AppContext);
  const { watchlist, setWatchlist, fxRates }: any = useContext(DBContext);
  const [showThresholds, setShowThresholds] = useState<boolean>(
    record.hight || record.lowt ? true : false
  );
  const [watchIns, setWatchIns] = useState<any>({});
  const insData = simpleStorage.get(LOCAL_INS_DATA_KEY);

  const onDelete = (id: string) => {
    const index = watchlist.findIndex((item: any) => item.id === id);
    if (index > -1) {
      watchlist.splice(index, 1);
      setWatchlist([...watchlist]);
    }
  };

  const getWatchIns = async () => {
    let watchdata: any = {};
    if (record.subt === AssetSubType.C) {
      watchdata.price = await getCryptoRate(
        record.id,
        defaultCurrency,
        fxRates
      );
      watchdata.prev = await getCryptoRate(
        record.id,
        defaultCurrency,
        fxRates,
        true
      );
      watchdata.name = record.sid;
    } else if (record.id.startsWith("US") || otherISIN(record.id)) {
      const data = await getExchgRate(record.sid as string, "US");
      watchdata.price = data.price;
      watchdata.prev = data.prev;
      watchdata.name = record.sid;
    } else {
      watchdata = insData && insData[record.id] ? insData[record.id] : null;
    }
    return watchdata;
  };

  useEffect(() => {
    getWatchIns().then((watchIns: any) => setWatchIns({ ...watchIns }));
  }, [record]);

  return (
    <>
      <Row justify="space-between" align="middle">
        <Col>{watchIns?.name}</Col>
        <Col>
          <InsPrice
            price={watchIns?.price}
            currency={record.id.startsWith('US') ? 'USD' : defaultCurrency}
            previousPrice={watchIns?.prev ? watchIns?.prev : null}
          />
          <Row justify="end">
            <Tooltip title="Buy / Sell alerts">
              <Button
                type="link"
                icon={<AlertOutlined />}
                onClick={() => setShowThresholds(!showThresholds)}
                style={{
                  color: showThresholds ? COLORS.GREEN : COLORS.DEFAULT,
                }}
              />
            </Tooltip>
            <Button
              type="link"
              icon={<DeleteOutlined />}
              onClick={() => onDelete(record.id)}
              danger
            />
          </Row>
        </Col>
      </Row>
      {showThresholds ? (
        <>
          <p>
            <NumberInput
              value={record.lowt as number}
              changeHandler={(val: number) => {
                record.lowt = val;
                setWatchlist([...watchlist]);
              }}
              pre="Buy alert at "
              inline
              currency={defaultCurrency}
            />
          </p>
          <p>
            <NumberInput
              value={record.hight as number}
              changeHandler={(val: number) => {
                record.hight = val;
                setWatchlist([...watchlist]);
              }}
              pre="Sell alert at "
              inline
              currency={defaultCurrency}
            />
          </p>
        </>
      ) : null}
      <Divider />
    </>
  );
}
