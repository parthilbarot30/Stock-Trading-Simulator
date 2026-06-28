import React from "react";
import { Link } from "react-router-dom";

const PARTNERS = [
  { name: "Smallcase",  desc: "Thematic investment baskets", img: "media/smallcaseLogo.png" },
  { name: "Streak",     desc: "Algo trading without coding", img: "media/smallcaseLogo.png" },
  { name: "Sensibull",  desc: "Options trading platform",    img: "media/smallcaseLogo.png" },
  { name: "Tijori",     desc: "Deep company research",       img: "media/smallcaseLogo.png" },
  { name: "Quicko",     desc: "Tax filing for traders",      img: "media/smallcaseLogo.png" },
  { name: "GoldenPi",   desc: "Bonds and fixed income",      img: "media/smallcaseLogo.png" },
];

function Universe() {
  return (
    <section className="lp-section" style={{ background: "var(--surface-2)", borderTop: "1px solid var(--border)" }}>
      <div className="lp-container">
        <div className="lp-text-center" style={{ marginBottom: "48px" }}>
          <p className="lp-eyebrow">Partner ecosystem</p>
          <h2 className="lp-heading-md">The Kite Universe</h2>
          <p className="lp-body" style={{ maxWidth: "500px", margin: "12px auto 0" }}>
            Extend your trading and investment experience with our carefully chosen partner platforms.
          </p>
        </div>

        <div className="lp-universe-grid">
          {PARTNERS.map(p => (
            <div className="lp-universe-card" key={p.name}>
              <img src={p.img} alt={p.name} style={{ maxHeight: "32px", margin: "0 auto 12px" }} />
              <p style={{ fontWeight: 600, fontSize: "14px", color: "var(--ink)", marginBottom: "4px" }}>{p.name}</p>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "48px" }}>
          <Link to="/signup" className="lp-btn lp-btn-primary lp-btn-lg">
            Sign up and explore
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Universe;