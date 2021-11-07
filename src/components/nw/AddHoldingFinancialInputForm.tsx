import React, { useReducer, useContext, useState } from "react";
import { Row, Col, Button, Select, Input, AutoComplete, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { getInstrumentDataWithKey, financialAssetTypes } from "./nwutils";
import { NWContext } from "./NWContext";

interface InstrumentsData {
  listInExchgs: [];
  listInBonds: [];
  listInMutuals: [];
}

interface Holding {
  qty: number;
  name: string;
  fIds: [];
  id: string;
  curr: string;
  subt: string;
}

interface DataState {
  assetType: string;
  familyMember: string;
  price: number;
  type: string;
  instrumentData: InstrumentsData;
  suggestions: [];
  buttonState: boolean;
}

interface OptionTableMap {
  [Stock: string]: string;
}

const optionTableMap: OptionTableMap = {
  Stock: "listInExchgs",
  "Gold Bond": "listInExchgs",
  ETF: "listInExchgs",
  Bond: "listInBonds",
  "Mutual Fund": "listInMutuals",
} as const;

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
          fIds: [],
          id: "",
          curr: "INR",
          subt: "",
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
          assetType: "",
          familyMember: "",
          type: "",
          price: 0,
          suggestions: [],
          buttonState: true,
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
  const { allFamily }: any = useContext(NWContext);
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const [rawDetails, setRawDetails] = useState<{}>({});
  const [holdingState, dispatch] = useReducer(holdingReducer, {
    qty: 0,
    name: "",
    fIds: [],
    id: "",
    curr: "INR",
    subt: "",
  });
  const { qty } = holdingState;
  const [dataState, dispatchDataState] = useReducer(dataReducer, {
    assetType: "",
    price: 0,
    familyMember: "",
    type: "",
    instrumentData: {
      listInExchgs: [],
      listInBonds: [],
      listInMutuals: [],
    },
    suggestions: [],
    buttonState: true,
  });
  const { instrumentData, suggestions, buttonState, assetType, familyMember } =
    dataState;
  const { Option } = Select;

  const onSearch = (searchText: any) => {
    const data = instrumentData[optionTableMap[assetType]]
      ? instrumentData[optionTableMap[assetType]].filter(
          (item: { value: string }) =>
            item.value.toLowerCase().includes(searchText.toLowerCase())
        )
      : [];
    dispatchDataState({ type: "formUpdate", data: { suggestions: data } });
  };

  const addToHoldings = () => {
    props.addToHoldings(holdingState, rawDetails);
    dispatch({ type: "reset", data: {} });
    dispatchDataState({ type: "reset", data: {} });
  };

  const getFilters = (option: string) => {
    switch (option) {
      case "Gold Bond":
        return { prop: "subt", value: "GoldB" };
      case "ETF":
        return { prop: "itype", value: "ETF" };
      default:
        return null;
    }
  };

  const updateOptions = async (option: string) => {
    setShowSpinner(true);
    const data = await getInstrumentDataWithKey(
      optionTableMap[option],
      getFilters(option)
    );
    const fetchedInstrumentData = Object.assign(instrumentData, {
      [optionTableMap[option]]: data,
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
        familyMember: "",
      },
    });
    setShowSpinner(false);
  };

  const updateButtonStatus = (data: {}) => {
    const toValidateArr = ["assetType", "familyMember", "qty", "name", "id"];
    const toValidateHoldingState = Object.assign(
      {},
      holdingState,
      dataState,
      data
    );
    const isAllItemFiled = toValidateArr.every((item) => {
      return toValidateHoldingState[item] && toValidateHoldingState[item].length > 0;
    });
    dispatchDataState({
      type: "dataUpdate",
      data: { buttonState: !isAllItemFiled },
    });
  };

  return (
    <Row gutter={[16, 16]}>
      <Col span={5}>
        <label htmlFor="assetType">Type</label> <br />
        <Select
          id="assetType"
          style={{ width: 130 }}
          onSelect={async (option: string) => {
            const data = { assetType: option };
            dispatchDataState({ type: "formUpdate", data });
            updateOptions(option);
            updateButtonStatus(data);
          }}
          value={assetType}
        >
          {financialAssetTypes.map((assetType) => (
            <Option key={assetType} value={assetType}>
              {assetType}
            </Option>
          ))}
        </Select>
      </Col>

      <Col span={6}>
        <label htmlFor="familyMember">Family member</label> <br />
        <Select
          id="familyMember"
          value={familyMember}
          style={{ width: 170 }}
          onSelect={async (option: string, details) => {
            const { value, fid } = details;
            dispatch({ type: "formUpdate", data: { fIds: [fid] } });
            dispatchDataState({
              type: "formUpdate",
              data: { familyMember: value },
            });
            updateButtonStatus({ familyMember: option });
          }}
        >
          {Object.keys(allFamily).map((item, key) => (
            <Option key={key} value={allFamily[item].name} fid={item}>
              {allFamily[item].name}
            </Option>
          ))}
        </Select>
      </Col>

      <Col span={3}>
        <label htmlFor="qty">Quantity</label> <br />
        <Input
          id="qty"
          value={qty}
          placeholder="Quanity"
          min={0}
          style={{ width: 80 }}
          onChange={(e) => {
            const data = { qty: e.target.value };
            dispatch({ type: "formUpdate", data });
            updateButtonStatus(data);
          }}
          type="number"
        />
      </Col>

      <Col span={8}>
        <label htmlFor="name">Name</label> <br />
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
            const { price, id, type, subt } = obj;
            dispatch({
              type: "formUpdate",
              data: { name: option, id, type, subt },
            });
            dispatchDataState({ type: "formUpdate", data: { price } });
            setRawDetails({ [id]: obj });
            updateButtonStatus({ name: option, id });
          }}
          value={holdingState.name}
          onSearch={onSearch}
        />
        {showSpinner && (
          <span style={{ position: "relative", top: "-30px", left: "9px" }}>
            <Spin>Loading...</Spin>
          </span>
        )}
      </Col>

      <Col span={2}>
        <label>&nbsp;</label> <br />
        <Button type="default" onClick={addToHoldings} disabled={buttonState}>
          <PlusOutlined />
        </Button>
      </Col>
    </Row>
  );
}
