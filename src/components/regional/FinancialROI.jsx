import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CurrencyInr, TrendUp, CheckCircle, Warning, Lightning, ChartBar, Timer, Coins } from "@phosphor-icons/react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import "./Regional.css";

const waterfallData = [
  { name: "OOS Prevention", value: 840000, color: "#059669" },
  { name: "Penalty Avoided", value: 240000, color: "#6366f1" },
  { name: "Labour Savings", value: 110000, color: "#f59e0b" },
  { name: "Shrinkage", value: 65000, color: "#8b5cf6" },
  { name: "Q100 Cost", value: -225000, color: "#ef4444" },
  { name: "Net Benefit", value: 1030000, color: "#059669" },
];

const brandPartners = [
  { name: "Hindustan Unilever (HUL)", contracted: 85, current: 86.2, threshold: "Below 80% = ₹50K/qtr", status: "safe" },
  { name: "PepsiCo (Lay's, Kurkure)", contracted: 85, current: 82.8, threshold: "Below 80% = ₹40K/qtr", status: "risk" },
  { name: "ITC (Sunfeast, Bingo)", contracted: 85, current: 84.1, threshold: "Below 80% = ₹35K/qtr", status: "risk" },
  { name: "Nestlé (Maggi, KitKat)", contracted: 85, current: 88.4, threshold: "Below 80% = ₹45K/qtr", status: "safe" },
  { name: "Britannia", contracted: 85, current: 87.6, threshold: "Below 80% = ₹30K/qtr", status: "safe" },
  { name: "Mondelez (Cadbury)", contracted: 85, current: 83.9, threshold: "Below 80% = ₹35K/qtr", status: "risk" },
];

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

const FinancialROI = () => (
  <div className="reg-screen">
    {/* ROI Hero */}
    <div className="roi-hero">
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div className="roi-coins-stack">
          {[0, 1, 2, 3, 4].map(i => (
            <motion.div key={i} className="roi-coin"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.12, type: "spring", stiffness: 200 }}>
              <CurrencyInr size={14} weight="bold" />
            </motion.div>
          ))}
        </div>
        <div>
          <motion.div className="roi-ratio"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 160 }}>
            5.58:1
          </motion.div>
          <div className="roi-ratio-sub">For every ₹1 spent on Q100, you recover ₹5.58</div>
        </div>
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: ".68rem", opacity: .7, fontWeight: 600 }}>MONTHLY SUBSCRIPTION</div>
        <div style={{ fontSize: "1.3rem", fontWeight: 900 }}>₹2,25,000</div>
        <div style={{ fontSize: ".68rem", opacity: .7 }}>₹45,000 × 5 stores</div>
      </div>
    </div>

    <div className="roi-body">
      {/* Left: Waterfall + Counter */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Animated Counter */}
        <div className="reg-card" style={{ textAlign: "center", background: "linear-gradient(135deg, #ecfdf5, #d1fae5)", borderColor: "#a7f3d0" }}>
          <div style={{ fontSize: ".66rem", fontWeight: 700, color: "#047857", textTransform: "uppercase", letterSpacing: ".08em" }}>Estimated Lost Sales Prevented This Month</div>
          <div style={{ fontSize: "2.4rem", fontWeight: 900, color: "#059669", letterSpacing: "-.03em" }}>
            ₹<AnimCounter target={840000} />
          </div>
        </div>

        {/* Waterfall */}
        <div className="reg-card">
          <h3><ChartBar size={16} weight="duotone" /> Monthly ROI Breakdown</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {waterfallData.map((d, i) => (
              <div key={i} className="waterfall-item">
                <span className="wf-label">{d.name}</span>
                <div style={{ flex: 1, height: 8, background: "#f1f5f9", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ width: `${Math.abs(d.value) / 12550 * 100}%`, height: "100%", background: d.color, borderRadius: 4 }} />
                </div>
                <span className={`wf-value ${d.value >= 0 ? "wf-positive" : "wf-negative"}${d.name === "Net Benefit" ? " wf-total" : ""}`}>
                  {d.value < 0 ? "(" : ""}₹{Math.abs(d.value / 100000).toFixed(1)}L{d.value < 0 ? ")" : ""}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Payback + Projection */}
        <div className="payback-timeline">
          <Timer size={20} weight="duotone" />
          <div>
            <strong>Break-even: Day 18 (Week 3)</strong>
            <span> · In profit since. Annual projection: <strong>₹1.53 Cr</strong> by FY 2027</span>
          </div>
        </div>
      </div>

      {/* Right: Brand Partners */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div className="reg-card">
          <h3><Coins size={16} weight="duotone" /> Planogram Compliance by Brand Partner</h3>
          <table className="brand-table">
            <thead>
              <tr>
                <th>FMCG Partner</th>
                <th>Target</th>
                <th>Current</th>
                <th>Penalty</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {brandPartners.map((b, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 700 }}>{b.name}</td>
                  <td>{b.contracted}%</td>
                  <td style={{ fontWeight: 800 }}>{b.current}%</td>
                  <td style={{ fontSize: ".66rem", color: "#94a3b8" }}>{b.threshold}</td>
                  <td>
                    <span className={`status-${b.status}`}>
                      {b.status === "safe" ? "✅ Safe" : "⚠️ At Risk"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="reg-card">
          <h3><Lightning size={16} weight="fill" /> Additional Impact</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ padding: "10px 12px", background: "#f8fafc", borderRadius: 8, fontSize: ".74rem", color: "#334155", fontWeight: 500, lineHeight: 1.5 }}>
              Product returns due to wrong-shelf placement down <strong>34%</strong> since Q100 deployment.
            </div>
            <div style={{ padding: "10px 12px", background: "#fef3c7", borderRadius: 8, fontSize: ".74rem", color: "#92400e", fontWeight: 500, lineHeight: 1.5 }}>
              Trade marketing income at risk: <strong>₹2.4L/quarter</strong> if compliance stays below 85% chain-wide. Currently at 83.6%.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default FinancialROI;
