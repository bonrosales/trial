import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionRenderer from "@/components/SectionRenderer";
import { getSiteContent } from "@/lib/content";

export default async function HomePage() {
  const content = await getSiteContent();

  const themeVars = {
    "--bg": content.theme?.background || "#0b1120",
    "--surface": content.theme?.surface || "#111827",
    "--text": content.theme?.text || "#e5e7eb",
    "--muted": content.theme?.muted || "#94a3b8",
    "--primary": content.theme?.primary || "#38bdf8",
    "--secondary": content.theme?.secondary || "#6366f1"
  };

  return (
    <main className="theme-shell" style={themeVars}>
      <div className="site-shell">
        <Navbar content={content} />
        <SectionRenderer content={content} />
        <Footer content={content} />
      </div>
    </main>
  );
}
