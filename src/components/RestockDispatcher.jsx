import React from "react";
import { motion } from "framer-motion";
import {
  Warning, CheckCircle, Clock, Package, User, ArrowRight,
  Lightning, Timer, ArrowsClockwise, Prohibit, TrendDown
} from "@phosphor-icons/react";
import "./RestockDispatcher.css";

/* ═══ Data ═══ */
const tasks = [
  { id: 1, product: "Surf Excel 1kg", qty: 5, shelf: "Aisle 6, Sec 2", status: "flagged", time: "10:08 AM", mins: 7 },
  { id: 2, product: "Vim Bar", qty: 4, shelf: "Aisle 6, Sec 3", status: "flagged", time: "10:08 AM", mins: 7 },
  { id: 3, product: "Harpic 500ml", qty: 3, shelf: "Aisle 6, Sec 4", status: "flagged", time: "10:08 AM", mins: 7 },
  { id: 4, product: "Mother Dairy Curd 400g", qty: 6, shelf: "Aisle 2, Sec 1", status: "flagged", time: "9:52 AM", mins: 23 },
  { id: 5, product: "Kurkure Multi Grain", qty: 6, shelf: "Aisle 7, Sec 3", status: "picked", time: "9:18 AM", mins: 57, worker: "Suresh K.", eta: "2 mins" },
  { id: 6, product: "Amul Butter 100g", qty: 3, shelf: "Aisle 2, Sec 2", status: "picked", time: "9:52 AM", mins: 23, worker: "Manoj T.", eta: "4 mins" },
  { id: 7, product: "Surf Excel 1kg", qty: 5, shelf: "Aisle 6, Sec 2", status: "picked", time: "10:02 AM", mins: 13, worker: "Manoj T.", eta: "6 mins" },
  { id: 8, product: "Parle-G 250g", qty: 4, shelf: "Aisle 7", status: "done", time: "9:31 AM", worker: "Suresh K." },
  { id: 9, product: "Dairy Milk 50g", qty: 3, shelf: "Aisle 7", status: "done", time: "9:38 AM", worker: "Manoj T." },
  { id: 10, product: "Tata Salt 1kg", qty: 6, shelf: "Aisle 3", status: "done", time: "8:45 AM", worker: "Suresh K." },
  { id: 11, product: "Maggi 2-Min", qty: 8, shelf: "Aisle 10", status: "done", time: "8:52 AM", worker: "Deepa S." },
  { id: 12, product: "Colgate MaxFresh", qty: 4, shelf: "Aisle 9", status: "done", time: "9:12 AM", worker: "Deepa S." },
];

const blocked = [
  { id: "b1", product: "Amul Taaza 500ml", shelf: "Aisle 2", reason: "Zero back-stock", dailySell: 18, lostSales: 630, suggestion: "Emergency order to Amul distributor. Lead time: 6 hours." },
  { id: "b2", product: "Real Juice Mango 1L", shelf: "Aisle 5", reason: "Supplier delay", dailySell: 8, lostSales: 240, suggestion: "Expected Thursday. No action needed." },
];

const workers = [
  { id: 1, name: "Suresh K.", avatar: "S", task: "Kurkure Multi Grain × 6 → Aisle 7", load: 1, eta: "~2 mins", status: "busy" },
  { id: 2, name: "Manoj T.", avatar: "M", task: "Surf Excel 1kg × 5 → Aisle 6", load: 2, eta: "~6 mins", status: "busy" },
  { id: 3, name: "Deepa S.", avatar: "D", task: null, load: 0, eta: "Available", status: "idle", idleSince: "10:02 AM", suggestion: "Pick Vim Bar + Harpic for Aisle 6" },
];

const batchSuggestion = "Assign Aisle 6 restock bundle to Deepa: Vim Bar × 4, Harpic × 3. Suresh finishes Aisle 7 in 2 mins — can pick Mother Dairy Curd for Aisle 2.";

const statusConfig = {
  flagged: { label: "Awaiting Pickup", color: "#ef4444", bg: "#fef2f2", icon: Warning },
  picked: { label: "In Transit", color: "#f59e0b", bg: "#fef3c7", icon: Package },
  done: { label: "Restocked", color: "#16a34a", bg: "#dcfce7", icon: CheckCircle },
};

const slaColor = (m) => m > 30 ? "#ef4444" : m > 15 ? "#f59e0b" : "#16a34a";

/* ═══ Main ═══ */
const RestockDispatcher = () => {
  const flaggedCount = tasks.filter(t => t.status === "flagged").length;
  const pickedCount = tasks.filter(t => t.status === "picked").length;
  const doneCount = tasks.filter(t => t.status === "done").length;

  return (
    <div className="dispatch-screen">
      {/* KPI Strip */}
      <div className="rd-kpi-strip">
        <div className="rd-kpi">
          <Timer size={18} weight="duotone" className="rd-kpi-icon" style={{ color: "#6366f1" }} />
          <div><strong>14 min</strong><span>Avg Restock</span></div>
        </div>
        <div className="rd-kpi">
          <CheckCircle size={18} weight="duotone" className="rd-kpi-icon" style={{ color: "#16a34a" }} />
          <div><strong className="rd-green">0</strong><span>SLA Breaches</span></div>
        </div>
        <div className="rd-kpi">
          <Package size={18} weight="duotone" className="rd-kpi-icon" style={{ color: "#f59e0b" }} />
          <div><strong>{tasks.length + blocked.length}</strong><span>Total Tasks</span></div>
        </div>
        <div className="rd-kpi">
          <CheckCircle size={18} weight="fill" className="rd-kpi-icon" style={{ color: "#16a34a" }} />
          <div><strong className="rd-green">{doneCount}</strong><span>Completed</span></div>
        </div>
      </div>

      {/* Workers Row */}
      <div className="rd-workers-row">
        <h3><User size={15} weight="duotone" /> Storeroom Workers</h3>
        <div className="rd-workers-grid">
          {workers.map(w => (
            <motion.div key={w.id} className={`rd-worker ${w.status}`} whileHover={{ y: -2 }}>
              <div className="rd-worker-avatar">{w.avatar}</div>
              <div className="rd-worker-info">
                <strong>{w.name}</strong>
                <span className="rd-worker-task">{w.task || "No active task"}</span>
                <div className="rd-worker-meta">
                  <span>Load: {w.load}</span>
                  <span>{w.eta}</span>
                  {w.idleSince && <span className="rd-idle-tag">Idle since {w.idleSince}</span>}
                </div>
              </div>
              {w.suggestion && (
                <div className="rd-worker-suggest"><Lightning size={11} weight="fill" /> {w.suggestion}</div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="rd-main">
        {/* Task Pipeline */}
        <div className="rd-pipeline">
          <h3><ArrowRight size={15} weight="bold" /> Restock Pipeline</h3>

          {/* Status summary tabs */}
          <div className="rd-status-tabs">
            <div className="rd-tab rd-tab-flagged"><Warning size={13} weight="fill" /> {flaggedCount} Awaiting</div>
            <div className="rd-tab rd-tab-picked"><Package size={13} weight="fill" /> {pickedCount} In Transit</div>
            <div className="rd-tab rd-tab-done"><CheckCircle size={13} weight="fill" /> {doneCount} Done</div>
          </div>

          {/* Task Table */}
          <div className="rd-table-wrap">
            <table className="rd-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Worker</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(t => {
                  const sc = statusConfig[t.status];
                  return (
                    <motion.tr key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className={`rd-row rd-row-${t.status}`}>
                      <td className="rd-product">{t.product}</td>
                      <td><span className="rd-qty">×{t.qty}</span></td>
                      <td className="rd-shelf">{t.shelf}</td>
                      <td>
                        <span className="rd-status-pill" style={{ background: sc.bg, color: sc.color }}>
                          <sc.icon size={11} weight="fill" /> {sc.label}
                        </span>
                      </td>
                      <td className="rd-worker-name">{t.worker || "—"}</td>
                      <td>
                        <span className="rd-time">{t.time}</span>
                        {t.mins && <span className="rd-sla" style={{ color: slaColor(t.mins) }}>{t.mins}m</span>}
                        {t.eta && <span className="rd-eta">ETA {t.eta}</span>}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Blocked + AI */}
        <div className="rd-sidebar">
          {/* Blocked Items */}
          <div className="rd-blocked-card">
            <h3><Prohibit size={15} weight="fill" /> Blocked <span className="rd-blocked-count">{blocked.length}</span></h3>
            <div className="rd-blocked-list">
              {blocked.map(b => (
                <div key={b.id} className="rd-blocked-item">
                  <div className="rd-blocked-top">
                    <strong>{b.product}</strong>
                    <span className="rd-blocked-badge">{b.reason}</span>
                  </div>
                  <div className="rd-blocked-meta">
                    <span>{b.shelf}</span>
                    <span>Daily: {b.dailySell} units</span>
                  </div>
                  <div className="rd-blocked-loss"><TrendDown size={12} weight="bold" /> ₹{b.lostSales} lost</div>
                  <div className="rd-blocked-fix"><Lightning size={11} weight="fill" /> {b.suggestion}</div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Suggestion */}
          <div className="rd-ai-card">
            <div className="rd-ai-header"><ArrowsClockwise size={15} weight="duotone" /> AI Batch Optimization</div>
            <p className="rd-ai-text">{batchSuggestion}</p>
            <button className="rd-ai-btn"><CheckCircle size={14} weight="bold" /> Apply Suggestion</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestockDispatcher;
