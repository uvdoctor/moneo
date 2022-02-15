import { Row, Col } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { AssetSubType, AssetType, HoldingInput } from "../../api/goals";
import ItemDisplay from "../calc/ItemDisplay";
import ResultCarousel from "../ResultCarousel";
import { presentMonth, presentYear } from "../utils";
import Amount from "./Amount";
import Category from "./Category";
import Comment from "./Comment";
import Contribution from "./Contribution";
import DateColumn from "./DateColumn";
import {
  LIABILITIES_TAB,
  NATIONAL_SAVINGS_CERTIFICATE,
  NWContext,
  RISK_TAB,
  TAB,
} from "./NWContext";
import {
  hasDate,
  hasName,
  hasPF,
  hasRate,
  hasOnlyCategory,
  calculateValuation,
  hasOnlyEnddate,
} from "./nwutils";
import Rate from "./Rate";
import { calculateAddYears, calculateCompundingIncome } from "./valuationutils";
interface AddHoldingInputProps {
  setInput: Function;
  disableOk: Function;
  categoryOptions: any;
  fields: any;
  defaultRate: number;
  info: any;
}
export default function AddHoldingInput({
  setInput,
  categoryOptions,
  fields,
  defaultRate,
  info,
}: AddHoldingInputProps) {
  const { childTab, selectedCurrency, npsData, activeTab, fxRates }: any =
    useContext(NWContext);
  const {
    PM,
    CRYPTO,
    LENT,
    NPS,
    PF,
    VEHICLE,
    LOAN,
    OTHER,
    P2P,
    LTDEP,
    LIFE_INS,
    HEALTH_INS,
    VEHICLE_INS,
    OTHERS_INS,
    PROPERTY_INS
  } = TAB;
  const [category, setCategory] = useState<string>(
    categoryOptions ? categoryOptions.length && categoryOptions[0].value : ""
  );
  const [subCat, setSubCat] = useState<string>(
    categoryOptions && !hasOnlyCategory(childTab)
      ? categoryOptions.length && categoryOptions[0].children[0].value
      : category === "NBD" || childTab === P2P
      ? "0"
      : ""
  );
  const [name, setName] = useState<string>("");
  const [qty, setQty] = useState<number>(0);
  const [rate, setRate] = useState<number>(defaultRate);
  const [sm, setSm] = useState<number>(presentMonth);
  const [em, setEm] = useState<number>(presentMonth);
  const [sy, setSy] = useState<number>(
    childTab === VEHICLE
      ? presentYear - 5
      : hasOnlyEnddate(childTab)
      ? presentYear + 2
      : presentYear
  );
  const [ey, setEy] = useState<number>(presentYear + 2);
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
      case HEALTH_INS:
      case LIFE_INS:
      case VEHICLE_INS:
      case OTHERS_INS:  
      case PROPERTY_INS:
        newRec.chg = childTab !== LIFE_INS ? rate : 0;
        newRec.chgF = Number(category);
        newRec.subt = childTab.charAt(0);
        newRec.sm = presentMonth;
        newRec.sy = presentYear;
        newRec.em = childTab !== HEALTH_INS ? sm : 0;
        newRec.ey = childTab !== HEALTH_INS ? sy : 0;
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
        newRec.chgF = Number(subCat);
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
        newRec.chgF = Number(category);
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
    if (childTab === PM) {
      newRec.curr = "USD";
    }
    newRec.amt = amt;
    newRec.qty = qty;
    return newRec;
  };

  useEffect(() => {
    calculateValuation(
      childTab,
      getNewRec(),
      selectedCurrency,
      npsData,
      fxRates
    )
      .then((valuation) => setValuation(valuation))
      .catch(() => setValuation(0));
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
    selectedCurrency,
    npsData,
    qty,
  ]);

  return (
    <Row gutter={[0, 10]}>
      {activeTab !== RISK_TAB ? <Col xs={24}>
        <Row justify="center">
          <Col xs={24} sm={24}>
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
                        result={
                          activeTab === LIABILITIES_TAB ? -valuation : valuation
                        }
                        currency={selectedCurrency}
                        pl
                      />,
                    ]
              }
            />
          </Col>
        </Row>
      </Col> : null }
      <Col xs={24}>
        <Row
          gutter={[
            { xs: 0, sm: 0, md: 35 },
            { xs: 15, sm: 15, md: 15 },
          ]}
        >
          {categoryOptions && (
            <Col xs={24} md={12}>
              <Category
                pre={fields.type}
                categoryOptions={categoryOptions}
                category={category}
                subCategory={subCat}
                record={getNewRec()}
                changeData={setInput}
                setRate={setRate}
                setCategory={setCategory}
                setSubCat={setSubCat}
                info={info.type}
              />
            </Col>
          )}
          <Col xs={24} md={12}>
            <Amount
              qty={qty}
              amt={amt}
              setAmt={setAmt}
              setQty={setQty}
              changeData={setInput}
              record={getNewRec()}
              fields={fields}
              info={info}
            />
          </Col>
          {hasPF(childTab) && (
            <Col xs={24} md={12}>
              <Contribution
                changeData={setInput}
                record={getNewRec()}
                pre={fields.qty}
                qty={qty}
                setQty={setQty}
                info={info.qty}
              />
            </Col>
          )}
          {hasDate(childTab) && (
            <Col xs={24} md={12}>
              <DateColumn
                changeData={setInput}
                record={getNewRec()}
                pre={fields.date}
                info={info.date}
                sm={sm}
                sy={sy}
                ey={ey}
                em={em}
                setEm={setEm}
                setEy={setEy}
                setSm={setSm}
                setSy={setSy}
              />
            </Col>
          )}
          {hasRate(childTab) && (
            <Col xs={24} md={12}>
              <Rate
                changeData={setInput}
                record={getNewRec()}
                pre={fields.rate}
                info={info.rate}
                rate={rate}
                setRate={setRate}
              />
            </Col>
          )}
          {hasName(childTab) && (
            <Col xs={24} md={12}>
              <Comment
                changeData={setInput}
                record={getNewRec()}
                pre={fields.name}
                name={name}
                setName={setName}
              />
            </Col>
          )}
        </Row>
      </Col>
    </Row>
  );
}
