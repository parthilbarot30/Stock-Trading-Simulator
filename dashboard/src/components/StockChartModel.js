import React, { useEffect, useRef, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "./StockChartModel.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

/* ── Generate realistic-looking mock price history ──────────────── */
function generatePriceHistory(basePrice, points = 30) {
  const prices = [basePrice];
  for (let i = 1; i < points; i++) {
    const prev  = prices[i - 1];
    const delta = (Math.random() - 0.48) * prev * 0.008;
    prices.push(parseFloat((prev + delta).toFixed(2)));
  }
  return prices;
}

function generateTimeLabels(points = 30) {
  const labels = [];
  const now    = new Date();
  // spread labels across today's trading session: 9:15 AM → 3:30 PM
  const startMs = new Date(now).setHours(9, 15, 0, 0);
  const endMs   = new Date(now).setHours(15, 30, 0, 0);
  const stepMs  = (endMs - startMs) / (points - 1);
  for (let i = 0; i < points; i++) {
    const t = new Date(startMs + stepMs * i);
    labels.push(
      t.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false })
    );
  }
  return labels;
}

const RANGES = ["1D", "1W", "1M", "3M", "1Y"];

const StockChartModel = ({ stock, onClose }) => {
  const [range,     setRange]     = useState("1D");
  const [prices,    setPrices]    = useState([]);
  const [labels,    setLabels]    = useState([]);
  const [livePrice, setLivePrice] = useState(stock.price);
  const livePriceRef              = useRef(stock.price);
  const overlayRef                = useRef(null);

  /* Generate history whenever range changes */
  useEffect(() => {
    const pts = { "1D": 30, "1W": 35, "1M": 30, "3M": 90, "1Y": 52 }[range];
    setPrices(generatePriceHistory(stock.price, pts));
    setLabels(generateTimeLabels(pts));
  }, [range, stock.price]);

  /* Live price tick every 1.5 s */
  useEffect(() => {
    const id = setInterval(() => {
      const delta = (Math.random() - 0.48) * livePriceRef.current * 0.003;
      const next  = parseFloat((livePriceRef.current + delta).toFixed(2));
      livePriceRef.current = next;
      setLivePrice(next);
      setPrices(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = next;
        return updated;
      });
    }, 1500);
    return () => clearInterval(id);
  }, []);

  /* Escape key closes */
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!prices.length) return null;

  const firstPrice  = prices[0];
  const change      = livePrice - firstPrice;
  const changePct   = ((change / firstPrice) * 100).toFixed(2);
  const isUp        = change >= 0;
  const accentColor = isUp ? "#26a69a" : "#ef5350";

  const chartData = {
    labels,
    datasets: [
      {
        label: stock.name,
        data:  prices,
        borderColor:     accentColor,
        backgroundColor: isUp
          ? "rgba(38,166,154,0.08)"
          : "rgba(239,83,80,0.08)",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: accentColor,
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive:          true,
    maintainAspectRatio: false,
    interaction:         { mode: "index", intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1e2330",
        borderColor:     "#2a3040",
        borderWidth:     1,
        titleColor:      "#8b95a8",
        bodyColor:       "#e8eaf0",
        bodyFont:        { size: 13, weight: "600" },
        padding:         10,
        callbacks: {
          label: (ctx) =>
            `  ₹${ctx.parsed.y.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        },
      },
    },
    scales: {
      x: {
        grid:  { color: "rgba(42,48,64,0.6)", drawBorder: false },
        ticks: {
          color:  "#4f5968",
          font:   { size: 10 },
          maxTicksLimit: 6,
          maxRotation: 0,
        },
      },
      y: {
        position: "right",
        grid:     { color: "rgba(42,48,64,0.6)", drawBorder: false },
        ticks:    {
          color:  "#4f5968",
          font:   { size: 10 },
          callback: (v) => `₹${v.toLocaleString("en-IN")}`,
        },
      },
    },
  };

  return (
    <div
      className="scm-overlay"
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="scm-panel">

        {/* ── Header ─────────────────────────────── */}
        <div className="scm-header">
          <div className="scm-header-left">
            <div>
              <div className="scm-ticker-row">
                <span className="scm-ticker">{stock.name}</span>
                <span className="scm-exchange">NSE</span>
              </div>
              <div className="scm-price-row">
                <span className="scm-price">
                  ₹{livePrice.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className={`scm-change ${isUp ? "up" : "down"}`}>
                  {isUp ? "▲" : "▼"} {Math.abs(change).toFixed(2)} ({isUp ? "+" : ""}{changePct}%)
                </span>
              </div>
            </div>
          </div>
          <button className="scm-close" onClick={onClose} title="Close (Esc)">✕</button>
        </div>

        {/* ── Stats strip ───────────────────────── */}
        <div className="scm-stats">
          {[
            { label: "Open",      value: `₹${prices[0].toFixed(2)}` },
            { label: "High",      value: `₹${Math.max(...prices).toFixed(2)}` },
            { label: "Low",       value: `₹${Math.min(...prices).toFixed(2)}` },
            { label: "Prev Close",value: `₹${(stock.price * 0.992).toFixed(2)}` },
            { label: "Volume",    value: `${(Math.random() * 9 + 1).toFixed(2)}L` },
          ].map(s => (
            <div className="scm-stat" key={s.label}>
              <span className="scm-stat-label">{s.label}</span>
              <span className="scm-stat-value">{s.value}</span>
            </div>
          ))}
        </div>

        {/* ── Range tabs ────────────────────────── */}
        <div className="scm-ranges">
          {RANGES.map(r => (
            <button
              key={r}
              className={`scm-range-btn ${range === r ? "active" : ""}`}
              onClick={() => setRange(r)}
            >
              {r}
            </button>
          ))}
        </div>

        {/* ── Chart ─────────────────────────────── */}
        <div className="scm-chart">
          <Line data={chartData} options={chartOptions} />
        </div>

        {/* ── Footer actions ────────────────────── */}
        <div className="scm-footer">
          <span className="scm-footer-note">Data is simulated for demo purposes</span>
          <div className="scm-footer-btns">
            <a
              href={`https://www.nseindia.com/get-quotes/equity?symbol=${stock.name}`}
              target="_blank"
              rel="noreferrer"
              className="scm-btn-outline"
            >
              NSE ↗
            </a>
            <a
              href={`https://finance.yahoo.com/quote/${stock.name}.NS`}
              target="_blank"
              rel="noreferrer"
              className="scm-btn-outline"
            >
              Yahoo Finance ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockChartModel;