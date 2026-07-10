import React, { useState, useEffect, useMemo, useRef, startTransition } from 'react';
import BottomMenu from '../components/bottomMenu';
import { useNavigate } from 'react-router-dom';
import { GrainGradient, Dithering } from '@paper-design/shaders-react';
import { motion, AnimatePresence } from 'framer-motion';

const HEADLINE =
  "Usman Khan is a product designer who centers experiences around creative expression, curiosity, and code experimentation.";

/** Header cascade runs on first Home mount after a page load; SPA returns to Home reuse the same simple fade. */
let homeHeaderIntroCompletedThisLoad = false;

export default function Home() {
  const navigate = useNavigate();
  const isFirstHeaderVisit = useMemo(() => !homeHeaderIntroCompletedThisLoad, []);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isMounted, setIsMounted] = useState(false);
  const [scrollGradientState, setScrollGradientState] = useState({
    gradientOpacity: 1,
    shaderInView: true,
    gradientProgress: 0,
    gradientScale: 0.5,
    gradientOffsetY: -0.3,
    gradientSoftness: 0.5,
    gradientIntensity: 0.75,
    gradientNoise: 0.25,
  });
  
  const [headerAnimationDone, setHeaderAnimationDone] = useState(
    () => homeHeaderIntroCompletedThisLoad
  );
  const [gradientOffsetX, setGradientOffsetX] = useState(0);
  const [gradientSpeed, setGradientSpeed] = useState(0.75);
  const DITHERING_TYPES = ['random', '2x2', '4x4', '8x8'] as const;
  const [gradientPanelExpanded, setGradientPanelExpanded] = useState(false);
  const [gradientPanelClosing, setGradientPanelClosing] = useState(false);
  const [gradientPanelMode, setGradientPanelMode] = useState<'settings' | 'colors'>('settings');
  const [projectsTab, setProjectsTab] = useState<'selected' | 'experiments'>('selected');
  const [hoverTab, setHoverTab] = useState<'selected' | 'experiments' | null>(null);
  const [hoverAvidReader, setHoverAvidReader] = useState(false);
  const tabBorderLength = 214;
  const [gradientColors, setGradientColors] = useState<string[]>(['#B5D9F5', '#C4BDF5', '#83CB9B', '#F5E9F5']);
  const [gradientColorBack, setGradientColorBack] = useState('#DEDAFA');
  const [shaderVariant, setShaderVariant] = useState<'grain' | 'dithering'>('grain');
  const [ditheringParams, setDitheringParams] = useState<{
    colorBack: string;
    colorFront: string;
    type: (typeof DITHERING_TYPES)[number];
    size: number;
    speed: number;
    rotation: number;
    offsetX: number;
    offsetY: number;
    scale: number;
  }>({
    colorBack: '#f1ffe0',
    colorFront: '#61c26b',
    type: '4x4',
    size: 2,
    speed: 1,
    rotation: 180,
    offsetX: 0,
    offsetY: -0.1,
    scale: 0.6,
  });
  const gradientPanelRef = useRef<HTMLDivElement>(null);
  const gradientPanelSettingsRef = useRef<HTMLDivElement>(null);
  const gradientPanelColorsRef = useRef<HTMLDivElement>(null);
  const [gradientPanelSettingsHeight, setGradientPanelSettingsHeight] = useState<number | null>(null);
  const [gradientPanelColorsHeight, setGradientPanelColorsHeight] = useState<number | null>(null);
  const lastScrollYRef = useRef(window.scrollY);
  const shaderInViewRef = useRef(true);
  const lastGradientProgressRef = useRef(-1);
  const gradientBaseRef = useRef({
    scale: 0.5,
    offsetY: -0.3,
    softness: 0.5,
    intensity: 0.75,
    noise: 0.35,
  });

  useEffect(() => {
    if (!gradientPanelExpanded || gradientPanelClosing) return;
    const handleMouseDown = (e: MouseEvent) => {
      if (gradientPanelRef.current && !gradientPanelRef.current.contains(e.target as Node)) {
        setGradientPanelClosing(true);
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [gradientPanelExpanded, gradientPanelClosing]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // One-time intro cascade: each element below fades in via its own transition delay
  // (headline, then subhead, then nav, then menu/cards). This effect just flips a flag shortly
  // after mount so those per-element animate targets change, and remembers that this load's
  // cascade has run so subsequent visits to Home render already-visible.
  useEffect(() => {
    if (!isFirstHeaderVisit) return;
    const tHeaderDone = setTimeout(() => {
      setHeaderAnimationDone(true);
      homeHeaderIntroCompletedThisLoad = true;
    }, 50);
    return () => clearTimeout(tHeaderDone);
  }, [isFirstHeaderVisit]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const scrollDelta = Math.abs(scrollY - lastScrollYRef.current);
      if (gradientPanelExpanded && !gradientPanelClosing && scrollDelta > 0) setGradientPanelClosing(true);
      lastScrollYRef.current = scrollY;
      const viewportHeight = window.innerHeight;

      const fadeEnd = viewportHeight * 0.3;
      const gradientProgress = Math.min(1, scrollY / fadeEnd);
      const opacityProgress = Math.min(1, scrollY / fadeEnd);

      // Hysteresis: mount gradient when scrollY < 1.45vh (early when scrolling up), unmount when scrollY > 1.22vh
      const mountThreshold = viewportHeight * 1.45;
      const unmountThreshold = viewportHeight * 1.22;
      const wasShaderInView = shaderInViewRef.current;
      let nextShaderInView = wasShaderInView;
      if (scrollY < mountThreshold) nextShaderInView = true;
      else if (scrollY > unmountThreshold) nextShaderInView = false;
      shaderInViewRef.current = nextShaderInView;
      const isMountingShader = nextShaderInView && !wasShaderInView;

      const base = gradientBaseRef.current;
      // Only update state when progress or shader visibility changed meaningfully (reduces re-renders)
      const progressRounded = Math.round(gradientProgress * 100) / 100;
      const lastProgress = lastGradientProgressRef.current;
      const progressChanged = lastProgress < 0 || Math.abs(progressRounded - lastProgress) >= 0.02;
      const visibilityChanged = nextShaderInView !== wasShaderInView;
      if (!progressChanged && !visibilityChanged) return;
      lastGradientProgressRef.current = progressRounded;

      const nextState = {
        shaderInView: nextShaderInView,
        gradientOpacity: 1 - opacityProgress,
        gradientProgress,
        gradientScale: base.scale + 0.3 * gradientProgress,
        gradientOffsetY: base.offsetY - 0.3 * gradientProgress,
        gradientSoftness: base.softness + 0.5 * gradientProgress,
        gradientIntensity: base.intensity + 0.25 * gradientProgress,
        gradientNoise: base.noise + 0.5 * gradientProgress,
      };

      const applyState = () =>
        startTransition(() => setScrollGradientState(nextState));

      if (isMountingShader && typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(applyState, { timeout: 100 });
      } else {
        applyState();
      }
    };

    // Throttle scroll: one rAF per frame for Safari
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', throttledScroll);
  }, [gradientPanelExpanded, gradientPanelClosing]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Responsive padding
  const padding = windowWidth < 768 ? 16 : windowWidth < 1024 ? 48 : 96;

  // Gradient panel expand animation: max width (responsive), then height to fit content
  const gradientPanelMaxWidth = Math.min(windowWidth * 0.9, 320);
  // Header padding: top, right, bottom, left (px)
  const gradientPanelHeaderPadding = '4px 4px 4px 6px';
  // Body padding: top, right, bottom, left (px)
  const gradientPanelBodyPadding = '12px 16px 16px 12px';

  // Measure both settings and colors content heights when panel opens or body padding changes (deferred so measure divs are mounted and laid out)
  useEffect(() => {
    if (!gradientPanelExpanded) return;
    const measure = (el: HTMLDivElement | null) => {
      if (!el) return null;
      const h = Math.max(el.getBoundingClientRect().height, el.scrollHeight) + 2;
      return h > 0 ? h : null;
    };
    const frameId = requestAnimationFrame(() => {
      if (!gradientPanelSettingsRef.current || !gradientPanelColorsRef.current) return;
      const sh = measure(gradientPanelSettingsRef.current);
      const ch = measure(gradientPanelColorsRef.current);
      if (sh != null) setGradientPanelSettingsHeight(sh);
      if (ch != null) setGradientPanelColorsHeight(ch);
    });
    return () => cancelAnimationFrame(frameId);
  }, [gradientPanelExpanded, gradientPanelBodyPadding]);

  // Reset measured heights when panel is fully closed
  useEffect(() => {
    if (!gradientPanelExpanded && !gradientPanelClosing) {
      setGradientPanelSettingsHeight(null);
      setGradientPanelColorsHeight(null);
    }
  }, [gradientPanelExpanded, gradientPanelClosing]);

  // Close panel on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (gradientPanelExpanded && !gradientPanelClosing) setGradientPanelClosing(true);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gradientPanelExpanded, gradientPanelClosing]);

  const gradientPanelContentHeight =
    (gradientPanelMode === 'settings' ? gradientPanelSettingsHeight : gradientPanelColorsHeight) ?? 380;

  const setScrollGradientParam = (
    key: 'gradientScale' | 'gradientOffsetY' | 'gradientSoftness' | 'gradientIntensity' | 'gradientNoise',
    value: number
  ) => {
    setScrollGradientState((prev) => ({ ...prev, [key]: value }));
    const base = gradientBaseRef.current;
    if (key === 'gradientScale') base.scale = value;
    else if (key === 'gradientOffsetY') base.offsetY = value;
    else if (key === 'gradientSoftness') base.softness = value;
    else if (key === 'gradientIntensity') base.intensity = value;
    else if (key === 'gradientNoise') base.noise = value;
  };
  const gradientParams = [
    { label: 'Speed', value: gradientSpeed, set: setGradientSpeed, min: 0, max: 2, step: 0.01 },
    { label: 'Scale', value: scrollGradientState.gradientScale, set: (v: number) => setScrollGradientParam('gradientScale', v), min: 0.2, max: 1.5, step: 0.01 },
    { label: 'Offset X', value: gradientOffsetX, set: setGradientOffsetX, min: -1, max: 1, step: 0.01 },
    { label: 'Offset Y', value: scrollGradientState.gradientOffsetY, set: (v: number) => setScrollGradientParam('gradientOffsetY', v), min: -1, max: 1, step: 0.01 },
    { label: 'Softness', value: scrollGradientState.gradientSoftness, set: (v: number) => setScrollGradientParam('gradientSoftness', v), min: 0, max: 1.5, step: 0.01 },
    { label: 'Intensity', value: scrollGradientState.gradientIntensity, set: (v: number) => setScrollGradientParam('gradientIntensity', v), min: 0, max: 1.5, step: 0.01 },
    { label: 'Noise', value: scrollGradientState.gradientNoise, set: (v: number) => setScrollGradientParam('gradientNoise', v), min: 0, max: 1.5, step: 0.01 },
  ];

  const gradientPanelHeader = (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: gradientPanelHeaderPadding, gap: 8, flexShrink: 0 }}>
      <button
        type="button"
        onClick={() => setGradientPanelClosing(true)}
        style={{
          padding: 6,
          border: 'none',
          background: 'none',
          color: 'inherit',
          cursor: 'pointer',
          fontSize: 'inherit',
          fontFamily: 'inherit',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        title="Close"
      >
        <span style={{ transition: 'transform 0.2s' }}>Gradient</span>
      </button>
      <div style={{ position: 'relative', display: 'flex', gap: 6, padding: 4, borderRadius: 8 }}>
        <motion.div
          transition={{ type: 'spring', stiffness: 700, damping: 35 }}
          style={{
            position: 'absolute',
            top: 4,
            left: 4,
            width: 24,
            height: 24,
            borderRadius: 4,
            background: 'var(--color-bg-scrim)',
            pointerEvents: 'none',
          }}
          animate={{ x: gradientPanelMode === 'settings' ? 0 : 30 }}
        />
        <button
          type="button"
          onClick={() => setGradientPanelMode('settings')}
          title="Settings"
          style={{
            width: 24,
            height: 24,
            padding: 0,
            border: 'none',
            background: 'transparent',
            borderRadius: 4,
            cursor: 'pointer',
            color: 'inherit',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img src="./settings.svg" width={14} height={14} alt="settings" style={{ display: 'block' }} />
        </button>
        <button
          type="button"
          onClick={() => setGradientPanelMode('colors')}
          title="Colors"
          style={{
            width: 24,
            height: 24,
            padding: 0,
            border: 'none',
            background: 'transparent',
            borderRadius: 4,
            cursor: 'pointer',
            color: 'inherit',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img src="./color-2.svg" width={14} height={14} alt="" style={{ display: 'block' }} />
        </button>
      </div>
    </div>
  );

  const gradientPanelBodyStyle = {
    borderTop: '1px solid var(--color-border-muted)' as const,
    padding: gradientPanelBodyPadding,
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: 12,
  };

  const ditheringParamSliders = [
    { label: 'Speed', value: ditheringParams.speed, set: (v: number) => setDitheringParams((p) => ({ ...p, speed: v })), min: 0, max: 2, step: 0.01 },
    { label: 'Scale', value: ditheringParams.scale, set: (v: number) => setDitheringParams((p) => ({ ...p, scale: v })), min: 0.2, max: 1.5, step: 0.01 },
    { label: 'Offset X', value: ditheringParams.offsetX, set: (v: number) => setDitheringParams((p) => ({ ...p, offsetX: v })), min: -1, max: 1, step: 0.01 },
    { label: 'Offset Y', value: ditheringParams.offsetY, set: (v: number) => setDitheringParams((p) => ({ ...p, offsetY: v })), min: -1, max: 1, step: 0.01 },
    { label: 'Rotation', value: ditheringParams.rotation, set: (v: number) => setDitheringParams((p) => ({ ...p, rotation: v })), min: 0, max: 360, step: 1 },
    { label: 'Size', value: ditheringParams.size, set: (v: number) => setDitheringParams((p) => ({ ...p, size: v })), min: 0.5, max: 20, step: 0.5 },
  ];

  const gradientPanelSettingsBody = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
        <span style={{ width: 72, flexShrink: 0 }}>Style</span>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
          <input
            type="radio"
            name="shaderVariant"
            checked={shaderVariant === 'grain'}
            onChange={() => setShaderVariant('grain')}
            style={{ accentColor: 'var(--color-accent)' }}
          />
          Grain gradient
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
          <input
            type="radio"
            name="shaderVariant"
            checked={shaderVariant === 'dithering'}
            onChange={() => setShaderVariant('dithering')}
            style={{ accentColor: 'var(--color-accent)' }}
          />
          Dithering
        </label>
      </div>
      {shaderVariant === 'grain' && (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {gradientParams.map(({ label, value, set, min, max, step }) => (
              <label key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 72, flexShrink: 0 }}>{label}</span>
                <input
                  type="range"
                  min={min}
                  max={max}
                  step={step}
                  value={value}
                  onChange={(e) => set(Number(e.target.value))}
                  style={{ flex: 1, minWidth: 0, width: 120, accentColor: 'var(--color-accent)' }}
                />
                <span style={{ width: 36, flexShrink: 0, textAlign: 'right', opacity: 0.85 }}>{value.toFixed(2)}</span>
              </label>
            ))}
          </div>
        </>
      )}
      {shaderVariant === 'dithering' && (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ditheringParamSliders.map(({ label, value, set, min, max, step }) => (
              <label key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 72, flexShrink: 0 }}>{label}</span>
                <input
                  type="range"
                  min={min}
                  max={max}
                  step={step}
                  value={value}
                  onChange={(e) => set(Number(e.target.value))}
                  style={{ flex: 1, minWidth: 0, width: 120, accentColor: 'var(--color-accent)' }}
                />
                <span style={{ width: 36, flexShrink: 0, textAlign: 'right', opacity: 0.85 }}>{typeof value === 'number' && value % 1 !== 0 ? value.toFixed(2) : value}</span>
              </label>
            ))}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            <span style={{ width: 72, flexShrink: 0 }}>Type</span>
            {DITHERING_TYPES.map((type) => (
              <label
                key={type}
                style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
              >
                <input
                  type="radio"
                  name="ditheringType"
                  checked={ditheringParams.type === type}
                  onChange={() => setDitheringParams((p) => ({ ...p, type }))}
                  style={{ accentColor: 'var(--color-accent)' }}
                />
                {type}
              </label>
            ))}
          </div>
        </>
      )}
    </div>
  );

  const gradientPanelColorsBody = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {shaderVariant === 'grain' && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 72, flexShrink: 0, fontSize: 12 }}>Back</span>
            <input
              type="color"
              value={gradientColorBack}
              onChange={(e) => setGradientColorBack(e.target.value)}
              style={{ width: 32, height: 24, padding: 0, border: '1px solid var(--color-border-input)', borderRadius: 4, cursor: 'pointer' }}
            />
            <span style={{ fontSize: 11, opacity: 0.8 }}>{gradientColorBack}</span>
          </div>
          {gradientColors.map((color, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 72, flexShrink: 0, fontSize: 12 }}>Color {i + 1}</span>
              <input
                type="color"
                value={color}
                onChange={(e) => {
                  const next = [...gradientColors];
                  next[i] = e.target.value;
                  setGradientColors(next);
                }}
                style={{ width: 32, height: 24, padding: 0, border: '1px solid var(--color-border-input)', borderRadius: 4, cursor: 'pointer' }}
              />
              <span style={{ fontSize: 11, opacity: 0.8 }}>{color}</span>
            </div>
          ))}
        </>
      )}
      {shaderVariant === 'dithering' && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 72, flexShrink: 0, fontSize: 12 }}>Back</span>
            <input
              type="color"
              value={ditheringParams.colorBack}
              onChange={(e) => setDitheringParams((p) => ({ ...p, colorBack: e.target.value }))}
              style={{ width: 32, height: 24, padding: 0, border: '1px solid var(--color-border-input)', borderRadius: 4, cursor: 'pointer' }}
            />
            <span style={{ fontSize: 11, opacity: 0.8 }}>{ditheringParams.colorBack}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 72, flexShrink: 0, fontSize: 12 }}>Front</span>
            <input
              type="color"
              value={ditheringParams.colorFront}
              onChange={(e) => setDitheringParams((p) => ({ ...p, colorFront: e.target.value }))}
              style={{ width: 32, height: 24, padding: 0, border: '1px solid var(--color-border-input)', borderRadius: 4, cursor: 'pointer' }}
            />
            <span style={{ fontSize: 11, opacity: 0.8 }}>{ditheringParams.colorFront}</span>
          </div>
        </>
      )}
    </div>
  );

  const gradientPanelContentSettings = (
    <>
      {gradientPanelHeader}
      <div style={gradientPanelBodyStyle}>{gradientPanelSettingsBody}</div>
    </>
  );

  const gradientPanelContentColors = (
    <>
      {gradientPanelHeader}
      <div style={gradientPanelBodyStyle}>{gradientPanelColorsBody}</div>
    </>
  );

  const gradientPanelContent = (
    <>
      {gradientPanelHeader}
      <div style={gradientPanelBodyStyle}>
        <AnimatePresence mode="wait" initial={false}>
          {gradientPanelMode === 'settings' ? (
            <motion.div
              key="settings"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
            >
              {gradientPanelSettingsBody}
            </motion.div>
          ) : (
            <motion.div
              key="colors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
            >
              {gradientPanelColorsBody}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );

  return (
    <div>
      
      <div
        ref={gradientPanelRef}
        style={{
          position: 'fixed',
          bottom: 24,
          left: 24,
          zIndex: 100000,
          width: 'fit-content',
          transition: 'opacity 0.4s ease-out',
          background: 'var(--color-bg-panel)',
          padding: 0,
          borderRadius: 8,
          border: '1px solid var(--color-border)',
          color: 'var(--color-text)',
          fontFamily: '"Instrument Sans", sans-serif',
          fontSize: 12,
          overflow: 'hidden',
        }}
      >
        {gradientPanelExpanded && (
          <>
            <div
              ref={gradientPanelSettingsRef}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: gradientPanelMaxWidth,
                visibility: 'hidden',
                pointerEvents: 'none',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {gradientPanelContentSettings}
            </div>
            <div
              ref={gradientPanelColorsRef}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: gradientPanelMaxWidth,
                visibility: 'hidden',
                pointerEvents: 'none',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {gradientPanelContentColors}
            </div>
          </>
        )}
        {(gradientPanelExpanded || gradientPanelClosing) && gradientPanelContentHeight > 0 ? (
          <div style={{ position: 'relative', alignSelf: 'flex-start' }}>
            <motion.div
              initial={{ width: 32, height: 32 }}
              animate={
                gradientPanelClosing
                  ? { width: 32, height: 32 }
                  : { width: gradientPanelMaxWidth, height: gradientPanelContentHeight }
              }
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              onAnimationComplete={() => {
                if (gradientPanelClosing) {
                  setGradientPanelExpanded(false);
                  setGradientPanelClosing(false);
                }
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                boxSizing: 'border-box',
              }}
            >
              <div
                style={{
                  opacity: gradientPanelClosing ? 0 : 1,
                  transition: gradientPanelClosing ? 'none' : 'opacity 0.1s ease-out',
                  flex: 1,
                  minHeight: 0,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {gradientPanelContent}
              </div>
            </motion.div>
            {gradientPanelClosing && (
              <button
                type="button"
                onClick={() => {
                  setGradientPanelClosing(false);
                  setGradientPanelExpanded(true);
                }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  zIndex: 1,
                  padding: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  background: 'none',
                  color: 'inherit',
                  cursor: 'pointer',
                  fontSize: 'inherit',
                  fontFamily: 'inherit',
                }}
                title="Gradient controls"
              >
                <img src="/gradient-logo-2.svg" alt="" width={14} height={14} style={{ flexShrink: 0 }} aria-hidden />
              </button>
            )}
          </div>
        ) : !gradientPanelExpanded && !gradientPanelClosing ? (
          <button
            type="button"
            onClick={() => setGradientPanelExpanded(true)}
            style={{
              padding: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              background: 'none',
              color: 'inherit',
              cursor: 'pointer',
              fontSize: 'inherit',
              fontFamily: 'inherit',
            }}
            title="Gradient controls"
          >
            <img src="/gradient-logo-2.svg" alt="gradient controls" width={14} height={14} style={{ flexShrink: 0 }} aria-hidden />
          </button>
        ) : null}
      </div>
     

      <motion.div
        initial={
          isFirstHeaderVisit
            ? { opacity: 0, y: -8 }
            : { opacity: 0, y: 0 }
        }
        animate={
          isFirstHeaderVisit
            ? {
                opacity: headerAnimationDone ? 1 : 0,
                y: headerAnimationDone ? 0 : -8,
              }
            : {
                opacity: 1,
                y: 0,
              }
        }
        transition={{ duration: 0.75, delay: 0, ease: 'easeInOut' }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100vw', position: 'fixed', zIndex: -1, transform: 'translateZ(0)', WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden', contain: 'layout paint' }}
      >
        <div
          style={{
            height: '100vh',
            width: '100vw',
            maskImage: 'linear-gradient(to bottom, oklch(0 0 0 / 1) 0%, oklch(0 0 0 / 0.2) 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, oklch(0 0 0 / 1) 0%, oklch(0 0 0 / 0) 100%)',
            opacity: scrollGradientState.gradientOpacity,
            transition: 'opacity 0.12s ease-out',
            transform: 'translateZ(0)',
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden',
            contain: 'paint',
          }}
        >
          <div style={{ transform: 'translateZ(0)', WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden', height: '100%', width: '100%', contain: 'paint' }}>
            {scrollGradientState.shaderInView && shaderVariant === 'grain' && (
              <GrainGradient
                speed={gradientSpeed}
                scale={scrollGradientState.gradientScale}
                rotation={0}
                offsetX={gradientOffsetX}
                offsetY={scrollGradientState.gradientOffsetY}
                softness={scrollGradientState.gradientSoftness}
                intensity={scrollGradientState.gradientIntensity}
                noise={scrollGradientState.gradientNoise}
                shape="wave"
                colors={gradientColors}
                colorBack={gradientColorBack}
                style={{ height: '100vh', width: '100vw' }}
                maxPixelCount={1920 * 1080}
                
              />
            )}
            {scrollGradientState.shaderInView && shaderVariant === 'dithering' && (
              <Dithering
                width={windowWidth}
                height={window.innerHeight}
                colorBack={ditheringParams.colorBack}
                colorFront={ditheringParams.colorFront}
                shape="wave"
                type={ditheringParams.type}
                size={ditheringParams.size}
                speed={ditheringParams.speed}
                rotation={ditheringParams.rotation}
                offsetX={ditheringParams.offsetX}
                offsetY={ditheringParams.offsetY - 0.3 * scrollGradientState.gradientProgress}
                scale={ditheringParams.scale + 0.3 * scrollGradientState.gradientProgress}
                style={{ height: '100vh', width: '100vw' }}
              />
            )}
          </div>
        </div>
      </motion.div>

      <div style={{ paddingLeft: padding, paddingRight: padding }}>
        {isFirstHeaderVisit ? (
          <motion.div
            initial={{ opacity: 0, y: -8, filter: 'blur(5px)' }}
            animate={{ opacity: headerAnimationDone ? 1 : 0, y: headerAnimationDone ? 0 : -8, filter: headerAnimationDone ? 'blur(0px)' : 'blur(5px)' }}
            transition={{ duration: 0.5, delay: 0.25, ease: 'easeInOut' }}
            style={{ pointerEvents: headerAnimationDone ? 'auto' : 'none' }}
          >
            <BottomMenu />
          </motion.div>
        ) : (
          <div>
            <BottomMenu />
          </div>
        )}
        <div style={{ height: '40vh', flexShrink: 0 }} aria-hidden />
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 600,
            margin: '0 auto',
            marginBottom: 96,
            display: 'flex',
            flexDirection: 'column',
            gap: 96
          }}
        >
          <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
            <motion.div
              initial={{ opacity: 0, y: -8, filter: 'blur(5px)' }}
              animate={{ opacity: headerAnimationDone ? 1 : 0, y: headerAnimationDone ? 0 : -8, filter: headerAnimationDone ? 'blur(0px)' : 'blur(5px)' }}
              transition={{ duration: 0.5, delay: 0.1, ease: 'easeInOut' }}
            >
              <h1
                style={{
                  boxSizing: 'border-box',
                  color: 'var(--color-text)',
                  fontFamily: 'AspektaVF',
                  fontSize: '16px',
                  fontWeight: '500',
                  height: 'fit-content',
                  lineHeight: '24px',
                  textAlign: 'left',
                  margin: 0,
                }}
              >
                {HEADLINE}
              </h1>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -8, filter: 'blur(5px)' }}
              animate={{ opacity: headerAnimationDone ? 1 : 0, y: headerAnimationDone ? 0 : -8, filter: headerAnimationDone ? 'blur(0px)' : 'blur(5px)' }}
              transition={{ duration: 0.5, delay: 0.35, ease: 'easeInOut' }}
            >
              <p
              style={{
                margin: 0,
                color: 'var(--color-text)',
                fontFamily: '"AspektaVF", sans-serif',
                fontSize: 16,
                lineHeight: '23px',
                maxWidth: '600px',
              }}
            >
              Previously, he's worked at companies like Intapp, IBM, and argodesign. In his everyday life, he's an{' '}
              <a
                href="https://usmankhanusmankhan.github.io/reading-journal/"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setHoverAvidReader(true)}
                onMouseLeave={() => setHoverAvidReader(false)}
                style={{
                  position: 'relative',
                  color: 'inherit',
                  textDecoration: 'none',
                  fontWeight: hoverAvidReader ? 500 : 400,
                  transition: 'font-weight 0.25s ease',
                  padding: '1px 4px',
                  margin: '0 -4px',
                }}
              >
                <svg
                  style={{
                    position: 'absolute',
                    inset: '-2px -4px',
                    width: 'calc(100% + 8px)',
                    height: 'calc(100% + 4px)',
                    pointerEvents: 'none',
                    overflow: 'visible',
                    zIndex: -1,
                    opacity: hoverAvidReader ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                  }}
                  viewBox="0 0 100 36"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  <defs>
                    <filter id="avid-reader-glow" x="-100%" y="-100%" width="400%" height="400%">
                      <feGaussianBlur in="SourceGraphic" stdDeviation="28" result="blur" />
                      <feFlood floodColor="oklch(0.5 0.13 145)" floodOpacity="0.4" result="glowColor" />
                      <feComposite in="glowColor" in2="blur" operator="in" result="softGlow" />
                      <feMerge>
                        <feMergeNode in="softGlow" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <ellipse
                    cx="50"
                    cy="18"
                    rx="48"
                    ry="16"
                    fill="var(--color-bg-list)"
                    opacity={0.95}
                    filter="url(#avid-reader-glow)"
                  />
                </svg>
                <span style={{ position: 'relative', zIndex: 1 }}>avid reader</span>
              </a>
              {' '}and he expresses himself through coding, stream-of-consciousness writing, and digital art.
            </p>
            </motion.div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <motion.div
              initial={{ opacity: 0, y: -8, filter: 'blur(5px)' }}
              animate={{ opacity: headerAnimationDone ? 1 : 0, y: headerAnimationDone ? 0 : -8, filter: headerAnimationDone ? 'blur(0px)' : 'blur(5px)' }}
              transition={{ duration: 0.5, delay: 0.45, ease: 'easeInOut' }}
              style={{ display: 'flex', gap: 0, alignItems: 'center' }}
            >
              <button
                type="button"
                onClick={() => setProjectsTab('selected')}
                onMouseEnter={() => setHoverTab('selected')}
                onMouseLeave={() => setHoverTab(null)}
                style={{
                  position: 'relative',
                  padding: '6px 12px',
                  margin: 0,
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontFamily: '"AspektaVF", sans-serif',
                  fontSize: 14,
                  fontWeight: 500,
                  color: 'var(--color-text)',
                }}
              >
                <svg
                  style={{
                    position: 'absolute',
                    inset: '2px 4px',
                    width: 'calc(100% - 8px)',
                    height: 'calc(100% - 4px)',
                    pointerEvents: 'none',
                    overflow: 'visible',
                    zIndex: 0,
                    opacity: (projectsTab === 'selected' || hoverTab === 'selected') ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                  }}
                  viewBox="0 0 100 36"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  <defs>
                    <filter id="tab-glow" x="-100%" y="-100%" width="400%" height="400%">
                      <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur" />
                      <feFlood floodColor="oklch(0.5 0.13 145)" floodOpacity="0.4" result="glowColor" />
                      <feComposite in="glowColor" in2="blur" operator="in" result="softGlow" />
                      <feMerge>
                        <feMergeNode in="softGlow" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <ellipse
                    cx="50"
                    cy="18"
                    rx="48"
                    ry="16"
                    fill="var(--color-bg-list)"
                    opacity={0.95}
                    filter="url(#tab-glow)"
                  />
                  <path
                    d="M 50 2 A 48 16 0 0 1 98 18 A 48 16 0 0 1 50 34 A 48 16 0 0 1 2 18 A 48 16 0 0 1 50 2"
                    fill="none"
                    stroke="var(--color-text)"
                    strokeWidth="1.5"
                    pathLength={tabBorderLength}
                    strokeDasharray={tabBorderLength}
                    style={{
                      opacity: projectsTab === 'selected' ? 1 : 0,
                      strokeDashoffset: projectsTab === 'selected' ? 0 : tabBorderLength,
                      transition: projectsTab === 'selected' ? 'opacity 0.3s ease, stroke-dashoffset 0.5s ease' : 'opacity 0.3s ease',
                    }}
                  />
                </svg>
                <span style={{ position: 'relative', zIndex: 1 }}>Selected</span>
              </button>
              <button
                type="button"
                onClick={() => setProjectsTab('experiments')}
                onMouseEnter={() => setHoverTab('experiments')}
                onMouseLeave={() => setHoverTab(null)}
                style={{
                  position: 'relative',
                  padding: '6px 14px',
                  margin: 0,
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontFamily: '"AspektaVF", sans-serif',
                  fontSize: 14,
                  fontWeight: 500,
                  color: 'var(--color-text)',
                }}
              >
                <svg
                  style={{
                    position: 'absolute',
                    inset: '2px 4px',
                    width: 'calc(100% - 8px)',
                    height: 'calc(100% - 4px)',
                    pointerEvents: 'none',
                    overflow: 'visible',
                    zIndex: 0,
                    opacity: (projectsTab === 'experiments' || hoverTab === 'experiments') ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                  }}
                  viewBox="0 0 100 36"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  <defs>
                    <filter id="tab-glow-exp" x="-100%" y="-100%" width="400%" height="400%">
                      <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur" />
                      <feFlood floodColor="oklch(0.5 0.13 145)" floodOpacity="0.4" result="glowColor" />
                      <feComposite in="glowColor" in2="blur" operator="in" result="softGlow" />
                      <feMerge>
                        <feMergeNode in="softGlow" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <ellipse
                    cx="50"
                    cy="18"
                    rx="48"
                    ry="16"
                    fill="var(--color-bg-list)"
                    opacity={0.95}
                    filter="url(#tab-glow-exp)"
                  />
                  <path
                    d="M 50 2 A 48 16 0 0 1 98 18 A 48 16 0 0 1 50 34 A 48 16 0 0 1 2 18 A 48 16 0 0 1 50 2"
                    fill="none"
                    stroke="var(--color-text)"
                    strokeWidth="1.5"
                    pathLength={tabBorderLength}
                    strokeDasharray={tabBorderLength}
                    style={{
                      opacity: projectsTab === 'experiments' ? 1 : 0,
                      strokeDashoffset: projectsTab === 'experiments' ? 0 : tabBorderLength,
                      transition: projectsTab === 'experiments' ? 'opacity 0.3s ease, stroke-dashoffset 0.5s ease' : 'opacity 0.3s ease',
                    }}
                  />
                </svg>
                <span style={{ position: 'relative', zIndex: 1 }}>Experiments</span>
              </button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -8, filter: 'blur(5px)' }}
              animate={{ opacity: headerAnimationDone ? 1 : 0, y: headerAnimationDone ? 0 : -8, filter: headerAnimationDone ? 'blur(0px)' : 'blur(5px)' }}
              transition={{ duration: 0.5, delay: 0.55, ease: 'easeInOut' }}
              style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%', position: 'relative', minHeight: 200 }}
              className="cards-grid cards-grid-single"
            >
              <AnimatePresence mode="wait" initial={false}>
                {projectsTab === 'selected' && (
                  <motion.div
                    key="selected"
                    initial={{ opacity: 0, filter: 'blur(5px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, filter: 'blur(5px)' }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    style={{ display: 'flex', flexDirection: 'column', gap: 48, width: '100%' }}
                  >
                  <div className="card" onClick={() => navigate('/reachoutpanel')}>
                    <div className="card-image card-image-medium">
                      <img src="./activator-playbook.webp" alt="Activator playbook" loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 16 }} />
                    </div>
                    <div className="card-content">
                      <div className="card-title">Business development playbook</div>
                      <div className="card-description">
                        Redefining how lawyers action business development opportunities through Intapp's agentic platform, Celeste
                      </div>
                    </div>
                  </div>
                  <div className="card" onClick={() => navigate('/signals-card-redesign')}>
                    <div className="card-image card-image-medium">
                      <img src="./reachoutpanel.webp" alt="Reach out panel" loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 16 }} />
                    </div>
                    <div className="card-content">
                      <div className="card-title">Intapp's visual patterns for AI</div>
                      <div className="card-description">
                        Audited and refreshed the visual identity of AI branding within Intapp's products.
                      </div>
                    </div>
                  </div>
                  <div className="card" onClick={() => navigate('/ibm-quantum')}>
                    <div className="card-image card-image-medium">
                      <img src="./reachoutpanel.webp" alt="Reach out panel" loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 16 }} />
                    </div>
                    <div className="card-content">
                      <div className="card-title">Embedded Celeste</div>
                      <div className="card-description">
                        Led design for integrating agentic capabilities in Intapp's flagship product, Dealcloud.
                      </div>
                    </div>
                  </div>
                  </motion.div>
                )}
                {projectsTab === 'experiments' && (
                  <motion.div
                    key="experiments"
                    initial={{ opacity: 0, filter: 'blur(5px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, filter: 'blur(5px)' }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    style={{ display: 'flex', flexDirection: 'column', gap: 40, width: '100%' }}
                  >
                  <div
                    className="card"
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="card-image card-image-large" style={{height: '400px', background: 'gray'}}>
                      image
                    </div>
                    <div className="card-content">
                      <div className="card-title">digital per.spectives</div>
                      <div className="card-description">
                        My collection of digital art and essays
                      </div>
                    </div>
                  </div>
                  
                  <div
                    className="card"
                    onClick={() => window.open('https://usmankhanusmankhan.github.io/reading-journal/', '_blank', 'noopener,noreferrer')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="card-image card-image-large">
                      <img src="./reading-journal.webp" alt="Usman's reading journal" loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 16 }} />
                    </div>
                    <div className="card-content">
                      <div className="card-title">Reading journal</div>
                      <div className="card-description">
                        My thoughts on everything I've read this year, using Matter.js
                      </div>
                    </div>
                  </div>
                  <div
                    className="card"
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="card-image card-image-large" style={{height: '400px', background: 'gray'}}>
                      image
                    </div>
                    <div className="card-content">
                      <div className="card-title">Digital Collager</div>
                      <div className="card-description">
                        Collaging on the web that feels tactile
                      </div>
                    </div>
                  </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}