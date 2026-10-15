import { ArrowUpRight, ChevronUp } from 'lucide-react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { launchpadSites } from '../data/about';
import { useReducedMotion } from '../lib/useReducedMotion';

export default function Launchpad() {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);

  const openRef = useRef(false);
  const reducedRef = useRef(reduced);
  const footerRef = useRef<HTMLElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const openActionRef = useRef<() => void>(() => {});
  const closeActionRef = useRef<() => void>(() => {});
  const suppressClickRef = useRef(false);

  openRef.current = open;
  reducedRef.current = reduced;

  useLayoutEffect(() => {
    if (drawerRef.current) drawerRef.current.inert = !open;
  }, [open]);

  useEffect(() => {
    let progress = 0;
    let pointerHolding = false;
    let touchHolding = false;
    let wasAtEnd = false;
    let reachedEndAt = 0;
    let cleanupScroll = () => {};
    let lastInput = 0;
    let touchY: number | null = null;
    let raf = 0;
    let tick = 0;
    const button = buttonRef.current;
    const footer = footerRef.current;

    const atEnd = () => window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
    const paint = () => {
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${progress})`;
    };

    const isHolding = () => pointerHolding || touchHolding;

    const openDrawer = () => {
      if (pointerHolding) suppressClickRef.current = true;
      pointerHolding = false;
      touchHolding = false;
      cancelAnimationFrame(raf);
      raf = 0;
      progress = 1;
      paint();
      openRef.current = true;
      setOpen(true);
      cleanupScroll();
      const reduce = reducedRef.current;
      const behavior: ScrollBehavior = reduce ? 'auto' : 'smooth';
      const scroll = () => {
        cleanupScroll();
        footer?.scrollIntoView({ block: 'end', behavior });
      };
      if (reduce) {
        const frame = requestAnimationFrame(scroll);
        cleanupScroll = () => {
          cancelAnimationFrame(frame);
          cleanupScroll = () => {};
        };
        return;
      }
      const drawer = drawerRef.current;
      const onEnd = (e: TransitionEvent) => {
        if (e.target === drawer && e.propertyName === 'grid-template-rows') scroll();
      };
      drawer?.addEventListener('transitionend', onEnd);
      const timer = window.setTimeout(scroll, 700);
      cleanupScroll = () => {
        drawer?.removeEventListener('transitionend', onEnd);
        window.clearTimeout(timer);
        cleanupScroll = () => {};
      };
    };
    const closeDrawer = () => {
      cleanupScroll();
      progress = 0;
      pointerHolding = false;
      touchHolding = false;
      openRef.current = false;
      setOpen(false);
      paint();
    };
    openActionRef.current = openDrawer;
    closeActionRef.current = closeDrawer;

    const loop = (t: number) => {
      raf = 0;
      if (openRef.current) {
        tick = 0;
        return;
      }
      const dt = Math.min(64, t - (tick || t));
      tick = t;
      if (isHolding()) progress += dt / 700;
      else if (performance.now() - lastInput > 180) progress -= dt / 400;
      progress = Math.max(0, Math.min(1, progress));
      paint();
      if (progress >= 1) {
        openDrawer();
        return;
      }
      if (isHolding() || progress > 0) raf = requestAnimationFrame(loop);
      else tick = 0;
    };
    const ensureLoop = () => {
      if (!raf) {
        tick = 0;
        raf = requestAnimationFrame(loop);
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (openRef.current) return;
      const now = performance.now();
      const end = atEnd();
      if (end && !wasAtEnd) reachedEndAt = now;
      wasAtEnd = end;
      if (e.deltaY <= 0 || !end || now - reachedEndAt < 150) return;
      const d = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
      progress = Math.min(1, progress + d / 900);
      lastInput = now;
      ensureLoop();
    };
    const onTouchStart = (e: TouchEvent) => {
      const inChevron = e.target instanceof Node && !!button?.contains(e.target);
      touchY = !openRef.current && !inChevron && atEnd() ? e.touches[0].clientY : null;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (touchY === null) return;
      touchHolding = touchY - e.touches[0].clientY > 24;
      lastInput = performance.now();
      ensureLoop();
    };
    const onTouchEnd = () => {
      touchY = null;
      touchHolding = false;
      lastInput = performance.now();
    };
    const onPointerDown = (e: PointerEvent) => {
      suppressClickRef.current = false;
      if (openRef.current || e.button !== 0) return;
      button?.setPointerCapture(e.pointerId);
      pointerHolding = true;
      ensureLoop();
    };
    const onPointerEnd = () => {
      pointerHolding = false;
      lastInput = performance.now();
    };
    const onContextMenu = (e: Event) => e.preventDefault();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || !openRef.current) return;
      if (!footer?.contains(document.activeElement)) return;
      closeDrawer();
      button?.focus();
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('touchcancel', onTouchEnd);
    window.addEventListener('keydown', onKeyDown);
    button?.addEventListener('pointerdown', onPointerDown);
    button?.addEventListener('pointerup', onPointerEnd);
    button?.addEventListener('pointercancel', onPointerEnd);
    button?.addEventListener('lostpointercapture', onPointerEnd);
    button?.addEventListener('contextmenu', onContextMenu);

    return () => {
      cancelAnimationFrame(raf);
      cleanupScroll();
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
      window.removeEventListener('keydown', onKeyDown);
      button?.removeEventListener('pointerdown', onPointerDown);
      button?.removeEventListener('pointerup', onPointerEnd);
      button?.removeEventListener('pointercancel', onPointerEnd);
      button?.removeEventListener('lostpointercapture', onPointerEnd);
      button?.removeEventListener('contextmenu', onContextMenu);
    };
  }, []);

  const handleClick = () => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    if (openRef.current) closeActionRef.current();
    else openActionRef.current();
  };

  return (
    <footer ref={footerRef} className="bg-black px-4 pb-8 md:px-6">
      <div className="max-w-7xl mx-auto text-center">
        <div aria-hidden="true" className="h-px overflow-hidden bg-[var(--border)]">
          <span
            ref={fillRef}
            className="block h-full bg-[var(--accent)]"
            style={{ transform: 'scaleX(0)', transformOrigin: 'center' }}
          />
        </div>
        <p className="pt-8 text-sm tone-subtle">© {new Date().getFullYear()} piresc.dev</p>
        <button
          ref={buttonRef}
          type="button"
          aria-label="Launchpad"
          aria-expanded={open}
          aria-controls="launchpad-sites"
          onClick={handleClick}
          className="inline-flex h-11 w-11 select-none items-center justify-center rounded-full tone-subtle transition-colors hover:text-primary [-webkit-touch-callout:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
          style={{ touchAction: 'none' }}
        >
          <ChevronUp
            size={14}
            aria-hidden="true"
            className={`transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] motion-reduce:transition-none ${open ? 'rotate-180' : ''}`}
          />
        </button>
        <div ref={drawerRef} id="launchpad-sites" className="launchpad-drawer" data-open={open}>
          <div>
            <nav aria-label="Launchpad">
              <ul className="flex flex-wrap justify-center gap-x-6 gap-y-0 pt-6 pb-4">
                {launchpadSites.map((site) => (
                  <li key={site.name}>
                    <a
                      href={site.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tap-target group inline-flex items-center gap-2 text-sm tone-subtle transition-colors hover:text-primary"
                    >
                      <span className="min-w-0">{site.name}</span>
                      <ArrowUpRight size={14} aria-hidden="true" className="shrink-0 transition-transform duration-300 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5" />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
