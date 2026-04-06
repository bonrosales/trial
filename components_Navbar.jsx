export default function Navbar({ content }) {
  const navSections = (content.sections || []).filter(
    (section) => section.enabled && section.showInNav
  );

  return (
    <header className="navbar">
      <div className="nav-brand">
        <div className="logo">{content.site.logo}</div>
        <div>
          <strong>{content.site.ownerName}</strong>
          <div className="muted">{content.site.role}</div>
        </div>
      </div>

      <nav>
        {navSections.map((section) => (
          <a key={section.id} href={`#${section.id}`}>
            {section.label || section.type}
          </a>
        ))}
        <a href="/admin" className="admin-link">
          Admin
        </a>
      </nav>
    </header>
  );
}
