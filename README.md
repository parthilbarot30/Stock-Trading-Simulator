# Zerodha — Stock Trading Simulator

A full-stack stock trading simulator inspired by Zerodha Kite. Built with the MERN stack, it lets users sign up, manage a virtual portfolio, place buy/sell orders, track real-time P&L, and simulate SIP investments — all in a dark-mode financial dashboard UI.

---
 
## 🔗 Live Demo
 
| App | URL |
|---|---|
| 🌐 Landing site | [stock-trading-simulator-pi.vercel.app](https://stock-trading-simulator-pi.vercel.app) |
| 📊 Trading dashboard | [your-dashboard-url.vercel.app](https://your-dashboard-url.vercel.app) |
| ⚙️ Backend API | [kite-backend-rkce.onrender.com](https://kite-backend-rkce.onrender.com) |
 
> **Note:** The backend is hosted on Render's free tier, which spins down after 15 minutes of inactivity. The first request after idle time may take 30–50 seconds to respond while the server wakes up — this is expected, not a bug.
 
---

## 🏗 Architecture

The project is split into **three independent apps**, each running on its own port:

```
/
├── backend/          → Node.js + Express + MongoDB  (port 3002)
├── frontend/         → React landing site            (port 3000)
└── dashboard/        → React trading dashboard       (port 3001)
```

```
User visits frontend (3000)
        │
        ▼
  Signup / Login  ──── HTTP POST ────▶  backend (3002)
        │                                    │
        │  JWT cookie set                    │  Auth + DB ops
        ▼                                    ▼
  Redirect to dashboard (3001)         MongoDB Atlas
        │
        ▼
  WatchList · Holdings · Orders · Funds · SIP
  (all fetch from backend with JWT cookie)
```
## ✨ Features

### 🌐 Frontend (Landing Site — port 3000)
| Page | Description |
|------|-------------|
| Home | Hero, pricing cards, trust section, stats strip, education |
| About | Company story, leadership team |
| Products | Kite, Coin, Varsity product showcases |
| Pricing | Feature breakdown, brokerage charge table |
| Support | Search bar, quick links, ticket category grid |
| Login | Email + password login with redirect to dashboard |
| Signup | Account creation with live password strength indicator |

### 📊 Dashboard (Trading App — port 3001)
| Module | Description |
|--------|-------------|
| **Summary** | Greeting, portfolio overview cards, total P&L strip |
| **WatchList** | 10 live-price stocks with Buy/Sell actions, chart modal, more menu |
| **Holdings** | DB-backed holdings table with per-stock and total P&L |
| **Positions** | Open intraday positions from MongoDB |
| **Orders** | Full order history with timestamps and status |
| **Funds** | Cash balance, Add Funds modal, Withdraw flow |
| **Wealth** | SIP calculator across 6 index funds with compound projections |

### ⚙️ Backend (API — port 3002)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/signup` | POST | Register a new user (bcrypt password hash) |
| `/login` | POST | Authenticate and set JWT cookie |
| `/profile` | GET | Fetch authenticated user profile |
| `/allHoldings` | GET | Get user's current holdings |
| `/allPositions` | GET | Get user's open positions |
| `/allOrders` | GET | Get user's order history |
| `/newOrder` | POST | Execute BUY or SELL order, update cash balance |
| `/funds` | GET | Get current cash balance |
| `/addFunds` | POST | Add virtual cash to account |

## 🛠 Tech Stack

**Frontend & Dashboard**
- React 18 (Create React App)
- React Router v6
- Chart.js + react-chartjs-2 (line chart, doughnut, bar)
- Material UI (`@mui/material`, `@mui/icons-material`)
- Axios
- Custom CSS (design token system via CSS variables)

**Backend**
- Node.js + Express
- Mongoose (MongoDB ODM)
- JSON Web Tokens (`jsonwebtoken`)
- bcryptjs (password hashing)
- cookie-parser
- dotenv
- cors

**Database**
- MongoDB (local or MongoDB Atlas)

```
backend/
├── controllers/
│   └── AuthController.js      # Login & Signup handlers
├── model/
│   ├── UserModel.js            # User schema (email, password, cashBalance)
│   ├── HoldingsModel.js
│   ├── OrdersModel.js
│   └── PositionsModel.js
├── routes/
│   └── AuthRoute.js            # /login, /signup
├── schemas/
│   ├── HoldingsSchema.js       # { userId, name, qty, avg, price, net, day }
│   ├── OrdersSchema.js         # { userId, name, qty, price, mode, createdAt }
│   └── PositionsSchema.js      # { userId, product, name, qty, avg, price, ... }
├── util/
│   └── SecretToken.js          # JWT creation helper
└── index.js                    # Express server, all API routes, order engine

frontend/
├── src/
│   ├── index.css               # Full design system (CSS variables, all components)
│   ├── index.js                # App entry, React Router setup
│   └── landing_page/
│       ├── Topbar.js
│       ├── Footer.js
│       ├── NotFound.js
│       ├── OpenAccount.js
│       ├── home/               # Hero, Pricing, Trust, Awards, Education
│       ├── about/              # Hero, Team
│       ├── pricing/            # Hero, Brokerage
│       ├── products/           # Hero, Universe
│       ├── support/            # Hero, CreateTicket
│       └── signup/             # Login.js, Signup.js

dashboard/
├── src/
│   ├── index.css               # Dark-mode dashboard design system
│   ├── index.js                # Dashboard app entry
│   └── components/
│       ├── Home.js             # TopBar + Dashboard wrapper
│       ├── TopBar.js           # Live NIFTY/SENSEX indices strip + nav
│       ├── Menu.js             # Sidebar navigation with active route
│       ├── Dashboard.js        # Route layout (all pages)
│       ├── GeneralContext.js   # BuyWindow/SellWindow global state
│       ├── WatchList.js        # Live watchlist with chart & more buttons
│       ├── StockChartModal.js  # Price chart popup (line chart, 5 ranges)
│       ├── StockChartModal.css
│       ├── MoreMenuDropdown.js # Alert, Info, NSE link, Remove actions
│       ├── MoreMenuDropdown.css
│       ├── BuyActionWindow.js  # Order form (Market/Limit/SL, qty stepper)
│       ├── BuyActionWindow.css
│       ├── Summary.js          # Dashboard home with P&L summary cards
│       ├── Holdings.js         # Holdings table + bar chart
│       ├── Positions.js        # Open positions table
│       ├── Orders.js           # Order history table
│       ├── Funds.js            # Cash balance + add/withdraw modals
│       ├── Wealth.js           # SIP calculator (6 index funds)
│       ├── DoughnoutChart.js   # Doughnut chart wrapper
│       └── VerticalGraph.js    # Bar chart wrapper
```

---

## 🔐 Authentication Flow

```
Signup ──▶ bcrypt hash password ──▶ save User to MongoDB
                                         │
                                         ▼
                               createSecretToken(userId)
                                         │
                                         ▼
                               Set httpOnly JWT cookie
                                         │
                                         ▼
                          Redirect to dashboard (localhost:3001)

Every dashboard API call ──▶ verifyToken middleware reads cookie
                                         │
                               jwt.verify(token, TOKEN_KEY)
                                         │
                               req.userId = decoded.id
                                         │
                          All queries scoped to that userId
```

New users start with **₹1,00,000** virtual cash (set in `UserModel.js` default).

---

## 💹 Order Execution Engine

When a `POST /newOrder` is received:

**BUY flow:**
1. Check `user.cashBalance >= qty × price`
2. Deduct cost from `cashBalance`
3. Upsert holding — if stock exists, recalculate weighted average cost
4. Save order record to `OrdersModel`

**SELL flow:**
1. Check holding exists and `holding.qty >= qty`
2. Reduce or delete holding
3. Credit proceeds to `cashBalance`
4. Save order record to `OrdersModel`

---

## 📊 WatchList Buttons

| Button | What it does |
|--------|-------------|
| **Buy** | Opens `BuyActionWindow` with Market/Limit/SL order form |
| **Sell** | Opens `BuyActionWindow` in SELL mode |
| **Chart** (📊) | Opens `StockChartModal` — live price line chart with 5 time ranges (1D/1W/1M/3M/1Y), OHLCV stats, NSE & Yahoo Finance links |
| **More** (⋯) | Opens `MoreMenuDropdown` — Set price alert, Stock info panel, View on NSE, Latest news, Remove from watchlist |

---

## 🌱 SIP / Wealth Module

Calculates SIP returns using the standard future value formula:

```
FV = P × [(1 + r)ⁿ - 1] / r × (1 + r)
```

Where:
- `P` = monthly investment amount
- `r` = monthly rate (annual CAGR ÷ 12)
- `n` = total months (years × 12)

Available index funds to simulate:

| Fund | Ticker | Hist. CAGR |
|------|--------|-----------|
| NIFTY 50 Index | NIFTYBEES | 13.5% |
| NIFTY NEXT 50 | JUNIORBEES | 14.2% |
| NIFTY MIDCAP 150 | MIDCAPBEES | 15.8% |
| NIFTY IT Index | ITBEES | 16.4% |
| S&P 500 (US) | MON100 | 12.8% |
| Gold ETF | GOLDBEES | 9.2% |

---

## 🧑‍💻 Development Notes

- **Prices are mocked** — the watchlist ticks every 1.5 seconds using a random walk algorithm (`±0.3%` per tick). No live market data API is used.
- **CORS** is configured to allow both `localhost:3000` and `localhost:3001`.
- **JWT** is stored as a cookie (not localStorage) for cross-origin dashboard access.
- **Chart data** in `StockChartModal` is generated fresh per session using `generatePriceHistory()`.
- The `data/data.js` file in the dashboard holds the initial watchlist seed data.

---

## 🔧 Environment Variables

Only the backend needs a `.env` file:

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URL` | MongoDB connection string | `mongodb://localhost:27017/kite` |
| `TOKEN_KEY` | Secret key for JWT signing | `my_super_secret_key_2024` |
| `PORT` | Backend server port | `3002` |

---

## 📦 Key Dependencies

### Backend
```json
"express": "^4.18.x",
"mongoose": "^7.x",
"jsonwebtoken": "^9.x",
"bcryptjs": "^2.4.x",
"cookie-parser": "^1.4.x",
"cors": "^2.8.x",
"dotenv": "^16.x"
```

### Frontend & Dashboard
```json
"react": "^18.x",
"react-router-dom": "^6.x",
"axios": "^1.x",
"chart.js": "^4.x",
"react-chartjs-2": "^5.x",
"@mui/material": "^5.x",
"@mui/icons-material": "^5.x"
```

---

## 🚧 Known Limitations & Future Work

- [ ] WebSocket integration for true real-time prices (currently mocked)
- [ ] Persistent price alerts (currently logs to console only)
- [ ] Options chain and F&O trading module
- [ ] Charting with TradingView Lightweight Charts for professional-grade OHLCV candles
- [ ] Email/SMS notifications for price alerts
- [ ] Admin panel to seed and manage stock data
- [ ] PWA support for mobile trading

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.
---

## 🙏 Acknowledgements

- Inspired by [Zerodha Kite](https://kite.zerodha.com/) — India's largest stock broker
- Index fund historical CAGR data sourced from public NSE/BSE records
- Built as a learning project for full-stack MERN development

---

> **Disclaimer:** This is a simulator for educational purposes only. No real money is involved. Virtual cash and prices are entirely fictional. Nothing in this project constitutes financial advice.
