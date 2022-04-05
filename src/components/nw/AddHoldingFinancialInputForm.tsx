import React, {
  useReducer,
  useContext,
  useState,
  useEffect,
  Fragment,
} from "react";
import {
  Row,
  Col,
  Button,
  AutoComplete,
  Spin,
  Input,
  Divider,
  Alert,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { getInstrumentDataWithKey } from "./nwutils";
import { NWContext, TAB } from "./NWContext";
import { AssetSubType, InstrumentInput, InsType, PurchaseInput } from "../../api/goals";
import DateInput from "../form/DateInput";

interface InstrumentsData {
  listInExchgPrices: [];
  listInBondPrices: [];
  listInmfPrices: [];
}

interface DataState {
  assetType: string;
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
  Stocks: "listInExchgPrices",
  "Gold Bonds": "listInExchgPrices",
  ETFs: "listInExchgPrices",
  Bonds: "listInBondPrices",
  "Mutual Funds": "listInmfPrices",
  REITs: "listInExchgPrices",
  "Other Investments": "listInExchgPrices",
} as const;

const holdingReducer = (
  holdingState: InstrumentInput,
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
          pur: [],
          avgp: 0,
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
  const { STOCK, GOLDB, BOND, REIT, OIT, ETF } = TAB;
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const [rawDetails, setRawDetails] = useState<{}>({});
  const today = new Date();
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
    pur: [],
    avgp: 0,
  });
  const { qty, pur, avgp, name } = holdingState;
  const [dataState, dispatchDataState] = useReducer(dataReducer, {
    assetType: "",
    price: 0,
    type: "",
    instrumentData: {
      listInExchgPrices: [],
      listInBondPrices: [],
      listInmfPrices: [],
    },
    suggestions: [],
    buttonState: true,
  });
  const { instrumentData, suggestions, buttonState, assetType } = dataState;
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
  };

  const getFilters = (option: string) => {
    switch (option) {
      case GOLDB:
        return { prop: "subt", value: AssetSubType.GoldB };
      case ETF:
        return { prop: "itype", value: InsType.ETF };
      case REIT:
        return { prop: "itype", value: InsType.REIT };
      case OIT:
        return { prop: "itype", value: InsType.InvIT };
      case STOCK:
        return { prop: "subt", value: AssetSubType.S };
      case BOND:
        return {
          prop: "subt",
          value: [AssetSubType.GB, AssetSubType.GBO, AssetSubType.CB],
        };
      default:
        return null;
    }
  };

  const updateOptions = async (option: string) => {
    setShowSpinner(true);
    let data = await getInstrumentDataWithKey(
      optionTableMap[option],
      getFilters(option)
    );
    if (option === STOCK)
      data = data.filter((item: any) => item.itype === null);
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
      },
    });
    setShowSpinner(false);
  };

  const updateButtonStatus = (data: {}) => {
    const toValidateArr = ["qty", "name"];
    const toValidateHoldingState = Object.assign(
      {},
      holdingState,
      dataState,
      data
    );
    const isAllItemFiled = toValidateArr.every(
      (item) => toValidateHoldingState[item]
    );
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

  const totalqty = () => {
    let totalqty = 0;
    pur.map((item: any) => (totalqty += Number(item.qty)));
    return totalqty;
  };

  return !showSpinner ? (
    <>
      <Row gutter={[8, 6]}>
        <Col xs={24} lg={8}>
          <label htmlFor="name">Name *</label>
          <br />
          <AutoComplete
            id="name"
            options={suggestions}
            style={{ width: 240 }}
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
        <Col xs={24} lg={4}>
          <label htmlFor="total-qty">Total Qty *</label> <br />
          <Input
            id="qty"
            value={qty}
            placeholder="Quantity"
            min={0}
            style={{ width: 120 }}
            onChange={(e) => {
              const data = { qty: e.target.value };
              dispatch({ type: "formUpdate", data });
              updateButtonStatus(data);
            }}
            type="number"
          />
        </Col>

        <Col xs={24} lg={4}>
          <label>Avg.Price</label> <br />
          <Input
            id="avgp"
            value={avgp}
            placeholder="Avg.Price"
            min={0}
            style={{ width: 120 }}
            onChange={(e) => {
              const data = { avgp: e.target.value };
              dispatch({ type: "formUpdate", data });
            }}
            type="number"
          />
        </Col>

        {!pur.length && (
          <Col xs={18} lg={6}>
            <label></label> <br />
            <Button
              disabled={!name || !qty}
              type="dashed"
              onClick={() => {
                pur.push({
                  day: 1,
                  month: today.getMonth() - 1,
                  year: today.getFullYear(),
                  amt: 0,
                  qty: qty,
                });
                const data = { pur: pur };
                dispatch({ type: "formUpdate", data });
              }}
            >
              Add Purchase Details
            </Button>
          </Col>
        )}

        <Col xs={6} lg={2}>
          <label></label> <br />
          <Button
            type="default"
            onClick={addToHoldings}
            disabled={buttonState}
            shape={"circle"}
            icon={<PlusOutlined />}
          />
        </Col>
      </Row>
      <Divider />

      <Row gutter={[8, 6]} key={`purchase`}>
        {pur.map((item: PurchaseInput, index: number) => {
          return (
            <Fragment key={`purchase-${index}`}>
              <Col xs={24}>
                <Row gutter={[8, 8]}>
                  <Col xs={12} lg={6}>
                    <label htmlFor="qty">Qty</label> <br />
                    <Input
                      id="purchase-qty"
                      value={item.qty}
                      placeholder="Quantity"
                      min={1}
                      style={{ width: 120 }}
                      onChange={(e) => {
                        item.qty = Number(e.target.value);
                        const data = { pur: pur };
                        dispatch({ type: "formUpdate", data });
                      }}
                      type="number"
                    />
                  </Col>
                  <Col xs={12} lg={6}>
                    <label htmlFor="amt">Amount</label> <br />
                    <Input
                      id="purchase-amt"
                      value={item.amt}
                      placeholder="Amount"
                      min={0}
                      style={{ width: 120 }}
                      onChange={(e) => {
                        item.amt = Number(e.target.value);
                        const data = { pur: pur };
                        dispatch({ type: "formUpdate", data });
                      }}
                      type="number"
                    />
                  </Col>
                  <Col xs={16} lg={6}>
                    <DateInput
                      title={"Date"}
                      startMonthHandler={(val: any) => {
                        item.month = Number(val);
                        const data = { pur: pur };
                        dispatch({ type: "formUpdate", data });
                      }}
                      startYearHandler={(val: any) => {
                        item.year = Number(val);
                        const data = { pur: pur };
                        dispatch({ type: "formUpdate", data });
                      }}
                      startDateHandler={(val: any) => {
                        item.day = Number(val);
                        const data = { pur: pur };
                        dispatch({ type: "formUpdate", data });
                      }}
                      startDateValue={item.day as number}
                      startMonthValue={item.month}
                      startYearValue={item.year}
                      size="middle"
                    />
                  </Col>
                  <Col xs={4} lg={3}>
                    <br />
                    {pur.length === index + 1 && (
                      <Button
                        type="dashed"
                        disabled={totalqty() === qty}
                        onClick={() => {
                          const totalQty = totalqty();
                          if (totalQty < qty) {
                            console.log(totalQty);
                            pur.push({
                              day: 1,
                              month: today.getMonth() - 1,
                              year: today.getFullYear(),
                              amt: 0,
                              qty: qty - totalQty,
                            });
                          }
                          const data = { pur: pur };
                          dispatch({ type: "formUpdate", data });
                        }}
                        shape="circle"
                        icon={<PlusOutlined />}
                      />
                    )}
                  </Col>
                  <Col xs={4} lg={3}>
                    <br />
                    {
                      <Button
                        type="link"
                        onClick={() => {
                          pur.splice(index, 1);
                          const data = { pur: pur };
                          dispatch({ type: "formUpdate", data });
                        }}
                        danger
                      >
                        <DeleteOutlined />
                      </Button>
                    }
                  </Col>
                </Row>
              </Col>
              <Divider />
            </Fragment>
          );
        })}
        {totalqty() > qty && (
          <Col xs={24}>
            <Alert
              type={"error"}
              message={"Total Purchase Qty cannot be greater then total qty"}
            />
          </Col>
        )}
      </Row>
    </>
  ) : (
    <Spin>Loading...</Spin>
  );
}
