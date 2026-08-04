import * as React from "react";
import { useNavigate, useBlocker, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import p5 from 'p5';
import BottomMenu from '../components/bottomMenu';
import { useBreakpoint, type Breakpoint } from '../hooks/useBreakpoint';
import { imageConfig, ImageConfig } from '../config/imageConfig';
import { professionalProjects, artProjects, experimentalProjects } from '../config/projectContent';
import artContent from '../config/artContent.json';

interface Point {
  x: number;
  y: number;
}

interface Camera {
  x: number;
  y: number;
  z: number;
}

function screenToCanvas(point: Point, camera: Camera): Point {
  return {
    x: point.x / camera.z - camera.x,
    y: point.y / camera.z - camera.y
  };
}

function canvasToScreen(point: Point, camera: Camera): Point {
  return {
    x: (point.x - camera.x) * camera.z,
    y: (point.y - camera.y) * camera.z
  };
}

interface Box {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
}

function getViewport(camera: Camera, box: Box): Box {
  const topLeft = screenToCanvas({ x: box.minX, y: box.minY }, camera);
  const bottomRight = screenToCanvas({ x: box.maxX, y: box.maxY }, camera);

  return {
    minX: topLeft.x,
    minY: topLeft.y,
    maxX: bottomRight.x,
    maxY: bottomRight.y,
    height: bottomRight.x - topLeft.x,
    width: bottomRight.y - topLeft.y
  };
}

const panBounds = {
  minX: -8000,
  maxX: 8000,
  minY: -8000,
  maxY: 8000
}

function panCamera(camera: Camera, dx: number, dy: number): Camera {
  return {
    x: Math.max(panBounds.minX, Math.min(panBounds.maxX, camera.x - dx / camera.z)),
    y: Math.max(panBounds.minY, Math.min(panBounds.maxY, camera.y - dy / camera.z)),
    z: camera.z
  };
}

function zoomCamera(camera: Camera, point: Point, dz: number): Camera {
  const zoom = Math.max(0.2, Math.min(3, camera.z - dz * camera.z));

  const p1 = screenToCanvas(point, camera);
  const p2 = screenToCanvas(point, { ...camera, z: zoom });

  return {
    x: camera.x + (p2.x - p1.x),
    y: camera.y + (p2.y - p1.y),
    z: zoom
  };
}

function zoomIn(camera: Camera, center: Point): Camera {
  const i = Math.round(camera.z * 100) / 25;
  const nextZoom = Math.min(3, (i + 1) * 0.25);
  return zoomCamera(camera, center, camera.z - nextZoom);
}

function zoomOut(camera: Camera, center: Point): Camera {
  const i = Math.round(camera.z * 100) / 25;
  const nextZoom = Math.max(0.2,(i - 1) * 0.25);
  return zoomCamera(camera, center, camera.z - nextZoom);
}

const DEFAULT_CAMERA: Camera = {
  x: 0,
  y: 0,
  z: 1
};

function resetCamera(): Camera {
  return DEFAULT_CAMERA;
}

// Detect device capabilities (Safari needs gentler throttle for smooth zoom/pan)
function getDeviceCapabilities() {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent) ||
    /iPhone|iPad|iPod/.test(navigator.userAgent) ||
    (navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome'));
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isLowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;
  const throttleMs = isLowEnd ? 32 : isSafari ? 24 : 16;
  return {
    isMobile,
    prefersReducedMotion,
    isLowEnd,
    throttleMs
  };
}

// Throttle utility
function throttle(func: Function, limit: number) {
  let inThrottle: boolean;
  return function(this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

const PROJECTS_EXIT_DURATION = 0.15;
const PROJECTS_EXIT_BLUR = 'blur(5px)';
const PROJECTS_EXIT_IMAGE_FILTER = 'blur(5px)';
const PROJECTS_FILTER_NONE = 'blur(0px)';

const ROW_GAP = 96; // vertical spacing between rows
const IMAGE_GAP = 96; // horizontal spacing between images within a row
const DEFAULT_IMAGE_DIMENSIONS = { width: 500, height: 500 };

type Viewport = { x: number; y: number };

/**
 * Interactive replacement for the fungrainy.webp hero image. Runs a small
 * p5 sketch in instance mode inside a plain div (mounted via foreignObject
 * so it can live inside the SVG canvas alongside the pan/zoom transform,
 * same trick already used for the video items below).
 *
 * Sizing comes from imageConfig's per-breakpoint dimensions for
 * "fungrainy.webp", same as before — the sketch just resizes its canvas
 * in place rather than tearing down and restarting the simulation
 * whenever the breakpoint or viewport changes.
 */
function FungrainyCanvas({ width, height }: { width: number; height: number }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const p5InstanceRef = React.useRef<p5 | null>(null);
  const sizeRef = React.useRef({ width, height });

  React.useEffect(() => {
    sizeRef.current = { width, height };
    p5InstanceRef.current?.resizeCanvas(width, height);
  }, [width, height]);

  React.useEffect(() => {
    if (!containerRef.current) return;

    const sketch = (p: p5) => {

      p.setup = () => {
        const { width: w, height: h } = sizeRef.current;
        let myFont = p.loadFont('./AspektaVF.ttf');
        p.createCanvas(w, h);
        p.pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
        p.background(200, 200, 200);
        p.textAlign(p.LEFT, p.TOP);
        p.textSize(40);
        p.textLeading(52);
        p.textFont('AspektaVF');
        p.text('Usman Khan uses design and code to turn complex enterprise problems into software anyone can use', 48, 48, 700);
      };

      p.draw = () => {
        const { width: w, height: h } = sizeRef.current;
      };

      p.mouseDragged = () => {
        p.fill(p.random(0, 250), p.random(0, 250), p.random(0, 250), 30);
        p.noStroke();
        p.ellipse(p.mouseX, p.mouseY, p.random(5, 25), p.random(5, 25));
      }
    };

    const instance = new p5(sketch, containerRef.current);
    p5InstanceRef.current = instance;

    return () => {
      instance.remove();
      p5InstanceRef.current = null;
    };
    // Intentionally run once: setup only runs on mount, dimension changes
    // are handled by the resizeCanvas effect above instead of restarting
    // the sketch (and its grain state) from scratch every time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '100%', overflow: 'hidden' }} />;
}

// Lays out a list of images left-to-right starting at (startX, topY).
// Returns the positioned images plus the row's height (tallest image in
// the row), so the caller can stack another row underneath it.
function layoutRow(
  entries: { href: string; id: string; link?: string; hoverText?: string; mediaType?: 'image' | 'video' }[],
  imageConfigMap: Map<string, ImageConfig>,
  breakpoint: Breakpoint,
  viewport: Viewport,
  startX: number,
  topY: number
) {
  let cursorX = startX;
  let rowHeight = 0;

  const items = entries.map(({ href, id, link, hoverText, mediaType }) => {
    const fileName = href.replace('./', '');
    const config = imageConfigMap.get(fileName);
    const dimensions = config
      ? config.dimensions[breakpoint](viewport)
      : DEFAULT_IMAGE_DIMENSIONS;

    const x = cursorX;
    const y = topY;
    cursorX += dimensions.width + IMAGE_GAP;
    rowHeight = Math.max(rowHeight, dimensions.height);

    return { href, id, link, hoverText, mediaType: mediaType ?? 'image', ...dimensions, x, y };
  });

  return { items, rowHeight };
}

type ListImage = {
  id: string;
  href: string;
  link?: string;
  hoverText?: string;
  mediaType?: 'image' | 'video';
  section: 'Professional' | 'Experimental' | 'Art';
};

/**
 * Runs once on first mount of the list view after a page load; returning to
 * it later within the same SPA session (canvas -> list -> canvas -> list)
 * skips the cascade and shows the content already visible, same pattern as
 * Home's header intro.
 */
let projectsListIntroCompletedThisLoad = false;

const PROJECTS_LIST_HEADLINE =
  "Usman Khan is a product designer who centers experiences around creative expression, curiosity, and code experimentation.";

function ProjectsListView({
  images,
  onSelect,
}: {
  images: ListImage[];
  onSelect: (img: ListImage) => void;
}) {
  // NOTE: `images`/`onSelect` aren't wired into this markup yet — the cards
  // below are the ones ported over verbatim. Swap them out for a map over
  // `images` (grouped by `section`) with `onClick={() => onSelect(img)}`
  // whenever you're ready to drive this from real project data.
  const navigate = useNavigate();
  const isFirstHeaderVisit = React.useMemo(() => !projectsListIntroCompletedThisLoad, []);
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
  const [headerAnimationDone, setHeaderAnimationDone] = React.useState(
    () => projectsListIntroCompletedThisLoad
  );
  const [projectsTab, setProjectsTab] = React.useState<'selected' | 'experiments'>('selected');
  const [hoverTab, setHoverTab] = React.useState<'selected' | 'experiments' | null>(null);
  const [hoverAvidReader, setHoverAvidReader] = React.useState(false);
  const tabBorderLength = 214;

  // One-time intro cascade: headline, then subhead, then tabs, then cards,
  // each via its own transition delay below. This just flips a flag shortly
  // after mount so those per-element animate targets change.
  React.useEffect(() => {
    if (!isFirstHeaderVisit) return;
    const tHeaderDone = setTimeout(() => {
      setHeaderAnimationDone(true);
      projectsListIntroCompletedThisLoad = true;
    }, 50);
    return () => clearTimeout(tHeaderDone);
  }, [isFirstHeaderVisit]);

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Responsive horizontal padding
  const padding = windowWidth < 768 ? 16 : windowWidth < 1024 ? 48 : 96;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      style={{
        position: 'absolute',
        inset: 0,
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        color: 'var(--color-text)',
      }}
    >
      <div
        style={{
          paddingLeft: padding,
          paddingRight: padding,
          paddingTop: 112, // clears the fixed navbar; see bottomMenu.module.css
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 600,
            margin: '0 auto',
            marginBottom: 96,
            display: 'flex',
            flexDirection: 'column',
            gap: 96,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <motion.div
              initial={{ opacity: 0, y: -8, filter: 'blur(5px)' }}
              animate={{
                opacity: headerAnimationDone ? 1 : 0,
                y: headerAnimationDone ? 0 : -8,
                filter: headerAnimationDone ? 'blur(0px)' : 'blur(5px)',
              }}
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
                {PROJECTS_LIST_HEADLINE}
              </h1>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -8, filter: 'blur(5px)' }}
              animate={{
                opacity: headerAnimationDone ? 1 : 0,
                y: headerAnimationDone ? 0 : -8,
                filter: headerAnimationDone ? 'blur(0px)' : 'blur(5px)',
              }}
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
                Previously, he's worked at companies like Intapp, IBM, and argodesign. In his everyday life, he's
                an{' '}
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
                      <filter id="avid-reader-glow-list" x="-100%" y="-100%" width="400%" height="400%">
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
                      filter="url(#avid-reader-glow-list)"
                    />
                  </svg>
                  <span style={{ position: 'relative', zIndex: 1 }}>avid reader</span>
                </a>{' '}
                and he expresses himself through coding, stream-of-consciousness writing, and digital art.
              </p>
            </motion.div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <motion.div
              initial={{ opacity: 0, y: -8, filter: 'blur(5px)' }}
              animate={{
                opacity: headerAnimationDone ? 1 : 0,
                y: headerAnimationDone ? 0 : -8,
                filter: headerAnimationDone ? 'blur(0px)' : 'blur(5px)',
              }}
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
                    opacity: projectsTab === 'selected' || hoverTab === 'selected' ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                  }}
                  viewBox="0 0 100 36"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  <defs>
                    <filter id="tab-glow-list" x="-100%" y="-100%" width="400%" height="400%">
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
                    filter="url(#tab-glow-list)"
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
                      transition:
                        projectsTab === 'selected'
                          ? 'opacity 0.3s ease, stroke-dashoffset 0.5s ease'
                          : 'opacity 0.3s ease',
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
                    opacity: projectsTab === 'experiments' || hoverTab === 'experiments' ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                  }}
                  viewBox="0 0 100 36"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  <defs>
                    <filter id="tab-glow-exp-list" x="-100%" y="-100%" width="400%" height="400%">
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
                    filter="url(#tab-glow-exp-list)"
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
                      transition:
                        projectsTab === 'experiments'
                          ? 'opacity 0.3s ease, stroke-dashoffset 0.5s ease'
                          : 'opacity 0.3s ease',
                    }}
                  />
                </svg>
                <span style={{ position: 'relative', zIndex: 1 }}>Experiments</span>
              </button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -8, filter: 'blur(5px)' }}
              animate={{
                opacity: headerAnimationDone ? 1 : 0,
                y: headerAnimationDone ? 0 : -8,
                filter: headerAnimationDone ? 'blur(0px)' : 'blur(5px)',
              }}
              transition={{ duration: 0.5, delay: 0.55, ease: 'easeInOut' }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 24,
                width: '100%',
                position: 'relative',
                minHeight: 200,
              }}
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
                        <img
                          src="./activator-playbook.webp"
                          alt="Activator playbook"
                          loading="lazy"
                          decoding="async"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 16 }}
                        />
                      </div>
                      <div className="card-content">
                        <div className="card-title">Business development playbook</div>
                        <div className="card-description">
                          Redefining how lawyers action business development opportunities through Intapp's
                          agentic platform, Celeste
                        </div>
                      </div>
                    </div>
                    <div className="card" onClick={() => navigate('/signals-card-redesign')}>
                      <div className="card-image card-image-medium">
                        <img
                          src="./reachoutpanel.webp"
                          alt="Reach out panel"
                          loading="lazy"
                          decoding="async"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 16 }}
                        />
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
                        <img
                          src="./reachoutpanel.webp"
                          alt="Reach out panel"
                          loading="lazy"
                          decoding="async"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 16 }}
                        />
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
                    <div className="card" style={{ cursor: 'pointer' }}>
                      <div className="card-image card-image-large" style={{ height: '400px', background: 'gray' }}>
                        image
                      </div>
                      <div className="card-content">
                        <div className="card-title">digital per.spectives</div>
                        <div className="card-description">My collection of digital art and essays</div>
                      </div>
                    </div>
                    <div
                      className="card"
                      onClick={() =>
                        window.open(
                          'https://usmankhanusmankhan.github.io/reading-journal/',
                          '_blank',
                          'noopener,noreferrer'
                        )
                      }
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="card-image card-image-large">
                        <img
                          src="./reading-journal.webp"
                          alt="Usman's reading journal"
                          loading="lazy"
                          decoding="async"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 16 }}
                        />
                      </div>
                      <div className="card-content">
                        <div className="card-title">Reading journal</div>
                        <div className="card-description">
                          My thoughts on everything I've read this year, using Matter.js
                        </div>
                      </div>
                    </div>
                    <div className="card" style={{ cursor: 'pointer' }}>
                      <div className="card-image card-image-large" style={{ height: '400px', background: 'gray' }}>
                        image
                      </div>
                      <div className="card-content">
                        <div className="card-title">Digital Collager</div>
                        <div className="card-description">Collaging on the web that feels tactile</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProjectsPage() {
  const navigate = useNavigate();
  const ref = React.useRef<SVGSVGElement>(null);
  const [camera, setCamera] = React.useState(DEFAULT_CAMERA);
  const capabilities = React.useMemo(() => getDeviceCapabilities(), []);
  const breakpoint = useBreakpoint();
  const [isMounted, setIsMounted] = React.useState(false);
  const [artworkMounted, setArtworkMounted] = React.useState(false);
  const [isExiting, setIsExiting] = React.useState(false);
  // viewMode lives in the URL (?view=list) rather than local state, so a
  // link can be shared with either default baked in. No param = 'canvas'.
  const [urlParams, setUrlParams] = useSearchParams();
  const viewMode: 'canvas' | 'list' = urlParams.get('view') === 'list' ? 'list' : 'canvas';
  const setViewMode = React.useCallback(
    (mode: 'canvas' | 'list') => {
      setUrlParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (mode === 'list') {
            next.set('view', 'list');
          } else {
            next.delete('view'); // keep the default (canvas) URL clean
          }
          return next;
        },
        { replace: true } // don't spam browser history on every toggle
      );
    },
    [setUrlParams]
  );

  // Reset the camera whenever the user switches back to canvas from list,
  // so it always lands the way it looked on first load rather than wherever
  // it was left before the user navigated away. This fires directly off the
  // switch action itself, not off a URL change, so it doesn't depend on the
  // URL actually differing before/after.
  const handleViewModeChange = React.useCallback(
    (mode: 'canvas' | 'list') => {
      if (mode === 'canvas' && viewMode === 'list') {
        setCamera(DEFAULT_CAMERA);
      }
      setViewMode(mode);
    },
    [viewMode, setViewMode]
  );

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      currentLocation.pathname === '/projects' &&
      nextLocation.pathname !== '/projects'
  );

  const blockerRef = React.useRef(blocker);
  blockerRef.current = blocker;

  React.useEffect(() => {
    if (blocker.state === 'blocked') {
      setIsExiting(true);
      const ms = capabilities.prefersReducedMotion ? 0 : Math.round(PROJECTS_EXIT_DURATION * 1000);
      const t = window.setTimeout(() => blockerRef.current.proceed?.(), ms);
      return () => window.clearTimeout(t);
    }
    if (blocker.state === 'unblocked') {
      setIsExiting(false);
    }
  }, [blocker.state, capabilities.prefersReducedMotion]);

  // Throttled window dimensions with resize listener
  const [windowSize, setWindowSize] = React.useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  React.useEffect(() => {
    // Trigger mount animation: grid fades in first (no delay), then cover (0.3s), then artwork (0.85s)
    setIsMounted(true);
    const artworkTimer = setTimeout(() => {
      setArtworkMounted(true);
    }, 850);
    
    return () => clearTimeout(artworkTimer);
  }, []);

  React.useEffect(() => {
    const throttledResize = throttle(() => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }, 150);

    window.addEventListener("resize", throttledResize);
    return () => window.removeEventListener("resize", throttledResize);
  }, []);

  // Store initial viewport dimensions
  const [initialDimensions] = React.useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // Fixed center and viewport
  const center = React.useMemo(() => ({
    x: initialDimensions.width / 2,
    y: initialDimensions.height / 2
  }), []);

  const initialViewport = React.useMemo(() => ({
    x: initialDimensions.width,
    y: initialDimensions.height
  }), []);

  // Memoize transform: scale then translate3d for Safari GPU compositor (same order as original)
  const transform = React.useMemo(
    () => `scale(${camera.z}) translate3d(${camera.x}px, ${camera.y}px, 0)`,
    [camera.z, camera.x, camera.y]
  );

  // Touch event support for mobile
  React.useEffect(() => {
    if (!capabilities.isMobile || viewMode !== 'canvas') return;

    let touchStart: { x: number; y: number } | null = null;
    let lastTouch: { x: number; y: number } | null = null;
    let initialDistance = 0;
    let initialZoom = 1;

    function handleTouchStart(e: TouchEvent) {
      if (e.touches.length === 1) {
        touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        lastTouch = touchStart;
      } else if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        initialDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        initialZoom = camera.z;
      }
    }

    function handleTouchMove(e: TouchEvent) {
      e.preventDefault();
      
      if (e.touches.length === 1 && touchStart) {
        const touch = e.touches[0];
        const dx = touch.clientX - (lastTouch?.x || touchStart.x);
        const dy = touch.clientY - (lastTouch?.y || touchStart.y);
        
        setCamera((camera) => panCamera(camera, dx, dy));
        lastTouch = { x: touch.clientX, y: touch.clientY };
      } else if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        
        const scale = distance / initialDistance;
        const newZoom = Math.max(0.2, Math.min(3, initialZoom * scale));
        
        setCamera((camera) => ({
          ...camera,
          z: newZoom
        }));
      }
    }

    function handleTouchEnd() {
      touchStart = null;
      lastTouch = null;
    }

    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [capabilities.isMobile, camera.z, viewMode]);

  // Coalesce wheel events into a single camera update per animation frame.
  // Accumulating deltas (instead of time-throttling and dropping events) keeps
  // pan/zoom smooth and loses no input, which matters most on WebKit-based
  // browsers (Safari, DuckDuckGo on macOS) that don't GPU-composite SVG transforms.
  React.useEffect(() => {
    let rafId: number | null = null;
    let panDx = 0;
    let panDy = 0;
    let zoomDelta = 0;
    let zoomPoint: Point | null = null;

    function flush() {
      rafId = null;
      const dx = panDx;
      const dy = panDy;
      const dz = zoomDelta;
      const point = zoomPoint;
      panDx = 0;
      panDy = 0;
      zoomDelta = 0;
      zoomPoint = null;

      setCamera((camera) => {
        let next = camera;
        if (dz !== 0 && point) {
          next = zoomCamera(next, point, dz / 100);
        }
        if (dx !== 0 || dy !== 0) {
          next = panCamera(next, dx, dy);
        }
        return next;
      });
    }

    function handleWheel(event: WheelEvent) {
      if (viewMode !== 'canvas') return;

      if (capabilities.prefersReducedMotion) {
        event.preventDefault();
        return;
      }

      event.preventDefault();

      if (event.ctrlKey) {
        zoomDelta += event.deltaY;
        zoomPoint = { x: event.clientX, y: event.clientY };
      } else {
        panDx += event.deltaX;
        panDy += event.deltaY;
      }

      if (rafId === null) {
        rafId = requestAnimationFrame(flush);
      }
    }

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [capabilities.prefersReducedMotion, viewMode]);

  // Fixed dependency array
  React.useEffect(() => {
    function handleArrowKeys(event: KeyboardEvent) {
      if (viewMode !== 'canvas') return;
      if (event.key === "ArrowRight") {
        setCamera((camera) => panCamera(camera, 50, 0));
      } else if (event.key === "ArrowLeft") {
        setCamera((camera) => panCamera(camera, -50, 0));
      } else if (event.key === "ArrowUp") {
        setCamera((camera) => panCamera(camera, 0, -50));
      } else if (event.key === "ArrowDown") {
        setCamera((camera) => panCamera(camera, 0, 50));  
      }
    }

    function handleZoomKeys(event: KeyboardEvent) {
      if (viewMode !== 'canvas') return;
      if (event.key === "+" || event.key === "=") {
        setCamera((camera) => zoomIn(camera, center));
      } else if (event.key === "-" || event.key === "_") {
        setCamera((camera) => zoomOut(camera, center));
      }
    }

    window.addEventListener("keydown", handleArrowKeys);
    window.addEventListener("keydown", handleZoomKeys);
    
    return () => {
      window.removeEventListener("keydown", handleArrowKeys);
      window.removeEventListener("keydown", handleZoomKeys);
    };
  }, [viewMode, center]);

  
  const handleProjectSelect = React.useCallback(
    (img: { id: string; link?: string }) => {
      if (img.link && /^https?:\/\//.test(img.link)) {
        window.open(img.link, '_blank', 'noopener,noreferrer');
      } else {
        navigate(img.link ?? `/art/${img.id}`);
      }
    },
    [navigate]
  );

  const [hoveredImage, setHoveredImage] = React.useState<string | null>(null);
  React.useEffect(() => {
    if (isExiting) setHoveredImage(null);
  }, [isExiting]);
  const [cursorPos, setCursorPos] = React.useState({ x: 0, y: 0 });
  const [pillTitleWidth, setPillTitleWidth] = React.useState(0);
  const pillRef = React.useRef<HTMLDivElement>(null);

  const PILL_MARQUEE_PX_PER_SEC = 25;
  React.useLayoutEffect(() => {
    if (!hoveredImage) {
      setPillTitleWidth(0);
      return;
    }
    const span = pillRef.current?.firstElementChild as HTMLElement | undefined;
    if (span) setPillTitleWidth(span.offsetWidth || 0);
  }, [hoveredImage]);

  // Pre-process config for faster lookups
  const imageConfigMap = React.useMemo(() => {
    return new Map(Object.entries(imageConfig));
  }, []);

  const usmanIntro = React.useMemo(() => {
    const coverConfig = imageConfigMap.get("fungrainy.webp");
    const dimensions = coverConfig
      ? coverConfig.dimensions[breakpoint](initialViewport)
      : { width: 700, height: 500 };

    return {
      href: "./fungrainy.webp",
      id: "usman",
      ...dimensions,
      x: center.x - dimensions.width / 2,
      y: center.y - dimensions.height / 2,
    };
  }, [center.x, center.y, breakpoint, initialViewport, imageConfigMap]);

  const images = React.useMemo(() => {
    // Row 1: professional projects, starting right after the cover image,
    // top-aligned with it.
    const rowStartX = usmanIntro.x + usmanIntro.width + IMAGE_GAP;
    const professionalRow = layoutRow(
      professionalProjects,
      imageConfigMap,
      breakpoint,
      initialViewport,
      rowStartX,
      usmanIntro.y
    );

    const experimentalRow = layoutRow(
      experimentalProjects,
      imageConfigMap,
      breakpoint,
      initialViewport,
      rowStartX,
      usmanIntro.y + professionalRow.rowHeight + ROW_GAP
    );

    // Row 2: digital art, starting 96px below row 1 (below the tallest
    // image in that row), same horizontal start and gap.
    const artRow = layoutRow(
      artProjects,
      imageConfigMap,
      breakpoint,
      initialViewport,
      rowStartX,
      usmanIntro.y + professionalRow.rowHeight + experimentalRow.rowHeight + ROW_GAP + ROW_GAP
    );

    return [
      ...professionalRow.items.map((item) => ({ ...item, section: 'Professional' as const })),
      ...experimentalRow.items.map((item) => ({ ...item, section: 'Experimental' as const })),
      ...artRow.items.map((item) => ({ ...item, section: 'Art' as const })),
    ];
  }, [usmanIntro, breakpoint, initialViewport, imageConfigMap]);

  // Text shown in the hover pill: per-image hoverText takes priority,
  // then artContent.json's title for that id, then the raw id.
  const hoveredPillText = React.useMemo(() => {
    if (!hoveredImage) return '';
    const hoveredEntry = images.find((img) => img.id === hoveredImage);
    return (
      hoveredEntry?.hoverText ??
      (artContent as Record<string, { title?: string }>)[hoveredImage]?.title ??
      hoveredImage
    );
  }, [hoveredImage, images]);



  // Viewport culling
  const visibleImages = React.useMemo(() => {
    const padding = 500;
    const viewBox = {
      minX: -camera.x - padding / camera.z,
      maxX: windowSize.width / camera.z - camera.x + padding / camera.z,
      minY: -camera.y - padding / camera.z,
      maxY: windowSize.height / camera.z - camera.y + padding / camera.z,
    };

    return images.filter(img => {
      const imgWidth = img.width || 700;
      const imgHeight = img.height || 700;
      return !(
        img.x + imgWidth < viewBox.minX ||
        img.x > viewBox.maxX ||
        img.y + imgHeight < viewBox.minY ||
        img.y > viewBox.maxY
      );
    });
  }, [images, camera, windowSize.width, windowSize.height]);


  // Grid extent to cover pannable area (matches pan bounds)
  const gridSize = 12000;

  return (
    <div style={{ overflow: 'hidden', width: '100vw', height: '100vh', position: 'relative' }}>
      <BottomMenu viewMode={viewMode} onViewModeChange={handleViewModeChange} />
      <AnimatePresence mode="wait">
        {viewMode === 'list' && (
          <ProjectsListView key="list" images={images} onSelect={handleProjectSelect} />
        )}
      </AnimatePresence>
      {viewMode === 'canvas' && (
      <>
      <svg
        ref={ref}
        style={{
          touchAction: 'none',
          WebkitTouchCallout: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
      >
        <defs>
          <pattern
            id="projects-grid"
            width={100}
            height={100}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M 0 0 V 100 M 0 0 H 100`}
              fill="none"
              stroke="var(--color-stroke-muted)"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <g
          style={{
            transform: capabilities.prefersReducedMotion ? 'none' : transform,
            willChange: capabilities.prefersReducedMotion ? 'auto' : 'transform',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          <motion.g
            initial={{ opacity: 0, filter: PROJECTS_FILTER_NONE }}
            animate={
              isExiting
                ? {
                    opacity: 0,
                    filter: capabilities.prefersReducedMotion ? PROJECTS_FILTER_NONE : PROJECTS_EXIT_BLUR,
                  }
                : isMounted
                  ? { opacity: 1, filter: PROJECTS_FILTER_NONE }
                  : { opacity: 0, filter: PROJECTS_FILTER_NONE }
            }
            transition={
              capabilities.prefersReducedMotion
                ? { duration: 0 }
                : isExiting
                  ? { duration: PROJECTS_EXIT_DURATION, ease: 'easeInOut' }
                  : { duration: 0.5, delay: 0 }
            }
            style={{ pointerEvents: 'none' }}
          >
            <rect
              x={-gridSize}
              y={-gridSize}
              width={gridSize * 2}
              height={gridSize * 2}
              fill="url(#projects-grid)"
            />
          </motion.g>
          <foreignObject
            key={usmanIntro.href}
            x={usmanIntro.x}
            y={usmanIntro.y}
            width={usmanIntro.width}
            height={usmanIntro.height}
            style={{ overflow: 'hidden' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85, filter: PROJECTS_FILTER_NONE }}
              animate={
                isExiting
                  ? {
                      opacity: 0,
                      scale: 1,
                      filter: capabilities.prefersReducedMotion ? PROJECTS_FILTER_NONE : PROJECTS_EXIT_IMAGE_FILTER,
                    }
                  : isMounted
                    ? { opacity: 1, scale: 1, filter: PROJECTS_FILTER_NONE }
                    : { opacity: 0, scale: 0.85, filter: PROJECTS_FILTER_NONE }
              }
              transition={
                capabilities.prefersReducedMotion
                  ? { duration: 0 }
                  : isExiting
                    ? { duration: PROJECTS_EXIT_DURATION, ease: 'easeInOut' }
                    : {
                        opacity: { delay: 0.3, type: 'spring', stiffness: 100, damping: 10 },
                        scale: { delay: 0.3, type: 'spring', stiffness: 100, damping: 10 },
                        filter: { duration: 0 },
                      }
              }
              style={{ width: '100%', height: '100%' }}
            >
              <FungrainyCanvas width={usmanIntro.width} height={usmanIntro.height} />
            </motion.div>
          </foreignObject>
          {visibleImages.map((img, index) => {
            // Stagger the fade-in: each image gets a slight delay based on its index
            const fadeInDelay = index * 0.05; // 50ms between each image

            const animateState = isExiting
              ? {
                  opacity: 0,
                  scale: 1,
                  filter: capabilities.prefersReducedMotion ? 'brightness(1)' : PROJECTS_EXIT_IMAGE_FILTER,
                }
              : artworkMounted
                ? {
                    opacity: hoveredImage === img.id ? 0.9 : 1,
                    scale: 1,
                    filter: hoveredImage === img.id ? 'brightness(0.9)' : 'brightness(1)',
                  }
                : {
                    opacity: 0,
                    scale: 0.85,
                    filter: 'brightness(1)',
                  };

            const transitionState = capabilities.prefersReducedMotion
              ? { duration: 0 }
              : isExiting
                ? { duration: PROJECTS_EXIT_DURATION, ease: 'easeInOut' }
                : {
                    opacity: { delay: fadeInDelay, type: 'spring', stiffness: 100, damping: 20 },
                    scale: { delay: fadeInDelay, type: 'spring', stiffness: 100, damping: 20 },
                    filter: { duration: 0.15, ease: 'easeInOut' },
                  };

            const sharedHandlers = {
              onMouseEnter: (e: React.MouseEvent) => {
                setHoveredImage(img.id);
                setCursorPos({ x: e.clientX, y: e.clientY });
              },
              onMouseLeave: () => setHoveredImage(null),
              onMouseMove: (e: React.MouseEvent) => setCursorPos({ x: e.clientX, y: e.clientY }),
              onClick: () => handleProjectSelect(img),
            };

            if (img.mediaType === 'video') {
              // Videos can't render via SVG <image>, so embed real HTML
              // through <foreignObject>, which inherits the same
              // coordinate system and pan/zoom transform as the canvas.
              return (
                <foreignObject
                  key={img.id}
                  x={img.x}
                  y={img.y}
                  width={img.width || 700}
                  height={img.height || 700}
                  style={{ overflow: 'hidden' }}
                >
                  <motion.video
                    src={img.href}
                    autoPlay
                    muted
                    loop
                    playsInline
                    initial={{ opacity: 0, scale: 0.85, filter: 'brightness(1)' }}
                    animate={animateState}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      cursor: 'pointer',
                      display: 'block',
                    }}
                    {...sharedHandlers}
                  />
                </foreignObject>
              );
            }

            return (
              <motion.image
                width={img.width || 700}
                height={img.height || 700}
                preserveAspectRatio="xMidYMid slice"
                key={img.id}
                href={img.href}
                x={img.x}
                y={img.y}
                initial={{ opacity: 0, scale: 0.85, filter: 'brightness(1)' }}
                animate={animateState}
                style={{
                  cursor: 'pointer',
                }}
                {...sharedHandlers}
              />
            );
          })}
        </g>
      </svg>
      <AnimatePresence>
        {hoveredImage && (
          <motion.div
            ref={pillRef}
            key={hoveredImage}
            initial={{ opacity: 0, filter: 'blur(8px)', scale: 0.75 }}
            animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
            exit={{ opacity: 0, filter: 'blur(8px)', scale: 0.75 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{
              position: 'fixed',
              left: cursorPos.x,
              top: cursorPos.y + 12,
              transform: 'translateX(-50%)',
              zIndex: 1000,
              pointerEvents: 'none',
              padding: '6px 14px',
              borderRadius: 9999,
              background: 'var(--color-modal-bg)',
              boxShadow: '0 2px 8px var(--color-modal-shadow)',
              overflow: 'hidden',
            }}
          >
            <span
              style={{
                fontFamily: '"AspektaVF", sans-serif',
                fontSize: 14,
                lineHeight: 1.2,
                color: 'var(--color-text)',
                whiteSpace: 'nowrap',
                visibility: 'hidden',
                display: 'block',
              }}
              aria-hidden
            >
              {hoveredPillText}
            </span>
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                maskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
              }}
            >
              <motion.div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '200%',
                  fontFamily: '"AspektaVF", sans-serif',
                  fontSize: 14,
                  color: 'var(--color-text)',
                  whiteSpace: 'nowrap',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                }}
                animate={{ x: ['-50%', '0%'] }}
                transition={{
                  repeat: Infinity,
                  duration: pillTitleWidth > 0 ? pillTitleWidth : 12,
                  ease: 'linear',
                }}
              >
                <span style={{ flex: '0 0 50%' }}>{hoveredPillText}</span>
                <span style={{ flex: '0 0 50%' }}>{hoveredPillText}</span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        className="zoom-box"
        initial={{opacity: 0, scale: 0.95, filter: "blur(6px)"}}
        whileInView={{opacity: 1, scale: 1, filter: "blur(0px)"}}
        transition={{duration: 0.4, delay: 1.2}}
      >
        <div style={{ marginBottom: 8 }}>
          <button
            className="zoom-button"
            style={{ position: 'relative', marginRight: 4 }}
            onClick={() => setCamera((camera) => zoomIn(camera, center))}
          >
            +
          </button>
          <button
            className="zoom-button"
            style={{ position: 'relative', marginRight: 4 }}
            onClick={() => setCamera(resetCamera)}
          >
            Reset
          </button>
          <button
            className="zoom-button"
            style={{ position: 'relative' }}
            onClick={() => setCamera((camera) => zoomOut(camera, center))}
          >
            -
          </button>
        </div>
        <div style={{}}>{Math.floor(camera.z * 100)}%</div>
      </motion.div>
      </>
      )}
    </div>
  );
}