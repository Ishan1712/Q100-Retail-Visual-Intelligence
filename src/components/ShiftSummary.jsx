import confetti from 'canvas-confetti';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Storefront, Warning, Package, CurrencyInr, Clock, Trophy,
  Sparkle, TrendUp, Star, ArrowRight, Target, GridNine,
  CheckCircle, Lightning, Crown,
} from '@phosphor-icons/react';
import Tooltip from './Tooltip';
import './ShiftSummary.css';

/* ═══════════════════════════════════════
   DUMMY DATA
   ═══════════════════════════════════════ */
const shiftData = {
  worker: 'Rahul M.',
  store: 'Q-Mart Kothrud, Pune',
  shelvesScanned: 10,
  shelvesTotal: 10,
  stats: [
    { icon: GridNine,     value: '10',      label: 'Shelves Scanned',  color: 'blue' },
    { icon: Warning,      value: '14',      label: 'OOS Detected',     color: 'amber' },
    { icon: Package,      value: '12',      label: 'Restocks Done',    color: 'green' },
    { icon: Clock,        value: '3h 22m',  label: 'Scan Time',        color: 'slate' },
    { icon: Trophy,       value: '5',       label: 'Full-Shelf Streak', color: 'rose' },
  ],
  salesSaved: '₹18,400',
  impact: `You prevented 14 empty shelves today. That's approximately ₹18,400 in sales that would have been lost. Your top catch: Parle-G 250g (Section 2, Shelf 7) — this product sells 22 units/day at this store.`,
  personalBest: {
    active: true,
    text: 'New record! 14 OOS catches — your previous best was 11',
  },
};

/* ═══════════════════════════════════════
   PROGRESS RING
   ═══════════════════════════════════════ */
const RING_SIZE = 160;
const STROKE = 12;
const RADIUS = (RING_SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function ProgressRing({ scanned, total }) {
  const pct = scanned / total;
  const percent = Math.round(pct * 100);
  return (
    <div className="ss-ring-wrap">
      <div className="ss-ring">
        <svg width="100%" height="100%" viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}>
          <defs>
            <linearGradient id="ssRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <filter id="ssRingGlow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle
            className="ss-ring-track"
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
          />
          <motion.circle
            className="ss-ring-progress"
            stroke="url(#ssRingGrad)"
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{ strokeDashoffset: CIRCUMFERENCE * (1 - pct) }}
            transition={{ duration: 1.4, ease: 'easeOut', delay: 0.3 }}
            filter="url(#ssRingGlow)"
            transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
          />
        </svg>
        <div className="ss-ring-label">
          <span className="ss-ring-value">{percent}%</span>
          <span className="ss-ring-caption">Complete</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   ANIMATION VARIANTS
   ═══════════════════════════════════════ */
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut', delay: i * 0.06 },
  }),
};

/* ═══════════════════════════════════════
   SHIFT SUMMARY COMPONENT
   ═══════════════════════════════════════ */
export default function ShiftSummary({ onClose }) {
  const d = shiftData;

  useEffect(() => {
    const t1 = setTimeout(() => {
      confetti({
        particleCount: 60, spread: 55,
        origin: { y: 0.25, x: 0.5 },
        colors: ['#10b981', '#fbbf24', '#f59e0b', '#059669', '#34d399'],
        ticks: 150, gravity: 1.0, scalar: 0.9,
      });
    }, 500);
    const t2 = setTimeout(() => {
      confetti({
        particleCount: 35, angle: 60, spread: 40,
        origin: { x: 0, y: 0.4 },
        colors: ['#fbbf24', '#f59e0b', '#d97706'],
        ticks: 120, gravity: 1.2, scalar: 0.7,
      });
      confetti({
        particleCount: 35, angle: 120, spread: 40,
        origin: { x: 1, y: 0.4 },
        colors: ['#10b981', '#059669', '#34d399'],
        ticks: 120, gravity: 1.2, scalar: 0.7,
      });
    }, 900);
    const t3 = setTimeout(() => {
      confetti({
        particleCount: 25, spread: 100,
        origin: { y: 0.1, x: 0.5 },
        colors: ['#fbbf24', '#fcd34d', '#fde68a'],
        shapes: ['star'], ticks: 180, gravity: 0.6, scalar: 1.1, drift: 0.5,
      });
    }, 1300);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div className="ss-page">
      <div className="ss-container">

        {/* ═══ Dark Hero Banner ═══ */}
        <motion.div className="ss-hero-banner" initial="hidden" animate="visible" variants={fadeUp}>
          {/* Decorative sparkles */}
          <div className="ss-sparkles">
            <Sparkle size={16} weight="fill" className="ss-sparkle s1" />
            <Sparkle size={12} weight="fill" className="ss-sparkle s2" />
            <Sparkle size={14} weight="fill" className="ss-sparkle s3" />
            <Sparkle size={10} weight="fill" className="ss-sparkle s4" />
            <Sparkle size={18} weight="fill" className="ss-sparkle s5" />
            <Sparkle size={11} weight="fill" className="ss-sparkle s6" />
          </div>

          <div className="ss-hero-trophy">
            <Trophy size={36} weight="fill" />
            <CheckCircle size={18} weight="fill" className="ss-trophy-check" />
          </div>
          <h1 className="ss-hero-title">Shift Complete!</h1>
          <p className="ss-hero-subtitle">
            Amazing work today, {d.worker}. All {d.shelvesTotal} shelves scanned and verified.
          </p>
          <div className="ss-hero-actions">
            <button className="ss-hero-btn ss-hero-btn-outline" onClick={onClose}>
              Sign Out
            </button>
            <button className="ss-hero-btn ss-hero-btn-solid">
              Review Shifts <ArrowRight size={14} weight="bold" />
            </button>
          </div>
        </motion.div>

        {/* ═══ Stats Grid with Progress Ring ═══ */}
        <div className="ss-stats-section">
          {/* Left: Progress Ring Card */}
          <motion.div className="ss-progress-card" initial="hidden" animate="visible" custom={2} variants={fadeUp}>
            <div className="ss-progress-label">Final Task Progress</div>
            <ProgressRing scanned={d.shelvesScanned} total={d.shelvesTotal} />
            <div className="ss-progress-note">
              <CheckCircle size={16} weight="fill" className="ss-note-icon" />
              <span>All shelves scanned. Restocks finalized.</span>
            </div>
          </motion.div>

          {/* Right: Stat Cards Grid */}
          <div className="ss-stat-grid">
            {d.stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div key={s.label} className={`ss-stat-card ss-stat--${s.color}`}
                  initial="hidden" animate="visible" custom={i + 3} variants={fadeUp}>
                  <div className={`ss-stat-icon ss-stat-icon--${s.color}`}>
                    <Icon size={20} weight="duotone" />
                  </div>
                  <div className="ss-stat-value">{s.value}</div>
                  <div className="ss-stat-label">{s.label}</div>
                </motion.div>
              );
            })}
            {/* Sales Saved — special card */}
            <motion.div className="ss-stat-card ss-stat--indigo ss-stat-sales"
              initial="hidden" animate="visible" custom={8} variants={fadeUp}>
              <div className="ss-stat-icon ss-stat-icon--indigo">
                <CurrencyInr size={20} weight="duotone" />
              </div>
              <div className="ss-stat-value">{d.salesSaved}</div>
              <div className="ss-stat-label">Sales Saved</div>
            </motion.div>
          </div>
        </div>

        {/* ═══ Personal Achievement ═══ */}
        {d.personalBest.active && (
          <motion.div className="ss-achievement" initial="hidden" animate="visible" custom={9} variants={fadeUp}>
            <div className="ss-achievement-badge">
              <Crown size={14} weight="fill" /> Personal Achievement
            </div>
            <p className="ss-achievement-text">
              <Star size={18} weight="fill" className="ss-achievement-star" />
              {d.personalBest.text}
            </p>
          </motion.div>
        )}

        {/* ═══ Impact Card ═══ */}
        <motion.div className="ss-impact" initial="hidden" animate="visible" custom={10} variants={fadeUp}>
          <div className="ss-impact-header">
            <div className="ss-impact-icon">
              <Target size={18} weight="bold" />
            </div>
            <span className="ss-impact-title">Your Impact Today</span>
          </div>
          <p className="ss-impact-text">{d.impact}</p>
        </motion.div>

        {/* ═══ End Shift Button ═══ */}
        <motion.button className="ss-end-btn" onClick={onClose}
          initial="hidden" animate="visible" custom={11} variants={fadeUp}
          whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.985 }}>
          End Shift <ArrowRight size={18} weight="bold" />
        </motion.button>

      </div>
    </div>
  );
}
