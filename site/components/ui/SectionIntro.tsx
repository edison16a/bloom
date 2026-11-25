import type { ReactNode } from "react";
import styles from "./SectionIntro.module.css";

interface SectionIntroProps {
  number?: number;
  name?: string;
  title: ReactNode;
  text?: ReactNode;
  actions?: ReactNode;
  as?: "h1" | "h2";
}
