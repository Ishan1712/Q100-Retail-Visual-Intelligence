import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera, X, Warning, CheckCircle, PaperPlaneTilt, Package,
  MagnifyingGlassPlus, ArrowRight, Wrench, Flag, MapPin,
  ArrowsLeftRight, ShieldCheck, Scan, Eye, Cube, UploadSimple, Image, Trash,
  Key, SpinnerGap, CaretDown, CaretUp, Bell, DownloadSimple, WhatsappLogo, Check
} from '@phosphor-icons/react';
import { shelf7Sections } from '../data';
import SectionIcon from './SectionIcon';
import useCamera from '../hooks/useCamera';
import Tooltip from './Tooltip';
import { compareWithMaster, getApiKey, saveApiKey } from '../services/llmService';
import './PhotoMode.css';

const shelfLabels = { top: 'Top Shelf', eyeLevel: 'Eye-Level', lower: 'Lower Shelf' };

export default function PhotoMode({ shelf, onComplete, onClose }) {
  const sections = shelf7Sections;
  const [idx, setIdx] = useState(0);
  const [states, setStates] = useState(sections.map(() => ({ status: 'pending' })));
  const [showPlan, setShowPlan] = useState(false);
  const [sent, setSent] = useState({});
  const [inputMode, setInputMode] = useState('capture');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [capturedFrame, setCapturedFrame] = useState(null);
  const fileInputRef = useRef(null);

  // LLM state
  const [apiKey, setApiKey] = useState(() => getApiKey());
  const [showApiKey, setShowApiKey] = useState(false);
  const [llmResults, setLlmResults] = useState({}); // idx -> result
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const sec = sections[idx];
  const st = states[idx];

  const { videoRef, error: cameraError, hasCamera, takeSnapshot } = useCamera({
    active: st.status === 'pending' && inputMode === 'capture',
    facingMode: 'environment',
  });

  const isLastSection = idx === sections.length - 1;

  // Save API key to localStorage (fallback when .env not set)
  const handleSaveApiKey = (key) => {
    setApiKey(key);
    saveApiKey(key);
  };

  // Handle upload
  const handleUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setUploadedImage(ev.target.result);
    reader.readAsDataURL(file);
  }, []);

  // Analyze with LLM — compare master vs inspection
  const analyzeWithLLM = useCallback(async (inspectionDataUrl, inspectionFile) => {
    if (!apiKey) {
      setShowApiKey(true);
      return;
    }

    setIsAnalyzing(true);
    setStates(p => { const n = [...p]; n[idx] = { status: 'processing' }; return n; });

    try {
      const result = await compareWithMaster({
        apiKey,
        masterImageUrl: sec.masterImage,
        inspectionImage: inspectionFile || inspectionDataUrl,
        expectedProducts: sec.expectedProducts || [],
        sectionName: sec.name,
      });

      setLlmResults(prev => ({ ...prev, [idx]: result }));
      setStates(p => { const n = [...p]; n[idx] = { status: 'result' }; return n; });
    } catch (err) {
      console.error('LLM analysis failed:', err);
      setLlmResults(prev => ({
        ...prev,
        [idx]: {
          status: 'NOT_OK',
          confidence: 0,
          summary: `Analysis failed: ${err.message}`,
          missing_products: [],
          misplaced_products: [],
          extra_products: [],
          restock_actions: [],
          reasoning: err.message,
          error: true,
        },
      }));
      setStates(p => { const n = [...p]; n[idx] = { status: 'result' }; return n; });
    } finally {
      setIsAnalyzing(false);
    }
  }, [apiKey, idx, sec]);

  // Capture from camera and analyze
  const capture = useCallback(() => {
    const frame = takeSnapshot();
    if (!frame) return;
    setCapturedFrame(frame);
    analyzeWithLLM(frame, null);
  }, [takeSnapshot, analyzeWithLLM]);

  // Submit uploaded image for analysis
  const submitUpload = useCallback(() => {
    if (!uploadedImage) return;
    analyzeWithLLM(uploadedImage, uploadedFile);
  }, [uploadedImage, uploadedFile, analyzeWithLLM]);

  // Alert state: track which items are selected for restock alert
  const [alertItems, setAlertItems] = useState({});
  const [alertSent, setAlertSent] = useState({});

  const toggleAlertItem = (key) => {
    setAlertItems(p => ({ ...p, [key]: !p[key] }));
  };

  const selectAllAlerts = () => {
    if (!currentResult) return;
    const items = {};
    (currentResult.missing_products || []).forEach((_, i) => { items[`${idx}-m-${i}`] = true; });
    (currentResult.misplaced_products || []).forEach((_, i) => { items[`${idx}-mp-${i}`] = true; });
    setAlertItems(p => ({ ...p, ...items }));
  };

  const getSelectedCount = () => {
    return Object.keys(alertItems).filter(k => k.startsWith(`${idx}-`) && alertItems[k]).length;
  };

  const sendAlerts = () => {
    const selected = Object.keys(alertItems).filter(k => k.startsWith(`${idx}-`) && alertItems[k]);
    if (selected.length === 0) return;
    // Mark as sent (dummy)
    const sentUpdate = {};
    selected.forEach(k => { sentUpdate[k] = true; });
    setAlertSent(p => ({ ...p, ...sentUpdate }));
    // Clear selections
    const cleared = { ...alertItems };
    selected.forEach(k => { cleared[k] = false; });
    setAlertItems(cleared);
  };

  const isItemSent = (key) => !!alertSent[key];

  const next = () => {
    setUploadedImage(null);
    setUploadedFile(null);
    setCapturedFrame(null);
    if (idx < sections.length - 1) setIdx(i => i + 1);
    else onComplete?.();
  };

  const completedCount = states.filter(s => s.status === 'result').length;
  const passCount = Object.entries(llmResults).filter(([, r]) => r.status === 'OK').length;
  const failCount = Object.entries(llmResults).filter(([, r]) => r.status === 'NOT_OK').length;

  // Current result
  const currentResult = llmResults[idx];
  const isPass = currentResult?.status === 'OK';
  const isFail = currentResult?.status === 'NOT_OK';

  return (
    <div className="pm-overlay">
      {/* Header */}
      <div className="pm-header">
        <button onClick={onClose} className="pm-close" aria-label="Close">
          <Tooltip text="Close Photo Mode"><X size={15} weight="bold" /></Tooltip>
        </button>
        <div className="pm-header-center">
          <div className="pm-header-badge">
            <Tooltip text="Photo Capture Mode"><Camera size={11} weight="bold" /></Tooltip> Photo Mode
          </div>
          <p className="pm-header-shelf">
            {shelf?.name || 'Shelf 7'} <span>· {shelf?.category || 'Snacks & Biscuits'}</span>
          </p>
        </div>
        <div className="pm-header-progress">{completedCount}/{sections.length}</div>
      </div>

      {/* API Key Bar — only show when no key is set */}
      {!apiKey && (
        <div className="pm-apikey-bar">
          <button className="pm-apikey-toggle" onClick={() => setShowApiKey(!showApiKey)}>
            <Key size={14} weight="duotone" />
            <span>Set Gemini API Key</span>
            {showApiKey ? <CaretUp size={12} /> : <CaretDown size={12} />}
          </button>
          {showApiKey && (
            <div className="pm-apikey-input-wrap">
              <input
                type="password"
                className="pm-apikey-input"
                placeholder="Paste your Gemini API key (AIza...)..."
                value={apiKey}
                onChange={(e) => handleSaveApiKey(e.target.value)}
              />
            </div>
          )}
        </div>
      )}

      {/* Stepper */}
      <div className="pm-stepper">
        {sections.map((s, i) => {
          const isDone = states[i].status === 'result';
          const isActive = i === idx;
          const stepResult = llmResults[i];
          const isStepPass = isDone && stepResult?.status === 'OK';
          const isStepFail = isDone && stepResult?.status === 'NOT_OK';
          const isProc = states[i].status === 'processing';
          const cls = isActive ? 'active' : isStepPass ? 'pass' : isStepFail ? 'fail' : isProc ? 'processing' : 'pending';
          return (
            <React.Fragment key={i}>
              <button className="pm-step-btn" onClick={() => { setIdx(i); setUploadedImage(null); setUploadedFile(null); }}>
                <Tooltip text={`${s.name}${isDone ? (isStepPass ? ' — Passed' : ' — Issues') : ''}`}>
                  <div className={`pm-step ${cls}`}>
                    {isStepPass ? <CheckCircle size={14} weight="bold" />
                      : isStepFail ? <Warning size={14} weight="bold" />
                        : i + 1}
                  </div>
                </Tooltip>
              </button>
              {i < sections.length - 1 && <div className={`pm-step-line ${isDone ? 'done' : ''}`} />}
            </React.Fragment>
          );
        })}
      </div>

      {/* Content */}
      <div className="pm-content">
        <AnimatePresence mode="wait">
          <motion.div key={idx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.18 }}>

            {/* Section header */}
            <div className="pm-sec-header">
              <SectionIcon icon={sec.icon} size={18} />
              <div>
                <p className="pm-sec-label">Section {sec.id} of {sections.length}</p>
                <h2 className="pm-sec-name">{sec.name}</h2>
              </div>
            </div>

            {/* ── PENDING: Master Image + Camera/Upload ── */}
            {st.status === 'pending' && (
              <>
                {/* Side-by-side: Master + Inspection */}
                <div className="pm-compare-grid">

                  {/* LEFT: Master Reference (compact) */}
                  <div className="pm-compare-card">
                    <div className="pm-compare-card-header master">
                      <Eye size={12} weight="bold" />
                      <span>Master Reference</span>
                      <button onClick={() => setShowPlan(true)} className="pm-compare-expand-btn">
                        <MagnifyingGlassPlus size={11} weight="duotone" />
                      </button>
                    </div>
                    <div className="pm-compare-card-image">
                      <img src={sec.masterImage} alt={`Master - ${sec.name}`} />
                    </div>
                    <div className="pm-compare-card-tags">
                      {sec.expectedProducts?.slice(0, 4).map((p, j) => (
                        <span key={j} className="pm-expected-tag">{p}</span>
                      ))}
                      {sec.expectedProducts?.length > 4 && (
                        <span className="pm-expected-tag more">+{sec.expectedProducts.length - 4} more</span>
                      )}
                    </div>
                  </div>

                  {/* RIGHT: Inspection Input */}
                  <div className="pm-compare-card">
                    <div className="pm-compare-card-header inspection">
                      <Scan size={12} weight="bold" />
                      <span>Inspection Image</span>
                    </div>

                    {/* Camera viewfinder (Capture mode) */}
                    {inputMode === 'capture' && (
                      <div className="pm-compare-camera">
                        <video ref={videoRef} autoPlay playsInline muted className="pm-camera-video" />
                        {!hasCamera && (
                          <div className="pm-camera-fallback">
                            <Camera size={28} weight="duotone" />
                            <p>{cameraError || 'Initializing camera...'}</p>
                          </div>
                        )}
                        <div className="pm-camera-badge">
                          <span className="pm-camera-badge-dot" /> Live
                        </div>
                      </div>
                    )}

                    {/* Upload area (Upload mode) */}
                    {inputMode === 'upload' && (
                      <div className="pm-compare-upload">
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          capture="environment"
                          onChange={handleUpload}
                          style={{ display: 'none' }}
                        />
                        {!uploadedImage ? (
                          <div className="pm-compare-upload-empty" onClick={() => fileInputRef.current?.click()}>
                            <UploadSimple size={28} weight="duotone" />
                            <p>Tap to upload</p>
                            <p className="sub">Upload shelf photo</p>
                      </div>
                    ) : (
                      <div className="pm-compare-upload-preview">
                        <img src={uploadedImage} alt="Uploaded shelf" />
                        <button className="pm-upload-remove" onClick={() => { setUploadedImage(null); setUploadedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}>
                          <Trash size={12} weight="bold" /> Remove
                        </button>
                      </div>
                    )}
                      </div>
                    )}

                    {/* Mode Toggle below the image */}
                    <div className="pm-mode-toggle-compact">
                      <button
                        className={`pm-mode-tab-sm ${inputMode === 'capture' ? 'active' : ''}`}
                        onClick={() => setInputMode('capture')}
                      >
                        <Camera size={14} weight={inputMode === 'capture' ? 'fill' : 'duotone'} />
                        Capture
                      </button>
                      <button
                        className={`pm-mode-tab-sm ${inputMode === 'upload' ? 'active' : ''}`}
                        onClick={() => setInputMode('upload')}
                      >
                        <UploadSimple size={14} weight={inputMode === 'upload' ? 'fill' : 'duotone'} />
                        Upload
                      </button>
                    </div>
                  </div>
                  {/* end pm-compare-card inspection */}

                </div>
                {/* end pm-compare-grid */}
              </>
            )}

            {/* ── PROCESSING ── */}
            {st.status === 'processing' && (
              <div className="pm-analyze">
                <div className="pm-analyze-comparison">
                  <div className="pm-analyze-img-pair">
                    <div className="pm-analyze-img-box">
                      <span className="pm-analyze-img-label">Master</span>
                      <img src={sec.masterImage} alt="Master" />
                    </div>
                    <div className="pm-analyze-vs">
                      <ArrowsLeftRight size={20} weight="bold" />
                      <span>VS</span>
                    </div>
                    <div className="pm-analyze-img-box">
                      <span className="pm-analyze-img-label">Inspection</span>
                      {(uploadedImage || capturedFrame) ? (
                        <img src={uploadedImage || capturedFrame} alt="Inspection" />
                      ) : (
                        <div className="pm-analyze-cam-placeholder">
                          <Camera size={24} weight="duotone" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="pm-analyze-content">
                  <motion.div className="pm-analyze-ring"
                    animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}>
                    <Scan size={22} weight="duotone" />
                  </motion.div>
                  <h3>Analyzing with AI...</h3>
                  <p>Comparing inspection image against master reference</p>
                </div>
                <motion.div className="pm-analyze-scanline"
                  animate={{ top: ['0%', '100%', '0%'] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} />
              </div>
            )}

            {/* ── RESULT (both OK and NOT_OK) ── */}
            {st.status === 'result' && currentResult && (() => {
              const conf = Math.round((currentResult?.confidence || 0) * 100);
              const missingCount = currentResult?.missing_products?.length || 0;
              const misplacedCount = currentResult?.misplaced_products?.length || 0;
              const extraCount = currentResult?.extra_products?.length || 0;
              const totalIssues = missingCount + misplacedCount + extraCount;
              const confColor = isPass ? '#34d399' : conf > 70 ? '#fbbf24' : '#f87171';

              const productsFound = currentResult?.products_found || [];

              return (
                <motion.div className="pm-result-modern" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

                  {/* ── Side-by-side Image Comparison ── */}
                  <div className="pm-result-images">
                    <div className="pm-result-img-box">
                      <span className="pm-result-img-label master">Master</span>
                      <img src={sec.masterImage} alt="Master" />
                    </div>
                    <div className="pm-result-img-vs">VS</div>
                    <div className="pm-result-img-box">
                      <span className="pm-result-img-label inspection">Inspection</span>
                      <img src={uploadedImage || sec.masterImage} alt="Inspection" />
                    </div>
                  </div>

                  {/* ── Status Hero Banner ── */}
                  <div className={`pm-hero-card ${isPass ? 'pass' : 'fail'}`}>
                    <motion.div className="pm-hero-icon" initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', delay: 0.15, stiffness: 200 }}>
                      {isPass ? <ShieldCheck size={20} weight="fill" /> : <Warning size={20} weight="fill" />}
                    </motion.div>
                    <div className="pm-hero-text">
                      <h3>{isPass ? 'Section Clear' : `${totalIssues} Issue${totalIssues !== 1 ? 's' : ''} Found`}</h3>
                      <p>{currentResult?.summary || (isPass ? 'All products match the master reference' : 'Differences detected')}</p>
                    </div>
                    <div className="pm-hero-confidence">
                      <svg viewBox="0 0 36 36" className="pm-conf-ring">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="3.5" />
                        <motion.path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none" stroke={confColor} strokeWidth="3.5"
                          strokeLinecap="round"
                          initial={{ strokeDasharray: '0, 100' }}
                          animate={{ strokeDasharray: `${conf}, 100` }}
                          transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                        />
                      </svg>
                      <span className="pm-conf-value">{conf}%</span>
                    </div>
                  </div>

                  {/* ── Quick Stats Row ── */}
                  <div className="pm-stats-row">
                    <div className={`pm-stat-chip ${missingCount === 0 ? 'good' : 'bad'}`}>
                      <Package size={14} weight="bold" />
                      <span className="pm-stat-num">{missingCount}</span>
                      <span>Missing</span>
                    </div>
                    <div className={`pm-stat-chip ${misplacedCount === 0 ? 'good' : 'warn'}`}>
                      <ArrowsLeftRight size={14} weight="bold" />
                      <span className="pm-stat-num">{misplacedCount}</span>
                      <span>Misplaced</span>
                    </div>
                    <div className={`pm-stat-chip ${extraCount === 0 ? 'good' : 'warn'}`}>
                      <Warning size={14} weight="bold" />
                      <span className="pm-stat-num">{extraCount}</span>
                      <span>Extra</span>
                    </div>
                  </div>

                  {/* ── Products Found ── */}
                  {productsFound.length > 0 && (
                    <div className="pm-products-found">
                      <div className="pm-products-found-title">
                        <CheckCircle size={13} weight="bold" />
                        <span>{productsFound.length} Products Identified</span>
                      </div>
                      <div className="pm-products-found-tags">
                        {productsFound.map((p, i) => (
                          <span key={i} className="pm-product-tag">{p}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── Shelf-by-Shelf Visual ── */}
                  {currentResult?.shelf_analysis && Object.keys(currentResult.shelf_analysis).length > 0 && (
                    <div className="pm-shelf-visual">
                      {['top', 'eyeLevel', 'lower'].map(shelf => {
                        const sa = currentResult.shelf_analysis[shelf];
                        if (!sa) return null;
                        const ok = sa.status === 'OK';
                        return (
                          <div key={shelf} className={`pm-shelf-pill ${ok ? 'ok' : 'issue'}`}>
                            <div className="pm-shelf-pill-icon">
                              {ok ? <CheckCircle size={14} weight="fill" /> : <Warning size={14} weight="fill" />}
                            </div>
                            <div className="pm-shelf-pill-text">
                              <strong>{shelfLabels[shelf]}</strong>
                              <span>{sa.notes}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* ── Missing Products Cards ── */}
                  {missingCount > 0 && (
                    <div className="pm-issues-section">
                      <div className="pm-issues-title oos"><Package size={13} weight="bold" /> Missing Products ({missingCount})</div>
                      <div className="pm-issues-grid">
                        {currentResult.missing_products.map((item, i) => {
                          const key = `${idx}-m-${i}`;
                          const sent = isItemSent(key);
                          const selected = !!alertItems[key];
                          return (
                            <motion.div key={key}
                              className={`pm-issue-card oos ${selected ? 'selected' : ''} ${sent ? 'sent' : ''}`}
                              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                              onClick={() => !sent && toggleAlertItem(key)}
                              style={{ cursor: sent ? 'default' : 'pointer' }}>
                              <div className="pm-issue-select">
                                {sent ? <Check size={10} weight="bold" /> : selected ? <Check size={10} weight="bold" /> : null}
                              </div>
                              <div className="pm-issue-card-left">
                                <h4>{item.product}</h4>
                                <p>
                                  {item.expected_count && item.found_count !== undefined
                                    ? <><strong>{item.found_count}</strong>/{item.expected_count} found</>
                                    : 'Not found'}
                                </p>
                                {item.shelf && <span className="pm-issue-loc"><MapPin size={9} weight="fill" /> {shelfLabels[item.shelf] || item.shelf}</span>}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* ── Misplaced Products Cards ── */}
                  {misplacedCount > 0 && (
                    <div className="pm-issues-section">
                      <div className="pm-issues-title misplaced"><ArrowsLeftRight size={13} weight="bold" /> Misplaced Products ({misplacedCount})</div>
                      <div className="pm-issues-grid">
                        {currentResult.misplaced_products.map((item, i) => {
                          const key = `${idx}-mp-${i}`;
                          const sent = isItemSent(key);
                          const selected = !!alertItems[key];
                          return (
                            <motion.div key={key}
                              className={`pm-issue-card misplaced ${selected ? 'selected' : ''} ${sent ? 'sent' : ''}`}
                              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                              onClick={() => !sent && toggleAlertItem(key)}
                              style={{ cursor: sent ? 'default' : 'pointer' }}>
                              <div className="pm-issue-select">
                                {sent ? <Check size={10} weight="bold" /> : selected ? <Check size={10} weight="bold" /> : null}
                              </div>
                              <div className="pm-issue-card-left">
                                <h4>{item.product}</h4>
                                <p>{item.current_location} <ArrowRight size={10} /> <strong>{item.correct_location}</strong></p>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* ── Bulk Alert Actions ── */}
                  {totalIssues > 0 && (
                    <div className="pm-alert-bar">
                      <button className="pm-alert-select-all" onClick={selectAllAlerts}>
                        <CheckCircle size={12} weight="bold" /> Select All
                      </button>
                      <motion.button
                        className={`pm-alert-send-btn ${getSelectedCount() > 0 ? 'active' : ''}`}
                        onClick={sendAlerts}
                        disabled={getSelectedCount() === 0}
                        whileTap={{ scale: 0.97 }}>
                        <Bell size={14} weight="fill" />
                        Send Restock Alert {getSelectedCount() > 0 && `(${getSelectedCount()})`}
                      </motion.button>
                      <button className="pm-alert-whatsapp" onClick={() => {
                        const items = (currentResult.missing_products || []).map(p => `- ${p.product}`).join('\n');
                        const text = `🔔 Restock Alert — ${sec.name}\n\n${items}\n\nSection: ${shelf?.name || 'Shelf 7'}`;
                        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                      }}>
                        <WhatsappLogo size={16} weight="fill" />
                      </button>
                    </div>
                  )}

                  {/* ── Restock Actions ── */}
                  {currentResult?.restock_actions?.length > 0 && (
                    <div className="pm-actions-card">
                      <div className="pm-actions-card-title"><Wrench size={13} weight="bold" /> Recommended Actions</div>
                      {currentResult.restock_actions.map((action, i) => (
                        <div key={i} className="pm-action-item">
                          <span className="pm-action-num">{i + 1}</span>
                          <span>{action}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ── AI Reasoning (collapsible) ── */}
                  {currentResult?.reasoning && (
                    <details className="pm-reasoning-detail">
                      <summary><Scan size={12} weight="bold" /> AI Reasoning</summary>
                      <p>{currentResult.reasoning}</p>
                    </details>
                  )}

                  {/* ── Meta Footer ── */}
                  <div className="pm-meta-footer">
                    <span>{currentResult?.model}</span>
                    <span>{currentResult?.latencyMs ? `${(currentResult.latencyMs / 1000).toFixed(1)}s` : ''}</span>
                    {currentResult?.tokens?.total > 0 && <span>{currentResult.tokens.total} tokens</span>}
                  </div>

                  {/* ── Re-analyze Button ── */}
                  <button
                    className="pm-reanalyze-btn"
                    onClick={() => {
                      setStates(p => { const n = [...p]; n[idx] = { status: 'pending' }; return n; });
                      setLlmResults(prev => { const n = { ...prev }; delete n[idx]; return n; });
                    }}
                  >
                    <ArrowsLeftRight size={14} weight="bold" />
                    Re-analyze Section
                  </button>

                  {/* ── Navigation ── */}
                  {isLastSection ? (
                    <div className="pm-result-complete-summary">
                      <span className="pm-complete-stat pass"><CheckCircle size={13} weight="fill" /> {passCount} passed</span>
                      <span className="pm-complete-stat fail"><Warning size={13} weight="fill" /> {failCount} flagged</span>
                    </div>
                  ) : null}
                  <motion.button onClick={next} className={`pm-next-btn ${isPass ? 'pass-next' : ''}`} whileTap={{ scale: 0.98 }}>
                    {isLastSection
                      ? <>View Action Report <ArrowRight size={16} weight="bold" /></>
                      : <>Next Section <ArrowRight size={16} weight="bold" /></>}
                  </motion.button>

                </motion.div>
              );
            })()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Capture / Submit CTA */}
      {st.status === 'pending' && (
        <div className="pm-capture-bar">
          {inputMode === 'capture' ? (
            <motion.button
              onClick={capture}
              className="pm-capture-btn"
              whileTap={{ scale: 0.97 }}
              disabled={isAnalyzing || !apiKey}
            >
              <div className="pm-capture-btn-ring">
                {isAnalyzing ? <SpinnerGap size={20} weight="bold" className="pm-spin" /> : <Camera size={20} weight="fill" />}
              </div>
              {!apiKey ? 'Set API Key First' : `Capture & Analyze Section ${sec.id}`}
            </motion.button>
          ) : (
            <motion.button
              onClick={uploadedImage ? submitUpload : () => fileInputRef.current?.click()}
              className={`pm-capture-btn ${uploadedImage ? 'pm-capture-btn-upload-ready' : ''}`}
              whileTap={{ scale: 0.97 }}
              disabled={isAnalyzing || (uploadedImage && !apiKey)}
            >
              <div className="pm-capture-btn-ring">
                {isAnalyzing
                  ? <SpinnerGap size={20} weight="bold" className="pm-spin" />
                  : uploadedImage
                    ? <Scan size={20} weight="fill" />
                    : <UploadSimple size={20} weight="fill" />}
              </div>
              {uploadedImage
                ? (!apiKey ? 'Set API Key First' : `Analyze Section ${sec.id}`)
                : `Upload Section ${sec.id}`}
            </motion.button>
          )}
        </div>
      )}

      {/* Fullscreen master image */}
      <AnimatePresence>
        {showPlan && (
          <motion.div className="pm-fullplan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="pm-fullplan-header">
              <h3>Master Reference — {sec.name}</h3>
              <button onClick={() => setShowPlan(false)} className="pm-close" aria-label="Close">
                <Tooltip text="Close"><X size={15} weight="bold" /></Tooltip>
              </button>
            </div>
            <div className="pm-fullplan-body">
              <img src={sec.masterImage} alt={`Master - ${sec.name}`} style={{ width: '100%', height: 'auto' }} />
              <div className="pm-fullplan-products">
                <h4>Expected Products:</h4>
                <div className="pm-master-ref-tags">
                  {sec.expectedProducts?.map((p, j) => (
                    <span key={j} className="pm-expected-tag">{p}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
