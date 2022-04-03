import { Divider, List, Row } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../AppContext";
import ItemDisplay from "../calc/ItemDisplay";
import RadioInput from "../form/RadioInput";
import { toHumanFriendlyCurrency, toReadableNumber } from "../utils";

interface InvestmentAlertListProps {
  positives: Array<any>;
  negatives: Array<any>;
  positiveViewLabel: string;
  negativeViewLabel: string;
  footerLabel: string;
  isPrice?: boolean;
}

export default function InvestmentAlertList(props: InvestmentAlertListProps) {
  const { defaultCurrency }: any = useContext(AppContext);
  const [view, setView] = useState<string>(props.positiveViewLabel);

  useEffect(() => {
    setView(props.positiveViewLabel);
  }, [props.positiveViewLabel]);

  return (
    <List
      itemLayout="horizontal"
      dataSource={
        view === props.positiveViewLabel ? props.positives : props.negatives
      }
      header={
        <Row justify="center">
          <RadioInput
            options={[props.positiveViewLabel, props.negativeViewLabel]}
            value={view}
            changeHandler={setView}
          />
        </Row>
      }
      renderItem={(item: any) => (
        <>
          <ItemDisplay
            label={item.name}
            result={
              item.result > 0 &&
              props.isPrice &&
              view === props.negativeViewLabel
                ? -item.result
                : item.result
            }
            pl
            precise
            labelHighlight
            currency={props.isPrice ? defaultCurrency : ""}
            unit={!props.isPrice ? "%" : ""}
            footer={`${props.footerLabel} - ${
              props.isPrice
                ? toHumanFriendlyCurrency(item.value, defaultCurrency)
                : toReadableNumber(item.value)
            }`}
          />
          <Divider />
        </>
      )}
    />
  );
}
