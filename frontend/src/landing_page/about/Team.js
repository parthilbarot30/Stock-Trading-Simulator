import React from "react";

function Team() {
  return (
    <section className="lp-section" style={{ background: "var(--surface-2)", borderTop: "1px solid var(--border)" }}>
      <div className="lp-container">
        <p className="lp-eyebrow lp-text-center">Leadership</p>
        <h2 className="lp-heading-md lp-text-center" style={{ marginBottom: "48px" }}>People</h2>

        <div className="lp-team-card">
          <img
            src="media/nithinKamath.jpg"
            alt="Nithin Kamath"
            className="lp-team-avatar"
          />
          <div>
            <h3 className="lp-team-name">Nithin Kamath</h3>
            <p className="lp-team-role">Founder & CEO</p>
            <p className="lp-team-bio">
              Nithin bootstrapped and founded Zerodha in 2010 to overcome the hurdles he faced
              during his decade-long stint as a trader. Today, Zerodha has changed the landscape of
              the Indian broking industry.
            </p>
            <p className="lp-team-bio" style={{ marginTop: "12px" }}>
              He is a member of the SEBI Secondary Market Advisory Committee (SMAC) and the Market
              Data Advisory Committee (MDAC). Playing basketball is his zen.
            </p>
            <div className="lp-team-links">
              <a href="#">Homepage</a>
              <a href="#">TradingQnA</a>
              <a href="#">Twitter / X</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Team;