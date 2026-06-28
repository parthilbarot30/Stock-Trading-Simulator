import React from "react";
import { Link } from "react-router-dom";

const LINKS = {
  Company: ["About", "Products", "Pricing", "Referral programme", "Careers", "Press & media", "Kite.tech"],
  Support: ["Contact", "Support portal", "Z-Connect blog", "List of charges", "Downloads"],
  Account: ["Open an account", "Fund transfer", "60 day challenge", "National Pension System"],
};

function Footer() {
  return (
    <footer className="lp-footer">
      <div className="lp-footer-inner">
        <div className="lp-footer-top">
          {/* Brand col */}
          <div>
            <div className="lp-footer-brand">
              <div className="lp-nav-brand-icon">K</div>
              Kite
            </div>
            <p className="lp-footer-tagline">
              &copy; 2010 – {new Date().getFullYear()}, Kite Broking Ltd.<br />
              All rights reserved.
            </p>
          </div>

          {/* Link cols */}
          {Object.entries(LINKS).map(([title, items]) => (
            <div key={title}>
              <p className="lp-footer-col-title">{title}</p>
              <ul className="lp-footer-links">
                {items.map(item => (
                  <li key={item}><a href="#">{item}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="lp-footer-bottom">
          <p className="lp-footer-legal">
            Kite Broking Ltd.: Member of NSE &amp; BSE — SEBI Registration no.: INZ000031633.
            CDSL: Depository services through Kite Securities Pvt. Ltd. — SEBI Registration no.: IN-DP-100-2015.
            Registered Address: Kite Broking Ltd., #153/154, 4th Cross, J.P. Nagar 4th Phase, Bengaluru – 560078, Karnataka, India.
            Investments in securities market are subject to market risks; read all related documents carefully before investing.
          </p>
          <p className="lp-footer-legal">
            Prevent unauthorised transactions in your account. Update your mobile number/email ID with your stock broker. Receive
            information of your transactions directly from Exchange on your mobile/email at the end of the day.
          </p>
          <p className="lp-footer-copy">
            As a business we don't give stock tips, and have not authorised anyone to trade on behalf of others.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;