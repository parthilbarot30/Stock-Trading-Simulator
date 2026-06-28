import React from "react";

const CATEGORIES = [
  {
    icon: "👤",
    title: "Account Opening",
    links: ["Online Account Opening", "Offline Account Opening", "Company / HUF Account", "NRI Account Opening", "Charges at Kite", "Getting Started"],
  },
  {
    icon: "💸",
    title: "Funds & Charges",
    links: ["Add funds", "Withdraw funds", "Fund transfer methods", "List of charges", "GST & taxes"],
  },
  {
    icon: "📈",
    title: "Trading",
    links: ["Intraday margins", "Options trading", "Placing an order", "Order types", "Square off positions"],
  },
  {
    icon: "📊",
    title: "Kite Platform",
    links: ["Kite user manual", "Charts & indicators", "GTT orders", "Basket orders", "Market watch"],
  },
  {
    icon: "🪙",
    title: "Mutual Funds",
    links: ["Start a SIP", "Redeem units", "Switch funds", "Coin app guide", "Tax on MF gains"],
  },
  {
    icon: "📋",
    title: "Reports & Statements",
    links: ["P&L reports", "Contract notes", "Holdings statement", "Tax P&L", "CDSL statements"],
  },
];

function CreateTicket() {
  return (
    <section className="lp-ticket-section">
      <div className="lp-container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "40px", gap: "40px", flexWrap: "wrap" }}>
          <div>
            <p className="lp-eyebrow">Help centre</p>
            <h2 className="lp-heading-sm">Create a ticket</h2>
            <p className="lp-body" style={{ marginTop: "8px" }}>Select a category that best matches your issue.</p>
          </div>

          {/* Featured */}
          <div style={{ minWidth: "260px", maxWidth: "320px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--ink)", marginBottom: "16px" }}>
              📌 Featured
            </h3>
            <ul className="lp-featured-list">
              <li><a href="#">Current takeovers and delistings — Jan 2024</a></li>
              <li><a href="#">Latest intraday leverages — MIS &amp; CO</a></li>
              <li><a href="#">Changes to F&amp;O margin requirements</a></li>
            </ul>
          </div>
        </div>

        <div className="lp-grid-3">
          {CATEGORIES.map(cat => (
            <div className="lp-ticket-category" key={cat.title}>
              <h4>
                <span>{cat.icon}</span>
                {cat.title}
              </h4>
              <div className="lp-ticket-links">
                {cat.links.map(link => (
                  <a href="#" key={link}>{link}</a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CreateTicket;