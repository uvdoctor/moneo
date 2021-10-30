import { Col, Input } from "antd";
import React, { Fragment } from "react";
import { BalanceInput } from "../../api/goals";
import SelectInput from "../form/selectinput";
import QuantityWithRate from "./QuantityWithRate";

interface SavingTabInputProps {
  data: Array<BalanceInput>;
  changeData: Function;
  record: BalanceInput;
  categoryOptions: any;
}

export default function SavingTabInput({
  data,
  changeData,
  record,
  categoryOptions,
}: SavingTabInputProps) {
    const changeName = (e: any) => {
      record.name = e.target.value;
      changeData([...data]);
    };

  const changeAmt = (amt : number) => {
    record.amt = amt
    changeData([...data]);
  };

  const changeSubtype = (curr: string) => {
    record.curr = curr;
    changeData([...data]);
  };
  return (
    <Fragment>
      <Col>
        <SelectInput
          pre=""
          value={record.curr as string}
          options={categoryOptions}
          changeHandler={(val: string) => changeSubtype(val)}
        />
      </Col>
      <Col>
      <Input placeholder="Name" onChange={changeName} value={record.name as string}/>
      </Col>
      <Col>
       <QuantityWithRate quantity={record.amt} subtype={record.curr} onChange={changeAmt} name={''} />
      </Col>
    </Fragment>
  );
}
