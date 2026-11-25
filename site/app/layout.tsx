import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { site } from "@/content/site";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: `${site.name}: bloom your idea into success`, template: `%s, ${site.name}` },
  description: site.description,
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = { themeColor: "#060609" };
