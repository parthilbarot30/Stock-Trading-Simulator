import React from "react";

const EDU = [
  {
    title: "Varsity",
    body: "The largest online stock market education resource in the world — covering everything from the basics to advanced options trading.",
    link: "Start learning",
  },
  {
    title: "TradingQ&A",
    body: "The most active trading and investment community in India for all your market-related queries. Ask, learn, and grow.",
    link: "Join the community",
  },
];

function Education() {
  return (
    <section className="lp-section">
      <div className="lp-container">
        <div className="lp-grid-2">
          <div>
            <img
              src="media/education.svg"
              alt="Free market education"
              style={{ maxWidth: "80%" }}
            />
          </div>
          <div>
            <p className="lp-eyebrow">Learn &amp; grow</p>
            <h2 className="lp-heading-md" style={{ marginBottom: "32px" }}>
              Free and open market education
            </h2>
            {EDU.map(e => (
              <div className="lp-edu-card" key={e.title}>
                <h3>{e.title}</h3>
                <p>{e.body}</p>
                <a href="#" className="lp-arrow-link">{e.link}</a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Education;