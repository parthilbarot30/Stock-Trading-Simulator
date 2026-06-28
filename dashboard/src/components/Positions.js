// dashboard/src/components/Positions.js
import React, { useState, useEffect } from "react";

const Positions = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3002/allPositions", { credentials: "include" })
      .then(r => r.json())
      .then(data => { setPositions(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading positions…</div>;

  return (
    <>
      <h3 className="title">Positions <span>({positions.length})</span></h3>

      {positions.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", color: "var(--text-muted)" }}>
          <p style={{ fontSize: "15px" }}>No open positions</p>
          <p style={{ fontSize: "13px", marginTop: "8px" }}>Intraday positions will appear here.</p>
        </div>
      ) : (
        <div className="order-table">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Instrument</th>
                <th>Qty.</th>
                <th>Avg.</th>
                <th>LTP</th>
                <th>P&L</th>
                <th>Chg.</th>
              </tr>
            </thead>
            <tbody>
              {positions.map((stock, index) => {
                const curValue = stock.price * stock.qty;
                const pnl = curValue - stock.avg * stock.qty;
                const profClass = pnl >= 0 ? "profit" : "loss";
                const dayClass  = stock.isLoss ? "loss" : "profit";
                return (
                  <tr key={index}>
                    <td><span className={`badge ${profClass === "profit" ? "badge-buy" : "badge-sell"}`}>{stock.product}</span></td>
                    <td style={{ fontWeight: 600 }}>{stock.name}</td>
                    <td>{stock.qty}</td>
                    <td>₹{stock.avg.toFixed(2)}</td>
                    <td>₹{stock.price.toFixed(2)}</td>
                    <td className={profClass}>{pnl >= 0 ? "+" : ""}₹{pnl.toFixed(2)}</td>
                    <td className={dayClass}>{stock.day}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default Positions;