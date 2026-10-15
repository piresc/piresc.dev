import { motion, MotionConfig, useScroll } from 'framer-motion';
import { useEffect, useState } from 'react';
import Hero from './components/Hero';
import Projects from './components/Projects';
import About from './components/About';
import Contact from './components/Contact';
import Launchpad from './components/Launchpad';
import { useReducedMotion } from './lib/useReducedMotion';

const stickyNavItems = [
  { label: 'piresc', href: '#home' },
  { label: 'Work', href: '#projects' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

function StickyNav() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    return scrollY.on('change', (y) => {
      setVisible(y > window.innerHeight * 0.8);
    });
  }, [scrollY]);

  useEffect(() => {
    const ids = stickyNavItems.map((item) => item.href.slice(1));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id === 'home' ? null : entry.target.id);
          }
        }
      },
      { rootMargin: '-35% 0px -55% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <motion.nav
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
      animate={
        visible
          ? shouldReduceMotion
            ? { opacity: 1 }
            : { opacity: 1, y: 0 }
          : shouldReduceMotion
            ? { opacity: 0 }
            : { opacity: 0, y: -10 }
      }
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
      aria-label="Main navigation"
      aria-hidden={!visible}
      style={{ visibility: visible ? 'visible' : 'hidden' }}
    >
      <div className="nav-surface bg-black/80 backdrop-blur-xl rounded-b-2xl md:rounded-b-3xl px-4 py-2 md:px-8" style={{ pointerEvents: visible ? 'auto' : 'none' }}>
        <ul className="nav-list">
          {stickyNavItems.map((item, i) => {
            const isActive = active === item.href.slice(1);
            return (
              <li key={i}>
                <a
                  href={item.href}
                  className={`nav-link text-sm ${
                    item.label === 'piresc' ? 'font-medium' : ''
                  }`}
                  aria-current={isActive ? 'true' : undefined}
                  style={{
                    color: item.label === 'piresc' || isActive ? 'var(--text)' : 'var(--muted)',
                    fontWeight: item.label === 'piresc' ? 500 : isActive ? 600 : 400
                  }}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </motion.nav>
  );
}

function App() {
  const shouldReduceMotion = useReducedMotion();
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const targetId = window.location.hash.slice(1);
    if (!targetId) return;

    const timeoutId = window.setTimeout(() => {
      document.getElementById(targetId)?.scrollIntoView({ block: 'start' });
    }, 50);

    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <MotionConfig reducedMotion={shouldReduceMotion ? 'always' : 'never'}>
      <a
        href="#projects"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-black focus:text-sm focus:font-medium"
      >
        Skip to content
      </a>
      <StickyNav />
      <main className="bg-black min-h-screen">
        <Hero />
        <Projects />
        <About />
        <Contact />
      </main>
      <Launchpad />
    </MotionConfig>
  );
}

export default App;
