import type { ReactNode } from "react";
import "./globals.css";
export const metadata = { title: "dot-art gallery" };
export default function Layout({ children }: { children: ReactNode }) { return <html lang="en"><body>{children}</body></html>; }
