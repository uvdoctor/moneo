import { Button, Col, Empty, Row, Table } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { HoldingInput } from "../../api/goals";
import { NWContext } from "./NWContext";
import { doesHoldingMatch, hasDate, hasRate } from "./nwutils";
import Category from "./Category";
import Amount from "./Amount";
import DateColumn from "./DateColumn";
import { DeleteOutlined } from "@ant-design/icons";
import MemberInput from "./MemberInput";
import Rate from "./Rate";
require("./ListHoldings.less");

interface ListInsuranceProps {
  data: Array<HoldingInput>;
  changeData: Function;
  categoryOptions: any;
  fields: any;
  info: any;
}
export default function ListInsurance({
  data,
  changeData,
  categoryOptions,
  fields,
  info,
}: ListInsuranceProps) {
  const { selectedMembers, selectedCurrency, childTab, familyOptions }: any =
    useContext(NWContext);
  const [dataSource, setDataSource] = useState<Array<any>>([]);

  const allColumns: any = {
    type: { title: fields.type, dataIndex: "type", key: "type" },
    amount: {
      title: fields.amount,
      dataIndex: "amount",
      key: "amount",
    },
    rate: { title: fields.rate, dataIndex: "rate", key: "rate" },
    date: { title: fields.date, dataIndex: "date", key: "date" },
    del: { title: "", dataIndex: "del", key: "del", align: "left" },
  };
  let defaultColumns: Array<string> = ["amount", "type", "del"];
  let expandedColumns: Array<string> = ["date", "rate", "fid"];

  const changeOwner = (ownerKey: string, i: number) => {
    data[i].fId = ownerKey;
    changeData([...data]);
  };

  const removeHolding = (i: number) => {
    data.splice(i, 1);
    changeData([...data]);
  };

  const getAllData = (holding: HoldingInput, i: number) => {
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
          pre={""}
          info={info.type}
        />
      ),
      del: (
        <Button
          type="link"
          onClick={() => removeHolding(i)}
          danger
          icon={<DeleteOutlined />}
        />
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
    return dataToRender;
  };

  const expandedRow = (i: number) => {
    const dataSource = getAllData(data[i], i);
    if (!dataSource) return;
    return (
      <Row
        gutter={[
          { xs: 0, sm: 10, md: 30 },
          { xs: 20, sm: 10, md: 20 },
        ]}
      >
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
    const getData = () => {
      let dataSource: Array<any> = [];
      for (let index = 0; index < data.length; index++) {
        if (
          data[index] &&
          data[index].subt === childTab.charAt(0) &&
          doesHoldingMatch(data[index], selectedMembers, selectedCurrency)
        ) {
          dataSource.push(getAllData(data[index], index));
          setDataSource([...dataSource]);
        }
      }
    };
    getData();
  }, [data, selectedMembers, selectedCurrency, familyOptions, childTab]);

  return dataSource.length ? (
    <Table
      className="list-holdings"
      columns={columns}
      expandable={
        expandedColumns.length
          ? {
              expandedRowRender: (record) => expandedRow(record.key),
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
