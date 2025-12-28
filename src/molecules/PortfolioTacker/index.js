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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import AxiosService from "../../redux/helpers/interceptor";

// Static coin list
const coinOptions = [
    { name: "Bitcoin", symbol: "BTC" },
    { name: "Ethereum", symbol: "ETH" },
    { name: "Kaspa", symbol: "KAS" },
];

const PortfolioTracker = () => {

    const [holdings, setHoldings] = useState([]);
    const [selectedCoin, setSelectedCoin] = useState(null);
    const [quantity, setQuantity] = useState("");
    const [tableLoading, setTableLoading] = useState(false);
    const [adding, setAdding] = useState(false);
    const [buyFee, setBuyFee] = useState("");

    const [orderBy, setOrderBy] = useState("totalValue");
    const [order, setOrder] = useState("desc");
    const [search, setSearch] = useState("");
    const [sellingId, setSellingId] = useState(null);
    const [sellDialogOpen, setSellDialogOpen] = useState(false);
    const [sellHolding, setSellHolding] = useState(null);
    const [sellQty, setSellQty] = useState("");

    // ===============================
    // FETCH HOLDINGS
    // ===============================
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
        const interval = setInterval(() => fetchUserHoldings(false), 60 * 1000);
        return () => clearInterval(interval);
    }, [fetchUserHoldings]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await AxiosService.get("api/crypto/risk/KAS");
                console.log("data ", response); // actual response
            } catch (err) {
                console.error("Fetch holdings error:", err);
            }
        };

        fetchData();
    }, []);

    // ===============================
    // ADD COIN
    // ===============================
    const addCoin = async () => {
        if (!selectedCoin || !quantity) return;

        try {
            setAdding(true);
            await AxiosService.post("api/holdings/add", {
                symbol: selectedCoin.symbol,
                quantity: Number(quantity),
                buyFee: buyFee ? Number(buyFee) : 0
            });
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
    const totalPortfolioValue = holdings.reduce((sum, h) => sum + (Number(h.totalValue) || 0), 0);
    const totalInvestedValue = holdings.reduce((sum, h) => sum + (Number(h.investedValue) || 0), 0);
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

            if (typeof valA === "number") return order === "asc" ? valA - valB : valB - valA;
            return order === "asc" ? String(valA).localeCompare(String(valB)) : String(valB).localeCompare(String(valA));
        })
        : holdings;

    const renderSortArrow = (column) => {
        if (orderBy !== column) return null;
        return order === "asc" ? " 🔼" : " 🔽";
    };

    const filteredHoldings = sortedHoldings.filter((h) =>
        h.coin.toLowerCase().includes(search.toLowerCase())
    );

    const sellCoin = async () => {
        if (!sellHolding || !sellQty) return;

        const qty = Number(sellQty);
        if (qty <= 0 || qty > sellHolding.quantity) {
            alert("Invalid sell quantity");
            return;
        }

        const key = `${sellHolding.coin}-${sellHolding.wallet?.id || "tracking"}`;

        try {
            setSellingId(key);

            await AxiosService.post("api/holdings/sell", {
                symbol: sellHolding.coin,
                quantity: qty,
                walletId: sellHolding.wallet?.id
            });

            setSellDialogOpen(false);
            setSellHolding(null);
            setSellQty("");

            await fetchUserHoldings(false);
        } catch (err) {
            alert("Sell failed");
        } finally {
            setSellingId(null);
        }
    };


    // ===============================
    // UI
    // ===============================
    return (
        <Container className="portfolio-page" style={{ marginTop: 92 }}>
            <div style={{ marginBottom: 24 }}>
                <h2
                    style={{
                        fontSize: 28,
                        fontWeight: 800,
                        color: "#1f2937",
                        marginBottom: 4,
                    }}
                >
                    Crypto Portfolio Tracker
                </h2>
                <div style={{ fontSize: 13, color: "#6b7280" }}>
                    Track your assets, value & unrealised P&amp;L
                </div>
            </div>

            <div
                className="portfolio-form"
                style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    marginBottom: 20,
                    flexWrap: "wrap",
                }}
            >
                <Autocomplete
                    options={coinOptions}
                    getOptionLabel={(o) => `${o.name} (${o.symbol})`}
                    value={selectedCoin}
                    onChange={(e, val) => setSelectedCoin(val)}
                    renderInput={(params) => (
                        <TextField {...params} label="Select Coin" size="small" variant="outlined" />
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
                    variant="outlined"
                />

                <TextField
                    label="Buy Fee (USD)"
                    type="number"
                    size="small"
                    value={buyFee}
                    onChange={(e) => setBuyFee(e.target.value)}
                    style={{ width: 140 }}
                    variant="outlined"
                />

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={addCoin}
                    disabled={adding}
                    style={{ height: 40, backgroundColor: "#1abc9c", fontWeight: 600 }}
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

                <div className="portfolio-total-bar" style={{ display: "flex", gap: 24, background: "#ecf0f1", padding: 16, borderRadius: 12, boxShadow: "0 4px 10px rgba(0,0,0,0.05)" }}>
                    <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 12, color: "#7f8c8d" }}>Total Value</div>
                        <div style={{ fontWeight: 700, color: "#2c3e50" }}>
                            ${totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                    </div>

                    <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 12, color: "#7f8c8d" }}>Invested</div>
                        <div style={{ fontWeight: 700, color: "#2c3e50" }}>
                            ${totalInvestedValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                    </div>

                    <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 12, color: "#7f8c8d" }}>P&amp;L (Unrealised)</div>
                        <div
                            style={{
                                fontWeight: 700,
                                color: totalPnL >= 0 ? "#27ae60" : "#c0392b",
                            }}
                        >
                            {totalPnL >= 0 ? "+" : "-"}${Math.abs(totalPnL).toFixed(2)}
                        </div>
                    </div>
                </div>
            </div>

            <TableContainer component={Paper} style={{ borderRadius: 12, boxShadow: "0 6px 20px rgba(0,0,0,0.08)" }}>
                <Table>
                    <TableHead>
                        <TableRow style={{ backgroundColor: "#f1f5f9" }}>
                            <TableCell onClick={() => handleSort("coin")} style={{ cursor: "pointer", fontWeight: 700 }}>
                                Coin{renderSortArrow("coin")}
                            </TableCell>
                            <TableCell onClick={() => handleSort("currentPrice")} style={{ cursor: "pointer", fontWeight: 700 }}>
                                Price{renderSortArrow("currentPrice")}
                            </TableCell>
                            <TableCell onClick={() => handleSort("totalValue")} style={{ cursor: "pointer", fontWeight: 700 }}>
                                Total Value{renderSortArrow("totalValue")}
                            </TableCell>
                            <TableCell onClick={() => handleSort("investedValue")} style={{ cursor: "pointer", fontWeight: 700 }}>
                                Invested{renderSortArrow("investedValue")}
                            </TableCell>
                            <TableCell onClick={() => handleSort("profitLoss")} style={{ cursor: "pointer", fontWeight: 700 }}>
                                P&amp;L{renderSortArrow("profitLoss")}
                            </TableCell>
                            <TableCell align="center" style={{ fontWeight: 700 }}>
                                Action
                            </TableCell>
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
                                <TableRow key={`${h.coin}-${h.wallet?.id || "x"}`} style={{ transition: "0.3s", "&:hover": { backgroundColor: "#f9f9f9" } }}>
                                    <TableCell>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            {h.logoUrl && (
                                                <img
                                                    src={h.logoUrl}
                                                    alt={h.coin}
                                                    style={{
                                                        width: 24,
                                                        height: 24,
                                                        borderRadius: "50%",
                                                        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                                                    }}
                                                />
                                            )}
                                            <span style={{ fontWeight: 600, color: "#2c3e50" }}>{h.coin}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>${Number(h.currentPrice).toFixed(2)}</TableCell>
                                    <TableCell>
                                        <div style={{ fontWeight: 600 }}>${Number(h.totalValue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                        <div style={{ fontSize: 12, color: "#7f8c8d", marginTop: 2 }}>Qty: {h.quantity}</div>
                                    </TableCell>
                                    <TableCell>${Number(h.investedValue).toFixed(2)}</TableCell>
                                    <TableCell>
                                        <div style={{ color: h.profitLoss >= 0 ? "#27ae60" : "#c0392b", fontWeight: 600, display: "flex", alignItems: "center" }}>
                                            {h.profitLoss >= 0 ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                                            {h.profitLoss >= 0 ? "+" : "-"}${Math.abs(h.profitLoss).toFixed(2)}
                                        </div>
                                        {Number(h.investedValue) > 0 && (
                                            <div style={{ fontSize: 12, marginLeft: 28, color: h.profitLoss >= 0 ? "#2ecc71" : "#e74c3c" }}>
                                                ({((h.profitLoss / h.investedValue) * 100).toFixed(2)}%)
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button
                                            variant="contained"
                                            size="small"
                                            onClick={() => {
                                                setSellHolding(h);
                                                setSellQty("");
                                                setSellDialogOpen(true);
                                            }}
                                            disabled={sellingId}
                                            style={{
                                                backgroundColor: "#e74c3c",
                                                fontWeight: 600,
                                                minWidth: 70
                                            }}
                                        >
                                            Sell
                                        </Button>
                                    </TableCell>
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
            <Dialog
                open={sellDialogOpen}
                onClose={() => setSellDialogOpen(false)}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle style={{ fontWeight: 700 }}>
                    Sell {sellHolding?.coin}
                </DialogTitle>

                <DialogContent>
                    <div style={{ fontSize: 13, color: "#7f8c8d", marginBottom: 8 }}>
                        Available Quantity: <b>{sellHolding?.quantity}</b>
                    </div>

                    <TextField
                        label="Sell Quantity"
                        type="number"
                        fullWidth
                        size="small"
                        value={sellQty}
                        onChange={(e) => setSellQty(e.target.value)}
                        inputProps={{
                            min: 0,
                            max: sellHolding?.quantity
                        }}
                    />
                </DialogContent>

                <DialogActions style={{ padding: 16 }}>
                    <Button onClick={() => setSellDialogOpen(false)}>
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        onClick={sellCoin}
                        disabled={sellingId !== null}
                        style={{ backgroundColor: "#e74c3c", fontWeight: 600 }}
                    >
                        {sellingId ? (
                            <CircularProgress size={18} sx={{ color: "#fff" }} />
                        ) : (
                            "Confirm Sell"
                        )}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default PortfolioTracker;