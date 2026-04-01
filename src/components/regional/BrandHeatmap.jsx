import React, { useState } from "react";
import { Warning, TrendUp, TrendDown, Minus, Eye, EyeSlash } from "@phosphor-icons/react";
import "./Regional.css";

const categories = ["Dairy","Staples","Beverages","Snacks","Personal Care","Household","Cooking","Breakfast","Baby","Impulse"];
const storeNames = ["Pune","Mumbai","Nashik","Nagpur","Aurangabad"];
const data = {
  Pune:       [91,96,92,84,90,82,89,88,95,93],
  Mumbai:     [82,92,88,86,88,78,86,84,92,90],
  Nashik:     [78,90,86,82,84,76,84,80,90,86],
  Nagpur:     [74,88,82,80,80,72,80,78,88,82],
  Aurangabad: [68,86,78,76,76,66,78,74,84,78],
};

const momChanges = {
  Pune:       [0,0,0,4,0,0,0,0,0,0],
  Mumbai:     [0,0,0,0,0,0,0,0,0,0],
  Nashik:     [0,0,0,0,0,0,0,0,0,0],
  Nagpur:     [0,0,0,0,0,0,0,0,0,0],
  Aurangabad: [-5,0,0,0,0,-6,0,0,0,0],
};

const cellColor = (v) => v >= 95 ? "hm-darkgreen" : v >= 85 ? "hm-green" : v >= 75 ? "hm-amber" : v >= 70 ? "hm-red" : "hm-deepred";

const supplierAlert = "Dairy compliance dropped at 4 of 5 stores this week (Pune: -2%, Mumbai: -4%, Nashik: -3%, Aurangabad: -5%). Mother Dairy distribution disruption confirmed — delivery truck breakdown on Pune-Mumbai route on March 22. Expected resolution: March 27.";

const drillDownData = {
  "Pune-Dairy": { aisle: 2, sections: ["Milk & Curd (94%)", "Butter & Cheese (90%)", "Yogurt & Lassi (88%)"], note: "Strong dairy compliance — first-scan-first-restock rule in effect." },
  "Aurangabad-Dairy": { aisle: 2, sections: ["Milk & Curd (62%)", "Butter & Cheese (70%)", "Yogurt & Lassi (72%)"], note: "Mother Dairy Curd 400g frequently OOS. Delivery delays from Pune-Mumbai route." },
  "Aurangabad-Household": { aisle: 6, sections: ["Detergents (60%)", "Cleaners (68%)", "Dishwash (70%)"], note: "Surf Excel 1kg and Harpic 500ml inconsistent supply from HUL Nagpur depot." },
  "Nagpur-Household": { aisle: 6, sections: ["Detergents (70%)", "Cleaners (72%)", "Dishwash (74%)"], note: "Storeroom bottleneck — only 2 workers, restock SLA 21 min." },
};

const BrandHeatmap = () => {
  const [showMoM, setShowMoM] = useState(false);
  const [drillDown, setDrillDown] = useState(null);

  const catAvg = categories.map((_, ci) => {
    const sum = storeNames.reduce((s, sn) => s + data[sn][ci], 0);
    return Math.round(sum / storeNames.length * 10) / 10;
  });
  const worstIdx = catAvg.indexOf(Math.min(...catAvg));
  const bestIdx = catAvg.indexOf(Math.max(...catAvg));

  return (
    <div className="reg-screen">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: -4 }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>Brand Standards Heatmap</h2>
        <button className={`mom-toggle${showMoM ? " active" : ""}`} onClick={() => setShowMoM(!showMoM)}>
          {showMoM ? <EyeSlash size={13} /> : <Eye size={13} />} Month-over-Month
        </button>
      </div>

      <div className="reg-card" style={{ overflowX: "auto" }}>
        <table className="hm-grid-table">
          <thead>
            <tr>
              <th>Store</th>
              {categories.map(c => <th key={c}>{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {storeNames.map(sn => (
              <tr key={sn}>
                <td className="hm-store">{sn}</td>
                {data[sn].map((v, ci) => {
                  const change = momChanges[sn]?.[ci] || 0;
                  return (
                    <td key={ci}>
                      <span className={`hm-cell ${cellColor(v)}${drillDown === `${sn}-${categories[ci]}` ? " hm-cell-active" : ""}`}
                        style={{ cursor: "pointer" }}
                        onClick={() => setDrillDown(drillDown === `${sn}-${categories[ci]}` ? null : `${sn}-${categories[ci]}`)}>
                        {v}%
                        {showMoM && change !== 0 && (
                          <span style={{ marginLeft: 2, fontSize: ".5rem" }}>
                            {change > 0 ? <TrendUp size={9} weight="bold" style={{ color: "#16a34a" }} /> : <TrendDown size={9} weight="bold" style={{ color: "#ef4444" }} />}
                          </span>
                        )}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
            {/* Category Risk Score */}
            <tr className="cat-risk-row">
              <td className="hm-store" style={{ fontWeight: 800 }}>Chain Avg</td>
              {catAvg.map((v, i) => (
                <td key={i}>
                  <span className={`hm-cell cat-risk-val ${cellColor(v)}`} style={{ fontWeight: 900 }}>
                    {v}%
                    {i === worstIdx && <span style={{ marginLeft: 3, fontSize: ".5rem", color: "#dc2626" }}>RISK</span>}
                    {i === bestIdx && <span style={{ marginLeft: 3, fontSize: ".5rem", color: "#16a34a" }}>BEST</span>}
                  </span>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Drill-Down Panel */}
      {drillDown && (() => {
        const dd = drillDownData[drillDown];
        const [store, cat] = drillDown.split("-");
        return (
          <div className="hm-drilldown">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <strong style={{ fontSize: ".82rem", color: "#0f172a" }}>{store} — {cat} Breakdown</strong>
              <button onClick={() => setDrillDown(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: ".7rem", fontWeight: 700 }}>Close ✕</button>
            </div>
            {dd ? (
              <>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                  {dd.sections.map((s, i) => (
                    <span key={i} style={{ padding: "5px 12px", borderRadius: 8, background: "#f1f5f9", fontSize: ".72rem", fontWeight: 600, color: "#334155" }}>Aisle {dd.aisle} · {s}</span>
                  ))}
                </div>
                <p style={{ fontSize: ".7rem", color: "#64748b", margin: 0, lineHeight: 1.5 }}>{dd.note}</p>
              </>
            ) : (
              <p style={{ fontSize: ".72rem", color: "#94a3b8", margin: 0 }}>Compliance at {data[store][categories.indexOf(cat)]}% — click specific sections in the manager dashboard for photo evidence.</p>
            )}
          </div>
        );
      })()}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div className="spotlight-card">
          <div className="spotlight-header"><TrendUp size={15} weight="fill" /> Chain Strength: {categories[bestIdx]} ({catAvg[bestIdx]}%)</div>
          <p className="spotlight-text">Stable supply, low velocity variance, large pack sizes easy to detect. Consistent across all stores.</p>
        </div>
        <div className="redflag-card">
          <div className="redflag-header"><Warning size={15} weight="fill" /> Chain Risk: {categories[worstIdx]} ({catAvg[worstIdx]}%)</div>
          <p className="redflag-text">Surf Excel 1kg and Harpic 500ml are high-velocity SKUs with inconsistent supply from HUL's Nagpur depot.</p>
        </div>
      </div>

      {/* Supplier Alert */}
      <div className="supplier-alert">
        <div className="supplier-alert-header"><Warning size={15} weight="fill" /> Supplier Alert — Dairy</div>
        <p className="supplier-alert-text">{supplierAlert}</p>
      </div>
    </div>
  );
};

export default BrandHeatmap;
