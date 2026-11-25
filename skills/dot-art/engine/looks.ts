import type { Scene, Style, Bloom } from "./core/types";

/** A look is a Style plus bloom: the surface treatment, independent of what is being drawn. */
export interface Look { style: Style; bloom?: Bloom }

const DUO = ["#05060f", "#2a35d8", "#5468ff", "#ffffff"];
