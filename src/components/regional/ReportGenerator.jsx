import React, { useState } from "react";
import { FilePdf, Envelope, Slideshow, Clock, CheckCircle, Calendar, MapPin, ChartBar, Plus } from "@phosphor-icons/react";
import "./Regional.css";

const periods = ["This Week", "This Month", "This Quarter", "Custom"];
const storeOptions = ["All Stores", "Q-Mart Kothrud (Pune)", "Q-Mart Andheri (Mumbai)", "Q-Mart Gangapur Rd (Nashik)", "Q-Mart Dharampeth (Nagpur)", "Q-Mart Jalna Rd (Aurangabad)"];
const metricsOptions = ["Shelf Compliance", "Restock Speed", "OOS Detection", "Planogram Accuracy", "Revenue Recovery", "Staff Efficiency"];
const formats = [
  { id: "pdf", label: "PDF Report", icon: FilePdf },
  { id: "ppt", label: "PowerPoint", icon: Slideshow },
  { id: "email", label: "Email Summary", icon: Envelope },
];

const templates = [
  { id: "monthly", name: "Monthly Chain Performance Report", desc: "Full ops summary for all stores" },
  { id: "roi", name: "Quarterly ROI Summary for Investors", desc: "Financial impact & projections" },
  { id: "brand", name: "Brand Partner Compliance Certificate", desc: "For HUL, PepsiCo, ITC — claim incentives" },
  { id: "expansion", name: "New Store Expansion Proposal", desc: "Projected ROI for 6th store" },
];

const previewPages = [
  { num: 1, title: "Chain Overview", desc: "5 stores, 4,200 SKUs, 83.6% compliance, ₹38.2L recovered" },
  { num: 2, title: "Store Leaderboard", desc: "Radar charts comparing all 5 stores" },
  { num: 3, title: "Financial ROI Waterfall", desc: "5.58:1 ROI breakdown" },
  { num: 4, title: "Brand Standards Heatmap", desc: "Category × Store compliance grid" },
  { num: 5, title: "Brand Partner Compliance", desc: "HUL, PepsiCo, ITC — per-brand status" },
  { num: 6, title: "Recommendations", desc: "Hire 2 at Aurangabad, expand to Solapur" },
];

const scheduledReports = [
  { name: "Weekly Ops Summary", target: "Store Managers", freq: "Every Monday 6 AM" },
  { name: "Monthly Performance Report", target: "Regional Owner", freq: "1st of each month" },
  { name: "Quarterly Brand Compliance", target: "FMCG Partners", freq: "End of quarter" },
  { name: "Quarterly Investor Update", target: "Franchise Board", freq: "End of quarter" },
];

const ReportGenerator = () => {
  const [period, setPeriod] = useState("This Quarter");
  const [format, setFormat] = useState("pdf");
  const [template, setTemplate] = useState("monthly");
  const [generated, setGenerated] = useState(false);
  const [selectedStores, setSelectedStores] = useState(["All Stores"]);
  const [selectedMetrics, setSelectedMetrics] = useState(metricsOptions.slice());
  const [showScheduleForm, setShowScheduleForm] = useState(false);

  return (
    <div className="reg-screen">
      <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>Executive Report Generator</h2>

      <div className="report-gen-body">
        {/* Config Panel */}
        <div className="rg-config">
          <div className="rg-section">
            <h4><Calendar size={14} weight="duotone" /> Time Period</h4>
            <div className="rg-options">
              {periods.map(p => (
                <div key={p} className={`rg-option${period === p ? " selected" : ""}`} onClick={() => setPeriod(p)}>
                  <span className="rg-option-dot" />
                  {p}
                </div>
              ))}
            </div>
          </div>

          <div className="rg-section">
            <h4><MapPin size={14} weight="duotone" /> Stores</h4>
            <div className="rg-options" style={{ flexWrap: "wrap" }}>
              {storeOptions.map(s => (
                <div key={s} className={`rg-option${selectedStores.includes(s) ? " selected" : ""}`}
                  onClick={() => {
                    if (s === "All Stores") setSelectedStores(["All Stores"]);
                    else {
                      const next = selectedStores.filter(x => x !== "All Stores");
                      setSelectedStores(next.includes(s) ? next.filter(x => x !== s) : [...next, s]);
                    }
                  }}>
                  <span className="rg-option-dot" />
                  {s.replace("Q-Mart ", "").replace(/\(|\)/g, "")}
                </div>
              ))}
            </div>
          </div>

          <div className="rg-section">
            <h4><ChartBar size={14} weight="duotone" /> Metrics</h4>
            <div className="rg-options" style={{ flexWrap: "wrap" }}>
              {metricsOptions.map(m => (
                <div key={m} className={`rg-option${selectedMetrics.includes(m) ? " selected" : ""}`}
                  onClick={() => setSelectedMetrics(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m])}>
                  <span className="rg-option-dot" />
                  {m}
                </div>
              ))}
            </div>
          </div>

          <div className="rg-section">
            <h4>Format</h4>
            <div className="rg-options">
              {formats.map(f => (
                <div key={f.id} className={`rg-option${format === f.id ? " selected" : ""}`} onClick={() => setFormat(f.id)}>
                  <f.icon size={15} weight="duotone" />
                  {f.label}
                </div>
              ))}
            </div>
          </div>

          <div className="rg-section">
            <h4>Template</h4>
            <div className="rg-templates">
              {templates.map(t => (
                <div key={t.id} className={`rg-template${template === t.id ? " selected" : ""}`} onClick={() => setTemplate(t.id)}>
                  <strong>{t.name}</strong>
                  <span>{t.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Scheduled Reports */}
          <div className="rg-section">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h4><Clock size={14} weight="duotone" /> Scheduled Reports</h4>
              <button className="rg-add-sched-btn" onClick={() => setShowScheduleForm(!showScheduleForm)}>
                <Plus size={12} weight="bold" /> Add Schedule
              </button>
            </div>
            {showScheduleForm && (
              <div className="rg-sched-form">
                <input type="text" placeholder="Report name..." className="rg-sched-input" />
                <input type="text" placeholder="Recipients..." className="rg-sched-input" />
                <select className="rg-sched-input">
                  <option>Every Monday 6 AM</option>
                  <option>1st of each month</option>
                  <option>End of quarter</option>
                  <option>Daily 8 AM</option>
                </select>
                <button className="rg-sched-save" onClick={() => setShowScheduleForm(false)}>Save Schedule</button>
              </div>
            )}
            <div className="rg-schedule-list">
              {scheduledReports.map((s, i) => (
                <div key={i} className="rg-sched-item">
                  <div style={{ flex: 1 }}>
                    <strong style={{ display: "block", fontSize: ".74rem", fontWeight: 700, color: "#0f172a" }}>{s.name}</strong>
                    <span style={{ fontSize: ".62rem", color: "#94a3b8" }}>→ {s.target}</span>
                  </div>
                  <span className="rg-sched-freq">{s.freq}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="rg-preview">
          <div className="rg-preview-header">
            <div>
              <h3 style={{ margin: 0, fontSize: ".9rem", fontWeight: 800 }}>Report Preview</h3>
              <span style={{ fontSize: ".68rem", color: "#94a3b8" }}>Q4 FY26 · Q-Mart Chain Performance Summary</span>
            </div>
            <span style={{ fontSize: ".64rem", color: "#64748b", background: "#f1f5f9", padding: "4px 10px", borderRadius: 6, fontWeight: 700 }}>6 pages</span>
          </div>

          <div className="rg-preview-pages">
            {previewPages.map(p => (
              <div key={p.num} className="rg-page">
                <span className="rg-page-num">{p.num}</span>
                <div className="rg-page-body">
                  <strong>{p.title}</strong>
                  <span>{p.desc}</span>
                </div>
              </div>
            ))}
          </div>

          <button className="rg-gen-btn" onClick={() => setGenerated(true)}>
            {generated ? <><CheckCircle size={16} weight="fill" /> Report Generated!</> : <>Generate {format.toUpperCase()} Report</>}
          </button>

          {template === "brand" && (
            <div style={{ marginTop: 12, padding: "12px 14px", background: "#ecfdf5", borderRadius: 10, border: "1px solid #a7f3d0" }}>
              <strong style={{ fontSize: ".76rem", color: "#065f46", display: "block", marginBottom: 4 }}>Brand Partner Certificate — HUL Preview</strong>
              <p style={{ fontSize: ".7rem", color: "#047857", margin: 0, lineHeight: 1.5 }}>
                Chain-Wide Compliance: 86.2% (above 85% threshold). Pune 92%, Mumbai 88%, Nashik 85%, Nagpur 82%, Aurangabad 78%.
                Q-Mart qualifies for full trade marketing incentive of ₹1,20,000/quarter for Pune, Mumbai, and Nashik.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator;
