#!/bin/sh
# Rebuild the README GIFs: ./gifs.sh, or ./gifs.sh bloom knot for a few.
cd "$(dirname "$0")"
DOTS="--size 720x450 --fps 20 --max-mb 9"
TYPE="--size 800x500 --dpr 1.5 --fps 12.5 --colors 64 --max-mb 14"     # full scale: letters turn to noise when shrunk
WORDS="--size 640x400 --dpr 1.5 --fps 15 --colors 64 --dither none --max-mb 14"
for id in ${@:-emblems knot jelly morpho ribbons dunes funnel eclipse bloom tree helix saturn keys liquid tide tunnel bloomOctagon bloomHex pagoda dahlia rocket launchpad lotus hummingbird aurora rain}; do
  case $id in
    bloom|tree|helix|saturn) node render.mjs $id --out ../assets/$id.gif $TYPE ;;
    keys|liquid|tide|tunnel) node render.mjs $id --out ../assets/$id.gif $WORDS ;;
    rocket) node render.mjs ../examples/photos.ts --id $id --out ../assets/$id.gif $TYPE ;;
    lotus) node render.mjs ../examples/scenes/$id.ts --out ../assets/$id.gif $TYPE ;;
    rain) node render.mjs ../examples/scenes/$id.ts --out ../assets/$id.gif $WORDS ;;
    hummingbird) node render.mjs ../examples/scenes/$id.ts --out ../assets/$id.gif $DOTS ;;
    aurora) node render.mjs ../examples/scenes/$id.ts --out ../assets/$id.gif --size 720x450 --fps 10 --speed 2 --max-mb 10 ;;
    pagoda|dahlia|launchpad) node render.mjs ../examples/photos.ts --id $id --out ../assets/$id.gif $DOTS ;;
    *) node render.mjs $id --out ../assets/$id.gif $DOTS ;;
  esac
done
