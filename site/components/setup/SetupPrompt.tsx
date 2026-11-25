"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { copyText } from "@/lib/clipboard";
import { ClaudeMark, CodexMark } from "./AgentMarks";
import styles from "./SetupPrompt.module.css";

interface SetupPromptProps {
  prompt: string;
  /** What the button says before copying. */
  label?: string;
  note?: string;
  /** Show the prompt text in a disclosure under the button. */
  showPrompt?: boolean;
  /** Drop the card around it, for heroes. */
  bare?: boolean;
}
