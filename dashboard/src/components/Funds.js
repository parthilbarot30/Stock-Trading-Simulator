// dashboard/src/components/Funds.js
import React, { useState, useEffect } from "react";

const Funds = () => {
  const [funds, setFunds] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState("");
  const [processing, setProcessing] = useState(false);

  const fetchFunds = () => {
    fetch(`${process.env.REACT_APP_API_URL}/funds`, { credentials: "include" })
      .then(r => r.json())
      .then(data => { setFunds(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchFunds(); }, []);

  const handleAddFunds = async () => {
    if (!amount || parseFloat(amount) <= 0) { setMsg("Enter a valid amount"); return; }
    setProcessing(true); setMsg("");
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/addFunds`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ amount: parseFloat(amount) }),
      });
      const data = await res.json();
      if (data.success) {
        setFunds(prev => ({ ...prev, cashBalance: data.cashBalance }));
        setMsg("✅ Funds added successfully!");
        setAmount("");
        setTimeout(() => { setShowAddModal(false); setMsg(""); }, 1500);
      }
    } catch { setMsg("Network error"); }
    finally { setProcessing(false); }
  };

  const fmt = n => n?.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00";

  if (loading) return <div className="loading">Loading funds…</div>;

  const balance = funds?.cashBalance || 0;

  return (
    <>
      <div className="funds-header">
        <h3 className="title" style={{ margin: 0 }}>Funds</h3>
        <div className="funds-action-btns">
          <button className="btn-primary-dark" onClick={() => { setShowAddModal(true); setMsg(""); }}>+ Add Funds</button>
          <button className="btn-outline-dark" onClick={() => setShowWithdrawModal(true)}>Withdraw</button>
        </div>
      </div>

      <div className="funds-grid">
        <div className="funds-card">
          <h5>Equity</h5>
          <div className="funds-row">
            <p>Available Cash</p>
            <p className="imp colored">₹{fmt(balance)}</p>
          </div>
          <div className="funds-row">
            <p>Used Margin</p>
            <p className="imp">₹0.00</p>
          </div>
          <div className="funds-row">
            <p>Opening Balance</p>
            <p className="imp">₹{fmt(balance)}</p>
          </div>
          <div className="funds-row">
            <p>SPAN</p><p>₹0.00</p>
          </div>
          <div className="funds-row">
            <p>Delivery Margin</p><p>₹0.00</p>
          </div>
          <div className="funds-row">
            <p>Exposure</p><p>₹0.00</p>
          </div>
          <div className="funds-row">
            <p>Options Premium</p><p>₹0.00</p>
          </div>
          <div className="funds-row">
            <p>Total Collateral</p><p>₹0.00</p>
          </div>
        </div>

        <div className="funds-card">
          <h5>Commodity</h5>
          <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-muted)" }}>
            <p style={{ marginBottom: "16px" }}>You don't have a commodity account</p>
            <button className="btn-outline-dark">Open Account</button>
          </div>
        </div>
      </div>

      {/* Add Funds Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h4>Add Funds</h4>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "16px" }}>
              Current balance: <strong style={{ color: "var(--text-primary)" }}>₹{fmt(balance)}</strong>
            </p>
            <input
              className="modal-input" type="number" placeholder="Enter amount (₹)"
              value={amount} onChange={e => setAmount(e.target.value)}
              autoFocus
            />
            {msg && <p style={{ fontSize: "12px", color: msg.startsWith("✅") ? "#26a69a" : "#ef5350", marginBottom: "12px" }}>{msg}</p>}
            <div className="modal-actions">
              <button className="btn-outline-dark" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="btn-primary-dark" onClick={handleAddFunds} disabled={processing}>
                {processing ? "Processing…" : "Add Funds"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="modal-overlay" onClick={() => setShowWithdrawModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h4>Withdraw Funds</h4>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "16px" }}>
              Available: <strong style={{ color: "var(--text-primary)" }}>₹{fmt(balance)}</strong>
            </p>
            <input className="modal-input" type="number" placeholder="Enter amount (₹)" value={amount} onChange={e => setAmount(e.target.value)} />
            <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "16px" }}>Funds will be credited to your bank account in 1-2 working days.</p>
            <div className="modal-actions">
              <button className="btn-outline-dark" onClick={() => setShowWithdrawModal(false)}>Cancel</button>
              <button className="btn-primary-dark">Request Withdrawal</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Funds;