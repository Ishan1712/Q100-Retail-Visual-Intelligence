import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend,
  CartesianGrid, ReferenceLine
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

/* Before & After Q100 — 12 month data */
const beforeAfterData = [
  { month: "Jul '25", sales: 14.2, emptyShelf: 380, walkout: 8.2 },
  { month: "Aug", sales: 14.5, emptyShelf: 365, walkout: 7.9 },
  { month: "Sep", sales: 14.1, emptyShelf: 390, walkout: 8.5 },
  { month: "Oct", sales: 14.8, emptyShelf: 372, walkout: 8.0 },
  { month: "Nov", sales: 14.4, emptyShelf: 385, walkout: 8.3 },
  { month: "Dec", sales: 15.0, emptyShelf: 370, walkout: 7.8 },
  /* Q100 deployed Jan '26 */
  { month: "Jan '26", sales: 15.8, emptyShelf: 290, walkout: 6.8, deploy: true },
  { month: "Feb", sales: 16.9, emptyShelf: 210, walkout: 5.6 },
  { month: "Mar", sales: 17.8, emptyShelf: 165, walkout: 4.8 },
  { month: "Apr", sales: 18.6, emptyShelf: 147, walkout: 4.5 },
  { month: "May*", sales: 19.2, emptyShelf: 130, walkout: 4.2 },
  { month: "Jun*", sales: 19.8, emptyShelf: 118, walkout: 3.9 },
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

        {/* Before & After Q100 */}
        <div className="reg-card">
          <h3>Before & After Q100 — 12 Month View</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={beforeAfterData} margin={{ left: 0, right: 10, top: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis yAxisId="sales" tick={{ fontSize: 10 }} domain={[12, 22]} />
              <YAxis yAxisId="empty" orientation="right" tick={{ fontSize: 10 }} domain={[0, 450]} />
              <Tooltip />
              <ReferenceLine x="Jan '26" stroke="#6366f1" strokeDasharray="4 4" yAxisId="sales"
                label={{ value: "Q100 Deployed", fontSize: 10, fill: "#6366f1", position: "top" }} />
              <Line yAxisId="sales" type="monotone" dataKey="sales" name="Daily Sales (₹L)" stroke="#059669" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line yAxisId="empty" type="monotone" dataKey="emptyShelf" name="Empty Shelf Incidents" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
          <div className="owner-insight-bar">
            Since Q100: Sales up <strong>+₹4.2L/month</strong>, Empty shelves down <strong>68%</strong>, Walkouts reduced <strong>45%</strong>
          </div>
        </div>
      </div>

      {/* Best Practices & Needs Attention */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
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
