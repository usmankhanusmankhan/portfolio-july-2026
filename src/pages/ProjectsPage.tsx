import * as React from "react";
import ReactDOM from "react-dom";
import { useNavigate, useBlocker, useSearchParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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

// Like zoomCamera, but takes an absolute target zoom instead of a delta.
// Pinch gestures compute the desired zoom directly from finger spread
// (distance / initialDistance), so there's no "dz" to hand zoomCamera —
// this anchors that target zoom on `point` the same way zoomCamera does.
function zoomCameraTo(camera: Camera, point: Point, targetZoom: number): Camera {
  const zoom = Math.max(0.2, Math.min(3, targetZoom));

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

const IMAGE_GAP = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? 32 : 96; // horizontal spacing between images within a row
const DEFAULT_IMAGE_DIMENSIONS = { width: 500, height: 500 };

// The two case-study projects that sit behind a shared password. Entering
// the password for either one unlocks both, for the rest of this browser
// (persisted in localStorage). NOTE: this is a client-side gate meant to
// keep casual visitors from stumbling into NDA'd case studies -- it's not
// real security, since the password ships in the bundled JS. Swap in your
// own password below.
const PASSWORD_PROTECTED_IDS = new Set(['business-development-digest', 'ai-patterns']);
const PASSWORD_PROTECTED_LINKS: Record<string, string> = {
  'business-development-digest': '/bddigest',
  'ai-patterns': '/aipatterns',
};
const CASE_STUDY_PASSWORD = 'usmankhandesigns';
const CASE_STUDY_UNLOCK_STORAGE_KEY = 'usman-projects-unlocked';
const CASE_STUDY_UNLOCKED_HOVER_TEXT = 'here we go!!!';

type Viewport = { x: number; y: number };

// Lays out a list of images left-to-right starting at (startX, topY).
// Returns the positioned images plus the row's height (tallest image in
// the row), so the caller can stack another row underneath it.
function layoutRow(
  entries: { href: string; id: string; link?: string; hoverText?: string; mediaType?: 'image' | 'video'; disableHover?: boolean; pillOnly?: boolean }[],
  imageConfigMap: Map<string, ImageConfig>,
  breakpoint: Breakpoint,
  viewport: Viewport,
  startX: number,
  topY: number
) {
  let cursorX = startX;
  let rowHeight = 0;

  const items = entries.map(({ href, id, link, hoverText, mediaType, disableHover, pillOnly }) => {
    const fileName = href.replace('./', '');
    const config = imageConfigMap.get(fileName);
    const dimensions = config
      ? config.dimensions[breakpoint](viewport)
      : DEFAULT_IMAGE_DIMENSIONS;

    const x = cursorX;
    const y = topY;
    cursorX += dimensions.width + IMAGE_GAP;
    rowHeight = Math.max(rowHeight, dimensions.height);

    return { href, id, link, hoverText, mediaType: mediaType ?? 'image', disableHover, pillOnly, ...dimensions, x, y };
  });

  return { items, rowHeight };
}

type ListImage = {
  id: string;
  href: string;
  link?: string;
  hoverText?: string;
  mediaType?: 'image' | 'video';
  disableHover?: boolean;
  pillOnly?: boolean;
  section: 'Professional' | 'Experimental' | 'Art';
};

type ProjectCategory = 'featured' | 'experiments' | 'writing';

const CATEGORY_OPTIONS: { value: ProjectCategory; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'experiments', label: 'Experiments' },
  { value: 'writing', label: 'Writing' },
];

// Dropdown used in canvas mode to switch which single row of projects is
// laid out on the canvas (replaces the old always-visible three-row stack).
function CategoryDropdown({
  value,
  onChange,
}: {
  value: ProjectCategory;
  onChange: (next: ProjectCategory) => void;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const selected = CATEGORY_OPTIONS.find((opt) => opt.value === value) ?? CATEGORY_OPTIONS[0];

  React.useEffect(() => {
    if (!isOpen) return;
    function handlePointerDown(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false);
    }
    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        bottom: 12,
        right: 12,
        zIndex: 500,
        fontFamily: '"AspektaVF", sans-serif',
      }}
    >
      <motion.button
        type="button"
        initial={{ opacity: 0, filter: 'blur(4px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        transition={{duration: 0.4, delay: 1.2}}
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 14px',
          margin: 0,
          borderRadius: 9999,
          border: '1px solid var(--color-stroke-muted)',
          background: 'var(--color-bg-list)',
          color: 'var(--color-text)',
          fontFamily: 'inherit',
          fontSize: 14,
          fontWeight: 500,
          cursor: 'pointer',
          boxShadow: '0 2px 8px var(--color-modal-shadow)',
        }}
      >
        <span>{selected.label}</span>
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
            transition={{ duration: 0.15, ease: 'easeInOut' }}
            style={{
              listStyle: 'none',
              margin: '8px 0 0',
              padding: 6,
              position: 'absolute',
              bottom: 'calc(100% + 8px)',
              right: 0,
              minWidth: 180,
              borderRadius: 16,
              border: '1px solid var(--color-stroke-muted)',
              background: 'var(--color-bg-list)',
              boxShadow: '0 8px 24px var(--color-modal-shadow)',
            }}
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <li
                key={opt.value}
                role="option"
                aria-selected={opt.value === value}
                onClick={() => {
                  onChange(opt.value);
                }}
                style={{
                  padding: '8px 12px',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: opt.value === value ? 500 : 400,
                  color: 'var(--color-text)',
                  background: opt.value === value ? 'var(--color-stroke-muted)' : 'transparent',
                  cursor: 'pointer',
                }}
              >
                {opt.label}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Runs once on first mount of the list view after a page load; returning to
 * it later within the same SPA session (canvas -> list -> canvas -> list)
 * skips the cascade and shows the content already visible, same pattern as
 * Home's header intro.
 */
let projectsListIntroCompletedThisLoad = false;

const PROJECTS_LIST_HEADLINE =
  "Hi, this is Usman! I use design and code to turn complex enterprise problems into enjoyable software that anyone can use.";

function ProjectsListView({
  images,
  onSelect,
  unlockedCaseStudies,
  onRequestCaseStudyAccess,
}: {
  images: ListImage[];
  onSelect: (img: ListImage) => void;
  unlockedCaseStudies: boolean;
  onRequestCaseStudyAccess: (id: string, link: string) => void;
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
          paddingTop: 'clamp(96px, 10vw, 164px)', // clears the fixed navbar; see bottomMenu.module.css
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 600,
            margin: '0 auto',
            marginBottom: '0',
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(64px, 10vw, 80px)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <motion.div
              initial={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
              animate={{
                opacity: headerAnimationDone ? 1 : 0,
                y: headerAnimationDone ? 0 : -8,
                filter: headerAnimationDone ? 'blur(0px)' : 'blur(4px)',
              }}
              transition={{ duration: 0.5, delay: 0.1, ease: 'easeInOut' }}
            >
              <h1
                style={{
                  boxSizing: 'border-box',
                  color: 'var(--color-text)',
                  fontFamily: 'AspektaVF',
                  fontSize: 'clamp(16px, 3.5vw, 20px)',
                  fontWeight: '500',
                  height: 'fit-content',
                  lineHeight: '1.5',
                  textAlign: 'left',
                  margin: 0,
                }}
              >
                {PROJECTS_LIST_HEADLINE}
              </h1>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
              animate={{
                opacity: headerAnimationDone ? 1 : 0,
                y: headerAnimationDone ? 0 : -8,
                filter: headerAnimationDone ? 'blur(0px)' : 'blur(4px)',
              }}
              transition={{ duration: 0.5, delay: 0.3, ease: 'easeInOut' }}
              style={{
                  fontFamily: 'AspektaVF',
                  fontSize: 'clamp(12px, 3.5vw, 16px)',
                  fontWeight: '300',
                  color: 'var(--color-text-subtle)'}}
            >
              With experience at Intapp, IBM, and argodesign, I care about maintaining systems at scale that people rely on.
            </motion.h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <motion.div
              initial={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
              animate={{
                opacity: headerAnimationDone ? 1 : 0,
                y: headerAnimationDone ? 0 : -8,
                filter: headerAnimationDone ? 'blur(0px)' : 'blur(4px)',
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
                  fontSize: 'clamp(12px, 3.5vw, 14px)',
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
                    strokeWidth="0.75"
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
                <span style={{ position: 'relative', zIndex: 1, fontWeight: 400 }}>Featured</span>
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
                  fontSize: 'clamp(12px, 3.5vw, 14px)',
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
                    strokeWidth="0.75"
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
                <span style={{ position: 'relative', zIndex: 1, fontWeight: 400 }}>Experiments</span>
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
                gap: 16,
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
                    <button
                      className="card"
                      style={{background: 'none', border: 'none', textAlign: 'left'}}
                      onClick={() =>
                        unlockedCaseStudies
                          ? navigate('/bddigest')
                          : onRequestCaseStudyAccess('business-development-digest', '/bddigest')
                      }
                    >
                      <div className="card-image card-image-medium">
                        <img
                          src="./bd-digest-list.webp"
                          alt="Activator playbook"
                          loading="lazy"
                          decoding="async"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }}
                        />
                      </div>
                      <div className="card-content">
                        <div className="card-title">Business development playbook</div>
                        <div className="card-description">
                          Redefining how lawyers action business development opportunities through Intapp's
                          agentic platform, Celeste
                        </div>
                      </div>
                    </button>
                    <button
                      className="card"
                      style={{background: 'none', border: 'none', textAlign: 'left'}}
                      onClick={() =>
                        unlockedCaseStudies
                          ? navigate('/aipatterns')
                          : onRequestCaseStudyAccess('ai-patterns', '/aipatterns')
                      }
                    >
                      <div className="card-image card-image-medium">
                        <img
                          src="./ai-patterns-list.webp"
                          alt="AI patterns"
                          loading="lazy"
                          decoding="async"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }}
                        />
                      </div>
                      <div className="card-content">
                        <div className="card-title">Intapp's visual patterns for AI</div>
                        <div className="card-description">
                          Audited and refreshed the visual identity of AI branding within Intapp's products.
                        </div>
                      </div>
                    </button>
                    <div className="card" style={{cursor: 'default', transform: 'none'}} tabIndex={0}>
                      <div className="card-image card-image-medium">
                        <img
                          src="./embedded-celeste-list.webp"
                          alt="Reach out panel"
                          loading="lazy"
                          decoding="async"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }}
                        />
                      </div>
                      <div className="card-content">
                        <div className="card-title" style={{color: 'var(--color-text-muted)'}}>Embedded Celeste - coming soon!!!</div>
                        <div className="card-description" style={{color: 'var(--color-text-muted)'}}>
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
                    <button
                      className="card"
                      style={{background: 'none', border: 'none', textAlign: 'left'}}
                      onClick={() =>
                        window.open(
                          'https://usmankhanusmankhan.github.io/reading-journal/',
                          '_blank',
                          'noopener,noreferrer'
                        )
                      }
                    >
                      <div className="card-image card-image-large">
                        <img
                          src="./reading-journal.webp"
                          alt="Usman's reading journal"
                          fetchPriority="high"
                          decoding="sync"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }}
                        />
                      </div>
                      <div className="card-content">
                        <div className="card-title">Reading journal</div>
                        <div className="card-description">
                          My thoughts on everything I've read this year, using Matter.js
                        </div>
                      </div>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
          <div style={{paddingTop: '16px'}}>
            <h1 style={{fontSize: 'clamp(14px, 3.5vw, 18px)', fontWeight: 500, lineHeight: '1.55', marginBottom: '24px'}}>On the side, I combine digital art with my thoughts on technology, creativity, design, and anything else that comes to mind.</h1>
            <div style={{display: 'flex', flexDirection: 'column', gap: '0'}}>
                <div 
                  className="writing-list-items">
                  <a href="./art/art1">
                      on play and its opposing pressures
                  </a>
                </div>
                <div
                  className="writing-list-items">
                  <a href="./art/art8">
                    on contradictions
                  </a>
                </div>
                <div 
                  className="writing-list-items">
                  <a href="./art/art2">
                    on defining the web
                  </a>
                </div>
                <div 
                  className="writing-list-items">
                  <a href="./art/art11">
                    on tool overload
                  </a>
                </div>
                <div 
                  className="writing-list-items">
                  <a href="./art/art9">
                      on gathering community
                  </a>
                </div>
             </div> 
          </div>
          <h1 style={{fontSize: 'clamp(14px, 3.5vw, 18px)', fontWeight: 500, lineHeight: '1.6', marginBottom: 'clamp(16px, 3.5vw, 24px)'}}>Kind feedback from colleagues. Thanks guys!!</h1>
        </div>
      </div>
      <div className="carousel">
          <div className="group">
              <div className="feedback-card">
                <div style={{display: 'flex', flexDirection: 'row', gap: '8px', marginBottom: '16px', alignItems: 'top'}}>
                  <img src="./pipsa-avatar.svg" style={{height: '32px', width: '32px'}}></img>
                  <div style={{display: 'flex', flexDirection: 'column'}}>
                      <p style={{fontWeight: '500', lineHeight: '1.2'}}>Pipsa Martikainen</p>
                      <p style={{color: 'var(--color-text-subtle)'}}>Senior Product Designer</p>
                  </div>
                </div>
                “What stands out most is his <strong style={{fontWeight: '550'}}>calm, curious approach to design</strong>. He's <strong style={{fontWeight: '550'}}>firm on user value</strong> but always ready to collaborate with stakeholders, and he brings <strong style={{fontWeight: '550'}}>genuine attention to detail</strong> and user flow in his craft. His feedback in critiques was always well grounded, with clear ideas on how to push the work further.<br></br><br></br>He was also the frontrunner on our team for using AI in prototyping, producing impressive artifacts with tools like Cursor and Claude Code. His approach to prototyping and design pushed my own thinking on the topic, too. His presentation style is a big part of what makes him effective. <strong style={{fontWeight: '550'}}>Light-hearted, calm, and genuinely curious</strong>, it's the kind of delivery that makes feedback stick instead of just being heard in the moment.”
              </div>
              <div className="feedback-card">
                <div style={{display: 'flex', flexDirection: 'row', gap: '8px', marginBottom: '16px', alignItems: 'top'}}>
                  <img src="./maggie-avatar.svg" style={{height: '32px', width: '32px'}}></img>
                  <div style={{display: 'flex', flexDirection: 'column'}}>
                      <p style={{fontWeight: '500', lineHeight: '1.2'}}>Maggie Paparella</p>
                      <p style={{color: 'var(--color-text-subtle)'}}>Senior Product Designer</p>
                  </div>
                </div>
                “I had the privilege of interviewing Usman for his role at Intapp, and from day one it was clear he was <strong style={{fontWeight: '550'}}>something special</strong>. He hit the ground running and produced work that exceeded expectations from the start. I had the opportunity to mentor Usman through a major six-month project, and what struck me most was <strong style={{fontWeight: '550'}}>his genuine curiosity, his willingness to speak up with thoughtful, well-grounded perspectives, and his ability to stay composed and optimistic even under real pressure.</strong><br></br><br></br>He was a true collaborative partner working across teams on complex, cross-product challenges like AI pattern definition and product integrations, always looking to grow and bring others along with him. Any company would be lucky to have the talent and energy Usman brings to a team.”
                </div>
              <div className="feedback-card">
                <div style={{display: 'flex', flexDirection: 'row', gap: '8px', marginBottom: '16px', alignItems: 'top'}}>
                  <img src="./aimee-avatar.svg" style={{height: '32px', width: '32px'}}></img>
                  <div style={{display: 'flex', flexDirection: 'column'}}>
                      <p style={{fontWeight: '500', lineHeight: '1.2'}}>Aimee Maroney</p>
                      <p style={{color: 'var(--color-text-subtle)'}}>Manager, UI Engineering</p>
                  </div>
                </div>
                “Usman was someone that I never hesitated to reach out to for testing new concepts, for getting feedback on my team's initiatives, and for contribution to our company's design system.<br></br><br></br>It was Usman's suggestion that a CLI would be beneficial to designers looking to code with Claude, that sparked a large initiative on the design system. He then would go on to be a primary tester of that CLI and it was his feedback and testing that helped improve the experience for all users.<br></br><br></br>Not only is Usman <strong style={{fontWeight: '550'}}>an exceptional designer</strong>, but he is also an <strong style={{fontWeight: '550'}}>amazing collaborator and enjoyable person</strong> to work with. He is wise beyond his years and his <strong style={{fontWeight: '550'}}>calmness and positivity</strong> makes any workshop, meeting or offsite a real joy.”
              </div>
              <div className="feedback-card">
                <div style={{display: 'flex', flexDirection: 'row', gap: '8px', marginBottom: '16px', alignItems: 'top'}}>
                  <img src="./michelle-avatar.svg" style={{height: '32px', width: '32px'}}></img>
                  <div style={{display: 'flex', flexDirection: 'column'}}>
                      <p style={{fontWeight: '500', lineHeight: '1.2'}}>Michelle Whitman</p>
                      <p style={{color: 'var(--color-text-subtle)'}}>Director, Product Design</p>
                  </div>
                </div>
                “Usman is a treasure. Not just because he is a <strong style={{fontWeight: '550'}}>fabulous systems thinker</strong> but also because of his <strong style={{fontWeight: '550'}}>fathomless calm</strong>. He is wonderful to collaborate with, fun and funny, deeply engaged and engaging. However, he has this extraordinary peace and acceptance of the world. You don't often see interns that are self-possessed to this level – you don't often see many people in the world with that kind of assurance. It makes Usman a <strong style={{fontWeight: '550'}}>joy to mentor, to give feedback to and frankly to learn from and just connect</strong>.”
              </div>
          </div>
          <div aria-disabled id="second-group" className="group">
              <div className="feedback-card">
                <div style={{display: 'flex', flexDirection: 'row', gap: '8px', marginBottom: '16px', alignItems: 'top'}}>
                  <img src="./pipsa-avatar.svg" style={{height: '32px', width: '32px'}}></img>
                  <div style={{display: 'flex', flexDirection: 'column'}}>
                      <p style={{fontWeight: '500', lineHeight: '1.2'}}>Pipsa Martikainen</p>
                      <p style={{color: 'var(--color-text-subtle)'}}>Senior Product Designer</p>
                  </div>
                </div>
                “What stands out most is his <strong style={{fontWeight: '550'}}>calm, curious approach to design</strong>. He's <strong style={{fontWeight: '550'}}>firm on user value</strong> but always ready to collaborate with stakeholders, and he brings <strong style={{fontWeight: '550'}}>genuine attention to detail</strong> and user flow in his craft. His feedback in critiques was always well grounded, with clear ideas on how to push the work further.<br></br><br></br>He was also the frontrunner on our team for using AI in prototyping, producing impressive artifacts with tools like Cursor and Claude Code. His approach to prototyping and design pushed my own thinking on the topic, too. His presentation style is a big part of what makes him effective. <strong style={{fontWeight: '550'}}>Light-hearted, calm, and genuinely curious</strong>, it's the kind of delivery that makes feedback stick instead of just being heard in the moment.”
              </div>
              <div className="feedback-card">
                <div style={{display: 'flex', flexDirection: 'row', gap: '8px', marginBottom: '16px', alignItems: 'top'}}>
                  <img src="./maggie-avatar.svg" style={{height: '32px', width: '32px'}}></img>
                  <div style={{display: 'flex', flexDirection: 'column'}}>
                      <p style={{fontWeight: '500', lineHeight: '1.2'}}>Maggie Paparella</p>
                      <p style={{color: 'var(--color-text-subtle)'}}>Senior Product Designer</p>
                  </div>
                </div>
                “I had the privilege of interviewing Usman for his role at Intapp, and from day one it was clear he was <strong style={{fontWeight: '550'}}>something special</strong>. He hit the ground running and produced work that exceeded expectations from the start. I had the opportunity to mentor Usman through a major six-month project, and what struck me most was <strong style={{fontWeight: '550'}}>his genuine curiosity, his willingness to speak up with thoughtful, well-grounded perspectives, and his ability to stay composed and optimistic even under real pressure.</strong><br></br><br></br>He was a true collaborative partner working across teams on complex, cross-product challenges like AI pattern definition and product integrations, always looking to grow and bring others along with him. Any company would be lucky to have the talent and energy Usman brings to a team.”
                </div>
              <div className="feedback-card">
                <div style={{display: 'flex', flexDirection: 'row', gap: '8px', marginBottom: '16px', alignItems: 'top'}}>
                  <img src="./aimee-avatar.svg" style={{height: '32px', width: '32px'}}></img>
                  <div style={{display: 'flex', flexDirection: 'column'}}>
                      <p style={{fontWeight: '500', lineHeight: '1.2'}}>Aimee Maroney</p>
                      <p style={{color: 'var(--color-text-subtle)'}}>Manager, UI Engineering</p>
                  </div>
                </div>
                “Usman was someone that I never hesitated to reach out to for testing new concepts, for getting feedback on my team's initiatives, and for contribution to our company's design system.<br></br><br></br>It was Usman's suggestion that a CLI would be beneficial to designers looking to code with Claude, that sparked a large initiative on the design system. He then would go on to be a primary tester of that CLI and it was his feedback and testing that helped improve the experience for all users.<br></br><br></br>Not only is Usman <strong style={{fontWeight: '550'}}>an exceptional designer</strong>, but he is also an <strong style={{fontWeight: '550'}}>amazing collaborator and enjoyable person</strong> to work with. He is wise beyond his years and his <strong style={{fontWeight: '550'}}>calmness and positivity</strong> makes any workshop, meeting or offsite a real joy.”
              </div>
              <div className="feedback-card">
                <div style={{display: 'flex', flexDirection: 'row', gap: '8px', marginBottom: '16px', alignItems: 'top'}}>
                  <img src="./michelle-avatar.svg" style={{height: '32px', width: '32px'}}></img>
                  <div style={{display: 'flex', flexDirection: 'column'}}>
                      <p style={{fontWeight: '500', lineHeight: '1.2'}}>Pipsa Martikainen</p>
                      <p style={{color: 'var(--color-text-subtle)'}}>Director, Product Design</p>
                  </div>
                </div>
                “Usman is a treasure. Not just because he is a <strong style={{fontWeight: '550'}}>fabulous systems thinker</strong> but also because of his <strong style={{fontWeight: '550'}}>fathomless calm</strong>. He is wonderful to collaborate with, fun and funny, deeply engaged and engaging. However, he has this extraordinary peace and acceptance of the world. You don't often see interns that are self-possessed to this level – you don't often see many people in the world with that kind of assurance. It makes Usman a <strong style={{fontWeight: '550'}}>joy to mentor, to give feedback to and frankly to learn from and just connect</strong>.”
              </div>
          </div>
      </div>
    </motion.div>
  );
}

export default function ProjectsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const ref = React.useRef<SVGSVGElement>(null);
  // Videos are portaled into this plain HTML layer instead of rendered via
  // SVG <foreignObject> — see the mediaType === 'video' branch below for why.
  const [videoLayerNode, setVideoLayerNode] = React.useState<HTMLDivElement | null>(null);
  const [isPanningCursor, setIsPanningCursor] = React.useState(false);
  const [camera, setCamera] = React.useState(DEFAULT_CAMERA);
  const capabilities = React.useMemo(() => getDeviceCapabilities(), []);
  const breakpoint = useBreakpoint();
  const [isMounted, setIsMounted] = React.useState(false);
  const [artworkMounted, setArtworkMounted] = React.useState(false);
  const [isExiting, setIsExiting] = React.useState(false);

  const [urlParams, setUrlParams] = useSearchParams();

  // viewMode defaults by breakpoint (list on mobile, canvas otherwise), but
  // a shared link like /projects?view=list or /projects?view=canvas can
  // override that on first load — read once here so those links still work.
  // After that initial read, toggling via the bottom menu only updates
  // local state; the ?view= param itself gets stripped from the URL below.
  const breakpointDefaultViewMode: 'canvas' | 'list' = breakpoint === 'mobile' ? 'list' : 'canvas';
  const [viewModeOverride, setViewModeOverride] = React.useState<'canvas' | 'list' | null>(() => {
    const initialParam = urlParams.get('view');
    return initialParam === 'list' || initialParam === 'canvas' ? initialParam : null;
  });
  const viewMode: 'canvas' | 'list' = viewModeOverride ?? breakpointDefaultViewMode;
  const setViewMode = React.useCallback(
    (mode: 'canvas' | 'list') => {
      // Clear the override when the chosen mode matches the current
      // breakpoint's default, so resizing across breakpoints later still
      // follows the default again instead of getting stuck.
      setViewModeOverride(mode === breakpointDefaultViewMode ? null : mode);
    },
    [breakpointDefaultViewMode]
  );

  // The ?view= / ?category= params (if present) have already been captured
  // into state above; strip them from the URL now so the address bar
  // simplifies back to a clean /projects and switching either control
  // afterward never touches the URL again — the page should always feel
  // like the same page to the user. Goes through the router's own
  // setUrlParams (rather than raw window.history) so react-router's
  // internal location state stays in sync with the address bar.
  React.useEffect(() => {
    if (urlParams.has('view') || urlParams.has('category')) {
      setUrlParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete('view');
          next.delete('category');
          return next;
        },
        { replace: true }
      );
    }
    // Run once on mount only — this is a one-time cleanup of the initial URL.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // Which single row of projects is laid out on the canvas. Replaces the
  // old fixed three-row stack (professional / experimental / art) with a
  // dropdown-driven single row.
  //
  // Category is persisted on THIS page's own history entry via
  // navigate(..., { state }) rather than the URL, so the address bar never
  // shows it (the page always feels like the same /projects). Browsers
  // keep state attached to its history entry natively: navigating forward
  // into a project pushes a new entry on top, and clicking the browser's
  // Back button pops back to this entry — restoring its state, including
  // category — without any code needing to run on the way there.
  //
  // A shared link like /projects?category=writing can still pick the
  // starting category on first load (read once here as a fallback when
  // there's no history state yet); after that, switching the dropdown only
  // updates state and never writes to the URL.
  const [categoryOverride, setCategoryOverride] = React.useState<ProjectCategory | null>(() => {
    const stateCategory = (location.state as { category?: ProjectCategory } | null)?.category;
    if (stateCategory === 'experiments' || stateCategory === 'writing') return stateCategory;
    const initialParam = urlParams.get('category');
    return initialParam === 'experiments' || initialParam === 'writing' ? initialParam : null;
  });
  const category: ProjectCategory = categoryOverride ?? 'featured';
  const handleCategoryChange = React.useCallback(
    (next: ProjectCategory) => {
      setCategoryOverride(next === 'featured' ? null : next);
      navigate(
        { pathname: location.pathname, search: location.search },
        {
          replace: true,
          state: { ...(location.state as object | null), category: next === 'featured' ? undefined : next },
        }
      );
    },
    [navigate, location.pathname, location.search, location.state]
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

  // Tracks whether the cover image has already played its one-time intro
  // delay (0.3s, part of the page-load cascade: grid -> cover -> artwork).
  // After that, category swaps should re-enter the cover in sync with the
  // row images' cadence (no extra offset), not repeat the intro delay.
  const coverHasEnteredRef = React.useRef(false);

  // Preload every cover image variant once, up front, so switching category
  // never has to wait on a first-time network fetch + decode mid-animation
  // (that's what was causing the enter/exit lag on fungrainy2/3).
  React.useEffect(() => {
    const hrefs = ['./fungrainy.webp', './fungrainy2.webp', './fungrainy3.webp'];
    const preloaded = hrefs.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });
    return () => {
      preloaded.forEach((img) => {
        img.src = '';
      });
    };
  }, []);

  React.useEffect(() => {
    // Trigger mount animation: grid fades in first (no delay), then cover (0.3s), then artwork (0.85s)
    setIsMounted(true);
    const artworkTimer = setTimeout(() => {
      setArtworkMounted(true);
    }, 850);
    const coverEnteredTimer = setTimeout(() => {
      coverHasEnteredRef.current = true;
    }, 300);

    return () => {
      clearTimeout(artworkTimer);
      clearTimeout(coverEnteredTimer);
    };
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

  // Keep a ref to the latest camera so the touch effect below can read
  // camera.z without needing it in its dependency array. (Previously the
  // effect depended on camera.z directly, which meant it tore down and
  // re-subscribed on every zoom update mid-pinch, resetting
  // `initialDistance` to 0. The next touchmove then divided by that 0,
  // producing Infinity/NaN and snapping zoom straight to the 300% ceiling.)
  const cameraRef = React.useRef(camera);
  React.useEffect(() => {
    cameraRef.current = camera;
  }, [camera]);

  // Touch event support for mobile
  React.useEffect(() => {
    if (!capabilities.isMobile || viewMode !== 'canvas') return;

    let touchStart: { x: number; y: number } | null = null;
    let lastTouch: { x: number; y: number } | null = null;
    let initialDistance = 0;
    let initialZoom = 1;
    // Midpoint between the two fingers during a pinch, tracked frame to
    // frame so a two-finger drag (moving both fingers together) can pan
    // the camera at the same time as the pinch zooms it — same as
    // Google Maps/Photos.
    let lastMidpoint: Point | null = null;

    // Momentum/inertia after a single-finger pan is released, tracked as
    // finger speed in px/ms so playback is frame-rate independent.
    let velocity = { x: 0, y: 0 };
    let lastMoveTime = 0;
    let momentumRafId: number | null = null;

    function stopMomentum() {
      if (momentumRafId !== null) {
        cancelAnimationFrame(momentumRafId);
        momentumRafId = null;
      }
    }

    function startMomentum() {
      const FRICTION_PER_MS = 0.998; // exponential decay factor per ms
      const STOP_THRESHOLD = 0.02; // px/ms
      let lastTime = performance.now();

      function step(now: number) {
        const dt = Math.max(1, now - lastTime);
        lastTime = now;

        const decay = Math.pow(FRICTION_PER_MS, dt);
        velocity = { x: velocity.x * decay, y: velocity.y * decay };

        if (Math.hypot(velocity.x, velocity.y) < STOP_THRESHOLD) {
          momentumRafId = null;
          return;
        }

        setCamera((camera) => panCamera(camera, -velocity.x * dt, -velocity.y * dt));
        momentumRafId = requestAnimationFrame(step);
      }

      momentumRafId = requestAnimationFrame(step);
    }

    function handleTouchStart(e: TouchEvent) {
      // A new touch always takes over from any in-flight momentum.
      stopMomentum();

      if (e.touches.length === 1) {
        touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        lastTouch = touchStart;
        velocity = { x: 0, y: 0 };
        lastMoveTime = e.timeStamp;
      } else if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        initialDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        initialZoom = cameraRef.current.z;
        lastMidpoint = {
          x: (touch1.clientX + touch2.clientX) / 2,
          y: (touch1.clientY + touch2.clientY) / 2,
        };
      }
    }

    function handleTouchMove(e: TouchEvent) {
      e.preventDefault();

      if (e.touches.length === 1 && touchStart) {
        const touch = e.touches[0];
        const dx = touch.clientX - (lastTouch?.x || touchStart.x);
        const dy = touch.clientY - (lastTouch?.y || touchStart.y);

        const dt = Math.max(1, e.timeStamp - lastMoveTime);
        velocity = { x: dx / dt, y: dy / dt };
        lastMoveTime = e.timeStamp;

        // Negated so content follows the finger: dragging left moves the
        // camera right (panCamera itself subtracts dx/dy from camera.x/y).
        setCamera((camera) => panCamera(camera, -dx, -dy));
        lastTouch = { x: touch.clientX, y: touch.clientY };
      } else if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        const midpoint = {
          x: (touch1.clientX + touch2.clientX) / 2,
          y: (touch1.clientY + touch2.clientY) / 2,
        };

        const scale = distance / initialDistance;
        const newZoom = initialZoom * scale;

        setCamera((camera) => {
          // Anchor the zoom on the pinch midpoint so whatever is under
          // the fingers stays under the fingers, instead of always
          // zooming toward the canvas origin (top-left).
          let next = zoomCameraTo(camera, midpoint, newZoom);

          // Two fingers moving together (not just spreading/pinching)
          // pans the camera by that shared movement.
          if (lastMidpoint) {
            next = panCamera(
              next,
              -(midpoint.x - lastMidpoint.x),
              -(midpoint.y - lastMidpoint.y)
            );
          }
          return next;
        });

        lastMidpoint = midpoint;
      }
    }

    function handleTouchEnd(e: TouchEvent) {
      // Single-finger pan just ended with some speed: keep panning and
      // let it decay, like a map "fling".
      if (e.touches.length === 0 && Math.hypot(velocity.x, velocity.y) > 0.05) {
        startMomentum();
      }

      if (e.touches.length < 2) {
        lastMidpoint = null;
      }

      touchStart = null;
      lastTouch = null;
    }

    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("touchcancel", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
      stopMomentum();
    };
  }, [capabilities.isMobile, viewMode]);

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

  // Mouse click-and-drag panning. Not gated on capabilities.isMobile like
  // the touch effect above — a mouse can be plugged into any device
  // (including a touch-capable one, e.g. an iPad with a mouse attached),
  // and browsers don't fire mouse events for real touch input when
  // touchAction: 'none' is set on the canvas (it already is), so this
  // and the touch effect don't fight each other.
  //
  // Wheel-based pan (scroll) and zoom (ctrl/cmd+scroll) above already work
  // with a mouse's scroll wheel regardless of device — this only adds the
  // click-and-drag gesture, which wheel scrolling doesn't cover.
  //
  // Bound to the primary (left) button only. Drag-panning can start from
  // anywhere on the canvas, including on top of a project image, so a
  // left-button drag needs to be told apart from a plain click on that
  // image. We do that with a small movement threshold: the gesture isn't
  // treated as a pan (and the grabbing cursor doesn't show) until the
  // pointer has moved a few pixels. If it ever crosses that threshold,
  // the upcoming `click` event on whatever's underneath is suppressed via
  // a capturing listener, so the image's onClick doesn't also fire and
  // navigate away.
  React.useEffect(() => {
    if (viewMode !== 'canvas') return;

    const svg = ref.current;
    if (!svg) return;

    const DRAG_THRESHOLD = 4; // px of movement before a left-click counts as a pan

    let isDown = false;
    let isPanning = false;
    let didDrag = false;
    let startPos: { x: number; y: number } | null = null;
    let lastPos: { x: number; y: number } | null = null;

    function handleMouseDown(e: MouseEvent) {
      if (e.button !== 0) return;

      isDown = true;
      didDrag = false;
      startPos = { x: e.clientX, y: e.clientY };
      lastPos = startPos;
    }

    function handleMouseMove(e: MouseEvent) {
      if (!isDown || !lastPos || !startPos) return;

      if (!isPanning) {
        const totalDx = e.clientX - startPos.x;
        const totalDy = e.clientY - startPos.y;
        if (Math.hypot(totalDx, totalDy) < DRAG_THRESHOLD) return;
        isPanning = true;
        setIsPanningCursor(true);
      }

      didDrag = true;

      const dx = e.clientX - lastPos.x;
      const dy = e.clientY - lastPos.y;

      // Same convention as touch: negated so content follows the cursor.
      setCamera((camera) => panCamera(camera, -dx, -dy));
      lastPos = { x: e.clientX, y: e.clientY };
    }

    function handleMouseUp(e: MouseEvent) {
      if (e.button !== 0) return;
      isDown = false;
      isPanning = false;
      startPos = null;
      lastPos = null;
      setIsPanningCursor(false);
    }

    // Capturing click listener: if the mouseup that just happened was
    // the end of a drag-pan, swallow the resulting click before it
    // reaches a project image's onClick (or any other handler).
    function handleClickCapture(e: MouseEvent) {
      if (didDrag) {
        e.stopPropagation();
        e.preventDefault();
        didDrag = false;
      }
    }

    svg.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    svg.addEventListener("click", handleClickCapture, true);

    return () => {
      svg.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      svg.removeEventListener("click", handleClickCapture, true);
    };
  }, [viewMode]);

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

  
  // Password gate for the two case-study projects (business-development-digest
  // and ai-patterns). `unlockedCaseStudies` is persisted so a returning
  // visitor who already entered the password doesn't get asked again, and
  // entering it once unlocks both projects.
  const [unlockedCaseStudies, setUnlockedCaseStudies] = React.useState<boolean>(() => {
    try {
      return window.localStorage.getItem(CASE_STUDY_UNLOCK_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [passwordModalTarget, setPasswordModalTarget] = React.useState<{ id: string; link: string } | null>(null);
  const [passwordInput, setPasswordInput] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);

  const requestCaseStudyAccess = React.useCallback((id: string, link: string) => {
    setPasswordInput('');
    setPasswordError(false);
    setPasswordModalTarget({ id, link });
  }, []);

  const closePasswordModal = React.useCallback(() => {
    setPasswordModalTarget(null);
    setPasswordInput('');
    setPasswordError(false);
  }, []);

  const navigateToTarget = React.useCallback(
    (link: string) => {
      if (/^https?:\/\//.test(link)) {
        window.open(link, '_blank', 'noopener,noreferrer');
      } else {
        navigate(link);
      }
    },
    [navigate]
  );

  const submitPassword = React.useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      if (passwordInput.trim().toLowerCase() === CASE_STUDY_PASSWORD.toLowerCase()) {
        setUnlockedCaseStudies(true);
        try {
          window.localStorage.setItem(CASE_STUDY_UNLOCK_STORAGE_KEY, 'true');
        } catch {
          // localStorage unavailable (e.g. private browsing) -- the unlock
          // just won't persist across reloads, which is fine.
        }
        const target = passwordModalTarget;
        setPasswordModalTarget(null);
        setPasswordInput('');
        setPasswordError(false);
        if (target) navigateToTarget(target.link);
      } else {
        setPasswordError(true);
      }
    },
    [passwordInput, passwordModalTarget, navigateToTarget]
  );

  const handleProjectSelect = React.useCallback(
    (img: { id: string; link?: string }) => {
      if (PASSWORD_PROTECTED_IDS.has(img.id) && !unlockedCaseStudies) {
        requestCaseStudyAccess(img.id, img.link ?? PASSWORD_PROTECTED_LINKS[img.id]);
        return;
      }
      if (img.link && /^https?:\/\//.test(img.link)) {
        window.open(img.link, '_blank', 'noopener,noreferrer');
      } else {
        navigate(img.link ?? `/art/${img.id}`);
      }
    },
    [navigate, unlockedCaseStudies, requestCaseStudyAccess]
  );

  const [hoveredImage, setHoveredImage] = React.useState<string | null>(null);
  React.useEffect(() => {
    if (isExiting) setHoveredImage(null);
  }, [isExiting]);
  const [cursorPos, setCursorPos] = React.useState({ x: 0, y: 0 });
  const [pillTitleWidth, setPillTitleWidth] = React.useState(0);
  const pillRef = React.useRef<HTMLDivElement>(null);

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

  // Which cover image shows depends on the active category — same base
  // artwork, three different overlaid taglines.
  const coverHref = React.useMemo(() => {
    if (category === 'experiments') return './fungrainy2.webp';
    if (category === 'writing') return './fungrainy3.webp';
    return './fungrainy.webp';
  }, [category]);

  const usmanIntro = React.useMemo(() => {
    const coverFileName = coverHref.replace('./', '');
    const coverConfig = imageConfigMap.get(coverFileName) ?? imageConfigMap.get('fungrainy.webp');
    const dimensions = coverConfig
      ? coverConfig.dimensions[breakpoint](initialViewport)
      : { width: 700, height: 500 };

    return {
      href: coverHref,
      id: "usman",
      ...dimensions,
      x: center.x - dimensions.width / 2,
      y: center.y - dimensions.height / 2,
    };
  }, [center.x, center.y, breakpoint, initialViewport, imageConfigMap, coverHref]);

  const images = React.useMemo(() => {
    // Single row, starting right after the cover image, top-aligned with
    // it. Which project list feeds the row depends on the dropdown.
    const rowStartX = usmanIntro.x + usmanIntro.width + IMAGE_GAP;
    const activeProjects =
      category === 'featured'
        ? professionalProjects
        : category === 'experiments'
          ? experimentalProjects
          : artProjects;
    const section: ListImage['section'] =
      category === 'featured' ? 'Professional' : category === 'experiments' ? 'Experimental' : 'Art';

    const row = layoutRow(
      activeProjects,
      imageConfigMap,
      breakpoint,
      initialViewport,
      rowStartX,
      usmanIntro.y
    );

    return row.items.map((item) => ({ ...item, section }));
  }, [usmanIntro, breakpoint, initialViewport, imageConfigMap, category]);

  // Text shown in the hover pill: per-image hoverText takes priority,
  // then artContent.json's title for that id, then the raw id.
  const hoveredPillText = React.useMemo(() => {
    if (!hoveredImage) return '';
    if (PASSWORD_PROTECTED_IDS.has(hoveredImage) && unlockedCaseStudies) {
      return CASE_STUDY_UNLOCKED_HOVER_TEXT;
    }
    const hoveredEntry = images.find((img) => img.id === hoveredImage);
    return (
      hoveredEntry?.hoverText ??
      (artContent as Record<string, { title?: string }>)[hoveredImage]?.title ??
      hoveredImage
    );
  }, [hoveredImage, images, unlockedCaseStudies]);



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
          <ProjectsListView
            key="list"
            images={images}
            onSelect={handleProjectSelect}
            unlockedCaseStudies={unlockedCaseStudies}
            onRequestCaseStudyAccess={requestCaseStudyAccess}
          />
        )}
      </AnimatePresence>
      {viewMode === 'canvas' && (
      <>
      <CategoryDropdown value={category} onChange={handleCategoryChange} />
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
            width={50}
            height={50}
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
          <AnimatePresence>
            <motion.image
              key={usmanIntro.href}
              href={usmanIntro.href}
              x={usmanIntro.x}
              y={usmanIntro.y}
              width={usmanIntro.width}
              height={usmanIntro.height}
              preserveAspectRatio="xMidYMid meet"

              style={{ willChange: 'opacity, transform, filter' }}
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
              exit={{
                opacity: 0,
                scale: 1,
                filter: capabilities.prefersReducedMotion ? PROJECTS_FILTER_NONE : PROJECTS_EXIT_IMAGE_FILTER,
                transition: capabilities.prefersReducedMotion
                  ? { duration: 0 }
                  : { duration: PROJECTS_EXIT_DURATION, ease: 'easeInOut' },
              }}
              transition={
                capabilities.prefersReducedMotion
                  ? { duration: 0 }
                  : isExiting
                    ? { duration: PROJECTS_EXIT_DURATION, ease: 'easeInOut' }
                    : {
                        opacity: {
                          delay: coverHasEnteredRef.current ? 0 : 0.3,
                          type: 'spring',
                          stiffness: 100,
                          damping: 10,
                        },
                        scale: {
                          delay: coverHasEnteredRef.current ? 0 : 0.3,
                          type: 'spring',
                          stiffness: 100,
                          damping: 10,
                        },
                        filter: { duration: 0 },
                      }
              }
            />
          </AnimatePresence>
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
                    opacity: !img.disableHover && !img.pillOnly && hoveredImage === img.id ? 0.9 : 1,
                    scale: 1,
                    filter: !img.disableHover && !img.pillOnly && hoveredImage === img.id ? 'brightness(0.9)' : 'brightness(1)',
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
                    opacity: { delay: fadeInDelay, type: 'spring', stiffness: 100, damping: 10 },
                    scale: { delay: fadeInDelay, type: 'spring', stiffness: 100, damping: 10 },
                    filter: { duration: 0.15, ease: 'easeInOut' },
                  };

            // Video content doesn't play well with the spring used on the
            // static images: stiffness 100 / damping 10 is underdamped, so
            // it overshoots and settles with a slight bounce. On a static
            // image that's imperceptible, but scaling a <video> inside a
            // foreignObject through that overshoot forces extra reflow on
            // top of already-playing video, which is what was reading as
            // lag. Same cadence (same delay, similar settle time), just a
            // plain ease-out tween instead of a bouncy spring.
            const videoTransitionState = capabilities.prefersReducedMotion
              ? { duration: 0 }
              : isExiting
                ? { duration: PROJECTS_EXIT_DURATION, ease: 'easeInOut' }
                : {
                    opacity: { delay: fadeInDelay, duration: 0.4, ease: 'easeOut' },
                    scale: { delay: fadeInDelay, duration: 0.4, ease: 'easeOut' },
                    filter: { duration: 0.15, ease: 'easeInOut' },
                  };

            // Images flagged disableHover (e.g. the kind-feedback testimonials
            // shot) render like the fungrainy cover: no hover pill, no
            // brightness/opacity hover state, no click handler.
            // Images flagged pillOnly (e.g. not-yet-launched projects) still
            // show the hover pill for context, but keep the cursor and
            // opacity unchanged and aren't clickable.
            const sharedHandlers = img.disableHover
              ? {}
              : img.pillOnly
                ? {
                    onMouseEnter: (e: React.MouseEvent) => {
                      setHoveredImage(img.id);
                      setCursorPos({ x: e.clientX, y: e.clientY });
                    },
                    onMouseLeave: () => setHoveredImage(null),
                    onMouseMove: (e: React.MouseEvent) => setCursorPos({ x: e.clientX, y: e.clientY }),
                  }
                : {
                    onMouseEnter: (e: React.MouseEvent) => {
                      setHoveredImage(img.id);
                      setCursorPos({ x: e.clientX, y: e.clientY });
                    },
                    onMouseLeave: () => setHoveredImage(null),
                    onMouseMove: (e: React.MouseEvent) => setCursorPos({ x: e.clientX, y: e.clientY }),
                    onClick: () => handleProjectSelect(img),
                  };

            if (img.mediaType === 'video') {
              // Videos used to render via SVG <foreignObject>, relying on
              // it inheriting the ancestor <g>'s CSS `transform` (the
              // camera pan/zoom). Safari has a long-standing WebKit bug
              // where a <video> inside a <foreignObject> is composited on
              // its own hardware decode layer that doesn't get
              // re-transformed when an ancestor's CSS transform changes —
              // only actual layout/attribute changes on the foreignObject
              // itself trigger a repaint. Practically: the video paints
              // once wherever it happens to land and then stays frozen
              // there while everything else (correctly) pans and zooms
              // around it. Chrome doesn't share this bug.
              //
              // The fix is to take the video out of the SVG's transform
              // inheritance chain entirely: portal it into a plain HTML
              // layer sitting on top of the SVG, and position it with
              // ordinary left/top/width/height computed straight from the
              // camera on every render — no CSS transform involved, so
              // there's nothing for Safari to fail to propagate.
              if (!videoLayerNode) return null;

              const screenX = (img.x + camera.x) * camera.z;
              const screenY = (img.y + camera.y) * camera.z;
              const screenWidth = (img.width || 700) * camera.z;
              const screenHeight = (img.height || 700) * camera.z;

              return ReactDOM.createPortal(
                <motion.video
                  key={img.id}
                  src={img.href}
                  autoPlay
                  muted
                  loop
                  playsInline
                  initial={{ opacity: 0, scale: 0.85, filter: 'brightness(1)' }}
                  animate={animateState}
                  transition={videoTransitionState}
                  style={{
                    position: 'absolute',
                    left: screenX,
                    top: screenY,
                    width: screenWidth,
                    height: screenHeight,
                    objectFit: 'cover',
                    cursor: 'pointer',
                    display: 'block',
                    pointerEvents: 'auto',
                  }}
                  {...sharedHandlers}
                />,
                videoLayerNode,
                img.id
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
                transition={transitionState}
                style={{
                  cursor: img.disableHover || img.pillOnly ? 'default' : 'pointer',
                }}
                {...sharedHandlers}
              />
            );
          })}
        </g>
      </svg>
      {/* Videos portal into this layer instead of living inside the SVG —
          see the mediaType === 'video' branch above for why. Sized to match
          the SVG's full-viewport footprint; child videos are positioned
          with plain left/top/width/height computed from the camera, so
          they never depend on an inherited CSS transform. */}
      <div
        ref={setVideoLayerNode}
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      />
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
                  duration: hoveredPillText.length < 20 ? 12 : 16,
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
        <div style={{color: 'var(--color-text-subtle)'}}>{Math.floor(camera.z * 100)}%</div>
      </motion.div>
      </>
      )}
      {ReactDOM.createPortal(
        <AnimatePresence>
          {passwordModalTarget && (
            <motion.div
              key="password-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              onClick={closePasswordModal}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 999999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
              }}
            >
              <motion.form
                key="password-modal"
                onClick={(e) => e.stopPropagation()}
                onSubmit={submitPassword}
                initial={{ opacity: 0, scale: 0.95, filter: 'blur(6px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.95, filter: 'blur(6px)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                style={{
                  width: 'min(360px, calc(100vw - 48px))',
                  padding: 24,
                  borderRadius: 12,
                  border: '1px solid var(--color-stroke-muted)',
                  background: 'var(--color-bg)',
                  boxShadow: '0 8px 24px var(--color-modal-shadow)',
                  fontFamily: '"AspektaVF", sans-serif',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 32
,
                }}
              >
                <div style={{ fontSize: 16, fontWeight: 500, textAlign: 'center', color: 'var(--color-text)' }}>
                  Wait a second! This case study is password protected.
                </div>
                <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      if (passwordError) setPasswordError(false);
                    }}
                    placeholder="Password"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 10,
                      border: `1px solid ${passwordError ? '#e5484d' : 'var(--color-stroke-muted)'}`,
                      background: 'var(--color-bg)',
                      color: 'var(--color-text)',
                      fontFamily: 'inherit',
                      fontSize: 14,
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                  {passwordError && (
                    <div style={{ fontSize: 12, textAlign: 'center', color: '#e5484d' }}>Incorrect password, try again.</div>
                  )}
                  <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between', marginTop: 4 }}>
                    <button
                      type="button"
                      onClick={closePasswordModal}
                      style={{
                        padding: '8px 14px',
                        borderRadius: 9999,
                        border: '1px solid var(--color-stroke-muted)',
                        background: 'transparent',
                        color: 'var(--color-text)',
                        fontFamily: 'inherit',
                        fontSize: 14,
                        cursor: 'pointer',
                        width: '100%'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={{
                        padding: '8px 14px',
                        borderRadius: 9999,
                        border: 'none',
                        background: 'var(--color-text)',
                        color: 'var(--color-bg)',
                        fontFamily: 'inherit',
                        fontSize: 14,
                        fontWeight: 500,
                        cursor: 'pointer',
                        width: '100%'
                      }}
                    >
                      Unlock
                    </button>
                  </div>
                </div>
              </motion.form>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}