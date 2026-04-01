import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowsLeftRight, Eye, EyeSlash, Warning, CheckCircle, TrendUp,
  Clock, Package, ShieldCheck, CurrencyInr, CaretLeft, CaretRight,
  X, ArrowRight
} from "@phosphor-icons/react";
import "./ManagerInspection.css";

/* ═══ Dummy Data ═══ */
const scenarios = [
  {
    id: 1,
    title: "Out-of-Stock Detection",
    shelf: 7, section: 2, sectionName: "Value Biscuits",
    worker: "Rahul M.", capturedAt: "9:18 AM",
    masterImg: "/shelves/shelf7-snacks/shelf7S2(master).png",
    capturedImg: "/shelves/shelf7-snacks/shelf7S2(inspected).png",
    afterImg: "/shelves/shelf7-snacks/shelf7S2(master).png",
    complianceBefore: 67,
    complianceAfter: 100,
    restoredAt: "9:31 AM",
    restoredBy: "Suresh",
    revenueSaved: 1760,
    revenueIfImmediate: 1920,
    revenueLostGap: 160,
    gapMinutes: 13,
    annotations: [
      { type: "oos", x: 25, y: 42, w: 30, h: 18, label: "Parle-G 250g — 4 of 6 units OOS", facing: "2/6", lossPerHour: 80 },
      { type: "ok", x: 60, y: 42, w: 20, h: 18, label: "Krackjack — Fully stocked", facing: "4/4" },
    ],
    discrepancies: [
      { product: "Parle-G 250g", type: "OOS", severity: "Critical", facings: "2/6", lossPerHour: 80, status: "Restocked", icon: "🍪" },
    ],
  },
  {
    id: 2,
    title: "Misplacement Detection",
    shelf: 7, section: 3, sectionName: "Namkeen & Savoury",
    worker: "Rahul M.", capturedAt: "9:18 AM",
    masterImg: "/shelves/shelf7-snacks/shelf7S3(master).png",
    capturedImg: "/shelves/shelf7-snacks/shelf7S3(inspected).png",
    afterImg: "/shelves/shelf7-snacks/shelf7S3(master).png",
    complianceBefore: 33,
    complianceAfter: 100,
    restoredAt: "9:33 AM",
    restoredBy: "Suresh",
    revenueSaved: 2640,
    revenueIfImmediate: 2640,
    revenueLostGap: 0,
    gapMinutes: 15,
    annotations: [
      { type: "misplaced", x: 30, y: 40, w: 25, h: 18, label: "MISPLACEMENT: Shree Ganesh Mixture in Kurkure slot", correctPos: "Lower Shelf, Position 4" },
      { type: "oos", x: 30, y: 40, w: 25, h: 5, label: "Kurkure Multi Grain — completely OOS", facing: "0/1", lossPerHour: 180, behindMisplacement: true },
    ],
    discrepancies: [
      { product: "Kurkure Multi Grain", type: "OOS", severity: "Critical", facings: "0/1", lossPerHour: 180, status: "Restocked", icon: "🥜" },
      { product: "Shree Ganesh Mixture", type: "Misplacement", severity: "Major", lossPerHour: 9, status: "Corrected", icon: "🥜", note: "₹3 margin in ₹12 margin slot" },
    ],
    businessImpact: {
      lostSales: "₹180/hr",
      marginErosion: "₹9/unit sold",
      penaltyRisk: "₹5,000/month — PepsiCo trade agreement",
      totalDailyImpact: "₹2,640",
    },
  },
];

/* ═══ Annotation Overlay ═══ */
const AnnotationOverlay = ({ annotations, showGreen }) => (
  <div className="anno-layer">
    {annotations.map((a, i) => {
      if (a.type === "ok" && !showGreen) return null;
      return (
        <div key={i}
          className={`anno-box anno-${a.type}${a.behindMisplacement ? " anno-behind" : ""}`}
          style={{ left: `${a.x}%`, top: `${a.y}%`, width: `${a.w}%`, height: `${a.h}%` }}
        >
          <span className="anno-label">{a.label}</span>
          {a.facing && <span className={`anno-facing${a.type === "ok" ? " facing-ok" : " facing-oos"}`}>{a.facing}</span>}
          {a.correctPos && <span className="anno-move"><ArrowRight size={10} weight="bold" /> {a.correctPos}</span>}
        </div>
      );
    })}
  </div>
);

/* ═══ Main Component ═══ */
const ManagerInspection = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [showAfter, setShowAfter] = useState(false);
  const [showGreen, setShowGreen] = useState(false);
  const s = scenarios[activeIdx];

  return (
    <div className="inspection-screen">
      {/* Scenario Tabs */}
      <div className="insp-tabs">
        {scenarios.map((sc, i) => (
          <button key={sc.id}
            className={`insp-tab${i === activeIdx ? " active" : ""}`}
            onClick={() => { setActiveIdx(i); setShowAfter(false); }}
          >
            <span className="insp-tab-num">Scenario {i + 1}</span>
            <span className="insp-tab-title">{sc.title}</span>
          </button>
        ))}
      </div>

      {/* Header */}
      <div className="insp-header">
        <div className="insp-header-left">
          <h2>Shelf {s.shelf}, Section {s.section} — {s.sectionName}</h2>
          <div className="insp-meta">
            <span><Clock size={13} weight="duotone" /> Captured {s.capturedAt} by {s.worker}</span>
            <span className="insp-compliance-badge">
              Section Compliance: <strong className="comp-before">{s.complianceBefore}%</strong>
              <ArrowRight size={12} weight="bold" />
              <strong className="comp-after">{s.complianceAfter}%</strong> after restock
            </span>
          </div>
        </div>
        <div className="insp-header-right">
          <div className="insp-revenue-callout">
            <CurrencyInr size={16} weight="bold" />
            <div>
              <strong>₹{s.revenueSaved.toLocaleString("en-IN")} saved</strong>
              <span>Caught {s.capturedAt}, restocked {s.restoredAt} ({s.gapMinutes} min gap)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Split-Screen Comparison */}
      <div className="insp-split">
        <div className="insp-panel master-panel">
          <div className="insp-panel-label"><ShieldCheck size={14} weight="duotone" /> Master Planogram</div>
          <div className="insp-img-wrap">
            <img src={s.masterImg} alt="Master planogram" className="insp-img" />
          </div>
        </div>

        <div className="insp-divider">
          <ArrowsLeftRight size={18} weight="bold" />
        </div>

        <div className="insp-panel captured-panel">
          <div className="insp-panel-label">
            <Eye size={14} weight="duotone" /> {showAfter ? "After Restock" : "Captured Photo"}
          </div>
          <div className="insp-img-wrap">
            <img src={showAfter ? s.afterImg : s.capturedImg} alt="Captured" className="insp-img" />
            {!showAfter && <AnnotationOverlay annotations={s.annotations} showGreen={showGreen} />}
            {showAfter && (
              <div className="insp-after-overlay">
                <CheckCircle size={36} weight="fill" />
                <span>All items restocked</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toggle Controls */}
      <div className="insp-controls">
        <button className={`insp-ctrl-btn${showAfter ? " active" : ""}`} onClick={() => setShowAfter(!showAfter)}>
          <ArrowsLeftRight size={14} weight="bold" />
          {showAfter ? "Show Before" : "Show After Restock"}
        </button>
        <button className={`insp-ctrl-btn${showGreen ? " active" : ""}`} onClick={() => setShowGreen(!showGreen)}>
          {showGreen ? <EyeSlash size={14} weight="bold" /> : <Eye size={14} weight="bold" />}
          {showGreen ? "Hide OK Items" : "Show OK Items"}
        </button>
      </div>

      {/* Business Impact (scenario 2) */}
      {s.businessImpact && (
        <div className="insp-impact">
          <div className="impact-header"><Warning size={15} weight="fill" /> Business Impact — Misplacement</div>
          <div className="impact-grid">
            <div className="impact-item">
              <span className="impact-label">Lost Sales</span>
              <strong>{s.businessImpact.lostSales}</strong>
            </div>
            <div className="impact-item">
              <span className="impact-label">Margin Erosion</span>
              <strong>{s.businessImpact.marginErosion}</strong>
            </div>
            <div className="impact-item">
              <span className="impact-label">Penalty Risk</span>
              <strong>{s.businessImpact.penaltyRisk}</strong>
            </div>
            <div className="impact-item impact-total">
              <span className="impact-label">Total Daily Impact</span>
              <strong>{s.businessImpact.totalDailyImpact}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Discrepancy List */}
      <div className="insp-discrepancies">
        <h3>Discrepancies Detected</h3>
        <div className="disc-list">
          {s.discrepancies.map((d, i) => (
            <div key={i} className={`disc-card disc-${d.severity.toLowerCase()}`}>
              <span className="disc-icon">{d.icon}</span>
              <div className="disc-body">
                <strong>{d.product}</strong>
                <div className="disc-tags">
                  <span className={`disc-type type-${d.type.toLowerCase()}`}>{d.type}</span>
                  <span className={`disc-severity sev-${d.severity.toLowerCase()}`}>{d.severity}</span>
                  {d.facings && <span className="disc-facings">{d.facings}</span>}
                  {d.note && <span className="disc-note">{d.note}</span>}
                </div>
              </div>
              <div className="disc-right">
                {d.lossPerHour > 0 && <span className="disc-loss">₹{d.lossPerHour}/hr</span>}
                <span className={`disc-status status-${d.status.toLowerCase()}`}>
                  <CheckCircle size={12} weight="fill" /> {d.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Approve Override */}
      <div className="insp-override">
        <button className="override-btn" onClick={() => {}}>
          <ShieldCheck size={15} weight="duotone" /> Approve Override
        </button>
        <span className="override-hint">Dismiss AI flag if this was incorrectly flagged (e.g., shelf being actively restocked)</span>
      </div>
    </div>
  );
};

export default ManagerInspection;
