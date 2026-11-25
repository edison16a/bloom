"""Collect real tech logos from open datasets into research/cache and write research/catalog.csv.

Sources (all public, logos remain trademarks of their owners and are used here for analysis only):
  si    simple-icons (CC0): monochrome brand icons with the official brand hex
  gb    gilbarbara/logos (CC0): full color logos, many with a symbol and a wordmark file
  svgl  pheralb/svgl (MIT): modern tech and AI logos, many with separate wordmarks
  yc    Y Combinator companies that reached Series A or later, went public, or are YC top companies
  wd    Wikidata companies in tech industries with a logo and 5 or more Wikipedia sitelinks

Run from the repo root:  python3 -I scripts/collect_logos.py
Stdlib only. Re-running skips files already downloaded.
"""
import argparse, csv, io, json, os, re, sys, tarfile, time, urllib.error, urllib.parse, urllib.request
from concurrent.futures import ThreadPoolExecutor

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(ROOT, "research", "cache")
UA = {"User-Agent": "logo-research-script/1.0 (open dataset analysis)"}
SOURCES = {
    "si": "https://registry.npmjs.org/simple-icons/-/simple-icons-16.38.1.tgz",
    "gb": "https://codeload.github.com/gilbarbara/logos/tar.gz/refs/heads/main",
    "svgl": "https://codeload.github.com/pheralb/svgl/tar.gz/refs/heads/main",
}
TECH_INDUSTRIES = "wd:Q638608 wd:Q880371 wd:Q11661 wd:Q1068598 wd:Q2096489 wd:Q418 wd:Q11650 wd:Q941594 wd:Q7397 wd:Q1366722 wd:Q11016 wd:Q8148"


def get(url, timeout=60):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


def key_of(name):
    n = name.lower().replace("&", "and")
    n = re.sub(r"\b(inc|corp|corporation|ltd|llc|gmbh|co|company|technologies|labs?)\b\.?", "", n)
    return re.sub(r"[^a-z0-9]", "", n)


def safe_extract(blob, dest, want):
    """Extract only .svg/.json/.ts members, refusing absolute paths and parent traversal."""
    os.makedirs(dest, exist_ok=True)
    with tarfile.open(fileobj=io.BytesIO(blob), mode="r:gz") as t:
        for m in t.getmembers():
            if not m.isfile() or not want(m.name):
                continue
            if m.name.startswith("/") or ".." in m.name.split("/"):
                continue
            out = os.path.join(dest, m.name)
            os.makedirs(os.path.dirname(out), exist_ok=True)
            with open(out, "wb") as f:
                f.write(t.extractfile(m).read())

