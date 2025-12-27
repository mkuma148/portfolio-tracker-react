import React, { useCallback, useEffect, useState } from "react";
import "./portfoliopiechart.scss";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";
import { CircularProgress } from "@mui/material";
import AxiosService from "../../redux/helpers/interceptor";

// Colors for slices
const COLORS = ["#f7931a", "#627eea", "#2fd3c9", "#8247e5", "#999999"];

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const { coin, totalValue } = payload[0].payload;

        return (
            <div
                style={{
                    background: "rgba(15, 23, 42, 0.9)",
                    padding: "6px 10px",
                    borderRadius: "20px",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#fff",
                    whiteSpace: "nowrap",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
                }}
            >
                <span style={{ opacity: 0.85 }}>{coin}</span>
                <span style={{ margin: "0 6px", opacity: 0.4 }}>•</span>
                <span style={{ color: "#00ffa3" }}>
                    ${Number(totalValue).toLocaleString("en-US")}
                </span>
            </div>
        );
    }
    return null;
};

const PortfolioPieChart = () => {
    const [activeIndex, setActiveIndex] = useState(null);
    const [tableLoading, setTableLoading] = useState(false);
    const [holdings, setHoldings] = useState([]);

    const fetchUserHoldings = useCallback(async (showLoader = false) => {
        try {
            if (showLoader) setTableLoading(true);

            const data = await AxiosService.get("api/wallets/user/holdings");
            setHoldings(data);
        } catch (err) {
            console.error("Fetch holdings error:", err);
        } finally {
            if (showLoader) setTableLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUserHoldings(true);
    }, [fetchUserHoldings]);

    // Hover enter
    const onPieEnter = (_, index) => {
        setActiveIndex(index);
    };

    // Hover leave
    const onPieLeave = () => {
        setActiveIndex(null);
    };

    // Slice click
    const onPieClick = (holdings, index) => {
        console.log("Clicked slice:", holdings.name, "Value:", holdings.value);
        // Yahan tu table filter ya detailed view open kar sakta hai
    };

    // Total portfolio value
    const consolidatedAmount = holdings.reduce(
        (acc, coin) => acc + Number(coin.totalValue || 0),
        0
    ).toLocaleString("en-US");;

    const getFontSize = () => {
        if (consolidatedAmount.length > 12) return 14;
        if (consolidatedAmount.length > 9) return 16;
        return 20;
    };

    if (tableLoading) {
        return (
            <div
                style={{
                    height: "350px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <CircularProgress />
            </div>)
    }

    return (
        <ResponsiveContainer width="100%" height={350}>
            <PieChart tabIndex={-1}>
                {/* Donut Pie */}
                <Pie
                    data={holdings}
                    dataKey="totalValue"
                    nameKey="coin"
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={120}
                    paddingAngle={1}
                    activeIndex={activeIndex}
                    onMouseEnter={onPieEnter}
                    onMouseLeave={onPieLeave}
                    onClick={onPieClick}
                    tabIndex={-1}
                >
                    {holdings.map((entry, index) => (
                        <Cell
                            key={index}
                            fill={COLORS[index % COLORS.length]}
                            cursor="pointer"
                            stroke={activeIndex === index ? "#ffffffaa" : "none"} // hover border
                            strokeWidth={activeIndex === index ? 6 : 0}      // hover border width
                        />
                    ))}
                </Pie>

                {/* Tooltip */}
                <Tooltip content={CustomTooltip} />
                <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    iconType="square"
                    iconSize={12}
                    formatter={(totalValue) => (
                        <span style={{ marginLeft: 6 }}>{totalValue}</span>
                    )}
                />

                {/* Center Total Value */}
                <text
                    x="44%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={getFontSize()}
                    fontWeight="bold"
                >
                    {consolidatedAmount}$
                </text>
                <text
                    x="44%"
                    y="95%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={13}
                    letterSpacing="1.2px"
                    fill="#64748b"          // slate-gray (premium)
                    fontWeight="500"
                    opacity="0.85"
                >
                    Total Holdings
                </text>

            </PieChart>
        </ResponsiveContainer>
    );
};

export default PortfolioPieChart;