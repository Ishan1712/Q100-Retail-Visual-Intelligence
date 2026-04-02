import React from "react";
import { motion } from "framer-motion";
import { User, Warning, TrendUp, Lightning, Envelope, Timer, Trophy } from "@phosphor-icons/react";
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


const managerLeaderboard = [
  { rank: 1, name: "Sneha Patil", store: "Q-Mart Kothrud, Pune", dailyRevenue: "₹48,500", revenueSaved: "₹1,82,000", issuesResolved: 48, compliance: "94.2%", score: 968 },
  { rank: 2, name: "Rajesh Iyer", store: "Q-Mart Andheri, Mumbai", dailyRevenue: "₹42,200", revenueSaved: "₹1,64,000", issuesResolved: 42, compliance: "91.8%", score: 935 },
  { rank: 3, name: "Meena Kulkarni", store: "Q-Mart Gangapur, Nashik", dailyRevenue: "₹38,900", revenueSaved: "₹1,48,000", issuesResolved: 38, compliance: "90.5%", score: 904 },
  { rank: 4, name: "Anil Deshmukh", store: "Q-Mart Dharampeth, Nagpur", dailyRevenue: "₹35,600", revenueSaved: "₹1,26,000", issuesResolved: 35, compliance: "88.1%", score: 862 },
  { rank: 5, name: "Pooja Sharma", store: "Q-Mart Sadar, Nagpur", dailyRevenue: "₹31,200", revenueSaved: "₹1,12,000", issuesResolved: 30, compliance: "86.4%", score: 828 },
  { rank: 6, name: "Vikrant Joshi", store: "Q-Mart Hinjewadi, Pune", dailyRevenue: "₹29,800", revenueSaved: "₹1,05,000", issuesResolved: 28, compliance: "85.7%", score: 810 },
  { rank: 7, name: "Deepa Nair", store: "Q-Mart Vashi, Mumbai", dailyRevenue: "₹27,400", revenueSaved: "₹98,000", issuesResolved: 26, compliance: "84.2%", score: 785 },
  { rank: 8, name: "Sunil Rao", store: "Q-Mart Camp, Pune", dailyRevenue: "₹25,100", revenueSaved: "₹92,000", issuesResolved: 24, compliance: "83.5%", score: 762 },
  { rank: 9, name: "Kavita Reddy", store: "Q-Mart Baner, Pune", dailyRevenue: "₹23,600", revenueSaved: "₹86,000", issuesResolved: 22, compliance: "82.1%", score: 738 },
  { rank: 10, name: "Amit Patil", store: "Q-Mart Thane, Mumbai", dailyRevenue: "₹21,800", revenueSaved: "₹78,000", issuesResolved: 19, compliance: "80.8%", score: 710 },
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

      {/* Manager Leaderboard */}
      <div className="mgr-leaderboard-card">
        <h3 className="mgr-lb-title"><Trophy size={16} weight="fill" style={{ color: "#f59e0b" }} /> Manager Leaderboard — Top 10</h3>
        <div className="mgr-lb-wrap">
          <table className="mgr-lb-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Manager</th>
                <th>Store</th>
                <th>Daily Revenue</th>
                <th>Compliance</th>
                <th>Revenue Saved</th>
                <th>Issues Resolved</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {managerLeaderboard.map((m) => (
                <tr key={m.rank} className={m.rank <= 3 ? "mlb-top3" : ""}>
                  <td className="mlb-rank">
                    {m.rank === 1 ? "🥇" : m.rank === 2 ? "🥈" : m.rank === 3 ? "🥉" : m.rank}
                  </td>
                  <td className="mlb-name">
                    <span className="mlb-avatar">{m.name[0]}</span>
                    {m.name}
                  </td>
                  <td className="mlb-store">{m.store}</td>
                  <td className="mlb-revenue">{m.dailyRevenue}</td>
                  <td className="mlb-compliance">{m.compliance}</td>
                  <td className="mlb-revenue">{m.revenueSaved}</td>
                  <td className="mlb-issues">{m.issuesResolved}</td>
                  <td className="mlb-score">{m.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottleneck Alerts */}
      <div className="reg-card">
        <h3 style={{ color: "#dc2626" }}><Warning size={16} weight="fill" /> Bottleneck Alerts</h3>
        <div className="bottleneck-grid">
          {bottleneckAlerts.map((b, i) => (
            <div key={i} className="redflag-card bottleneck-item">
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
