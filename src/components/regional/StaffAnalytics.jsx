import React from "react";
import { User, Warning, TrendUp, Lightning, Scan, Package } from "@phosphor-icons/react";
import "./Regional.css";

const summary = [
  { label: "Floor Staff", value: "14", sub: "Across 5 stores" },
  { label: "Storeroom Staff", value: "13", sub: "Across 5 stores" },
  { label: "Avg Scans/Day", value: "30", sub: "Per store" },
  { label: "Avg Restock SLA", value: "18.6m", sub: "Target: <20m" },
  { label: "Coverage Velocity", value: "92%", sub: "Within 2hrs of open" },
];

const staffTable = [
  { store: "Pune", floor: 3, storeroom: 3, vacancy: "0", sla: "14 min", bi: 0.9, biClass: "bi-healthy", biLabel: "Healthy", compliance: "88.4%" },
  { store: "Mumbai", floor: 3, storeroom: 3, vacancy: "0", sla: "16 min", bi: 1.1, biClass: "bi-borderline", biLabel: "Borderline", compliance: "85.1%" },
  { store: "Nashik", floor: 3, storeroom: 3, vacancy: "1 (store)", sla: "18 min", bi: 1.3, biClass: "bi-watch", biLabel: "Watch", compliance: "82.8%" },
  { store: "Nagpur", floor: 3, storeroom: 2, vacancy: "1 (store)", sla: "21 min", bi: 1.6, biClass: "bi-bottleneck", biLabel: "Bottleneck", compliance: "80.2%" },
  { store: "Aurangabad", floor: 2, storeroom: 2, vacancy: "1+1", sla: "24 min", bi: 1.8, biClass: "bi-critical", biLabel: "Critical", compliance: "78.6%" },
];

const topPerformers = [
  { rank: 1, name: "Amit D.", store: "Pune", role: "Floor", stat: "16 catches/day, 18m/aisle" },
  { rank: 2, name: "Rahul M.", store: "Pune", role: "Floor", stat: "14 catches/day, 20m/aisle" },
  { rank: 3, name: "Suresh K.", store: "Pune", role: "Storeroom", stat: "12m avg, 16 tasks/day" },
  { rank: 4, name: "Priya N.", store: "Mumbai", role: "Floor", stat: "15 catches/day, 19m/aisle" },
  { rank: 5, name: "Manoj T.", store: "Pune", role: "Storeroom", stat: "15m avg, 14 tasks/day" },
  { rank: 6, name: "Kiran S.", store: "Mumbai", role: "Floor", stat: "13 catches/day, 21m/aisle" },
  { rank: 7, name: "Deepa S.", store: "Pune", role: "Storeroom", stat: "16m avg, 8 tasks/day" },
  { rank: 8, name: "Ravi P.", store: "Nashik", role: "Floor", stat: "12 catches/day, 20m/aisle" },
  { rank: 9, name: "Sanjay M.", store: "Mumbai", role: "Storeroom", stat: "14m avg, 15 tasks/day" },
  { rank: 10, name: "Neha K.", store: "Nagpur", role: "Floor", stat: "11 catches/day, 22m/aisle" },
];

const riskItems = [
  "Floor staff vacancy: 1 (only 2 scanners for 10 aisles — 2 cycles/day vs 3)",
  "Storeroom vacancy: 1 (bottleneck index 1.8 — critical)",
  "Restock SLA trending upward for 4 consecutive weeks",
  "Zero-back-stock rate: 8.2% of SKUs (highest in chain)",
];

const StaffAnalytics = () => (
  <div className="reg-screen">
    {/* Summary */}
    <div className="staff-summary">
      {summary.map((s, i) => (
        <div key={i} className="staff-sum-card">
          <strong>{s.value}</strong>
          <span>{s.label}</span>
        </div>
      ))}
    </div>

    <div className="reg-body">
      {/* Left: Table + Risk */}
      <div className="reg-left">
        <div className="reg-card" style={{ overflowX: "auto" }}>
          <h3><User size={16} weight="duotone" /> Store Staffing & Bottleneck Index</h3>
          <table className="staff-table">
            <thead>
              <tr>
                <th>Store</th>
                <th>Floor</th>
                <th>Store</th>
                <th>Vacancy</th>
                <th>SLA</th>
                <th>Bottleneck</th>
                <th>Compliance</th>
              </tr>
            </thead>
            <tbody>
              {staffTable.map((s, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 750 }}>{s.store}</td>
                  <td>{s.floor}</td>
                  <td>{s.storeroom}</td>
                  <td>{s.vacancy}</td>
                  <td>{s.sla}</td>
                  <td><span className={s.biClass}>{s.bi} ({s.biLabel})</span></td>
                  <td style={{ fontWeight: 800 }}>{s.compliance}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ fontSize: ".68rem", color: "#64748b", marginTop: 10, lineHeight: 1.5, fontWeight: 500 }}>
            <strong>Bottleneck Index:</strong> OOS detections/hr ÷ restocks/hr. Above 1.5 = storeroom can't keep up. Aurangabad detects 8.4 OOS/hr but only restocks 4.7/hr (1.8:1).
          </div>
        </div>

        {/* Risk Radar */}
        <div className="risk-card">
          <h4><Warning size={14} weight="fill" /> Risk Radar — Aurangabad</h4>
          {riskItems.map((r, i) => (
            <div key={i} className="risk-item">• {r}</div>
          ))}
          <div className="risk-recommendation">
            <Lightning size={12} weight="fill" /> <strong>Recommendation:</strong> Hire 1 floor + 1 storeroom worker. Cost: ₹36,000/mo. Est. compliance lift: +6 pts to ~84.6%. Revenue gain: ₹72,000/mo. ROI: 2.0:1 on hire.
          </div>
        </div>
      </div>

      {/* Right: Top 10 */}
      <div className="reg-right">
        <div className="reg-card">
          <h3><TrendUp size={16} weight="fill" /> Top 10 Chain Performers</h3>
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
        </div>
      </div>
    </div>
  </div>
);

export default StaffAnalytics;
