// backend/index.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const authRoutes = require("./routes/AuthRoute");
const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");
const User = require("./model/UserModel");

const app = express();
const PORT = process.env.PORT || 3002;

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: ["http://localhost:3000", "http://localhost:3001"], credentials: true }));
app.use(express.json());
app.use(cookieParser());

// ─── Auth Middleware ───────────────────────────────────────────────────────────
const verifyToken = (req, res, next) => {
  const token = req.cookies.token || req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ─── Auth Routes ──────────────────────────────────────────────────────────────
app.use("/", authRoutes);

// ─── Holdings ─────────────────────────────────────────────────────────────────
app.get("/allHoldings", verifyToken, async (req, res) => {
  try {
    const holdings = await HoldingsModel.find({ userId: req.userId });
    res.json(holdings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching holdings" });
  }
});

// ─── Positions ────────────────────────────────────────────────────────────────
app.get("/allPositions", verifyToken, async (req, res) => {
  try {
    const positions = await PositionsModel.find({ userId: req.userId });
    res.json(positions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching positions" });
  }
});

// ─── Orders ───────────────────────────────────────────────────────────────────
app.get("/allOrders", verifyToken, async (req, res) => {
  try {
    const orders = await OrdersModel.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});

// ─── New Order (BUY/SELL Engine) ──────────────────────────────────────────────
app.post("/newOrder", verifyToken, async (req, res) => {
  try {
    const { name, qty, price, mode } = req.body;
    const userId = req.userId;

    if (!name || !qty || !price || !mode) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const totalCost = parseFloat(price) * parseInt(qty);

    if (mode === "BUY") {
      if ((user.cashBalance || 0) < totalCost) {
        return res.status(400).json({ message: "Insufficient funds" });
      }

      // Deduct cash
      await User.findByIdAndUpdate(userId, { $inc: { cashBalance: -totalCost } });

      // Update or create holding
      const existingHolding = await HoldingsModel.findOne({ userId, name });
      if (existingHolding) {
        const newQty = existingHolding.qty + parseInt(qty);
        const newAvg = ((existingHolding.avg * existingHolding.qty) + totalCost) / newQty;
        await HoldingsModel.findByIdAndUpdate(existingHolding._id, {
          qty: newQty,
          avg: parseFloat(newAvg.toFixed(2)),
          price: parseFloat(price),
        });
      } else {
        await HoldingsModel.create({
          userId,
          name,
          qty: parseInt(qty),
          avg: parseFloat(price),
          price: parseFloat(price),
          net: "+0.00%",
          day: "+0.00%",
        });
      }
    } else if (mode === "SELL") {
      const existingHolding = await HoldingsModel.findOne({ userId, name });
      if (!existingHolding || existingHolding.qty < parseInt(qty)) {
        return res.status(400).json({ message: "Insufficient holdings to sell" });
      }

      const newQty = existingHolding.qty - parseInt(qty);
      if (newQty === 0) {
        await HoldingsModel.findByIdAndDelete(existingHolding._id);
      } else {
        await HoldingsModel.findByIdAndUpdate(existingHolding._id, { qty: newQty });
      }

      // Credit cash
      await User.findByIdAndUpdate(userId, { $inc: { cashBalance: totalCost } });
    }

    // Save order record
    await OrdersModel.create({ userId, name, qty: parseInt(qty), price: parseFloat(price), mode, createdAt: new Date() });

    res.status(201).json({ message: "Order placed successfully", success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Order failed" });
  }
});

// ─── Funds: Get Balance ───────────────────────────────────────────────────────
app.get("/funds", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("cashBalance username email");
    res.json({ cashBalance: user.cashBalance || 0, username: user.username, email: user.email });
  } catch (err) {
    res.status(500).json({ message: "Error fetching funds" });
  }
});

// ─── Funds: Add Balance ───────────────────────────────────────────────────────
app.post("/addFunds", verifyToken, async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ message: "Invalid amount" });
    await User.findByIdAndUpdate(req.userId, { $inc: { cashBalance: parseFloat(amount) } });
    const user = await User.findById(req.userId);
    res.json({ message: "Funds added", cashBalance: user.cashBalance, success: true });
  } catch (err) {
    res.status(500).json({ message: "Error adding funds" });
  }
});

// ─── User Profile ─────────────────────────────────────────────────────────────
app.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
});

// ─── DB + Server ──────────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ DB connection error:", err));