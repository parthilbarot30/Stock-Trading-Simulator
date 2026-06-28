import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="lp-404">
      <div>
        <div className="big-number">404</div>
        <h2>Page not found</h2>
        <p>Sorry, the page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="lp-btn lp-btn-primary lp-btn-lg">Go home</Link>
      </div>
    </div>
  );
}

export default NotFound;