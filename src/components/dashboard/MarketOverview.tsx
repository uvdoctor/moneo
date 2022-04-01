import { useEffect, useRef } from "react";
import { Typography } from "antd";

export default function MarketOverview() {
  const { Title } = Typography;
  const scriptParent = useRef(null);
  const tradingviewSettings = {
    colorTheme: "light",
    dateRange: "12M",
    showChart: true,
    locale: "in",
    width: "100%",
    height: 600,
    largeChartUrl: "",
    isTransparent: false,
    showSymbolLogo: false,
    showFloatingTooltip: false,
    plotLineColorGrowing: "rgba(41, 98, 255, 1)",
    plotLineColorFalling: "rgba(41, 98, 255, 1)",
    gridLineColor: "rgba(240, 243, 250, 0)",
    scaleFontColor: "rgba(120, 123, 134, 1)",
    belowLineFillColorGrowing: "rgba(41, 98, 255, 0.12)",
    belowLineFillColorFalling: "rgba(41, 98, 255, 0.12)",
    belowLineFillColorGrowingBottom: "rgba(41, 98, 255, 0)",
    belowLineFillColorFallingBottom: "rgba(41, 98, 255, 0)",
    symbolActiveColor: "rgba(41, 98, 255, 0.12)",
    tabs: [
      {
        title: "Indices",
        symbols: [
          {
            s: "CAPITALCOM:NIFTY50",
            d: "Nifty 50",
          },
          {
            s: "BSE:SENSEX",
            d: "BSE Sensex",
          },
          {
            s: "FOREXCOM:SPXUSD",
            d: "S&P 500",
          },
          {
            s: "FOREXCOM:DJI",
            d: "Dow Jones 30",
          },
        ],
        originalTitle: "Indices",
      },
      {
        title: "Forex",
        symbols: [
          {
            s: "FX_IDC:USDINR",
          },
          {
            s: "FX_IDC:EURINR",
          },
          {
            s: "FX_IDC:GBPINR",
          },
          {
            s: "FX_IDC:AUDINR",
          },
        ],
        originalTitle: "Forex",
      },
    ],
  };

  useEffect(() => {
    const scriptTag = document.createElement("script");

    scriptTag.type = "text/javascript";
    scriptTag.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
    scriptTag.text = JSON.stringify(tradingviewSettings);
    scriptTag.async = true;
    /* @ts-ignore */
    scriptParent.current.appendChild(scriptTag);
  }, []);

  return (
    <>
      <Title level={5}>Market Overview</Title>
      <div ref={scriptParent}></div>
    </>
  );
}
