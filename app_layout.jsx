import "./globals.css";
import { getSeoContent } from "@/lib/content";

export async function generateMetadata() {
  const seo = await getSeoContent();

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    icons: {
      icon: seo.favicon || "/favicon.ico"
    }
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
