import React, { useReducer, useContext, useState, useEffect } from "react";
import { Row, Col, Button, Input, AutoComplete, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { getInstrumentDataWithKey, optionTableMap } from "./nwutils";
import { NWContext, TAB } from "./NWContext";

interface InstrumentsData {
  Stocks: [];
  "Gold Bonds": [];
  ETFs: [];
  Bonds: [];
  "Mutual Funds": [];
  REITs: [];
  "Other Investments": [];
}

interface Holding {
  qty: number;
  name: string;
  sid: string;
  fId: string;
  id: string;
  curr: string;
  subt: string;
  exchg: string;
  type: string;
}

interface DataState {
  assetType: string;
  price: number;
  type: string;
  instrumentData: InstrumentsData;
  suggestions: [];
  buttonState: boolean;
}

const holdingReducer = (
  holdingState: Holding,
  { type, data }: { type: string; data: any }
) => {
  switch (type) {
    case "reset":
      return {
        ...holdingState,
        ...{
          qty: 0,
          name: "",
          fId: "",
          id: "",
          sid: "",
          curr: "INR",
          subt: "",
          exchg: "",
          type: "",
        },
      };
    default:
      return {
        ...holdingState,
        ...data,
      };
  }
};
const dataReducer = (
  dataState: DataState,
  { type, data }: { type: string; data: any }
) => {
  switch (type) {
    case "reset":
      return {
        ...dataState,
        ...{
          instrumentData: {},
          suggestions: [],
          buttonState: false,
          assetType: "",
          type: "",
          price: 0,
        },
      };
    default:
      return {
        ...dataState,
        ...data,
      };
  }
};
export default function HoldingInput(props: any) {
  const { childTab }: any = useContext(NWContext);
  const { STOCK } = TAB;
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const [rawDetails, setRawDetails] = useState<{}>({});
  const [holdingState, dispatch] = useReducer(holdingReducer, {
    qty: 0,
    name: "",
    fId: "",
    id: "",
    sid: "",
    curr: "INR",
    subt: "",
    exchg: "",
    type: "",
  });
  const { qty } = holdingState;
  const [dataState, dispatchDataState] = useReducer(dataReducer, {
    assetType: "",
    price: 0,
    type: "",
    instrumentData: {
      Stocks: [],
      "Gold Bonds": [],
      ETFs: [],
      Bonds: [],
      "Mutual Funds": [],
      REITs: [],
      "Other Investments": [],
    },
    suggestions: [],
    buttonState: true,
  });
  const { instrumentData, suggestions, buttonState, assetType } = dataState;

  const onSearch = (searchText: any) => {
    const data = instrumentData[assetType]
      ? instrumentData[assetType].filter(
          (item: { value: string }) =>
            item.value.toLowerCase().includes(searchText.toLowerCase())
        )
      : [];
    dispatchDataState({ type: "formUpdate", data: { suggestions: data } });
  };
  const addToHoldings = () => {
    props.addToHoldings(holdingState, rawDetails);
    dispatch({ type: "reset", data: {} });
  };

  const updateOptions = async (option: string) => {
    setShowSpinner(true);
    let data = await getInstrumentDataWithKey(optionTableMap[option], option);
    if (option === STOCK)
      data = data.filter((item: any) => item.itype === null);
    const fetchedInstrumentData = Object.assign(instrumentData, {
      [option]: data,
    });
    // required value prop to render in auto suggestions
    data.forEach(
      (item: { value: string; name: string }) => (item.value = item.name)
    );
    dispatch({ type: "formUpdate", data: { name: "", qty: 0 } });
    dispatchDataState({
      type: "dataUpdate",
      data: {
        instrumentData: Object.assign({}, fetchedInstrumentData),
        suggestions: data,
      },
    });
    setShowSpinner(false);
  };

  const updateButtonStatus = (data: {}) => {
    const toValidateArr = ["qty", "name", "id"];
    const toValidateHoldingState = Object.assign(
      {},
      holdingState,
      dataState,
      data
    );
    const isAllItemFiled = toValidateArr.every((item) => {
      return toValidateHoldingState[item];
    });
    dispatchDataState({
      type: "dataUpdate",
      data: { buttonState: !isAllItemFiled },
    });
  };
  const changeAssetType = (option: string) => {
    const data = { assetType: option };
    dispatchDataState({ type: "formUpdate", data });
    updateOptions(option);
    updateButtonStatus(data);
  };
  useEffect(() => {
    dispatchDataState({ type: "reset", data: {} });
    changeAssetType(childTab);
  }, [childTab]);

  return !showSpinner ? (
    <Row gutter={[16, 16]}>
      <Col flex={8}>
        <label htmlFor="name">Name</label>
        <br />
        <AutoComplete
          id="name"
          options={suggestions}
          style={{ width: 230 }}
          onChange={(option) => {
            const data = { name: option };
            dispatch({ type: "formUpdate", data });
            dispatchDataState({
              type: "dataUpdate",
              data: { buttonState: true },
            });
          }}
          onSelect={(option, obj) => {
            const { price, id, type, sid, exchg, subt } = obj;
            dispatch({
              type: "formUpdate",
              data: { name: option, id, type, subt, sid, exchg },
            });
            dispatchDataState({ type: "formUpdate", data: { price } });
            setRawDetails({ [id]: obj });
            updateButtonStatus({ name: option, id });
          }}
          value={holdingState.name}
          onSearch={onSearch}
        />
      </Col>

      <Col flex={3}>
        <label htmlFor="qty">Quantity</label> <br />
        <Input
          id="qty"
          value={qty}
          placeholder="Quantity"
          min={0}
          style={{ width: 80 }}
          onChange={(e) => {
            const data = { qty: Number(e.target.value) };
            dispatch({ type: "formUpdate", data });
            updateButtonStatus(data);
          }}
          type="number"
        />
      </Col>

      <Col flex={2}>
        <label>&nbsp;</label> <br />
        <Button
          type="default"
          onClick={addToHoldings}
          disabled={buttonState}
          shape={"circle"}
          icon={<PlusOutlined />}
        />
      </Col>
    </Row>
  ) : (
    <Spin>Loading...</Spin>
  );
}
