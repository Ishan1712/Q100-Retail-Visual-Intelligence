import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import {
  Sun, CloudSun, MoonStars, Trophy, BellRinging, WifiSlash,
  Scan, Storefront, Sparkle, Fire, CaretRight, Clock,
  CheckCircle, Lightning, Crosshair, Check,
  Grains, Wine, Cookie, Drop, Flask, Broom, Baby, BowlSteam, ShoppingCart, Package
} from "@phosphor-icons/react";
import { shiftData, shelves } from "../../data";
import ShelfScanner from "../ShelfScanner";
import PhotoMode from "../PhotoMode";
import VideoMode from "../VideoMode";
import ActionReport from "../ActionReport";
import ShiftSummary from "../ShiftSummary";
import ShelfHistory from "../ShelfHistory";
import Tooltip from "../Tooltip";
import "./Dashboard.css";

/* ───────── Hooks ───────── */
function useAnimatedCounter(target, dur = 1200) {
  const [c, setC] = useState(0);
  useEffect(() => {
    const t0 = performance.now();
    const step = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      setC(Math.round((p === 1 ? 1 : 1 - Math.pow(2, -10 * p)) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, dur]);
  return c;
}

function useLiveClock() {
  const [t, setT] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setT(new Date()), 1000); return () => clearInterval(id); }, []);
  return t;
}

/* ───────── Config ───────── */
const catConfig = {
  "Staples & Grains":       { icon: Grains,       bg: "#fef3c7", color: "#92400e" },
  "Beverages":              { icon: Wine,         bg: "#dbeafe", color: "#1e40af" },
  "Snacks & Biscuits":      { icon: Cookie,       bg: "#fce7f3", color: "#9d174d" },
  "Personal Care":          { icon: Drop,         bg: "#e0e7ff", color: "#4338ca" },
  "Dairy & Frozen":         { icon: Flask,        bg: "#cffafe", color: "#0e7490" },
  "Cooking Oil & Masalas":  { icon: Flask,        bg: "#ffedd5", color: "#c2410c" },
  "Household & Cleaning":   { icon: Broom,        bg: "#d1fae5", color: "#065f46" },
  "Baby & Health":          { icon: Baby,         bg: "#fce7f3", color: "#be185d" },
  "Breakfast & Cereals":    { icon: BowlSteam,    bg: "#fed7aa", color: "#9a3412" },
  "Checkout Impulse Zone":  { icon: ShoppingCart,  bg: "#e0e7ff", color: "#3730a3" },
};

const statusCfg = {
  green: { label: "Compliant", cls: "st-green" },
  red:   { label: "OOS Detected", cls: "st-red" },
  amber: { label: "In Progress", cls: "st-amber" },
  grey:  { label: "Not Scanned", cls: "st-grey" },
};

const shiftIcon = (s) => {
  const v = s?.toLowerCase() || "";
  if (v.includes("morning")) return <Tooltip text="Morning Shift"><Sun size={14} weight="duotone" /></Tooltip>;
  if (v.includes("afternoon")) return <Tooltip text="Afternoon Shift"><CloudSun size={14} weight="duotone" /></Tooltip>;
  return <Tooltip text="Night Shift"><MoonStars size={14} weight="duotone" /></Tooltip>;
};

/* ───────── Animation ───────── */
const fadeUp = { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 28 } } };
const stagger = { visible: { transition: { staggerChildren: 0.05 } } };
const slideIn = { hidden: { opacity: 0, x: -24 }, visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 28 } } };

/* ───────── Progress Ring ───────── */
const ProgressRing = ({ progress, scanned, total }) => {
  const r = 52, circ = 2 * Math.PI * r;
  const sv = useSpring(circ, { stiffness: 50, damping: 14 });
  const ac = useAnimatedCounter(scanned, 1400);
  useEffect(() => { sv.set(circ - (progress / 100) * circ); }, [progress, circ, sv]);
  const off = useTransform(sv, v => v);
  return (
    <div className="ring-wrap">
      <svg viewBox="0 0 130 130" className="ring-svg">
        <defs>
          <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981"/>
            <stop offset="100%" stopColor="#059669"/>
          </linearGradient>
        </defs>
        <circle cx="65" cy="65" r={r} fill="none" stroke="#e2e8e4" strokeWidth="9"/>
        <motion.circle cx="65" cy="65" r={r} fill="none"
          stroke="url(#rg)" strokeWidth="9" strokeLinecap="round"
          strokeDasharray={circ} style={{ strokeDashoffset: off }}
          filter="drop-shadow(0 0 6px rgba(5,150,105,0.25))"
        />
      </svg>
      <div className="ring-label">
        <strong>{ac}<span>/{total}</span></strong>
        <p>Shelves scanned</p>
      </div>
    </div>
  );
};

/* ───────── Shelf Card ───────── */
const ShelfCard = ({ shelf, onOpen }) => {
  const st = statusCfg[shelf.status];
  const cardClass = [
    "shelf-card",
    shelf.status === "green" ? "done" : "",
    shelf.status === "red" ? "oos" : "",
    shelf.priority ? "priority-card" : "",
  ].filter(Boolean).join(" ");

  return (
    <motion.article className={cardClass} variants={slideIn}
      whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(10,30,18,0.07)" }}
      whileTap={{ scale: 0.995 }} layout
    >
      <div className="shelf-left">
        <div className="shelf-emoji" style={catConfig[shelf.category] ? { background: catConfig[shelf.category].bg } : undefined}>
          {(() => {
            const cfg = catConfig[shelf.category];
            if (cfg) return <cfg.icon size={22} weight="fill" color={cfg.color} />;
            return <Package size={22} weight="fill" color="#64748b" />;
          })()}
        </div>
        <div className="shelf-info">
          <div className="shelf-name-row">
            <h4>{shelf.name}</h4>
            {shelf.priority && (
              <motion.span className="badge-priority"
                animate={{ boxShadow: ["0 0 0 0 rgba(251,146,60,0)","0 0 0 5px rgba(251,146,60,0.12)","0 0 0 0 rgba(251,146,60,0)"] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Tooltip text="High Priority Shelf"><Fire size={11} weight="fill" /></Tooltip> Priority
              </motion.span>
            )}
            {shelf.status === "green" && (
              <span className="badge-done"><Tooltip text="Scan Completed"><Check size={11} weight="bold" /></Tooltip> Done</span>
            )}
          </div>
          <span className="shelf-cat">{shelf.category}</span>
          <span className="shelf-time">{shelf.lastScan}</span>
          {shelf.note && <span className="shelf-note">{shelf.note}</span>}
        </div>
      </div>
      <div className="shelf-right">
        <span className={`badge-status ${st.cls}`}>
          {shelf.status === "green" && <CheckCircle size={13} weight="fill" />}
          {shelf.status === "red" && (
            <motion.span className="badge-status-icon"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Package size={13} weight="fill" />
            </motion.span>
          )}
          {shelf.status === "amber" && <Lightning size={13} weight="fill" />}
          {shelf.status === "grey" && <Clock size={13} weight="duotone" />}
          {st.label}
        </span>
        <motion.button
          className={`btn-scan ${shelf.status === "green" ? "btn-scan--done" : shelf.status === "red" ? "btn-scan--oos" : shelf.priority ? "btn-scan--priority" : "btn-scan--pending"}`}
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          onClick={() => onOpen?.(shelf)}
        >
          <Scan size={14} weight="bold" />
          {shelf.status === "green" ? "Re-scan" : "Scan Now"}
          <CaretRight size={13} weight="bold" />
        </motion.button>
      </div>
    </motion.article>
  );
};

/* ═══════════════════════════
   DASHBOARD
   ═══════════════════════════ */
const Dashboard = () => {
  const [scannerOpen, setScannerOpen] = useState(false);
  const [selectedShelf, setSelectedShelf] = useState(null);
  const [activeMode, setActiveMode] = useState(null); // null | 'photo' | 'video'
  const [currentPage, setCurrentPageRaw] = useState(() => sessionStorage.getItem("q100_page") || "shift");
  const setCurrentPage = useCallback((page) => { sessionStorage.setItem("q100_page", page); setCurrentPageRaw(page); }, []);
  const clock = useLiveClock();

  const progress = Math.round((shiftData.scanned / shiftData.total) * 100);
  const avatarLetter = shiftData.workerName?.charAt(0)?.toUpperCase() || "R";
  const animProg = useAnimatedCounter(progress, 1600);
  const timeStr = clock.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });

  const sorted = [...shelves].sort((a, b) => {
    if (a.priority && !b.priority) return -1;
    if (!a.priority && b.priority) return 1;
    return a.id - b.id;
  });

  const counts = {
    done: sorted.filter(a => a.status === "green").length,
    oos: sorted.filter(a => a.status === "red").length,
    pending: sorted.filter(a => a.status === "grey").length,
    priority: sorted.filter(a => a.priority).length,
  };

  const openShelf = useCallback((a) => { setSelectedShelf(a); setScannerOpen(true); }, []);
  const closeScan = useCallback(() => { setScannerOpen(false); setSelectedShelf(null); setActiveMode(null); setCurrentPage("shift"); }, []);
  const handleModeSelect = useCallback((mode) => { setScannerOpen(false); setActiveMode(mode); }, []);
  const handleModeComplete = useCallback(() => { setActiveMode(null); setCurrentPage("report"); }, []);
  const handleReportComplete = useCallback(() => { setCurrentPage("shift"); setSelectedShelf(null); }, []);

  return (
    <>
      <div className="app-shell">
        {/* ════ SIDEBAR ════ */}
        <aside className="sidebar">
          <div className="sidebar-inner">
            <div className="sb-brand">
              <div className="sb-brand-icon"><Tooltip text="Q100 AI"><img src="/augle-logo.png" alt="Augle AI" className="sb-augle-logo" /></Tooltip></div>
              <div>
                <span className="sb-eyebrow">Q100 AI</span>
                <strong className="sb-title">Worker Console</strong>
              </div>
            </div>

            <nav className="sb-nav">
              {[
                { icon: <Tooltip text="Shift Start"><Sparkle size={18} weight="duotone" /></Tooltip>, label: "Shift Start", page: "shift" },
                { icon: <Tooltip text="Shelf Scan"><Scan size={18} weight="duotone" /></Tooltip>, label: "Shelf Scan", page: "scan" },
                { icon: <Tooltip text="Restock Alerts"><BellRinging size={18} weight="duotone" /></Tooltip>, label: "Restock Alerts", page: "alerts", matchPages: ["alerts", "report"] },
                { icon: <Tooltip text="Shelf History"><Clock size={18} weight="duotone" /></Tooltip>, label: "Shelf History", page: "history" },
                { icon: <Tooltip text="Shift Summary"><Trophy size={18} weight="duotone" /></Tooltip>, label: "Shift Summary", page: "summary" },
              ].map((n) => {
                const isActive = n.matchPages
                  ? n.matchPages.includes(currentPage)
                  : currentPage === n.page;
                return (
                  <div key={n.label}
                    className={`sb-nav-item${isActive ? " active" : ""}`}
                    onClick={() => {
                      if (n.page === "scan") {
                        setScannerOpen(true);
                      } else {
                        setCurrentPage(n.page);
                      }
                    }}
                  >
                    <span className="sb-nav-ic">{n.icon}</span>
                    <span>{n.label}</span>
                    {isActive && <span className="sb-nav-dot" />}
                  </div>
                );
              })}
            </nav>

            <div className="sb-clock">
              <div className="sb-clock-ic"><Tooltip text="Current Time"><Clock size={17} weight="duotone" /></Tooltip></div>
              <div>
                <strong className="sb-clock-time">{timeStr}</strong>
                <span className="sb-clock-shift">{shiftData.shift}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* ════ MAIN COLUMN ════ */}
        <div className="main-col">
          {/* Header */}
          <header className="top-bar">
            <div className="top-bar-left">
              <motion.div className="avatar"
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              >
                {avatarLetter}
              </motion.div>
              <div className="top-bar-text">
                <div className="greeting-row">
                  <span className="shift-badge">{shiftIcon(shiftData.shift)}</span>
                  <h1>{shiftData.greeting}, <span className="name-accent">{shiftData.workerName}!</span></h1>
                </div>
                <p className="shift-sub">{shiftData.shift} &middot; {shiftData.store}</p>
              </div>
            </div>
            <div className="top-bar-right">
              <motion.div className="header-chip chip-streak" whileHover={{ y: -2 }}>
                <span className="chip-icon streak-ic"><Tooltip text="Full-Shelf Streak"><Trophy size={15} weight="duotone" /></Tooltip></span>
                <div>
                  <strong>{shiftData.streakCount}</strong>
                  <span>full-shelf scans today!</span>
                </div>
              </motion.div>
              <motion.div className="header-chip chip-restock" whileHover={{ y: -2 }}>
                <span className="chip-icon restock-ic"><Tooltip text="Restock Progress"><BellRinging size={15} weight="duotone" /></Tooltip></span>
                <div>
                  <strong>{shiftData.restockCompleted} of {shiftData.restockTotal}</strong>
                  <span>restocks completed</span>
                </div>
              </motion.div>
            </div>
          </header>

          {/* ════ INNER CONTENT ════ */}
          <AnimatePresence mode="wait">
          {currentPage === "report" || currentPage === "alerts" ? (
            <motion.div key="report" style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}
              initial={{opacity:0,x:40}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-40}}
              transition={{type:'spring',stiffness:300,damping:30}}>
              <ActionReport shelf={selectedShelf} mode={activeMode} onComplete={handleReportComplete} onClose={handleReportComplete} />
            </motion.div>
          ) : currentPage === "summary" ? (
            <motion.div key="summary" style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}
              initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}}
              transition={{type:'spring',stiffness:300,damping:30}}>
              <ShiftSummary onClose={() => setCurrentPage("shift")} />
            </motion.div>
          ) : currentPage === "history" ? (
            <motion.div key="history" style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}
              initial={{opacity:0,x:40}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-40}}
              transition={{type:'spring',stiffness:300,damping:30}}>
              <ShelfHistory onClose={() => setCurrentPage("shift")} />
            </motion.div>
          ) : (
            <motion.div key="dashboard" style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}
              initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              transition={{duration:0.2}}>
              {/* Quick Stats Strip — only on dashboard */}
              <div className="stats-strip">
                <div className="stat-item">
                  <span className="stat-dot green" />
                  <span className="stat-val">{counts.done}</span>
                  <span className="stat-lbl">Compliant</span>
                </div>
                <div className="stat-item">
                  <span className="stat-dot red" />
                  <span className="stat-val">{counts.oos}</span>
                  <span className="stat-lbl">OOS detected</span>
                </div>
                <div className="stat-item">
                  <span className="stat-dot grey" />
                  <span className="stat-val">{counts.pending}</span>
                  <span className="stat-lbl">Pending scan</span>
                </div>
                <div className="stat-item">
                  <span className="stat-dot amber" />
                  <span className="stat-val">{counts.priority}</span>
                  <span className="stat-lbl">Priority</span>
                </div>
                <div className="stat-item">
                  <span className="stat-val" style={{ color: "#059669" }}>{animProg}%</span>
                  <span className="stat-lbl">Coverage</span>
                </div>
              </div>

              {/* Scrollable Content */}
              <motion.main className="content-scroll" initial="hidden" animate="visible"
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.1 } } }}
              >
                {/* Offline banner */}
                {shiftData.offline && (
                  <motion.div className="offline-bar" variants={fadeUp}>
                    <div className="offline-left">
                      <div className="offline-ic"><Tooltip text="No Internet Connection"><WifiSlash size={17} weight="duotone" /></Tooltip></div>
                      <div>
                        <strong>Offline mode active</strong>
                        <p>Scans saved locally — will sync when connected</p>
                      </div>
                    </div>
                    <span className="offline-dot" />
                  </motion.div>
                )}

                {/* Stats row */}
                <motion.section className="stats-row" variants={fadeUp}>
                  <div className="card progress-card">
                    <div className="card-top">
                      <div>
                        <span className="label-upper">Today's Progress</span>
                        <h2>Shelf Coverage</h2>
                      </div>
                      <motion.span className="pct-badge" key={animProg}
                        initial={{ scale: 0.85 }} animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        {animProg}%
                      </motion.span>
                    </div>
                    <div className="progress-body">
                      <ProgressRing progress={progress} scanned={shiftData.scanned} total={shiftData.total} />
                      <div className="metric-stack">
                        <motion.div className="metric" whileHover={{ x: 3 }}>
                          <span className="metric-ic ic-done"><Tooltip text="Completed Shelves"><CheckCircle size={14} weight="duotone" /></Tooltip></span>
                          <div><span className="metric-lbl">Completed</span><strong>{shiftData.scanned} shelves</strong></div>
                        </motion.div>
                        <motion.div className="metric" whileHover={{ x: 3 }}>
                          <span className="metric-ic ic-left"><Tooltip text="Remaining Shelves"><Lightning size={14} weight="duotone" /></Tooltip></span>
                          <div><span className="metric-lbl">Remaining</span><strong>{shiftData.total - shiftData.scanned} shelves</strong></div>
                        </motion.div>
                        <motion.div className="metric" whileHover={{ x: 3 }}>
                          <span className="metric-ic ic-pace"><Tooltip text="Target Pace"><Crosshair size={14} weight="duotone" /></Tooltip></span>
                          <div><span className="metric-lbl">Target pace</span><strong>Under 90 sec / scan</strong></div>
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  <div className="summary-col">
                    <motion.div className="card summary-card summary-amber" variants={fadeUp}
                      whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(245,158,11,0.1)" }}
                    >
                      <div className="sum-icon amber"><Tooltip text="Storeroom Alerts"><BellRinging size={19} weight="duotone" /></Tooltip></div>
                      <div className="sum-body">
                        <span className="label-upper">Storeroom Alerts</span>
                        <h3>{shiftData.restockCompleted} of {shiftData.restockTotal}</h3>
                        <p>Restocks completed today</p>
                        <div className="sum-bar">
                          <motion.div className="sum-bar-fill amber"
                            initial={{ width: 0 }}
                            animate={{ width: `${(shiftData.restockCompleted / shiftData.restockTotal) * 100}%` }}
                            transition={{ delay: 0.5, duration: 0.7, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    </motion.div>

                    <motion.div className="card summary-card summary-red" variants={fadeUp}
                      whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(239,68,68,0.08)" }}
                    >
                      <div className="sum-icon red"><Tooltip text="Priority Tracking"><Fire size={19} weight="duotone" /></Tooltip></div>
                      <div className="sum-body">
                        <span className="label-upper">Priority Tracking</span>
                        <h3>{counts.priority} hot {counts.priority === 1 ? "shelf" : "shelves"}</h3>
                        <p>Need immediate shelf review</p>
                      </div>
                    </motion.div>
                  </div>
                </motion.section>

                {/* Queue header */}
                <motion.div className="queue-header" variants={fadeUp}>
                  <div>
                    <span className="label-upper">Work Queue</span>
                    <h2>Assigned Shelves</h2>
                  </div>
                  <div className="queue-pills">
                    <span className="q-pill">Priority first</span>
                    <span className="q-pill accent">{sorted.length} shelves</span>
                  </div>
                </motion.div>

                {/* Shelf list */}
                <motion.section className="shelf-list" variants={stagger}>
                  {sorted.map((a) => (
                    <ShelfCard key={a.id} shelf={a} onOpen={openShelf} />
                  ))}
                </motion.section>
              </motion.main>

            </motion.div>
          )}
          </AnimatePresence>

          {/* FAB — outside AnimatePresence so it anchors to main-col */}
          {currentPage === "shift" && (
            <motion.button className="fab"
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.4 }}
              whileHover={{ y: -2, boxShadow: "0 16px 36px rgba(5,150,105,0.28)" }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setScannerOpen(true)}
            >
              <Tooltip text="Start Shelf Scan"><Scan size={20} weight="duotone" /></Tooltip>
              <span>Start Shelf Scan</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* ════ MOBILE BOTTOM NAV ════ */}
      <nav className="mobile-nav">
        {[
          { icon: <Tooltip text="Shift Start"><Sparkle size={20} weight="duotone" /></Tooltip>, label: "Shift", page: "shift" },
          { icon: <Tooltip text="Shelf History"><Clock size={20} weight="duotone" /></Tooltip>, label: "History", page: "history" },
          { icon: <Tooltip text="Start Scan"><Scan size={22} weight="duotone" /></Tooltip>, label: "Scan", page: "scan", isFab: true },
          { icon: <Tooltip text="Restock Alerts"><BellRinging size={20} weight="duotone" /></Tooltip>, label: "Alerts", page: "alerts", matchPages: ["alerts", "report"] },
          { icon: <Tooltip text="Shift Summary"><Trophy size={20} weight="duotone" /></Tooltip>, label: "Summary", page: "summary" },
        ].map((n) => {
          const isActive = n.matchPages
            ? n.matchPages.includes(currentPage)
            : currentPage === n.page;
          return (
            <button key={n.label}
              className={`mobile-nav-item${isActive ? " active" : ""}${n.isFab ? " mobile-nav-fab" : ""}`}
              onClick={() => {
                if (n.page === "scan") { setScannerOpen(true); }
                else { setCurrentPage(n.page); }
              }}
            >
              <span className="mobile-nav-icon">{n.icon}</span>
              <span className="mobile-nav-label">{n.label}</span>
            </button>
          );
        })}
      </nav>

      <AnimatePresence>
        {scannerOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <ShelfScanner shelf={selectedShelf} onConfirm={handleModeSelect} onClose={closeScan} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeMode === 'photo' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <PhotoMode shelf={selectedShelf} onComplete={handleModeComplete} onClose={closeScan} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeMode === 'video' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <VideoMode shelf={selectedShelf} onComplete={handleModeComplete} onClose={closeScan} />
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
};

export default Dashboard;
