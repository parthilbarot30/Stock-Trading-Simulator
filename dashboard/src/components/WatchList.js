import React, { useState, useContext, useEffect } from "react";
import GeneralContext from "./GeneralContext";
import { Tooltip, Grow } from "@mui/material";
import { BarChartOutlined, KeyboardArrowDown, KeyboardArrowUp, MoreHoriz } from "@mui/icons-material";
import { DoughnutChart } from "./DoughnoutChart";

import StockChartModel from "./StockChartModel";
import Moremenudropdown from "./Moremenudropdown";

const INITIAL_WATCHLIST = [
  { name: "INFY", price: 1482.50, percent: "+1.23%", isDown: false },
  { name: "TCS", price: 3541.20, percent: "-0.45%", isDown: true },
  { name: "RELIANCE", price: 2847.80, percent: "+0.89%", isDown: false },
  { name: "HDFCBANK", price: 1621.10, percent: "-0.22%", isDown: true },
  { name: "WIPRO", price: 452.35, percent: "+2.10%", isDown: false },
  { name: "ICICIBANK", price: 1089.60, percent: "+0.67%", isDown: false },
  { name: "BAJFINANCE", price: 6932.75, percent: "-1.05%", isDown: true },
  { name: "MARUTI", price: 10245.30, percent: "+0.33%", isDown: false },
  { name: "SUNPHARMA", price: 1347.90, percent: "+1.88%", isDown: false },
  { name: "NIFTY50", price: 22450.35, percent: "+0.52%", isDown: false },
];

const WatchList = () => {
  const [stocks, setStocks] = useState(INITIAL_WATCHLIST);
  const [search, setSearch] = useState("");
  const [activeChartStock, setActiveChartStock] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prev => prev.map(stock => {
        const delta = (Math.random() - 0.48) * (stock.price * 0.003);
        const newPrice = parseFloat((stock.price + delta).toFixed(2));
        const basePrice = INITIAL_WATCHLIST.find(s => s.name === stock.name)?.price || stock.price;
        const changePct = ((newPrice - basePrice) / basePrice * 100);
        return {
          ...stock,
          price: newPrice,
          percent: `${changePct >= 0 ? "+" : ""}${changePct.toFixed(2)}%`,
          isDown: changePct < 0,
        };
      }));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const handleDeleteStock = (stockName) => {
    setStocks(prev => prev.filter(s => s.name !== stockName));
  };

  const filtered = stocks.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  const chartData = {
    labels: filtered.map(s => s.name),
    datasets: [{
      label: "Price",
      data: filtered.map(s => s.price),
      backgroundColor: [
        "rgba(33,150,243,0.6)", "rgba(38,166,154,0.6)", "rgba(239,83,80,0.6)",
        "rgba(245,158,11,0.6)", "rgba(139,92,246,0.6)", "rgba(236,72,153,0.6)",
        "rgba(16,185,129,0.6)", "rgba(249,115,22,0.6)", "rgba(99,102,241,0.6)",
        "rgba(20,184,166,0.6)",
      ],
      borderWidth: 0,
    }],
  };

  return (
    <div className="watchlist-container">
      <div className="search-container">
        <input
          type="text" placeholder="Search stocks…" className="search"
          value={search} onChange={e => setSearch(e.target.value)}
        />
        <span className="counts">{filtered.length}/50</span>
      </div>

      <ul className="list">
        {filtered.map((stock, index) => (
          <WatchListItem 
            stock={stock} 
            onDelete={handleDeleteStock} 
            onOpenChart={setActiveChartStock}
            key={index} 
          />
        ))}
      </ul>

      <DoughnutChart data={chartData} />

      {activeChartStock && (
        <StockChartModel 
          stock={activeChartStock} 
          onClose={() => setActiveChartStock(null)} 
        />
      )}
    </div>
  );
};

export default WatchList;

const WatchListItem = ({ stock, onDelete, onOpenChart }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <li onMouseEnter={() => setShowActions(true)} onMouseLeave={() => setShowActions(false)}>
      <div className="item">
        <p className={stock.isDown ? "down" : "up"}>{stock.name}</p>
        <div className="itemInfo">
          <span className={`percent ${stock.isDown ? "down" : "up"}`} style={{ fontSize: "11px" }}>
            {stock.percent}
          </span>
          {stock.isDown
            ? <KeyboardArrowDown style={{ fontSize: 14, color: "#ef5350" }} />
            : <KeyboardArrowUp style={{ fontSize: 14, color: "#26a69a" }} />
          }
          <span className="price">₹{stock.price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      </div>
      {showActions && (
        <WatchListActions 
          stock={stock} 
          onDelete={onDelete} 
          onOpenChart={onOpenChart}
        />
      )}
    </li>
  );
};

const WatchListActions = ({ stock, onDelete, onOpenChart }) => {
  const { openBuyWindow, openSellWindow } = useContext(GeneralContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <span className="actions">
      <span>
        <Tooltip title="Buy (B)" placement="top" arrow TransitionComponent={Grow}>
          <button className="buy" onClick={() => openBuyWindow(stock.name)}>Buy</button>
        </Tooltip>
        <Tooltip title="Sell (S)" placement="top" arrow TransitionComponent={Grow}>
          <button className="sell" onClick={() => openSellWindow(stock.name)}>Sell</button>
        </Tooltip>
        
        <Tooltip title="Chart" placement="top" arrow TransitionComponent={Grow}>
          <button className="action" onClick={() => onOpenChart(stock)}>
            <BarChartOutlined className="icon" />
          </button>
        </Tooltip>

        <span style={{ position: "relative", display: "inline-block" }}>
          <Tooltip title="More" placement="top" arrow TransitionComponent={Grow}>
            <button className="action" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <MoreHoriz className="icon" />
            </button>
          </Tooltip>
          {isMenuOpen && (
            <Moremenudropdown 
              stock={stock} 
              onDelete={onDelete} 
              onClose={() => setIsMenuOpen(false)} 
            />
          )}
        </span>
      </span>
    </span>
  );
};