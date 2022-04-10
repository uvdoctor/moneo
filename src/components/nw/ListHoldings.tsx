import { Col, Empty, Row, Table } from "antd";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { HoldingInput } from "../../api/goals";
import { NWContext, TAB } from "./NWContext";
import {
  calculateValuation,
  doesHoldingMatch,
  hasDate,
  hasminimumCol,
  hasName,
  hasPF,
  hasQtyWithRate,
  hasRate,
} from "./nwutils";
import Category from "./Category";
import Amount from "./Amount";
import DateColumn from "./DateColumn";
import { toHumanFriendlyCurrency } from "../utils";
import { calculateCompundingIncome } from "./valuationutils";
import Rate from "./Rate";
import Quantity from "./Quantity";
import Comment from "./Comment";
import LabelWithTooltip from "../form/LabelWithTooltip";
import MemberInput from "./MemberInput";
import DeleteButton from "./DeleteButton";
import InstrumentDetailedView from "./InstrumentDetailedView";
import ValuationWithReturnPer from "./ValuationWithReturnPer";
require("./ListHoldings.less");

interface ListHoldingsProps {
  data: Array<HoldingInput>;
  changeData: Function;
  categoryOptions: any;
  fields: any;
  info: any;
}
export default function ListHoldings({
  data,
  changeData,
  categoryOptions,
  fields,
  info,
}: ListHoldingsProps) {
  const {
    selectedMembers,
    selectedCurrency,
    childTab,
    fxRates,
    familyOptions,
    preciousMetals,
    setPreciousMetals,
  }: any = useContext(NWContext);
  const { PM, NPS, CRYPTO, VEHICLE, LENT, LOAN, PF, OTHER, P2P, LTDEP } = TAB;
  const [dataSource, setDataSource] = useState<Array<any>>([]);
  const [purDetailsChanged, setPurDetailsChanged] = useState<boolean>(false);

  const allColumns: any = {
    type: { title: fields.type, dataIndex: "type", key: "type" },
    amount: {
      title: hasQtyWithRate(childTab) ? fields.qty : fields.amount,
      dataIndex: "amount",
      key: "amount",
    },
    rate: { title: fields.rate, dataIndex: "rate", key: "rate" },
    val: { title: "Valuation", key: "val", dataIndex: "val" },
    date: { title: fields.date, dataIndex: "date", key: "date" },
    label: { title: fields.name, dataIndex: "label", key: "label" },
    qty: { title: fields.qty, dataIndex: "qty", key: "qty" },
    mat: { title: "Maturity Amount", key: "mat", dataIndex: "mat" },
  };
  let defaultColumns: Array<string> = [];
  let expandedColumns: Array<string> = [];
  if (hasminimumCol(childTab)) {
    defaultColumns = ["amount", "label"];
    expandedColumns = Object.keys(familyOptions).length > 1 ? ["fid"] : [];
  } else if (childTab === OTHER) {
    defaultColumns = ["amount", "type"];
    expandedColumns = ["label", "fid"];
  } else if (childTab === PM || childTab === CRYPTO || childTab === NPS) {
    defaultColumns = ["amount", "val"];
    expandedColumns = ["type", "fid"];
  } else if (childTab === VEHICLE) {
    defaultColumns = ["amount", "val"];
    expandedColumns = ["label", "type", "date", "fid"];
  } else if (childTab === LENT || childTab === LTDEP || childTab === P2P) {
    defaultColumns = ["amount", "val"];
    expandedColumns = ["label", "type", "date", "rate", "mat", "fid"];
  } else if (childTab === PF) {
    defaultColumns = ["amount", "val"];
    expandedColumns = ["type", "rate", "qty", "fid"];
  } else if (childTab === LOAN) {
    defaultColumns = ["amount", "val"];
    expandedColumns = ["label", "date", "rate", "fid"];
  }

  const changeOwner = (ownerKey: string, i: number) => {
    data[i].fId = ownerKey;
    changeData([...data]);
  };

  const getAllData = (holding: HoldingInput, i: number, valuation?: number) => {
    if (!holding) return;
    const dataToRender: any = {
      key: i,
      amount: <Amount data={data} changeData={changeData} record={holding} />,
      type: categoryOptions && (
        <Category
          categoryOptions={categoryOptions}
          record={holding}
          changeData={changeData}
          data={data}
          pre={childTab === OTHER ? "" : fields.type}
          info={info.type}
          post={
            defaultColumns[1] === "type" ? (
              <DeleteButton data={data} changeData={changeData} index={i} />
            ) : null
          }
        />
      ),
      val: valuation && (
        <Row align="middle">
          <Col>
            <ValuationWithReturnPer
              valuation={valuation}
              holding={data[i]}
              purDetailsChanged={purDetailsChanged}
            />
          </Col>
          {defaultColumns[1] === "val" ? (
            <Col>
              <DeleteButton data={data} changeData={changeData} index={i} />
            </Col>
          ) : null}
        </Row>
      ),
      qty: hasPF(childTab) && (
        <Quantity
          changeData={changeData}
          data={data}
          record={holding}
          pre={fields.qty}
          info={info.qty}
        />
      ),
      mat: (
        <Fragment>
          <LabelWithTooltip label={"Maturity Amount"} />
          {toHumanFriendlyCurrency(
            calculateCompundingIncome(holding).maturityAmt,
            selectedCurrency
          )}
        </Fragment>
      ),
    };

    if (hasDate(childTab) && expandedColumns.includes("date")) {
      dataToRender.date = (
        <DateColumn
          data={data}
          changeData={changeData}
          record={holding}
          pre={fields.date}
          info={info.date}
        />
      );
    }
    if (hasRate(childTab)) {
      dataToRender.rate = (
        <Rate
          changeData={changeData}
          record={holding}
          pre={fields.rate}
          data={data}
          info={info.rate}
        />
      );
    }
    if (Object.keys(familyOptions).length > 1) {
      dataToRender.fid = (
        <MemberInput
          value={holding.fId}
          changeHandler={(key: string) => changeOwner(key, i)}
          pre
        />
      );
    }
    if (hasName(childTab)) {
      dataToRender.label = (
        <Row>
          <Col span={18}>
            <Comment
              changeData={changeData}
              data={data}
              record={holding}
              pre={expandedColumns.includes("label") ? fields.name : ""}
            />
          </Col>
          <Col>
            {defaultColumns[1] === "label" ? (
              <DeleteButton data={data} changeData={changeData} index={i} />
            ) : null}
          </Col>
        </Row>
      );
    }
    return dataToRender;
  };

  const expandedRow = (i: number) => {
    const dataSource = getAllData(data[i], i);
    if (!dataSource) return null;
    return (
      <Row
        gutter={[
          { xs: 0, sm: 10, md: 30 },
          { xs: 20, sm: 10, md: 20 },
        ]}>
        {expandedColumns.map((item: any) => {
          return (
            dataSource[item] && (
              <Col xs={24} sm={12} md={8} key={item}>
                {dataSource[item]}
              </Col>
            )
          );
        })}
      </Row>
    );
  };

  const columns = defaultColumns.map((col: string) => allColumns[col]);

  useEffect(() => {
    const getData = async () => {
      let dataSource: Array<any> = [];
      for (let index = 0; index < data.length; index++) {
        if (
          data[index] &&
          doesHoldingMatch(data[index], selectedMembers, selectedCurrency)
        ) {
          const valuation = await calculateValuation(
            childTab,
            data[index],
            selectedCurrency,
            fxRates
          );
          dataSource.push(getAllData(data[index], index, valuation));
          setDataSource([...dataSource]);
        }
      }
    };
    if (purDetailsChanged) {
      setPurDetailsChanged(false);
      return;
    }
    getData();
  }, [data, selectedMembers, selectedCurrency, familyOptions, childTab]);

  return dataSource.length ? (
    <Table
      className="list-holdings"
      columns={columns}
      expandable={
        expandedColumns.length
          ? {
              expandedRowRender: (record) => {
                return childTab === PM ? (
                  <InstrumentDetailedView
                    record={preciousMetals[record.key]}
                    data={preciousMetals}
                    dataHandler={setPreciousMetals}
                    otherView={expandedRow(record.key)}
                    purChange={purDetailsChanged}
                    purChangeHandler={setPurDetailsChanged}
                    unit="grams"
                  />
                ) : (
                  expandedRow(record.key)
                );
              },
            }
          : {}
      }
      dataSource={dataSource}
      size="small"
    />
  ) : (
    <Empty description={<p>No data found.</p>} />
  );
}
