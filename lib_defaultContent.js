const defaultContent = {
  seo: {
    title: "Portfolio CMS",
    description:
      "Editable portfolio website with admin panel, JSONBin sync, responsive builder preview, and dynamic sections.",
    keywords: "portfolio, nextjs, admin, jsonbin, cms, responsive",
    favicon: "/favicon.ico"
  },

  site: {
    ownerName: "Your Name",
    logo: "YN",
    role: "Frontend Developer",
    resumeUrl: "/resume.pdf"
  },

  theme: {
    background: "#0b1120",
    surface: "#111827",
    text: "#e5e7eb",
    muted: "#94a3b8",
    primary: "#38bdf8",
    secondary: "#6366f1"
  },

  footer: {
    text: "© 2025 Your Name. All rights reserved."
  },

  sections: [
    {
      id: "hero-1",
      type: "hero",
      label: "Hero",
      enabled: true,
      showInNav: true,
      data: {
        badge: "Available for freelance",
        title: "I build modern portfolio websites with admin editing",
        subtitle:
          "Editable, animated, JSONBin-powered portfolio with admin control, live preview, and responsive builder mode.",
        primaryButtonText: "View Projects",
        primaryButtonLink: "#projects-1",
        secondaryButtonText: "Download Resume",
        heroImage:
          "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop"
      }
    },
    {
      id: "about-1",
      type: "about",
      label: "About",
      enabled: true,
      showInNav: true,
      data: {
        title: "About Me",
        description:
          "I create responsive websites, dashboards, and admin tools with modern frontend technologies.",
        image:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop"
      }
    },
    {
      id: "skills-1",
      type: "skills",
      label: "Skills",
      enabled: true,
      showInNav: true,
      data: {
        title: "Skills",
        mode: "mixed",
        progressItems: [
          { name: "HTML", value: 95 },
          { name: "CSS", value: 90 },
          { name: "JavaScript", value: 88 },
          { name: "React", value: 85 }
        ],
        circularItems: [
          { name: "Next.js", value: 82 },
          { name: "UI/UX", value: 78 },
          { name: "APIs", value: 86 }
        ]
      }
    },
    {
      id: "projects-1",
      type: "projects",
      label: "Projects",
      enabled: true,
      showInNav: true,
      data: {
        title: "Projects",
        items: [
          {
            title: "Portfolio CMS",
            description:
              "Editable portfolio with secure API, live preview, and JSONBin persistence.",
            image:
              "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1200&auto=format&fit=crop",
            link: "https://example.com",
            stack: "Next.js, JSONBin"
          },
          {
            title: "Admin Dashboard",
            description:
              "Responsive admin interface with section editing, autosave, and preview modes.",
            image:
              "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
            link: "https://example.com",
            stack: "React, Framer Motion"
          }
        ]
      }
    },
    {
      id: "contact-1",
      type: "contact",
      label: "Contact",
      enabled: true,
      showInNav: true,
      data: {
        title: "Contact Me",
        subtitle: "Send a message using the form.",
        email: "yourname@example.com",
        phone: "+1 555 000 0000",
        github: "https://github.com/yourname",
        linkedin: "https://linkedin.com/in/yourname",
        successMessage: "Message sent successfully."
      }
    }
  ]
};

export default defaultContent;
