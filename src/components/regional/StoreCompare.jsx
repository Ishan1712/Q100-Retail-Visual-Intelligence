import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Legend
} from "recharts";
import { Star, Warning, TrendUp, Envelope } from "@phosphor-icons/react";
import "./Regional.css";

const storeColors = { Pune: "#059669", Mumbai: "#6366f1", Nashik: "#f59e0b", Nagpur: "#fb923c", "Nagpur-S": "#ef4444" };

const radarMetrics = ["Daily Sales", "Shelf Availability", "Restock Speed", "Customer Footfall", "Staff Efficiency", "Product Freshness"];
const radarData = radarMetrics.map((m, i) => ({
  metric: m,
  Pune: [92, 95, 96, 88, 90, 94][i],
  Mumbai: [88, 90, 88, 92, 85, 90][i],
  Nashik: [78, 84, 82, 76, 80, 86][i],
  Nagpur: [82, 80, 72, 80, 76, 82][i],
  "Nagpur-S": [60, 68, 48, 72, 62, 78][i],
  Industry: [75, 78, 70, 75, 72, 80][i],
}));


/* ── Daily Sales Trend (Last 7 Days) ── */
const dailySalesTrend = [
  { day: "27 Mar", Pune: 4.2, Mumbai: 3.8, Nashik: 3.1, Nagpur: 3.4, "Nagpur-S": 2.4 },
  { day: "28 Mar", Pune: 4.5, Mumbai: 4.0, Nashik: 3.3, Nagpur: 3.6, "Nagpur-S": 2.3 },
  { day: "29 Mar", Pune: 4.3, Mumbai: 4.1, Nashik: 3.2, Nagpur: 3.5, "Nagpur-S": 2.1 },
  { day: "30 Mar", Pune: 4.6, Mumbai: 3.9, Nashik: 3.4, Nagpur: 3.7, "Nagpur-S": 2.2 },
  { day: "31 Mar", Pune: 4.4, Mumbai: 4.2, Nashik: 3.5, Nagpur: 3.8, "Nagpur-S": 2.0 },
  { day: "1 Apr",  Pune: 4.7, Mumbai: 4.3, Nashik: 3.6, Nagpur: 3.9, "Nagpur-S": 2.1 },
  { day: "2 Apr",  Pune: 4.8, Mumbai: 4.2, Nashik: 3.6, Nagpur: 3.9, "Nagpur-S": 2.1 },
];

/* ── Daily Empty Shelf Incidents (Last 7 Days) ── */
const dailyEmptyShelf = [
  { day: "27 Mar", Pune: 12, Mumbai: 18, Nashik: 22, Nagpur: 28, "Nagpur-S": 35 },
  { day: "28 Mar", Pune: 10, Mumbai: 16, Nashik: 24, Nagpur: 30, "Nagpur-S": 38 },
  { day: "29 Mar", Pune: 14, Mumbai: 20, Nashik: 20, Nagpur: 26, "Nagpur-S": 40 },
  { day: "30 Mar", Pune: 11, Mumbai: 15, Nashik: 25, Nagpur: 32, "Nagpur-S": 36 },
  { day: "31 Mar", Pune: 9,  Mumbai: 17, Nashik: 21, Nagpur: 29, "Nagpur-S": 42 },
  { day: "1 Apr",  Pune: 8,  Mumbai: 14, Nashik: 23, Nagpur: 27, "Nagpur-S": 37 },
  { day: "2 Apr",  Pune: 10, Mumbai: 16, Nashik: 22, Nagpur: 28, "Nagpur-S": 35 },
];

const bestPractices = [
  { store: "Q-Mart Kothrud, Pune", detail: "Restocks in 12 minutes avg — fastest in chain. Their secret: dedicated restock runner per zone.", action: "Roll Out to All Stores" },
  { store: "Q-Mart Andheri, Mumbai", detail: "First-scan-first-restock rule — Dairy always scanned first at 6:30 AM before morning rush.", action: "Roll Out to All Stores" },
  { store: "Q-Mart Gangapur, Nashik", detail: "Cross-trained floor staff to handle restocking during low footfall hours — reduced SLA by 4 min.", action: "Roll Out to All Stores" },
];

const needsAttention = [
  { store: "Q-Mart Sadar, Nagpur", detail: "42 empty shelves at peak hours (4-7 PM) — ₹28K lost sales this week.", action: "Notify Store Manager" },
  { store: "Q-Mart Dharampeth, Nagpur", detail: "Dairy section restock takes 22 min avg. Only 2 storeroom workers for 10 aisles.", action: "Notify Store Manager" },
  { store: "Q-Mart Gangapur, Nashik", detail: "Beverages section empty 32 times this week — ₹12K lost. Supplier delay suspected.", action: "Notify Store Manager" },
];

const StoreCompare = () => {
  const now = new Date();
  const timestamp = now.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) + ", " + now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="reg-screen">
      <div className="owner-timestamp">Data as of: {timestamp}</div>

      <div className="reg-card reg-card-full" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h3 style={{ margin: 0 }}><Star size={16} weight="fill" /> Store Performance</h3>
          <span style={{ fontSize: ".72rem", color: "#64748b" }}>How are your stores performing — and how has Q100 changed things?</span>
        </div>
      </div>

      {/* Radar Chart */}
      <div className="radar-section">
        <div className="reg-card">
          <h3>Performance Radar — All Stores</h3>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fontWeight: 600 }} />
              <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9 }} />
              {Object.entries(storeColors).map(([name, color]) => (
                <Radar key={name} name={name} dataKey={name} stroke={color} fill={color} fillOpacity={0.06} strokeWidth={2} />
              ))}
              <Radar name="Industry Avg" dataKey="Industry" stroke="#94a3b8" fill="none" strokeWidth={2} strokeDasharray="5 5" />
            </RadarChart>
          </ResponsiveContainer>
          <div className="radar-legend">
            {Object.entries(storeColors).map(([name, color]) => (
              <span key={name} className="radar-leg"><span className="radar-leg-dot" style={{ background: color }} /> {name}</span>
            ))}
            <span className="radar-leg"><span className="radar-leg-dot" style={{ background: "#94a3b8", border: "1px dashed #94a3b8" }} /> Industry Avg</span>
          </div>
        </div>

      </div>

      {/* Daily Reports — Line & Bar Charts */}
      <div className="reg-charts-row">
        {/* Daily Sales Trend — Line Chart */}
        <div className="reg-card">
          <h3 style={{ display: "flex", alignItems: "center", gap: 6, color: "#059669" }}>
            <TrendUp size={16} weight="fill" /> Daily Sales — Last 7 Days (₹L)
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={dailySalesTrend} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fontWeight: 600 }} />
              <YAxis tick={{ fontSize: 10 }} domain={[0, 6]} />
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: ".72rem", border: "1px solid #e2e8f0", boxShadow: "0 4px 16px rgba(0,0,0,.08)" }} />
              {Object.entries(storeColors).map(([name, color]) => (
                <Line key={name} type="monotone" dataKey={name} stroke={color} strokeWidth={2.5} dot={{ r: 3, strokeWidth: 2 }} activeDot={{ r: 5 }} />
              ))}
              <Legend iconType="circle" wrapperStyle={{ fontSize: ".65rem", fontWeight: 600 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Daily Empty Shelf Incidents — Bar Chart */}
        <div className="reg-card">
          <h3 style={{ display: "flex", alignItems: "center", gap: 6, color: "#ef4444" }}>
            <Warning size={16} weight="fill" /> Empty Shelf Incidents — Last 7 Days
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={dailyEmptyShelf} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fontWeight: 600 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: ".72rem", border: "1px solid #e2e8f0", boxShadow: "0 4px 16px rgba(0,0,0,.08)" }} />
              {Object.entries(storeColors).map(([name, color]) => (
                <Bar key={name} dataKey={name} fill={color} radius={[3, 3, 0, 0]} />
              ))}
              <Legend iconType="circle" wrapperStyle={{ fontSize: ".65rem", fontWeight: 600 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Best Practices & Needs Attention */}
      <div className="reg-charts-row">
        <div>
          <h3 style={{ fontSize: ".82rem", fontWeight: 800, color: "#065f46", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}><TrendUp size={15} weight="fill" /> Best Practices</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {bestPractices.map((bp, i) => (
              <div key={i} className="spotlight-card">
                <div className="spotlight-header">{bp.store}</div>
                <p className="spotlight-text">{bp.detail}</p>
                <button className="owner-action-btn green">{bp.action}</button>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 style={{ fontSize: ".82rem", fontWeight: 800, color: "#dc2626", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}><Warning size={15} weight="fill" /> Needs Attention</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {needsAttention.map((na, i) => (
              <div key={i} className="redflag-card">
                <div className="redflag-header">{na.store}</div>
                <p className="redflag-text">{na.detail}</p>
                <button className="owner-action-btn red"><Envelope size={13} weight="bold" /> {na.action}</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreCompare;
