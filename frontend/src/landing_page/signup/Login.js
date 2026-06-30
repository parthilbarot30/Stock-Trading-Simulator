import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please enter your email and password."); return; }

    setLoading(true);
    try {
      const res  = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data?.success) {
        window.location.href = process.env.REACT_APP_DASHBOARD_URL;
      } else {
        setError(data?.message || "Login failed. Please try again.");
      }
    } catch {
      setError("Network error — is the server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lp-auth-page">
      <div className="lp-auth-card">
        <div className="lp-auth-logo">
          <div className="lp-auth-logo-dot">K</div>
          Kite
        </div>

        <h1 className="lp-auth-title">Welcome back</h1>
        <p className="lp-auth-sub">Log in to your trading account</p>

        {error && (
          <div className="lp-alert lp-alert-error">
            <span>⚠</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="lp-field">
            <label className="lp-label-text" htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              className="lp-input"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoFocus
              autoComplete="email"
            />
          </div>

          <div className="lp-field">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <label className="lp-label-text" htmlFor="password" style={{ margin: 0 }}>Password</label>
            </div>
            <input
              id="password"
              type="password"
              className="lp-input"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="lp-btn lp-btn-primary"
            style={{ width: "100%", justifyContent: "center", padding: "12px", fontSize: "14px", marginTop: "4px" }}
            disabled={loading}
          >
            {loading ? <><span className="lp-spinner" /> Signing in…</> : "Sign in"}
          </button>
        </form>

        <div className="lp-auth-footer">
          Don't have an account?{" "}
          <Link to="/signup">Create one free</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;