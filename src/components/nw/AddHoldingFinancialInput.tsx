import React, { useContext, useState, useEffect } from "react";
import { Row, Col, Button, Select, Input, AutoComplete, Divider } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { AppContext } from "../AppContext";
import { COLORS } from "../../CONSTANTS";
import { NWContext } from "./NWContext";
const financialAssetTypes = [
  "Stock",
  "Gold Bond",
  "ETF",
  "Bond",
  "Mutual Fund",
];

interface InitialObj {
  assetType: String;
  familyMember: String;
  assetName: String;
  quantity: number;
}

export default function AddHoldingFinancialInput(props: any) {
  const { allFamily }: any = useContext(NWContext);
  const { Option } = Select;

  const initialObj: InitialObj = {
    assetType: "",
    familyMember: "",
    assetName: "",
    quantity: 0,
  };
  let toAddObj: any = Object.assign({}, initialObj);
  let options = [
    {
      value: "a",
    },
    {
      value: "b",
    },
    {
      value: "c",
    },
  ];
  const [error, setError] = useState(false);
  const [assets, setAssets] = useState<InitialObj[]>([]);

  useEffect(() => {
    props.disableOk(!(assets.length > 0));
  }, []);

  const assetTypesOptions = financialAssetTypes.map((key) => {
    return (
      <Option key={key} value={key}>
        {key}
      </Option>
    );
  });

  const familyMembersOptions = Object.keys(allFamily).map((item, key) => {
    return (
      <Option key={key} value={allFamily[item].name}>
        {allFamily[item].name}
      </Option>
    );
  });

  const onSearch = (searchText: string) => {
    console.log(searchText)
    options = [
      {
        value: "b",
      },
      {
        value: "c",
      },
    ];
  };

  const addToAsset = () => {
    const isAllElementValid = Object.keys(toAddObj).every((item) => {
      const itemVal = toAddObj[item];
      return typeof itemVal === "string" ? itemVal.length > 0 : itemVal > 0;
    });
    if (!isAllElementValid) {
      setError(true);
      return;
    }

    assets.unshift(toAddObj);
    setAssets([...assets]);
    toAddObj = Object.assign({}, initialObj);
    shouldDisableOk();
    setError(false);
  };

  const shouldDisableOk = () => {
    props.disableOk(!(assets.length > 0));
  };

  const deleteFromAsset = (key: number) => {
    assets.splice(key, 1);
    setAssets([...assets]);
    shouldDisableOk();
  };

  const AssetInput = () => {
    return (
      <div>
        {error && (
          <h4 style={{ color: COLORS.RED }}>All Fields are mandatory</h4>
        )}
        <Row style={{ marginBottom: "10px" }} gutter={[16, 16]}>
          <Col span={5}>
            <label htmlFor="assetType">Type</label> <br />
            <Select
              id="assetType"
              onSelect={(option) => {
                toAddObj.assetType = option;
              }}
            >
              {assetTypesOptions}
            </Select>
          </Col>

          <Col span={4}>
            <label htmlFor="familyMember">Family member</label> <br />
            <Select
              id="familyMember"
              onSelect={(option) => {
                toAddObj.familyMember = option;
              }}
            >
              {familyMembersOptions}
            </Select>
          </Col>

          <Col span={8}>
            <label htmlFor="assetName">Name</label> <br />
            <AutoComplete
              id="assetName"
              options={options}
              style={{ width: 200 }}
              onSelect={(option) => {
                toAddObj.assetName = option;
              }}
              onSearch={onSearch}
              placeholder="input here"
            />
          </Col>

          <Col span={5}>
            <label htmlFor="quantity">Quantity</label> <br />
            <Input
              id="quantity"
              placeholder="Quanity"
              min={0}
              onChange={(e) => {
                toAddObj.quantity = e.target.value;
              }}
              type="number"
              defaultValue={0}
            />
          </Col>
          <Col span={2}>
            <label>&nbsp;</label> <br />
            <Button type="default" onClick={addToAsset}>
              <PlusOutlined />
            </Button>
          </Col>
        </Row>
      </div>
    );
  };

  const AssetRow = (props: { asset: any; key: number }) => {
    const { assetType, familyMember, assetName, quantity } = props.asset;
    return (
      <Row style={{ marginBottom: "10px" }} gutter={[16, 50]}>
        <Col span={5}>{assetType}</Col>
        <Col span={4}>{familyMember}</Col>
        <Col span={8}>{assetName}</Col>
        <Col span={5}>{quantity}</Col>
        <Col span={2}>
          <Button type="default" onClick={() => deleteFromAsset(props.key)}>
            <DeleteOutlined />
          </Button>
        </Col>
      </Row>
    );
  };

  return (
    <>
      <AssetInput />
      <Divider orientation="left"></Divider>
      {assets.map((asset, key) => (
        <AssetRow asset={asset} key={key} />
      ))}
    </>
  );
}
