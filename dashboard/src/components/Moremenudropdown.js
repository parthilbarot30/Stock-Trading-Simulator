import React, { useEffect, useRef, useState } from "react";

/* ── Alert modal ────────────────────────────────────────── */
const AlertModal = ({ stock, onClose }) => {
  const [alertPrice, setAlertPrice] = useState("");
  const [condition,  setCondition]  = useState("above");
  const [saved,      setSaved]      = useState(false);

  const handleSave = () => {
    if (!alertPrice || isNaN(alertPrice)) return;
    // In production: POST to backend to persist alert
    console.log(`Alert set: ${stock.name} ${condition} ₹${alertPrice}`);
    setSaved(true);
    setTimeout(onClose, 1200);
  };

  return (
    <div className="mmd-modal-overlay" onClick={onClose}>
      <div className="mmd-modal" onClick={e => e.stopPropagation()}>
        <div className="mmd-modal-header">
          <span>🔔 Set Price Alert — {stock.name}</span>
          <button className="mmd-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="mmd-modal-body">
          <p className="mmd-modal-sub">
            Current price:{" "}
            <strong>
              ₹{stock.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </strong>
          </p>

          <div className="mmd-field">
            <label className="mmd-label">Trigger when price is</label>
            <div className="mmd-seg">
              {["above", "below"].map(c => (
                <button
                  key={c}
                  className={`mmd-seg-btn ${condition === c ? "active" : ""}`}
                  onClick={() => setCondition(c)}
                >
                  {c === "above" ? "▲ Above" : "▼ Below"}
                </button>
              ))}
            </div>
          </div>

          <div className="mmd-field">
            <label className="mmd-label">Alert price (₹)</label>
            <input
              type="number"
              className="mmd-input"
              placeholder={stock.price.toFixed(2)}
              value={alertPrice}
              onChange={e => setAlertPrice(e.target.value)}
              autoFocus
              step="0.05"
            />
          </div>

          {saved
            ? <div className="mmd-success">✓ Alert saved for {stock.name}</div>
            : (
              <div className="mmd-modal-actions">
                <button className="mmd-btn-cancel" onClick={onClose}>Cancel</button>
                <button className="mmd-btn-save" onClick={handleSave}>Save Alert</button>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
};

/* ── Info modal ─────────────────────────────────────────── */
const InfoModal = ({ stock, onClose }) => {
  const mockInfo = {
    sector:    "Information Technology",
    mktCap:    "₹6.18L Cr",
    pe:        (Math.random() * 20 + 15).toFixed(1),
    pb:        (Math.random() * 5 + 2).toFixed(1),
    divYield:  (Math.random() * 2 + 0.5).toFixed(2) + "%",
    weekHigh:  (stock.price * 1.18).toFixed(2),
    weekLow:   (stock.price * 0.82).toFixed(2),
    avgVol:    (Math.random() * 15 + 5).toFixed(2) + "L",
    faceValue: "₹1",
  };

  return (
    <div className="mmd-modal-overlay" onClick={onClose}>
      <div className="mmd-modal" onClick={e => e.stopPropagation()}>
        <div className="mmd-modal-header">
          <span>ℹ Stock Info — {stock.name}</span>
          <button className="mmd-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="mmd-modal-body">
          <p className="mmd-modal-sub">
            ₹{stock.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}{" "}
            <span className={stock.isDown ? "mmd-red" : "mmd-green"}>
              {stock.percent}
            </span>
          </p>
          <div className="mmd-info-grid">
            {Object.entries(mockInfo).map(([k, v]) => (
              <div className="mmd-info-row" key={k}>
                <span className="mmd-info-label">
                  {k.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())}
                </span>
                <span className="mmd-info-value">{v}</span>
              </div>
            ))}
          </div>
          <p className="mmd-disclaimer">
            * Data is simulated for demo purposes only.
          </p>
        </div>
      </div>
    </div>
  );
};

/* ── Main dropdown ──────────────────────────────────────── */
const MoreMenuDropdown = ({ stock, onDelete, onClose }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [showInfo,  setShowInfo]  = useState(false);
  const menuRef = useRef(null);

  /* Close when clicking outside */
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    // short delay so the button's own click doesn't immediately close
    const id = setTimeout(() => document.addEventListener("mousedown", handler), 50);
    return () => { clearTimeout(id); document.removeEventListener("mousedown", handler); };
  }, [onClose]);

  /* Escape key */
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const ITEMS = [
    {
      icon: "🔔",
      label: "Set price alert",
      onClick: () => { setShowAlert(true); },
    },
    {
      icon: "ℹ",
      label: "Stock info",
      onClick: () => { setShowInfo(true); },
    },
    {
      icon: "📊",
      label: "View on NSE",
      onClick: () => {
        window.open(`https://www.nseindia.com/get-quotes/equity?symbol=${stock.name}`, "_blank");
        onClose();
      },
    },
    {
      icon: "📰",
      label: "Latest news",
      onClick: () => {
        window.open(`https://www.google.com/search?q=${stock.name}+NSE+stock+news`, "_blank");
        onClose();
      },
    },
    { divider: true },
  ];

  return (
    <>
      <div className="mmd-dropdown" ref={menuRef}>
        {ITEMS.map((item, i) =>
          item.divider
            ? <div key={i} className="mmd-divider" />
            : (
              <button
                key={item.label}
                className={`mmd-item ${item.danger ? "mmd-item-danger" : ""}`}
                onClick={item.onClick}
              >
                <span className="mmd-item-icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            )
        )}
      </div>

      {showAlert && (
        <AlertModal stock={stock} onClose={() => { setShowAlert(false); onClose(); }} />
      )}
      {showInfo && (
        <InfoModal stock={stock} onClose={() => { setShowInfo(false); onClose(); }} />
      )}
    </>
  );
};

export default MoreMenuDropdown;