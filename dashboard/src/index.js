// dashboard/src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import TopBar from "./components/TopBar";
import Dashboard from "./components/Dashboard";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <TopBar />
    <Routes>
      <Route path="/*" element={<Dashboard />} />
    </Routes>
  </BrowserRouter>
);