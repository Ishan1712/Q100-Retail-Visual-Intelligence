import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Warning, CheckCircle, X, PaperPlaneTilt, ArrowRight,
  Camera, VideoCamera, Flag, Clock, User, MapPin,
  Package, ArrowsLeftRight, Timer, CaretRight, Eye,
  ShieldCheck, Confetti,
} from '@phosphor-icons/react';
import SectionIcon from './SectionIcon';
import Tooltip from './Tooltip';
import './ActionReport.css';

/* ═══════════════════════════════════════
   DUMMY DATA
   ═══════════════════════════════════════ */
const reportData = {
  shelf: { name: 'Shelf 7', category: 'Snacks & Biscuits' },
  worker: 'Rahul M.',
  timestamp: '9:18 AM',
  mode: 'photo',
  issues: [
    {
      id: 1, type: 'oos', product: 'Parle-G 250g',
      section: 'Section 2', shelf: 'Eye-Level', position: 'Position 3-6',
      qty: '4 units needed', icon: 'cookie',
      brand: 'Parle', brandColor: '#fbbf24', brandBg: '#fffbeb',
      pickedBy: 'Suresh', pickedAt: '9:21 AM',
    },
    {
      id: 2, type: 'oos', product: 'Kurkure Multi Grain',
      section: 'Section 3', shelf: 'Eye-Level', position: 'Position 3',
      qty: '6 units needed', icon: 'bowl-food',
      brand: 'PepsiCo', brandColor: '#ef4444', brandBg: '#fef2f2',
      pickedBy: 'Suresh', pickedAt: '9:21 AM',
    },
    {
      id: 3, type: 'oos', product: 'Dairy Milk 50g',
      section: 'Section 5', shelf: 'Eye-Level', position: 'Position 1-3',
      qty: '3 units needed', icon: 'gift',
      brand: 'Cadbury', brandColor: '#7c3aed', brandBg: '#f5f3ff',
      pickedBy: 'Manoj', pickedAt: '9:22 AM',
    },
    {
      id: 4, type: 'misplaced', product: 'Shree Ganesh Mixture',
      section: 'Section 3', shelf: 'Eye-Level', position: 'Position 3 (Kurkure slot)',
      qty: 'Move to Lower Shelf, Position 4', icon: 'bowl-food',
      brand: 'Local', brandColor: '#f59e0b', brandBg: '#fffbeb',
    },
  ],
};

/* ═══════════════════════════════════════
   PROGRESS STEPS
   ═══════════════════════════════════════ */
const RESTOCK_STEPS = [
  { label: 'Waiting', short: 'Waiting' },
  { label: 'Picked', short: 'Picked' },
  { label: 'On the way', short: 'On the way' },
  { label: 'Restocked', short: 'Restocked' },
];

function ProgressTracker({ stepIndex, pickedBy, pickedAt }) {
  return (
    <div className="ar-progress-tracker">
      <div className="ar-progress-rail">
        <motion.div
          className="ar-progress-rail-fill"
          initial={{ width: '0%' }}
          animate={{ width: `${(stepIndex / (RESTOCK_STEPS.length - 1)) * 100}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
      <div className="ar-progress-steps">
        {RESTOCK_STEPS.map((step, i) => {
          const isDone = i < stepIndex;
          const isActive = i === stepIndex;
          const cls = isDone ? 'done' : isActive ? 'active' : 'pending';
          return (
            <div key={i} className={`ar-step ar-step--${cls}`}>
              <div className={`ar-step-dot ar-step-dot--${cls}`}>
                {isDone && <CheckCircle size={10} weight="fill" />}
                {isActive && (
                  <motion.div
                    className="ar-step-pulse"
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
                    transition={{ repeat: Infinity, duration: 1.4 }}
                  />
                )}
              </div>
              <div className="ar-step-info">
                <span className="ar-step-label">{step.label}</span>
                {/* Show picker name and time for Picked step */}
                {i === 1 && isDone && pickedBy && (
                  <span className="ar-step-detail">by {pickedBy} · {pickedAt}</span>
                )}
                {i === 1 && isActive && (
                  <span className="ar-step-detail">Waiting for storeroom...</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MASTER vs CAPTURED COMPARISON
   ═══════════════════════════════════════ */
function ShelfComparison({ type }) {
  return (
    <div className="ar-comparison">
      <div className="ar-comp-item">
        <span className="ar-comp-label">Master</span>
        <div className="ar-comp-thumb ar-comp-master">
          <div className="ar-comp-shelf-row">
            <span className="ar-comp-product" /><span className="ar-comp-product" /><span className="ar-comp-product" />
          </div>
        </div>
      </div>
      <div className="ar-comp-vs">vs</div>
      <div className="ar-comp-item">
        <span className="ar-comp-label">Captured</span>
        <div className={`ar-comp-thumb ar-comp-captured ${type}`}>
          <div className="ar-comp-shelf-row">
            {type === 'oos' ? (
              <><span className="ar-comp-product" /><span className="ar-comp-gap" /><span className="ar-comp-product" /></>
            ) : (
              <><span className="ar-comp-product wrong" /><span className="ar-comp-product" /><span className="ar-comp-product" /></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   ACTION REPORT (Main Component)
   ═══════════════════════════════════════ */
export default function ActionReport({ shelf, mode, onComplete, onClose }) {
  const data = reportData;
  const shelfInfo = shelf || data.shelf;
  const captureMode = mode || data.mode;

  const [actionedIds, setActionedIds] = useState(new Set());

  const totalIssues = data.issues.length;
  const oosCount = data.issues.filter((i) => i.type === 'oos').length;
  const misplacedCount = data.issues.filter((i) => i.type === 'misplaced').length;
  const hasIssues = totalIssues > 0;

  const restockSent = data.issues.filter(
    (i) => i.type === 'oos' && actionedIds.has(i.id)
  ).length;
  const misplacedFixed = data.issues.filter(
    (i) => i.type === 'misplaced' && actionedIds.has(i.id)
  ).length;

  const allActioned = actionedIds.size >= totalIssues;

  const handleAction = useCallback((id) => {
    setActionedIds((prev) => new Set(prev).add(id));
  }, []);

  const sortedIssues = [...data.issues].sort((a, b) => {
    if (a.type === 'oos' && b.type !== 'oos') return -1;
    if (a.type !== 'oos' && b.type === 'oos') return 1;
    return 0;
  });

  return (
    <div className="ar-overlay">
      <div className="ar-panel">
        {/* ── Header ── */}
        <header className="ar-header">
          <div className="ar-header-top">
            <div className="ar-header-title-group">
              <h2 className="ar-header-title">{shelfInfo.name}</h2>
              <span className="ar-header-category">{shelfInfo.category}</span>
            </div>
            {onClose && (
              <button className="ar-close-btn" onClick={onClose} aria-label="Close">
                <Tooltip text="Close Report"><X size={16} weight="bold" /></Tooltip>
              </button>
            )}
          </div>
          <div className="ar-header-meta">
            <span className="ar-meta-chip">
              <Tooltip text="Scanned By"><User size={12} weight="bold" /></Tooltip>
              {data.worker}
            </span>
            <span className="ar-meta-chip">
              <Tooltip text="Scan Time"><Clock size={12} weight="bold" /></Tooltip>
              {data.timestamp}
            </span>
            <span className="ar-meta-chip">
              {captureMode === 'photo'
                ? <Tooltip text="Photo Capture Mode"><Camera size={13} weight="duotone" /></Tooltip>
                : <Tooltip text="Video Capture Mode"><VideoCamera size={13} weight="duotone" /></Tooltip>
              }
              {captureMode === 'photo' ? 'Photo' : 'Video'}
            </span>
          </div>
        </header>

        {/* ── Status Banner ── */}
        {hasIssues ? (
          <motion.div
            className="ar-banner ar-banner--issues"
            animate={{ opacity: [0.85, 1, 0.85] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          >
            <Tooltip text="Issues Found"><Warning size={15} weight="fill" /></Tooltip>
            <span>
              <strong>{oosCount}</strong> Out-of-Stock
              {misplacedCount > 0 && (
                <> &middot; <strong>{misplacedCount}</strong> Misplaced</>
              )}
              <span className="ar-banner-shelf"> &middot; {shelfInfo.name}</span>
            </span>
          </motion.div>
        ) : (
          <motion.div
            className="ar-banner ar-banner--clear"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
            >
              <ShieldCheck size={22} weight="duotone" />
            </motion.div>
            <div className="ar-clear-content">
              <strong>Shelf Fully Stocked</strong>
              <span>All sections match the master planogram. No action needed.</span>
            </div>
            <button className="ar-next-shelf-btn" onClick={onComplete}>
              Next Shelf <ArrowRight size={14} weight="bold" />
            </button>
          </motion.div>
        )}

        {/* ── Issue Cards ── */}
        <div className="ar-issues-scroll">
          <AnimatePresence>
            {sortedIssues.map((issue) => (
              <TrackedIssueCard
                key={issue.id}
                issue={issue}
                onAction={handleAction}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* ── Bottom Bar ── */}
        <footer className="ar-footer">
          <div className="ar-footer-info">
            <span className="ar-footer-tasks">
              {actionedIds.size}/{totalIssues} tasks actioned
            </span>
            <span className="ar-footer-breakdown">
              {restockSent > 0 && (
                <span className="ar-footer-tag ar-footer-tag--restock">
                  <PaperPlaneTilt size={10} weight="bold" /> {restockSent} restock{restockSent > 1 ? 's' : ''} sent
                </span>
              )}
              {misplacedFixed > 0 && (
                <span className="ar-footer-tag ar-footer-tag--fixed">
                  <CheckCircle size={10} weight="bold" /> {misplacedFixed} fixed on-floor
                </span>
              )}
            </span>
            <span className="ar-footer-time">
              <Tooltip text="Estimated Floor Time"><Timer size={12} weight="bold" /></Tooltip>
              Est. floor time: 8 min
            </span>
          </div>
          <button
            className={`ar-complete-btn ${allActioned ? 'ar-complete-btn--ready' : ''}`}
            disabled={!allActioned}
            onClick={allActioned ? onComplete : undefined}
          >
            Mark Shelf Complete
            {allActioned && <ArrowRight size={14} weight="bold" />}
          </button>
        </footer>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   TRACKED ISSUE CARD WRAPPER
   ═══════════════════════════════════════ */
function TrackedIssueCard({ issue, onAction }) {
  const [status, setStatus] = useState('idle');
  const [progressStep, setProgressStep] = useState(0);
  const [flagged, setFlagged] = useState(false);
  const [sentTime, setSentTime] = useState(null);
  const timersRef = useRef([]);

  useEffect(() => {
    return () => timersRef.current.forEach(clearTimeout);
  }, []);

  const handleSendRestock = useCallback(() => {
    const now = new Date();
    setSentTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }));
    setStatus('sent');
    setProgressStep(0);
    onAction(issue.id);

    const t1 = setTimeout(() => setProgressStep(1), 3000);
    const t2 = setTimeout(() => setProgressStep(2), 6000);
    const t3 = setTimeout(() => setProgressStep(3), 9000);
    timersRef.current.push(t1, t2, t3);
  }, [issue.id, onAction]);

  const handleFixNow = useCallback(() => {
    setStatus('fixed');
    onAction(issue.id);
  }, [issue.id, onAction]);

  const isOOS = issue.type === 'oos';

  return (
    <motion.div
      className={`ar-card ${isOOS ? 'ar-card--oos' : 'ar-card--misplaced'}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Card top row: thumbnail + product + badge */}
      <div className="ar-card-top">
        <div className="ar-card-product-group">
          {/* Product brand thumbnail */}
          <div className="ar-product-thumb" style={{ background: issue.brandBg, borderColor: `${issue.brandColor}30` }}>
            <span className="ar-product-thumb-letter" style={{ color: issue.brandColor }}>
              {issue.product.charAt(0)}
            </span>
          </div>
          <div className="ar-product-info">
            <span className="ar-card-product">{issue.product}</span>
            <span className="ar-card-brand">{issue.brand}</span>
          </div>
        </div>
        <span className={`ar-pill ${isOOS ? 'ar-pill--oos' : 'ar-pill--misplaced'}`}>
          {isOOS ? 'OOS' : 'WRONG SPOT'}
        </span>
      </div>

      {/* Detail rows */}
      <div className="ar-card-details">
        <div className="ar-detail-row">
          <Tooltip text="Shelf Location"><MapPin size={13} weight="bold" className="ar-detail-icon" /></Tooltip>
          <span>{issue.section} &middot; {issue.shelf} &middot; {issue.position}</span>
        </div>
        <div className="ar-detail-row">
          {isOOS
            ? <Tooltip text="Out of Stock"><Package size={13} weight="bold" className="ar-detail-icon" /></Tooltip>
            : <Tooltip text="Misplaced Item"><ArrowsLeftRight size={13} weight="bold" className="ar-detail-icon" /></Tooltip>
          }
          <span>{issue.qty}</span>
        </div>
      </div>

      {/* Side-by-side Master vs Captured */}
      <ShelfComparison type={issue.type} />

      {/* Actions */}
      <div className="ar-card-actions">
        {isOOS ? (
          status === 'idle' ? (
            <button className="ar-btn ar-btn--restock" onClick={handleSendRestock}>
              <PaperPlaneTilt size={13} weight="bold" />
              Send Restock
            </button>
          ) : (
            <div className="ar-btn-sent-group">
              <button className="ar-btn ar-btn--done" disabled>
                <CheckCircle size={13} weight="fill" />
                Restock Sent
              </button>
              {sentTime && <span className="ar-sent-time">Sent at {sentTime}</span>}
            </div>
          )
        ) : (
          status === 'idle' ? (
            <button className="ar-btn ar-btn--fix" onClick={handleFixNow}>
              <Camera size={13} weight="bold" />
              Fix Now
            </button>
          ) : (
            <button className="ar-btn ar-btn--done" disabled>
              <CheckCircle size={13} weight="fill" />
              Fixed on Floor
            </button>
          )
        )}

        <button
          className={`ar-flag-btn ${flagged ? 'ar-flag-btn--active' : ''}`}
          onClick={() => setFlagged((f) => !f)}
        >
          <Tooltip text="Flag as Incorrect Detection"><Flag size={12} weight={flagged ? 'fill' : 'bold'} /></Tooltip>
          {flagged ? 'Flagged' : 'Disagree'}
        </button>
      </div>

      {/* Progress tracker for OOS after restock sent */}
      {isOOS && status === 'sent' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.25 }}
        >
          <ProgressTracker
            stepIndex={progressStep}
            pickedBy={issue.pickedBy}
            pickedAt={issue.pickedAt}
          />
        </motion.div>
      )}
    </motion.div>
  );
}
