import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
} from "recharts";
import {
  CaretLeft, CaretRight, Clock, TrendUp, TrendDown, Timer, ChartLineUp,
  CheckCircle, Warning, Grains, Wine, Cookie, Drop, Flask, Broom, Baby,
  BowlSteam, ShoppingCart, Package, ClockCounterClockwise, ListBullets,
  CalendarBlank, Camera, Scan, MapPin, ArrowsLeftRight
} from "@phosphor-icons/react";
import Tooltip from "./Tooltip";
import "./ShelfHistory.css";

/* ─── Category icon config (mirrors Dashboard) ─── */
const catConfig = {
  "Staples & Grains":      { icon: Grains,       bg: "#fef3c7", color: "#92400e" },
  "Beverages":             { icon: Wine,         bg: "#d1fae5", color: "#1e40af" },
  "Snacks & Biscuits":     { icon: Cookie,       bg: "#fce7f3", color: "#9d174d" },
  "Personal Care":         { icon: Drop,         bg: "#e0e7ff", color: "#4338ca" },
  "Dairy & Frozen":        { icon: Flask,        bg: "#cffafe", color: "#0e7490" },
  "Cooking Oil & Masalas":  { icon: Flask,        bg: "#ffedd5", color: "#c2410c" },
  "Household & Cleaning":  { icon: Broom,        bg: "#d1fae5", color: "#065f46" },
  "Baby & Health":         { icon: Baby,         bg: "#fce7f3", color: "#be185d" },
  "Breakfast & Cereals":   { icon: BowlSteam,    bg: "#fed7aa", color: "#9a3412" },
  "Checkout Impulse Zone": { icon: ShoppingCart,  bg: "#e0e7ff", color: "#3730a3" },
};

/* ─── Scan thumbnail colors per status ─── */
const thumbColors = {
  pass: { bg: "linear-gradient(135deg, #ecfdf5, #d1fae5)", border: "#a7f3d0" },
  fail: { bg: "linear-gradient(135deg, #fef2f2, #fee2e2)", border: "#fca5a5" },
};

function CatIcon({ category }) {
  const cfg = catConfig[category];
  if (!cfg) return <div className="ah-cat-icon" style={{ background: "#f1f5f9" }}><Package size={18} weight="fill" color="#64748b" /></div>;
  return (
    <div className="ah-cat-icon" style={{ background: cfg.bg }}>
      <cfg.icon size={18} weight="fill" color={cfg.color} />
    </div>
  );
}

/* ─── Scan Thumbnail ─── */
function ScanThumb({ status }) {
  const colors = thumbColors[status] || thumbColors.pass;
  return (
    <div className={`ah-scan-thumb ${status}`} style={{ background: colors.bg, borderColor: colors.border }}>
      <div className="ah-scan-thumb-shelves">
        <div className="ah-scan-thumb-row">
          <span className="ah-thumb-block" /><span className="ah-thumb-block" /><span className="ah-thumb-block" />
        </div>
        <div className="ah-scan-thumb-row">
          <span className="ah-thumb-block" />
          {status === "fail" && <span className="ah-thumb-block gap" />}
          {status !== "fail" && <span className="ah-thumb-block" />}
          <span className="ah-thumb-block" />
        </div>
        <div className="ah-scan-thumb-row">
          <span className="ah-thumb-block" /><span className="ah-thumb-block" />
        </div>
      </div>
      <div className="ah-scan-thumb-badge">
        {status === "pass" ? <CheckCircle size={10} weight="fill" /> : <Warning size={10} weight="fill" />}
      </div>
    </div>
  );
}

/* ─── Dummy data ─── */
const todayScans = [
  {
    id: 3, name: "Shelf 3", category: "Staples & Grains", time: "8:15 AM", status: "pass", note: "All clear",
    sections: [
      { name: "Rice & Atta", status: "pass" },
      { name: "Pulses", status: "pass" },
      { name: "Sugar & Salt", status: "pass" },
      { name: "Spice Powders", status: "pass" },
    ],
    scanTime: "1m 48s", restocks: 0, turnaround: null,
  },
  {
    id: 5, name: "Shelf 5", category: "Beverages", time: "8:32 AM", status: "pass", note: "All clear",
    sections: [
      { name: "Soft Drinks", status: "pass" },
      { name: "Juices", status: "pass" },
      { name: "Water & Soda", status: "pass" },
    ],
    scanTime: "1m 22s", restocks: 0, turnaround: null,
  },
  {
    id: 7, name: "Shelf 7", category: "Snacks & Biscuits", time: "8:48 AM", status: "fail", note: "3 OOS · 1 misplacement",
    sections: [
      { name: "Premium Biscuits", status: "pass" },
      { name: "Value Biscuits", status: "fail", issues: [{ type: "oos", product: "Parle-G 250g", detail: "4 units OOS" }] },
      { name: "Namkeen & Savoury", status: "fail", issues: [{ type: "oos", product: "Kurkure Multi Grain" }, { type: "misplaced", product: "Shree Ganesh Mixture" }] },
      { name: "Chips & Crisps", status: "pass" },
      { name: "Chocolates & Candy", status: "fail", issues: [{ type: "oos", product: "Dairy Milk 50g", detail: "3 units OOS" }] },
      { name: "Health Snacks & Rusks", status: "pass" },
    ],
    scanTime: "2m 15s", restocks: 3, turnaround: "14 min",
  },
  {
    id: 9, name: "Shelf 9", category: "Personal Care", time: "9:05 AM", status: "pass", note: "All clear",
    sections: [
      { name: "Shampoo & Hair", status: "pass" },
      { name: "Soaps & Body", status: "pass" },
      { name: "Oral Care", status: "pass" },
      { name: "Skincare", status: "pass" },
    ],
    scanTime: "1m 55s", restocks: 0, turnaround: null,
  },
  {
    id: 2, name: "Shelf 2", category: "Dairy & Frozen", time: "9:28 AM", status: "fail", note: "2 OOS detected",
    sections: [
      { name: "Milk & Curd", status: "fail", issues: [{ type: "oos", product: "Mother Dairy Curd 400g", detail: "Completely OOS" }] },
      { name: "Butter & Cheese", status: "fail", issues: [{ type: "oos", product: "Amul Butter 100g", detail: "1 of 4 facings" }] },
      { name: "Ice Cream", status: "pass" },
      { name: "Frozen Vegs", status: "pass" },
    ],
    scanTime: "2m 05s", restocks: 2, turnaround: "11 min",
  },
  {
    id: 4, name: "Shelf 4", category: "Cooking Oil & Masalas", time: "9:52 AM", status: "pass", note: "All clear",
    sections: [
      { name: "Cooking Oils", status: "pass" },
      { name: "Masalas & Spices", status: "pass" },
      { name: "Pickles & Chutneys", status: "pass" },
    ],
    scanTime: "1m 35s", restocks: 0, turnaround: null,
  },
  {
    id: 6, name: "Shelf 6", category: "Household & Cleaning", time: "10:15 AM", status: "fail", note: "1 OOS detected",
    sections: [
      { name: "Detergent", status: "pass" },
      { name: "Floor Cleaners", status: "fail", issues: [{ type: "oos", product: "Lizol 500ml", detail: "2 units OOS" }] },
      { name: "Dishwash", status: "pass" },
    ],
    scanTime: "1m 42s", restocks: 1, turnaround: "18 min",
  },
  {
    id: 8, name: "Shelf 8", category: "Baby & Health", time: "10:38 AM", status: "pass", note: "All clear",
    sections: [
      { name: "Baby Food", status: "pass" },
      { name: "Diapers", status: "pass" },
      { name: "Health Drinks", status: "pass" },
    ],
    scanTime: "1m 28s", restocks: 0, turnaround: null,
  },
  {
    id: 10, name: "Shelf 10", category: "Breakfast & Cereals", time: "11:02 AM", status: "pass", note: "All clear",
    sections: [
      { name: "Cereals & Oats", status: "pass" },
      { name: "Bread & Spreads", status: "pass" },
      { name: "Tea & Coffee", status: "pass" },
    ],
    scanTime: "1m 18s", restocks: 0, turnaround: null,
  },
  {
    id: 1, name: "Shelf 1", category: "Checkout Impulse Zone", time: "11:25 AM", status: "pass", note: "All clear",
    sections: [
      { name: "Gum & Mints", status: "pass" },
      { name: "Small Chocolates", status: "pass" },
    ],
    scanTime: "0m 55s", restocks: 0, turnaround: null,
  },
];

const weeklyTrend = [
  { day: "Mon", scans: 8 },
  { day: "Tue", scans: 11 },
  { day: "Wed", scans: 9 },
  { day: "Thu", scans: 14 },
];

const passCount = todayScans.filter(s => s.status === "pass").length;
const failCount = todayScans.filter(s => s.status === "fail").length;

/* ─── Calendar dates ─── */
const calendarDates = [
  { label: "Mon 28", day: "Mon" },
  { label: "Tue 29", day: "Tue" },
  { label: "Wed 30", day: "Wed" },
  { label: "Today", day: "Thu", isToday: true },
];

/* ─── Animation ─── */
const cardVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.03, duration: 0.2, ease: "easeOut" },
  }),
};

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#fff",
      border: "1px solid #e2e8f0",
      borderRadius: 10,
      padding: "10px 14px",
      fontSize: 12,
      color: "#0f172a",
      fontWeight: 600,
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    }}>
      {label}: {payload[0].value} catches
    </div>
  );
}

/* ─── Component ─── */
export default function ShelfHistory({ onClose }) {
  const [activeTab, setActiveTab] = useState("timeline");
  const [expandedId, setExpandedId] = useState(null);
  const [selectedDate, setSelectedDate] = useState("Today");

  return (
    <div className="ah-root">

      {/* Header with title and date navigation */}
      <div className="ah-header">
        <div className="ah-header-title">
          <Tooltip text="Scan History"><ClockCounterClockwise size={18} weight="duotone" /></Tooltip>
          Scan History
        </div>

        {/* Calendar date picker strip */}
        <div className="ah-calendar-strip">
          <button className="ah-cal-arrow"><Tooltip text="Previous Week"><CaretLeft size={14} weight="bold" /></Tooltip></button>
          {calendarDates.map((d) => (
            <button
              key={d.label}
              className={`ah-cal-day ${selectedDate === d.label ? "ah-cal-active" : ""} ${d.isToday ? "ah-cal-today" : ""}`}
              onClick={() => setSelectedDate(d.label)}
            >
              <span className="ah-cal-day-name">{d.day}</span>
              <span className="ah-cal-day-label">{d.isToday ? "Today" : d.label.split(" ")[1]}</span>
            </button>
          ))}
          <button className="ah-cal-arrow"><Tooltip text="Next Week"><CaretRight size={14} weight="bold" /></Tooltip></button>
        </div>
      </div>

      {/* Segmented control */}
      <div className="ah-segmented">
        <button
          className={`ah-seg-btn ${activeTab === "timeline" ? "ah-seg-active" : ""}`}
          onClick={() => setActiveTab("timeline")}
        >
          <Tooltip text="View Timeline"><ListBullets size={15} weight={activeTab === "timeline" ? "fill" : "duotone"} /></Tooltip>
          Timeline
        </button>
        <button
          className={`ah-seg-btn ${activeTab === "stats" ? "ah-seg-active" : ""}`}
          onClick={() => setActiveTab("stats")}
        >
          <Tooltip text="View My Stats"><ChartLineUp size={15} weight={activeTab === "stats" ? "fill" : "duotone"} /></Tooltip>
          My Stats
        </button>
      </div>

      {/* Content */}
      <div className="ah-body">
        <AnimatePresence mode="wait">
          {activeTab === "timeline" ? (
            <motion.div
              key="timeline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {/* Summary cards */}
              <div className="ah-summary-row">
                <div className="ah-summary-card">
                  <div className="ah-summary-icon ah-green">
                    <Tooltip text="Shelves Passed"><CheckCircle size={22} weight="fill" /></Tooltip>
                  </div>
                  <div>
                    <div className="ah-summary-value">{passCount}</div>
                    <div className="ah-summary-label">Passed</div>
                  </div>
                </div>
                <div className="ah-summary-card">
                  <div className="ah-summary-icon ah-red">
                    <Tooltip text="Issues Detected"><Warning size={22} weight="fill" /></Tooltip>
                  </div>
                  <div>
                    <div className="ah-summary-value">{failCount}</div>
                    <div className="ah-summary-label">Issues Found</div>
                  </div>
                </div>
                <div className="ah-summary-card">
                  <div className="ah-summary-icon ah-blue">
                    <Tooltip text="Total Scans Today"><CalendarBlank size={22} weight="fill" /></Tooltip>
                  </div>
                  <div>
                    <div className="ah-summary-value">{todayScans.length}</div>
                    <div className="ah-summary-label">Total Scans</div>
                  </div>
                </div>
              </div>

              {/* Section bar */}
              <div className="ah-section-bar" style={{ marginTop: 18 }}>
                <div className="ah-section-title">
                  <Tooltip text="Today's Activity"><Clock size={14} weight="duotone" /></Tooltip>
                  Today's Activity
                </div>
                <span className="ah-badge-count">{todayScans.length} scans</span>
              </div>

              {/* Timeline cards */}
              <div className="ah-timeline" style={{ marginTop: 2 }}>
                {todayScans.map((scan, i) => (
                  <motion.div
                    key={scan.id}
                    className={`ah-tl-card ${expandedId === scan.id ? "ah-tl-expanded" : ""}`}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    custom={i}
                    onClick={() => setExpandedId(expandedId === scan.id ? null : scan.id)}
                  >
                    <CatIcon category={scan.category} />

                    <div className="ah-tl-body">
                      <div className="ah-tl-top">
                        <span className="ah-tl-name">{scan.name}</span>
                        <span className="ah-tl-category">{scan.category}</span>
                      </div>
                      <div className="ah-tl-note">{scan.note}</div>

                      {expandedId === scan.id && (
                        <motion.div
                          className="ah-tl-details"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          transition={{ duration: 0.2 }}
                        >
                          {/* Summary stats row */}
                          <div className="ah-detail-grid">
                            <div className="ah-detail-cell">
                              <span className="ah-detail-key">Sections</span>
                              <span className="ah-detail-val">{scan.sections.length}</span>
                            </div>
                            <div className="ah-detail-cell">
                              <span className="ah-detail-key">Scan Time</span>
                              <span className="ah-detail-val">{scan.scanTime}</span>
                            </div>
                            <div className="ah-detail-cell">
                              <span className="ah-detail-key">Restocks</span>
                              <span className="ah-detail-val">{scan.restocks > 0 ? `${scan.restocks} sent` : "\u2014"}</span>
                            </div>
                            <div className="ah-detail-cell">
                              <span className="ah-detail-key">Turnaround</span>
                              <span className="ah-detail-val">{scan.turnaround || "\u2014"}</span>
                            </div>
                          </div>

                          {/* Section-by-section breakdown */}
                          <div className="ah-sections-breakdown">
                            <div className="ah-sections-title">
                              <Scan size={12} weight="bold" /> Section Results
                            </div>
                            {scan.sections.map((sec, si) => (
                              <div key={si} className={`ah-sec-row ${sec.status}`}>
                                <div className="ah-sec-row-left">
                                  <span className={`ah-sec-dot ${sec.status}`}>
                                    {sec.status === "pass"
                                      ? <CheckCircle size={12} weight="fill" />
                                      : <Warning size={12} weight="fill" />}
                                  </span>
                                  <span className="ah-sec-name">{sec.name}</span>
                                </div>
                                <span className={`ah-sec-status-badge ${sec.status}`}>
                                  {sec.status === "pass" ? "Clear" : `${sec.issues?.length || 0} issue${(sec.issues?.length || 0) > 1 ? "s" : ""}`}
                                </span>
                              </div>
                            ))}

                            {/* Issue details for failed sections */}
                            {scan.sections.filter(s => s.status === "fail" && s.issues?.length).map((sec, si) => (
                              <div key={`issues-${si}`} className="ah-sec-issues">
                                <div className="ah-sec-issues-title">{sec.name} — Issues:</div>
                                {sec.issues.map((iss, ii) => (
                                  <div key={ii} className={`ah-sec-issue-item ${iss.type}`}>
                                    {iss.type === "oos"
                                      ? <Package size={11} weight="bold" />
                                      : <ArrowsLeftRight size={11} weight="bold" />}
                                    <span className="ah-sec-issue-product">{iss.product}</span>
                                    {iss.detail && <span className="ah-sec-issue-detail">— {iss.detail}</span>}
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Right side: thumbnail + status + time */}
                    <div className="ah-tl-meta">
                      <ScanThumb status={scan.status} />
                      <span className={`ah-status ${scan.status === "pass" ? "ah-pass" : "ah-fail"}`}>
                        {scan.status === "pass"
                          ? <><Tooltip text="Shelf Passed"><CheckCircle size={11} weight="fill" /></Tooltip> Pass</>
                          : <><Tooltip text="Issues Found"><Warning size={11} weight="fill" /></Tooltip> Issues</>}
                      </span>
                      <div className="ah-tl-time">
                        <Tooltip text="Scan Time"><Clock size={11} weight="duotone" /></Tooltip> {scan.time}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="stats"
              className="ah-stats"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {/* Chart card */}
              <div className="ah-chart-card">
                <div className="ah-chart-header">
                  <h3 className="ah-chart-title">
                    <ChartLineUp size={17} weight="duotone" />
                    7-Day OOS Detection Trend
                  </h3>
                  <span className="ah-chart-subtitle">Last 4 active days</span>
                </div>
                <div className="ah-chart-area">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyTrend} margin={{ top: 8, right: 12, bottom: 8, left: -12 }}>
                      <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="day"
                        tick={{ fontSize: 12, fill: "#94a3b8", fontWeight: 600 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 12, fill: "#94a3b8", fontWeight: 600 }}
                        axisLine={false}
                        tickLine={false}
                        allowDecimals={false}
                      />
                      <RechartsTooltip content={<ChartTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="scans"
                        stroke="#059669"
                        strokeWidth={2.5}
                        dot={{ r: 5, fill: "#059669", stroke: "#fff", strokeWidth: 2.5 }}
                        activeDot={{ r: 7, fill: "#059669", stroke: "#d1fae5", strokeWidth: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Metric cards */}
              <div className="ah-metrics-grid">
                <div className="ah-metric-card">
                  <div className="ah-metric-label">
                    <Tooltip text="Average Restock Time"><Timer size={14} weight="duotone" /></Tooltip> Avg Restock Turnaround
                  </div>
                  <div className="ah-metric-value">13 min</div>
                  <div className="ah-metric-trend ah-trend-good">
                    <Tooltip text="Improved from Last Week"><TrendDown size={13} weight="bold" /></Tooltip> from 19 min last week
                  </div>
                </div>
                <div className="ah-metric-card">
                  <div className="ah-metric-label">
                    <Tooltip text="Weekly Out-of-Stock Catches"><ChartLineUp size={14} weight="duotone" /></Tooltip> Weekly OOS Catches
                  </div>
                  <div className="ah-metric-value">42 total</div>
                  <div className="ah-metric-trend ah-trend-good">
                    <Tooltip text="Trending Up"><TrendUp size={13} weight="bold" /></Tooltip> 15% vs last week
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
