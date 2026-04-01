import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowsLeftRight, Eye, EyeSlash, Warning, CheckCircle, TrendUp,
  Clock, Package, ShieldCheck, CurrencyInr, CaretLeft, CaretRight,
  X, ArrowRight, Grains, Wine, Cookie, Drop, Flask, Broom, Baby,
  BowlSteam, ShoppingCart, Scan
} from "@phosphor-icons/react";
import { managerShelves, allShelfSections } from "../data";
import "./ManagerInspection.css";

/* ═══ Category icon config ═══ */
const catConfig = {
  "Checkout Impulse":     { icon: ShoppingCart, bg: "#e0e7ff", color: "#3730a3" },
  "Dairy & Frozen":       { icon: Flask,        bg: "#cffafe", color: "#0e7490" },
  "Staples & Grains":     { icon: Grains,       bg: "#fef3c7", color: "#92400e" },
  "Cooking Oil & Masalas": { icon: Flask,        bg: "#ffedd5", color: "#c2410c" },
  "Beverages":            { icon: Wine,         bg: "#d1fae5", color: "#065f46" },
  "Household & Cleaning": { icon: Broom,        bg: "#d1fae5", color: "#065f46" },
  "Snacks & Biscuits":    { icon: Cookie,       bg: "#fce7f3", color: "#9d174d" },
  "Baby & Health":        { icon: Baby,         bg: "#fce7f3", color: "#be185d" },
  "Personal Care":        { icon: Drop,         bg: "#e0e7ff", color: "#4338ca" },
  "Breakfast & Cereals":  { icon: BowlSteam,    bg: "#fed7aa", color: "#9a3412" },
};

const compColor = (c) => c >= 90 ? "#16a34a" : c >= 80 ? "#059669" : c >= 70 ? "#f59e0b" : "#ef4444";

/* ═══ Build inspection data for ALL sections of a shelf ═══ */
function buildAllSections(shelfId) {
  const sections = allShelfSections[shelfId] || [];
  if (sections.length === 0) return [];

  return sections.map((sec) => {
    const issues = sec.issues || [];
    const isPass = sec.result === "pass" || issues.length === 0;
    const oosIssues = issues.filter(i => i.type === "oos");
    const misplacedIssues = issues.filter(i => i.type === "misplaced");
    const isOOS = oosIssues.length > 0;
    const isMisplaced = misplacedIssues.length > 0;

    // Build annotations from issues
    const annotations = issues.map((iss, j) => ({
      type: iss.type === "oos" ? "oos" : "misplaced",
      x: 20 + (j * 25), y: 35 + (j * 8), w: 28, h: 16,
      label: `${iss.product} — ${iss.detail || (iss.type === "misplaced" ? "Wrong position" : "OOS")}`,
      facing: iss.facingsExpected ? `${iss.facingsFound || 0}/${iss.facingsExpected}` : undefined,
      correctPos: iss.correctLocation,
      lossPerHour: iss.type === "oos" ? (Math.floor(Math.random() * 80) + 40) : 9,
    }));

    // Add OK items
    const okProducts = (sec.expectedProducts || []).slice(0, 3);
    okProducts.forEach((p, j) => {
      if (!issues.find(i => i.product === p)) {
        annotations.push({
          type: "ok", x: 55 + (j * 12), y: 25 + (j * 10), w: 16, h: 12,
          label: `${p} — OK`, facing: "OK",
        });
      }
    });

    const totalLoss = annotations.reduce((sum, a) => sum + (a.lossPerHour || 0), 0);

    return {
      id: sec.id,
      sectionName: sec.name,
      isPass,
      title: isPass ? "Compliant" : (isOOS && isMisplaced ? "OOS + Misplacement" : isOOS ? "Out-of-Stock" : "Misplacement"),
      shelf: shelfId, section: sec.id,
      worker: "Rahul M.", capturedAt: "9:18 AM",
      masterImage: sec.masterImage,
      capturedImg: sec.masterImage.replace("(master)", "(inspected)"),
      afterImg: sec.masterImage,
      complianceBefore: isPass ? 100 : Math.max(20, 100 - (issues.length * 30)),
      complianceAfter: 100,
      restoredAt: "9:31 AM", restoredBy: "Suresh",
      revenueSaved: totalLoss * 12,
      gapMinutes: isPass ? 0 : Math.floor(Math.random() * 15) + 5,
      annotations,
      discrepancies: issues.map(iss => ({
        product: iss.product,
        type: iss.type === "oos" ? "OOS" : "Misplacement",
        severity: iss.type === "oos" ? "Critical" : "Major",
        facings: iss.facingsExpected ? `${iss.facingsFound || 0}/${iss.facingsExpected}` : undefined,
        lossPerHour: iss.type === "oos" ? (Math.floor(Math.random() * 80) + 40) : 9,
        status: "Restocked",
        icon: "📦",
        note: iss.type === "misplaced" ? `Move to ${iss.correctLocation}` : undefined,
      })),
      businessImpact: isMisplaced ? {
        lostSales: `₹${totalLoss}/hr`,
        marginErosion: "₹9/unit sold",
        penaltyRisk: "Possible trade agreement violation",
        totalDailyImpact: `₹${totalLoss * 12}`,
      } : null,
    };
  });
}

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
  const [selectedShelf, setSelectedShelf] = useState(1);
  const [activeIdx, setActiveIdx] = useState(0);
  const [showAfter, setShowAfter] = useState(false);
  const [showGreen, setShowGreen] = useState(false);

  const allSections = buildAllSections(selectedShelf);
  const shelfInfo = managerShelves.find(s => s.id === selectedShelf);
  const s = allSections.length > 0 ? allSections[activeIdx] : null;
  const failCount = allSections.filter(sec => !sec.isPass).length;
  const passCount = allSections.filter(sec => sec.isPass).length;

  const handleShelfSelect = (id) => {
    setSelectedShelf(id);
    setActiveIdx(0);
    setShowAfter(false);
    setShowGreen(false);
  };

  return (
    <div className="inspection-screen">

      {/* ═══ Shelf Selector Strip ═══ */}
      <div className="insp-shelf-strip">
        <div className="insp-shelf-strip-label">
          <Scan size={14} weight="bold" /> Select Shelf
        </div>
        <div className="insp-shelf-list">
          {managerShelves.map((sh) => {
            const cfg = catConfig[sh.category] || {};
            const Icon = cfg.icon || Package;
            const isActive = sh.id === selectedShelf;
            const hasIssues = sh.oosItems > 2;
            return (
              <button
                key={sh.id}
                className={`insp-shelf-chip${isActive ? " active" : ""}${hasIssues ? " has-issues" : ""}`}
                onClick={() => handleShelfSelect(sh.id)}
              >
                <div className="insp-shelf-chip-icon" style={{ background: isActive ? (cfg.color || "#64748b") : (cfg.bg || "#f1f5f9") }}>
                  <Icon size={16} weight="fill" color={isActive ? "#fff" : (cfg.color || "#64748b")} />
                </div>
                <div className="insp-shelf-chip-info">
                  <span className="insp-shelf-chip-id">Shelf {sh.id}</span>
                  <span className="insp-shelf-chip-cat">{sh.category}</span>
                </div>
                <div className="insp-shelf-chip-meta">
                  <span className="insp-shelf-chip-comp" style={{ color: compColor(sh.compliance) }}>{sh.compliance}%</span>
                  {sh.oosItems > 0 && (
                    <span className="insp-shelf-chip-oos">{sh.oosItems} OOS</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══ Section Summary Bar ═══ */}
      {allSections.length > 0 && (
        <div className="insp-section-summary">
          <span className="insp-section-summary-label">
            Shelf {selectedShelf} — {shelfInfo?.category} · {allSections.length} sections
          </span>
          <div className="insp-section-summary-pills">
            <span className="insp-pill-pass"><CheckCircle size={12} weight="fill" /> {passCount} Pass</span>
            {failCount > 0 && <span className="insp-pill-fail"><Warning size={12} weight="fill" /> {failCount} Issues</span>}
          </div>
        </div>
      )}

      {/* ═══ Section Tabs — ALL sections ═══ */}
      {allSections.length > 0 && s && (
        <>
          <div className="insp-tabs">
            {allSections.map((sec, i) => (
              <button key={sec.id}
                className={`insp-tab${i === activeIdx ? " active" : ""} ${sec.isPass ? "insp-tab-pass" : "insp-tab-fail"}`}
                onClick={() => { setActiveIdx(i); setShowAfter(false); }}
              >
                <span className="insp-tab-status">
                  {sec.isPass
                    ? <CheckCircle size={12} weight="fill" style={{ color: "#16a34a" }} />
                    : <Warning size={12} weight="fill" style={{ color: "#ef4444" }} />
                  }
                </span>
                <span className="insp-tab-num">Section {sec.id}</span>
                <span className="insp-tab-title">{sec.sectionName}</span>
                <span className={`insp-tab-badge ${sec.isPass ? "badge-pass" : "badge-fail"}`}>
                  {sec.isPass ? "Pass" : sec.title}
                </span>
              </button>
            ))}
          </div>

          {/* ═══ Pass Section — Compliant View ═══ */}
          {s.isPass && (
            <div className="insp-section-pass">
              <div className="insp-section-pass-icon">
                <CheckCircle size={32} weight="fill" />
              </div>
              <h3>Section {s.section} — {s.sectionName}</h3>
              <p>All products correctly placed and fully stocked. No discrepancies detected.</p>
              <div className="insp-section-pass-img">
                <div className="insp-img-wrap">
                  <img src={s.masterImage} alt={s.sectionName} className="insp-img" />
                </div>
              </div>
              <span className="insp-compliant-badge">100% Compliant</span>
            </div>
          )}

          {/* ═══ Fail Section — Full Inspection ═══ */}
          {!s.isPass && <>
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
                <img src={s.masterImage} alt="Master planogram" className="insp-img" />
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

          {/* Business Impact */}
          {s.businessImpact && (
            <div className="insp-impact">
              <div className="impact-header"><Warning size={15} weight="fill" /> Business Impact</div>
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
            <button className="override-btn">
              <ShieldCheck size={15} weight="duotone" /> Approve Override
            </button>
            <span className="override-hint">Dismiss AI flag if incorrectly flagged</span>
          </div>
          </>}
        </>
      )}
    </div>
  );
};

export default ManagerInspection;
