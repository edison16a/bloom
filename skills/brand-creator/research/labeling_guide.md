# Logo labeling guide

Every logo in `research/catalog.csv` is labeled by eye from contact sheets (`research/cache/sheets/*.png`, 40 logos per sheet, each tile captioned in red with its catalog id). Pixel measurements (colors, symmetry, aspect, complexity) come from `scripts/analyze_logos.py` and are not labeled by hand.

Labels are judgments. Label what you see; if a tile is blank, broken or unreadable, write `{"id": "...", "skip": true}`.

## Output

One JSON object per line in `research/labels/<sheet name>.jsonl` (for example `research/labels/mark_007.jsonl`), one line for every id on the sheet, using these short codes.

## Mark sheets (`mark_*.png`): icons, symbols and full logos

| key | values |
|---|---|
| `comp` | `S` symbol only, `W` wordmark or lettering only, `SW` symbol plus word, `B` badge (word set inside a shape) |
| `kind` | what the symbol is: `LI` letterform that is clearly the brand initial, `LM` monogram or other letterform, `G` abstract geometric shape, `P` pictorial object, `C` character, animal or mascot, `N` negative space trick (a second image in the gaps), `R` lines, bars, waves or rays, `D` dots, grid or pixels, `X` none (text only) |
| `cont` | container around the symbol: `none`, `circle`, `square`, `rsquare` (rounded square), `shield`, `hex`, `other` |
| `style` | `flat` solid fills, `line` drawn with outlines or strokes, `cut` solid shape with knocked out parts, `detail` illustrative, 3D, shaded or gradient |
| `simple` | 1 to 5. 1 = a child could draw it from memory after a glance; 3 = a few parts; 5 = intricate |
| `craft` | 1 to 5. Professional quality and how modern and resolved it looks today. 5 = world class (Apple, Stripe level), 3 = competent, 1 = amateur |

## Word sheets (`word_*.png`): wordmarks and full logos

All keys above (`comp`, `kind`, `cont`, `style`, `simple`, `craft`, describing the symbol if there is one, `kind: "X"` if not), plus:

| key | values |
|---|---|
| `type` | typeface class of the word: `geo` geometric sans (round O, Futura, Circular), `neo` neo grotesk or grotesk (Helvetica, Inter), `hum` humanist sans (Gill, Myriad), `round` rounded sans, `serif`, `slab`, `mono`, `display` custom, stylized or script lettering |
| `case` | `lower`, `upper`, `title` (first letter capital), `camel` (internal capital), `mixed` |
| `weight` | `light`, `regular`, `medium`, `bold`, `black` |
| `track` | letter spacing: `tight`, `normal`, `wide` |
| `custom` | the one custom detail in the word: `none`, `letter` (a modified letter), `lig` (ligature or joined letters), `color` (one letter or part in another color), `dot` (a special dot or accent), `cut` (a slash, cut or gap), `symbol` (a symbol replaces a letter) |
| `sym` | where the symbol sits: `left`, `top`, `right`, `inside` (part of the word), `none` |

## Example lines

```
{"id":"si-snapchat","comp":"S","kind":"C","cont":"none","style":"flat","simple":1,"craft":5}
{"id":"svgl-stripe_wordmark","comp":"W","kind":"X","cont":"none","style":"flat","simple":1,"craft":5,"type":"geo","case":"lower","weight":"bold","track":"tight","custom":"dot","sym":"none"}
```
