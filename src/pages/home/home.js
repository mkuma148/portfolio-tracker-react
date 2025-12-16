import React, { useState } from "react";
import "./home.scss";
// import TradingViewChart from "../../atoms/TradingViewChart";
// import { Button } from "react-bootstrap";
// import TradingViewAdvancedChart from "../../atoms/TradingViewAdvancedChart";
import KaspaLightChart from "../../atoms/KaspaLightChart";

// ------------------
// STATIC DATA ONLY
// ------------------
const stats = {
  balance: "$10k",
  used: "$50,150.00",
  usersThisYear: "60%",
  usersLastYear: "40%",
  conversion: "62%",
  buyers: [
    { name: "Chutuk", date: "18 January 2019" },
    { name: "Adam Garza", date: "20 January 2019" },
    { name: "Jennifer Rice", date: "25 January 2019" },
  ],
};

export default function Home() {
  // const [coin, setCoin] = useState("MEXC:KASUSDT");
  // const [theme, setTheme] = useState("light");
  const [activeCoin, setActiveCoin] = useState("kaspa");
  const [isRetrying, setIsRetrying] = useState(false);
  return (
    <div className="dashboard dashboard--no-nav">


      {/* MAIN */}
      <main className="main">


        <div className="cards-row">
          {/* Balance Card */}
          <div className="card balance">
            <h4>Current Balance</h4>
            <div className="circle">
              <span>{stats.balance}</span>
            </div>
            <p className="used">{stats.used} used</p>
          </div>

          {/* Transaction Graph (static) */}
          <div className="card graph">
            <div>
              <div style={{ marginBottom: "10px", display: "flex", gap: "10px" }}>
                <button
                  className={`coin-btn ${activeCoin === "kaspa" ? "kaspa active" : "kaspa"}`}
                  onClick={() => setActiveCoin("kaspa")}
                  disabled={isRetrying}
                >
                  Kaspa
                </button>

                <button
                  className={`coin-btn ${activeCoin === "bitcoin" ? "bitcoin active" : "bitcoin"}`}
                  onClick={() => setActiveCoin("bitcoin")}
                  disabled={isRetrying}
                >
                  Bitcoin
                </button>
              </div>

              {activeCoin === "kaspa" && <KaspaLightChart coin="kaspa" onRetryChange={setIsRetrying}/>}
              {activeCoin === "bitcoin" && <KaspaLightChart coin="bitcoin" onRetryChange={setIsRetrying}/>}
            </div>
          </div>
        </div>

        <div className="cards-row">
          {/* User Stats */}
          <div className="card">
            <h4>User Statistics</h4>
            <p>This year: {stats.usersThisYear}</p>
            <p>Last year: {stats.usersLastYear}</p>
            <div className="bars" />
          </div>

          {/* Buyers */}
          <div className="card">
            <h4>Recent Buyers</h4>
            {stats.buyers.map((b) => (
              <div key={b.name} className="buyer">
                <span>{b.name}</span>
                <small>{b.date}</small>
              </div>
            ))}
          </div>

          {/* Conversion */}
          <div className="card center">
            <h4>Conversion Ratio</h4>
            <strong>{stats.conversion}</strong>
          </div>
        </div>
      </main>
    </div>
  );
}
