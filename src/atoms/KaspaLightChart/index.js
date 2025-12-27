import React, { useEffect, useRef, useState } from "react";
import { createChart, AreaSeries } from "lightweight-charts";
import "./kaspalightchart.scss";

const TIMEFRAMES = [
    { label: "24H", days: 1 },
    { label: "7D", days: 7 },
    { label: "30D", days: 30 },
    { label: "90D", days: 90 },
    { label: "180D", days: 180 },
    { label: "1Y", days: 365 },
];

const CACHE_EXPIRY = 1 * 60 * 1000; // 🔹 1 minutes cache expiry

const KaspaLightChart = (props) => {
    const { coin } = props;
    const containerRef = useRef(null);
    const chartRef = useRef(null);
    const seriesRef = useRef(null);

    const [days, setDays] = useState(30);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false); // 🔹 New state for API error

    const [cachedData, setCachedData] = useState({}); // 🔹 { [days]: { data, timestamp } }
    const [retryIn, setRetryIn] = useState(0); // 🔹 countdown timer

    // const [activeCoin, setActiveCoin] = useState("kaspa");
    const [isRetrying, setIsRetrying] = useState(false);

    const loadChart = (coin) => {
        props.loadChildChart(coin);
    }

    useEffect(() => {
        if (!error || retryIn === 0) return;

        const timer = setInterval(() => {
            setRetryIn(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setError(false); // 🔹 hide message
                    setIsRetrying(false); // 🔹 parent buttons enable
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [error, retryIn]);



    useEffect(() => {
        const container = containerRef.current;
        if (!container || container.clientWidth === 0) return;

        if (!chartRef.current) {
            const chart = createChart(container, {
                width: container.clientWidth,
                height: 300,
                layout: {
                    background: { color: "#020617" },
                    textColor: "#a5b4fc",
                },
                grid: {
                    vertLines: { visible: false },
                    horzLines: { visible: false },
                },
                rightPriceScale: { visible: true, borderColor: "rgba(255,255,255,0.1)" },
                timeScale: { visible: true, borderColor: "rgba(255,255,255,0.1)" },
                crosshair: {
                    mode: 1,
                    horzLine: { visible: true, color: 'rgba(255,255,255,0.1)' },
                    vertLine: { visible: true, color: 'rgba(255,255,255,0.1)' }
                },
            });

            const areaSeries = chart.addSeries(AreaSeries, {
                lineColor: coin === "kaspa" ? "turquoise" : "orange",
                topColor: "green",
                bottomColor: coin === "kaspa" ? "turquoise" : "orange",
                lineWidth: 2,
                priceFormat: {
                    type: 'price',
                    precision: 4,
                    minMove: 0.0001,
                },
            });

            chartRef.current = chart;
            seriesRef.current = areaSeries;
        }

        const now = Date.now();
        const cacheEntry = cachedData[days];

        if (cacheEntry && now - cacheEntry.timestamp < CACHE_EXPIRY) {
            // 🔹 Use cached data if not expired
            seriesRef.current.setData(cacheEntry.data);
            chartRef.current.timeScale().fitContent();
            return;
        }

        // 🔹 Fetch fresh data
        setLoading(true);
        setError(false); // 🔹 Reset error before fetch
        fetch(`https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=${days}`)
            .then((res) => {
                if (!res.ok) throw new Error("API Error"); // 🔹 Handle HTTP errors
                return res.json();
            })
            .then((data) => {
                const formatted = data.prices.map((p) => ({
                    time: Math.floor(p[0] / 1000),
                    value: p[1],
                }));

                // 🔹 Update cache with timestamp
                setCachedData(prev => ({
                    ...prev,
                    [days]: { data: formatted, timestamp: Date.now() }
                }));

                seriesRef.current.setData(formatted);
                chartRef.current.timeScale().fitContent();
            })
            .catch((err) => {
                console.error(err);
                setError(true); // 🔹 Set error if fetch fails

                setRetryIn(CACHE_EXPIRY / 1000);
                setIsRetrying(true); // 🔹 parent buttons disable
            })
            .finally(() => setLoading(false));

    }, [days, cachedData, coin]);

    return (
        <div>
            <div style={{ marginBottom: "6px", color: "#94a3b8", fontSize: "13px" }}>
                {coin === "kaspa" ?
                    `Kaspa (KAS) · Last ${days} Days · USD` : `Bitcoin (BTC) · Last ${days} Days · USD`}
            </div>

            <div style={{ display: "flex", marginBottom: "8px" }}>
                {TIMEFRAMES.map((tf) => (
                    <button
                        key={tf.days}
                        onClick={() => !loading && setDays(tf.days)}
                        className={coin === "kaspa" ? `tf-button-kaspa ${days === tf.days ? 'active' : ''}` : `tf-button-bitcoin ${days === tf.days ? 'active' : ''}`}
                        disabled={loading || retryIn > 0}
                    >
                        {tf.label}
                    </button>
                ))}
                <div className="graph" style={{ display: "flex", gap: "10px", marginLeft: "auto" }}>
                    <button className={`coin-btn ${coin === "kaspa" ? "kaspa active" : "kaspa"}`} onClick={() => loadChart("kaspa")} disabled={isRetrying}>
                        Kaspa
                    </button>
                    <button className={`coin-btn ${coin === "bitcoin" ? "bitcoin active" : "bitcoin"}`} onClick={() => loadChart("bitcoin")} disabled={isRetrying}>
                        Bitcoin
                    </button>
                </div>
            </div>

            {loading && (
                <div style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "6px" }}>
                    Loading data...
                </div>
            )}

            <div
                ref={containerRef}
                style={{
                    width: "100%",
                    minHeight: "300px",
                    borderRadius: "14px",
                    overflow: "hidden",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                }}
            />
            {error && !loading && (
                <div style={{ color: "#f87171", fontSize: "13px", marginBottom: "6px" }}>
                    ⚠ Please wait until data refreshes... ({retryIn}s)
                </div>
            )}
        </div>
    );
};

export default KaspaLightChart;