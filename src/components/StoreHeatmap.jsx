import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Warning, TrendUp, Clock, Package, CheckCircle,
  ArrowRight, Star, Lightning, CaretRight, Pulse,
  ShoppingCart, Storefront, ArrowClockwise,
  ShoppingBag, Snowflake, Grains, CookingPot, Coffee,
  Broom, Cookie, FirstAid, Sparkle, BowlFood
} from "@phosphor-icons/react";
import { managerStore, managerShelves, managerAlerts, managerRestockFeed } from "../data";
import Tooltip from "./Tooltip";
import "./StoreHeatmap.css";

/* ───── Helpers ───── */
const colorMap = {
  darkgreen:  { bg: "#059669", label: "95%+ Compliant", cls: "hm-darkgreen" },
  lightgreen: { bg: "#34d399", label: "85–95% Compliant", cls: "hm-lightgreen" },
  amber:      { bg: "#f59e0b", label: "70–85% Gaps", cls: "hm-amber" },
  red:        { bg: "#ef4444", label: "Below 70%", cls: "hm-red" },
  grey:       { bg: "#94a3b8", label: "Not Scanned", cls: "hm-grey" },
};

/* ───── Donut Chart ───── */
const DonutChart = ({ compliance }) => {
  const compliant = compliance;
  const oos = Math.round((100 - compliance) * 0.6);
  const misplaced = 100 - compliance - oos;
  const r = 44, circ = 2 * Math.PI * r;
  const seg1 = (compliant / 100) * circ;
  const seg2 = (oos / 100) * circ;
  const seg3 = (misplaced / 100) * circ;

  return (
    <div className="donut-wrap">
      <svg viewBox="0 0 110 110" className="donut-svg">
        <circle cx="55" cy="55" r={r} fill="none" stroke="#e2e8f0" strokeWidth="10" />
        <circle cx="55" cy="55" r={r} fill="none" stroke="#22c55e" strokeWidth="10"
          strokeDasharray={`${seg1} ${circ - seg1}`} strokeDashoffset="0"
          strokeLinecap="round" transform="rotate(-90 55 55)" />
        <circle cx="55" cy="55" r={r} fill="none" stroke="#ef4444" strokeWidth="10"
          strokeDasharray={`${seg2} ${circ - seg2}`} strokeDashoffset={`${-seg1}`}
          strokeLinecap="round" transform="rotate(-90 55 55)" />
        <circle cx="55" cy="55" r={r} fill="none" stroke="#f59e0b" strokeWidth="10"
          strokeDasharray={`${seg3} ${circ - seg3}`} strokeDashoffset={`${-(seg1 + seg2)}`}
          strokeLinecap="round" transform="rotate(-90 55 55)" />
      </svg>
      <div className="donut-center">
        <strong>{compliance}%</strong>
      </div>
    </div>
  );
};

/* ───── Live Revenue Ticker ───── */
const RevenueTicker = ({ base, rate }) => {
  const [amount, setAmount] = useState(base);
  useEffect(() => {
    const id = setInterval(() => setAmount(prev => prev + rate), 60000);
    return () => clearInterval(id);
  }, [rate]);
  // Also tick visually every second for the decimals
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const display = (amount + (tick * rate / 60)).toFixed(0);

  return (
    <div className="revenue-ticker">
      <div className="ticker-icon"><Lightning size={18} weight="fill" /></div>
      <div className="ticker-body">
        <span className="ticker-label">Est. Lost Sales This Hour</span>
        <strong className="ticker-amount">
          <span className="ticker-rupee">₹</span>{Number(display).toLocaleString("en-IN")}
        </strong>
      </div>
      <motion.span className="ticker-pulse"
        animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      />
    </div>
  );
};

/* ───── Store Floor Heatmap ───── */
const FloorHeatmap = ({ shelves, hoveredShelf, setHoveredShelf }) => {
  // Layout: 2 rows of 5 shelves each, with checkout at top and endcaps on sides
  const leftShelves = shelves.filter(a => a.id <= 5);
  const rightShelves = shelves.filter(a => a.id > 5);

  return (
    <div className="floor-map">
      <div className="floor-header">
        <Storefront size={14} weight="duotone" />
        <span>Store Floor Plan — Top-Down View</span>
      </div>
      <div className="floor-grid">
        {/* Entrance */}
        <div className="floor-entrance">ENTRANCE</div>

        {/* Checkout zone */}
        <div className="floor-checkout">
          <ShoppingCart size={13} weight="duotone" />
          <span>Checkout Zone</span>
        </div>

        {/* Shelf grid */}
        <div className="floor-shelves">
          <div className="floor-col">
            {leftShelves.map(a => (
              <ShelfStrip key={a.id} shelf={a} isHovered={hoveredShelf === a.id}
                onHover={() => setHoveredShelf(a.id)} onLeave={() => setHoveredShelf(null)} />
            ))}
          </div>
          <div className="floor-divider">
            <span>Main Aisle</span>
          </div>
          <div className="floor-col">
            {rightShelves.map(a => (
              <ShelfStrip key={a.id} shelf={a} isHovered={hoveredShelf === a.id}
                onHover={() => setHoveredShelf(a.id)} onLeave={() => setHoveredShelf(null)} />
            ))}
          </div>
        </div>

        {/* Storeroom */}
        <div className="floor-storeroom">
          <Package size={13} weight="duotone" />
          <span>Storeroom</span>
        </div>
      </div>

      {/* Legend */}
      <div className="floor-legend">
        {Object.entries(colorMap).map(([key, val]) => (
          <div key={key} className="legend-item">
            <span className={`legend-dot ${val.cls}`} />
            <span>{val.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ───── Shelf Icon Map ───── */
const shelfIconMap = {
  1: ShoppingCart,
  2: Snowflake,
  3: Grains,
  4: CookingPot,
  5: Coffee,
  6: Broom,
  7: Cookie,
  8: FirstAid,
  9: Sparkle,
  10: BowlFood,
};

/* ───── Shelf Strip ───── */
const ShelfStrip = ({ shelf, isHovered, onHover, onLeave }) => {
  const cm = colorMap[shelf.color];
  const Icon = shelfIconMap[shelf.id] || Package;
  return (
    <motion.div
      className={`shelf-strip ${cm.cls}${shelf.vip ? " shelf-vip" : ""}${isHovered ? " shelf-hovered" : ""}`}
      onMouseEnter={onHover} onMouseLeave={onLeave}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      <div className="shelf-strip-left">
        <span className="shelf-num">{shelf.id}</span>
        <span className="shelf-icon-wrap"><Icon size={16} weight="duotone" /></span>
        <span className="shelf-cat">{shelf.category}</span>
      </div>
      <div className="shelf-strip-right">
        {shelf.oosItems > 0 && <span className="shelf-oos-badge">{shelf.oosItems} OOS</span>}
        <div className="shelf-mini-bar">
          <div className="shelf-mini-fill" style={{ width: `${shelf.compliance}%`, background: shelf.compliance >= 90 ? '#22c55e' : shelf.compliance >= 80 ? '#34d399' : shelf.compliance >= 70 ? '#f59e0b' : '#ef4444' }} />
        </div>
        <span className="shelf-pct">{shelf.compliance}%</span>
        {shelf.vip && <Tooltip text={`VIP: ${shelf.vip.brand}`}><Star size={12} weight="fill" className="shelf-vip-star" /></Tooltip>}
      </div>

      {/* Hover tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div className="shelf-tooltip"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
          >
            <div className="at-row"><strong>Shelf {shelf.id}</strong> — {shelf.category}</div>
            <div className="at-row">Compliance: <strong>{shelf.compliance}%</strong></div>
            <div className="at-row">OOS Items: <strong className="at-red">{shelf.oosItems}</strong></div>
            <div className="at-row">Last Scan: <strong>{shelf.lastScan}</strong></div>
            {shelf.vip && <div className="at-row at-vip"><Star size={11} weight="fill" /> VIP: {shelf.vip.brand} ({shelf.vip.type})</div>}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ───── Critical Alert Card ───── */
const AlertCard = ({ alert, index }) => {
  const [dispatched, setDispatched] = useState(alert.status.includes("dispatched"));

  return (
    <motion.div className={`alert-card alert-${alert.severity}`}
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, type: "spring", stiffness: 300, damping: 28 }}
    >
      <div className="alert-top">
        <div className="alert-badge-row">
          <span className={`alert-severity-dot ${alert.severity}`} />
          <span className="alert-shelf">Shelf {alert.shelf}</span>
          <span className="alert-cat">{alert.category}</span>
        </div>
        <div className="alert-loss">
          <strong>₹{alert.lossPerHour}</strong>
          <span>/hr</span>
        </div>
      </div>
      <p className="alert-products">{alert.products}</p>
      <div className="alert-bottom">
        <span className="alert-time"><Clock size={12} weight="duotone" /> {alert.lastScan}</span>
        <span className="alert-status-text">{alert.status}</span>
      </div>
      <motion.button
        className={`alert-dispatch-btn${dispatched ? " dispatched" : ""}`}
        whileHover={!dispatched ? { scale: 1.02 } : {}}
        whileTap={!dispatched ? { scale: 0.97 } : {}}
        onClick={() => setDispatched(true)}
        disabled={dispatched}
      >
        {dispatched ? (
          <><CheckCircle size={14} weight="fill" /> Dispatched</>
        ) : (
          <><Package size={14} weight="bold" /> Dispatch Restock</>
        )}
      </motion.button>
    </motion.div>
  );
};

/* ───── Restock Feed Item ───── */
const FeedItem = ({ item, index }) => (
  <motion.div className={`feed-item${item.done ? " feed-done" : " feed-active"}`}
    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.06 }}
  >
    <span className="feed-time">{item.time}</span>
    <span className={`feed-status-dot${item.done ? " done" : " active"}`} />
    <div className="feed-body">
      <strong>{item.worker}</strong>
      <span className="feed-action">{item.action}</span>
      <span className="feed-product">{item.product}</span>
      <span className="feed-arrow"><ArrowRight size={11} weight="bold" /></span>
      <span className="feed-target">{item.target}</span>
    </div>
    {item.done && <CheckCircle size={14} weight="fill" className="feed-check" />}
    {!item.done && (
      <motion.span className="feed-live"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >LIVE</motion.span>
    )}
  </motion.div>
);

/* ═══════════════════════════
   MAIN COMPONENT
   ═══════════════════════════ */
const StoreHeatmap = () => {
  const [hoveredShelf, setHoveredShelf] = useState(null);
  const store = managerStore;
  const shelves = managerShelves;
  const totalOOS = shelves.reduce((s, a) => s + a.oosItems, 0);
  const vipShelves = shelves.filter(a => a.vip);

  return (
    <div className="heatmap-screen">
      {/* ── Hero Metrics Bar ── */}
      <div className="hero-bar">
        <div className="hero-compliance">
          <DonutChart compliance={store.overallCompliance} />
          <div className="hero-compliance-text">
            <span className="hero-label">Overall Shelf Compliance</span>
            <div className="hero-value-row">
              <strong className="hero-value">{store.overallCompliance}%</strong>
              <span className="hero-trend up">
                <TrendUp size={13} weight="bold" />
                +{(store.overallCompliance - store.complianceYesterday).toFixed(1)}% vs yesterday
              </span>
            </div>
            <div className="hero-donut-legend">
              <span><span className="dl-dot green" /> Compliant</span>
              <span><span className="dl-dot red" /> OOS Gaps</span>
              <span><span className="dl-dot amber" /> Misplaced</span>
            </div>
          </div>
        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hs-val">{store.totalShelfs}</span>
            <span className="hs-label">Shelfs</span>
          </div>
          <div className="hero-stat">
            <span className="hs-val hs-red">{totalOOS}</span>
            <span className="hs-label">OOS Items</span>
          </div>
          <div className="hero-stat">
            <span className="hs-val">{store.endCapZones + store.checkoutZones}</span>
            <span className="hs-label">Special Zones</span>
          </div>
        </div>

        <RevenueTicker base={store.lostSalesPerHour} rate={store.lostSalesRate} />
      </div>

      {/* ── Main Content: Heatmap + Alerts ── */}
      <div className="heatmap-body">
        {/* Left: Floor Heatmap */}
        <div className="heatmap-left">
          <FloorHeatmap shelves={shelves} hoveredShelf={hoveredShelf} setHoveredShelf={setHoveredShelf} />

          {/* VIP Shelfs */}
          {vipShelves.length > 0 && (
            <div className="vip-section">
              <div className="vip-header">
                <Star size={15} weight="fill" />
                <span>VIP Shelfs — Brand Partner Displays</span>
              </div>
              <div className="vip-cards">
                {vipShelves.map(a => (
                  <div key={a.id} className="vip-card">
                    <div className="vip-card-top">
                      <span className="vip-shelf">Shelf {a.id}</span>
                      <span className={`vip-compliance${a.vip.compliance === 100 ? " perfect" : ""}`}>
                        {a.vip.compliance ?? a.compliance}%
                        {a.vip.compliance === 100 && <CheckCircle size={12} weight="fill" />}
                      </span>
                    </div>
                    <strong className="vip-brand">{a.vip.brand}</strong>
                    <span className="vip-type">{a.vip.type}{a.vip.rent ? ` — ${a.vip.rent}` : ""}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Alerts + Feed */}
        <div className="heatmap-right">
          {/* Critical Alerts */}
          <div className="alerts-panel">
            <div className="panel-header">
              <div className="panel-title-row">
                <Warning size={16} weight="fill" />
                <h3>Critical Alerts</h3>
              </div>
              <span className="panel-count">{managerAlerts.length} active</span>
            </div>
            <div className="alerts-list">
              {managerAlerts.map((a, i) => (
                <AlertCard key={a.id} alert={a} index={i} />
              ))}
            </div>
          </div>

          {/* Restock Activity Feed */}
          <div className="feed-panel">
            <div className="panel-header">
              <div className="panel-title-row">
                <ArrowClockwise size={16} weight="duotone" />
                <h3>Restock Activity</h3>
              </div>
              <span className="panel-live-dot" />
            </div>
            <div className="feed-list">
              {managerRestockFeed.map((item, i) => (
                <FeedItem key={item.id} item={item} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreHeatmap;
