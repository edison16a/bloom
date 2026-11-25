import path from "node:path";

/** Static export: the site is plain HTML, CSS and JS in `out/`, so it can be hosted anywhere. */
/** @type {import("next").NextConfig} */
const config = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  devIndicators: false,
  outputFileTracingRoot: path.resolve("."),
};

export default config;
