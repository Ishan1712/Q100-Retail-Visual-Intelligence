import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye, Crosshair, Clock, ArrowClockwise, ChartBar, Warning,
  CaretRight, X, ArrowLeft
} from "@phosphor-icons/react";
import "./PlanogramGallery.css";

const aisleData = [
  { id: 1,  cat: "Checkout Impulse",     icon: "🛒", sections: 3, updated: "15 Mar 2026",  points: 18, compliance: 91.2, img: "https://upload.wikimedia.org/wikipedia/commons/7/76/Tesco_Supermarket_%28Cakes_%26_Biscuits%29.jpg" },
  { id: 2,  cat: "Dairy & Frozen",       icon: "🥛", sections: 5, updated: "1 Mar 2026",   points: 32, compliance: 76.8, img: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Tesco_Supermarket_%28Crisps%29.jpg", alert: "Planogram 24 days old. Mother Dairy new SKU (Curd 200g) — consider adding." },
  { id: 3,  cat: "Staples & Grains",     icon: "🌾", sections: 4, updated: "12 Jan 2026",  points: 24, compliance: 94.1, img: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Extra_%28Coop_supermarket%29_Bergen_Storsenter_Norway_2017-11-16_snacks_aisle.jpg" },
  { id: 4,  cat: "Cooking Oil & Masalas", icon: "🫙", sections: 4, updated: "12 Jan 2026",  points: 22, compliance: 86.5, img: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Potato_Chip_Aisle.jpg" },
  { id: 5,  cat: "Beverages",            icon: "🍼", sections: 6, updated: "20 Mar 2026",  points: 38, compliance: 89.3, img: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Tesco_Supermarket_%28Confectionery%29.jpg",
    history: [
      { date: "12 Jan 2026", note: "Initial setup" },
      { date: "8 Feb 2026", note: "Pepsi promotional bay added" },
      { date: "20 Mar 2026", note: "Coca-Cola end-cap refresh — replaced Thumbs Up with Coca-Cola Zero Sugar" },
    ]
  },
  { id: 6,  cat: "Household & Cleaning",  icon: "🧴", sections: 5, updated: "5 Feb 2026",  points: 30, compliance: 78.4, img: "https://upload.wikimedia.org/wikipedia/commons/7/76/Tesco_Supermarket_%28Cakes_%26_Biscuits%29.jpg" },
  { id: 7,  cat: "Snacks & Biscuits",    icon: "🍪", sections: 6, updated: "12 Jan 2026",  points: 36, compliance: 82.7, img: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Tesco_Supermarket_%28Crisps%29.jpg" },
  { id: 8,  cat: "Baby & Health",        icon: "🩺", sections: 4, updated: "12 Jan 2026",  points: 20, compliance: 92.8, img: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Tesco_Supermarket_%28Confectionery%29.jpg" },
  { id: 9,  cat: "Personal Care",        icon: "🧼", sections: 5, updated: "5 Feb 2026",   points: 28, compliance: 87.1, img: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Extra_%28Coop_supermarket%29_Bergen_Storsenter_Norway_2017-11-16_snacks_aisle.jpg" },
  { id: 10, cat: "Breakfast & Cereals",  icon: "🥣", sections: 4, updated: "1 Mar 2026",   points: 26, compliance: 85.6, img: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Potato_Chip_Aisle.jpg" },
];

const compColor = (c) => c >= 90 ? "#16a34a" : c >= 80 ? "#059669" : c >= 70 ? "#f59e0b" : "#ef4444";

const PlanogramGallery = () => {
  const [selected, setSelected] = useState(null);
  const [showPoints, setShowPoints] = useState(false);
  const aisle = selected ? aisleData.find(a => a.id === selected) : null;

  return (
    <div className="plano-screen">
      <AnimatePresence mode="wait">
        {!selected ? (
          <motion.div key="gallery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="plano-gallery">
            <div className="plano-header">
              <h2>Planogram Gallery</h2>
              <span className="plano-sub">Master shelf layouts — the source of truth for AI comparison</span>
            </div>
            <div className="plano-grid">
              {aisleData.map((a, i) => (
                <motion.div key={a.id} className="plano-card"
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(0,0,0,.08)" }}
                  onClick={() => setSelected(a.id)}
                >
                  <div className="pc-img-wrap">
                    <img src={a.img} alt={a.cat} className="pc-img" />
                    <span className="pc-sections">{a.sections} sections</span>
                  </div>
                  <div className="pc-body">
                    <div className="pc-top-row">
                      <span className="pc-icon">{a.icon}</span>
                      <span className="pc-aisle">Aisle {a.id}</span>
                      {a.alert && <Warning size={14} weight="fill" className="pc-alert-icon" />}
                    </div>
                    <strong className="pc-cat">{a.cat}</strong>
                    <div className="pc-meta">
                      <span><Crosshair size={11} weight="duotone" /> {a.points} points</span>
                      <span><Clock size={11} weight="duotone" /> {a.updated}</span>
                    </div>
                    <div className="pc-compliance-bar">
                      <div className="pc-bar-track">
                        <div className="pc-bar-fill" style={{ width: `${a.compliance}%`, background: compColor(a.compliance) }} />
                      </div>
                      <span className="pc-comp-val" style={{ color: compColor(a.compliance) }}>{a.compliance}%</span>
                    </div>
                    {a.alert && <div className="pc-alert">{a.alert}</div>}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="detail" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="plano-detail">
            <button className="plano-back" onClick={() => setSelected(null)}>
              <ArrowLeft size={15} weight="bold" /> Back to Gallery
            </button>
            <div className="pd-header">
              <div className="pd-title-row">
                <span className="pd-icon">{aisle.icon}</span>
                <div>
                  <h2>Aisle {aisle.id} — {aisle.cat}</h2>
                  <span className="pd-meta">{aisle.sections} sections · {aisle.points} detection points · Updated {aisle.updated}</span>
                </div>
              </div>
              <div className="pd-actions">
                <button className={`plano-toggle${showPoints ? " active" : ""}`} onClick={() => setShowPoints(!showPoints)}>
                  <Eye size={14} weight="duotone" /> {showPoints ? "Hide" : "Show"} Detection Points
                </button>
                <button className="plano-update-btn"><ArrowClockwise size={14} weight="bold" /> Request Update</button>
              </div>
            </div>

            {/* Section Grid */}
            <div className="pd-sections">
              {Array.from({ length: aisle.sections }, (_, i) => (
                <div key={i} className="pd-section-card">
                  <div className="pds-img-wrap">
                    <img src={aisle.img} alt={`Section ${i + 1}`} className="pds-img" />
                    {showPoints && (
                      <div className="pds-points">
                        {Array.from({ length: Math.floor(aisle.points / aisle.sections) }, (_, j) => (
                          <span key={j} className="pds-dot" style={{
                            left: `${15 + (j * 60 / (aisle.points / aisle.sections))}%`,
                            top: `${25 + ((j % 3) * 25)}%`
                          }}>{j + 1}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="pds-label">Section {i + 1}</div>
                </div>
              ))}
            </div>

            {/* Version History */}
            {aisle.history && (
              <div className="pd-history">
                <h3><Clock size={15} weight="duotone" /> Version History</h3>
                <div className="pd-timeline">
                  {aisle.history.map((h, i) => (
                    <div key={i} className="pd-tl-item">
                      <span className="pd-tl-dot" />
                      <span className="pd-tl-date">{h.date}</span>
                      <span className="pd-tl-note">{h.note}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Compliance Badge */}
            <div className="pd-comp">
              <ChartBar size={15} weight="duotone" />
              <span>30-Day Avg Compliance:</span>
              <strong style={{ color: compColor(aisle.compliance) }}>{aisle.compliance}%</strong>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlanogramGallery;
