import React from "react";

function Pricing() {
  return (
    <section className="lp-section lp-pricing-section">
      <div className="lp-container">
        <div className="lp-grid-2">
          {/* Left: copy */}
          <div>
            <p className="lp-eyebrow">Transparent pricing</p>
            <h2 className="lp-heading-md" style={{ marginBottom: "16px" }}>
              Unbeatable pricing
            </h2>
            <p className="lp-body" style={{ marginBottom: "24px" }}>
              We pioneered the concept of discount broking and price
              transparency in India. Flat fees, zero hidden charges —
              exactly what every investor deserves.
            </p>
            <a href="/pricing" className="lp-arrow-link">See full pricing</a>
          </div>

          {/* Right: price cards */}
          <div className="lp-price-cards">
            <div className="lp-price-card featured">
              <div className="price">₹0</div>
              <p>Free equity delivery &amp; direct mutual funds — forever.</p>
            </div>
            <div className="lp-price-card">
              <div className="price">₹20</div>
              <p>Flat fee per executed order on intraday trades &amp; F&amp;O.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Pricing;