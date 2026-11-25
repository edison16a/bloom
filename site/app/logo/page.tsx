import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { BrandCard } from "@/components/logo/BrandCard";
import { BrandGallery } from "@/components/logo/BrandGallery";
import { FeaturedBrand } from "@/components/logo/FeaturedBrand";
import { SetupPrompt } from "@/components/setup/SetupPrompt";
import { Figures } from "@/components/ui/Figures";
import { Section } from "@/components/ui/Section";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { brandFigures, brands, featuredBrand, testRuns } from "@/content/brands";
import { skillById } from "@/content/skills";
import { setupPrompt } from "@/lib/prompts";
import styles from "./logo.module.css";

const skill = skillById("logo");

export const metadata: Metadata = { title: skill.name, description: skill.summary };
