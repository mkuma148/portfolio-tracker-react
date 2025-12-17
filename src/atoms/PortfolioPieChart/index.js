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

// Colors for slices
const COLORS = ["#f7931a", "#627eea", "#00ffa3", "#8247e5", "#999999"];

const PortfolioPieChart = () => {
    const token = localStorage.getItem("token");
    const [activeIndex, setActiveIndex] = useState(null);
    const [tableLoading, setTableLoading] = useState(false);
    const [holdings, setHoldings] = useState([]);

    const fetchUserHoldings = useCallback(async (showTableLoader = false) => {
        try {
            if (showTableLoader) setTableLoading(true);
            const res = await fetch(
                "http://localhost:8080/api/wallets/user/holdings",
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );

            if (!res.ok) throw new Error("Failed to fetch holdings");

            const data = await res.json();
            setHoldings(data);
        } catch (err) {
            console.error("Fetch holdings error:", err);
        } finally {
            if (showTableLoader) setTableLoading(false);
        }
    }, [token]);

    console.log("holdings ", holdings);

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
                    paddingAngle={4}
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
                <Tooltip
                    formatter={(totalValue, coin) => [`${totalValue}$`, coin]}
                />
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

            </PieChart>
        </ResponsiveContainer>
    );
};

export default PortfolioPieChart;