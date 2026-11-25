/** Small marks for the two agents the setup prompts work in. Drawn simply, at icon size. */
export function ClaudeMark({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="2.2" fill="#D97757" />
      <path fill="#D97757" d="M11.43 10.51L11.53 1.01L12.47 1.01L12.57 10.51ZM12.25 10.42L16.35 3.67L17.04 4.07L13.24 10.99ZM13.01 10.76L20.94 6.31L21.40 7.10L13.58 11.75ZM13.49 11.43L20.99 11.62L20.99 12.38L13.49 12.57ZM13.58 12.25L21.75 17.09L21.28 17.90L13.01 13.24ZM13.24 13.01L17.26 20.27L16.53 20.69L12.25 13.58ZM12.57 13.49L12.44 22.39L11.56 22.39L11.43 13.49ZM11.75 13.58L7.74 20.16L7.06 19.76L10.76 13.01ZM10.99 13.24L2.72 17.90L2.25 17.09L10.42 12.25ZM10.51 12.57L2.41 12.41L2.41 11.59L10.51 11.43ZM10.42 11.75L2.42 7.00L2.89 6.21L10.99 10.76ZM10.76 10.99L7.12 4.32L7.79 3.93L11.75 10.42Z" />
    </svg>
  );
}
