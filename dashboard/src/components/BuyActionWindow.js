import React, { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import "./BuyActionWindow.css";

/* ─── tiny hook: draggable panel ─────────────────────────────── */
function useDraggable(ref) {
  const pos = useRef({ x: 0, y: 0, startX: 0, startY: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMouseDown = (e) => {
      if (!e.target.closest(".baw-drag-handle")) return;
      pos.current.startX = e.clientX - pos.current.x;
      pos.current.startY = e.clientY - pos.current.y;
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };

    const onMouseMove = (e) => {
      pos.current.x = e.clientX - pos.current.startX;
      pos.current.y = e.clientY - pos.current.startY;
      el.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    el.addEventListener("mousedown", onMouseDown);
    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [ref]);
}

/* ─── Order type tabs ─────────────────────────────────────────── */
const ORDER_TYPES = ["Market", "Limit", "SL", "SL-M"];
const PRODUCTS    = ["CNC", "MIS", "NRML"];
const VALIDITIES  = ["Day", "IOC"];

/* ─── Main component ──────────────────────────────────────────── */
const BuyActionWindow = ({ uid, marketPrice = 0, mode = "BUY" }) => {
  const windowRef = useRef(null);
  useDraggable(windowRef);

  const { closeBuyWindow } = useContext(GeneralContext);

  /* form state */
  const [orderType,   setOrderType]   = useState("Market");
  const [product,     setProduct]     = useState("CNC");
  const [validity,    setValidity]    = useState("Day");
  const [qty,         setQty]         = useState(1);
  const [price,       setPrice]       = useState(marketPrice > 0 ? marketPrice.toFixed(2) : "");
  const [triggerPrice, setTriggerPrice] = useState("");
  const [disclosedQty, setDisclosedQty] = useState("");

  /* ui state */
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState("");
  const [showMore, setShowMore] = useState(false);

  /* live price ticker (mock ±0.3% every 1.5 s) */
  const [livePrice, setLivePrice] = useState(
    marketPrice > 0 ? marketPrice : parseFloat((Math.random() * 1800 + 200).toFixed(2))
  );
  const livePriceRef = useRef(livePrice);
  livePriceRef.current = livePrice;

  useEffect(() => {
    const id = setInterval(() => {
      const delta = (Math.random() - 0.48) * livePriceRef.current * 0.003;
      const next  = parseFloat((livePriceRef.current + delta).toFixed(2));
      setLivePrice(next);
    }, 1500);
    return () => clearInterval(id);
  }, []);

  /* derived */
  const isBuy        = mode === "BUY";
  const effectivePrice = orderType === "Market" ? livePrice : parseFloat(price) || 0;
  const totalValue   = (parseInt(qty) || 0) * effectivePrice;
  const marginReq    = (totalValue * 0.2).toFixed(2);               // 20 % mock margin
  const showPriceFld = orderType === "Limit" || orderType === "SL";
  const showTrigFld  = orderType === "SL" || orderType === "SL-M";

  /* submit */
  const handleSubmit = async () => {
    setError(""); setSuccess("");

    if (!qty || parseInt(qty) <= 0)              return setError("Enter a valid quantity.");
    if (showPriceFld && (!price || parseFloat(price) <= 0)) return setError("Enter a valid limit price.");
    if (showTrigFld && (!triggerPrice || parseFloat(triggerPrice) <= 0))
                                                  return setError("Enter a valid trigger price.");

    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/newOrder`,
        {
          name:  uid,
          qty:   parseInt(qty),
          price: parseFloat(effectivePrice.toFixed(2)),
          mode,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        setSuccess(`${mode} order placed — ${qty} × ${uid} @ ₹${effectivePrice.toFixed(2)}`);
        setTimeout(() => closeBuyWindow(), 1600);
      } else {
        setError(res.data.message || "Order failed.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Network error. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  /* keyboard shortcut: Escape → close */
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") closeBuyWindow(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeBuyWindow]);

  /* price change highlight */
  const [priceUp, setPriceUp] = useState(null);
  const prevPrice = useRef(livePrice);
  useEffect(() => {
    if (livePrice !== prevPrice.current) {
      setPriceUp(livePrice > prevPrice.current);
      prevPrice.current = livePrice;
      const t = setTimeout(() => setPriceUp(null), 600);
      return () => clearTimeout(t);
    }
  }, [livePrice]);

  return (
    <div className="baw-overlay" onClick={closeBuyWindow}>
      <div
        className={`baw-panel ${isBuy ? "baw-buy" : "baw-sell"}`}
        ref={windowRef}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ─────────────────────────────────── */}
        <div className={`baw-header baw-drag-handle ${isBuy ? "baw-header-buy" : "baw-header-sell"}`}>
          <div className="baw-header-left">
            <span className="baw-ticker">{uid}</span>
            <span className="baw-exchange">NSE</span>
            <span className={`baw-live-price ${priceUp === true ? "tick-up" : priceUp === false ? "tick-down" : ""}`}>
              ₹{livePrice.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="baw-header-right">
            <span className={`baw-mode-badge ${isBuy ? "badge-buy" : "badge-sell"}`}>{mode}</span>
            <button className="baw-close-btn" onClick={closeBuyWindow} title="Close (Esc)">✕</button>
          </div>
        </div>

        {/* ── Order type tabs ────────────────────────── */}
        <div className="baw-tabs">
          {ORDER_TYPES.map((t) => (
            <button
              key={t}
              className={`baw-tab ${orderType === t ? "baw-tab-active" : ""}`}
              onClick={() => { setOrderType(t); setError(""); setSuccess(""); }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── Body ───────────────────────────────────── */}
        <div className="baw-body">

          {/* Row 1: Product + Validity */}
          <div className="baw-row">
            <div className="baw-field baw-field-sm">
              <label className="baw-label">Product</label>
              <div className="baw-seg">
                {PRODUCTS.map((p) => (
                  <button
                    key={p}
                    className={`baw-seg-btn ${product === p ? "baw-seg-active" : ""}`}
                    onClick={() => setProduct(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div className="baw-field baw-field-sm">
              <label className="baw-label">Validity</label>
              <div className="baw-seg">
                {VALIDITIES.map((v) => (
                  <button
                    key={v}
                    className={`baw-seg-btn ${validity === v ? "baw-seg-active" : ""}`}
                    onClick={() => setValidity(v)}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Row 2: Qty + Price + Trigger */}
          <div className="baw-row">
            <div className="baw-field">
              <label className="baw-label">Qty.</label>
              <div className="baw-input-wrap">
                <button className="baw-stepper" onClick={() => setQty(q => Math.max(1, (parseInt(q) || 1) - 1))}>−</button>
                <input
                  className="baw-input baw-input-center"
                  type="number"
                  min="1"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                />
                <button className="baw-stepper" onClick={() => setQty(q => (parseInt(q) || 0) + 1)}>+</button>
              </div>
            </div>

            {showPriceFld && (
              <div className="baw-field">
                <label className="baw-label">Price (₹)</label>
                <div className="baw-input-wrap">
                  <input
                    className="baw-input"
                    type="number"
                    step="0.05"
                    placeholder={livePrice.toFixed(2)}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>
            )}

            {!showPriceFld && !showTrigFld && (
              <div className="baw-field">
                <label className="baw-label">Price (₹)</label>
                <div className="baw-input-wrap">
                  <input className="baw-input" type="text" value="Market" disabled />
                </div>
              </div>
            )}

            {showTrigFld && (
              <div className="baw-field">
                <label className="baw-label">Trigger (₹)</label>
                <div className="baw-input-wrap">
                  <input
                    className="baw-input"
                    type="number"
                    step="0.05"
                    placeholder="0.00"
                    value={triggerPrice}
                    onChange={(e) => setTriggerPrice(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* More options toggle */}
          <button className="baw-more-toggle" onClick={() => setShowMore((s) => !s)}>
            {showMore ? "▲ Hide options" : "▼ More options"}
          </button>

          {showMore && (
            <div className="baw-row baw-more">
              <div className="baw-field">
                <label className="baw-label">Disclosed Qty.</label>
                <div className="baw-input-wrap">
                  <input
                    className="baw-input"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={disclosedQty}
                    onChange={(e) => setDisclosedQty(e.target.value)}
                  />
                </div>
              </div>
              <div className="baw-field baw-info-box">
                <p className="baw-info-text">
                  <strong>CNC</strong> — delivery (long-term)<br />
                  <strong>MIS</strong> — intraday (auto-sq off)<br />
                  <strong>NRML</strong> — F&amp;O overnight
                </p>
              </div>
            </div>
          )}

          {/* Order summary strip */}
          <div className="baw-summary">
            <div className="baw-summary-item">
              <span>Est. value</span>
              <strong>₹{totalValue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
            </div>
            <div className="baw-summary-divider" />
            <div className="baw-summary-item">
              <span>Margin req.</span>
              <strong>₹{parseFloat(marginReq).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong>
            </div>
            <div className="baw-summary-divider" />
            <div className="baw-summary-item">
              <span>Charges</span>
              <strong>₹{(totalValue * 0.0003).toFixed(2)}</strong>
            </div>
          </div>

          {/* Feedback */}
          {error   && <div className="baw-feedback baw-feedback-error">⚠ {error}</div>}
          {success && <div className="baw-feedback baw-feedback-success">✓ {success}</div>}
        </div>

        {/* ── Footer ─────────────────────────────────── */}
        <div className="baw-footer">
          <span className="baw-hint">Press Esc to cancel</span>
          <div className="baw-footer-btns">
            <button className="baw-btn-cancel" onClick={closeBuyWindow}>Cancel</button>
            <button
              className={`baw-btn-submit ${isBuy ? "baw-btn-buy" : "baw-btn-sell"}`}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading
                ? <span className="baw-spinner" />
                : `${mode} · ₹${totalValue.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;