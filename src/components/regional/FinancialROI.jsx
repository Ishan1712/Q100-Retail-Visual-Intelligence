import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CurrencyInr, TrendUp, CheckCircle, Warning, Lightning, ChartBar, Timer, Coins, ArrowUp } from "@phosphor-icons/react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line, CartesianGrid, ReferenceLine, Legend } from "recharts";
import "./Regional.css";

const AnimCounter = ({ target }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const dur = 2000, t0 = performance.now();
    const step = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      setVal(Math.round(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target]);
  return <>{val.toLocaleString("en-IN")}</>;
};

const waterfallData = [
  { name: "Empty Shelf Recovery", value: 2.1, color: "#059669" },
  { name: "Reduced Customer Walkouts", value: 1.2, color: "#2563eb" },
  { name: "Better Product Placement", value: 0.6, color: "#8b5cf6" },
  { name: "Reduced Shrinkage/Expiry", value: 0.3, color: "#f59e0b" },
];

const revenueGrowth = [
  { month: "Oct '25", withQ100: 0, withoutQ100: 0, label: "" },
  { month: "Nov", withQ100: 0, withoutQ100: 0 },
  { month: "Dec", withQ100: 0, withoutQ100: 0 },
  { month: "Jan '26", withQ100: 0, withoutQ100: 0, label: "Q100 Deployed" },
  { month: "Feb", withQ100: 1.8, withoutQ100: 0 },
  { month: "Mar", withQ100: 3.6, withoutQ100: 0 },
  { month: "Apr", withQ100: 4.2, withoutQ100: 0 },
  { month: "May", withQ100: 4.8, withoutQ100: 0 },
  { month: "Jun", withQ100: 5.2, withoutQ100: 0 },
  { month: "Jul", withQ100: 5.6, withoutQ100: 0 },
  { month: "Aug", withQ100: 5.9, withoutQ100: 0 },
  { month: "Sep", withQ100: 6.2, withoutQ100: 0 },
].map((d, i) => ({
  ...d,
  cumWithQ100: i <= 3 ? 0 : [0, 0, 0, 0, 1.8, 5.4, 9.6, 14.4, 19.6, 25.2, 31.1, 37.3][i],
  cumWithout: 0,
}));

const storeBreakdown = [
  { store: "Q-Mart Kothrud, Pune", before: 38, after: 42.8, uplift: 4.8, pct: 12.6, empty: 18, restock: 12 },
  { store: "Q-Mart Andheri, Mumbai", before: 52, after: 56.1, uplift: 4.1, pct: 7.9, empty: 24, restock: 15 },
  { store: "Q-Mart Gangapur, Nashik", before: 28, after: 31.2, uplift: 3.2, pct: 11.4, empty: 28, restock: 18 },
  { store: "Q-Mart Dharampeth, Nagpur", before: 32, after: 35.6, uplift: 3.6, pct: 11.3, empty: 35, restock: 22 },
  { store: "Q-Mart Sadar, Nagpur", before: 18, after: 19.8, uplift: 1.8, pct: 10.0, empty: 42, restock: 38 },
];

const fmcgPartners = [
  { name: "Hindustan Unilever", compliance: 94, income: "₹2.8L/quarter" },
  { name: "PepsiCo", compliance: 91, income: "₹1.6L/quarter" },
  { name: "ITC", compliance: 88, income: "₹1.2L/quarter" },
  { name: "Britannia", compliance: 92, income: "₹0.9L/quarter" },
];

const FinancialROI = () => {
  const now = new Date();
  const timestamp = now.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) + ", " + now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="reg-screen">
      <div className="owner-timestamp">Data as of: {timestamp}</div>

      {/* Hero Banner */}
      <motion.div className="roi-hero-owner" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="roi-hero-main">
          <div className="roi-hero-big">₹4.2L<span>/month</span></div>
          <div className="roi-hero-sub">Your stores earn ₹4.2L more every month because shelves stay stocked</div>
          <div className="roi-hero-cumulative">Since Q100: <strong>₹25.2L</strong> total additional revenue</div>
        </div>
        <div className="roi-hero-compare">
          <div className="roi-compare-item">
            <span className="roi-compare-label">Q100 Subscription</span>
            <strong className="roi-compare-val">₹72K/mo</strong>
          </div>
          <div className="roi-compare-item">
            <span className="roi-compare-label">Additional Revenue</span>
            <strong className="roi-compare-val green">₹4.2L/mo</strong>
          </div>
          <div className="roi-compare-item highlight">
            <span className="roi-compare-label">Net Gain</span>
            <strong className="roi-compare-val green" style={{ fontSize: "1.4rem" }}>₹3.48L/mo</strong>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="reg-kpi-strip">
        <motion.div className="reg-kpi" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="reg-kpi-icon" style={{ background: "#eff6ff", color: "#2563eb" }}><Timer size={18} weight="duotone" /></div>
          <div className="reg-kpi-body">
            <span className="reg-kpi-label">Payback Period</span>
            <strong>21 Days</strong>
            <span className="reg-kpi-sub">Q100 paid for itself in 3 weeks</span>
          </div>
        </motion.div>
        <motion.div className="reg-kpi" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="reg-kpi-icon" style={{ background: "#ecfdf5", color: "#059669" }}><CheckCircle size={18} weight="duotone" /></div>
          <div className="reg-kpi-body">
            <span className="reg-kpi-label">Empty Shelves Fixed</span>
            <strong>4,410/mo</strong>
            <span className="reg-kpi-sub">That's 147 per day across all stores</span>
          </div>
        </motion.div>
        <motion.div className="reg-kpi" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="reg-kpi-icon" style={{ background: "#ecfdf5", color: "#059669" }}><TrendUp size={18} weight="duotone" /></div>
          <div className="reg-kpi-body">
            <span className="reg-kpi-label">Sales Uplift</span>
            <strong>+12%</strong>
            <span className="reg-kpi-sub">Average increase since Q100</span>
          </div>
        </motion.div>
        <motion.div className="reg-kpi" style={{ background: "linear-gradient(135deg, #ecfdf5, #d1fae5)", borderColor: "#a7f3d0" }} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <div className="reg-kpi-icon" style={{ background: "#059669", color: "#fff" }}><CurrencyInr size={18} weight="bold" /></div>
          <div className="reg-kpi-body">
            <span className="reg-kpi-label">Annual Revenue Projection</span>
            <strong style={{ color: "#059669", fontSize: "1.4rem" }}>₹50.4L</strong>
            <span className="reg-kpi-sub">Projected additional revenue this year</span>
          </div>
        </motion.div>
      </div>

      {/* How Revenue Increased — Waterfall */}
      <div className="reg-card reg-card-full">
        <h3><ChartBar size={16} weight="duotone" /> How Revenue Increased — Monthly Breakdown</h3>
        <div className="owner-breakdown-bars">
          {waterfallData.map((b, i) => (
            <div key={i} className="owner-bar-row">
              <span className="owner-bar-label">{b.name}</span>
              <div className="owner-bar-track">
                <motion.div className="owner-bar-fill" style={{ background: b.color }}
                  initial={{ width: 0 }} animate={{ width: `${(b.value / 2.1) * 100}%` }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }} />
              </div>
              <span className="owner-bar-value">₹{b.value}L</span>
            </div>
          ))}
          <div className="owner-bar-row" style={{ borderTop: "2px solid #e2e8f0", paddingTop: 8, marginTop: 4 }}>
            <span className="owner-bar-label" style={{ fontWeight: 800, color: "#0f172a" }}>Total Additional Revenue</span>
            <div style={{ flex: 1 }} />
            <span className="owner-bar-value" style={{ fontWeight: 900, fontSize: ".88rem", color: "#059669" }}>₹4.2L/mo</span>
          </div>
        </div>
      </div>

      {/* Revenue Growth Chart */}
      <div className="reg-card reg-card-full">
        <h3><TrendUp size={16} weight="fill" /> Revenue Growth — With vs Without Q100</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={revenueGrowth} margin={{ left: 10, right: 20, top: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} label={{ value: "₹L/month extra", angle: -90, position: "insideLeft", fontSize: 10, fill: "#94a3b8" }} />
            <Tooltip formatter={(v) => `₹${v}L`} />
            <ReferenceLine x="Jan '26" stroke="#6366f1" strokeDasharray="4 4" label={{ value: "Q100 Deployed", fontSize: 10, fill: "#6366f1", position: "top" }} />
            <Line type="monotone" dataKey="withQ100" name="With Q100" stroke="#059669" strokeWidth={3} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="withoutQ100" name="Without Q100" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            <Legend />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Per-Store Revenue Breakdown */}
      <div className="reg-card reg-card-full">
        <h3><CurrencyInr size={16} weight="bold" /> Per-Store Revenue Breakdown</h3>
        <div style={{ overflowX: "auto" }}>
          <table className="owner-table">
            <thead>
              <tr>
                <th>Store</th>
                <th>Monthly Sales Before</th>
                <th>Monthly Sales After</th>
                <th>Sales Uplift</th>
                <th>Empty Shelves/Day</th>
              </tr>
            </thead>
            <tbody>
              {storeBreakdown.map((s, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 750 }}>{s.store}</td>
                  <td>₹{s.before}L</td>
                  <td style={{ fontWeight: 800 }}>₹{s.after}L</td>
                  <td style={{ color: "#059669", fontWeight: 800 }}>+₹{s.uplift}L (+{s.pct}%)</td>
                  <td>{s.empty} <span style={{ fontSize: ".64rem", color: "#94a3b8" }}>(avg {s.restock} min restock)</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FMCG Partner Compliance */}
      <div className="reg-card reg-card-full">
        <h3><Coins size={16} weight="duotone" /> FMCG Partner Compliance — Trade Marketing Income</h3>
        <div style={{ overflowX: "auto" }}>
          <table className="owner-table">
            <thead>
              <tr>
                <th>Brand Partner</th>
                <th>Product Placement Accuracy</th>
                <th>Trade Marketing Income Protected</th>
              </tr>
            </thead>
            <tbody>
              {fmcgPartners.map((p, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 750 }}>{p.name}</td>
                  <td>
                    <span className={p.compliance >= 92 ? "pill-good" : "pill-warn"}>{p.compliance}%</span>
                  </td>
                  <td style={{ fontWeight: 700, color: "#059669" }}>{p.income}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinancialROI;
