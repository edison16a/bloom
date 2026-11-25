import { defineScene, type OverlayCell } from "../core/types";

/**
 * Text object. A typed call collapses into a seed, buds, blossoms, holds, then blows away letter by letter.
 * Beats (s): type 0.3-1.0 | collapse 1.0-1.4 | bud 1.3-2.6 | open 2.4-5.6 | hold 5.6-7.5 | wind 7.6-9.3 | core alone 9.3-9.7 | rest 10.4
 */
const CALL = "bloom()";
