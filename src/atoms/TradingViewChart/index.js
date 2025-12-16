import React, { useEffect } from "react";

const TradingViewChart = ({
  symbol = "KASUSDT",
  width = "100%",
  height = 500,
  interval = "60",
  widgetId = "tv_chart_container"
}) => {

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;

    script.onload = () => {
      if (window.TradingView) {
        new window.TradingView.widget({
          container_id: widgetId,
          width: width,
          height: height,
          symbol: symbol,
          interval: interval,
          timezone: "Etc/UTC",
          theme: "light",
          style: "1",
          locale: "en",
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          hide_top_toolbar: false,
          allow_symbol_change: true,
          save_image: false,
        });
      }
    };

    document.body.appendChild(script);

    // Cleanup
    return () => {
      const container = document.getElementById(widgetId);
      if (container) container.innerHTML = "";
    };
  }, [symbol, width, height, interval, widgetId]);

  return <div id={widgetId}></div>;
};

export default TradingViewChart;
