/** Facts about the project that more than one page needs. */
export const site = {
  name: "Bloom",
  description: "Three AI agents that help you make the art for your site, your launch film and your logo.",
  repoSlug: "edison16a/bloom",
  repoUrl: "https://github.com/edison16a/bloom",
  cloneUrl: "https://github.com/edison16a/bloom.git",
  branch: "main",
} as const;

export const nav = [
  { href: "/art/", label: "Art" },
  { href: "/launch/", label: "Launch" },
  { href: "/logo/", label: "Logo" },
] as const;
