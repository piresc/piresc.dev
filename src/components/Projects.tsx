import { motion, useInView } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { projects, workExperience, type Project } from '../data/portfolio';
import { useRef } from 'react';
import { getScaleInMotion, motionEase } from '../lib/motion';
import SceneVideo from './SceneVideo';
import { useReducedMotion } from '../lib/useReducedMotion';

const videoUrl = '/videos/projects.mp4';

function ProjectCard({
  project,
  index,
  shouldReduceMotion,
  featured = false,
}: {
  project: Project;
  index: number;
  shouldReduceMotion: boolean;
  featured?: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.a
      ref={ref}
      href={project.link}
      target={project.link ? '_blank' : undefined}
      rel={project.link ? 'noopener noreferrer' : undefined}
      aria-label={`Open ${project.title}`}
      initial={shouldReduceMotion ? false : { scale: 0.95, opacity: 0 }}
      animate={isInView || shouldReduceMotion ? { scale: 1, opacity: 1 } : {}}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { duration: 0.5, delay: index * 0.1, ease: motionEase }
      }
      className={`group project-card-hover p-6 flex flex-col transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)] ${featured ? 'surface sm:col-span-2' : 'surface-strong'}`}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="meta-label tone-subtle">{project.role}</span>
        <span className="meta-label text-right tone-subtle">{project.period}</span>
      </div>

      <h3 className="text-primary text-xl sm:text-2xl mb-1 font-medium">{project.title}</h3>
      <p className="text-sm leading-5 mb-5 tone-muted">{project.overview}</p>

      <ul className={`flex-grow ${featured ? 'grid sm:grid-cols-2 gap-2' : 'space-y-2'}`}>
        {project.impact.slice(0, 3).map((item, i) => (
          <li key={i} className="flex items-baseline gap-2">
            <span className="text-primary text-sm">·</span>
            <span className="text-sm tone-muted">{item}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-wrap gap-2">
        {project.tags.slice(0, 4).map((tag) => (
          <span key={tag} className="pill meta-label">
            {tag}
          </span>
        ))}
      </div>

      <span className="mt-5 inline-flex items-center gap-2 text-sm text-primary">
        Open project
        <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </motion.a>
  );
}

export default function Projects() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="projects" className="min-h-screen bg-black relative">
      <div className="bg-noise absolute inset-0 opacity-[0.15]" />

      <div className="relative z-10 px-4 md:px-6 py-20 md:py-32">
        <div className="max-w-7xl mx-auto mb-12 md:mb-16">
          <h2 className="text-primary mb-4 section-title">
            What I've shipped.
          </h2>
          <p className="section-lead tone-subtle max-w-2xl">
            Fulfillment infrastructure at Tokopedia, service quality standards at Telkomsel, and product work at Apple Academy.
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            <motion.div
              {...getScaleInMotion(shouldReduceMotion)}
              className="relative flex flex-col justify-end overflow-hidden surface sm:col-span-2 lg:col-span-1 min-h-[280px]"
            >
              <SceneVideo src={videoUrl} defer />
              <div className="scene-caption relative p-6">
                <p className="meta-label mb-2 tone-subtle">Current Role</p>
                <p className="tone-text text-lg">
                  {workExperience[0].role}
                </p>
                <p className="mt-1 text-primary text-sm">
                  {workExperience[0].company}
                </p>
              </div>
            </motion.div>

            {projects.map((project, i) => (
              <ProjectCard
                key={project.title}
                project={project}
                index={i + 1}
                shouldReduceMotion={shouldReduceMotion}
                featured={i === 0}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
