import React, { useState, useMemo } from "react";
import { Lightning, Storefront, TrendUp, CheckCircle, MapPin } from "@phosphor-icons/react";
import "./Regional.css";

const defaults = { name: "Q-Mart City Centre, Solapur", sqft: 5800, aisles: 8, footfall: 1200, oosRate: 18, storeroomStaff: 2, brandPartners: 4 };

const OnboardingSimulator = () => {
  const [form, setForm] = useState(defaults);
  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const proj = useMemo(() => {
    const scale = form.sqft / 6000;
    const m1 = Math.round(72 * Math.min(scale, 1.1));
    const m3 = Math.round(80 * Math.min(scale, 1.1));
    const m6 = Math.round(86 * Math.min(scale, 1.1));
    const rev = Math.round(190000 * scale);
    const breakEven = Math.max(7, Math.round(14 / scale));
    const tradeIncome = Math.round(65000 * (form.brandPartners / 4));
    const annual = Math.round(rev * 12 - 45000 * 12);
    return { m1: Math.min(m1, 75), m3: Math.min(m3, 84), m6: Math.min(m6, 90), rev, breakEven, tradeIncome, annual };
  }, [form]);

  return (
    <div className="reg-screen">
      <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>New Store Onboarding Simulator</h2>
      <p style={{ fontSize: ".76rem", color: "#64748b", margin: 0 }}>Visualise the ROI of adding a new store to Q100</p>

      <div className="sim-body">
        {/* Input Panel */}
        <div className="reg-card">
          <h3><Storefront size={16} weight="duotone" /> Store Configuration</h3>
          <div className="sim-inputs">
            <div className="sim-field">
              <label>Store Name</label>
              <input value={form.name} onChange={e => update("name", e.target.value)} />
            </div>
            <div className="sim-field">
              <label>Store Size (sq ft)</label>
              <input type="number" value={form.sqft} onChange={e => update("sqft", +e.target.value)} />
            </div>
            <div className="sim-field">
              <label>Number of Aisles</label>
              <input type="number" value={form.aisles} onChange={e => update("aisles", +e.target.value)} />
            </div>
            <div className="sim-field">
              <label>Daily Footfall</label>
              <input type="number" value={form.footfall} onChange={e => update("footfall", +e.target.value)} />
            </div>
            <div className="sim-field">
              <label>Estimated OOS Rate (%)</label>
              <input type="number" value={form.oosRate} onChange={e => update("oosRate", +e.target.value)} />
            </div>
            <div className="sim-field">
              <label>Storeroom Workers</label>
              <input type="number" value={form.storeroomStaff} onChange={e => update("storeroomStaff", +e.target.value)} />
            </div>
            <div className="sim-field">
              <label>FMCG Brand Partnerships</label>
              <input type="number" value={form.brandPartners} onChange={e => update("brandPartners", +e.target.value)} />
            </div>
          </div>
        </div>

        {/* Projections */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Compliance Timeline */}
          <div className="reg-card">
            <h3><TrendUp size={16} weight="fill" /> Projected Compliance Ramp-Up</h3>
            <div className="sim-timeline">
              <div className="sim-tl-step">
                <div className="sim-tl-dot" />
                <span className="sim-tl-val">{proj.m1}%</span>
                <span className="sim-tl-label">Month 1</span>
              </div>
              <div className="sim-tl-step">
                <div className="sim-tl-dot" style={{ background: "#34d399" }} />
                <span className="sim-tl-val">{proj.m3}%</span>
                <span className="sim-tl-label">Month 3</span>
              </div>
              <div className="sim-tl-step">
                <div className="sim-tl-dot" style={{ background: "#059669" }} />
                <span className="sim-tl-val">{proj.m6}%</span>
                <span className="sim-tl-label">Month 6</span>
              </div>
            </div>
          </div>

          {/* Key Projections */}
          <div className="sim-projections">
            <div className="sim-proj-card highlight">
              <strong>₹{(proj.rev / 100000).toFixed(1)}L</strong>
              <span>Monthly Revenue by Month 6</span>
            </div>
            <div className="sim-proj-card">
              <strong>Week {Math.ceil(proj.breakEven / 7)}</strong>
              <span>Break-Even Point</span>
            </div>
            <div className="sim-proj-card">
              <strong>₹{(proj.tradeIncome / 1000).toFixed(0)}K/qtr</strong>
              <span>Trade Marketing Unlocked</span>
            </div>
            <div className="sim-proj-card highlight">
              <strong>₹{(proj.annual / 100000).toFixed(1)}L</strong>
              <span>Annual Net Benefit</span>
            </div>
          </div>

          {/* Subscription Cost */}
          <div className="reg-card" style={{ textAlign: "center" }}>
            <div style={{ fontSize: ".66rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".06em" }}>Q100 Subscription</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#0f172a" }}>₹45,000<span style={{ fontSize: ".82rem", color: "#64748b", fontWeight: 600 }}>/month</span></div>
          </div>

          {/* Comparison */}
          <div className="sim-comparison">
            <p>
              <strong>Aurangabad</strong> (closest comparable at 6,000 sq ft) reached 79% compliance at Month 5 with ongoing staffing challenges.
              <strong> {form.name}</strong> is projected to reach {proj.m6}% by Month 6 due to the improved onboarding playbook and Pune-trained staff trainer deployment.
            </p>
          </div>

          <button className="sim-cta">
            <MapPin size={18} weight="bold" style={{ marginRight: 6 }} />
            Request Onboarding for {form.name.split(",")[0]}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingSimulator;
