import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Warning, CheckCircle, Clock, Package, User, ArrowRight,
  Lightning, Timer, ArrowsClockwise, Prohibit, TrendDown,
  Scan, X, Circle, CaretRight, Pulse, Bell, PaperPlaneTilt,
  Megaphone
} from "@phosphor-icons/react";
import "./RestockDispatcher.css";

/* ═══ Default Data ═══ */
const defaultTasks = [
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
  { id: 1, name: "Suresh K.", avatar: "S", color: "#6366f1", task: "Kurkure Multi Grain × 6 → Aisle 7", load: 1, eta: "~2 mins", status: "busy" },
  { id: 2, name: "Manoj T.", avatar: "M", color: "#0891b2", task: "Surf Excel 1kg × 5 → Aisle 6", load: 2, eta: "~6 mins", status: "busy" },
  { id: 3, name: "Deepa S.", avatar: "D", color: "#059669", task: null, load: 0, eta: "Available", status: "idle", idleSince: "10:02 AM", suggestion: "Pick Vim Bar + Harpic for Aisle 6" },
];

const batchSuggestion = "Assign Aisle 6 restock bundle to Deepa: Vim Bar × 4, Harpic × 3. Suresh finishes Aisle 7 in 2 mins — can pick Mother Dairy Curd for Aisle 2.";

const restockAlerts = [
  { id: "a1", severity: "critical", title: "Surf Excel 1kg — Empty slot", shelf: "Aisle 6, Sec 2", time: "3 min ago", lossPerHr: 58, detail: "High-demand item completely OOS. 5 units needed immediately." },
  { id: "a2", severity: "critical", title: "Mother Dairy Curd 400g — Empty slot", shelf: "Aisle 2, Sec 1", time: "8 min ago", lossPerHr: 42, detail: "Dairy fast-seller. 6 units needed. Check cold storage." },
  { id: "a3", severity: "warning", title: "Harpic 500ml — Low stock", shelf: "Aisle 6, Sec 4", time: "5 min ago", lossPerHr: 22, detail: "Only 1 facing left. Restock before next scan cycle." },
  { id: "a4", severity: "warning", title: "Vim Bar — Running low", shelf: "Aisle 6, Sec 3", time: "5 min ago", lossPerHr: 18, detail: "1 of 3 bars remaining. Bundle with Harpic for Aisle 6 run." },
  { id: "a5", severity: "info", title: "Parle-G 250g — Restocked", shelf: "Aisle 7", time: "12 min ago", lossPerHr: 0, detail: "Suresh K. completed restock. 4 units placed." },
];

const statusConfig = {
  flagged: { label: "Awaiting", color: "#ef4444", bg: "#fef2f2", icon: Warning },
  picked: { label: "In Transit", color: "#f59e0b", bg: "#fef3c7", icon: Package },
  done: { label: "Done", color: "#16a34a", bg: "#dcfce7", icon: CheckCircle },
};

const slaColor = (m) => m > 30 ? "#ef4444" : m > 15 ? "#f59e0b" : "#16a34a";

/* ═══ Main ═══ */
const RestockDispatcher = ({ analysisItems, onClearAnalysis }) => {
  const hasAnalysis = analysisItems && analysisItems.length > 0;
  const tasks = hasAnalysis ? [...analysisItems, ...defaultTasks.filter(t => t.status !== "flagged")] : defaultTasks;
  const flaggedCount = tasks.filter(t => t.status === "flagged").length;
  const pickedCount = tasks.filter(t => t.status === "picked").length;
  const doneCount = tasks.filter(t => t.status === "done").length;
  const avgRestock = 14;
  const [notified, setNotified] = useState({});
  const [dismissed, setDismissed] = useState({});

  const handleNotify = (alertId) => {
    setNotified(prev => ({ ...prev, [alertId]: true }));
  };
  const handleDismiss = (alertId) => {
    setDismissed(prev => ({ ...prev, [alertId]: true }));
  };
  const visibleAlerts = restockAlerts.filter(a => !dismissed[a.id]);

  return (
    <div className="dispatch-screen">
      {/* Analysis Banner */}
      {hasAnalysis && (
        <motion.div className="rd-analysis-banner"
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="rd-analysis-banner-left">
            <Scan size={16} weight="fill" />
            <span><strong>{analysisItems.length} new restock items</strong> detected from shelf analysis</span>
          </div>
          <button className="rd-analysis-dismiss" onClick={onClearAnalysis}>
            <X size={14} weight="bold" /> Dismiss
          </button>
        </motion.div>
      )}

      {/* ── KPI Row ── */}
      <div className="rd-kpi-row">
        <div className="rd-kpi">
          <div className="rd-kpi-icon-wrap rd-kpi-teal"><Timer size={18} weight="bold" /></div>
          <div className="rd-kpi-content">
            <strong>{avgRestock} min</strong>
            <span>Avg Restock Time</span>
          </div>
        </div>
        <div className="rd-kpi">
          <div className="rd-kpi-icon-wrap rd-kpi-green"><CheckCircle size={18} weight="bold" /></div>
          <div className="rd-kpi-content">
            <strong>0</strong>
            <span>SLA Breaches</span>
          </div>
        </div>
        <div className="rd-kpi">
          <div className="rd-kpi-icon-wrap rd-kpi-amber"><Package size={18} weight="bold" /></div>
          <div className="rd-kpi-content">
            <strong>{tasks.length + blocked.length}</strong>
            <span>Total Tasks</span>
          </div>
        </div>
        <div className="rd-kpi">
          <div className="rd-kpi-icon-wrap rd-kpi-blue"><CheckCircle size={18} weight="fill" /></div>
          <div className="rd-kpi-content">
            <strong>{doneCount}</strong>
            <span>Completed</span>
          </div>
        </div>
      </div>

      {/* ── Workers ── */}
      <div className="rd-section-card">
        <div className="rd-section-header">
          <User size={15} weight="duotone" />
          <h3>Storeroom Workers</h3>
          <span className="rd-section-badge">{workers.length} active</span>
        </div>
        <div className="rd-workers-grid">
          {workers.map(w => (
            <motion.div key={w.id} className={`rd-worker rd-worker-${w.status}`} whileHover={{ y: -2 }}>
              <div className="rd-worker-top">
                <div className="rd-worker-avatar" style={{ background: w.color }}>{w.avatar}</div>
                <div className="rd-worker-identity">
                  <strong>{w.name}</strong>
                  <span className={`rd-worker-status-dot rd-dot-${w.status}`}>
                    <Circle size={6} weight="fill" /> {w.status === "busy" ? "Active" : "Idle"}
                  </span>
                </div>
                <div className="rd-worker-badges">
                  <span className="rd-worker-load">Load: {w.load}</span>
                  <span className="rd-worker-eta">{w.eta}</span>
                </div>
              </div>
              {w.task && <div className="rd-worker-task"><Package size={11} weight="duotone" /> {w.task}</div>}
              {!w.task && w.idleSince && <div className="rd-worker-task rd-worker-idle-text"><Clock size={11} weight="duotone" /> Idle since {w.idleSince}</div>}
              {w.suggestion && (
                <div className="rd-worker-suggest"><Lightning size={11} weight="fill" /> {w.suggestion}</div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Restock Alerts ── */}
      {visibleAlerts.length > 0 && (
        <div className="rd-section-card rd-alerts-section">
          <div className="rd-section-header">
            <Bell size={15} weight="fill" style={{ color: "#ef4444" }} />
            <h3>Restock Alerts</h3>
            <span className="rd-alerts-count">{visibleAlerts.filter(a => a.severity === "critical").length} critical</span>
          </div>
          <div className="rd-alerts-list">
            <AnimatePresence>
              {visibleAlerts.map(a => (
                <motion.div key={a.id} className={`rd-alert rd-alert-${a.severity}`}
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 50, height: 0 }}
                  layout>
                  <div className="rd-alert-left">
                    <div className={`rd-alert-icon rd-alert-icon-${a.severity}`}>
                      {a.severity === "critical" ? <Warning size={14} weight="fill" /> :
                       a.severity === "warning" ? <Clock size={14} weight="fill" /> :
                       <CheckCircle size={14} weight="fill" />}
                    </div>
                    <div className="rd-alert-body">
                      <div className="rd-alert-title-row">
                        <strong>{a.title}</strong>
                        {a.lossPerHr > 0 && <span className="rd-alert-loss">₹{a.lossPerHr}/hr loss</span>}
                      </div>
                      <div className="rd-alert-meta">
                        <span>{a.shelf}</span>
                        <span>{a.time}</span>
                      </div>
                      <p className="rd-alert-detail">{a.detail}</p>
                    </div>
                  </div>
                  <div className="rd-alert-actions">
                    {a.severity !== "info" && (
                      <motion.button
                        className={`rd-alert-notify-btn${notified[a.id] ? " notified" : ""}`}
                        onClick={() => handleNotify(a.id)}
                        disabled={notified[a.id]}
                        whileTap={!notified[a.id] ? { scale: 0.95 } : {}}>
                        {notified[a.id] ? (
                          <><CheckCircle size={12} weight="fill" /> Sent</>
                        ) : (
                          <><PaperPlaneTilt size={12} weight="fill" /> Notify Worker</>
                        )}
                      </motion.button>
                    )}
                    <button className="rd-alert-dismiss-btn" onClick={() => handleDismiss(a.id)}>
                      <X size={11} weight="bold" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* ── Main Grid: Pipeline + Sidebar ── */}
      <div className="rd-main">
        {/* Pipeline */}
        <div className="rd-section-card">
          <div className="rd-section-header">
            <ArrowRight size={15} weight="bold" />
            <h3>Restock Pipeline</h3>
          </div>

          <div className="rd-status-tabs">
            <button className="rd-tab rd-tab-flagged rd-tab-active">
              <Warning size={12} weight="fill" /> {flaggedCount} Awaiting
            </button>
            <button className="rd-tab rd-tab-picked">
              <Package size={12} weight="fill" /> {pickedCount} In Transit
            </button>
            <button className="rd-tab rd-tab-done">
              <CheckCircle size={12} weight="fill" /> {doneCount} Done
            </button>
          </div>

          {/* Desktop table */}
          <div className="rd-table-wrap rd-desktop-table">
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
                      className={`rd-row rd-row-${t.status}${t.fromAnalysis ? " rd-row-analysis" : ""}`}>
                      <td className="rd-product">
                        {t.product}
                        {t.fromAnalysis && <span className="rd-from-analysis-tag">{t.type}</span>}
                      </td>
                      <td><span className="rd-qty">×{t.qty}</span></td>
                      <td className="rd-shelf">{t.shelf}</td>
                      <td>
                        <span className="rd-status-pill" style={{ background: sc.bg, color: sc.color }}>
                          <sc.icon size={10} weight="fill" /> {sc.label}
                        </span>
                      </td>
                      <td className="rd-worker-name">{t.worker || "—"}</td>
                      <td className="rd-time-cell">
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

          {/* Mobile card list */}
          <div className="rd-mobile-cards">
            {tasks.map(t => {
              const sc = statusConfig[t.status];
              return (
                <motion.div key={t.id} className={`rd-task-card rd-task-${t.status}`}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="rd-task-card-top">
                    <div className="rd-task-card-product">
                      <strong>{t.product}</strong>
                      <span className="rd-qty">×{t.qty}</span>
                      {t.fromAnalysis && <span className="rd-from-analysis-tag">{t.type}</span>}
                    </div>
                    <span className="rd-status-pill" style={{ background: sc.bg, color: sc.color }}>
                      <sc.icon size={10} weight="fill" /> {sc.label}
                    </span>
                  </div>
                  <div className="rd-task-card-bottom">
                    <span className="rd-task-card-shelf">{t.shelf}</span>
                    {t.worker && <span className="rd-task-card-worker">{t.worker}</span>}
                    <span className="rd-task-card-time">
                      {t.time}
                      {t.mins && <span className="rd-sla" style={{ color: slaColor(t.mins) }}> {t.mins}m</span>}
                      {t.eta && <span className="rd-eta">ETA {t.eta}</span>}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="rd-sidebar">
          {/* Blocked */}
          <div className="rd-section-card rd-blocked-card">
            <div className="rd-section-header">
              <Prohibit size={14} weight="fill" style={{ color: "#ef4444" }} />
              <h3>Blocked</h3>
              <span className="rd-blocked-count">{blocked.length}</span>
            </div>
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

          {/* AI */}
          <div className="rd-ai-card">
            <div className="rd-ai-header">
              <ArrowsClockwise size={14} weight="duotone" />
              <span>AI Batch Optimization</span>
            </div>
            <p className="rd-ai-text">{batchSuggestion}</p>
            <button className="rd-ai-btn"><CheckCircle size={13} weight="bold" /> Apply Suggestion</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestockDispatcher;
