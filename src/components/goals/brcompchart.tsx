import React, { useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
interface BRCompChartProps {
  data: Array<any>;
  currency?: string;
  sellAfter: number;
  rentAns: string;
  title: string;
  fullScreen: boolean;
}

export function BRCompChart(props: BRCompChartProps) {
  useEffect(() => {
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 500);
  }, [props.fullScreen]);

  const options = {
    title: {
      text: props.title,
    },
    xAxis: {
      categories: props.data[0].values.x,
    },
    credits: {
      enabled: false,
    },
    plotOptions: {
      areaspline: {
        fillOpacity: 0.1,
      },
    },
    tooltip: {
      shared: true,
    },
    series: [
      {
        name: props.data[0].name,
        data: props.data[0].values.y,
      },
      {
        name: props.data[1].name,
        data: props.data[1].values.y,
      },
    ],
    chart: {
      type: "areaspline",
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
