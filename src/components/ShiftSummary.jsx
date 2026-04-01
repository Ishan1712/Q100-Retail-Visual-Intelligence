import confetti from 'canvas-confetti';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Storefront, Warning, Package, CurrencyInr, Clock, Trophy,
  Sparkle, TrendUp, Star, X, ArrowRight, Target, GridNine,
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
    { icon: CurrencyInr,  value: '₹18,400', label: 'Sales Saved',     color: 'indigo' },
    { icon: Clock,        value: '3h 22m',  label: 'Scan Time',        color: 'slate' },
    { icon: Trophy,       value: '5',       label: 'Full-Shelf Streak', color: 'rose' },
  ],
  impact: `You prevented 14 empty shelves today. That's approximately ₹18,400 in sales that would have been lost. Your top catch: Parle-G 250g (Section 2, Shelf 7) — this product sells 22 units/day at this store.`,
  personalBest: {
    active: true,
    text: 'New record! 14 OOS catches — your previous best was 11',
  },
};

/* ═══════════════════════════════════════
   PROGRESS RING
   ═══════════════════════════════════════ */
const RING_SIZE = 140;
const STROKE = 10;
const RADIUS = (RING_SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function ProgressRing({ scanned, total }) {
  const pct = scanned / total;
  const isComplete = scanned === total;
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
              <feGaussianBlur stdDeviation="3" result="blur" />
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
          {isComplete ? (
            <CheckCircle size={28} weight="fill" className="ss-ring-check" />
          ) : null}
          <span className="ss-ring-value">{scanned}/{total}</span>
          <span className="ss-ring-caption">Shelves</span>
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
    // Initial burst
    const t1 = setTimeout(() => {
      confetti({
        particleCount: 60,
        spread: 55,
        origin: { y: 0.25, x: 0.5 },
        colors: ['#10b981', '#fbbf24', '#f59e0b', '#059669', '#34d399'],
        ticks: 150,
        gravity: 1.0,
        scalar: 0.9,
        drift: 0,
      });
    }, 500);
    // Side bursts
    const t2 = setTimeout(() => {
      confetti({
        particleCount: 35,
        angle: 60,
        spread: 40,
        origin: { x: 0, y: 0.4 },
        colors: ['#fbbf24', '#f59e0b', '#d97706'],
        ticks: 120,
        gravity: 1.2,
        scalar: 0.7,
      });
      confetti({
        particleCount: 35,
        angle: 120,
        spread: 40,
        origin: { x: 1, y: 0.4 },
        colors: ['#10b981', '#059669', '#34d399'],
        ticks: 120,
        gravity: 1.2,
        scalar: 0.7,
      });
    }, 900);
    // Gold star shower
    const t3 = setTimeout(() => {
      confetti({
        particleCount: 25,
        spread: 100,
        origin: { y: 0.1, x: 0.5 },
        colors: ['#fbbf24', '#fcd34d', '#fde68a'],
        shapes: ['star'],
        ticks: 180,
        gravity: 0.6,
        scalar: 1.1,
        drift: 0.5,
      });
    }, 1300);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div className="ss-page">
      <div className="ss-container">

        {/* Hero Section: Title + Progress Ring */}
        <motion.div
          className="ss-hero"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <div className="ss-hero-header">
            <div className="ss-hero-badge">
              <Tooltip text="Shift Completed"><Sparkle size={14} weight="fill" /></Tooltip>
              Shift Complete
            </div>
            <h1 className="ss-hero-title">Great Work, {d.worker}</h1>
            <p className="ss-hero-store">
              <Tooltip text="Store Location"><Storefront size={15} weight="duotone" /></Tooltip>
              {d.store}
            </p>
          </div>
          <ProgressRing scanned={d.shelvesScanned} total={d.shelvesTotal} />
        </motion.div>

        {/* Headline Metric: Sales Saved */}
        <motion.div
          className="ss-headline"
          initial="hidden"
          animate="visible"
          custom={1}
          variants={fadeUp}
        >
          <div className="ss-headline-icon">
            <Tooltip text="Total Sales Saved"><CurrencyInr size={24} weight="duotone" /></Tooltip>
          </div>
          <div className="ss-headline-content">
            <span className="ss-headline-label">Total Sales Saved</span>
            <span className="ss-headline-value">₹18,400</span>
          </div>
          <div className="ss-headline-trend">
            <Tooltip text="Trending Up"><TrendUp size={18} weight="bold" /></Tooltip>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="ss-stats-grid">
          {d.stats
            .filter(s => s.label !== 'Sales Saved')
            .map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.label}
                  className="ss-stat-card"
                  initial="hidden"
                  animate="visible"
                  custom={i + 2}
                  variants={fadeUp}
                >
                  <div className={`ss-stat-icon ss-stat-icon--${s.color}`}>
                    <Tooltip text={s.label}><Icon size={18} weight="duotone" /></Tooltip>
                  </div>
                  <div className="ss-stat-body">
                    <span className="ss-stat-value">{s.value}</span>
                    <span className="ss-stat-label">{s.label}</span>
                  </div>
                </motion.div>
              );
            })}
        </div>

        {/* Impact Callout */}
        <motion.div
          className="ss-impact"
          initial="hidden"
          animate="visible"
          custom={8}
          variants={fadeUp}
        >
          <div className="ss-impact-header">
            <div className="ss-impact-icon">
              <Tooltip text="Your Impact Today"><Target size={18} weight="bold" /></Tooltip>
            </div>
            <span className="ss-impact-title">Your Impact Today</span>
          </div>
          <p className="ss-impact-text">{d.impact}</p>
        </motion.div>

        {/* Personal Best */}
        {d.personalBest.active && (
          <motion.div
            className="ss-best"
            initial="hidden"
            animate="visible"
            custom={9}
            variants={fadeUp}
            whileInView={{ scale: [0.95, 1.03, 1] }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <div className="ss-best-badge">
              <Tooltip text="New Personal Best!"><Crown size={16} weight="fill" /></Tooltip>
              Personal Best
            </div>
            <p className="ss-best-text">
              <Tooltip text="Achievement"><Star size={16} weight="fill" className="ss-best-star" /></Tooltip>
              {d.personalBest.text}
            </p>
          </motion.div>
        )}

        {/* End Shift Button */}
        <motion.button
          className="ss-end-btn"
          onClick={onClose}
          initial="hidden"
          animate="visible"
          custom={10}
          variants={fadeUp}
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
        >
          End Shift
          <Tooltip text="End Shift & Exit"><ArrowRight size={18} weight="bold" /></Tooltip>
        </motion.button>

      </div>
    </div>
  );
}
