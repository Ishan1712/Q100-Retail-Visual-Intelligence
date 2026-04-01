import React from "react";
import { motion } from "framer-motion";
import { User, Warning, TrendUp, Lightning, Star, Envelope, Timer } from "@phosphor-icons/react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine, Legend } from "recharts";
import "./Regional.css";

const kpis = [
  { label: "Total Staff", value: "27", sub: "14 floor + 13 storeroom across 5 stores" },
  { label: "Avg Restocks/Shift", value: "32", sub: "Industry avg: 18 — shows efficiency" },
  { label: "Avg Restock Speed", value: "14 min", sub: "From empty shelf detected to product placed" },
  { label: "Faster Training", value: "35%", sub: "New staff productive in 2 weeks vs 3 weeks before Q100" },
];

const staffTable = [
  { store: "Q-Mart Kothrud, Pune", floor: 3, storeroom: 3, vacancy: "0%", restockSpeed: 12, emptyPerShift: 18, topIssue: "None — fully optimized", health: "good" },
  { store: "Q-Mart Andheri, Mumbai", floor: 3, storeroom: 3, vacancy: "0%", restockSpeed: 15, emptyPerShift: 24, topIssue: "Beverage aisle slow", health: "good" },
  { store: "Q-Mart Gangapur, Nashik", floor: 3, storeroom: 2, vacancy: "14%", restockSpeed: 18, emptyPerShift: 28, topIssue: "1 storeroom vacancy", health: "warn" },
  { store: "Q-Mart Dharampeth, Nagpur", floor: 3, storeroom: 2, vacancy: "14%", restockSpeed: 22, emptyPerShift: 35, topIssue: "Slow dairy restocking", health: "warn" },
  { store: "Q-Mart Sadar, Nagpur", floor: 2, storeroom: 2, vacancy: "28%", restockSpeed: 38, emptyPerShift: 42, topIssue: "Critical understaffing", health: "bad" },
];

const bottleneckAlerts = [
  { store: "Q-Mart Sadar, Nagpur", issue: "Only 2 storeroom staff for 10 aisles. Restock takes 38 min avg.", impact: "₹85K/month lost sales from slow restocking", fix: "Hire 2 storeroom + 1 floor staff. Cost: ₹54K/mo. Projected revenue gain: ₹85K/mo." },
  { store: "Q-Mart Dharampeth, Nagpur", issue: "Dairy section staffed by 1 person during peak hours (4-7 PM).", impact: "₹28K/month lost from dairy empty shelves", fix: "Cross-train 1 floor staff for dairy restocking during peak. No additional cost." },
  { store: "Q-Mart Gangapur, Nashik", issue: "1 storeroom vacancy unfilled for 6 weeks.", impact: "₹18K/month lost from delayed restocking", fix: "Fill vacancy urgently. Cost: ₹18K/mo. Projected recovery: ₹18K/mo." },
];

const topPerformers = [
  { rank: 1, name: "Amit D.", store: "Pune", role: "Floor", stat: "16 restocks/day, 12m avg speed" },
  { rank: 2, name: "Priya N.", store: "Mumbai", role: "Floor", stat: "15 restocks/day, 14m avg speed" },
  { rank: 3, name: "Suresh K.", store: "Pune", role: "Storeroom", stat: "12m avg, 16 tasks/day" },
  { rank: 4, name: "Rahul M.", store: "Pune", role: "Floor", stat: "14 restocks/day, 13m avg speed" },
  { rank: 5, name: "Kiran S.", store: "Mumbai", role: "Floor", stat: "13 restocks/day, 15m avg speed" },
  { rank: 6, name: "Manoj T.", store: "Pune", role: "Storeroom", stat: "15m avg, 14 tasks/day" },
  { rank: 7, name: "Sanjay M.", store: "Mumbai", role: "Storeroom", stat: "14m avg, 15 tasks/day" },
  { rank: 8, name: "Deepa S.", store: "Pune", role: "Storeroom", stat: "16m avg, 8 tasks/day" },
  { rank: 9, name: "Ravi P.", store: "Nashik", role: "Floor", stat: "12 restocks/day, 18m avg speed" },
  { rank: 10, name: "Neha K.", store: "Nagpur", role: "Floor", stat: "11 restocks/day, 20m avg speed" },
];

const mostImproved = [
  { name: "Ravi P.", store: "Nashik", improvement: "Restock speed improved from 24m to 18m (-25%)" },
  { name: "Neha K.", store: "Nagpur", improvement: "Catches per day up from 7 to 11 (+57%)" },
];

/* Restock SLA Trend — 30 day data (weekly aggregation) */
const restockTrend = [
  { week: "W1", Pune: 14, Mumbai: 17, Nashik: 20, Nagpur: 24, "Nagpur-S": 40 },
  { week: "W2", Pune: 13, Mumbai: 16, Nashik: 19, Nagpur: 23, "Nagpur-S": 39 },
  { week: "W3", Pune: 13, Mumbai: 16, Nashik: 18, Nagpur: 22, "Nagpur-S": 38 },
  { week: "W4", Pune: 12, Mumbai: 15, Nashik: 18, Nagpur: 22, "Nagpur-S": 38 },
];

const storeColors = { Pune: "#059669", Mumbai: "#6366f1", Nashik: "#f59e0b", Nagpur: "#fb923c", "Nagpur-S": "#ef4444" };

const StaffAnalytics = () => {
  const now = new Date();
  const timestamp = now.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) + ", " + now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="reg-screen">
      <div className="owner-timestamp">Data as of: {timestamp}</div>

      {/* KPI Cards */}
      <div className="reg-kpi-strip">
        {kpis.map((k, i) => (
          <motion.div key={i} className="reg-kpi" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <div className="reg-kpi-body" style={{ textAlign: "center", width: "100%" }}>
              <span className="reg-kpi-label">{k.label}</span>
              <strong>{k.value}</strong>
              <span className="reg-kpi-sub">{k.sub}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Workforce Table */}
      <div className="reg-card reg-card-full">
        <h3><User size={16} weight="duotone" /> Workforce Overview</h3>
        <div style={{ overflowX: "auto" }}>
          <table className="owner-table">
            <thead>
              <tr>
                <th>Store</th>
                <th>Floor Staff</th>
                <th>Storeroom Staff</th>
                <th>Vacancy</th>
                <th>Avg Restock Speed</th>
                <th>Empty Shelves/Shift</th>
                <th>Top Issue</th>
              </tr>
            </thead>
            <tbody>
              {staffTable.map((s, i) => (
                <tr key={i} className={s.health === "bad" ? "row-worst" : s.health === "good" && i === 0 ? "row-best" : ""}>
                  <td style={{ fontWeight: 750 }}>{s.store}</td>
                  <td>{s.floor}</td>
                  <td>{s.storeroom}</td>
                  <td><span className={s.vacancy === "0%" ? "pill-good" : parseInt(s.vacancy) >= 20 ? "pill-bad" : "pill-warn"}>{s.vacancy}</span></td>
                  <td><span className={s.restockSpeed <= 15 ? "pill-good" : s.restockSpeed <= 20 ? "pill-warn" : "pill-bad"}>{s.restockSpeed} min</span></td>
                  <td>{s.emptyPerShift}</td>
                  <td style={{ fontSize: ".7rem", color: s.health === "bad" ? "#dc2626" : "#64748b" }}>{s.topIssue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="reg-body">
        {/* Staff Leaderboard */}
        <div className="reg-left">
          <div className="reg-card">
            <h3><Star size={16} weight="fill" /> Staff Leaderboard — Top 10</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {topPerformers.map(p => (
                <div key={p.rank} className="top-performer">
                  <span className="tp-rank">#{p.rank}</span>
                  <span className="tp-avatar">{p.name[0]}</span>
                  <div className="tp-info">
                    <strong>{p.name}</strong>
                    <span>{p.store} · {p.role}</span>
                  </div>
                  <span className="tp-stat">{p.stat}</span>
                </div>
              ))}
            </div>
            {/* Most Improved */}
            <div style={{ marginTop: 12, padding: "10px 12px", background: "#ecfdf5", borderRadius: 10, border: "1px solid #a7f3d0" }}>
              <div style={{ fontSize: ".74rem", fontWeight: 800, color: "#065f46", marginBottom: 6 }}>Most Improved This Month</div>
              {mostImproved.map((m, i) => (
                <div key={i} style={{ fontSize: ".72rem", color: "#047857", fontWeight: 500, padding: "3px 0" }}>
                  <strong>{m.name}</strong> ({m.store}) — {m.improvement}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottleneck Alerts — right side */}
        <div className="reg-right">
          <div className="reg-card" style={{ display: "flex", flexDirection: "column" }}>
            <h3 style={{ color: "#dc2626" }}><Warning size={16} weight="fill" /> Bottleneck Alerts</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1, justifyContent: "space-between" }}>
              {bottleneckAlerts.map((b, i) => (
                <div key={i} className="redflag-card" style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
                  <div className="redflag-header">{b.store}</div>
                  <p className="redflag-text" style={{ margin: 0 }}>{b.issue}</p>
                  <div style={{ fontSize: ".72rem", fontWeight: 700, color: "#ef4444" }}>Revenue impact: {b.impact}</div>
                  <div className="risk-recommendation" style={{ margin: 0 }}>
                    <Lightning size={12} weight="fill" /> <strong>Fix:</strong> {b.fix}
                  </div>
                  <button className="owner-action-btn red" style={{ alignSelf: "flex-start", marginTop: "auto" }}><Envelope size={13} weight="bold" /> Assign</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Restock SLA Trend — full width */}
      <div className="reg-card reg-card-full">
        <h3><Timer size={16} weight="duotone" /> Restock Speed Trend — Last 30 Days</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={restockTrend} margin={{ left: 0, right: 10, top: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="week" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} domain={[0, 45]} label={{ value: "Minutes", angle: -90, position: "insideLeft", fontSize: 10, fill: "#94a3b8" }} />
            <Tooltip formatter={(v) => `${v} min`} />
            <ReferenceLine y={15} stroke="#059669" strokeDasharray="4 4" label={{ value: "Target: 15 min", fontSize: 10, fill: "#059669", position: "right" }} />
            {Object.entries(storeColors).map(([name, color]) => (
              <Line key={name} type="monotone" dataKey={name} stroke={color} strokeWidth={2} dot={{ r: 3 }} />
            ))}
            <Legend />
          </LineChart>
        </ResponsiveContainer>
        <div className="owner-insight-bar" style={{ marginTop: 10 }}>
          Pune &amp; Mumbai below target. Nagpur-S significantly above — needs urgent staffing fix.
        </div>
      </div>
    </div>
  );
};

export default StaffAnalytics;
