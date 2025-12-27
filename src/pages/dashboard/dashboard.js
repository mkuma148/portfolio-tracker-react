import React, { useEffect, useState } from "react";
import "./dashboard.scss";
// import TradingViewChart from "../../atoms/TradingViewChart";
// import { Button } from "react-bootstrap";
// import TradingViewAdvancedChart from "../../atoms/TradingViewAdvancedChart";
import KaspaLightChart from "../../atoms/KaspaLightChart";
import PortfolioPieChart from "../../atoms/PortfolioPieChart";
import SentimentMeter from "../../atoms/SentimentMeter";
import Speedometer from "../../atoms/Speedometer";
import AxiosService from "../../redux/helpers/interceptor";

export default function Dashboard() {
  // const [coin, setCoin] = useState("MEXC:KASUSDT");
  // const [theme, setTheme] = useState("light");
  const [aCoin, setACoin] = useState("kaspa");

  const [sentiment, setSentiment] = useState(0);
  const [kasDominance, setKasDominance] = useState(0);
  const [kasRank, setKasRank] = useState(0);
  const [kasRisk, setKasRisk] = useState(0);

  useEffect(() => {
    const fetchSentiment = () => {
      fetch("https://api.alternative.me/fng/?limit=1")
        .then(res => res.json())
        .then(data => {
          setSentiment(Number(data.data[0].value));
        })
        .catch(() => { });
    };

    fetchSentiment(); // first call

    const interval = setInterval(fetchSentiment, 6 * 60 * 60 * 1000); // 6 hrs
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchDominanceAndRank() {
      try {
        // 🌍 Global market cap
        const globalRes = await fetch(
          "https://api.coingecko.com/api/v3/global"
        );
        const globalData = await globalRes.json();
        const totalCap = globalData.data.total_market_cap.usd;

        // 🟣 Kaspa data (rank included)
        const kasRes = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=kaspa"
        );
        const kasData = await kasRes.json();

        const kasCap = kasData[0]?.market_cap ?? 0;
        const kasRank = kasData[0]?.market_cap_rank ?? null;

        // 📈 Dominance %
        const kasDominance = (kasCap / totalCap) * 100;

        setKasDominance(kasDominance.toFixed(4));
        setKasRank(kasRank);

      } catch (err) {
        console.error("Error fetching dominance/rank", err);
      }
    }

    fetchDominanceAndRank();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const risk = await AxiosService.get("api/crypto/risk/KAS");
        setKasRisk(parseInt(risk));
      } catch (err) {
        console.error("Fetch holdings error:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="dashboard dashboard--no-nav">


      {/* MAIN */}
      <main className="main">


        <div className="cards-row">
          {/* Balance Card */}
          <div className="card balance">
            <PortfolioPieChart />
          </div>

          {/* Transaction Graph (static) */}
          <div className="card">
            <div>
              {aCoin === "kaspa" && <KaspaLightChart coin={aCoin} loadChildChart={(coin) => setACoin(coin)} />}
              {aCoin === "bitcoin" && <KaspaLightChart coin={aCoin} loadChildChart={(coin) => setACoin(coin)} />}
            </div>
          </div>
        </div>

        <div className="cards-row">
          {/* User Stats */}
          <div className="card sentiment-card">
            <SentimentMeter value={sentiment} title="Market Sentiment" />
          </div>

          {/* Buyers */}
          <div className="card sentiment-card">
            <SentimentMeter value={kasDominance} rank={kasRank} title="Market Share" />
          </div>

          {/* Conversion */}
          <div className="card sentiment-card">
            <Speedometer risk={kasRisk} />
          </div>
        </div>
      </main>
    </div>
  );
}
