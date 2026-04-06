"use client";

import { motion } from "framer-motion";
import ContactForm from "./ContactForm";

function HeroSection({ section, site }) {
  const d = section.data;

  return (
    <section className="hero section" id={section.id}>
      <motion.div
        className="hero-text"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {d.badge && <span className="badge">{d.badge}</span>}
        <h1>{d.title}</h1>
        <p>{d.subtitle}</p>

        <div className="hero-buttons">
          {d.primaryButtonText && (
            <a href={d.primaryButtonLink || "#"} className="btn primary">
              {d.primaryButtonText}
            </a>
          )}
          {d.secondaryButtonText && (
            <a href={site.resumeUrl} className="btn secondary" download>
              {d.secondaryButtonText}
            </a>
          )}
        </div>
      </motion.div>

      {d.heroImage && (
        <motion.img
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          src={d.heroImage}
          alt="Hero"
          className="hero-image"
        />
      )}
    </section>
  );
}

function AboutSection({ section }) {
  const d = section.data;

  return (
    <section className="section split" id={section.id}>
      {d.image && <img src={d.image} alt={d.title} className="about-image" />}
      <div>
        <h2>{d.title}</h2>
        <p>{d.description}</p>
      </div>
    </section>
  );
}

function ProgressSkill({ name, value }) {
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0));

  return (
    <div className="skill-progress-card">
      <div className="skill-progress-head">
        <span>{name}</span>
        <span>{safeValue}%</span>
      </div>
      <div className="skill-bar">
        <div className="skill-bar-fill" style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  );
}

function CircularSkill({ name, value }) {
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0));
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (safeValue / 100) * circumference;

  return (
    <div className="skill-circle-card">
      <svg width="110" height="110" viewBox="0 0 110 110">
        <circle cx="55" cy="55" r={radius} className="skill-circle-bg" />
        <circle
          cx="55"
          cy="55"
          r={radius}
          className="skill-circle-progress"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="skill-circle-value">{safeValue}%</div>
      <p>{name}</p>
    </div>
  );
}

function SkillsSection({ section }) {
  const d = section.data;
  const mode = d.mode || "mixed";

  return (
    <section className="section" id={section.id}>
      <h2>{d.title}</h2>

      {(mode === "progress" || mode === "mixed") && (
        <div className="skills-progress-grid">
          {(d.progressItems || []).map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <ProgressSkill name={item.name} value={item.value} />
            </motion.div>
          ))}
        </div>
      )}

      {(mode === "circular" || mode === "mixed") && (
        <div className="skills-circular-grid">
          {(d.circularItems || []).map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <CircularSkill name={item.name} value={item.value} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}

function ProjectsSection({ section }) {
  const d = section.data;

  return (
    <section className="section" id={section.id}>
      <h2>{d.title}</h2>
      <div className="projects-grid">
        {(d.items || []).map((project, index) => (
          <motion.article
            key={index}
            className="project-card"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {project.image && <img src={project.image} alt={project.title} />}
            <div className="project-body">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <small>{project.stack}</small>
              {project.link && (
                <a href={project.link} target="_blank" rel="noreferrer">
                  View Project
                </a>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function TextSection({ section }) {
  const d = section.data;

  return (
    <section className="section" id={section.id}>
      <h2>{d.title}</h2>
      <p>{d.content}</p>
    </section>
  );
}

function ImageSection({ section }) {
  const d = section.data;

  return (
    <section className="section" id={section.id}>
      {d.title && <h2>{d.title}</h2>}
      {d.image && (
        <img
          src={d.image}
          alt={d.title || "Section image"}
          className="single-image-section"
        />
      )}
      {d.caption && <p className="caption">{d.caption}</p>}
    </section>
  );
}

function GallerySection({ section }) {
  const d = section.data;

  return (
    <section className="section" id={section.id}>
      <h2>{d.title}</h2>
      <div className="gallery-grid">
        {(d.images || []).map((img, index) => (
          <div key={index} className="gallery-card">
            {img.url && <img src={img.url} alt={img.alt || `Gallery ${index + 1}`} />}
            {img.alt && <p>{img.alt}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function SectionRenderer({ content, preview = false }) {
  const visibleSections = (content.sections || []).filter((s) => s.enabled);

  return (
    <>
      {visibleSections.map((section) => {
        switch (section.type) {
          case "hero":
            return <HeroSection key={section.id} section={section} site={content.site} />;
          case "about":
            return <AboutSection key={section.id} section={section} />;
          case "skills":
            return <SkillsSection key={section.id} section={section} />;
          case "projects":
            return <ProjectsSection key={section.id} section={section} />;
          case "contact":
            return <ContactForm key={section.id} section={section} preview={preview} />;
          case "text":
            return <TextSection key={section.id} section={section} />;
          case "image":
            return <ImageSection key={section.id} section={section} />;
          case "gallery":
            return <GallerySection key={section.id} section={section} />;
          default:
            return null;
        }
      })}
    </>
  );
}
