import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const NAV_LINKS = [
  { to: "/about",   label: "About"   },
  { to: "/product", label: "Products"},
  { to: "/pricing", label: "Pricing" },
  { to: "/support", label: "Support" },
];

function Topbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="lp-nav">
      <div className="lp-nav-inner">
        {/* Brand */}
        <Link to="/" className="lp-nav-brand" style={{ textDecoration: "none" }}>
          <img src="media/logo.svg" alt="Logo" className="logo" style={{ height: "25px" }} />
        </Link>

        {/* Desktop links */}
        <ul className="lp-nav-links" >
          {NAV_LINKS.map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                className={location.pathname === to ? "active" : ""}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="lp-nav-cta">
          <Link to="/login"  className="lp-btn lp-btn-ghost lp-btn-sm">Log in</Link>
          <Link to="/signup" className="lp-btn lp-btn-primary lp-btn-sm">Open account</Link>
        </div>
      </div>
    </nav>
  );
}

export default Topbar;