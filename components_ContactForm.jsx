"use client";

import { useState } from "react";

export default function ContactForm({ section, preview = false }) {
  const d = section.data;
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (preview) {
      setStatus("Preview mode: form submission disabled.");
      return;
    }

    setStatus("Sending...");

    const res = await fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      setStatus(d.successMessage || "Sent.");
      setForm({ name: "", email: "", message: "" });
    } else {
      const error = await res.json().catch(() => ({}));
      setStatus(error.message || "Failed to send.");
    }
  }

  return (
    <section id={section.id} className="section contact-section">
      <div>
        <h2>{d.title}</h2>
        <p>{d.subtitle}</p>
        <ul className="contact-links">
          <li><a href={`mailto:${d.email}`}>{d.email}</a></li>
          <li><a href={`tel:${d.phone}`}>{d.phone}</a></li>
          <li><a href={d.github} target="_blank" rel="noreferrer">{d.github}</a></li>
          <li><a href={d.linkedin} target="_blank" rel="noreferrer">{d.linkedin}</a></li>
        </ul>
      </div>

      <form className="contact-form" onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <textarea
          placeholder="Message"
          rows="6"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          required
        />
        <button className="btn primary">Send Message</button>
        {status && <p className="status">{status}</p>}
      </form>
    </section>
  );
}
