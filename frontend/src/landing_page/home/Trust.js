import React from "react";

const TRUST_POINTS = [
  {
    title: "Customer-first always",
    body: "That's why 1.3+ crore customers trust Kite with ₹3.5+ lakh crores worth of equity investments.",
  },
  {
    title: "No spam or gimmicks",
    body: "No gimmicks, spam, gamification, or annoying push notifications. High quality apps you use at your own pace.",
  },
  {
    title: "The Kite universe",
    body: "Not just an app — a whole ecosystem. Our investments in 30+ fintech startups offer tailored services specific to your needs.",
  },
  {
    title: "Do better with money",
    body: "With initiatives like Nudge and Kill Switch, we don't just facilitate transactions — we actively help you do better with your money.",
  },
];

function Trust() {
  return (
    <section className="lp-section" style={{ background: "var(--surface-2)" }}>
      <div className="lp-container">
        <div className="lp-grid-2">
          {/* Left: trust points */}
          <div>
            <p className="lp-eyebrow">Why Kite</p>
            <h2 className="lp-heading-md" style={{ marginBottom: "32px" }}>
              Trust with confidence
            </h2>
            {TRUST_POINTS.map((pt) => (
              <div className="lp-trust-item" key={pt.title}>
                <h3>{pt.title}</h3>
                <p>{pt.body}</p>
              </div>
            ))}
            <div style={{ display: "flex", gap: "24px", marginTop: "8px" }}>
              <a href="#" className="lp-arrow-link">Explore products</a>
              <a href="#" className="lp-arrow-link">Try Kite demo</a>
            </div>
          </div>

          {/* Right: ecosystem image */}
          <div>
            <img
              src="media/ecosystem.png"
              alt="Kite ecosystem"
              style={{ borderRadius: "var(--r-lg)", boxShadow: "var(--shadow-lg)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Trust;