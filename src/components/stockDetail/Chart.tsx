import { useState, useEffect } from "react";
import { Column } from "@ant-design/plots";
import { Row, Col, Button } from "antd";

export default function Chart({ options = [], data, particulars }: any) {
  const [selectedOption, setOption] = useState(options[0]);
  const [chartData, setChartData] = useState([]);
  const paletteSemanticRed = "#F4664A";
  const brandColor = "#5B8FF9";
  const config = {
    /* @ts-ignore */
    data: chartData,
    xField: "date",
    yField: "value",
    seriesField: "",
    color: ({ date }: any) => {
      if (date == "Sept 2021" || date == "Sept 2020") {
        return paletteSemanticRed;
      }

      return brandColor;
    },
    legend: false,
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
  };
  const generateChartData = () => {
    let tempData = {
      ...data[selectedOption],
    };

    delete tempData.particulars;

    tempData = Object.keys(tempData).map((key) => ({
      date: key,
      value: tempData[key],
    }));

    setChartData(tempData);
  };

  useEffect(generateChartData, [selectedOption, data]);

  return chartData.length ? (
    <>
      <Row gutter={[10, 0]}>
        {options.map((option: string) => (
          <Col key={option}>
            <Button
              type={option === selectedOption ? "primary" : "default"}
              shape="round"
              onClick={() => setOption(option)}
            >
              {particulars[option].particulars}
            </Button>
          </Col>
        ))}
      </Row>
      <Column {...config} />
    </>
  ) : null;
}
