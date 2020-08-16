import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
interface LineChartProps {
  cfs: Array<number>;
  startYear: number;
  fullScreen: boolean;
}

export default function LineChart(props: LineChartProps) {
  const [years, setYears] = useState<Array<number>>([]);

  useEffect(() => {
    let years = [];
    for (let i = 0; i < props.cfs.length; i++) years.push(props.startYear + i);
    setYears([...years]);
  }, [props.cfs, props.startYear]);

  useEffect(() => {
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 500);
  }, [props.fullScreen]);

  const options = {
    title: {
      text: "Cash Flow Chart",
    },
    xAxis: {
      categories: years,
    },
    constructorType: "chart",
    series: [
      {
        name: '',
        data: props.cfs,
      },
    ],
    chart: {
      type: "line",
      zoomType: "x",
      panning: true,
      panKey: "shift",
    },
  };
  return (
    <div className="w-full">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}
