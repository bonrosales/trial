import AdminEditor from "@/components/AdminEditor";
import { getSiteContent } from "@/lib/content";

export default async function AdminPage() {
  const content = await getSiteContent();
  return <AdminEditor initialContent={content} />;
}
