// dashboard/src/components/Wealth.js
import React, { useState, useEffect } from "react";

const INDEX_FUNDS = [
  { name: "NIFTY 50 Index", ticker: "NIFTYBEES", avgReturn: 13.5, risk: "Moderate", minSIP: 500, description: "Top 50 large-cap Indian companies" },
  { name: "NIFTY NEXT 50", ticker: "JUNIORBEES", avgReturn: 14.2, risk: "Mod-High", minSIP: 500, description: "51st to 100th largest companies" },
  { name: "NIFTY MIDCAP 150", ticker: "MIDCAPBEES", avgReturn: 15.8, risk: "High", minSIP: 1000, description: "Mid-cap growth exposure" },
  { name: "NIFTY IT Index", ticker: "ITBEES", avgReturn: 16.4, risk: "High", minSIP: 500, description: "Indian IT sector leaders" },
  { name: "S&P 500 (US)", ticker: "MON100", avgReturn: 12.8, risk: "Low-Mod", minSIP: 1000, description: "500 largest US companies" },
  { name: "Gold ETF", ticker: "GOLDBEES", avgReturn: 9.2, risk: "Low", minSIP: 500, description: "Physical gold equivalent" },
];

const Wealth = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [monthlyAmount, setMonthlyAmount] = useState(5000);
  const [years, setYears] = useState(10);
  const [result, setResult] = useState(null);

  const calculateSIP = () => {
    const fund = INDEX_FUNDS[selectedIndex];
    const r = fund.avgReturn / 100 / 12;
    const n = years * 12;
    const totalInvested = monthlyAmount * n;
    const futureValue = monthlyAmount * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const wealthGained = futureValue - totalInvested;
    return { totalInvested, futureValue, wealthGained, xirr: fund.avgReturn };
  };

  useEffect(() => {
    if (monthlyAmount > 0 && years > 0) {
      setResult(calculateSIP());
    }
  }, [monthlyAmount, years, selectedIndex]);

  const fmt = n => n.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const fund = INDEX_FUNDS[selectedIndex];

  return (
    <div className="sip-container">
      <div className="sip-hero">
        <h2>💰 Long-Term Wealth Builder</h2>
        <p>Simulate SIP investments in index funds. Build wealth systematically with the power of compounding.</p>
      </div>

      <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
        Select Index Fund
      </p>
      <div className="sip-indices" style={{ marginTop: 0, marginBottom: "24px" }}>
        {INDEX_FUNDS.map((fund, i) => (
          <div
            key={i}
            className={`sip-index-card ${selectedIndex === i ? "active" : ""}`}
            onClick={() => setSelectedIndex(i)}
          >
            <h6>{fund.name}</h6>
            <p>{fund.description}</p>
            <div className="index-return">▲ {fund.avgReturn}% CAGR (hist.)</div>
            <p style={{ fontSize: "10px", marginTop: "4px", color: "var(--text-muted)" }}>Risk: {fund.risk} · Min SIP ₹{fund.minSIP}</p>
          </div>
        ))}
      </div>

      <div className="sip-grid">
        <div className="sip-input-card">
          <h5>SIP Parameters</h5>

          <div className="sip-field">
            <label>Monthly Investment (₹)</label>
            <input
              type="number" min="500" step="500"
              value={monthlyAmount}
              onChange={e => setMonthlyAmount(parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="sip-field">
            <label>Investment Duration</label>
            <select value={years} onChange={e => setYears(parseInt(e.target.value))}>
              {[1, 3, 5, 7, 10, 15, 20, 25, 30].map(y => (
                <option key={y} value={y}>{y} {y === 1 ? "year" : "years"}</option>
              ))}
            </select>
          </div>

          <div className="sip-field">
            <label>Expected Annual Return</label>
            <input type="text" readOnly value={`${fund.avgReturn}% p.a. (historical CAGR)`} style={{ color: "var(--profit)", cursor: "not-allowed" }} />
          </div>

          <div style={{ marginTop: "20px", padding: "14px", background: "var(--bg-secondary)", borderRadius: "8px", fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.7" }}>
            📌 <strong style={{ color: "var(--text-primary)" }}>Disclaimer:</strong> Historical returns are not indicative of future performance. SIP returns are subject to market risk. Please read all scheme-related documents carefully before investing.
          </div>
        </div>

        {result && (
          <div className="sip-result-card">
            <h5>Projection for {years} {years === 1 ? "year" : "years"}</h5>

            <div className="sip-result-item">
              <span>Monthly SIP</span>
              <strong>₹{fmt(monthlyAmount)}</strong>
            </div>
            <div className="sip-result-item">
              <span>Total Invested</span>
              <strong>₹{fmt(result.totalInvested)}</strong>
            </div>
            <div className="sip-result-item">
              <span>Estimated Returns</span>
              <strong className="profit">+₹{fmt(result.wealthGained)}</strong>
            </div>
            <div className="sip-result-item" style={{ background: "rgba(33,150,243,0.06)", borderRadius: "8px", padding: "12px", border: "1px solid rgba(33,150,243,0.15)" }}>
              <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>Total Corpus</span>
              <strong style={{ fontSize: "20px", color: "#2196f3" }}>₹{fmt(result.futureValue)}</strong>
            </div>

            <div style={{ marginTop: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "6px" }}>
                <span style={{ color: "var(--text-muted)" }}>Invested</span>
                <span style={{ color: "var(--text-muted)" }}>Returns</span>
              </div>
              <div style={{ height: "8px", borderRadius: "4px", background: "var(--bg-secondary)", overflow: "hidden", display: "flex" }}>
                <div style={{
                  width: `${(result.totalInvested / result.futureValue * 100).toFixed(1)}%`,
                  background: "#2196f3", transition: "width 0.5s ease"
                }} />
                <div style={{
                  flex: 1,
                  background: "var(--profit)", transition: "width 0.5s ease"
                }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginTop: "4px" }}>
                <span style={{ color: "#2196f3" }}>{(result.totalInvested / result.futureValue * 100).toFixed(1)}%</span>
                <span style={{ color: "var(--profit)" }}>{(result.wealthGained / result.futureValue * 100).toFixed(1)}%</span>
              </div>
            </div>

            <div style={{ marginTop: "16px", fontSize: "12px", color: "var(--text-muted)", background: "var(--bg-secondary)", padding: "10px 12px", borderRadius: "6px" }}>
              💡 At ₹{fmt(monthlyAmount)}/month in <strong style={{ color: "var(--text-primary)" }}>{fund.name}</strong>, your money grows <strong style={{ color: "var(--profit)" }}>{(result.futureValue / result.totalInvested).toFixed(1)}x</strong> in {years} years.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wealth;