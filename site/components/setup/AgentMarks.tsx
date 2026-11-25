/**
 * The official Claude and Codex marks, for the setup buttons. The SVGs come from the lobe-icons
 * package (@lobehub/icons-static-svg 1.100.0) and are trademarks of Anthropic and OpenAI.
 */
export function ClaudeMark({ size = 16 }: { size?: number }) {
  return <img src="/media/agents/claude.svg" width={size} height={size} alt="" aria-hidden="true" />;
}

export function CodexMark({ size = 16 }: { size?: number }) {
  return <img src="/media/agents/codex.svg" width={size} height={size} alt="" aria-hidden="true" />;
}
