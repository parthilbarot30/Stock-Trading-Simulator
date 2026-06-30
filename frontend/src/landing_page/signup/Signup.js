import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function getPasswordStrength(pw) {
  if (!pw) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 8)              score++;
  if (/[A-Z]/.test(pw))           score++;
  if (/[0-9]/.test(pw))           score++;
  if (/[^A-Za-z0-9]/.test(pw))    score++;
  const map = [
    { label: "",         color: "" },
    { label: "Weak",     color: "var(--red)" },
    { label: "Fair",     color: "var(--amber)" },
    { label: "Good",     color: "#6dba5e" },
    { label: "Strong",   color: "var(--teal)" },
  ];
  return { score, ...map[score] };
}

function Signup() {
  const [username, setUsername] = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const navigate = useNavigate();

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!username || !email || !password) { setError("Please fill in all fields."); return; }
    if (password !== confirm)              { setError("Passwords do not match."); return; }
    if (password.length < 6)              { setError("Password must be at least 6 characters."); return; }

    setLoading(true);
    try {
      const res  = await fetch(`${process.env.REACT_APP_API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (data?.success) {
        navigate("/login");
      } else {
        setError(data?.message || "Signup failed. Please try again.");
      }
    } catch {
      setError("Network error — is the server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lp-auth-page">
      <div className="lp-auth-card" style={{ maxWidth: "460px" }}>
        <div className="lp-auth-logo">
          <div className="lp-auth-logo-dot">K</div>
          Kite
        </div>

        <h1 className="lp-auth-title">Create your account</h1>
        <p className="lp-auth-sub">
          Start investing in minutes — free account, no minimums.
        </p>

        {error && (
          <div className="lp-alert lp-alert-error">
            <span>⚠</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="lp-field">
            <label className="lp-label-text" htmlFor="username">Full name</label>
            <input
              id="username"
              className="lp-input"
              placeholder="Your name"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoFocus
              autoComplete="name"
            />
          </div>

          <div className="lp-field">
            <label className="lp-label-text" htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              className="lp-input"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="lp-field">
            <label className="lp-label-text" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="lp-input"
              placeholder="Min. 6 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            {password && (
              <div style={{ marginTop: "6px" }}>
                <div className="lp-pw-bar">
                  <div
                    className="lp-pw-bar-fill"
                    style={{ width: `${strength.score * 25}%`, background: strength.color }}
                  />
                </div>
                <p style={{ fontSize: "11px", color: strength.color, marginTop: "4px", fontWeight: 600 }}>
                  {strength.label}
                </p>
              </div>
            )}
          </div>

          <div className="lp-field">
            <label className="lp-label-text" htmlFor="confirm">Confirm password</label>
            <input
              id="confirm"
              type="password"
              className="lp-input"
              placeholder="Repeat password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              autoComplete="new-password"
              style={confirm && confirm !== password ? { borderColor: "var(--red)" } : {}}
            />
            {confirm && confirm !== password && (
              <p style={{ fontSize: "11px", color: "var(--red)", marginTop: "4px" }}>Passwords don't match</p>
            )}
          </div>

          <button
            type="submit"
            className="lp-btn lp-btn-primary"
            style={{ width: "100%", justifyContent: "center", padding: "12px", fontSize: "14px" }}
            disabled={loading}
          >
            {loading ? <><span className="lp-spinner" /> Creating account…</> : "Create account — it's free"}
          </button>

          <p style={{ fontSize: "11px", color: "var(--muted)", textAlign: "center", marginTop: "12px" }}>
            By signing up you agree to our{" "}
            <a href="#" style={{ color: "var(--blue)" }}>Terms of Service</a> and{" "}
            <a href="#" style={{ color: "var(--blue)" }}>Privacy Policy</a>.
          </p>
        </form>

        <div className="lp-auth-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;