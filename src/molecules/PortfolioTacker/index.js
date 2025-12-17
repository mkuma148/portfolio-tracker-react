import React, { useEffect, useState, useCallback } from "react";
import "./portfoliotracker.scss";
import AddIcon from "@mui/icons-material/Add";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {
    Container,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Autocomplete,
    CircularProgress,
} from "@mui/material";
import AxiosService from "../../redux/helpers/interceptor";

// Static coin list
const coinOptions = [
    { name: "Bitcoin", symbol: "BTC" },
    { name: "Ethereum", symbol: "ETH" },
    { name: "Kaspa", symbol: "KAS" },
];

const PortfolioTracker = () => {
    const token = localStorage.getItem("token");

    const [holdings, setHoldings] = useState([]);
    const [selectedCoin, setSelectedCoin] = useState(null);
    const [quantity, setQuantity] = useState("");
    const [tableLoading, setTableLoading] = useState(false);
    const [adding, setAdding] = useState(false);
    const [buyFee, setBuyFee] = useState("");

    // 🔥 default: Total Value ↓
    const [orderBy, setOrderBy] = useState("totalValue");
    const [order, setOrder] = useState("desc");
    const [search, setSearch] = useState("");

    // ===============================
    // FETCH HOLDINGS
    // ===============================
    const fetchUserHoldings = useCallback(async (showLoader = false) => {
        try {
            if (showLoader) setTableLoading(true);

            const res = await AxiosService.get(
                "api/wallets/user/holdings",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!res.ok) throw new Error("Fetch failed");

            const data = await res.json();
            setHoldings(data);
        } catch (err) {
            console.error(err);
        } finally {
            if (showLoader) setTableLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchUserHoldings(true);

        const interval = setInterval(() => {
            fetchUserHoldings(false);
        }, 60 * 1000);

        return () => clearInterval(interval);
    }, [fetchUserHoldings]);

    // ===============================
    // ADD COIN
    // ===============================
    const addCoin = async () => {
        if (!selectedCoin || !quantity) return;

        try {
            setAdding(true);

            const res = await AxiosService.post("api/holdings/add", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    symbol: selectedCoin.symbol,
                    quantity: Number(quantity),
                    buyFee: buyFee ? Number(buyFee) : 0
                }),
            });

            if (!res.ok) throw new Error("Add failed");

            await fetchUserHoldings(false);
            setSelectedCoin(null);
            setQuantity("");
            setBuyFee("");
        } catch (err) {
            alert("Backend error");
        } finally {
            setAdding(false);
        }
    };

    // ===============================
    // TOTALS
    // ===============================
    const totalPortfolioValue = holdings.reduce(
        (sum, h) => sum + (Number(h.totalValue) || 0),
        0
    );

    const totalInvestedValue = holdings.reduce(
        (sum, h) => sum + (Number(h.investedValue) || 0),
        0
    );

    const totalPnL = totalPortfolioValue - totalInvestedValue;

    // ===============================
    // SORTING LOGIC
    // ===============================
    const handleSort = (column) => {
        if (orderBy === column) {
            setOrder(order === "asc" ? "desc" : "asc");
        } else {
            setOrderBy(column);
            setOrder("asc");
        }
    };

    const sortedHoldings = orderBy
        ? [...holdings].sort((a, b) => {
            const valA = a[orderBy];
            const valB = b[orderBy];

            if (typeof valA === "number") {
                return order === "asc" ? valA - valB : valB - valA;
            }

            return order === "asc"
                ? String(valA).localeCompare(String(valB))
                : String(valB).localeCompare(String(valA));
        })
        : holdings;

    const renderSortArrow = (column) => {
        if (orderBy !== column) return null;
        return order === "asc" ? " 🔼" : " 🔽";
    };

    const filteredHoldings = sortedHoldings.filter((h) =>
        h.coin.toLowerCase().includes(search.toLowerCase())
    );

    // ===============================
    // UI
    // ===============================
    return (
        <Container className="portfolio-page" style={{ marginTop: 50 }}>
            <h2>Crypto Portfolio Tracker</h2>

            <div
                className="portfolio-form"
                style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    marginBottom: 16,
                    flexWrap: "wrap",
                }}
            >
                <Autocomplete
                    options={coinOptions}
                    getOptionLabel={(o) => `${o.name} (${o.symbol})`}
                    value={selectedCoin}
                    onChange={(e, val) => setSelectedCoin(val)}
                    renderInput={(params) => (
                        <TextField {...params} label="Select Coin" size="small" />
                    )}
                    style={{ width: 220 }}
                />

                <TextField
                    label="Quantity"
                    type="number"
                    size="small"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    style={{ width: 120 }}
                />

                <TextField
                    label="Buy Fee (USD)"
                    type="number"
                    size="small"
                    value={buyFee}
                    onChange={(e) => setBuyFee(e.target.value)}
                    style={{ width: 140 }}
                    // helperText="Optional"
                />

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={addCoin}
                    disabled={adding}
                    style={{ height: 40 }}
                >
                    {adding ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : "Add"}
                </Button>
            </div>

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 20,
                    gap: 16,
                    flexWrap: "wrap",
                }}
            >
                <TextField
                    label="Search coin..."
                    variant="outlined"
                    size="small"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ width: 220 }}
                />

                <div className="portfolio-total-bar" style={{ display: "flex", gap: 24 }}>
                    <div>
                        <div style={{ fontSize: 12, color: "#7f8c8d" }}>Total Value</div>
                        <div style={{ fontWeight: 600 }}>
                            ${totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                    </div>

                    <div>
                        <div style={{ fontSize: 12, color: "#7f8c8d" }}>Invested</div>
                        <div style={{ fontWeight: 600 }}>
                            ${totalInvestedValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                    </div>

                    <div>
                        <div style={{ fontSize: 12, color: "#7f8c8d" }}>P&amp;L</div>
                        <div
                            style={{
                                fontWeight: 600,
                                color: totalPnL >= 0 ? "#2ecc71" : "#e74c3c",
                            }}
                        >
                            {totalPnL >= 0 ? "+" : "-"}$
                            {Math.abs(totalPnL).toFixed(2)}
                        </div>
                    </div>
                </div>
            </div>


            {/* TABLE */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell onClick={() => handleSort("coin")} style={{ cursor: "pointer" }}>
                                Coin{renderSortArrow("coin")}
                            </TableCell>
                            {/* <TableCell onClick={() => handleSort("quantity")} style={{ cursor: "pointer" }}>
                                Quantity{renderSortArrow("quantity")}
                            </TableCell> */}
                            <TableCell onClick={() => handleSort("currentPrice")} style={{ cursor: "pointer" }}>
                                Price{renderSortArrow("currentPrice")}
                            </TableCell>
                            <TableCell onClick={() => handleSort("totalValue")} style={{ cursor: "pointer" }}>
                                Total Value{renderSortArrow("totalValue")}
                            </TableCell>
                            <TableCell onClick={() => handleSort("investedValue")} style={{ cursor: "pointer" }}>
                                Invested{renderSortArrow("investedValue")}
                            </TableCell>
                            <TableCell onClick={() => handleSort("profitLoss")} style={{ cursor: "pointer" }}>
                                P&amp;L{renderSortArrow("profitLoss")}
                            </TableCell>
                            <TableCell>Wallet</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {tableLoading && (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        )}

                        {!tableLoading &&
                            filteredHoldings.map((h) => (
                                <TableRow key={`${h.coin}-${h.wallet?.id || "x"}`}>
                                    <TableCell>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            {h.logoUrl && (
                                                <img
                                                    src={h.logoUrl}
                                                    alt={h.coin}
                                                    style={{
                                                        width: 22,
                                                        height: 22,
                                                        borderRadius: "50%",
                                                    }}
                                                />
                                            )}
                                            <span>{h.coin}</span>
                                        </div>
                                    </TableCell>
                                    {/* <TableCell>{h.quantity}</TableCell> */}
                                    <TableCell>${h.currentPrice}</TableCell>
                                    <TableCell>
                                        <div style={{ fontWeight: 600 }}>
                                            ${Number(h.totalValue).toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </div>

                                        <div
                                            style={{
                                                fontSize: 12,
                                                color: "#7f8c8d",
                                                marginTop: 2,
                                            }}
                                        >
                                            Qty: {h.quantity}
                                        </div>
                                    </TableCell>
                                    <TableCell>${Number(h.investedValue).toFixed(2)}</TableCell>

                                    <TableCell>
                                        <div
                                            style={{
                                                color: h.profitLoss >= 0 ? "#2ecc71" : "#e74c3c",
                                                fontWeight: 600,
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            {h.profitLoss >= 0 ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                                            {h.profitLoss >= 0 ? "+" : "-"}$
                                            {Math.abs(h.profitLoss).toFixed(2)}
                                        </div>

                                        {Number(h.investedValue) > 0 && (
                                            <div
                                                style={{
                                                    fontSize: 12,
                                                    marginLeft: 28, // arrow ke niche align
                                                    color: h.profitLoss >= 0 ? "#27ae60" : "#c0392b",
                                                }}
                                            >
                                                ({((h.profitLoss / h.investedValue) * 100).toFixed(2)}%)
                                            </div>
                                        )}
                                    </TableCell>

                                    <TableCell>{h.wallet?.label || "Tracking Wallet"}</TableCell>
                                </TableRow>
                            ))}

                        {!tableLoading && filteredHoldings.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    No matching coins found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default PortfolioTracker;