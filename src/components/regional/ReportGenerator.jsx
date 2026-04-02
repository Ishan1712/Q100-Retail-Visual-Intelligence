import React, { useState } from "react";
import { FilePdf, Envelope, Slideshow, Clock, CheckCircle, Calendar, MapPin, ChartBar, Plus, TrendUp, DownloadSimple, Eye, Warning, CurrencyInr, Users } from "@phosphor-icons/react";
import "./Regional.css";

const storeOptions = ["All Stores", "Q-Mart Kothrud (Pune)", "Q-Mart Andheri (Mumbai)", "Q-Mart Gangapur Rd (Nashik)", "Q-Mart Dharampeth (Nagpur)", "Q-Mart Sadar (Nagpur)"];

const reportTypes = [
  { id: "monthly", name: "Monthly Store Report", desc: "Sales figures, empty shelf stats, top/slow products, staff & manager performance — for one store" },
  { id: "chain", name: "Chain Performance Summary", desc: "All stores compared: sales, empty shelves, restock speed, product performance" },
  { id: "quarterly", name: "Quarterly Business Review", desc: "Revenue impact, sales trends, product intelligence, staff analytics, growth" },
  { id: "manager", name: "Manager Performance Report", desc: "Per-store manager: sales, restock speed, issues resolved, staff they manage" },
  { id: "fmcg", name: "FMCG Partner Report", desc: "Per brand: shelf compliance, placement accuracy — for trade marketing discussions" },
];

const formats = [
  { id: "pdf", label: "PDF Report", icon: FilePdf },
  { id: "ppt", label: "PowerPoint", icon: Slideshow },
  { id: "email", label: "Email Summary", icon: Envelope },
];

const previewPages = {
  monthly: [
    { num: 1, title: "Executive Summary", desc: "AI-generated overview of store performance, key highlights, and action items" },
    { num: 2, title: "Sales Figures", desc: "Daily, weekly, monthly sales with trend analysis and comparison" },
    { num: 3, title: "Empty Shelf Analytics", desc: "Detected vs restocked, time-to-restock, revenue impact" },
    { num: 4, title: "Top & Slow Products", desc: "Best sellers and slowest movers with recommendations" },
    { num: 5, title: "Staff Performance", desc: "Floor and storeroom staff metrics, restock speed, efficiency" },
    { num: 6, title: "Manager Performance", desc: "Store metrics under manager, issues resolved, team management" },
    { num: 7, title: "Revenue Recovered", desc: "₹ saved from fast restocking, reduced walkouts, better placement" },
  ],
  chain: [
    { num: 1, title: "Chain Overview", desc: "5 stores, 4,200+ SKUs, total sales, overall performance" },
    { num: 2, title: "Store Comparison", desc: "Side-by-side sales, empty shelves, restock speed across all stores" },
    { num: 3, title: "Product Performance", desc: "Top selling & slow moving products across the chain" },
    { num: 4, title: "Recommendations", desc: "AI-generated insights and action items" },
  ],
  quarterly: [
    { num: 1, title: "Executive Summary", desc: "Quarter highlights, revenue impact, growth trajectory" },
    { num: 2, title: "Revenue Impact Analysis", desc: "Before vs After Q100, sales uplift, ROI breakdown" },
    { num: 3, title: "Sales Trends", desc: "12-month trend analysis with projections" },
    { num: 4, title: "Product Intelligence", desc: "Category performance, best/slow products, stock issues" },
    { num: 5, title: "Staff Analytics", desc: "Team performance, bottlenecks, training progress" },
    { num: 6, title: "Growth Plan", desc: "Projected revenue, expansion recommendations" },
  ],
  manager: [
    { num: 1, title: "Manager Scorecard", desc: "Sales under management, restock efficiency, team output" },
    { num: 2, title: "Issue Resolution", desc: "Problems identified and resolved, response times" },
    { num: 3, title: "Staff Management", desc: "Team performance, training, scheduling effectiveness" },
  ],
  fmcg: [
    { num: 1, title: "Brand Compliance Summary", desc: "Per-brand shelf placement accuracy and compliance %" },
    { num: 2, title: "Trade Marketing Metrics", desc: "Income protected, incentive qualification status" },
    { num: 3, title: "Recommendations", desc: "Actions to maintain/improve compliance for each brand" },
  ],
};

/* ── Quick Insights ── */
const quickInsights = [
  { label: "Reports Generated", value: "47", sub: "This month", icon: FilePdf, color: "#6366f1", bg: "#eef2ff" },
  { label: "Revenue Tracked", value: "₹49.2L", sub: "March total", icon: CurrencyInr, color: "#059669", bg: "#dcfce7" },
  { label: "Action Items", value: "12", sub: "Pending follow-up", icon: Warning, color: "#f59e0b", bg: "#fef3c7" },
  { label: "Recipients", value: "18", sub: "Receiving reports", icon: Users, color: "#2563eb", bg: "#dbeafe" },
];

/* ── Recently Generated Reports ── */
const recentReports = [
  { name: "Monthly Store Report — Pune", date: "1 Apr 2026", format: "PDF", pages: 7, status: "sent", recipients: "owner@qmart.com, pune.mgr@qmart.com", size: "2.4 MB" },
  { name: "Chain Performance Summary", date: "31 Mar 2026", format: "PDF", pages: 4, status: "sent", recipients: "owner@qmart.com", size: "1.8 MB" },
  { name: "FMCG Partner Report — Q1", date: "28 Mar 2026", format: "PPT", pages: 3, status: "sent", recipients: "3 brand managers", size: "3.1 MB" },
  { name: "Manager Performance — March", date: "25 Mar 2026", format: "PDF", pages: 3, status: "viewed", recipients: "5 store managers", size: "1.2 MB" },
  { name: "Monthly Store Report — Mumbai", date: "1 Mar 2026", format: "PDF", pages: 7, status: "sent", recipients: "owner@qmart.com, mum.mgr@qmart.com", size: "2.6 MB" },
  { name: "Weekly Chain Digest", date: "24 Mar 2026", format: "Email", pages: 2, status: "opened", recipients: "owner@qmart.com", size: "—" },
];

/* ── Key Findings from Last Report ── */
const keyFindings = [
  { text: "Pune store outperforms chain avg by 18% in restock speed", type: "positive" },
  { text: "Nagpur-S losing ₹85K/mo from chronic dairy OOS", type: "critical" },
  { text: "Maggi Noodles 70g is #1 seller across all 5 stores", type: "info" },
  { text: "Overall chain compliance improved from 82% to 88.4%", type: "positive" },
  { text: "3 slow-moving SKUs recommended for delisting", type: "warning" },
];

const scheduledReports = [
  { name: "Monthly Store Report", target: "owner@qmart.com", freq: "1st of each month" },
  { name: "Chain Performance Summary", target: "owner@qmart.com", freq: "Every Monday 8 AM" },
  { name: "FMCG Partner Report", target: "Brand managers", freq: "End of quarter" },
  { name: "Manager Performance Report", target: "Store managers", freq: "15th of each month" },
];

const ReportGenerator = () => {
  const [selectedStore, setSelectedStore] = useState("All Stores");
  const [selectedReport, setSelectedReport] = useState("monthly");
  const [format, setFormat] = useState("pdf");
  const [generated, setGenerated] = useState(false);
  const [showScheduleForm, setShowScheduleForm] = useState(false);

  const now = new Date();
  const timestamp = now.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) + ", " + now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  const pages = previewPages[selectedReport] || previewPages.monthly;

  const aiSummary = selectedReport === "monthly"
    ? "In March 2026, Q-Mart chain recovered ₹4.2L in sales through Q100's shelf monitoring. Pune leads with 12 min avg restock time. Nagpur-S needs urgent attention — 42 empty shelves/day and 38 min restock speed are causing estimated ₹85K/month in lost sales."
    : selectedReport === "chain"
    ? "Across 5 stores, Q100 detected 4,410 empty shelves this month and restocked 95% within 15 minutes. Total additional revenue: ₹4.2L. Best performer: Pune. Needs attention: Nagpur-S."
    : selectedReport === "quarterly"
    ? "Q1 FY27: Q100 generated ₹12.6L in additional revenue across the chain. Sales uplift averaged +12%. The system paid for itself in 21 days. Annual projection: ₹50.4L additional revenue."
    : "Report summary will be AI-generated with actual data from the selected period and stores.";

  return (
    <div className="reg-screen">
      <div className="owner-timestamp">Data as of: {timestamp}</div>
      <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>Report Generator</h2>

      {/* Quick Insights Strip */}
      <div className="rg-insights-strip">
        {quickInsights.map((q, i) => (
          <div key={i} className="rg-insight-card">
            <div className="rg-insight-icon" style={{ background: q.bg, color: q.color }}>
              <q.icon size={18} weight="bold" />
            </div>
            <div className="rg-insight-body">
              <span className="rg-insight-label">{q.label}</span>
              <strong className="rg-insight-value">{q.value}</strong>
              <span className="rg-insight-sub">{q.sub}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="report-gen-body">
        {/* Config Panel */}
        <div className="rg-config">
          {/* Store Selection */}
          <div className="rg-section">
            <h4><MapPin size={14} weight="duotone" /> Store</h4>
            <select className="owner-select" value={selectedStore} onChange={(e) => setSelectedStore(e.target.value)}>
              {storeOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Report Type */}
          <div className="rg-section">
            <h4><ChartBar size={14} weight="duotone" /> Report Type</h4>
            <div className="rg-templates">
              {reportTypes.map(t => (
                <div key={t.id} className={`rg-template${selectedReport === t.id ? " selected" : ""}`} onClick={() => { setSelectedReport(t.id); setGenerated(false); }}>
                  <strong>{t.name}</strong>
                  <span>{t.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Format */}
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

          {/* Scheduled Reports */}
          <div className="rg-section">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h4><Clock size={14} weight="duotone" /> Auto-Schedule</h4>
              <button className="rg-add-sched-btn" onClick={() => setShowScheduleForm(!showScheduleForm)}>
                <Plus size={12} weight="bold" /> Add
              </button>
            </div>
            {showScheduleForm && (
              <div className="rg-sched-form">
                <input type="text" placeholder="Report name..." className="rg-sched-input" />
                <input type="email" placeholder="Send to email..." className="rg-sched-input" />
                <select className="rg-sched-input">
                  <option>1st of each month</option>
                  <option>Every Monday 8 AM</option>
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
                    <span style={{ fontSize: ".62rem", color: "#94a3b8" }}>Send to {s.target}</span>
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
              <span style={{ fontSize: ".68rem", color: "#94a3b8" }}>{selectedStore} · {reportTypes.find(r => r.id === selectedReport)?.name}</span>
            </div>
            <span style={{ fontSize: ".64rem", color: "#64748b", background: "#f1f5f9", padding: "4px 10px", borderRadius: 6, fontWeight: 700 }}>{pages.length} pages</span>
          </div>

          {/* AI Summary */}
          <div style={{ padding: "12px 14px", background: "linear-gradient(135deg, #eff6ff, #f0f9ff)", borderRadius: 10, border: "1px solid #bae6fd", marginBottom: 12 }}>
            <div style={{ fontSize: ".66rem", fontWeight: 700, color: "#1e40af", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 4 }}>AI-Generated Executive Summary</div>
            <p style={{ fontSize: ".72rem", color: "#1e3a8a", margin: 0, lineHeight: 1.55, fontWeight: 500 }}>{aiSummary}</p>
          </div>

          <div className="rg-preview-pages">
            {pages.map(p => (
              <div key={p.num} className="rg-page">
                <span className="rg-page-num">{p.num}</span>
                <div className="rg-page-body">
                  <strong>{p.title}</strong>
                  <span>{p.desc}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <button className="rg-gen-btn" style={{ flex: 1 }} onClick={() => setGenerated(true)}>
              {generated ? <><CheckCircle size={16} weight="fill" /> Report Generated!</> : <>Download {format.toUpperCase()} Report</>}
            </button>
            <button className="rg-gen-btn" style={{ flex: 1, background: "linear-gradient(135deg, #2563eb, #1d4ed8)" }} onClick={() => setGenerated(true)}>
              <Envelope size={16} weight="bold" /> Email Report
            </button>
          </div>
        </div>
      </div>

      {/* Key Findings from Last Report */}
      <div className="rg-findings-card">
        <h3><TrendUp size={16} weight="fill" style={{ color: "#059669" }} /> Key Findings — Last Report</h3>
        <div className="rg-findings-list">
          {keyFindings.map((f, i) => (
            <div key={i} className={`rg-finding-item rg-finding-${f.type}`}>
              <span className="rg-finding-dot" />
              <span className="rg-finding-text">{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recently Generated Reports */}
      <div className="rg-recent-card">
        <h3><Clock size={16} weight="fill" style={{ color: "#6366f1" }} /> Recently Generated Reports</h3>
        <div className="rg-recent-list">
          {recentReports.map((r, i) => (
            <div key={i} className="rg-recent-row">
              <div className={`rg-recent-icon ${r.format.toLowerCase()}`}>
                {r.format === "PDF" ? <FilePdf size={16} weight="fill" /> : r.format === "PPT" ? <Slideshow size={16} weight="fill" /> : <Envelope size={16} weight="fill" />}
              </div>
              <div className="rg-recent-body">
                <strong>{r.name}</strong>
                <span className="rg-recent-meta">{r.date} · {r.pages} pages · {r.size}</span>
                <span className="rg-recent-recip">Sent to: {r.recipients}</span>
              </div>
              <div className="rg-recent-right">
                <span className={`rg-recent-status rg-st-${r.status}`}>
                  {r.status === "sent" ? <><CheckCircle size={10} weight="fill" /> Sent</> :
                   r.status === "viewed" ? <><Eye size={10} weight="fill" /> Viewed</> :
                   <><Eye size={10} weight="fill" /> Opened</>}
                </span>
                <button className="rg-recent-dl"><DownloadSimple size={12} weight="bold" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ReportGenerator;
