// dashboard/src/components/Summary.js
import React, { useEffect, useState } from "react";

const Summary = () => {
  const [funds, setFunds] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${process.env.REACT_APP_API_URL}/funds`, { credentials: "include" }).then(r => r.json()),
      fetch(`${process.env.REACT_APP_API_URL}/allHoldings`, { credentials: "include" }).then(r => r.json()),
    ]).then(([fundsData, holdingsData]) => {
      setFunds(fundsData);
      setHoldings(Array.isArray(holdingsData) ? holdingsData : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading dashboard…</div>;

  const totalInvested = holdings.reduce((sum, h) => sum + h.avg * h.qty, 0);
  const currentValue = holdings.reduce((sum, h) => sum + h.price * h.qty, 0);
  const totalPnL = currentValue - totalInvested;
  const pnlPct = totalInvested > 0 ? (totalPnL / totalInvested * 100) : 0;
  const isProfit = totalPnL >= 0;

  const fmt = (n) => n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="summary-wrapper">
      <div className="summary-greeting">
        <h4>Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"}, {funds?.username || "Trader"} 👋</h4>
        <p>{new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
      </div>

      <div className="summary-cards">
        <div className="summary-card balance-card">
          <div className="card-label">Available Cash</div>
          <div className="card-value">₹{fmt(funds?.cashBalance || 0)}</div>
          <div className="card-sub">Equity · Margin · Available to trade</div>
        </div>

        <div className={`summary-card ${isProfit ? "profit-card" : "loss-card"}`}>
          <div className="card-label">Total P&L</div>
          <div className={`card-value ${isProfit ? "profit" : "loss"}`}>
            {isProfit ? "+" : ""}₹{fmt(Math.abs(totalPnL))}
          </div>
          <div className="card-sub">{isProfit ? "+" : ""}{pnlPct.toFixed(2)}% overall return</div>
        </div>

        <div className="summary-card">
          <div className="card-label">Holdings</div>
          <div className="card-value">{holdings.length}</div>
          <div className="card-sub">Current value ₹{fmt(currentValue)}</div>
        </div>
      </div>

      {holdings.length > 0 && (
        <div className="pnl-summary">
          <div className="pnl-item">
            <span className="pnl-label">Total Invested</span>
            <span className="pnl-value">₹{fmt(totalInvested)}</span>
          </div>
          <div className="pnl-divider" />
          <div className="pnl-item">
            <span className="pnl-label">Current Value</span>
            <span className="pnl-value">₹{fmt(currentValue)}</span>
          </div>
          <div className="pnl-divider" />
          <div className="pnl-item">
            <span className="pnl-label">Total P&L</span>
            <span className={`pnl-value ${isProfit ? "profit" : "loss"}`}>
              {isProfit ? "+" : ""}₹{fmt(Math.abs(totalPnL))} ({isProfit ? "+" : ""}{pnlPct.toFixed(2)}%)
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Summary;