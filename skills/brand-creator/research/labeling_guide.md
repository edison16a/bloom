# Logo labeling guide

Every logo in `research/catalog.csv` is labeled by eye from contact sheets (`research/cache/sheets/*.png`, 40 logos per sheet, each tile captioned in red with its catalog id). Pixel measurements (colors, symmetry, aspect, complexity) come from `scripts/analyze_logos.py` and are not labeled by hand.

Labels are judgments. Label what you see; if a tile is blank, broken or unreadable, write `{"id": "...", "skip": true}`.

## Output

One JSON object per line in `research/labels/<sheet name>.jsonl` (for example `research/labels/mark_007.jsonl`), one line for every id on the sheet, using these short codes.
