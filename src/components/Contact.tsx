import { motion } from 'framer-motion';
import { ArrowUpRight, Download, Mail } from 'lucide-react';
import { socialLinks, socialProfiles } from '../data/about';
import { getRevealMotion } from '../lib/motion';
import { useReducedMotion } from '../lib/useReducedMotion';

export default function Contact() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="contact" className="bg-black px-4 py-20 md:px-6 md:py-32">
      <div className="max-w-7xl mx-auto">
        <motion.div {...getRevealMotion(shouldReduceMotion)} className="text-center mb-12">
          <h2 className="mb-6 section-title tone-text">Let’s build.</h2>
        </motion.div>

        <motion.div
          {...getRevealMotion(shouldReduceMotion, { delay: 0.1 })}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          <a
            href={socialLinks.email}
            className="contact-action group flex items-center gap-3 bg-primary rounded-full px-6 py-3 text-black font-medium transition-colors duration-300 hover:bg-[var(--accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
          >
            <Mail size={18} aria-hidden="true" className="shrink-0 transition-transform motion-safe:group-hover:translate-x-0.5" />
            <span className="min-w-0">Email Me</span>
          </a>
          <a
            href={socialLinks.cv}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-action group flex items-center gap-3 rounded-full px-6 py-3 tone-text transition-colors duration-300 hover:border-[var(--border-strong)] border border-[var(--border)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
          >
            <Download size={18} aria-hidden="true" className="shrink-0 transition-transform motion-safe:group-hover:translate-x-0.5" />
            <span className="min-w-0">Download CV</span>
          </a>
        </motion.div>

        <motion.ul
          aria-label="Social profiles"
          {...getRevealMotion(shouldReduceMotion, { delay: 0.2 })}
          className="flex flex-wrap justify-center gap-3"
        >
          {socialProfiles.map((social) => (
            <li key={social.name}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="tap-target inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 text-sm tone-subtle transition-all hover:border-[var(--border-strong)] hover:text-primary"
              >
                {social.name}
                <ArrowUpRight size={14} aria-hidden="true" className="shrink-0" />
              </a>
            </li>
          ))}
        </motion.ul>

        <motion.p
          {...getRevealMotion(shouldReduceMotion, { delay: 0.25 })}
          className="text-center mt-10 meta-label tone-subtle"
        >
          Based in Indonesia · Open to remote
        </motion.p>
      </div>
    </section>
  );
}
