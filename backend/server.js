const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let holdings = [
  {
    name: "INFY",
    qty: 40,
    avg: 3150.5,
    price: 3194.8,
    net: "+177.80",
    day: "+0.78%",
    isLoss: false,
  },
  {
    name: "TCS",
    qty: 25,
    avg: 2790.4,
    price: 2834.2,
    net: "+108.50",
    day: "+0.64%",
    isLoss: false,
  },
  {
    name: "RELIANCE",
    qty: 15,
    avg: 2550.0,
    price: 2518.7,
    net: "-46.50",
    day: "-0.22%",
    isLoss: true,
  },
  {
    name: "HDFC",
    qty: 60,
    avg: 2510.0,
    price: 2545.3,
    net: "+34.30",
    day: "+0.14%",
    isLoss: false,
  },
];

app.get("/allHoldings", (req, res) => {
  res.json(holdings);
});

app.post("/newOrder", (req, res) => {
  const order = req.body;
  if (!order || !order.name || !order.qty || !order.price) {
    return res.status(400).json({ error: "Invalid order payload" });
  }

  const newHolding = {
    name: order.name,
    qty: Number(order.qty),
    avg: Number(order.price),
    price: Number(order.price),
    net: "+0.00",
    day: "+0.00%",
    isLoss: false,
  };

  holdings.push(newHolding);
  res.status(201).json({ success: true, order: newHolding });
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Backend API listening on http://localhost:${PORT}`);
});
