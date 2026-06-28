import React from "react";

const CHARGES = [
  { label: "Call & Trade / RMS auto-squareoff", value: "Additional ₹50 + GST per order" },
  { label: "Digital contract notes",            value: "Sent via e-mail (free)" },
  { label: "Physical contract notes",           value: "₹20 per note + courier charges" },
  { label: "NRI account (non-PIS)",             value: "0.5% or ₹100 per order (lower)" },
  { label: "NRI account (PIS)",                 value: "0.5% or ₹200 per order (lower)" },
  { label: "Debit balance orders",              value: "₹40 per executed order" },
];

function Brokerage() {
  return (
    <section className="lp-section" style={{ background: "var(--surface-2)", borderTop: "1px solid var(--border)" }}>
      <div className="lp-container">
        <div className="lp-grid-2" style={{ gap: "48px", alignItems: "start" }}>
          {/* Table */}
          <div>
            <h2 className="lp-heading-sm" style={{ marginBottom: "20px" }}>List of charges</h2>
            <div className="lp-brokerage-table">
              <table>
                <thead>
                  <tr><th>Charge type</th><th>Amount</th></tr>
                </thead>
                <tbody>
                  {CHARGES.map(c => (
                    <tr key={c.label}>
                      <td>{c.label}</td>
                      <td style={{ fontWeight: 600, color: "var(--ink)", whiteSpace: "nowrap" }}>{c.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Calculator CTA */}
          <div>
            <h2 className="lp-heading-sm" style={{ marginBottom: "16px" }}>Brokerage calculator</h2>
            <p className="lp-body" style={{ marginBottom: "24px" }}>
              Use our brokerage calculator to estimate charges for your trades before you place them.
              Know exactly what you'll pay — down to the last paisa.
            </p>
            <a href="#" className="lp-btn lp-btn-outline">Open calculator</a>

            <div className="lp-card-flat" style={{ marginTop: "32px" }}>
              <p style={{ fontSize: "13px", color: "var(--muted)", lineHeight: "1.8" }}>
                <strong style={{ color: "var(--ink)" }}>Note:</strong> STT, exchange transaction charges, GST, SEBI charges, and stamp duty apply
                in addition to brokerage — as per government regulations. These are not charged by
                Kite directly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Brokerage;