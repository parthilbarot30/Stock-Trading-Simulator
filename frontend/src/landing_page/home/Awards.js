import React from "react";

const INSTRUMENTS = [
  "Futures and Options",
  "Stocks & IPOs",
  "Commodity derivatives",
  "Direct mutual funds",
  "Currency derivatives",
  "Bonds & Govt. Securities",
];

function Awards() {
  return (
    <section className="lp-section lp-awards-section">
      <div className="lp-container">

        {/* Stat strip */}
        <div className="lp-stat-strip" style={{ marginBottom: "64px" }}>
          {[
            { value: "1.3+ Cr", label: "Active clients" },
            { value: "15%+",    label: "Daily retail volumes" },
            { value: "₹3.5L Cr",label: "Equity investments" },
            { value: "₹0",      label: "Equity delivery fee" },
          ].map(s => (
            <div className="lp-stat" key={s.label}>
              <div className="lp-stat-value">{s.value}</div>
              <div className="lp-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="lp-grid-2">
          <div>
            <img src="media/largestBroker.svg" alt="Largest broker in India" />
          </div>
          <div>
            <p className="lp-eyebrow">Market leader</p>
            <h2 className="lp-heading-md" style={{ marginBottom: "16px" }}>
              Largest stock broker in India
            </h2>
            <p className="lp-body" style={{ marginBottom: "24px" }}>
              2+ million Kite clients contribute to over 15% of all retail
              order volumes in India daily by trading and investing in:
            </p>
            <ul className="lp-instrument-list">
              {INSTRUMENTS.map(i => <li key={i}>{i}</li>)}
            </ul>
            <img
              src="media/pressLogos.png"
              alt="Press coverage"
              style={{ maxWidth: "85%", marginTop: "24px" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Awards;