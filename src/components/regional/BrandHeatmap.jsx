import React, { useState } from "react";
import { Warning, TrendUp, TrendDown, Minus, Eye, EyeSlash, Envelope, Package } from "@phosphor-icons/react";
import "./Regional.css";

/* ── Product Performance Data ── */
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

/* ── Empty Shelf Tracker ── */
const emptyShelfTracker = [
  { category: "Dairy", count: 28, avgRestock: 14, lost: 8, saved: 42 },
  { category: "Snacks", count: 45, avgRestock: 11, lost: 5, saved: 38 },
  { category: "Beverages", count: 32, avgRestock: 18, lost: 12, saved: 35 },
  { category: "Staples", count: 18, avgRestock: 12, lost: 3, saved: 28 },
  { category: "Personal Care", count: 15, avgRestock: 16, lost: 4, saved: 22 },
  { category: "Household", count: 9, avgRestock: 20, lost: 6, saved: 15 },
];

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

const BrandHeatmap = () => {
  const [drillDown, setDrillDown] = useState(null);
  const now = new Date();
  const timestamp = now.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) + ", " + now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="reg-screen">
      <div className="owner-timestamp">Data as of: {timestamp}</div>

      <div style={{ marginBottom: -4 }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>Product Intelligence</h2>
        <span style={{ fontSize: ".72rem", color: "#64748b" }}>What's selling, what's not, and where are the gaps?</span>
      </div>

      {/* Top Selling & Slow Moving — Side by Side */}
      <div className="reg-body">
        <div className="reg-left">
          <div className="reg-card" style={{ display: "flex", flexDirection: "column" }}>
            <h3 style={{ color: "#059669" }}><TrendUp size={16} weight="fill" /> Top 10 Best Selling Products</h3>
            <div style={{ overflowX: "auto", flex: 1 }}>
              <table className="owner-table compact" style={{ height: "100%" }}>
                <thead>
                  <tr><th>#</th><th>Product</th><th>Category</th><th>Units/Day</th><th>₹/Day</th><th>Stock</th></tr>
                </thead>
                <tbody>
                  {topSelling.map(p => (
                    <tr key={p.rank}>
                      <td style={{ fontWeight: 800 }}>{p.rank}</td>
                      <td style={{ fontWeight: 700 }}>{p.product}</td>
                      <td style={{ color: "#64748b" }}>{p.category}</td>
                      <td style={{ fontWeight: 700 }}>{p.units}</td>
                      <td style={{ fontWeight: 700, color: "#059669" }}>₹{p.revenue.toLocaleString()}</td>
                      <td>{p.stock === "in" ? <span className="pill-good">In Stock</span> : <span className="pill-warn">Low</span>}</td>
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
            <div style={{ overflowX: "auto" }}>
              <table className="owner-table compact">
                <thead>
                  <tr><th>#</th><th>Product</th><th>Category</th><th>Units/Day</th><th>Days on Shelf</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {slowMoving.map(p => (
                    <tr key={p.rank}>
                      <td style={{ fontWeight: 800 }}>{p.rank}</td>
                      <td style={{ fontWeight: 700 }}>{p.product}</td>
                      <td style={{ color: "#64748b" }}>{p.category}</td>
                      <td style={{ fontWeight: 700 }}>{p.units}</td>
                      <td><span className="pill-bad">{p.daysOnShelf} days</span></td>
                      <td style={{ fontSize: ".66rem", color: "#f59e0b", fontWeight: 700 }}>{p.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Heatmap */}
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

      {/* Empty Shelf Tracker */}
      <div className="reg-card reg-card-full">
        <h3><Warning size={16} weight="fill" style={{ color: "#f59e0b" }} /> Empty Shelf Tracker — Last 7 Days</h3>
        <div style={{ overflowX: "auto" }}>
          <table className="owner-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Empty Shelf Count</th>
                <th>Avg Restock Time</th>
                <th>Revenue Lost</th>
                <th>Revenue Saved (restocked in time)</th>
              </tr>
            </thead>
            <tbody>
              {emptyShelfTracker.map((e, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 750 }}>{e.category}</td>
                  <td><span className={e.count > 30 ? "pill-bad" : e.count > 20 ? "pill-warn" : "pill-good"}>{e.count}</span></td>
                  <td><span className={e.avgRestock > 16 ? "pill-bad" : e.avgRestock > 14 ? "pill-warn" : "pill-good"}>{e.avgRestock} min</span></td>
                  <td style={{ color: "#ef4444", fontWeight: 700 }}>₹{e.lost}K</td>
                  <td style={{ color: "#059669", fontWeight: 700 }}>₹{e.saved}K</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="owner-insight-bar" style={{ marginTop: 10 }}>
          Beverages section takes longest to restock — losing ₹12K. Need more storeroom staff.
        </div>
      </div>

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
