import { useEffect, useRef } from "react";
import { Typography } from "antd";

export default function EconomicCalendar() {
  const { Title } = Typography;
  const scriptParent = useRef(null);
  const tradingviewSettings = {
    width: "100%",
    height: 600,
    colorTheme: "light",
    isTransparent: false,
    locale: "us",
    importanceFilter: "0,1",
    currencyFilter: "USD",
  };

  useEffect(() => {
    const scriptTag = document.createElement("script");
    scriptTag.type = "text/javascript";
    scriptTag.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-events.js";
    scriptTag.text = JSON.stringify(tradingviewSettings);
    scriptTag.async = true;
    /* @ts-ignore */
    scriptParent.current.appendChild(scriptTag);
  }, []);

  return (
    <>
      <Title level={5}>USA Economic Calendar</Title>
      <div ref={scriptParent}></div>
    </>
  );
}
