import React from "react";

const TradingViewAdvancedChart = ({
  symbol = "MEXC:KASUSDT",
  interval = "60",
  theme = "light",
  height = 600,
}) => {
  const src = `https://www.tradingview.com/widgetembed/?frameElementId=tradingview_advanced
    &symbol=${symbol}
    &interval=${interval}
    &hidesidetoolbar=0
    &symboledit=1
    &saveimage=1
    &toolbarbg=f1f3f6
    &studies=[]
    &theme=${theme}
    &style=1
    &timezone=Etc/UTC
    &locale=en`;

  return (
    <iframe
      title="TradingView Advanced Chart"
      src={src}
      style={{
        width: "100%",
        height: height,
        border: "none",
      }}
      allowFullScreen
    />
  );
};

export default TradingViewAdvancedChart;
