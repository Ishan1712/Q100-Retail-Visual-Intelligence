import React from "react";
import { motion } from "framer-motion";
import {
  TrendUp, TrendDown, CheckCircle, Warning, Trophy, Clock,
  Scan, Package, CurrencyInr, ChartBar, Printer,
  Envelope, FilePdf, Users, ShoppingCart
} from "@phosphor-icons/react";
import "./DailyReport.css";

const metrics = [
  { label: "Daily Sales", value: "₹48,500", sub: "Up from ₹44,200 yesterday", icon: ShoppingCart, color: "#059669", trend: "+9.7%" },
  { label: "Total Scans", value: "30", sub: "10 shelves × 3 cycles", icon: Scan, color: "#6366f1" },
  { label: "Compliance Rate", value: "88.4%", sub: "Up from 82.1% last week", icon: ChartBar, color: "#10b981", trend: "+6.3%" },
  { label: "OOS Detected", value: "42", sub: "Across all scans", icon: Warning, color: "#ef4444" },
  { label: "Restocked", value: "38/42", sub: "90.5% completion", icon: Package, color: "#22c55e" },
  { label: "Avg Restock Time", value: "14 min", sub: "Down from 22 min last week", icon: Clock, color: "#f59e0b", trend: "-36%" },
  { label: "Revenue Saved", value: "₹52,800", sub: "From fast restocking today", icon: CurrencyInr, color: "#059669" },
  { label: "Active Workers", value: "6/6", sub: "All staff on duty", icon: Users, color: "#6366f1" },
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

const bestSelling = [
  { rank: 1, product: "Maggi 2-Min Noodles 70g", category: "Instant Food", unitsSold: 148, revenue: 2072, trend: "+12%" },
  { rank: 2, product: "Amul Taaza 500ml", category: "Dairy", unitsSold: 132, revenue: 3300, trend: "+8%" },
  { rank: 3, product: "Parle-G 250g", category: "Biscuits", unitsSold: 124, revenue: 1240, trend: "+5%" },
  { rank: 4, product: "Surf Excel Quick Wash 1kg", category: "Detergent", unitsSold: 98, revenue: 12740, trend: "+15%" },
  { rank: 5, product: "Cadbury Dairy Milk 50g", category: "Chocolate", unitsSold: 92, revenue: 3680, trend: "+3%" },
  { rank: 6, product: "Tata Salt 1kg", category: "Grocery", unitsSold: 88, revenue: 1760, trend: "+2%" },
  { rank: 7, product: "Bisleri 1L", category: "Beverages", unitsSold: 84, revenue: 1680, trend: "+18%" },
  { rank: 8, product: "Kurkure Masala Munch", category: "Snacks", unitsSold: 76, revenue: 1520, trend: "+6%" },
  { rank: 9, product: "Amul Butter 100g", category: "Dairy", unitsSold: 72, revenue: 3600, trend: "+4%" },
  { rank: 10, product: "Colgate MaxFresh 150g", category: "Oral Care", unitsSold: 68, revenue: 5440, trend: "+1%" },
];

const slowMoving = [
  { rank: 1, product: "Patanjali Honey 500g", category: "Health Foods", unitsSold: 2, revenue: 490, daysOnShelf: 18, trend: "-22%" },
  { rank: 2, product: "Organic Tattva Quinoa 500g", category: "Health Foods", unitsSold: 3, revenue: 870, daysOnShelf: 15, trend: "-18%" },
  { rank: 3, product: "Saffola Gold Oil 1L", category: "Cooking Oil", unitsSold: 4, revenue: 720, daysOnShelf: 14, trend: "-12%" },
  { rank: 4, product: "Himalaya Face Wash 150ml", category: "Personal Care", unitsSold: 4, revenue: 600, daysOnShelf: 12, trend: "-8%" },
  { rank: 5, product: "Kellogg's Muesli 500g", category: "Breakfast", unitsSold: 5, revenue: 1350, daysOnShelf: 11, trend: "-15%" },
  { rank: 6, product: "Too Yumm Veggie Stix", category: "Snacks", unitsSold: 5, revenue: 250, daysOnShelf: 10, trend: "-10%" },
  { rank: 7, product: "Real Activ Juice 1L", category: "Beverages", unitsSold: 6, revenue: 594, daysOnShelf: 9, trend: "-6%" },
  { rank: 8, product: "Borges Olive Oil 250ml", category: "Cooking Oil", unitsSold: 6, revenue: 2094, daysOnShelf: 9, trend: "-20%" },
  { rank: 9, product: "Hershey's Syrup 200g", category: "Confectionery", unitsSold: 7, revenue: 1260, daysOnShelf: 8, trend: "-5%" },
  { rank: 10, product: "Paper Boat Aam Panna", category: "Beverages", unitsSold: 7, revenue: 280, daysOnShelf: 7, trend: "-3%" },
];


const staffLeaderboard = [
  { rank: 1, name: "Amit D.", role: "Floor Scanner", tasksCompleted: 26, avgTime: "11 min", accuracy: "98%", score: 972 },
  { rank: 2, name: "Suresh K.", role: "Storeroom", tasksCompleted: 24, avgTime: "12 min", accuracy: "96%", score: 948 },
  { rank: 3, name: "Rahul M.", role: "Floor Scanner", tasksCompleted: 22, avgTime: "14 min", accuracy: "95%", score: 910 },
  { rank: 4, name: "Manoj T.", role: "Storeroom", tasksCompleted: 20, avgTime: "15 min", accuracy: "94%", score: 876 },
  { rank: 5, name: "Deepa S.", role: "Storeroom", tasksCompleted: 18, avgTime: "13 min", accuracy: "97%", score: 862 },
  { rank: 6, name: "Vikram P.", role: "Floor Scanner", tasksCompleted: 18, avgTime: "16 min", accuracy: "93%", score: 830 },
  { rank: 7, name: "Priya N.", role: "Floor Scanner", tasksCompleted: 16, avgTime: "17 min", accuracy: "92%", score: 795 },
  { rank: 8, name: "Ravi S.", role: "Storeroom", tasksCompleted: 15, avgTime: "14 min", accuracy: "91%", score: 768 },
  { rank: 9, name: "Anita K.", role: "Floor Scanner", tasksCompleted: 14, avgTime: "18 min", accuracy: "90%", score: 740 },
  { rank: 10, name: "Kiran J.", role: "Storeroom", tasksCompleted: 12, avgTime: "16 min", accuracy: "89%", score: 710 },
];

const DailyReport = () => {
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
  <div className="report-screen">
    {/* Header */}
    <div className="report-header">
      <div>
        <h2>Daily Operations Report</h2>
        <span className="report-date">{dateStr} — Q-Mart Kothrud, Pune</span>
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


    {/* Top 10 Best Selling & Slowest Moving Products */}
    <div className="report-tables-row">
      <div className="report-card">
        <h3><TrendUp size={16} weight="fill" style={{ color: "#059669" }} /> Top 10 Best Selling Products</h3>
        <div className="report-table-wrap">
          <table className="report-table best-selling-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Category</th>
                <th>Units Sold</th>
                <th>Revenue</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              {bestSelling.map((p) => (
                <tr key={p.rank}>
                  <td className="rt-rank">{p.rank}</td>
                  <td className="rt-product">{p.product}</td>
                  <td className="rt-category">{p.category}</td>
                  <td className="rt-units">{p.unitsSold}</td>
                  <td className="rt-revenue">₹{p.revenue.toLocaleString("en-IN")}</td>
                  <td><span className="rt-trend trend-up">{p.trend}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="report-card">
        <h3><TrendDown size={16} weight="fill" style={{ color: "#ef4444" }} /> Top 10 Slowest Moving Products</h3>
        <div className="report-table-wrap">
          <table className="report-table slow-moving-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Category</th>
                <th>Units Sold</th>
                <th>Days on Shelf</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              {slowMoving.map((p) => (
                <tr key={p.rank}>
                  <td className="rt-rank">{p.rank}</td>
                  <td className="rt-product">{p.product}</td>
                  <td className="rt-category">{p.category}</td>
                  <td className="rt-units">{p.unitsSold}</td>
                  <td className="rt-days">{p.daysOnShelf} days</td>
                  <td><span className="rt-trend trend-down-red">{p.trend}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    {/* Staff Leaderboard */}
    <div className="report-card" style={{ marginTop: 14 }}>
      <h3><Trophy size={16} weight="fill" style={{ color: "#f59e0b" }} /> Staff Leaderboard — Top 10</h3>
      <div className="report-table-wrap">
        <table className="report-table leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Staff</th>
              <th>Role</th>
              <th>Tasks Done</th>
              <th>Avg Time</th>
              <th>Accuracy</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {staffLeaderboard.map((s) => (
              <tr key={s.rank} className={s.rank <= 3 ? "lb-top3" : ""}>
                <td className="lb-rank">
                  {s.rank === 1 ? "🥇" : s.rank === 2 ? "🥈" : s.rank === 3 ? "🥉" : s.rank}
                </td>
                <td className="lb-name">
                  <span className="lb-avatar">{s.name[0]}</span>
                  {s.name}
                </td>
                <td className="lb-role">{s.role}</td>
                <td className="lb-tasks">{s.tasksCompleted}</td>
                <td className="lb-time">{s.avgTime}</td>
                <td className="lb-accuracy">{s.accuracy}</td>
                <td className="lb-score">{s.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  );
};

export default DailyReport;
