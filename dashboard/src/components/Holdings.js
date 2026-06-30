// dashboard/src/components/Holdings.js
import React, { useState, useEffect } from "react";
import { VerticalGraph } from "./VerticalGraph";

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHoldings = () => {
    setLoading(true);
    fetch(`${process.env.REACT_APP_API_URL}/allHoldings`, { credentials: "include" })
      .then(r => { if (!r.ok) throw new Error("Failed"); return r.json(); })
      .then(data => { setAllHoldings(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { setError("Could not load holdings"); setLoading(false); });
  };

  useEffect(() => { fetchHoldings(); }, []);

  if (loading) return <div className="loading">Loading holdings…</div>;
  if (error) return <div className="error-msg">{error}</div>;

  const totalInvested = allHoldings.reduce((s, h) => s + h.avg * h.qty, 0);
  const currentValue  = allHoldings.reduce((s, h) => s + h.price * h.qty, 0);
  const totalPnL      = currentValue - totalInvested;
  const isProfit      = totalPnL >= 0;
  const pnlPct        = totalInvested > 0 ? (totalPnL / totalInvested * 100) : 0;
  const fmt = n => n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const chartData = {
    labels: allHoldings.map(h => h.name),
    datasets: [{
      label: "Current Value (₹)",
      data: allHoldings.map(h => (h.price * h.qty).toFixed(2)),
      backgroundColor: "rgba(33,150,243,0.6)",
      borderColor: "#2196f3",
      borderWidth: 1,
      borderRadius: 4,
    }],
  };

  return (
    <>
      <h3 className="title">Holdings <span>({allHoldings.length} stocks)</span></h3>

      {allHoldings.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", color: "var(--text-muted)" }}>
          <p style={{ fontSize: "15px", marginBottom: "8px" }}>No holdings yet</p>
          <p style={{ fontSize: "13px" }}>Buy stocks from the watchlist to start building your portfolio.</p>
        </div>
      ) : (
        <>
          <div className="pnl-summary" style={{ marginBottom: "20px" }}>
            <div className="pnl-item">
              <span className="pnl-label">Invested</span>
              <span className="pnl-value">₹{fmt(totalInvested)}</span>
            </div>
            <div className="pnl-divider" />
            <div className="pnl-item">
              <span className="pnl-label">Current</span>
              <span className="pnl-value">₹{fmt(currentValue)}</span>
            </div>
            <div className="pnl-divider" />
            <div className="pnl-item">
              <span className="pnl-label">P&L</span>
              <span className={`pnl-value ${isProfit ? "profit" : "loss"}`}>
                {isProfit ? "+" : ""}₹{fmt(Math.abs(totalPnL))} ({isProfit ? "+" : ""}{pnlPct.toFixed(2)}%)
              </span>
            </div>
          </div>

          <div className="order-table">
            <table>
              <thead>
                <tr>
                  <th>Instrument</th>
                  <th>Qty.</th>
                  <th>Avg. Cost</th>
                  <th>LTP</th>
                  <th>Cur. Value</th>
                  <th>P&L</th>
                  <th>Net Chg.</th>
                </tr>
              </thead>
              <tbody>
                {allHoldings.map((stock, index) => {
                  const curValue = stock.price * stock.qty;
                  const pnl = curValue - stock.avg * stock.qty;
                  const pnlPctItem = stock.avg > 0 ? ((pnl / (stock.avg * stock.qty)) * 100) : 0;
                  const profClass = pnl >= 0 ? "profit" : "loss";
                  return (
                    <tr key={index}>
                      <td style={{ fontWeight: 600 }}>{stock.name}</td>
                      <td>{stock.qty}</td>
                      <td>₹{stock.avg.toFixed(2)}</td>
                      <td>₹{stock.price.toFixed(2)}</td>
                      <td>₹{curValue.toFixed(2)}</td>
                      <td className={profClass}>
                        {pnl >= 0 ? "+" : ""}₹{pnl.toFixed(2)}
                      </td>
                      <td className={profClass}>
                        {pnl >= 0 ? "+" : ""}{pnlPctItem.toFixed(2)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="chart-container">
            <VerticalGraph data={chartData} />
          </div>
        </>
      )}
    </>
  );
};

export default Holdings;