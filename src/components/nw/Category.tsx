import React, { useContext, useEffect, useState } from "react";
import { NWContext, TAB } from "./NWContext";
import CascaderInput from "../form/CascaderInput";
import { getRateByCategory, hasOnlyCategory, hasRisktab } from "./nwutils";
import CryptoTypeahead from "./CryptoTypeAhead";
interface CategoryProps {
  category?: string;
  categoryOptions: any;
  subCategory?: string;
  record: any;
  changeData: Function;
  data?: Array<any>;
  setRate?: Function;
  setCategory?: Function;
  setSubCat?: Function;
  pre?: string;
  info?: string;
  post?: any;
}

export default function Category({
  categoryOptions,
  category,
  subCategory,
  record,
  changeData,
  data,
  setRate,
  setCategory,
  setSubCat,
  pre,
  info,
  post,
}: CategoryProps) {
  const { childTab }: any = useContext(NWContext);
  const { CRYPTO, LTDEP, PF, P2P, LENT, PROP } = TAB;
  const isListHolding: boolean = setCategory && category ? false : true;
  const parent =
    isListHolding && record
      ? hasRisktab(childTab)
        ? record.chgF
        : childTab === PROP
        ? record.type
        : childTab === P2P
        ? record.chgF
        : record.subt
      : category;

  const child = hasOnlyCategory(childTab)
    ? ""
    : isListHolding
    ? childTab === LENT
      ? record.chgF
      : record.name
    : subCategory;
  const [parentValue, setParentValue] = useState<string>(parent);
  const [childValue, setChildValue] = useState<string>(child);

  const type = isListHolding ? record.subt : parentValue;

  useEffect(() => {
    setParentValue(parent);
    setChildValue(child);
  }, [record, childTab]);

  const changeCategory = (value: any) => {
    setCategory && setCategory(value);
    if (childTab === PROP) {
      record.type = value;
    } else {
      childTab === P2P || hasRisktab(childTab)
        ? (record.chgF = Number(value))
        : (record.subt = value);
    }
    isListHolding && data ? changeData([...data]) : changeData(record);
  };

  const changeCryptoCategory = (value: any) => {
    setCategory && setCategory(value);
    record.name = value;
    isListHolding && data ? changeData([...data]) : changeData(record);
  };

  const changeSubCategory = (value: any) => {
    setSubCat && setSubCat(value);
    childTab === LENT ? (record.chgF = Number(value)) : (record.name = value);
    isListHolding && data ? changeData([...data]) : changeData(record);
  };

  useEffect(() => {
    if (childTab === LTDEP || childTab === PF) {
      const rate = getRateByCategory(String(record.subt));
      if (isListHolding) {
        record.chg = rate;
      } else {
        setRate && setRate(rate);
      }
    }
  }, [type]);

  return childTab === CRYPTO ? (
    <CryptoTypeahead
      info={info as string}
      label={pre as string}
      changehandler={changeCryptoCategory}
      codeValue={isListHolding ? record.name : ''}
    />
  ) : (
    <CascaderInput
      parentValue={String(parentValue)}
      childValue={hasOnlyCategory(childTab) ? "" : String(childValue)}
      childChangeHandler={hasOnlyCategory(childTab) ? "" : changeSubCategory}
      parentChangeHandler={changeCategory}
      options={categoryOptions}
      pre={pre}
      info={info}
      width={childTab === PROP ? 150 : undefined}
      post={post}
    />
  );
}
