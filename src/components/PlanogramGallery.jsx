import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye, Crosshair, Clock, ArrowClockwise, ChartBar, Warning,
  CaretRight, X, ArrowLeft, Plus, Image, Tag, Hash, TextAa,
  ShoppingCart, Drop, Grains, CookingPot, Coffee, SprayBottle,
  Cookie, FirstAidKit, Sparkle, BowlFood, Leaf, Wine,
  Package, Broom, Gift, Cube, BeerBottle, Heart,
  Dog, Storefront, Pill, IceCream, Basket, Carrot, Baby, Barbell
} from "@phosphor-icons/react";
import "./PlanogramGallery.css";

import { allShelfSections } from "../data";

/* ── Icon registry: key → { component, bg, color } ── */
const iconRegistry = {
  cart:       { Icon: ShoppingCart, bg: "linear-gradient(135deg, #ecfdf5, #d1fae5)", color: "#059669", border: "#a7f3d0" },
  dairy:      { Icon: Drop,        bg: "linear-gradient(135deg, #eff6ff, #dbeafe)", color: "#2563eb", border: "#93c5fd" },
  grains:     { Icon: Grains,      bg: "linear-gradient(135deg, #fefce8, #fef9c3)", color: "#a16207", border: "#fde68a" },
  cooking:    { Icon: CookingPot,  bg: "linear-gradient(135deg, #fff1f2, #ffe4e6)", color: "#e11d48", border: "#fda4af" },
  beverage:   { Icon: Coffee,      bg: "linear-gradient(135deg, #fdf4ff, #fae8ff)", color: "#9333ea", border: "#d8b4fe" },
  cleaning:   { Icon: SprayBottle, bg: "linear-gradient(135deg, #ecfeff, #cffafe)", color: "#0891b2", border: "#67e8f9" },
  snacks:     { Icon: Cookie,      bg: "linear-gradient(135deg, #fff7ed, #ffedd5)", color: "#c2410c", border: "#fdba74" },
  health:     { Icon: FirstAidKit, bg: "linear-gradient(135deg, #fef2f2, #fee2e2)", color: "#dc2626", border: "#fca5a5" },
  care:       { Icon: Sparkle,     bg: "linear-gradient(135deg, #fdf4ff, #f5d0fe)", color: "#a21caf", border: "#e879f9" },
  breakfast:  { Icon: BowlFood,    bg: "linear-gradient(135deg, #f0fdf4, #dcfce7)", color: "#16a34a", border: "#86efac" },
  organic:    { Icon: Leaf,        bg: "linear-gradient(135deg, #ecfdf5, #d1fae5)", color: "#047857", border: "#6ee7b7" },
  wine:       { Icon: Wine,        bg: "linear-gradient(135deg, #fef2f2, #fce7f3)", color: "#be123c", border: "#fda4af" },
  package:    { Icon: Package,     bg: "linear-gradient(135deg, #f1f5f9, #e2e8f0)", color: "#475569", border: "#cbd5e1" },
  broom:      { Icon: Broom,       bg: "linear-gradient(135deg, #fefce8, #fef3c7)", color: "#92400e", border: "#fde68a" },
  gift:       { Icon: Gift,        bg: "linear-gradient(135deg, #eef2ff, #e0e7ff)", color: "#4f46e5", border: "#a5b4fc" },
  cube:       { Icon: Cube,        bg: "linear-gradient(135deg, #f8fafc, #f1f5f9)", color: "#64748b", border: "#e2e8f0" },
  bottle:     { Icon: BeerBottle,  bg: "linear-gradient(135deg, #fef9c3, #fef08a)", color: "#a16207", border: "#fde047" },
  heart:      { Icon: Heart,       bg: "linear-gradient(135deg, #fce7f3, #fbcfe8)", color: "#db2777", border: "#f9a8d4" },
  pet:        { Icon: Dog,         bg: "linear-gradient(135deg, #fff7ed, #fed7aa)", color: "#c2410c", border: "#fdba74" },
  store:      { Icon: Storefront,  bg: "linear-gradient(135deg, #ecfdf5, #d1fae5)", color: "#059669", border: "#a7f3d0" },
  pill:       { Icon: Pill,        bg: "linear-gradient(135deg, #eff6ff, #dbeafe)", color: "#2563eb", border: "#93c5fd" },
  icecream:   { Icon: IceCream,    bg: "linear-gradient(135deg, #fdf4ff, #fae8ff)", color: "#9333ea", border: "#d8b4fe" },
  basket:     { Icon: Basket,      bg: "linear-gradient(135deg, #ecfdf5, #d1fae5)", color: "#059669", border: "#a7f3d0" },
  carrot:     { Icon: Carrot,      bg: "linear-gradient(135deg, #fff7ed, #ffedd5)", color: "#ea580c", border: "#fb923c" },
  baby:       { Icon: Baby,        bg: "linear-gradient(135deg, #fdf4ff, #fae8ff)", color: "#c026d3", border: "#e879f9" },
  fitness:    { Icon: Barbell,     bg: "linear-gradient(135deg, #f1f5f9, #e2e8f0)", color: "#475569", border: "#94a3b8" },
};

const ShelfIcon = ({ iconKey, size = 18 }) => {
  const entry = iconRegistry[iconKey] || iconRegistry.package;
  const { Icon, bg, color, border } = entry;
  return (
    <div className="pc-icon-wrap" style={{ background: bg, borderColor: border }}>
      <Icon size={size} weight="duotone" color={color} />
    </div>
  );
};

const iconPickerOptions = [
  "cart", "dairy", "grains", "cooking", "beverage", "cleaning",
  "snacks", "health", "care", "breakfast", "organic", "wine",
  "package", "broom", "gift", "bottle", "pet", "icecream",
  "basket", "carrot", "baby", "fitness", "pill", "store",
];

const defaultShelfData = [
  { id: 1,  cat: "Checkout Impulse",     icon: "cart",      sections: 3, updated: "15 Mar 2026",  points: 18, compliance: 91.2, img: "/shelves/shelf1-checkout/shelf1S1(master).webp" },
  { id: 2,  cat: "Dairy & Frozen",       icon: "dairy",     sections: 5, updated: "1 Mar 2026",   points: 32, compliance: 76.8, img: "/shelves/shelf2-dairy/shelf2S1(master).webp", alert: "Planogram 24 days old. Mother Dairy new SKU (Curd 200g) — consider adding." },
  { id: 3,  cat: "Staples & Grains",     icon: "grains",    sections: 4, updated: "12 Jan 2026",  points: 24, compliance: 94.1, img: "/shelves/shelf3-staples/shelf3S1(master).webp" },
  { id: 4,  cat: "Cooking Oil & Masalas", icon: "cooking",   sections: 4, updated: "12 Jan 2026",  points: 22, compliance: 86.5, img: "/shelves/shelf4-cooking/shelf4S1(master).webp" },
  { id: 5,  cat: "Beverages",            icon: "beverage",  sections: 6, updated: "20 Mar 2026",  points: 38, compliance: 89.3, img: "/shelves/shelf5-beverages/shelf5S1(master).webp",
    history: [
      { date: "12 Jan 2026", note: "Initial setup" },
      { date: "8 Feb 2026", note: "Pepsi promotional bay added" },
      { date: "20 Mar 2026", note: "Coca-Cola end-cap refresh — replaced Thumbs Up with Coca-Cola Zero Sugar" },
    ]
  },
  { id: 6,  cat: "Household & Cleaning",  icon: "cleaning",  sections: 5, updated: "5 Feb 2026",  points: 30, compliance: 78.4, img: "/shelves/shelf3-staples/shelf3S1(master).webp" },
  { id: 7,  cat: "Snacks & Biscuits",    icon: "snacks",    sections: 6, updated: "12 Jan 2026",  points: 36, compliance: 82.7, img: "/shelves/shelf7-snacks/shelf7S1(master).webp" },
  { id: 8,  cat: "Baby & Health",        icon: "health",    sections: 4, updated: "12 Jan 2026",  points: 20, compliance: 92.8, img: "/shelves/shelf2-dairy/shelf2S3(master).webp" },
  { id: 9,  cat: "Personal Care",        icon: "care",      sections: 5, updated: "5 Feb 2026",   points: 28, compliance: 87.1, img: "/shelves/shelf1-checkout/shelf1S2(master).webp" },
  { id: 10, cat: "Breakfast & Cereals",  icon: "breakfast",  sections: 4, updated: "1 Mar 2026",   points: 26, compliance: 85.6, img: "/shelves/shelf3-staples/shelf3S2(master).webp" },
];

const compColor = (c) => c >= 90 ? "#16a34a" : c >= 80 ? "#059669" : c >= 70 ? "#f59e0b" : "#ef4444";

const today = () => {
  const d = new Date();
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

const PlanogramGallery = () => {
  const [shelves, setShelves] = useState(defaultShelfData);
  const [customSections, setCustomSections] = useState({});
  const [selected, setSelected] = useState(null);
  const [showPoints, setShowPoints] = useState(false);
  const [showAddShelf, setShowAddShelf] = useState(false);
  const [showAddSection, setShowAddSection] = useState(false);

  // Add shelf form
  const [newShelfCat, setNewShelfCat] = useState("");
  const [newShelfIcon, setNewShelfIcon] = useState("package");
  const [newShelfImg, setNewShelfImg] = useState(null);
  const [newShelfImgPreview, setNewShelfImgPreview] = useState("");

  // Add section form
  const [newSecName, setNewSecName] = useState("");
  const [newSecDesc, setNewSecDesc] = useState("");
  const [newSecImg, setNewSecImg] = useState(null);
  const [newSecImgPreview, setNewSecImgPreview] = useState("");

  const shelf = selected ? shelves.find(a => a.id === selected) : null;

  const getSections = (shelfId) => {
    const dataSections = allShelfSections[shelfId] || [];
    const custom = customSections[shelfId] || [];
    return [...dataSections, ...custom];
  };

  const handleShelfImgChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewShelfImg(file);
      setNewShelfImgPreview(URL.createObjectURL(file));
    }
  };

  const handleSecImgChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewSecImg(file);
      setNewSecImgPreview(URL.createObjectURL(file));
    }
  };

  const handleAddShelf = () => {
    if (!newShelfCat.trim()) return;
    const newId = Math.max(...shelves.map(s => s.id)) + 1;
    const newShelf = {
      id: newId,
      cat: newShelfCat.trim(),
      icon: newShelfIcon,
      sections: 0,
      updated: today(),
      points: 0,
      compliance: 0,
      img: newShelfImgPreview || "/shelves/shelf3-staples/shelf3S1(master).webp",
      isNew: true,
    };
    setShelves(prev => [...prev, newShelf]);
    setNewShelfCat("");
    setNewShelfIcon("package");
    setNewShelfImg(null);
    setNewShelfImgPreview("");
    setShowAddShelf(false);
  };

  const handleAddSection = () => {
    if (!newSecName.trim() || !selected) return;
    const existingSections = getSections(selected);
    const newSec = {
      id: `custom-${Date.now()}`,
      name: newSecName.trim(),
      description: newSecDesc.trim(),
      icon: "package",
      masterImage: newSecImgPreview || "/shelves/shelf3-staples/shelf3S1(master).webp",
      isNew: true,
    };
    setCustomSections(prev => ({
      ...prev,
      [selected]: [...(prev[selected] || []), newSec],
    }));
    setShelves(prev => prev.map(s =>
      s.id === selected
        ? { ...s, sections: existingSections.length + 1, points: s.points + 6, updated: today() }
        : s
    ));
    setNewSecName("");
    setNewSecDesc("");
    setNewSecImg(null);
    setNewSecImgPreview("");
    setShowAddSection(false);
  };

  return (
    <div className="plano-screen">
      <AnimatePresence mode="wait">
        {!selected ? (
          <motion.div key="gallery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="plano-gallery">
            <div className="plano-header">
              <div>
                <h2>Planogram Gallery</h2>
                <span className="plano-sub">Master shelf layouts — the source of truth for AI comparison</span>
              </div>
              <button className="pg-add-shelf-btn" onClick={() => setShowAddShelf(true)}>
                <Plus size={15} weight="bold" /> Add New Shelf
              </button>
            </div>
            <div className="plano-grid">
              {shelves.map((a, i) => (
                <motion.div key={a.id} className="plano-card"
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(0,0,0,.08)" }}
                  onClick={() => setSelected(a.id)}
                >
                  <div className="pc-img-wrap">
                    <img src={a.img} alt={a.cat} className="pc-img" loading="lazy" />
                    <span className="pc-sections">{a.isNew ? getSections(a.id).length : a.sections} sections</span>
                    {a.isNew && <span className="pc-new-badge">NEW</span>}
                  </div>
                  <div className="pc-body">
                    <div className="pc-top-row">
                      <ShelfIcon iconKey={a.icon} size={16} />
                      <span className="pc-shelf">Shelf {a.id}</span>
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
                <ShelfIcon iconKey={shelf.icon} size={22} />
                <div>
                  <h2>Shelf {shelf.id} — {shelf.cat}</h2>
                  <span className="pd-meta">{getSections(shelf.id).length} sections · {shelf.points} detection points · Updated {shelf.updated}</span>
                </div>
              </div>
              <div className="pd-actions">
                <button className={`plano-toggle${showPoints ? " active" : ""}`} onClick={() => setShowPoints(!showPoints)}>
                  <Eye size={14} weight="duotone" /> {showPoints ? "Hide" : "Show"} Detection Points
                </button>
              </div>
            </div>

            {/* Section Grid */}
            <div className="pd-sections">
              {getSections(shelf.id).map((sec) => (
                <div key={sec.id} className={`pd-section-card${sec.isNew ? " pd-section-new" : ""}`}>
                  <div className="pds-img-wrap">
                    <img src={sec.masterImage} alt={sec.name} className="pds-img" loading="lazy" />
                    {sec.isNew && <span className="pds-new-badge">NEW</span>}
                    {showPoints && !sec.isNew && (
                      <div className="pds-points">
                        {Array.from({ length: Math.floor(shelf.points / Math.max(shelf.sections, 1)) }, (_, j) => (
                          <span key={j} className="pds-dot" style={{
                            left: `${15 + (j * 60 / (shelf.points / Math.max(shelf.sections, 1)))}%`,
                            top: `${25 + ((j % 3) * 25)}%`
                          }}>{j + 1}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="pds-label">{sec.name}</div>
                </div>
              ))}

              {/* Add Section Card */}
              <motion.div className="pd-section-card pd-add-section-card"
                whileHover={{ y: -2, boxShadow: "0 4px 16px rgba(5,150,105,.12)" }}
                onClick={() => setShowAddSection(true)}
              >
                <div className="pds-add-content">
                  <div className="pds-add-icon">
                    <Plus size={24} weight="bold" />
                  </div>
                  <span className="pds-add-label">Add Section</span>
                  <span className="pds-add-sub">Upload master image</span>
                </div>
              </motion.div>
            </div>

            {/* Version History */}
            {shelf.history && (
              <div className="pd-history">
                <h3><Clock size={15} weight="duotone" /> Version History</h3>
                <div className="pd-timeline">
                  {shelf.history.map((h, i) => (
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
              <strong style={{ color: compColor(shelf.compliance) }}>{shelf.compliance}%</strong>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ Add New Shelf Modal ═══ */}
      <AnimatePresence>
        {showAddShelf && (
          <motion.div className="pg-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowAddShelf(false)}>
            <motion.div className="pg-modal" initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}>
              <div className="pg-modal-header">
                <div className="pg-modal-title-row">
                  <div className="pg-modal-icon"><Plus size={18} weight="bold" /></div>
                  <div>
                    <h3>Add New Shelf</h3>
                    <span>Create a new shelf planogram entry</span>
                  </div>
                </div>
                <button className="pg-modal-close" onClick={() => setShowAddShelf(false)}><X size={18} /></button>
              </div>
              <div className="pg-modal-body">
                <div className="pg-field">
                  <label><Tag size={13} /> Category Name</label>
                  <input type="text" placeholder="e.g. Frozen Foods, Pet Care..." value={newShelfCat} onChange={e => setNewShelfCat(e.target.value)} />
                </div>
                <div className="pg-field">
                  <label><Hash size={13} /> Shelf Icon</label>
                  <div className="pg-icon-grid">
                    {iconPickerOptions.map(key => {
                      const entry = iconRegistry[key];
                      if (!entry) return null;
                      const { Icon, bg, color, border } = entry;
                      return (
                        <button key={key} className={`pg-icon-opt${newShelfIcon === key ? " active" : ""}`}
                          onClick={() => setNewShelfIcon(key)}
                          style={newShelfIcon === key ? { background: bg, borderColor: color } : {}}
                        >
                          <Icon size={20} weight="duotone" color={newShelfIcon === key ? color : "#64748b"} />
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="pg-field">
                  <label><Image size={13} /> Cover Image</label>
                  <div className="pg-upload-area">
                    {newShelfImgPreview ? (
                      <div className="pg-upload-preview">
                        <img src={newShelfImgPreview} alt="preview" />
                        <button className="pg-upload-remove" onClick={() => { setNewShelfImg(null); setNewShelfImgPreview(""); }}>
                          <X size={12} weight="bold" />
                        </button>
                      </div>
                    ) : (
                      <label className="pg-upload-empty">
                        <Image size={28} weight="duotone" />
                        <span>Click to upload shelf image</span>
                        <span className="pg-upload-hint">JPG, PNG up to 5MB</span>
                        <input type="file" accept="image/*" onChange={handleShelfImgChange} hidden />
                      </label>
                    )}
                  </div>
                </div>
              </div>
              <div className="pg-modal-footer">
                <button className="pg-modal-cancel" onClick={() => setShowAddShelf(false)}>Cancel</button>
                <button className="pg-modal-submit" onClick={handleAddShelf} disabled={!newShelfCat.trim()}>
                  <Plus size={14} weight="bold" /> Add Shelf
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ Add New Section Modal ═══ */}
      <AnimatePresence>
        {showAddSection && (
          <motion.div className="pg-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowAddSection(false)}>
            <motion.div className="pg-modal" initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}>
              <div className="pg-modal-header">
                <div className="pg-modal-title-row">
                  <div className="pg-modal-icon pg-modal-icon-section"><Plus size={18} weight="bold" /></div>
                  <div>
                    <h3>Add New Section</h3>
                    <span>Add a section to Shelf {shelf?.id} — {shelf?.cat}</span>
                  </div>
                </div>
                <button className="pg-modal-close" onClick={() => setShowAddSection(false)}><X size={18} /></button>
              </div>
              <div className="pg-modal-body">
                <div className="pg-field">
                  <label><Tag size={13} /> Section Name</label>
                  <input type="text" placeholder="e.g. Top Shelf, Eye Level, Promo Bay..." value={newSecName} onChange={e => setNewSecName(e.target.value)} />
                </div>
                <div className="pg-field">
                  <label><TextAa size={13} /> Description</label>
                  <textarea placeholder="e.g. Contains premium snacks and branded items on eye-level shelf..." value={newSecDesc} onChange={e => setNewSecDesc(e.target.value)} rows={3} />
                </div>
                <div className="pg-field">
                  <label><Image size={13} /> Master Image</label>
                  <div className="pg-upload-area">
                    {newSecImgPreview ? (
                      <div className="pg-upload-preview">
                        <img src={newSecImgPreview} alt="preview" />
                        <button className="pg-upload-remove" onClick={() => { setNewSecImg(null); setNewSecImgPreview(""); }}>
                          <X size={12} weight="bold" />
                        </button>
                      </div>
                    ) : (
                      <label className="pg-upload-empty">
                        <Image size={28} weight="duotone" />
                        <span>Click to upload master image</span>
                        <span className="pg-upload-hint">JPG, PNG up to 5MB</span>
                        <input type="file" accept="image/*" onChange={handleSecImgChange} hidden />
                      </label>
                    )}
                  </div>
                </div>
              </div>
              <div className="pg-modal-footer">
                <button className="pg-modal-cancel" onClick={() => setShowAddSection(false)}>Cancel</button>
                <button className="pg-modal-submit pg-modal-submit-section" onClick={handleAddSection} disabled={!newSecName.trim()}>
                  <Plus size={14} weight="bold" /> Add Section
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlanogramGallery;
