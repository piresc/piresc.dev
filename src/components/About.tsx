import { motion } from 'framer-motion';
import { ArrowUpRight, CalendarDays } from 'lucide-react';
import { skills, workExperience, education } from '../data/portfolio';
import { getRevealMotion, getScaleInMotion } from '../lib/motion';
import { useReducedMotion } from '../lib/useReducedMotion';

export default function About() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="about" className="relative min-h-screen bg-black">
      <div className="bg-noise absolute inset-0 opacity-[0.15]" />

      <div className="relative z-10 px-4 py-20 md:px-6 md:py-32">
        <div className="mx-auto mb-12 max-w-7xl md:mb-16">
          <h2 className="mt-4 mb-4 max-w-4xl text-primary section-title">
            Work timeline.
          </h2>
          <p className="max-w-2xl section-lead tone-subtle">
            Projects show outcomes. This section shows how scope and ownership grew.
          </p>
        </div>

        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
            <motion.div
              {...getScaleInMotion(shouldReduceMotion)}
              className="flex flex-col justify-between surface p-6 md:p-8"
            >
              <div>
                <h3 className="text-primary hero-card-title">
                  How I got here
                </h3>
                <p className="text-sm leading-6 tone-muted mt-4">
                  Started in iOS product work: user research, interface decisions, shipping apps end-to-end. Then moved deeper into backend systems: service ownership, supplier integrations, high-throughput fulfillment at scale.
                </p>
                <p className="text-sm leading-6 tone-muted mt-3">
                  Now focused on modernization and quality standards across distributed systems.
                </p>
                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
                  <span className="text-primary text-sm font-medium">4+ years backend</span>
                  <span className="text-primary text-sm font-medium">27+ services</span>
                  <span className="text-primary text-sm font-medium">millions of users</span>
                </div>
              </div>

              <div className="mt-6">
                <a
                  href="#contact"
                  className="group tap-target inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 text-sm text-primary transition-colors duration-300 hover:border-[var(--border-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
                >
                  Contact
                  <ArrowUpRight
                    size={14}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              </div>
            </motion.div>

            <div className="flex flex-col gap-2">
              {workExperience.map((exp, index) => {
                return (
                  <motion.article
                    key={exp.company}
                    {...getScaleInMotion(shouldReduceMotion, { delay: (index + 1) * 0.1 })}
                    className="surface-strong p-6 md:p-8 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto] gap-4 md:gap-8 items-start"
                  >
                    <div>
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <h3 className="text-primary metric-title">
                          {exp.company}
                        </h3>
                        <span className="meta-label tone-subtle">{exp.phase}</span>
                      </div>
                      <p className="mt-1 meta-label tone-subtle">{exp.role}</p>
                      <p className="mt-3 text-sm leading-6 tone-muted max-w-xl">
                        {exp.summary}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {(exp.proof ?? []).map((item) => (
                          <span key={item} className="pill meta-label">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className="meta-label tone-subtle inline-flex items-center gap-2">
                      <CalendarDays size={14} />
                      {exp.period}
                    </p>
                  </motion.article>
                );
              })}
            </div>
          </div>

          <motion.div
            {...getRevealMotion(shouldReduceMotion, { margin: '-100px' })}
            className="mt-12 grid gap-2 border-t border-[var(--border)] pt-12 md:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]"
          >
            <div>
              <h3 className="mt-4 max-w-xl text-primary section-subtitle">
                Stack</h3>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {skills.map((skill) => (
                <div key={skill.category} className="surface p-5">
                  <p className="text-primary stack-label">
                    {skill.category}
                  </p>
                  <p className="mt-4 text-sm leading-6 tone-muted">{skill.skills}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            {...getRevealMotion(shouldReduceMotion, { margin: '-100px' })}
            className="mt-12 border-t border-[var(--border)] pt-12"
          >
            <h3 className="text-primary section-subtitle">Education</h3>
            <div className="mt-6 grid gap-2 md:grid-cols-2">
              {education.map((edu) => (
                <div key={edu.degree} className="surface p-6">
                  <p className="text-sm tone-subtle">{edu.period}</p>
                  <h3 className="mt-3 text-primary degree-title">
                    {edu.degree}
                  </h3>
                  <p className="mt-2 text-sm tone-muted">
                    {edu.institution} · {edu.location}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
