import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Buildings, TrendUp, TrendDown, Minus, MapPin, CurrencyInr,
  ChartBar, Warning, Star, Lightning, CheckCircle
} from "@phosphor-icons/react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import "./Regional.css";

const kpis = [
  { label: "SKUs Monitored", value: "4,200", sub: "Across 5 stores", icon: ChartBar, color: "#6366f1" },
  { label: "Portfolio Compliance", value: "83.6%", sub: "Up from 68.4% at deploy", icon: CheckCircle, color: "#059669", trend: "+15.2%" },
  { label: "Monthly Revenue Recovered", value: "₹12.7L", sub: "₹38.2L quarterly", icon: CurrencyInr, color: "#059669" },
  { label: "Planogram Score", value: "81.4%", sub: "Target: 85%", icon: Star, color: "#f59e0b" },
  { label: "Trade Marketing at Risk", value: "₹2.4L/qtr", sub: "If below 85% chain-wide", icon: Warning, color: "#ef4444" },
];

const stores = [
  { rank: 1, name: "Q-Mart Kothrud", city: "Pune", area: "8,200 sq ft", skus: 840, compliance: 88.4, sla: 14, revenue: "₹3.2L", trend: "up", color: "#059669", lat: 18.51, lng: 73.81 },
  { rank: 2, name: "Q-Mart Andheri", city: "Mumbai", area: "12,000 sq ft", skus: 1120, compliance: 85.1, sla: 16, revenue: "₹3.8L", trend: "up", color: "#059669", lat: 19.12, lng: 72.85 },
  { rank: 3, name: "Q-Mart Gangapur Road", city: "Nashik", area: "6,400 sq ft", skus: 720, compliance: 82.8, sla: 18, revenue: "₹2.1L", trend: "flat", color: "#f59e0b", lat: 20.00, lng: 73.78 },
  { rank: 4, name: "Q-Mart Dharampeth", city: "Nagpur", area: "7,800 sq ft", skus: 810, compliance: 80.2, sla: 21, revenue: "₹2.0L", trend: "up", color: "#f59e0b", lat: 21.15, lng: 79.09 },
  { rank: 5, name: "Q-Mart Jalna Road", city: "Aurangabad", area: "6,000 sq ft", skus: 710, compliance: 78.6, sla: 24, revenue: "₹1.6L", trend: "down", color: "#ef4444", lat: 19.88, lng: 75.34 },
];

const leakageData = [
  { store: "Pune", value: 82, fill: "#059669" },
  { store: "Mumbai", value: 110, fill: "#34d399" },
  { store: "Nashik", value: 134, fill: "#f59e0b" },
  { store: "Nagpur", value: 156, fill: "#fb923c" },
  { store: "A'bad", value: 198, fill: "#ef4444" },
];

const impactDonut = [
  { name: "OOS Recovery", value: 8.4, color: "#059669" },
  { name: "Penalty Avoided", value: 2.4, color: "#6366f1" },
  { name: "Labour Savings", value: 1.1, color: "#f59e0b" },
  { name: "Shrinkage", value: 0.65, color: "#8b5cf6" },
];

const TrendIcon = ({ trend }) => {
  if (trend === "up") return <TrendUp size={13} weight="bold" className="trend-icon trend-up" />;
  if (trend === "down") return <TrendDown size={13} weight="bold" className="trend-icon trend-down" />;
  return <Minus size={13} weight="bold" className="trend-icon trend-flat" />;
};

const PortfolioHQ = () => {
  const [hoveredStore, setHoveredStore] = useState(null);

  return (
    <div className="reg-screen">
      {/* KPI Strip */}
      <div className="reg-kpi-strip">
        {kpis.map((k, i) => (
          <motion.div key={i} className="reg-kpi" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <div className="reg-kpi-icon" style={{ background: `${k.color}15`, color: k.color }}><k.icon size={18} weight="duotone" /></div>
            <div className="reg-kpi-body">
              <span className="reg-kpi-label">{k.label}</span>
              <strong>{k.value}</strong>
              <span className="reg-kpi-sub">{k.sub}</span>
            </div>
            {k.trend && <span className="reg-kpi-trend trend-up"><TrendUp size={11} weight="bold" /> {k.trend}</span>}
          </motion.div>
        ))}
      </div>

      <div className="reg-body">
        {/* Left: Map + Leaderboard */}
        <div className="reg-left">
          {/* Maharashtra Map */}
          <div className="reg-card">
            <h3><MapPin size={16} weight="duotone" /> Maharashtra Store Network</h3>
            <div className="map-container">
              <svg viewBox="0 0 400 300" className="map-svg">
                {/* Simplified Maharashtra outline */}
                <path d="M50,80 Q100,40 180,50 Q260,30 320,70 Q370,100 360,160 Q350,220 300,250 Q240,280 160,270 Q80,260 40,200 Q20,140 50,80Z"
                  fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" />
                <text x="200" y="150" textAnchor="middle" fontSize="10" fill="#cbd5e1" fontWeight="700">MAHARASHTRA</text>
                {/* Store pins */}
                {stores.map((s, i) => {
                  const x = 50 + ((s.lng - 72.5) / (79.5 - 72.5)) * 300;
                  const y = 40 + ((21.5 - s.lat) / (21.5 - 18.0)) * 220;
                  return (
                    <g key={i} onMouseEnter={() => setHoveredStore(i)} onMouseLeave={() => setHoveredStore(null)} style={{ cursor: "pointer" }}>
                      <circle cx={x} cy={y} r={hoveredStore === i ? 10 : 7} fill={s.color} stroke="#fff" strokeWidth="2"
                        opacity={hoveredStore !== null && hoveredStore !== i ? 0.4 : 1} />
                      <text x={x} y={y - 14} textAnchor="middle" fontSize="8" fontWeight="700" fill="#334155">{s.city}</text>
                      {hoveredStore === i && (
                        <foreignObject x={x + 12} y={y - 50} width="160" height="80">
                          <div className="map-tooltip">
                            <strong>{s.name}</strong>
                            <span>Compliance: {s.compliance}%</span>
                            <span>SLA: {s.sla} min</span>
                            <span>Revenue: {s.revenue}/mo</span>
                          </div>
                        </foreignObject>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Revenue Leakage Index */}
          <div className="reg-card">
            <h3><Lightning size={16} weight="fill" /> Revenue Leakage Index (₹/hr during peak)</h3>
            <div className="leakage-chart">
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={leakageData} layout="vertical" margin={{ left: 10, right: 20 }}>
                  <XAxis type="number" domain={[0, 250]} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="store" width={50} tick={{ fontSize: 11, fontWeight: 600 }} />
                  <RTooltip formatter={(v) => [`₹${v}/hr`, "Leakage"]} />
                  <ReferenceLine x={100} stroke="#ef4444" strokeDasharray="4 4" label={{ value: "Target", fontSize: 10, fill: "#ef4444" }} />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={20}>
                    {leakageData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right: Leaderboard + Financial Impact */}
        <div className="reg-right">
          {/* Store Leaderboard */}
          <div className="reg-card">
            <h3><Star size={16} weight="fill" /> Store Leaderboard</h3>
            <div className="lb-list">
              {stores.map((s) => (
                <motion.div key={s.rank} className="lb-row" whileHover={{ x: 3 }}>
                  <span className={`lb-rank rank-${s.rank}`}>#{s.rank}</span>
                  <div className="lb-info">
                    <strong>{s.name}</strong>
                    <span>{s.city} · {s.area} · {s.skus} SKUs</span>
                  </div>
                  <div className="lb-metrics">
                    <span className="lb-compliance">{s.compliance}%</span>
                    <span className="lb-sla">{s.sla}m SLA</span>
                    <span className="lb-revenue">{s.revenue}</span>
                    <TrendIcon trend={s.trend} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Financial Impact */}
          <div className="reg-card fin-card">
            <h3><CurrencyInr size={16} weight="bold" /> Quarterly Financial Impact</h3>
            <div className="fin-hero">
              <strong className="fin-amount">₹38.2L</strong>
              <span>revenue recovered this quarter</span>
            </div>
            <div className="fin-donut-row">
              <div className="fin-donut-wrap">
                <ResponsiveContainer width={120} height={120}>
                  <PieChart>
                    <Pie data={impactDonut} cx="50%" cy="50%" innerRadius={30} outerRadius={50} paddingAngle={3} dataKey="value">
                      {impactDonut.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="fin-legend">
                {impactDonut.map((d, i) => (
                  <div key={i} className="fin-leg-item">
                    <span className="fin-leg-dot" style={{ background: d.color }} />
                    <span className="fin-leg-label">{d.name}</span>
                    <strong className="fin-leg-val">₹{d.value}L</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioHQ;
