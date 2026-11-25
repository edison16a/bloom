import Link from "next/link";
import { Stage } from "@/components/Stage";
import { catalog } from "@/lib/catalog";
export const generateStaticParams = () => catalog.flatMap((g) => g.items.map((e) => ({ id: e.scene.id })));
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <div className="full"><Link href="/">← Gallery</Link><Stage id={id} /></div>;
}
