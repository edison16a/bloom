import Link from "next/link";
import { Stage } from "@/components/Stage";
import { catalog } from "@/lib/catalog";

export default function Page() {
  return (
    <main>
      <div className="hero"><Stage id="keys" /><div className="copy"><h1>Anything, in dots.</h1><p>Objects, pictures, type and backgrounds. Every loop is seamless.</p></div></div>
      {catalog.map((g) => (
        <section key={g.name}>
          <h2>{g.name}</h2><p>{g.note}</p>
          <div className="grid">{g.items.map(({ scene, prompt }) => (
            <Link key={scene.id} className="card" href={`/s/${scene.id}`}><div className="stage"><Stage id={scene.id} label={prompt} /></div><strong>{scene.title}</strong><span>{prompt}</span></Link>
          ))}</div>
        </section>
      ))}
    </main>
  );
}
