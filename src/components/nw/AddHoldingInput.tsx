import { UserOutlined } from "@ant-design/icons";
import { Form, Row, Col } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { AssetSubType, AssetType, HoldingInput } from "../../api/goals";
import { AppContext } from "../AppContext";
import ItemDisplay from "../calc/ItemDisplay";
import CascaderInput from "../form/CascaderInput";
import DateInput from "../form/DateInput";
import NumberInput from "../form/numberinput";
import SelectInput from "../form/selectinput";
import TextInput from "../form/textinput";
import ResultCarousel from "../ResultCarousel";
import { presentMonth, presentYear } from "../utils";
import Interest from "./Interest";
import { NATIONAL_SAVINGS_CERTIFICATE, NWContext, TAB } from "./NWContext";
import {
  getDefaultMember,
  getFamilyOptions,
  hasDate,
  hasName,
  hasOnlyEnddate,
  hasPF,
  hasQtyWithRate,
  hasRate,
  hasOnlyCategory,
  isRangePicker,
  calculateValuation,
  getRateByCategory,
} from "./nwutils";
import QuantityWithRate from "./QuantityWithRate";
import { calculateAddYears, calculateCompundingIncome } from "./valuationutils";
interface AddHoldingInputProps {
  setInput: Function;
  disableOk: Function;
  categoryOptions: any;
  fields: any;
  defaultRate: number;
}
export default function AddHoldingInput({
  setInput,
  disableOk,
  categoryOptions,
  fields,
  defaultRate,
}: AddHoldingInputProps) {
  const {
    allFamily,
    childTab,
    selectedMembers,
    selectedCurrency,
    npsData,
  }: any = useContext(NWContext);
  const { userInfo, discountRate, ratesData }: any = useContext(AppContext);
  const { PM, CRYPTO, LENT, NPS, PF, VEHICLE, LOAN, INS, OTHER, P2P, LTDEP } =
    TAB;
  const [memberKey, setMemberKey] = useState<string>(
    getDefaultMember(allFamily, selectedMembers)
  );
  const [category, setCategory] = useState<string>(
    categoryOptions ? categoryOptions[0].value : ""
  );
  const [subCat, setSubCat] = useState<string>(
    categoryOptions && !hasOnlyCategory(childTab)
      ? categoryOptions[0].children[0].value
      : category === "NBD" || childTab === P2P
      ? "0"
      : ""
  );
  const [name, setName] = useState<string>("");
  const [qty, setQty] = useState<number>(0);
  const [rate, setRate] = useState<number>(defaultRate);
  const [sm, setSm] = useState<number>(4);
  const [em, setEm] = useState<number>(3);
  const [sy, setSy] = useState<number>(
    childTab === VEHICLE ? presentYear - 5 : presentYear + 1
  );
  const [ey, setEy] = useState<number>(presentYear);
  const [amt, setAmt] = useState<number>(0);
  const [valuation, setValuation] = useState<number>(0);
  const [maturityAmt, setMaturityAmt] = useState<number>(0);

  const getNewRec = () => {
    let newRec: HoldingInput = {
      id: "",
      qty: 0,
      fId: "",
      curr: selectedCurrency,
    };
    switch (childTab) {
      case INS:
        newRec.chg = category !== "L" ? rate : 0;
        newRec.chgF = Number(subCat);
        newRec.subt = category;
        newRec.sm = presentMonth;
        newRec.sy = presentYear;
        newRec.em = category !== "H" ? sm : 0;
        newRec.ey = category !== "H" ? sy : 0;
        break;
      case LOAN:
        newRec.chg = rate;
        newRec.chgF = 12;
        newRec.name = name;
        newRec.sm = presentMonth;
        newRec.sy = presentYear;
        newRec.em = sm;
        newRec.ey = sy;
        break;
      case LENT:
        newRec.type = AssetType.F;
        newRec.subt = category;
        newRec.chg = rate;
        newRec.chgF = category === "BD" ? 4 : Number(subCat);
        newRec.name = name;
        newRec.sm = sm;
        newRec.sy = sy;
        newRec.em = em;
        newRec.ey = ey;
        break;
      case LTDEP:
        const { year, month } = calculateAddYears(sm, sy, 5);
        newRec.type = AssetType.F;
        newRec.subt = category;
        newRec.chg = rate;
        newRec.chgF = 1;
        newRec.name = name;
        newRec.sm = sm;
        newRec.sy = sy;
        newRec.em = category === NATIONAL_SAVINGS_CERTIFICATE ? month : em;
        newRec.ey = category === NATIONAL_SAVINGS_CERTIFICATE ? year : ey;
        break;
      case P2P:
        newRec.type = AssetType.F;
        newRec.subt = AssetSubType.P2P;
        newRec.chg = rate;
        newRec.chgF = Number(subCat);
        newRec.name = name;
        newRec.sm = sm;
        newRec.sy = sy;
        newRec.em = em;
        newRec.ey = ey;
        break;
      case NPS:
        newRec.subt = category;
        newRec.name = subCat;
        break;
      case PF:
        newRec.subt = category;
        newRec.chg = rate;
        newRec.chgF = 1;
        newRec.type = AssetType.F;
        newRec.sm = presentMonth;
        newRec.sy = presentYear;
        break;
      case VEHICLE:
        newRec.chg = 15;
        newRec.chgF = 1;
        newRec.type = AssetType.A;
        newRec.subt = category;
        newRec.sm = sm;
        newRec.sy = sy;
        newRec.name = name;
        break;
      case PM:
        newRec.type = AssetType.A;
        newRec.subt = category;
        newRec.name = subCat;
        break;
      case CRYPTO:
        newRec.type = AssetType.A;
        newRec.subt = AssetSubType.C;
        newRec.name = category;
        break;
      case OTHER:
        newRec.type = AssetType.A;
        newRec.subt = category;
        newRec.name = name;
        break;
      default:
        newRec.name = name;
        break;
    }
    if (childTab === PM || childTab === CRYPTO) {
      newRec.curr = "USD";
    }
    newRec.fId = memberKey;
    newRec.amt = amt;
    newRec.qty = qty;
    return newRec;
  };
  const changeStartMonth = (val: number) => {
    setSm(val);
    let rec = getNewRec();
    hasOnlyEnddate(childTab)
      ? category === "H"
        ? (rec.em = 0)
        : (rec.em = val)
      : (rec.sm = val);
    setInput(rec);
  };
  const changeStartYear = (val: number) => {
    setSy(val);
    let rec = getNewRec();
    hasOnlyEnddate(childTab)
      ? category === "H"
        ? (rec.ey = 0)
        : (rec.ey = val)
      : (rec.sy = val);
    setInput(rec);
  };
  const changeEndMonth = (val: number) => {
    setEm(val);
    let rec = getNewRec();
    rec.em = val;
    setInput(rec);
  };
  const changeEndYear = (val: number) => {
    setEy(val);
    let rec = getNewRec();
    rec.ey = val;
    setInput(rec);
  };
  const changeName = (val: string) => {
    setName(val);
    let rec = getNewRec();
    rec.name = val;
    setInput(rec);
  };
  const changeRate = (val: number) => {
    setRate(val);
    disableOk(val <= 0);
    let rec = getNewRec();
    rec.chg = val;
    setInput(rec);
  };
  const changeQty = (qty: number) => {
    setQty(qty);
    disableOk(qty <= 0);
    let rec = getNewRec();
    rec.qty = qty;
    setInput(rec);
  };
  const changeAmt = (amt: number) => {
    setAmt(amt);
    disableOk(amt <= 0);
    let rec = getNewRec();
    rec.amt = amt;
    setInput(rec);
  };

  const changeCategory = (value: any) => {
    setCategory(value);
    let rec = getNewRec();
    rec.subt === AssetSubType.C ? (rec.name = value) : (rec.subt = value);
    return rec;
  };

  const changeSubCat = (value: any) => {
    setSubCat(value);
    let rec = getNewRec();
    childTab === INS ? (rec.chgF = Number(value)) : (rec.name = value);
    setInput(rec);
  };

  const changeMember = (key: string) => {
    setMemberKey(key);
    let rec = getNewRec();
    rec.fId = key;
    setInput(rec);
  };

  const changeInterest = (value: string) => {
    setSubCat(value);
    let rec = getNewRec();
    rec.chgF = Number(value);
    setInput(rec);
  };

  useEffect(() => {
    if (childTab === PF || childTab === LTDEP) {
      setRate(getRateByCategory(category));
    }
  }, [category]);

  useEffect(() => {
    const valuation = calculateValuation(
      childTab,
      getNewRec(),
      userInfo,
      discountRate,
      ratesData,
      selectedCurrency,
      npsData
    );
    setValuation(valuation);
    const maturityAmt = calculateCompundingIncome(getNewRec()).maturityAmt;
    setMaturityAmt(maturityAmt);
  }, [
    amt,
    category,
    sm,
    sy,
    em,
    ey,
    rate,
    subCat,
    childTab,
    userInfo,
    discountRate,
    ratesData,
    selectedCurrency,
    npsData,
    qty,
  ]);

  const { Item: FormItem } = Form;

  return (
    <Form layout="vertical">
      <ResultCarousel
        results={
          childTab === P2P || childTab === LENT || childTab === LTDEP
            ? [
                <ItemDisplay
                  key="valuation"
                  label="Current Value"
                  result={valuation}
                  currency={selectedCurrency}
                  pl
                />,
                <ItemDisplay
                  label="Maturity Amount"
                  key="maturity"
                  result={maturityAmt}
                  currency={selectedCurrency}
                  pl
                />,
              ]
            : [
                <ItemDisplay
                  key="valuation"
                  label="Current Value"
                  result={valuation}
                  currency={selectedCurrency}
                  pl
                />,
              ]
        }
      />
      <Row
        gutter={[
          { xs: 0, sm: 0, md: 35 },
          { xs: 15, sm: 15, md: 15 },
        ]}>
        {categoryOptions && (
          <Col xs={24} md={12}>
            <FormItem label={fields.type}>
              <Col>
                <CascaderInput
                  pre={""}
                  parentValue={category}
                  parentChangeHandler={changeCategory}
                  childChangeHandler={
                    hasOnlyCategory(childTab) ? "" : changeSubCat
                  }
                  childValue={hasOnlyCategory(childTab) ? "" : subCat}
                  options={categoryOptions}
                />
              </Col>
            </FormItem>
          </Col>
        )}
        {(category === "NBD" || childTab === P2P) && (
          <Col xs={24} md={12}>
            <FormItem label={childTab === P2P ? fields.type : fields.subtype}>
              <Interest value={subCat} onChange={changeInterest} />
            </FormItem>
          </Col>
        )}
        {hasName(childTab) && (
          <Col xs={24} md={12}>
            <FormItem label={fields.name}>
              <TextInput
                pre=""
                value={name}
                changeHandler={changeName}
                size={"middle"}
              />
            </FormItem>
          </Col>
        )}
        {hasQtyWithRate(childTab) ? (
          <Col xs={24} md={12}>
            <FormItem label={fields.qty}>
              <QuantityWithRate
                quantity={qty}
                onChange={changeQty}
                subtype={category}
                name={subCat}
              />
            </FormItem>
          </Col>
        ) : (
          <Col xs={24} md={12}>
            <FormItem label={fields.amount}>
              <NumberInput
                pre=""
                value={amt}
                changeHandler={changeAmt}
                currency={selectedCurrency}
                min={1}
              />
            </FormItem>
          </Col>
        )}
        {hasPF(childTab) && (
          <Col xs={24} md={12}>
            <FormItem label={fields.qty}>
              <NumberInput
                pre=""
                value={qty}
                changeHandler={changeQty}
                currency={selectedCurrency}
              />
            </FormItem>
          </Col>
        )}
        {hasDate(childTab, category) && (
          <Col xs={24} md={12}>
            <FormItem label={fields.date}>
              <Row gutter={[10, 0]}>
                <Col>
                  <DateInput
                    title={""}
                    startMonthHandler={changeStartMonth}
                    startYearHandler={changeStartYear}
                    endMonthHandler={
                      isRangePicker(childTab, category)
                        ? changeEndMonth
                        : undefined
                    }
                    endYearHandler={
                      isRangePicker(childTab, category)
                        ? changeEndYear
                        : undefined
                    }
                    startMonthValue={sm}
                    endMonthValue={em}
                    startYearValue={sy}
                    endYearValue={ey}
                    size="middle"
                  />
                </Col>
              </Row>
            </FormItem>
          </Col>
        )}
        {(hasRate(childTab) || (category !== "L" && childTab === INS)) && (
          <Col xs={24} md={12}>
            <FormItem label={fields.rate}>
              <NumberInput
                pre={""}
                min={0}
                max={50}
                value={rate}
                changeHandler={changeRate}
                step={0.1}
                unit="%"
              />
            </FormItem>
          </Col>
        )}
        <Col xs={24} md={12}>
          <FormItem label="">
            <SelectInput
              pre={<UserOutlined />}
              value={memberKey}
              options={getFamilyOptions(allFamily)}
              changeHandler={(key: string) => changeMember(key)}
            />
          </FormItem>
        </Col>
      </Row>
    </Form>
  );
}
