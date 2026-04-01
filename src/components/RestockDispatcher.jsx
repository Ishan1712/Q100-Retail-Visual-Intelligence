import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Warning, CheckCircle, Clock, Package, User, ArrowRight,
  Lightning, Timer, ArrowsClockwise, Prohibit, TrendDown
} from "@phosphor-icons/react";
import "./RestockDispatcher.css";

/* ═══ Data ═══ */
const pipeline = {
  flagged: [
    { id: "f1", product: "Surf Excel 1kg", qty: 5, aisle: 6, section: 2, shelf: "Eye-Level", flaggedAt: "10:08 AM", mins: 7 },
    { id: "f2", product: "Vim Bar", qty: 4, aisle: 6, section: 3, shelf: "Lower", flaggedAt: "10:08 AM", mins: 7 },
    { id: "f3", product: "Harpic 500ml", qty: 3, aisle: 6, section: 4, shelf: "Lower", flaggedAt: "10:08 AM", mins: 7 },
    { id: "f4", product: "Mother Dairy Curd 400g", qty: 6, aisle: 2, section: 1, shelf: "Eye-Level", flaggedAt: "9:52 AM", mins: 23 },
  ],
  picked: [
    { id: "p1", product: "Kurkure Multi Grain", qty: 6, aisle: 7, section: 3, shelf: "Eye-Level", flaggedAt: "9:18 AM", worker: "Suresh K.", pickedAt: "9:33 AM", eta: "2 mins", mins: 57 },
    { id: "p2", product: "Amul Butter 100g", qty: 3, aisle: 2, section: 2, shelf: "Eye-Level", flaggedAt: "9:52 AM", worker: "Manoj T.", pickedAt: "10:06 AM", eta: "4 mins", mins: 23 },
    { id: "p3", product: "Surf Excel 1kg", qty: 5, aisle: 6, section: 2, shelf: "Eye-Level", flaggedAt: "10:02 AM", worker: "Manoj T.", pickedAt: "10:10 AM", eta: "6 mins", mins: 13 },
  ],
  restocked: [
    { id: "r1", product: "Parle-G 250g", qty: 4, aisle: 7, at: "9:31 AM", worker: "Suresh K." },
    { id: "r2", product: "Dairy Milk 50g", qty: 3, aisle: 7, at: "9:38 AM", worker: "Manoj T." },
    { id: "r3", product: "Tata Salt 1kg", qty: 6, aisle: 3, at: "8:45 AM", worker: "Suresh K." },
    { id: "r4", product: "Maggi 2-Min", qty: 8, aisle: 10, at: "8:52 AM", worker: "Deepa S." },
    { id: "r5", product: "Colgate MaxFresh", qty: 4, aisle: 9, at: "9:12 AM", worker: "Deepa S." },
  ],
  blocked: [
    { id: "b1", product: "Amul Taaza 500ml", aisle: 2, reason: "Zero back-stock", lastDelivery: "Monday", dailySell: 18, lostSales: 630, suggestion: "Emergency order to Amul distributor. Lead time: 6 hours." },
    { id: "b2", product: "Real Juice Mango 1L", aisle: 5, reason: "Supplier delay", lastDelivery: "Last Thursday", dailySell: 8, lostSales: 240, suggestion: "Expected Thursday. No action needed." },
  ],
};

const workers = [
  { id: 1, name: "Suresh K.", avatar: "S", task: "Kurkure Multi Grain × 6 → Aisle 7", load: 1, eta: "~2 mins", status: "busy" },
  { id: 2, name: "Manoj T.", avatar: "M", task: "Surf Excel 1kg × 5 → Aisle 6 + Amul Butter → Aisle 2", load: 2, eta: "~6 mins", status: "busy" },
  { id: 3, name: "Deepa S.", avatar: "D", task: null, load: 0, eta: "Available", status: "idle", idleSince: "10:02 AM", suggestion: "Pick Vim Bar + Harpic for Aisle 6" },
];

const batchSuggestion = "Assign Aisle 6 restock bundle to Deepa: Vim Bar × 4, Harpic 500ml × 3. Suresh will finish Aisle 7 in 2 mins and can pick up Mother Dairy Curd for Aisle 2.";

/* ═══ Kanban Card ═══ */
const KanbanCard = ({ item, type }) => {
  const slaClass = item.mins > 30 ? "sla-red" : item.mins > 15 ? "sla-amber" : "sla-ok";
  return (
    <motion.div className={`kanban-card kc-${type}`} whileHover={{ y: -2 }} layout>
      <div className="kc-top">
        <strong className="kc-product">{item.product}</strong>
        {item.qty && <span className="kc-qty">×{item.qty}</span>}
      </div>
      <div className="kc-meta">
        <span>Aisle {item.aisle}{item.section ? `, Sec ${item.section}` : ""}</span>
        {item.shelf && <span>{item.shelf}</span>}
      </div>
      {type === "flagged" && (
        <div className="kc-bottom">
          <span className="kc-time"><Clock size={11} weight="duotone" /> {item.flaggedAt}</span>
          <span className={`kc-sla ${slaClass}`}><Timer size={11} weight="fill" /> {item.mins}m</span>
        </div>
      )}
      {type === "picked" && (
        <div className="kc-bottom">
          <span className="kc-worker"><User size={11} weight="duotone" /> {item.worker}</span>
          <span className="kc-eta">ETA {item.eta}</span>
          <span className={`kc-sla ${slaClass}`}><Timer size={11} weight="fill" /> {item.mins}m</span>
        </div>
      )}
      {type === "restocked" && (
        <div className="kc-bottom">
          <span className="kc-worker"><User size={11} weight="duotone" /> {item.worker}</span>
          <span className="kc-done-time"><CheckCircle size={11} weight="fill" /> {item.at}</span>
        </div>
      )}
    </motion.div>
  );
};

/* ═══ Blocked Card ═══ */
const BlockedCard = ({ item }) => (
  <motion.div className="kanban-card kc-blocked" whileHover={{ y: -2 }} layout>
    <div className="kc-top">
      <strong className="kc-product">{item.product}</strong>
      <span className="kc-blocked-badge"><Prohibit size={11} weight="fill" /> {item.reason}</span>
    </div>
    <div className="kc-meta"><span>Aisle {item.aisle}</span><span>Daily sell: {item.dailySell} units</span></div>
    <div className="kc-blocked-loss"><TrendDown size={12} weight="bold" /> Lost sales since OOS: ₹{item.lostSales}</div>
    <div className="kc-suggestion"><Lightning size={11} weight="fill" /> {item.suggestion}</div>
  </motion.div>
);

/* ═══ Main ═══ */
const RestockDispatcher = () => {
  return (
    <div className="dispatch-screen">
      {/* SLA Summary */}
      <div className="dispatch-sla-bar">
        <div className="sla-stat">
          <span className="sla-val">14 min</span>
          <span className="sla-label">Avg Restock Time</span>
        </div>
        <div className="sla-stat">
          <span className="sla-val sla-green">0</span>
          <span className="sla-label">SLA Breaches</span>
        </div>
        <div className="sla-stat">
          <span className="sla-val">{pipeline.flagged.length + pipeline.picked.length + pipeline.restocked.length + pipeline.blocked.length}</span>
          <span className="sla-label">Total Tasks Today</span>
        </div>
        <div className="sla-stat">
          <span className="sla-val sla-green">{pipeline.restocked.length}</span>
          <span className="sla-label">Completed</span>
        </div>
      </div>

      <div className="dispatch-body">
        {/* Kanban Board */}
        <div className="kanban-board">
          {/* Flagged */}
          <div className="kanban-col">
            <div className="kanban-col-header flagged-header">
              <Warning size={15} weight="fill" />
              <span>Flagged</span>
              <span className="kanban-count">{pipeline.flagged.length}</span>
            </div>
            <div className="kanban-cards">
              {pipeline.flagged.map(item => <KanbanCard key={item.id} item={item} type="flagged" />)}
            </div>
          </div>

          {/* Picked */}
          <div className="kanban-col">
            <div className="kanban-col-header picked-header">
              <Package size={15} weight="fill" />
              <span>Picked</span>
              <span className="kanban-count">{pipeline.picked.length}</span>
            </div>
            <div className="kanban-cards">
              {pipeline.picked.map(item => <KanbanCard key={item.id} item={item} type="picked" />)}
            </div>
          </div>

          {/* Restocked */}
          <div className="kanban-col">
            <div className="kanban-col-header restocked-header">
              <CheckCircle size={15} weight="fill" />
              <span>Restocked</span>
              <span className="kanban-count">{pipeline.restocked.length}</span>
            </div>
            <div className="kanban-cards">
              {pipeline.restocked.map(item => <KanbanCard key={item.id} item={item} type="restocked" />)}
            </div>
          </div>

          {/* Blocked */}
          <div className="kanban-col">
            <div className="kanban-col-header blocked-header">
              <Prohibit size={15} weight="fill" />
              <span>Blocked</span>
              <span className="kanban-count">{pipeline.blocked.length}</span>
            </div>
            <div className="kanban-cards">
              {pipeline.blocked.map(item => <BlockedCard key={item.id} item={item} />)}
            </div>
          </div>
        </div>

        {/* Right Panel — Workers + Batch */}
        <div className="dispatch-right">
          {/* Workers */}
          <div className="workers-panel">
            <h3><User size={15} weight="duotone" /> Storeroom Workers</h3>
            <div className="workers-list">
              {workers.map(w => (
                <div key={w.id} className={`worker-card wk-${w.status}`}>
                  <div className="wk-avatar">{w.avatar}</div>
                  <div className="wk-body">
                    <strong>{w.name}</strong>
                    <span className="wk-task">{w.task || "No active task"}</span>
                    <div className="wk-stats">
                      <span>Load: {w.load}</span>
                      <span>{w.eta}</span>
                      {w.idleSince && <span className="wk-idle">Idle since {w.idleSince}</span>}
                    </div>
                    {w.suggestion && <div className="wk-suggest"><Lightning size={11} weight="fill" /> {w.suggestion}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Batch Optimization */}
          <div className="batch-panel">
            <div className="batch-header"><ArrowsClockwise size={15} weight="duotone" /> AI Batch Optimization</div>
            <p className="batch-text">{batchSuggestion}</p>
            <button className="batch-btn"><CheckCircle size={14} weight="bold" /> Apply Suggestion</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestockDispatcher;
