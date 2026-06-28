import React from "react";
import { Link } from "react-router-dom";

function OpenAccount() {
  return (
    <section style={{ padding: "0 0 64px" }}>
      <div className="lp-container">
        <div className="lp-cta-banner">
          <h2>Open a Kite account</h2>
          <p>
            Modern platforms and apps, ₹0 investments,
            and flat ₹20 intraday &amp; F&amp;O trades.
          </p>
          <Link to="/signup" className="lp-btn lp-btn-primary lp-btn-lg">
            Sign up for free
          </Link>
        </div>
      </div>
    </section>
  );
}

export default OpenAccount;