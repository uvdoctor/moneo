import React, { useContext, useEffect, useState } from "react";
import DateInput from "./form/DateInput";
import { Col, Row } from "antd";
import { getStr } from "./utils";
import NumberInput from "./form/numberinput";
import { AppContext } from "./AppContext";

interface StepTwoProps {
  setDOB: Function;
  monthlyExp: number;
  setMonthlyExp: Function;
  monthlyInv: number;
  setMonthlyInv: Function;
  totalPortfolio: number;
  setTotalPortfolio: Function;
}

export default function StepTwo({
  setDOB,
  monthlyExp,
  setMonthlyExp,
  monthlyInv,
  setMonthlyInv,
  totalPortfolio,
  setTotalPortfolio,
}: StepTwoProps) {
  const { defaultCurrency }: any = useContext(AppContext);
  const [date, setDate] = useState<number>(1);
  const [month, setMonth] = useState<number>(1);
  const [year, setYear] = useState<number>(2000);

  useEffect(() => {
    setDOB(`${year}-${getStr(month)}-${getStr(date)}`);
  }, [date, month, year]);

  return (
    <Row gutter={[8, 16]}>
      <Col span={24}>
        <DateInput
          title={"Date of Birth"}
          startYearHandler={setYear}
          startDateHandler={setDate}
          startMonthHandler={setMonth}
          startYearValue={year}
          startMonthValue={month}
          startDateValue={date}
          size="middle"
        />
      </Col>
      <Col span={24}>
        <NumberInput
          info="Current portfolio value across cash, deposits, real estate, gold, stocks, bonds, retirement accounts, etc. Please do NOT include the value of the property where you live."
          value={totalPortfolio}
          pre="Current portfolio value"
          min={500}
          max={900000}
          changeHandler={setTotalPortfolio}
          step={100}
          currency={defaultCurrency}
        />
      </Col>
      <Col span={24}>
        <NumberInput
          pre="Average monthly expense"
          value={monthlyExp}
          changeHandler={setMonthlyExp}
          currency={defaultCurrency}
          min={100}
          max={1000000}
          info="Average monthly expense of your household"
          noRangeFactor
        />
      </Col>
      <Col span={24}>
        <NumberInput
          pre="Possible monthly investment"
          value={monthlyInv}
          changeHandler={setMonthlyInv}
          currency={defaultCurrency}
          min={100}
          max={1000000}
          info="Amount of money you can invest on a monthly basis"
          noRangeFactor
        />
      </Col>
    </Row>
  );
}
