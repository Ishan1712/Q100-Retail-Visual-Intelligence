import React, { useState } from "react";
import { Warning, TrendUp, TrendDown, Minus, Eye, EyeSlash, Envelope, Package, Storefront, Crown, Star, CaretDown, CaretUp, CurrencyInr, ChartLineUp, Wallet, ShoppingCart } from "@phosphor-icons/react";
import "./Regional.css";

/* ── Product Performance Data (Manager — single store view) ── */
const topSelling = [
  { rank: 1, product: "Parle-G 250g", category: "Biscuits", units: 340, revenue: 5100, stock: "in" },
  { rank: 2, product: "Amul Taza 500ml", category: "Dairy", units: 280, revenue: 7000, stock: "in" },
  { rank: 3, product: "Maggi 2-Min Noodles", category: "Noodles", units: 260, revenue: 3120, stock: "low" },
  { rank: 4, product: "Tata Salt 1kg", category: "Staples", units: 220, revenue: 4400, stock: "in" },
  { rank: 5, product: "Surf Excel 1kg", category: "Household", units: 195, revenue: 5850, stock: "in" },
  { rank: 6, product: "Britannia Good Day", category: "Biscuits", units: 180, revenue: 3600, stock: "in" },
  { rank: 7, product: "Lay's Classic 52g", category: "Snacks", units: 175, revenue: 3500, stock: "low" },
  { rank: 8, product: "Colgate MaxFresh", category: "Personal Care", units: 165, revenue: 4950, stock: "in" },
  { rank: 9, product: "Fortune Oil 1L", category: "Cooking", units: 155, revenue: 6200, stock: "in" },
  { rank: 10, product: "Thums Up 750ml", category: "Beverages", units: 150, revenue: 6000, stock: "in" },
];

const slowMoving = [
  { rank: 1, product: "Organic Quinoa 500g", category: "Health", units: 2, daysOnShelf: 45, action: "Consider removing" },
  { rank: 2, product: "Premium Dark Chocolate", category: "Confectionery", units: 3, daysOnShelf: 38, action: "Move to lower shelf" },
  { rank: 3, product: "Almond Butter 200g", category: "Health", units: 3, daysOnShelf: 36, action: "Reduce order quantity" },
  { rank: 4, product: "Chia Seeds 250g", category: "Health", units: 4, daysOnShelf: 32, action: "Bundle with popular items" },
  { rank: 5, product: "Flax Seed Oil 500ml", category: "Health", units: 4, daysOnShelf: 30, action: "Consider removing" },
  { rank: 6, product: "Gluten-Free Pasta", category: "Health", units: 5, daysOnShelf: 28, action: "Reduce facings" },
  { rank: 7, product: "Artisan Granola 400g", category: "Breakfast", units: 5, daysOnShelf: 26, action: "Discount & clear" },
  { rank: 8, product: "Coconut Aminos 250ml", category: "Health", units: 6, daysOnShelf: 24, action: "Move to endcap" },
  { rank: 9, product: "Truffle Oil 100ml", category: "Cooking", units: 6, daysOnShelf: 22, action: "Reduce order quantity" },
  { rank: 10, product: "Matcha Powder 100g", category: "Beverages", units: 7, daysOnShelf: 20, action: "Reduce facings" },
];

/* ── Heatmap: Sales by Category × Store ── */
const categories = ["Dairy", "Staples", "Beverages", "Snacks", "Personal Care", "Household"];
const storeNames = ["Q-Mart Pune", "Q-Mart Mumbai", "Q-Mart Nashik", "Q-Mart Nagpur", "Q-Mart Nagpur-S"];
const salesData = {
  "Q-Mart Pune":     [1.8, 2.4, 1.2, 0.9, 0.6, 0.4],
  "Q-Mart Mumbai":   [2.1, 1.9, 1.5, 1.1, 0.8, 0.5],
  "Q-Mart Nashik":   [1.2, 1.6, 0.9, 0.7, 0.4, 0.3],
  "Q-Mart Nagpur":   [1.4, 1.7, 1.0, 0.8, 0.5, 0.3],
  "Q-Mart Nagpur-S": [0.8, 1.0, 0.6, 0.5, 0.3, 0.2],
};

const salesColor = (v) => v >= 1.8 ? "hm-darkgreen" : v >= 1.2 ? "hm-green" : v >= 0.7 ? "hm-amber" : v >= 0.4 ? "hm-red" : "hm-deepred";

/* ── Drill-down data ── */
const drillDownData = {
  "Q-Mart Pune-Dairy": { top5: ["Amul Taza 500ml — ₹18K", "Mother Dairy Curd — ₹12K", "Amul Butter 500g — ₹9K", "Nestle Dahi — ₹6K", "Govardhan Paneer — ₹5K"], emptyCount: 4, note: "Dairy at Pune: Strong performance. Amul Taza is #1 seller." },
  "Q-Mart Nagpur-S-Dairy": { top5: ["Amul Taza 500ml — ₹6K", "Mother Dairy Curd — ₹4K", "Amul Butter 500g — ₹3K"], emptyCount: 12, note: "Dairy at Nagpur-S: Amul Taza out of stock 3 times this week — ₹12K lost." },
  "Q-Mart Mumbai-Beverages": { top5: ["Thums Up 750ml — ₹14K", "Coca-Cola 1.25L — ₹11K", "Sprite 500ml — ₹8K", "Pepsi 2L — ₹6K", "Maaza 600ml — ₹5K"], emptyCount: 8, note: "Beverages at Mumbai: High footfall drives sales. Restocking is fast." },
};

/* ── Action Required items ── */
const actionItems = [
  { store: "Q-Mart Nagpur-S", issue: "Dairy section empty 12 times this week. Assign extra staff during peak hours.", priority: "high" },
  { store: "Q-Mart Nashik", issue: "Beverages restock takes 18 min avg — losing ₹12K. Need more storeroom staff.", priority: "high" },
  { store: "Q-Mart Nagpur", issue: "Snacks endcap not replenished for 2 days — popular Lay's Classic running low.", priority: "medium" },
  { store: "Q-Mart Pune", issue: "Maggi 2-Min stock critically low at Nagpur — transfer 2 cases from Pune warehouse.", priority: "medium" },
];

/* ── Top Sale Stores (Regional Owner view) ── */
const topStores = [
  { rank: 1, store: "Q-Mart Kothrud", city: "Pune", dailySales: 48500, growth: 12.3, compliance: 94, topCategory: "Dairy" },
  { rank: 2, store: "Q-Mart Hinjewadi", city: "Pune", dailySales: 42200, growth: 8.7, compliance: 91, topCategory: "Snacks" },
  { rank: 3, store: "Q-Mart Wakad", city: "Pune", dailySales: 38900, growth: 5.2, compliance: 88, topCategory: "Beverages" },
  { rank: 4, store: "Q-Mart Baner", city: "Pune", dailySales: 35600, growth: -2.1, compliance: 85, topCategory: "Staples" },
  { rank: 5, store: "Q-Mart Viman Nagar", city: "Pune", dailySales: 31200, growth: 3.8, compliance: 82, topCategory: "Personal Care" },
];

/* ── Store-wise Top Selling Products (Regional Owner view) ── */
const storeProducts = [
  {
    store: "Q-Mart Kothrud", city: "Pune", dailySales: 48500, compliance: 94,
    products: [
      { rank: 1, product: "Amul Taza 500ml", category: "Dairy", units: 120, revenue: 3000 },
      { rank: 2, product: "Parle-G 250g", category: "Biscuits", units: 95, revenue: 1425 },
      { rank: 3, product: "Maggi 2-Min Noodles", category: "Noodles", units: 88, revenue: 1056 },
      { rank: 4, product: "Tata Salt 1kg", category: "Staples", units: 72, revenue: 1440 },
      { rank: 5, product: "Thums Up 750ml", category: "Beverages", units: 65, revenue: 2600 },
    ]
  },
  {
    store: "Q-Mart Hinjewadi", city: "Pune", dailySales: 42200, compliance: 91,
    products: [
      { rank: 1, product: "Lay's Classic 52g", category: "Snacks", units: 110, revenue: 2200 },
      { rank: 2, product: "Coca-Cola 750ml", category: "Beverages", units: 98, revenue: 3920 },
      { rank: 3, product: "Britannia Good Day", category: "Biscuits", units: 85, revenue: 1700 },
      { rank: 4, product: "Surf Excel 1kg", category: "Household", units: 60, revenue: 1800 },
      { rank: 5, product: "Amul Butter 500g", category: "Dairy", units: 55, revenue: 1375 },
    ]
  },
  {
    store: "Q-Mart Wakad", city: "Pune", dailySales: 38900, compliance: 88,
    products: [
      { rank: 1, product: "Thums Up 750ml", category: "Beverages", units: 105, revenue: 4200 },
      { rank: 2, product: "Parle-G 250g", category: "Biscuits", units: 90, revenue: 1350 },
      { rank: 3, product: "Fortune Oil 1L", category: "Cooking", units: 70, revenue: 2800 },
      { rank: 4, product: "Colgate MaxFresh", category: "Personal Care", units: 62, revenue: 1860 },
      { rank: 5, product: "Maggi 2-Min Noodles", category: "Noodles", units: 58, revenue: 696 },
    ]
  },
  {
    store: "Q-Mart Baner", city: "Pune", dailySales: 35600, compliance: 85,
    products: [
      { rank: 1, product: "Tata Salt 1kg", category: "Staples", units: 95, revenue: 1900 },
      { rank: 2, product: "Amul Taza 500ml", category: "Dairy", units: 80, revenue: 2000 },
      { rank: 3, product: "Surf Excel 1kg", category: "Household", units: 68, revenue: 2040 },
      { rank: 4, product: "Lay's Classic 52g", category: "Snacks", units: 55, revenue: 1100 },
      { rank: 5, product: "Britannia Good Day", category: "Biscuits", units: 50, revenue: 1000 },
    ]
  },
  {
    store: "Q-Mart Viman Nagar", city: "Pune", dailySales: 31200, compliance: 82,
    products: [
      { rank: 1, product: "Colgate MaxFresh", category: "Personal Care", units: 85, revenue: 2550 },
      { rank: 2, product: "Parle-G 250g", category: "Biscuits", units: 78, revenue: 1170 },
      { rank: 3, product: "Coca-Cola 750ml", category: "Beverages", units: 65, revenue: 2600 },
      { rank: 4, product: "Fortune Oil 1L", category: "Cooking", units: 52, revenue: 2080 },
      { rank: 5, product: "Amul Butter 500g", category: "Dairy", units: 48, revenue: 1200 },
    ]
  },
];

const BrandHeatmap = ({ role }) => {
  const [drillDown, setDrillDown] = useState(null);
  const [expandedStore, setExpandedStore] = useState(null);
  const now = new Date();
  const timestamp = now.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) + ", " + now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  const isManager = role === "manager";

  return (
    <div className="reg-screen">
      <div className="owner-timestamp">Data as of: {timestamp}</div>

      <div style={{ marginBottom: -4 }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>{isManager ? "Product Intelligence" : "Revenue Intelligence"}</h2>
        <span style={{ fontSize: ".72rem", color: "#64748b" }}>
          {isManager ? "What's selling, what's not, and where are the gaps?" : "Revenue performance, top stores, and sales insights"}
        </span>
      </div>

      {/* ── Manager: Product tables for single store ── */}
      {isManager && (
        <div className="reg-body">
          <div className="reg-left">
            <div className="reg-card" style={{ display: "flex", flexDirection: "column" }}>
              <h3 style={{ color: "#059669" }}><TrendUp size={16} weight="fill" /> Top 10 Best Selling Products</h3>
              <div className="reg-table-scroll">
                <table className="owner-table compact">
                  <thead>
                    <tr><th>#</th><th>Product</th><th>Category</th><th>Units/Day</th></tr>
                  </thead>
                  <tbody>
                    {topSelling.map(p => (
                      <tr key={p.rank}>
                        <td style={{ fontWeight: 800 }}>{p.rank}</td>
                        <td style={{ fontWeight: 700 }}>{p.product}</td>
                        <td style={{ color: "#64748b" }}>{p.category}</td>
                        <td style={{ fontWeight: 700 }}>{p.units}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="reg-right">
            <div className="reg-card">
              <h3 style={{ color: "#f59e0b" }}><Package size={16} weight="fill" /> Top 10 Slowest Moving Products</h3>
              <div className="reg-table-scroll">
                <table className="owner-table compact">
                  <thead>
                    <tr><th>#</th><th>Product</th><th>Category</th><th>Units/Day</th><th>Action</th></tr>
                  </thead>
                  <tbody>
                    {slowMoving.map(p => (
                      <tr key={p.rank}>
                        <td style={{ fontWeight: 800 }}>{p.rank}</td>
                        <td style={{ fontWeight: 700 }}>{p.product}</td>
                        <td style={{ color: "#64748b" }}>{p.category}</td>
                        <td style={{ fontWeight: 700 }}>{p.units}</td>
                        <td style={{ fontSize: ".66rem", color: "#f59e0b", fontWeight: 700 }}>{p.action}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Regional Owner: Revenue Summary + Top Stores + Products ── */}
      {!isManager && (
        <>
          {/* ── Revenue Summary Strip ── */}
          <div className="rev-summary-strip">
            <div className="rev-summary-card rev-total">
              <div className="rev-sum-icon" style={{ background: "#dcfce7", color: "#059669" }}>
                <CurrencyInr size={20} weight="bold" />
              </div>
              <div className="rev-sum-body">
                <span className="rev-sum-label">Total Revenue</span>
                <strong className="rev-sum-value">₹9.84L<span className="rev-sum-period">/day</span></strong>
                <span className="rev-sum-sub">All 5 stores combined</span>
              </div>
              <span className="rev-sum-trend rev-trend-up"><TrendUp size={12} weight="bold" /> +8.2%</span>
            </div>
            <div className="rev-summary-card">
              <div className="rev-sum-icon" style={{ background: "#dbeafe", color: "#2563eb" }}>
                <Wallet size={20} weight="bold" />
              </div>
              <div className="rev-sum-body">
                <span className="rev-sum-label">Revenue Recovered</span>
                <strong className="rev-sum-value">₹12.7L<span className="rev-sum-period">/mo</span></strong>
                <span className="rev-sum-sub">Via Q100 OOS prevention</span>
              </div>
              <span className="rev-sum-trend rev-trend-up"><TrendUp size={12} weight="bold" /> +23%</span>
            </div>
            <div className="rev-summary-card">
              <div className="rev-sum-icon" style={{ background: "#fef3c7", color: "#d97706" }}>
                <ShoppingCart size={20} weight="bold" />
              </div>
              <div className="rev-sum-body">
                <span className="rev-sum-label">Avg Basket Value</span>
                <strong className="rev-sum-value">₹438</strong>
                <span className="rev-sum-sub">Up from ₹412 last month</span>
              </div>
              <span className="rev-sum-trend rev-trend-up"><TrendUp size={12} weight="bold" /> +6.3%</span>
            </div>
            <div className="rev-summary-card">
              <div className="rev-sum-icon" style={{ background: "#fef2f2", color: "#ef4444" }}>
                <Warning size={20} weight="bold" />
              </div>
              <div className="rev-sum-body">
                <span className="rev-sum-label">Revenue at Risk</span>
                <strong className="rev-sum-value" style={{ color: "#ef4444" }}>₹1.2L<span className="rev-sum-period">/mo</span></strong>
                <span className="rev-sum-sub">From chronic OOS items</span>
              </div>
              <span className="rev-sum-trend rev-trend-down"><TrendDown size={12} weight="bold" /> -15%</span>
            </div>
          </div>

          {/* ── Top Sale Stores ── */}
          <div className="reg-card reg-card-full">
            <h3 style={{ color: "#059669", display: "flex", alignItems: "center", gap: 6 }}>
              <Crown size={16} weight="fill" /> Top Sale Stores
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
              {topStores.map(s => (
                <div key={s.rank} style={{
                  background: s.rank === 1 ? "linear-gradient(135deg, #fefce8, #fef9c3)" : s.rank <= 3 ? "#f0fdf4" : "#f8fafc",
                  border: s.rank === 1 ? "1.5px solid #fbbf24" : s.rank <= 3 ? "1px solid #bbf7d0" : "1px solid #e2e8f0",
                  borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 12
                }}>
                  {/* Row 1: Rank + Store name + City */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8, display: "grid", placeItems: "center", flexShrink: 0,
                      background: s.rank === 1 ? "linear-gradient(135deg, #f59e0b, #d97706)" : s.rank <= 3 ? "linear-gradient(135deg, #059669, #047857)" : "#94a3b8",
                      color: "#fff", fontSize: ".7rem", fontWeight: 900
                    }}>
                      #{s.rank}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: ".78rem", fontWeight: 800, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.store}</div>
                      <div style={{ fontSize: ".6rem", color: "#64748b", fontWeight: 600 }}>{s.city} · {s.compliance}% compliance</div>
                    </div>
                  </div>
                  {/* Row 2: Sales + Growth */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <div>
                      <div style={{ fontSize: ".54rem", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".04em" }}>Daily Sales</div>
                      <div style={{ fontSize: "1.1rem", fontWeight: 900, color: "#0f172a", letterSpacing: "-.02em" }}>₹{s.dailySales.toLocaleString("en-IN")}</div>
                    </div>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 2,
                      fontSize: ".62rem", fontWeight: 700, padding: "3px 8px", borderRadius: 6,
                      background: s.growth >= 0 ? "#dcfce7" : "#fef2f2",
                      color: s.growth >= 0 ? "#16a34a" : "#ef4444"
                    }}>
                      {s.growth >= 0 ? <TrendUp size={11} weight="bold" /> : <TrendDown size={11} weight="bold" />}
                      {s.growth >= 0 ? "+" : ""}{s.growth}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Store-wise Top Selling Products ── */}
          <div className="reg-card reg-card-full">
            <h3 style={{ color: "#4f46e5", display: "flex", alignItems: "center", gap: 6 }}>
              <Storefront size={16} weight="fill" /> All Stores — Top Selling Products
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {storeProducts.map((s, i) => {
                const isOpen = expandedStore === i;
                return (
                  <div key={i} style={{
                    border: isOpen ? "1.5px solid #c7d2fe" : "1px solid #e2e8f0",
                    borderRadius: 14, overflow: "hidden", background: isOpen ? "#fafbff" : "#fff",
                    transition: "all .2s ease"
                  }}>
                    {/* Store Header — clickable */}
                    <div onClick={() => setExpandedStore(isOpen ? null : i)} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "14px 16px", cursor: "pointer", gap: 12
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: 9,
                          background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                          color: "#fff", display: "grid", placeItems: "center",
                          boxShadow: "0 2px 6px rgba(99,102,241,0.25)"
                        }}>
                          <Storefront size={15} weight="fill" />
                        </div>
                        <div>
                          <div style={{ fontSize: ".8rem", fontWeight: 800, color: "#0f172a" }}>{s.store}</div>
                          <div style={{ fontSize: ".62rem", color: "#64748b", fontWeight: 600 }}>{s.city} · {s.compliance}% compliance</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: ".92rem", fontWeight: 900, color: "#0f172a" }}>₹{s.dailySales.toLocaleString("en-IN")}</div>
                          <div style={{ fontSize: ".58rem", color: "#94a3b8", fontWeight: 600 }}>daily sales</div>
                        </div>
                        {isOpen ? <CaretUp size={16} weight="bold" color="#94a3b8" /> : <CaretDown size={16} weight="bold" color="#94a3b8" />}
                      </div>
                    </div>
                    {/* Products Table — expandable */}
                    {isOpen && (
                      <div style={{ padding: "0 16px 14px", borderTop: "1px solid #e2e8f0" }}>
                        <table className="owner-table compact" style={{ marginTop: 10 }}>
                          <thead>
                            <tr><th>#</th><th>Product</th><th>Category</th><th>Units/Day</th><th>₹/Day</th></tr>
                          </thead>
                          <tbody>
                            {s.products.map(p => (
                              <tr key={p.rank}>
                                <td style={{ fontWeight: 800 }}>{p.rank}</td>
                                <td style={{ fontWeight: 700 }}>{p.product}</td>
                                <td style={{ color: "#64748b" }}>{p.category}</td>
                                <td style={{ fontWeight: 700 }}>{p.units}</td>
                                <td style={{ fontWeight: 700, color: "#059669" }}>₹{p.revenue.toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Sales Heatmap — Owner only */}
      {!isManager && (
        <>
          <div className="reg-card reg-card-full">
            <h3>Sales by Category &times; Store (₹L/month)</h3>
            <div style={{ overflowX: "auto" }}>
              <table className="hm-grid-table">
                <thead>
                  <tr>
                    <th>Store</th>
                    {categories.map(c => <th key={c}>{c}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {storeNames.map(sn => (
                    <tr key={sn}>
                      <td className="hm-store">{sn}</td>
                      {salesData[sn].map((v, ci) => {
                        const key = `${sn}-${categories[ci]}`;
                        return (
                          <td key={ci}>
                            <span className={`hm-cell ${salesColor(v)}${drillDown === key ? " hm-cell-active" : ""}`}
                              onClick={() => setDrillDown(drillDown === key ? null : key)}>
                              ₹{v}L
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: ".64rem", color: "#94a3b8", margin: "8px 0 0", fontWeight: 500 }}>Click any cell to drill down into top products and empty shelf incidents</p>
          </div>

          {/* Drill-Down Panel */}
          {drillDown && (() => {
            const dd = drillDownData[drillDown];
            return (
              <div className="hm-drilldown">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <strong style={{ fontSize: ".82rem", color: "#0f172a" }}>{drillDown.replace("-", " — ")}</strong>
                  <button onClick={() => setDrillDown(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: ".7rem", fontWeight: 700 }}>Close</button>
                </div>
                {dd ? (
                  <>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                      {dd.top5.map((s, i) => (
                        <span key={i} style={{ padding: "5px 12px", borderRadius: 8, background: "#f1f5f9", fontSize: ".72rem", fontWeight: 600, color: "#334155" }}>{i + 1}. {s}</span>
                      ))}
                    </div>
                    <div style={{ fontSize: ".72rem", color: "#ef4444", fontWeight: 700, marginBottom: 4 }}>Empty shelf incidents: {dd.emptyCount} this week</div>
                    <p style={{ fontSize: ".7rem", color: "#64748b", margin: 0, lineHeight: 1.5 }}>{dd.note}</p>
                  </>
                ) : (
                  <p style={{ fontSize: ".72rem", color: "#94a3b8", margin: 0 }}>No detailed data available for this combination. Check the manager dashboard for shelf-level details.</p>
                )}
              </div>
            );
          })()}
        </>
      )}

      {/* Action Required */}
      <div className="reg-card reg-card-full">
        <h3 style={{ color: "#dc2626" }}><Warning size={16} weight="fill" /> Action Required</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {actionItems.map((a, i) => (
            <div key={i} className={a.priority === "high" ? "redflag-card" : "spotlight-card"} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontSize: ".76rem", fontWeight: 800, color: a.priority === "high" ? "#dc2626" : "#065f46", marginBottom: 2 }}>{a.store}</div>
                <p style={{ fontSize: ".72rem", margin: 0, lineHeight: 1.5, color: a.priority === "high" ? "#7f1d1d" : "#047857" }}>{a.issue}</p>
              </div>
              <button className={`owner-action-btn ${a.priority === "high" ? "red" : "green"}`}><Envelope size={13} weight="bold" /> Notify Manager</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandHeatmap;
