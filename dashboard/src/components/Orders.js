// dashboard/src/components/Orders.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3002/allOrders", { credentials: "include" })
      .then(r => r.json())
      .then(data => { setOrders(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading orders…</div>;

  if (orders.length === 0) {
    return (
      <div className="orders">
        <div className="no-orders">
          <p>You haven't placed any orders yet</p>
          <Link to="/" className="btn-ghost">Go to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <h3 className="title">Orders <span>({orders.length})</span></h3>
      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Type</th>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Price</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index}>
                <td style={{ color: "var(--text-muted)", fontSize: "12px" }}>
                  {new Date(order.createdAt).toLocaleString("en-IN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short" })}
                </td>
                <td><span className={`badge ${order.mode === "BUY" ? "badge-buy" : "badge-sell"}`}>{order.mode}</span></td>
                <td style={{ fontWeight: 600 }}>{order.name}</td>
                <td>{order.qty}</td>
                <td>₹{parseFloat(order.price).toFixed(2)}</td>
                <td>₹{(order.qty * order.price).toFixed(2)}</td>
                <td><span style={{ fontSize: "12px", color: "#26a69a" }}>✓ COMPLETE</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Orders;