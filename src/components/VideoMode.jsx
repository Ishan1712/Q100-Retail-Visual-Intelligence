import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  VideoCamera, Stop, X, CheckCircle, Warning, ArrowRight, Play,
  ShieldCheck, Package, MapPin, ArrowsLeftRight, Clock, Scan,
  Lightning, CircleNotch
} from '@phosphor-icons/react';
import { allShelfSections } from '../data';
import SectionIcon, { SectionIconRaw } from './SectionIcon';
import useCamera from '../hooks/useCamera';
import Tooltip from './Tooltip';
import './VideoMode.css';

const colors = ['#10b981', '#0d9488', '#f59e0b', '#ef4444', '#6366f1', '#ec4899', '#8b5cf6', '#06b6d4'];
const fmt = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

export default function VideoMode({ shelf, onComplete, onClose }) {
  const displayShelf = shelf || { id: 7, name: 'Shelf 7', category: 'Snacks & Biscuits' };
  const secs = allShelfSections[displayShelf.id] || allShelfSections[7];
  // Build timeline dynamically based on number of sections
  const timeline = secs.map((_, i) => ({ time: 5 + i * 10, si: i }));
  const [rec, setRec] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [caps, setCaps] = useState([]);
  const [flash, setFlash] = useState(false);
  const [nextSec, setNextSec] = useState(0);
  const [stopped, setStopped] = useState(false);
  const [warn, setWarn] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const ref = useRef(null);
  const holdRef = useRef(null);

  const { videoRef, error: cameraError, hasCamera, rotated } = useCamera({
    active: !stopped,
    facingMode: 'environment',
  });

  useEffect(() => {
    if (!rec) return;
    ref.current = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(ref.current);
  }, [rec]);

  // Simulate steady-hold detection before each capture
  // Hold starts 2s before the timeline trigger, completes at the trigger time
  const holdingRef = useRef(false);
  useEffect(() => {
    if (!rec) return;
    // Check if we're 2 seconds before a timeline event
    const upcoming = timeline.find(e => e.time === elapsed + 2);
    if (upcoming && !caps.find(c => c.si === upcoming.si) && !holdingRef.current) {
      holdingRef.current = true;
      setHoldProgress(0);
      let prog = 0;
      holdRef.current = setInterval(() => {
        prog += 2.5;
        setHoldProgress(Math.min(prog, 100));
        if (prog >= 100) {
          clearInterval(holdRef.current);
          holdRef.current = null;
          setHoldProgress(0);
          holdingRef.current = false;
          // Capture — flash + haptic buzz
          setFlash(true);
          setTimeout(() => setFlash(false), 200);
          if (navigator.vibrate) navigator.vibrate(80);
          setCaps(p => [...p, { si: upcoming.si, done: false }]);
          setNextSec(upcoming.si + 1);
          setTimeout(() => setCaps(p => p.map(c => c.si === upcoming.si ? { ...c, done: true } : c)), 2000);
        }
      }, 50);
    }
  }, [elapsed, rec, caps]);

  useEffect(() => {
    if (caps.length === secs.length && rec) {
      setTimeout(() => { clearInterval(ref.current); setRec(false); setStopped(true); }, 2000);
    }
  }, [caps.length, secs.length, rec]);

  const doStop = () => {
    clearInterval(ref.current);
    if (holdRef.current) { clearInterval(holdRef.current); holdRef.current = null; }
    holdingRef.current = false;
    setRec(false);
    setHoldProgress(0);
    if (caps.length < secs.length && caps.length > 0) {
      setWarn(true);
    } else {
      setStopped(true);
    }
  };

  // ═══════════════════════════
  // REVIEW SCREEN
  // ═══════════════════════════
  if (stopped) {
    const pass = caps.filter(c => secs[c.si].result === 'pass').length;
    const fail = caps.filter(c => secs[c.si].result === 'fail').length;
    const miss = secs.filter((_, i) => !caps.find(c => c.si === i));
    const allIssues = [];
    caps.forEach(c => {
      const sec = secs[c.si];
      if (sec.issues?.length) {
        sec.issues.forEach(issue => allIssues.push({ ...issue, sectionName: sec.name, sectionId: sec.id, sectionIcon: sec.icon }));
      }
    });
    const totalOos = allIssues.filter(i => i.type === 'oos').length;
    const totalMisplaced = allIssues.filter(i => i.type === 'misplaced').length;

    return (
      <div className="vr-overlay">
        <div className="vr-header">
          <button onClick={onClose} className="vr-close-btn" aria-label="Close"><Tooltip text="Close Review"><X size={16} weight="bold" /></Tooltip></button>
          <div className="vr-header-center">
            <div className="vr-header-badge"><Tooltip text="Video Scan Complete"><Scan size={12} weight="bold" /></Tooltip> Video Scan Complete</div>
            <h1 className="vr-header-shelf">{displayShelf.name} <span>· {displayShelf.category}</span></h1>
          </div>
          <div style={{ width: 36 }} />
        </div>
        <div className="vr-meta-strip">
          <div className="vr-meta-item"><Tooltip text="Total Scan Time"><Clock size={13} weight="duotone" /></Tooltip><span>{fmt(elapsed)} scan time</span></div>
          <div className="vr-meta-divider" />
          <div className="vr-meta-item"><Tooltip text="Sections Scanned"><Scan size={13} weight="duotone" /></Tooltip><span>{caps.length}/{secs.length} sections</span></div>
          <div className="vr-meta-divider" />
          <div className="vr-meta-item"><Tooltip text="Video Capture Mode"><VideoCamera size={13} weight="duotone" /></Tooltip><span>Video Mode</span></div>
        </div>
        <div className="vr-content">
          {allIssues.length === 0 ? (
            <motion.div className="vr-verdict vr-verdict-pass" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <div className="vr-verdict-icon-wrap pass"><Tooltip text="All Sections Compliant"><ShieldCheck size={28} weight="duotone" /></Tooltip></div>
              <div><h2 className="vr-verdict-title">All Sections Compliant</h2><p className="vr-verdict-sub">Every shelf matches the master planogram. No action needed.</p></div>
            </motion.div>
          ) : (
            <motion.div className="vr-verdict vr-verdict-alert" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <div className="vr-verdict-icon-wrap alert"><Tooltip text="Action Required"><Warning size={28} weight="duotone" /></Tooltip></div>
              <div style={{ flex: 1 }}><h2 className="vr-verdict-title">Issues Detected — Action Required</h2><p className="vr-verdict-sub">{allIssues.length} issue{allIssues.length > 1 ? 's' : ''} found across {fail} section{fail > 1 ? 's' : ''} that need immediate attention</p></div>
            </motion.div>
          )}
          <div className="vr-stats-row">
            <motion.div className="vr-stat pass" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="vr-stat-icon pass"><Tooltip text="Sections Passed"><CheckCircle size={18} weight="duotone" /></Tooltip></div>
              <div><p className="vr-stat-num">{pass}</p><p className="vr-stat-label">Sections Clear</p></div>
            </motion.div>
            <motion.div className="vr-stat oos" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <div className="vr-stat-icon oos"><Tooltip text="Out of Stock Items"><Package size={18} weight="duotone" /></Tooltip></div>
              <div><p className="vr-stat-num">{totalOos}</p><p className="vr-stat-label">Out of Stock</p></div>
            </motion.div>
            <motion.div className="vr-stat misplaced" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <div className="vr-stat-icon misplaced"><Tooltip text="Misplaced Items"><ArrowsLeftRight size={18} weight="duotone" /></Tooltip></div>
              <div><p className="vr-stat-num">{totalMisplaced}</p><p className="vr-stat-label">Misplaced</p></div>
            </motion.div>
            {miss.length > 0 && (
              <motion.div className="vr-stat missed" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                <div className="vr-stat-icon missed"><Tooltip text="Sections Missed"><Warning size={18} weight="duotone" /></Tooltip></div>
                <div><p className="vr-stat-num">{miss.length}</p><p className="vr-stat-label">Missed</p></div>
              </motion.div>
            )}
          </div>
          {allIssues.length > 0 && (
            <div className="vr-issues-section">
              <div className="vr-section-label"><span className="vr-section-dot alert" />Detected Issues<span className="vr-section-count">{allIssues.length}</span></div>
              {allIssues.map((issue, i) => (
                <motion.div key={i} className={`vr-issue-card ${issue.type}`} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.08 }}>
                  <div className="vr-issue-top">
                    <span className={`vr-issue-badge ${issue.type}`}>
                      {issue.type === 'oos' ? <><Tooltip text="Out of Stock"><Package size={11} weight="bold" /></Tooltip> OUT OF STOCK</> : <><Tooltip text="Misplaced Item"><ArrowsLeftRight size={11} weight="bold" /></Tooltip> MISPLACED</>}
                    </span>
                    <span className="vr-issue-section"><SectionIconRaw icon={issue.sectionIcon} size={12} />Section {issue.sectionId} · {issue.sectionName}</span>
                  </div>
                  <h3 className="vr-issue-product">{issue.product}</h3>
                  <p className="vr-issue-detail">{issue.detail}</p>

                  {/* Dummy AI detection mini-view */}
                  <div className="vr-ai-mini">
                    <div className="vr-ai-grid-bg" />
                    <div className="vr-ai-scanline" />
                    <div className="vr-ai-mini-header">
                      <span className="vr-ai-mini-dot" />
                      <Scan size={10} weight="bold" />
                      <span>Q100 Vision AI</span>
                      <span className="vr-ai-mini-sep">·</span>
                      <span className="vr-ai-mini-status">{issue.type === 'oos' ? 'Gap Detected' : 'Misplacement Found'}</span>
                      <span className="vr-ai-mini-conf">
                        <span className="vr-ai-conf-dot" />
                        97.8%
                      </span>
                    </div>
                    <div className="vr-ai-mini-body">
                      <div className="vr-ai-shelf-label">Eye-Level Shelf</div>
                      <div className="vr-ai-mini-boxes">
                        <div className="vr-ai-mini-box ok">
                          <div className="vr-ai-box-inner" />
                          <span className="vr-ai-mini-tag ok">OK</span>
                        </div>
                        <div className={`vr-ai-mini-box ${issue.type === 'oos' ? 'oos' : 'misplaced'}`}>
                          <div className="vr-ai-box-inner" />
                          <span className="vr-ai-box-name">{issue.product}</span>
                          <span className={`vr-ai-mini-tag ${issue.type === 'oos' ? 'oos' : 'misplaced'}`}>
                            {issue.type === 'oos' ? <><Package size={7} weight="bold" /> MISSING</> : <><ArrowsLeftRight size={7} weight="bold" /> WRONG SPOT</>}
                          </span>
                        </div>
                        <div className="vr-ai-mini-box ok">
                          <div className="vr-ai-box-inner" />
                          <span className="vr-ai-mini-tag ok">OK</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="vr-issue-meta">
                    <span className="vr-issue-shelf"><Tooltip text="Shelf Location"><MapPin size={11} weight="duotone" /></Tooltip>{issue.shelf === 'eyeLevel' ? 'Eye-Level Shelf' : issue.shelf === 'top' ? 'Top Shelf' : 'Lower Shelf'}</span>
                    {issue.gap && <span className="vr-issue-gap">{issue.gap}</span>}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          <div className="vr-sections-list">
            <div className="vr-section-label"><span className="vr-section-dot neutral" />Section Results<span className="vr-section-count">{secs.length}</span></div>
            {secs.map((sec, i) => {
              const cap = caps.find(c => c.si === i);
              const status = !cap ? 'missed' : sec.result === 'pass' ? 'pass' : 'fail';
              return (
                <motion.div key={i} className={`vr-sec-row ${status}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + i * 0.04 }}>
                  <div className="vr-sec-icon" style={{ background: cap ? `${colors[i % colors.length]}12` : undefined }}><SectionIconRaw icon={sec.icon} size={18} /></div>
                  <div className="vr-sec-info"><p className="vr-sec-name">{sec.name}</p><p className="vr-sec-id">Section {sec.id}</p></div>
                  <div className={`vr-sec-status ${status}`}>
                    {status === 'pass' && <><CheckCircle size={14} weight="fill" /> Clear</>}
                    {status === 'fail' && <><Warning size={14} weight="fill" /> {sec.issues.length} issue{sec.issues.length > 1 ? 's' : ''}</>}
                    {status === 'missed' && <><X size={14} weight="bold" /> Missed</>}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
        <div className="vr-bottom">
          <motion.button onClick={onComplete} className="vr-cta-btn" whileTap={{ scale: 0.98 }}>
            <span>View Full Action Report</span><ArrowRight size={18} weight="bold" />
          </motion.button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════
  // RECORDING SCREEN
  // ═══════════════════════════
  return (
    <div className="vm-overlay">
      {/* Warning modal */}
      <AnimatePresence>
        {warn && (
          <motion.div className="vm-warn-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="vm-warn-card" initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <div className="vm-warn-icon"><Tooltip text="Sections Not Captured"><Warning size={28} weight="duotone" /></Tooltip></div>
              <h3>{secs.length - caps.length} section{secs.length - caps.length > 1 ? 's' : ''} not captured</h3>
              <p className="vm-warn-missing">
                Missing: {secs.filter((_, i) => !caps.find(c => c.si === i)).map(s => s.name).join(', ')}
              </p>
              <div className="vm-warn-actions">
                <button onClick={() => { setWarn(false); setRec(true); }} className="vm-warn-btn vm-warn-continue">
                  <Tooltip text="Resume Recording"><VideoCamera size={16} weight="duotone" /></Tooltip> Continue Recording
                </button>
                <button onClick={() => { setWarn(false); setStopped(true); }} className="vm-warn-btn vm-warn-submit">
                  Submit Partial
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flash effect */}
      <AnimatePresence>
        {flash && (
          <motion.div className="vm-flash" initial={{ opacity: 0.8 }} animate={{ opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} />
        )}
      </AnimatePresence>

      {/* ── TOP BAR ── */}
      <div className="vm-topbar">
        <button onClick={onClose} className="vm-close" aria-label="Close"><Tooltip text="Close Video Mode"><X size={15} weight="bold" /></Tooltip></button>
        <div className="vm-topbar-center">
          {rec ? (
            <div className="vm-topbar-rec-group">
              <motion.div className="vm-rec-badge" animate={{ opacity: [0.6, 1, 0.6] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                <span className="vm-rec-dot" />
                <span>REC</span>
              </motion.div>
              <span className="vm-timer">{fmt(elapsed)}</span>
            </div>
          ) : (
            <div className="vm-topbar-info">
              <p className="vm-topbar-shelf">{displayShelf.name}</p>
              <p className="vm-topbar-cat">{displayShelf.category}</p>
            </div>
          )}
        </div>
        <div className="vm-topbar-counter">
          <span className="vm-counter-num">{caps.length}</span>
          <span className="vm-counter-sep">/</span>
          <span className="vm-counter-total">{secs.length}</span>
        </div>
      </div>

      {/* ── VIEWFINDER ── */}
      <div className={`vm-viewfinder ${rec ? 'recording' : 'idle'}`}>
        <video ref={videoRef} autoPlay playsInline muted className={`vm-camera-feed${rotated ? ' vm-camera-rotated' : ''}`} />

        {/* Idle state */}
        {!rec && !hasCamera && (
          <div className="vm-idle-content">
            <div className="vm-idle-icon"><Tooltip text="Video Walk-through Mode"><VideoCamera size={44} weight="duotone" /></Tooltip></div>
            <h3>{cameraError || 'Ready to Scan'}</h3>
            <p>Walk slowly down the shelf. AI auto-captures each section when you hold steady for 2-3 seconds.</p>
            <div className="vm-idle-sections">
              {secs.map((sec, i) => (
                <div key={i} className="vm-idle-sec">
                  <SectionIconRaw icon={sec.icon} size={14} />
                  <span>S{i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next section guide — prominent during recording */}
        {rec && nextSec < secs.length && (
          <motion.div key={nextSec} className="vm-guide" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
            <div className="vm-guide-inner">
              <SectionIconRaw icon={secs[nextSec].icon} size={16} />
              <div>
                <p className="vm-guide-label">Next Section</p>
                <p className="vm-guide-name">Section {nextSec + 1}: {secs[nextSec].name}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Hold progress indicator — single ring, no inner icon */}
        {rec && holdProgress > 0 && holdProgress < 100 && (
          <motion.div className="vm-hold-indicator" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <svg width="56" height="56" viewBox="0 0 72 72">
              <circle cx="36" cy="36" r="23" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" />
              <circle cx="36" cy="36" r="23" fill="none" stroke="#4ade80" strokeWidth="5"
                strokeDasharray={2 * Math.PI * 23} strokeDashoffset={2 * Math.PI * 23 * (1 - holdProgress / 100)}
                strokeLinecap="round" transform="rotate(-90 36 36)" />
            </svg>
            <span className="vm-hold-pct">{Math.round(holdProgress)}%</span>
            <p className="vm-hold-text">Hold steady...</p>
          </motion.div>
        )}

        {/* All captured celebration */}
        {caps.length === secs.length && rec && (
          <motion.div className="vm-all-done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <CheckCircle size={24} weight="duotone" />
            <span>All {secs.length} sections captured!</span>
          </motion.div>
        )}

        {/* Last capture notification */}
        <AnimatePresence>
          {caps.length > 0 && caps[caps.length - 1] && !caps[caps.length - 1].done && (
            <motion.div className="vm-capture-toast" key={caps.length}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}>
              <CheckCircle size={14} weight="fill" color="#4ade80" />
              <span>Section {caps[caps.length - 1].si + 1} captured</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── CAPTURE STRIP ── */}
      <div className="vm-strip-bar">
        <div className="vm-strip">
          {secs.map((sec, i) => {
            const cap = caps.find(c => c.si === i);
            const isDone = cap?.done;
            const isPass = isDone && sec.result === 'pass';
            const isFail = isDone && sec.result === 'fail';
            const isPending = cap && !isDone;
            return (
              <div key={i} className={`vm-strip-item ${cap ? 'captured' : 'empty'} ${isPass ? 'pass' : ''} ${isFail ? 'fail' : ''}`}>
                <div className="vm-strip-icon" style={cap ? { background: `${colors[i % colors.length]}20`, borderColor: `${colors[i % colors.length]}40` } : undefined}>
                  <SectionIconRaw icon={sec.icon} size={16} />
                </div>
                <p className="vm-strip-name">{sec.name.split(' ')[0]}</p>
                <p className="vm-strip-sec">S{i + 1}</p>
                {/* Status badge */}
                {isDone && (
                  <div className={`vm-strip-badge ${isPass ? 'pass' : 'fail'}`}>
                    {isPass ? <CheckCircle size={10} weight="fill" /> : <Warning size={10} weight="fill" />}
                  </div>
                )}
                {isPending && (
                  <div className="vm-strip-badge pending">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                      <CircleNotch size={10} weight="bold" />
                    </motion.div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── CONTROLS ── */}
      <div className="vm-controls">
        {!rec ? (
          <motion.button onClick={() => setRec(true)} className="vm-start-btn" whileTap={{ scale: 0.97 }}>
            <div className="vm-start-icon"><Tooltip text="Start Video Recording"><Play size={22} weight="fill" /></Tooltip></div>
            <div>
              <span className="vm-start-title">Start Recording</span>
              <span className="vm-start-sub">{secs.length} sections · <Tooltip text="Estimated Time"><Lightning size={11} weight="fill" /></Tooltip> ~55 seconds</span>
            </div>
          </motion.button>
        ) : (
          <div className="vm-rec-controls">
            <div className="vm-rec-info">
              <p className="vm-rec-info-text">{caps.length === 0 ? 'Point at the first section...' : caps.length < secs.length ? `${secs.length - caps.length} section${secs.length - caps.length > 1 ? 's' : ''} remaining` : 'All captured — stopping...'}</p>
            </div>
            <motion.button onClick={doStop} className="vm-stop-btn" whileTap={{ scale: 0.92 }}>
              <Tooltip text="Stop Recording"><Stop size={24} weight="fill" /></Tooltip>
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}
