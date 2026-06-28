// dashboard/src/components/TopBar.js
import React, { useEffect, useState } from "react";
import Menu from "./Menu";

const INDICES = [
  { key: "nifty", label: "NIFTY 50", base: 22450.35 },
  { key: "sensex", label: "SENSEX", base: 73890.10 },
  { key: "banknifty", label: "BANK NIFTY", base: 48320.55 },
];

const TopBar = () => {
  const [indices, setIndices] = useState(
    INDICES.map(i => ({ ...i, price: i.base, change: 0, pct: 0 }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setIndices(prev => prev.map(idx => {
        const delta = (Math.random() - 0.49) * 15;
        const newPrice = Math.max(idx.price + delta, idx.base * 0.9);
        const change = newPrice - idx.base;
        return { ...idx, price: newPrice, change, pct: (change / idx.base) * 100 };
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="topbar-container">
      <div className="indices-container">
        {indices.map(idx => (
          <div key={idx.key} className={idx.key}>
            <p className="index">{idx.label}</p>
            <p className="index-points">{idx.price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p className={idx.change >= 0 ? "percent profit" : "percent loss"} style={{ fontSize: "11px" }}>
              {idx.change >= 0 ? "▲" : "▼"} {Math.abs(idx.pct).toFixed(2)}%
            </p>
          </div>
        ))}
      </div>
      <Menu />
    </div>
  );
};

export default TopBar;