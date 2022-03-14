import { useState, useEffect } from "react";
import { DualAxes } from "@ant-design/plots";

export default function Chart({ options = {}, data, particulars }: any) {
  const [chartData, setChartData] = useState<any>([]);
  const generateChartData = () => {
    const linesData: any = [];
    const barsData: any = [];

    options.bars.map((key: string) => {
      for (const dataKey in data[key]) {
        if (dataKey !== "particulars")
          barsData.unshift({
            date: dataKey,
            value: data[key][dataKey],
            type: key,
          });
      }
    });

    options.lines.map((key: string) => {
      for (const dataKey in data[key]) {
        if (dataKey !== "particulars")
          linesData.unshift({
            date: dataKey,
            count: data[key][dataKey],
            name: key,
          });
      }
    });

    setChartData([barsData, linesData]);
  };

  useEffect(generateChartData, [data]);

  const dualConfig = {
    data: chartData,
    xField: "date",
    yField: ["value", "count"],
    legend: {
      itemName: {
        formatter: (text: string) => particulars[text].particulars.label,
      },
    },
    geometryOptions: [
      {
        geometry: "column",
        isGroup: true,
        seriesField: "type",
        columnWidthRatio: 0.2,
      },
      {
        geometry: "line",
        seriesField: "name",
      },
    ],
  };

  return chartData.length ? <DualAxes {...dualConfig} /> : null;
}
