import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import { socialLinks } from '../data/about';
import SceneVideo from './SceneVideo';
import { useReducedMotion } from '../lib/useReducedMotion';

const videoUrl = '/videos/hero.mp4';
const HERO_CHARS = ['p', 'i', 'r', 'e', 's', 'c', '.'] as const;
const navItems = [
  { label: 'Work', href: '#projects' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

function Navbar() {
  return (
    <nav aria-label="Hero navigation" className="absolute top-0 left-0 right-0 z-30 flex justify-center">
      <div className="nav-surface bg-black/80 backdrop-blur-xl rounded-b-2xl md:rounded-b-3xl px-4 py-2 md:px-8">
        <ul className="nav-list">
          {navItems.map((item, i) => (
            <li key={i}>
              <a
                href={item.href}
                className="nav-link text-sm"
                style={{ color: 'var(--muted)' }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default function Hero() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="home" className="hero-section p-4 md:p-6">
      <div ref={ref} className="hero-frame relative rounded-2xl md:rounded-[2rem] overflow-hidden">
        <SceneVideo src={videoUrl} />

        <div className="noise-overlay" />

        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/20" />

        <Navbar />

        <div className="hero-content p-6 md:p-10">
          <div className="flex flex-wrap-reverse items-start justify-between gap-x-8 gap-y-4">
            <h1
              className="font-display hero-title"
              style={{ color: 'var(--text)' }}
            >
              {HERO_CHARS.map((char, i) => (
                <motion.span
                  key={i}
                  initial={shouldReduceMotion ? false : { y: 20, opacity: 0 }}
                  animate={isInView || shouldReduceMotion ? { y: 0, opacity: 1 } : {}}
                  transition={shouldReduceMotion ? { duration: 0 } : {
                    duration: 0.5,
                    delay: i * 0.08,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  style={{ display: 'inline-block' }}
                >
                  {char}
                </motion.span>
              ))}
              <span className="sr-only">, Backend Engineer</span>
            </h1>

            <motion.a
              href={socialLinks.cv}
              download
              initial={shouldReduceMotion ? false : { y: 20, opacity: 0 }}
              animate={isInView || shouldReduceMotion ? { y: 0, opacity: 1 } : {}}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.5, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="hero-download group inline-flex items-center gap-2 bg-primary rounded-full px-6 py-3 transition-colors duration-300 hover:bg-[var(--accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
              style={{ color: '#000000', fontWeight: 500 }}
            >
              <span className="min-w-0 text-sm sm:text-base">Download CV</span>
              <div className="hero-download-icon bg-black rounded-full flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5">
                <ArrowRight size={18} style={{ color: 'var(--accent)' }} />
              </div>
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  );
}
