"use client";

import { useState } from "react";
import { surfaces } from "@/content/art";
import { LiveScene } from "./LiveScene";
import styles from "./SurfaceSwitcher.module.css";

const snippet: Record<string, string> = {
  bloom: "bloom",
  bloomHex: "withLook(bloom, looks.hex())",
  bloomOctagon: "withLook(bloom, looks.octagon())",
  bloomLed: "withLook(bloom, looks.led())",
  bloomDither: "withLook(bloom, looks.dither(pinks))",
  bloomPlus: 'withLook(bloom, looks.marks("plus"))',
};
