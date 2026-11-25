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

export function SetupPrompt({ prompt, label = "Copy setup prompt", note, showPrompt = true, bare = false }: SetupPromptProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    if (!(await copyText(prompt))) return;
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className={`${styles.panel} ${bare ? styles.bare : ""}`}>
      <div className={styles.row}>
        <button type="button" className={styles.button} onClick={copy} aria-label={`${label} for Claude Code or Codex`}>
          <span className={styles.marks}>
            <ClaudeMark size={18} />
            <CodexMark size={18} />
          </span>
          <span className={styles.state} aria-live="polite">
            <Icon name={copied ? "check" : "copy"} />
            {copied ? "Copied, paste it in" : label}
          </span>
        </button>
        {note ? <p className={styles.note}>{note}</p> : null}
      </div>
      {showPrompt ? (
        <details className={styles.details}>
          <summary>
            See the prompt <Icon name="chevronDown" size={14} />
          </summary>
          <pre className={styles.pre}>{prompt}</pre>
        </details>
      ) : null}
    </div>
  );
}
