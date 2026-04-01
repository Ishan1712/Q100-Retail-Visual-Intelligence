import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendUp, TrendDown, Minus, CurrencyInr,
  CheckCircle, Package, Warning, Star, Buildings
} from "@phosphor-icons/react";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import "./Regional.css";

/* ── Data ── */
const stores = [
  { name: "Q-Mart Kothrud", city: "Pune", salesToday: 4.8, salesMonth: 42.8, emptyDetected: 18, restockSpeed: 12, topProduct: "Amul Taza 500ml", slowProduct: "Organic Quinoa 500g", trend: "up", sparkline: [3.8,4.0,4.2,4.1,4.5,4.8] },
  { name: "Q-Mart Andheri", city: "Mumbai", salesToday: 4.2, salesMonth: 39.6, emptyDetected: 24, restockSpeed: 15, topProduct: "Maggi 2-Min Noodles", slowProduct: "Premium Dark Choc", trend: "up", sparkline: [3.5,3.6,3.8,4.0,4.1,4.2] },
  { name: "Q-Mart Gangapur Road", city: "Nashik", salesToday: 3.6, salesMonth: 32.4, emptyDetected: 28, restockSpeed: 18, topProduct: "Parle-G 250g", slowProduct: "Almond Butter 200g", trend: "flat", sparkline: [3.2,3.3,3.4,3.5,3.5,3.6] },
  { name: "Q-Mart Dharampeth", city: "Nagpur", salesToday: 3.9, salesMonth: 35.1, emptyDetected: 35, restockSpeed: 22, topProduct: "Tata Salt 1kg", slowProduct: "Chia Seeds 250g", trend: "up", sparkline: [3.1,3.2,3.4,3.6,3.7,3.9] },
  { name: "Q-Mart Sadar", city: "Nagpur", salesToday: 2.1, salesMonth: 22.8, emptyDetected: 42, restockSpeed: 38, topProduct: "Surf Excel 1kg", slowProduct: "Flax Seed Oil 500ml", trend: "down", sparkline: [2.8,2.6,2.4,2.3,2.2,2.1] },
];

const kpis = [
  { label: "My Stores", value: "5 Stores", sub: "4,200+ SKUs monitored", icon: Buildings, color: "#6366f1" },
  { label: "Empty Shelves Caught Today", value: "147", sub: "139 restocked (95% fix rate)", icon: CheckCircle, color: "#059669" },
  { label: "Sales Today", value: "₹18.6L", sub: "Across all stores", icon: CurrencyInr, color: "#2563eb", trend: "+4.2% vs yesterday" },
  { label: "Revenue Recovered", value: "₹4.2L/mo", sub: "From fast restocking", icon: TrendUp, color: "#059669" },
  { label: "Top Selling Product", value: "Parle-G 250g", sub: "340 units/day across chain", icon: Package, color: "#f59e0b" },
];

const salesBreakdown = [
  { label: "Fast Restock (filled before customer noticed)", value: 2.1, color: "#059669" },
  { label: "Reduced Customer Walkouts", value: 1.2, color: "#2563eb" },
  { label: "Better Product Placement (misplaced items fixed)", value: 0.6, color: "#8b5cf6" },
  { label: "Reduced Shrinkage/Expiry", value: 0.3, color: "#f59e0b" },
];

const TrendIcon = ({ trend }) => {
  if (trend === "up") return <TrendUp size={13} weight="bold" className="trend-icon trend-up" />;
  if (trend === "down") return <TrendDown size={13} weight="bold" className="trend-icon trend-down" />;
  return <Minus size={13} weight="bold" className="trend-icon trend-flat" />;
};

const MiniSparkline = ({ data }) => {
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const h = 24, w = 60;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
      <polyline points={points} fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const AnimCounter = ({ target, prefix = "" }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const dur = 1200, t0 = performance.now();
    const step = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      setVal(Math.round((p === 1 ? 1 : 1 - Math.pow(2, -10 * p)) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target]);
  return <>{prefix}{val}</>;
};

const PortfolioHQ = () => {
  const sorted = [...stores].sort((a, b) => b.salesToday - a.salesToday);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];
  const now = new Date();
  const timestamp = now.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) + ", " + now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="reg-screen">
      {/* Last Updated */}
      <div className="owner-timestamp">Data as of: {timestamp}</div>

      {/* KPI Strip */}
      <div className="reg-kpi-strip">
        {kpis.map((k, i) => (
          <motion.div key={i} className="reg-kpi" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <div className="reg-kpi-icon" style={{ background: `${k.color}15`, color: k.color }}><k.icon size={18} weight="duotone" /></div>
            <div className="reg-kpi-body">
              <span className="reg-kpi-label">{k.label}</span>
              <strong>{k.value}</strong>
              <span className="reg-kpi-sub">{k.sub}</span>
              {k.trend && <span className="reg-kpi-trend trend-up"><TrendUp size={11} weight="bold" /> {k.trend}</span>}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Store Leaderboard — Full Width */}
      <div className="reg-card reg-card-full">
        <h3><Star size={16} weight="fill" /> Store Leaderboard</h3>
        <div style={{ overflowX: "auto" }}>
          <table className="owner-table">
            <thead>
              <tr>
                <th>Store</th>
                <th>Today's Sales</th>
                <th>Monthly Sales</th>
                <th>Empty Shelves</th>
                <th>Restock Speed</th>
                <th>Top Product</th>
                <th>Slow Product</th>
                <th>30-Day Trend</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((s, i) => (
                <tr key={i} className={i === 0 ? "row-best" : i === sorted.length - 1 ? "row-worst" : ""}>
                  <td style={{ fontWeight: 750 }}>
                    <div>{s.name}</div>
                    <span style={{ fontSize: ".62rem", color: "#94a3b8" }}>{s.city}</span>
                  </td>
                  <td style={{ fontWeight: 800, color: i === 0 ? "#059669" : "#0f172a" }}>₹{s.salesToday}L</td>
                  <td>₹{s.salesMonth}L <TrendIcon trend={s.trend} /></td>
                  <td>
                    <span className={s.emptyDetected <= 20 ? "pill-good" : s.emptyDetected <= 30 ? "pill-warn" : "pill-bad"}>
                      {s.emptyDetected}
                    </span>
                  </td>
                  <td>
                    <span className={s.restockSpeed <= 15 ? "pill-good" : s.restockSpeed <= 20 ? "pill-warn" : "pill-bad"}>
                      {s.restockSpeed} min
                    </span>
                  </td>
                  <td style={{ fontSize: ".72rem" }}>{s.topProduct}</td>
                  <td style={{ fontSize: ".72rem", color: "#94a3b8" }}>{s.slowProduct}</td>
                  <td><MiniSparkline data={s.sparkline} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Store Comparison Cards */}
      <div className="owner-compare-row">
        <div className="owner-compare-card best">
          <div className="owner-compare-badge">Best Store</div>
          <strong>{best.name}, {best.city}</strong>
          <div className="owner-compare-stats">
            <span>₹{best.salesToday}L sales today</span>
            <span>{best.emptyDetected} empty shelves (all restocked in &lt;{best.restockSpeed} min)</span>
          </div>
          <p className="owner-compare-note">Highest sales, fastest restocking</p>
        </div>
        <div className="owner-compare-card attention">
          <div className="owner-compare-badge"><Warning size={13} weight="fill" /> Needs Attention</div>
          <strong>{worst.name}, {worst.city}</strong>
          <div className="owner-compare-stats">
            <span>₹{worst.salesToday}L sales today</span>
            <span>{worst.emptyDetected} empty shelves, avg restock {worst.restockSpeed} min</span>
          </div>
          <p className="owner-compare-note">Slowest restocking — estimated ₹85K lost sales this month from empty shelves</p>
        </div>
      </div>

      {/* Sales Breakdown — Revenue Recovery */}
      <div className="reg-card reg-card-full">
        <h3><CurrencyInr size={16} weight="bold" /> Revenue Recovered This Month</h3>
        <div className="owner-recovery-hero">
          <div className="owner-recovery-big">₹4.2L</div>
          <span>recovered revenue this month</span>
        </div>
        <div className="owner-breakdown-bars">
          {salesBreakdown.map((b, i) => (
            <div key={i} className="owner-bar-row">
              <span className="owner-bar-label">{b.label}</span>
              <div className="owner-bar-track">
                <motion.div className="owner-bar-fill" style={{ background: b.color }}
                  initial={{ width: 0 }} animate={{ width: `${(b.value / 2.1) * 100}%` }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }} />
              </div>
              <span className="owner-bar-value">₹{b.value}L</span>
            </div>
          ))}
        </div>
        <div className="owner-recovery-footer">₹28,000 per store per day in extra sales</div>
      </div>
    </div>
  );
};

export default PortfolioHQ;
