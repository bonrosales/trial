"use client";

import { useEffect, useRef, useState } from "react";
import SectionRenderer from "./SectionRenderer";
import { clampPercent, deepClone, moveItem, uid } from "@/lib/utils";

function TextInput({ label, value, onChange }) {
  return (
    <div className="field-group">
      <label>{label}</label>
      <input value={value || ""} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function TextArea({ label, value, onChange }) {
  return (
    <div className="field-group">
      <label>{label}</label>
      <textarea rows="4" value={value || ""} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function uploadToCloudinary(file) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !preset) return fileToBase64(file);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", preset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData
  });

  if (!res.ok) return fileToBase64(file);

  const data = await res.json();
  return data.secure_url;
}

function getNewSection(type) {
  switch (type) {
    case "hero":
      return {
        id: uid("hero"),
        type: "hero",
        label: "Hero",
        enabled: true,
        showInNav: true,
        data: {
          badge: "New Badge",
          title: "New Hero Title",
          subtitle: "New hero subtitle",
          primaryButtonText: "Primary Button",
          primaryButtonLink: "#",
          secondaryButtonText: "Secondary Button",
          heroImage: ""
        }
      };
    case "about":
      return {
        id: uid("about"),
        type: "about",
        label: "About",
        enabled: true,
        showInNav: true,
        data: {
          title: "About Section",
          description: "Write about this section",
          image: ""
        }
      };
    case "skills":
      return {
        id: uid("skills"),
        type: "skills",
        label: "Skills",
        enabled: true,
        showInNav: true,
        data: {
          title: "Skills",
          mode: "mixed",
          progressItems: [{ name: "HTML", value: 90 }],
          circularItems: [{ name: "React", value: 85 }]
        }
      };
    case "projects":
      return {
        id: uid("projects"),
        type: "projects",
        label: "Projects",
        enabled: true,
        showInNav: true,
        data: {
          title: "Projects",
          items: [
            {
              title: "New Project",
              description: "Project description",
              image: "",
              link: "#",
              stack: ""
            }
          ]
        }
      };
    case "contact":
      return {
        id: uid("contact"),
        type: "contact",
        label: "Contact",
        enabled: true,
        showInNav: true,
        data: {
          title: "Contact",
          subtitle: "Send a message",
          email: "email@example.com",
          phone: "+1 000 000 0000",
          github: "https://github.com",
          linkedin: "https://linkedin.com",
          successMessage: "Message sent successfully."
        }
      };
    case "text":
      return {
        id: uid("text"),
        type: "text",
        label: "Text",
        enabled: true,
        showInNav: true,
        data: {
          title: "Text Section",
          content: "Write your content here"
        }
      };
    case "image":
      return {
        id: uid("image"),
        type: "image",
        label: "Image",
        enabled: true,
        showInNav: true,
        data: {
          title: "Image Section",
          image: "",
          caption: ""
        }
      };
    case "gallery":
      return {
        id: uid("gallery"),
        type: "gallery",
        label: "Gallery",
        enabled: true,
        showInNav: true,
        data: {
          title: "Gallery",
          images: [{ url: "", alt: "Image 1" }]
        }
      };
    default:
      return null;
  }
}

function PreviewHeader({ device, setDevice }) {
  return (
    <div className="builder-toolbar">
      <div className="builder-toolbar-left">
        <strong>Web Builder Preview</strong>
      </div>
      <div className="device-switcher">
        <button className={device === "desktop" ? "active" : ""} onClick={() => setDevice("desktop")}>
          Desktop
        </button>
        <button className={device === "tablet" ? "active" : ""} onClick={() => setDevice("tablet")}>
          Tablet
        </button>
        <button className={device === "mobile" ? "active" : ""} onClick={() => setDevice("mobile")}>
          Mobile
        </button>
      </div>
    </div>
  );
}

export default function AdminEditor({ initialContent }) {
  const [content, setContent] = useState(initialContent);
  const [status, setStatus] = useState("");
  const [authKey, setAuthKey] = useState("");
  const [authed, setAuthed] = useState(false);
  const [selected, setSelected] = useState(null);
  const [autosave, setAutosave] = useState(false);
  const [previewMode, setPreviewMode] = useState(true);
  const [device, setDevice] = useState("desktop");
  const [messages, setMessages] = useState([]);
  const [newSectionType, setNewSectionType] = useState("text");

  const importRef = useRef(null);
  const autosaveRef = useRef(null);

  useEffect(() => {
    if (content.sections?.length && !selected) {
      setSelected(content.sections[0].id);
    }
  }, [content, selected]);

  useEffect(() => {
    if (!autosave || !authed) return;
    clearTimeout(autosaveRef.current);
    autosaveRef.current = setTimeout(() => save(), 1200);
    return () => clearTimeout(autosaveRef.current);
  }, [content, autosave, authed]);

  const selectedSection = content.sections?.find((s) => s.id === selected);

  async function login() {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: authKey })
    });

    if (res.ok) {
      setAuthed(true);
      setStatus("Admin unlocked.");
      loadMessages();
    } else {
      setStatus("Invalid key.");
    }
  }

  async function save() {
    const res = await fetch("/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content)
    });

    if (res.ok) {
      setStatus("Saved to JSONBin.");
    } else {
      const error = await res.json().catch(() => ({}));
      setStatus(error.message || "Save failed.");
    }
  }

  async function exportJson() {
    window.open("/api/export", "_blank");
  }

  async function importJson(file) {
    const text = await file.text();
    const data = JSON.parse(text);
    setContent(data);
    setStatus("Imported locally. Click Save JSONBin to sync online.");
  }

  async function loadMessages() {
    const res = await fetch("/api/messages");
    if (res.ok) {
      const data = await res.json();
      setMessages(data.reverse());
    }
  }

  async function updateMessage(id, action) {
    const res = await fetch("/api/messages", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action })
    });
    if (res.ok) loadMessages();
  }

  async function deleteMessage(id) {
    const res = await fetch("/api/messages", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    if (res.ok) loadMessages();
  }

  function updateSite(field, value) {
    setContent((prev) => ({ ...prev, site: { ...prev.site, [field]: value } }));
  }

  function updateTheme(field, value) {
    setContent((prev) => ({ ...prev, theme: { ...prev.theme, [field]: value } }));
  }

  function updateSeo(field, value) {
    setContent((prev) => ({ ...prev, seo: { ...prev.seo, [field]: value } }));
  }

  function updateFooter(value) {
    setContent((prev) => ({ ...prev, footer: { ...prev.footer, text: value } }));
  }

  function updateSectionMeta(id, field, value) {
    setContent((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    }));
  }

  function updateSelectedSectionData(field, value) {
    const next = deepClone(content);
    const index = next.sections.findIndex((s) => s.id === selected);
    if (index === -1) return;
    next.sections[index].data[field] = value;
    setContent(next);
  }

  function addSection() {
    const next = deepClone(content);
    const section = getNewSection(newSectionType);
    if (!section) return;
    next.sections.push(section);
    setContent(next);
    setSelected(section.id);
    setStatus(`${section.type} section added.`);
  }

  function duplicateSection(id) {
    const next = deepClone(content);
    const original = next.sections.find((s) => s.id === id);
    if (!original) return;

    const copy = {
      ...deepClone(original),
      id: uid(original.type),
      label: `${original.label} Copy`
    };

    next.sections.push(copy);
    setContent(next);
    setSelected(copy.id);
    setStatus("Section duplicated.");
  }

  function moveSectionByDirection(id, dir) {
    const next = deepClone(content);
    const index = next.sections.findIndex((s) => s.id === id);
    const target = dir === "up" ? index - 1 : index + 1;
    if (index < 0 || target < 0 || target >= next.sections.length) return;
    next.sections = moveItem(next.sections, index, target);
    setContent(next);
  }

  function deleteSection(id) {
    const next = deepClone(content);
    next.sections = next.sections.filter((s) => s.id !== id);
    setContent(next);
    if (selected === id) setSelected(next.sections[0]?.id || null);
  }

  async function uploadSingleImage(field, file) {
    const url = await uploadToCloudinary(file);
    updateSelectedSectionData(field, url);
  }

  function renderSkillsEditor(d) {
    return (
      <>
        <TextInput label="Title" value={d.title} onChange={(v) => updateSelectedSectionData("title", v)} />
        <TextInput label="Mode (progress / circular / mixed)" value={d.mode} onChange={(v) => updateSelectedSectionData("mode", v)} />

        <h3>Progress Skills</h3>
        {(d.progressItems || []).map((item, index) => (
          <div key={index} className="project-edit-card">
            <TextInput
              label="Name"
              value={item.name}
              onChange={(v) => {
                const next = [...d.progressItems];
                next[index].name = v;
                updateSelectedSectionData("progressItems", next);
              }}
            />
            <TextInput
              label="Value"
              value={item.value}
              onChange={(v) => {
                const next = [...d.progressItems];
                next[index].value = clampPercent(v);
                updateSelectedSectionData("progressItems", next);
              }}
            />
            <button
              className="danger"
              onClick={() =>
                updateSelectedSectionData(
                  "progressItems",
                  d.progressItems.filter((_, i) => i !== index)
                )
              }
            >
              Delete
            </button>
          </div>
        ))}
        <button
          onClick={() =>
            updateSelectedSectionData("progressItems", [
              ...(d.progressItems || []),
              { name: "New Skill", value: 70 }
            ])
          }
        >
          Add Progress Skill
        </button>

        <h3>Circular Skills</h3>
        {(d.circularItems || []).map((item, index) => (
          <div key={index} className="project-edit-card">
            <TextInput
              label="Name"
              value={item.name}
              onChange={(v) => {
                const next = [...d.circularItems];
                next[index].name = v;
                updateSelectedSectionData("circularItems", next);
              }}
            />
            <TextInput
              label="Value"
              value={item.value}
              onChange={(v) => {
                const next = [...d.circularItems];
                next[index].value = clampPercent(v);
                updateSelectedSectionData("circularItems", next);
              }}
            />
            <button
              className="danger"
              onClick={() =>
                updateSelectedSectionData(
                  "circularItems",
                  d.circularItems.filter((_, i) => i !== index)
                )
              }
            >
              Delete
            </button>
          </div>
        ))}
        <button
          onClick={() =>
            updateSelectedSectionData("circularItems", [
              ...(d.circularItems || []),
              { name: "New Skill", value: 75 }
            ])
          }
        >
          Add Circular Skill
        </button>
      </>
    );
  }

  function renderProjectsEditor(d) {
    return (
      <>
        <TextInput label="Title" value={d.title} onChange={(v) => updateSelectedSectionData("title", v)} />

        {(d.items || []).map((project, index) => (
          <div key={index} className="project-edit-card">
            <TextInput
              label="Title"
              value={project.title}
              onChange={(v) => {
                const next = [...d.items];
                next[index].title = v;
                updateSelectedSectionData("items", next);
              }}
            />
            <TextArea
              label="Description"
              value={project.description}
              onChange={(v) => {
                const next = [...d.items];
                next[index].description = v;
                updateSelectedSectionData("items", next);
              }}
            />
            <TextInput
              label="Image"
              value={project.image}
              onChange={(v) => {
                const next = [...d.items];
                next[index].image = v;
                updateSelectedSectionData("items", next);
              }}
            />
            <TextInput
              label="Link"
              value={project.link}
              onChange={(v) => {
                const next = [...d.items];
                next[index].link = v;
                updateSelectedSectionData("items", next);
              }}
            />
            <TextInput
              label="Stack"
              value={project.stack}
              onChange={(v) => {
                const next = [...d.items];
                next[index].stack = v;
                updateSelectedSectionData("items", next);
              }}
            />
            <div className="row">
              <button
                onClick={() =>
                  updateSelectedSectionData(
                    "items",
                    moveItem(d.items, index, Math.max(0, index - 1))
                  )
                }
              >
                Up
              </button>
              <button
                onClick={() =>
                  updateSelectedSectionData(
                    "items",
                    moveItem(d.items, index, Math.min(d.items.length - 1, index + 1))
                  )
                }
              >
                Down
              </button>
              <button
                className="danger"
                onClick={() =>
                  updateSelectedSectionData(
                    "items",
                    d.items.filter((_, i) => i !== index)
                  )
                }
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={() =>
            updateSelectedSectionData("items", [
              ...(d.items || []),
              {
                title: "New Project",
                description: "Description",
                image: "",
                link: "#",
                stack: ""
              }
            ])
          }
        >
          Add Project
        </button>
      </>
    );
  }

  function renderGalleryEditor(d) {
    return (
      <>
        <TextInput label="Title" value={d.title} onChange={(v) => updateSelectedSectionData("title", v)} />
        {(d.images || []).map((img, index) => (
          <div key={index} className="project-edit-card">
            <TextInput
              label="Image URL"
              value={img.url}
              onChange={(v) => {
                const next = [...d.images];
                next[index].url = v;
                updateSelectedSectionData("images", next);
              }}
            />
            <TextInput
              label="Alt"
              value={img.alt}
              onChange={(v) => {
                const next = [...d.images];
                next[index].alt = v;
                updateSelectedSectionData("images", next);
              }}
            />
            <button
              className="danger"
              onClick={() =>
                updateSelectedSectionData(
                  "images",
                  d.images.filter((_, i) => i !== index)
                )
              }
            >
              Delete
            </button>
          </div>
        ))}
        <button
          onClick={() =>
            updateSelectedSectionData("images", [
              ...(d.images || []),
              { url: "", alt: "" }
            ])
          }
        >
          Add Image
        </button>
      </>
    );
  }

  function renderDynamicEditor() {
    if (!selectedSection) return <p>No section selected.</p>;

    const s = selectedSection;
    const d = s.data;

    return (
      <>
        <TextInput
          label="Section Label"
          value={s.label}
          onChange={(v) => updateSectionMeta(s.id, "label", v)}
        />

        {s.type === "hero" && (
          <>
            <TextInput label="Badge" value={d.badge} onChange={(v) => updateSelectedSectionData("badge", v)} />
            <TextArea label="Title" value={d.title} onChange={(v) => updateSelectedSectionData("title", v)} />
            <TextArea label="Subtitle" value={d.subtitle} onChange={(v) => updateSelectedSectionData("subtitle", v)} />
            <TextInput
              label="Primary Button Text"
              value={d.primaryButtonText}
              onChange={(v) => updateSelectedSectionData("primaryButtonText", v)}
            />
            <TextInput
              label="Primary Button Link"
              value={d.primaryButtonLink}
              onChange={(v) => updateSelectedSectionData("primaryButtonLink", v)}
            />
            <TextInput
              label="Secondary Button Text"
              value={d.secondaryButtonText}
              onChange={(v) => updateSelectedSectionData("secondaryButtonText", v)}
            />
            <TextInput
              label="Hero Image"
              value={d.heroImage}
              onChange={(v) => updateSelectedSectionData("heroImage", v)}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && uploadSingleImage("heroImage", e.target.files[0])}
            />
          </>
        )}

        {s.type === "about" && (
          <>
            <TextInput label="Title" value={d.title} onChange={(v) => updateSelectedSectionData("title", v)} />
            <TextArea
              label="Description"
              value={d.description}
              onChange={(v) => updateSelectedSectionData("description", v)}
            />
            <TextInput label="Image" value={d.image} onChange={(v) => updateSelectedSectionData("image", v)} />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && uploadSingleImage("image", e.target.files[0])}
            />
          </>
        )}

        {s.type === "skills" && renderSkillsEditor(d)}
        {s.type === "projects" && renderProjectsEditor(d)}

        {s.type === "contact" && (
          <>
            <TextInput label="Title" value={d.title} onChange={(v) => updateSelectedSectionData("title", v)} />
            <TextArea label="Subtitle" value={d.subtitle} onChange={(v) => updateSelectedSectionData("subtitle", v)} />
            <TextInput label="Email" value={d.email} onChange={(v) => updateSelectedSectionData("email", v)} />
            <TextInput label="Phone" value={d.phone} onChange={(v) => updateSelectedSectionData("phone", v)} />
            <TextInput label="GitHub" value={d.github} onChange={(v) => updateSelectedSectionData("github", v)} />
            <TextInput label="LinkedIn" value={d.linkedin} onChange={(v) => updateSelectedSectionData("linkedin", v)} />
            <TextInput
              label="Success Message"
              value={d.successMessage}
              onChange={(v) => updateSelectedSectionData("successMessage", v)}
            />
          </>
        )}

        {s.type === "text" && (
          <>
            <TextInput label="Title" value={d.title} onChange={(v) => updateSelectedSectionData("title", v)} />
            <TextArea label="Content" value={d.content} onChange={(v) => updateSelectedSectionData("content", v)} />
          </>
        )}

        {s.type === "image" && (
          <>
            <TextInput label="Title" value={d.title} onChange={(v) => updateSelectedSectionData("title", v)} />
            <TextInput label="Image" value={d.image} onChange={(v) => updateSelectedSectionData("image", v)} />
            <TextInput label="Caption" value={d.caption} onChange={(v) => updateSelectedSectionData("caption", v)} />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && uploadSingleImage("image", e.target.files[0])}
            />
          </>
        )}

        {s.type === "gallery" && renderGalleryEditor(d)}
      </>
    );
  }

  if (!authed) {
    return (
      <div className="admin-login-page">
        <div className="admin-card">
          <h1>Admin Login</h1>
          <input
            type="password"
            placeholder="Enter admin key"
            value={authKey}
            onChange={(e) => setAuthKey(e.target.value)}
          />
          <button className="btn primary" onClick={login}>
            Unlock
          </button>
          {status && <p className="status">{status}</p>}
        </div>
      </div>
    );
  }

  const builderClass =
    device === "desktop"
      ? "preview-desktop"
      : device === "tablet"
      ? "preview-tablet"
      : "preview-mobile";

  const settingsKeys = [
    "site-settings",
    "theme-settings",
    "seo-settings",
    "footer-settings",
    "messages-inbox"
  ];

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <h2>Admin</h2>

        <div className="sidebar-group">
          <h3>General</h3>
          <button onClick={save}>Save JSONBin</button>
          <button onClick={exportJson}>Export JSON</button>
          <button onClick={() => importRef.current?.click()}>Import JSON</button>
          <input
            hidden
            ref={importRef}
            type="file"
            accept="application/json"
            onChange={(e) => e.target.files?.[0] && importJson(e.target.files[0])}
          />
          <label className="check-row">
            <input type="checkbox" checked={autosave} onChange={() => setAutosave(!autosave)} />
            Autosave
          </label>
          <label className="check-row">
            <input type="checkbox" checked={previewMode} onChange={() => setPreviewMode(!previewMode)} />
            Live Preview
          </label>
        </div>

        <div className="sidebar-group">
          <h3>Settings</h3>
          <button onClick={() => setSelected("site-settings")}>Site Settings</button>
          <button onClick={() => setSelected("theme-settings")}>Theme Editor</button>
          <button onClick={() => setSelected("seo-settings")}>SEO Settings</button>
          <button onClick={() => setSelected("messages-inbox")}>Messages Inbox</button>
          <button onClick={() => setSelected("footer-settings")}>Footer</button>
        </div>

        <div className="sidebar-group">
          <h3>Sections</h3>
          {(content.sections || []).map((section, index) => (
            <div key={section.id} className="section-row">
              <button
                className={selected === section.id ? "active" : ""}
                onClick={() => setSelected(section.id)}
              >
                {index + 1}. {section.label || section.type}
              </button>
              <button onClick={() => moveSectionByDirection(section.id, "up")}>↑</button>
              <button onClick={() => moveSectionByDirection(section.id, "down")}>↓</button>
              <button onClick={() => updateSectionMeta(section.id, "enabled", !section.enabled)}>
                {section.enabled ? "Hide" : "Show"}
              </button>
              <button onClick={() => updateSectionMeta(section.id, "showInNav", !section.showInNav)}>
                {section.showInNav ? "NavOff" : "NavOn"}
              </button>
              <button onClick={() => duplicateSection(section.id)}>Copy</button>
              <button className="danger" onClick={() => deleteSection(section.id)}>
                X
              </button>
            </div>
          ))}

          <div className="add-section-box">
            <select value={newSectionType} onChange={(e) => setNewSectionType(e.target.value)}>
              <option value="hero">Hero</option>
              <option value="about">About</option>
              <option value="skills">Skills</option>
              <option value="projects">Projects</option>
              <option value="contact">Contact</option>
              <option value="text">Text</option>
              <option value="image">Image</option>
              <option value="gallery">Gallery</option>
            </select>
            <button onClick={addSection}>Add Section</button>
          </div>
        </div>

        {status && <p className="status">{status}</p>}
      </aside>

      <main className={`admin-content ${previewMode ? "with-preview" : ""}`}>
        <section className="editor-panel">
          {selected === "site-settings" && (
            <>
              <h2>Site Settings</h2>
              <TextInput label="Owner Name" value={content.site.ownerName} onChange={(v) => updateSite("ownerName", v)} />
              <TextInput label="Logo" value={content.site.logo} onChange={(v) => updateSite("logo", v)} />
              <TextInput label="Role" value={content.site.role} onChange={(v) => updateSite("role", v)} />
              <TextInput label="Resume URL" value={content.site.resumeUrl} onChange={(v) => updateSite("resumeUrl", v)} />
            </>
          )}

          {selected === "theme-settings" && (
            <>
              <h2>Theme Editor</h2>
              <TextInput label="Background" value={content.theme.background} onChange={(v) => updateTheme("background", v)} />
              <TextInput label="Surface" value={content.theme.surface} onChange={(v) => updateTheme("surface", v)} />
              <TextInput label="Text" value={content.theme.text} onChange={(v) => updateTheme("text", v)} />
              <TextInput label="Muted" value={content.theme.muted} onChange={(v) => updateTheme("muted", v)} />
              <TextInput label="Primary" value={content.theme.primary} onChange={(v) => updateTheme("primary", v)} />
              <TextInput label="Secondary" value={content.theme.secondary} onChange={(v) => updateTheme("secondary", v)} />
            </>
          )}

          {selected === "seo-settings" && (
            <>
              <h2>SEO Settings</h2>
              <TextInput label="Title" value={content.seo.title} onChange={(v) => updateSeo("title", v)} />
              <TextArea label="Description" value={content.seo.description} onChange={(v) => updateSeo("description", v)} />
              <TextInput label="Keywords" value={content.seo.keywords} onChange={(v) => updateSeo("keywords", v)} />
              <TextInput label="Favicon" value={content.seo.favicon} onChange={(v) => updateSeo("favicon", v)} />
            </>
          )}

          {selected === "footer-settings" && (
            <>
              <h2>Footer</h2>
              <TextInput label="Footer Text" value={content.footer.text} onChange={updateFooter} />
            </>
          )}

          {selected === "messages-inbox" && (
            <>
              <div className="row spread">
                <h2>Messages Inbox</h2>
                <button onClick={loadMessages}>Refresh</button>
              </div>

              <div className="messages-list">
                {messages.length === 0 && <p>No messages yet.</p>}
                {messages.map((msg) => (
                  <div key={msg.id} className={`message-card ${msg.archived ? "archived" : ""}`}>
                    <div className="row spread">
                      <strong>{msg.name}</strong>
                      <span>{msg.read ? "Read" : "Unread"}</span>
                    </div>
                    <p>{msg.email}</p>
                    <small>{msg.createdAt}</small>
                    <p>{msg.message}</p>
                    <div className="row">
                      <button onClick={() => updateMessage(msg.id, msg.read ? "unread" : "read")}>
                        {msg.read ? "Mark Unread" : "Mark Read"}
                      </button>
                      <button onClick={() => updateMessage(msg.id, msg.archived ? "unarchive" : "archive")}>
                        {msg.archived ? "Unarchive" : "Archive"}
                      </button>
                      <button className="danger" onClick={() => deleteMessage(msg.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {!settingsKeys.includes(selected) && (
            <>
              <div className="row spread">
                <h2>Edit Section</h2>
                {selectedSection && (
                  <span className="type-badge">
                    {selectedSection.type} / {selectedSection.id}
                  </span>
                )}
              </div>
              {renderDynamicEditor()}
            </>
          )}
        </section>

        {previewMode && (
          <section className="preview-panel">
            <PreviewHeader device={device} setDevice={setDevice} />
            <div className="builder-canvas">
              <div className={`builder-frame ${builderClass}`}>
                <div
                  className="preview-frame"
                  style={{
                    "--bg": content.theme.background,
                    "--surface": content.theme.surface,
                    "--text": content.theme.text,
                    "--muted": content.theme.muted,
                    "--primary": content.theme.primary,
                    "--secondary": content.theme.secondary,
                    background: content.theme.background,
                    color: content.theme.text
                  }}
                >
                  <SectionRenderer content={content} preview />
                  <footer className="footer">{content.footer.text}</footer>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
