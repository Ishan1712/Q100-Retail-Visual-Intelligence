import React, { useState } from "react";
import { motion } from "framer-motion";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import { Star, Warning, FilePdf, TrendUp } from "@phosphor-icons/react";
import "./Regional.css";

const storeColors = { Pune: "#059669", Mumbai: "#6366f1", Nashik: "#f59e0b", Nagpur: "#fb923c", "A'bad": "#ef4444" };
const metrics = ["Shelf Compliance", "Restock Speed", "OOS Detection", "Planogram Accuracy", "Revenue Recovery", "Staff Efficiency"];
const radarData = metrics.map(m => ({
  metric: m.replace("Shelf ", "").replace(" Rate", ""),
  Pune: [88,92,86,90,84,88][metrics.indexOf(m)],
  Mumbai: [85,84,88,86,88,82][metrics.indexOf(m)],
  Nashik: [83,78,80,82,78,80][metrics.indexOf(m)],
  Nagpur: [80,72,76,78,74,76][metrics.indexOf(m)],
  "A'bad": [79,65,74,72,68,70][metrics.indexOf(m)],
}));

const trendData = {
  "Shelf Compliance": [
    { month: "Nov", Pune: 72, Mumbai: 70, Nashik: 66, Nagpur: 64, "A'bad": 62 },
    { month: "Dec", Pune: 78, Mumbai: 76, Nashik: 72, Nagpur: 70, "A'bad": 66 },
    { month: "Jan", Pune: 82, Mumbai: 80, Nashik: 78, Nagpur: 74, "A'bad": 72 },
    { month: "Feb", Pune: 86, Mumbai: 83, Nashik: 80, Nagpur: 78, "A'bad": 76 },
    { month: "Mar", Pune: 88, Mumbai: 85, Nashik: 83, Nagpur: 80, "A'bad": 79 },
  ],
  "Restock Speed": [
    { month: "Nov", Pune: 24, Mumbai: 26, Nashik: 28, Nagpur: 30, "A'bad": 34 },
    { month: "Dec", Pune: 20, Mumbai: 22, Nashik: 24, Nagpur: 26, "A'bad": 30 },
    { month: "Jan", Pune: 18, Mumbai: 20, Nashik: 22, Nagpur: 24, "A'bad": 27 },
    { month: "Feb", Pune: 16, Mumbai: 18, Nashik: 20, Nagpur: 22, "A'bad": 25 },
    { month: "Mar", Pune: 14, Mumbai: 16, Nashik: 18, Nagpur: 21, "A'bad": 24 },
  ],
};

const bestPractice = "Pune's Dairy aisle compliance is 91.2% — 16 points above the chain average of 75.3%. Root cause: Pune's manager implemented a 'first-scan-first-restock' rule — Dairy is always the first aisle scanned at 6:30 AM before the morning rush. Their Amul and Mother Dairy OOS rates are the lowest in the chain.";
const redFlag = "Aurangabad's restock SLA has increased for 4 consecutive weeks (Week 9: 20 min, Week 10: 21 min, Week 11: 23 min, Week 12: 24 min). Root cause: 1 of 3 storeroom workers resigned in February, not yet replaced. Floor workers are detecting OOS but restocks are backing up.";

const StoreCompare = () => {
  const [drillMetric, setDrillMetric] = useState("Shelf Compliance");
  const drillData = trendData[drillMetric] || trendData["Shelf Compliance"];

  return (
    <div className="reg-screen">
      <div className="reg-card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h3 style={{ margin: 0 }}><Star size={16} weight="fill" /> Cross-Store Comparison</h3>
        <button className="drill-btn" style={{ background: "#1e40af", color: "#fff", border: "none" }}><FilePdf size={13} weight="bold" /> Download Report</button>
      </div>

      <div className="radar-section">
        {/* Radar Chart */}
        <div className="reg-card">
          <h3>Performance Radar — All Stores</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fontWeight: 600 }} />
              <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9 }} />
              {Object.entries(storeColors).map(([name, color]) => (
                <Radar key={name} name={name} dataKey={name} stroke={color} fill={color} fillOpacity={0.08} strokeWidth={2} />
              ))}
            </RadarChart>
          </ResponsiveContainer>
          <div className="radar-legend">
            {Object.entries(storeColors).map(([name, color]) => (
              <span key={name} className="radar-leg"><span className="radar-leg-dot" style={{ background: color }} /> {name}</span>
            ))}
          </div>
        </div>

        {/* Drill-Down Trend */}
        <div className="reg-card">
          <h3>5-Month Trend — Drill Down</h3>
          <div className="drill-controls">
            {Object.keys(trendData).map(m => (
              <button key={m} className={`drill-btn${drillMetric === m ? " active" : ""}`} onClick={() => setDrillMetric(m)}>{m}</button>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={drillData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={drillMetric === "Restock Speed" ? [10, 36] : [55, 95]} />
              <Tooltip />
              {Object.entries(storeColors).map(([name, color]) => (
                <Line key={name} type="monotone" dataKey={name} stroke={color} strokeWidth={2} dot={{ r: 3 }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div className="spotlight-card">
          <div className="spotlight-header"><TrendUp size={15} weight="fill" /> Best Practice Spotlight</div>
          <p className="spotlight-text">{bestPractice}</p>
        </div>
        <div className="redflag-card">
          <div className="redflag-header"><Warning size={15} weight="fill" /> Red Flag Alert</div>
          <p className="redflag-text">{redFlag}</p>
        </div>
      </div>
    </div>
  );
};

export default StoreCompare;
