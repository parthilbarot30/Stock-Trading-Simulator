// dashboard/src/components/Menu.js
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Menu = () => {
  const location = useLocation();
  const [username, setUsername] = useState("ZU");
  const [initials, setInitials] = useState("ZU");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/profile`, { credentials: "include" })
      .then(r => r.json())
      .then(data => {
        if (data.username) {
          setUsername(data.username);
          setInitials(data.username.slice(0, 2).toUpperCase());
        }
      })
      .catch(() => {});
  }, []);

  const navItems = [
    { path: "/", label: "Dashboard" },
    { path: "/orders", label: "Orders" },
    { path: "/holdings", label: "Holdings" },
    { path: "/positions", label: "Positions" },
    { path: "/funds", label: "Funds" },
    { path: "/wealth", label: "Wealth" },
    { path: "/apps", label: "Apps" },
  ];

  return (
    <div className="menu-container">
      <img src="logo.svg" alt="Logo" className="logo" style={{ height: "20px" , width: "130px"}} />
      <div className="menus">
        <ul>
          {navItems.map(item => (
            <li key={item.path}>
              <Link style={{ textDecoration: "none" }} to={item.path}>
                <p className={location.pathname === item.path ? "menu selected" : "menu"}>
                  {item.label}
                </p>
              </Link>
            </li>
          ))}
        </ul>
        <div className="profile">
          <div className="avatar">{initials}</div>
          <p className="username">{username}</p>
        </div>
      </div>
    </div>
  );
};

export default Menu;