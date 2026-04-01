import React from "react";
import { motion } from "framer-motion";
import {
  TrendUp, TrendDown, CheckCircle, Warning, Trophy, Clock,
  Scan, Package, CurrencyInr, ChartBar, User, Printer,
  Envelope, FilePdf
} from "@phosphor-icons/react";
import "./DailyReport.css";

const metrics = [
  { label: "Total Scans", value: "30", sub: "10 shelves × 3 cycles", icon: Scan, color: "#6366f1" },
  { label: "Compliance Rate", value: "88.4%", sub: "Up from 82.1% last Wed", icon: ChartBar, color: "#059669", trend: "+6.3%" },
  { label: "OOS Detected", value: "42", sub: "Across all scans", icon: Warning, color: "#ef4444" },
  { label: "Restocked", value: "38/42", sub: "90.5% completion", icon: Package, color: "#22c55e" },
  { label: "Avg Restock Time", value: "14 min", sub: "Down from 22 min last week", icon: Clock, color: "#f59e0b", trend: "-36%" },
  { label: "Revenue Saved", value: "₹52,800", sub: "Estimated today", icon: CurrencyInr, color: "#059669" },
  { label: "Misplacements", value: "7", sub: "All corrected on-floor", icon: CheckCircle, color: "#8b5cf6" },
];

const topSaves = [
  { rank: "🥇", product: "Maggi 2-Min Noodles 70g", shelf: 10, detail: "Completely OOS on eye-level. 48 units/day.", caught: "8:22 AM", restocked: "8:35 AM", revenue: 8640 },
  { rank: "🥈", product: "Surf Excel Quick Wash 1kg", shelf: 6, detail: "6 of 8 facings empty. High-velocity SKU.", caught: "9:42 AM", restocked: "10:04 AM", revenue: 6800 },
  { rank: "🥉", product: "Parle-G 250g", shelf: 7, detail: "4 of 6 facings empty. Morning rush.", caught: "9:18 AM", restocked: "9:31 AM", revenue: 4400 },
  { rank: "4", product: "Amul Butter 100g", shelf: 2, detail: "Low stock caught before complete OOS.", caught: "9:52 AM", restocked: "10:06 AM", revenue: 3200 },
  { rank: "5", product: "Cadbury Dairy Milk 50g", shelf: 7, detail: "3 units OOS in impulse-buy position.", caught: "9:18 AM", restocked: "9:38 AM", revenue: 2880 },
];

const zeroStock = [
  { product: "Amul Taaza 500ml", demand: 18, supplier: "Amul distributor", status: "0 units" },
  { product: "Real Juice Mango 1L", demand: 8, supplier: "Expected Thursday", status: "0 units" },
  { product: "Dettol Handwash 250ml", demand: 12, supplier: "Reorder triggered", status: "0 units" },
  { product: "Bisleri 1L (6-pack)", demand: 24, supplier: "Will OOS by tomorrow AM", status: "2 units" },
];

const staff = [
  { name: "Rahul M.", role: "Floor", scans: 10, catches: 14, avg: "20 min/shelf", icon: Scan },
  { name: "Amit D.", role: "Floor", scans: 10, catches: 16, avg: "18 min/shelf", icon: Scan },
  { name: "Vikram P.", role: "Floor", scans: 10, catches: 12, avg: "22 min/shelf", icon: Scan },
  { name: "Suresh K.", role: "Storeroom", restocks: 16, avg: "12 min", icon: Package },
  { name: "Manoj T.", role: "Storeroom", restocks: 14, avg: "15 min", icon: Package },
  { name: "Deepa S.", role: "Storeroom", restocks: 8, avg: "16 min", icon: Package },
];

const DailyReport = () => (
  <div className="report-screen">
    {/* Header */}
    <div className="report-header">
      <div>
        <h2>Daily Operations Report</h2>
        <span className="report-date">Wednesday, 25 March 2026 — Q-Mart Kothrud, Pune</span>
      </div>
      <div className="report-actions">
        <button className="report-btn"><Printer size={14} weight="bold" /> Print</button>
        <button className="report-btn"><FilePdf size={14} weight="bold" /> PDF</button>
        <button className="report-btn"><Envelope size={14} weight="bold" /> Email</button>
      </div>
    </div>

    {/* Metrics Strip */}
    <div className="report-metrics">
      {metrics.map((m, i) => (
        <motion.div key={i} className="rm-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
          <div className="rm-icon" style={{ background: `${m.color}15`, color: m.color }}><m.icon size={18} weight="duotone" /></div>
          <div className="rm-body">
            <span className="rm-label">{m.label}</span>
            <strong className="rm-value">{m.value}</strong>
            <span className="rm-sub">{m.sub}</span>
          </div>
          {m.trend && <span className={`rm-trend ${m.trend.startsWith("+") ? "trend-up" : "trend-down"}`}>{m.trend.startsWith("+") ? <TrendUp size={12} weight="bold" /> : <TrendDown size={12} weight="bold" />} {m.trend}</span>}
        </motion.div>
      ))}
    </div>

    <div className="report-body">
      {/* Top 5 Revenue Saves */}
      <div className="report-card">
        <h3><Trophy size={16} weight="fill" /> Top 5 Revenue Saves</h3>
        <div className="saves-list">
          {topSaves.map((s, i) => (
            <div key={i} className="save-row">
              <span className="save-rank">{s.rank}</span>
              <div className="save-body">
                <strong>{s.product}</strong>
                <span className="save-detail">Shelf {s.shelf} — {s.detail}</span>
                <span className="save-times">Caught {s.caught} → Restocked {s.restocked}</span>
              </div>
              <span className="save-revenue">₹{s.revenue.toLocaleString("en-IN")}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="report-right-col">
        {/* Restock Efficiency */}
        <div className="report-card eff-card">
          <h3><CheckCircle size={16} weight="fill" /> Restock Efficiency</h3>
          <div className="eff-ring-row">
            <div className="eff-ring">
              <svg viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="32" fill="none" stroke="#e2e8f0" strokeWidth="7" />
                <circle cx="40" cy="40" r="32" fill="none" stroke="#22c55e" strokeWidth="7"
                  strokeDasharray={`${0.905 * 2 * Math.PI * 32} ${2 * Math.PI * 32}`}
                  strokeLinecap="round" transform="rotate(-90 40 40)" />
              </svg>
              <strong>90.5%</strong>
            </div>
            <div className="eff-text">
              <span>Within 20-min SLA</span>
              <span className="eff-prev">Up from 74% last week</span>
            </div>
          </div>
        </div>

        {/* Zero Stock */}
        <div className="report-card">
          <h3><Warning size={16} weight="fill" /> Zero Back-Stock — Procurement Action</h3>
          <div className="zero-list">
            {zeroStock.map((z, i) => (
              <div key={i} className="zero-row">
                <div className="zero-body">
                  <strong>{z.product}</strong>
                  <span>Daily demand: {z.demand} units</span>
                </div>
                <div className="zero-right">
                  <span className="zero-status">{z.status}</span>
                  <span className="zero-supplier">{z.supplier}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* Planogram Compliance Trend */}
    <div className="report-card" style={{ marginTop: 14 }}>
      <h3><ChartBar size={16} weight="fill" /> Planogram Compliance — 7-Day Trend</h3>
      <div className="compliance-trend">
        <svg viewBox="0 0 320 100" className="trend-chart">
          {/* Grid lines */}
          {[90, 85, 80, 75].map(v => {
            const y = 100 - ((v - 70) / 25) * 100;
            return <g key={v}><line x1="30" x2="310" y1={y} y2={y} stroke="#f1f5f9" strokeWidth="1" /><text x="2" y={y + 3} fontSize="8" fill="#94a3b8">{v}%</text></g>;
          })}
          {/* Target line 90% */}
          <line x1="30" x2="310" y1={100 - ((90 - 70) / 25) * 100} y2={100 - ((90 - 70) / 25) * 100} stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 3" />
          <text x="312" y={100 - ((90 - 70) / 25) * 100 + 3} fontSize="7" fill="#f59e0b">Target</text>
          {/* Data points */}
          {(() => {
            const pts = [{ d: "Thu", v: 82.1 }, { d: "Fri", v: 83.5 }, { d: "Sat", v: 85.2 }, { d: "Sun", v: 84.0 }, { d: "Mon", v: 86.1 }, { d: "Tue", v: 87.3 }, { d: "Wed", v: 88.4 }];
            const xs = pts.map((_, i) => 30 + i * 46.7);
            const ys = pts.map(p => 100 - ((p.v - 70) / 25) * 100);
            const pathD = pts.map((_, i) => `${i === 0 ? 'M' : 'L'}${xs[i]},${ys[i]}`).join(' ');
            const areaD = `${pathD} L${xs[xs.length - 1]},100 L${xs[0]},100 Z`;
            return <>
              <path d={areaD} fill="url(#trendGrad)" opacity="0.3" />
              <defs><linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" /><stop offset="100%" stopColor="#10b981" stopOpacity="0" /></linearGradient></defs>
              <path d={pathD} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              {pts.map((p, i) => <g key={i}><circle cx={xs[i]} cy={ys[i]} r="4" fill="#fff" stroke="#10b981" strokeWidth="2" /><text x={xs[i]} y={ys[i] - 8} textAnchor="middle" fontSize="7" fontWeight="700" fill="#0f172a">{p.v}%</text><text x={xs[i]} y="98" textAnchor="middle" fontSize="7" fill="#94a3b8">{p.d}</text></g>)}
            </>;
          })()}
        </svg>
      </div>
    </div>

    {/* Staff Performance */}
    <div className="report-card staff-card">
      <h3><User size={16} weight="duotone" /> Staff Performance</h3>
      <div className="staff-grid">
        {staff.map((s, i) => (
          <div key={i} className={`staff-row staff-${s.role.toLowerCase()}`}>
            <div className="staff-top">
              <div className="staff-avatar">{s.name[0]}</div>
              <div className="staff-body">
                <strong>{s.name}</strong>
                <span className="staff-role">{s.role}</span>
              </div>
            </div>
            <div className="staff-stats">
              {s.scans != null && <span>{s.scans} scans</span>}
              {s.catches != null && <span>{s.catches} catches</span>}
              {s.restocks != null && <span>{s.restocks} restocks</span>}
              <span className="staff-avg">Avg: {s.avg}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default DailyReport;
