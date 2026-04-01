import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Package, Warning, Scan, ShoppingCart, Storefront,
  MapPin, ArrowRight
} from "@phosphor-icons/react";
import { managerShelves } from "../data";
import "./LiveFloorMap.css";

const colorMap = {
  darkgreen: "#16a34a", lightgreen: "#34d399", amber: "#f59e0b", red: "#ef4444", grey: "#94a3b8",
};

const floorWorkers = [
  { id: "w1", name: "Rahul", avatar: "R", shelfId: 6, action: "Scanning", color: "#6366f1" },
  { id: "w2", name: "Amit", avatar: "A", shelfId: 10, action: "Scanning", color: "#8b5cf6" },
  { id: "w3", name: "Vikram", avatar: "V", shelfId: 2, action: "Re-scanning", color: "#a78bfa" },
];

const storeroomWorkers = [
  { id: "s1", name: "Suresh", avatar: "S", targetShelf: 7, item: "Kurkure Multi Grain", status: "En route", color: "#f59e0b" },
  { id: "s2", name: "Manoj", avatar: "M", targetShelf: 6, item: "Surf Excel 1kg", status: "Placing", color: "#fb923c" },
  { id: "s3", name: "Deepa", avatar: "D", targetShelf: null, item: "Vim Bar + Harpic", status: "Picking", color: "#fbbf24" },
];

const stockLevels = [
  { category: "Dairy", level: 34, color: "#ef4444" },
  { category: "Snacks", level: 78, color: "#22c55e" },
  { category: "Household", level: 52, color: "#f59e0b" },
  { category: "Beverages", level: 91, color: "#22c55e" },
];

const bottleneckAlert = "Shelf 2 (Dairy) at 71% compliance and dropping. Vikram re-scanning — but 2 items have zero back-stock. Compliance ceiling: 82% until Thursday's delivery.";

const LiveFloorMap = () => {
  const [hoveredShelf, setHoveredShelf] = useState(null);
  const leftShelves = managerShelves.filter(a => a.id <= 5);
  const rightShelves = managerShelves.filter(a => a.id > 5);

  const getWorkersAtShelf = (shelfId) => {
    const fw = floorWorkers.filter(w => w.shelfId === shelfId);
    const sw = storeroomWorkers.filter(w => w.targetShelf === shelfId);
    return { fw, sw };
  };

  const renderShelf = (a) => {
    const { fw, sw } = getWorkersAtShelf(a.id);
    const isHovered = hoveredShelf === a.id;
    const isBottleneck = a.compliance < 75;
    return (
      <motion.div key={a.id}
        className={`lfm-shelf lfm-${a.color}${isBottleneck ? " lfm-bottleneck" : ""}${isHovered ? " lfm-hovered" : ""}`}
        onMouseEnter={() => setHoveredShelf(a.id)} onMouseLeave={() => setHoveredShelf(null)}
        whileHover={{ scale: 1.02 }}
      >
        <div className="lfm-shelf-info">
          <span className="lfm-num">{a.id}</span>
          <span className="lfm-cat">{a.category}</span>
          <span className="lfm-pct">{a.compliance}%</span>
        </div>
        <div className="lfm-workers-row">
          {fw.map(w => (
            <motion.div key={w.id} className="lfm-worker lfm-floor-worker" style={{ borderColor: w.color }}
              animate={{ y: [0, -2, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
              <span className="lfm-wk-avatar" style={{ background: w.color }}>{w.avatar}</span>
              <span className="lfm-wk-label"><Scan size={10} weight="bold" /> {w.name}</span>
            </motion.div>
          ))}
          {sw.map(w => (
            <motion.div key={w.id} className="lfm-worker lfm-store-worker" style={{ borderColor: w.color }}>
              <span className="lfm-wk-avatar" style={{ background: w.color }}>{w.avatar}</span>
              <span className="lfm-wk-label"><Package size={10} weight="bold" /> {w.name}</span>
            </motion.div>
          ))}
        </div>
        {isBottleneck && <span className="lfm-bottleneck-badge"><Warning size={10} weight="fill" /> Bottleneck</span>}

        <AnimatePresence>
          {isHovered && (
            <motion.div className="lfm-popover" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}>
              <strong>Shelf {a.id} — {a.category}</strong>
              <div className="lfm-pop-row">Compliance: <strong>{a.compliance}%</strong></div>
              <div className="lfm-pop-row">OOS: <strong style={{ color: "#ef4444" }}>{a.oosItems} items</strong></div>
              <div className="lfm-pop-row">Last scan: <strong>{a.lastScan}</strong></div>
              {fw.length > 0 && <div className="lfm-pop-row"><Scan size={11} /> {fw.map(w => w.name).join(", ")} scanning</div>}
              {sw.length > 0 && <div className="lfm-pop-row"><Package size={11} /> {sw.map(w => `${w.name} (${w.status})`).join(", ")}</div>}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <div className="lfm-screen">
      <div className="lfm-header">
        <div>
          <h2>Live Store Floor Map</h2>
          <span className="lfm-sub">Real-time view of floor operations</span>
        </div>
        <div className="lfm-legend">
          <span className="lfm-leg"><span className="lfm-leg-dot" style={{ background: "#6366f1" }} /> Floor Worker</span>
          <span className="lfm-leg"><span className="lfm-leg-dot" style={{ background: "#f59e0b" }} /> Storeroom Worker</span>
          <span className="lfm-leg"><span className="lfm-leg-dot" style={{ background: "#ef4444" }} /><Warning size={11} /> Bottleneck</span>
        </div>
      </div>

      <div className="lfm-body">
        {/* Floor Plan */}
        <div className="lfm-floor">
          <div className="lfm-entrance"><Storefront size={13} /> ENTRANCE</div>
          <div className="lfm-checkout"><ShoppingCart size={13} /> Checkout Zone</div>
          <div className="lfm-shelves-grid">
            <div className="lfm-col">{leftShelves.map(renderShelf)}</div>
            <div className="lfm-main-shelf"><span>Main Shelf</span></div>
            <div className="lfm-col">{rightShelves.map(renderShelf)}</div>
          </div>
          <div className="lfm-storeroom">
            <Package size={13} /> Storeroom
            {storeroomWorkers.filter(w => !w.targetShelf).map(w => (
              <span key={w.id} className="lfm-sr-worker" style={{ background: w.color }}>{w.avatar}</span>
            ))}
          </div>

          {/* Route lines (CSS-based) */}
          {storeroomWorkers.filter(w => w.targetShelf).map(w => (
            <div key={w.id} className="lfm-route" title={`${w.name}: ${w.item} → Shelf ${w.targetShelf}`}>
              <span className="lfm-route-label">{w.name}: {w.item}</span>
            </div>
          ))}
        </div>

        {/* Side Panel */}
        <div className="lfm-side">
          {/* Bottleneck Alert */}
          <div className="lfm-alert-card">
            <div className="lfm-alert-header"><Warning size={15} weight="fill" /> Bottleneck Alert</div>
            <p className="lfm-alert-text">{bottleneckAlert}</p>
          </div>

          {/* Storeroom Utilisation */}
          <div className="lfm-stock-card">
            <h3>Storeroom Utilisation</h3>
            <div className="lfm-stock-list">
              {stockLevels.map(s => (
                <div key={s.category} className="lfm-stock-row">
                  <span className="lfm-stock-cat">{s.category}</span>
                  <div className="lfm-stock-bar">
                    <div className="lfm-stock-fill" style={{ width: `${s.level}%`, background: s.color }} />
                  </div>
                  <span className="lfm-stock-pct" style={{ color: s.color }}>{s.level}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Worker Activity */}
          <div className="lfm-activity-card">
            <h3>Active Workers</h3>
            <div className="lfm-worker-list">
              {[...floorWorkers.map(w => ({ ...w, type: "floor" })), ...storeroomWorkers.map(w => ({ ...w, type: "store" }))].map(w => (
                <div key={w.id} className={`lfm-wk-card lfm-wk-${w.type}`}>
                  <span className="lfm-wk-av" style={{ background: w.color }}>{w.avatar}</span>
                  <div className="lfm-wk-info">
                    <strong>{w.name}</strong>
                    <span>{w.action || w.status}{w.item ? `: ${w.item}` : ""}{w.shelfId ? ` — Shelf ${w.shelfId}` : w.targetShelf ? ` → Shelf ${w.targetShelf}` : " (Storeroom)"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveFloorMap;
