import { Card, Typography } from "antd";
import CheckableTag from "antd/lib/tag/CheckableTag";
import React from "react";

interface CardViewProps {
  title: string;
  activeTag: string;
  activeTagHandler: Function;
  tags: Array<string>;
  children: any;
}

export default function CardView(props: CardViewProps) {
  const { Title } = Typography;
  return (
    <>
      <Title level={5}>{props.title}</Title>
      <Card style={{ width: "100%", height: 600 }}>
        <p>
          {props.tags.map((key: string) => (
            <CheckableTag
              key={key}
              checked={props.activeTag === key}
              style={{ fontSize: "15px" }}
              onChange={(checked: boolean) =>
                checked ? props.activeTagHandler(key) : null
              }>
              {key}
            </CheckableTag>
          ))}
        </p>
        {props.children}
      </Card>
    </>
  );
}
