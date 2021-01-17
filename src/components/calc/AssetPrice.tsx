import React, { useContext } from "react";
import Section from "../form/section";
import SelectInput from "../form/selectinput";
import { IAContext } from "./IAContext";
import { Button } from "antd";

export default function AssetPrice() {
  const { assetName, setAssetName }: any = useContext(IAContext);
  const getPrice = () => {
    console.log("Succesful");
  }
  return (
    <Section title="Look up Stock price">
      <SelectInput
        pre="Select stock"
        value={assetName}
        changeHandler={setAssetName}
        options={{
          GOOG: "Google",
          APPL: "Apple",
        }}
        info="Select stock that you want to analyze."
      />
      <Button onClick = {getPrice}>Test API</Button>
    </Section>
  );
}
