import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  QrCode, Keyboard, Camera, VideoCamera, CaretRight, SquaresFour,
  X, Scan, Clock, UserCircle, Warning, CheckCircle, Lightning
} from '@phosphor-icons/react';
import { shelf7Sections } from '../data';
import { SectionIconRaw } from './SectionIcon';
import useCamera from '../hooks/useCamera';
import Tooltip from './Tooltip';
import './ShelfScanner.css';

const sectionColors = [
  'linear-gradient(135deg,#10b981,#059669)',
  'linear-gradient(135deg,#0d9488,#0f766e)',
  'linear-gradient(135deg,#f59e0b,#d97706)',
  'linear-gradient(135deg,#ef4444,#dc2626)',
  'linear-gradient(135deg,#6366f1,#4f46e5)',
  'linear-gradient(135deg,#ec4899,#db2777)',
];

export default function ShelfScanner({ shelf, onConfirm, onClose }) {
  const [step, setStep] = useState('scanning');
  const [countdown, setCountdown] = useState(3);
  const [showFlash, setShowFlash] = useState(false);
  const displayShelf = shelf || { id: 7, name: "Shelf 7", category: "Snacks & Biscuits" };
  const sections = shelf7Sections;

  // Live camera for QR scanning phase
  const { videoRef, error: cameraError, hasCamera } = useCamera({
    active: step === 'scanning',
    facingMode: 'environment',
  });

  useEffect(() => {
    if (step !== 'scanning') return;
    const timer = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(timer);
          setShowFlash(true);
          setTimeout(() => { setShowFlash(false); setStep('confirmed'); }, 400);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [step]);

  const doSkip = () => {
    setShowFlash(true);
    setTimeout(() => { setShowFlash(false); setStep('confirmed'); }, 300);
  };

  return (
    <div className="scanner-overlay">
      <AnimatePresence mode="wait">
        {step === 'scanning' ? (
          <motion.div key="scan" className="scanner-dark"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="scanner-grid" />
            {showFlash && <div className="scanner-flash" />}

            <button onClick={onClose} className="scanner-close" aria-label="Close Scanner">
              <Tooltip text="Close Scanner"><X size={18} weight="bold" color="#fff" /></Tooltip>
            </button>

            <motion.div className="scanner-badge"
              animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2.5 }}>
              <span className="scanner-badge-dot" />
              <Tooltip text="Scanning QR Code"><Scan size={14} weight="duotone" color="#6ee7b7" /></Tooltip>
              <span>Scanning</span>
            </motion.div>

            <motion.div className="scanner-viewfinder"
              initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 180, damping: 20 }}>
              {/* Live camera feed */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="scanner-camera-feed"
              />
              {!hasCamera && (
                <div className="scanner-qr-ghost">
                  {cameraError
                    ? <span className="scanner-camera-error">{cameraError}</span>
                    : <QrCode size={130} weight="duotone" />}
                </div>
              )}
              {['tl', 'tr', 'bl', 'br'].map((pos, i) => (
                <motion.div key={pos} className={`scanner-corner ${pos}`}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 2.2, delay: i * 0.15 }} />
              ))}
              <motion.div className="scanner-scanline"
                animate={{ top: [0, 236, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }} />
            </motion.div>

            <h2 className="scanner-title">Align QR Code at Shelf End</h2>

            <div className="scanner-countdown-wrap">
              <div className="scanner-countdown-circle">
                <motion.span key={countdown} className="scanner-countdown-num"
                  initial={{ scale: 1.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}>
                  {countdown}
                </motion.span>
              </div>
              <span className="scanner-countdown-text">Auto-detecting shelf...</span>
            </div>

            <button onClick={doSkip} className="scanner-fallback">
              <Tooltip text="Enter Shelf Manually"><Keyboard size={17} weight="duotone" /></Tooltip> Type Shelf Number
            </button>
          </motion.div>
        ) : (
          <motion.div key="confirmed" className="scanner-confirm-wrap"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

            {/* Dark decorative top area */}
            <div className="scanner-confirm-dark-top">
              <div className="scanner-confirm-rings">
                <div className="scanner-confirm-ring" />
                <div className="scanner-confirm-ring" />
                <div className="scanner-confirm-ring" />
              </div>
              <motion.div className="scanner-success-icon"
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}>
                <Tooltip text="Shelf Detected Successfully"><CheckCircle size={32} weight="duotone" color="#4ade80" /></Tooltip>
              </motion.div>
            </div>

            <button onClick={onClose} className="scanner-close" style={{ zIndex: 20 }} aria-label="Close">
              <Tooltip text="Close"><X size={18} weight="bold" color="#fff" /></Tooltip>
            </button>

            {/* Sliding white card */}
            <motion.div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', position: 'relative', zIndex: 2 }}
              initial={{ y: 80 }} animate={{ y: 0 }}
              transition={{ type: 'spring', stiffness: 180, damping: 24 }}>
              <div className="scanner-confirm-card">
                <div className="scanner-card-handle" />

                {/* Detection badge */}
                <div className="scanner-detect-row">
                  <motion.span className="scanner-detect-badge"
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}>
                    <span className="scanner-detect-dot" />
                    Shelf Detected
                  </motion.span>
                  <motion.span className="scanner-detect-time"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}>
                    0.6s
                  </motion.span>
                </div>

                {/* Shelf name */}
                <motion.h1 className="scanner-shelf-name"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}>
                  {displayShelf.name}
                </motion.h1>
                <motion.p className="scanner-shelf-meta"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}>
                  🍪 {displayShelf.category}
                  <span className="scanner-shelf-meta-sep">·</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Tooltip text="Total Sections"><SquaresFour size={15} weight="duotone" color="#94a3b8" /></Tooltip> {sections.length} Sections
                  </span>
                </motion.p>

                {/* Last scan info */}
                <motion.div className="scanner-last-info"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}>
                  <span className="scanner-last-item"><Tooltip text="Last Scan Time"><Clock size={14} weight="duotone" /></Tooltip> Last: 8:48 AM</span>
                  <span className="scanner-last-item"><Tooltip text="Last Scanned By"><UserCircle size={14} weight="duotone" /></Tooltip> by Rahul</span>
                  <span className="scanner-last-item scanner-last-oos"><Tooltip text="Out of Stock Items"><Warning size={14} weight="duotone" /></Tooltip> 3 OOS</span>
                </motion.div>

                {/* Planogram strip */}
                <p className="scanner-plano-label">Master Planogram — {sections.length} Sections</p>
                <div className="scanner-plano-strip">
                  {sections.map((sec, i) => (
                    <motion.div key={sec.id} className="scanner-thumb"
                      initial={{ opacity: 0, y: 16, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.4 + i * 0.06, type: 'spring', stiffness: 200 }}>
                      <div className="scanner-thumb-color" style={{ background: sectionColors[i] }}>
                        <SectionIconRaw icon={sec.icon} size={20} color="#fff" />
                      </div>
                      <div>
                        <p className="scanner-thumb-num">Section {sec.id}</p>
                        <p className="scanner-thumb-name">{sec.name}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Mode buttons */}
                <div className="scanner-modes">
                  <motion.button onClick={() => onConfirm?.('photo')}
                    className="scanner-mode-btn scanner-mode-photo"
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                    <div className="scanner-mode-inner">
                      <div className="scanner-mode-icon"><Tooltip text="Capture Section by Section"><Camera size={26} weight="duotone" /></Tooltip></div>
                      <div>
                        <span className="scanner-mode-title">Photo Mode</span>
                        <span className="scanner-mode-subtitle">Section-by-section guided capture</span>
                      </div>
                    </div>
                    <CaretRight size={22} weight="bold" className="scanner-mode-arrow" />
                  </motion.button>

                  <motion.button onClick={() => onConfirm?.('video')}
                    className="scanner-mode-btn scanner-mode-video"
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                    <div className="scanner-mode-inner">
                      <div className="scanner-mode-icon"><Tooltip text="Walk-through Auto Capture"><VideoCamera size={26} weight="duotone" /></Tooltip></div>
                      <div>
                        <span className="scanner-mode-title">Video Mode</span>
                        <span className="scanner-mode-subtitle">Walk-through auto-capture</span>
                        <span className="scanner-mode-speed"><Tooltip text="Faster Than Photo Mode"><Lightning size={11} weight="fill" /></Tooltip> 2.5x faster</span>
                      </div>
                    </div>
                    <CaretRight size={22} weight="bold" className="scanner-mode-arrow" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
