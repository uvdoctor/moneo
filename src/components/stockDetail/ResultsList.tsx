import { Table, Typography, Row, Col, Card } from "antd";
import { useFullScreenBrowser } from "react-browser-hooks";
import { isMobileDevice } from "../utils";

export default function ResultsList({ data, columns }: any) {
  const fsb = useFullScreenBrowser();
  const { Text } = Typography;

  return isMobileDevice(fsb) ? (
    <Card>
      {/* @ts-ignore */}
      {data.map(({ particulars, ...rest }: any, i) => (
        <div key={i} style={{ paddingBottom: "15px" }}>
          <Text strong>{particulars.label}</Text>
          {Object.keys(rest)
            .slice(0, 5)
            .map((key) => {
              return (
                <Row key={key} gutter={[10, 10]}>
                  <Col xs={12} sm={6}>
                    <Text>{key}</Text>
                  </Col>
                  <Col style={{ textAlign: "right" }} xs={12} sm={6}>
                    <Text>{rest[key]}</Text>
                  </Col>
                </Row>
              );
            })}
        </div>
      ))}
    </Card>
  ) : (
    <Table
      columns={columns}
      dataSource={data}
      pagination={false}
      rowKey={"" + Math.random()}
    />
  );
}
