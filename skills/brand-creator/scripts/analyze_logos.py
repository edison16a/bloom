"""Measure every logo in research/catalog.csv and write research/metrics.csv.

Two passes:
  1. Static SVG parse (Python): gradients, text elements, element and path counts, declared fills.
  2. Pixel pass (headless Chrome): each logo is drawn on a 192 px canvas and measured for ink bounding box
     aspect ratio, ink coverage, color clusters, dominant color, left/right and top/bottom symmetry,
     connected parts and edge complexity.

Run from the brand-creator folder:  python3 -I scripts/analyze_logos.py
Needs Google Chrome or Chromium (set CHROME=/path/to/chrome if it is not found). Stdlib only.
"""
import base64, csv, json, os, re, shutil, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(ROOT, "research", "cache")
CHUNK = 400


def find_chrome():
    for c in [os.environ.get("CHROME", ""), "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
              "/Applications/Chromium.app/Contents/MacOS/Chromium", shutil.which("google-chrome") or "",
              shutil.which("chromium") or "", shutil.which("chromium-browser") or ""]:
        if c and os.path.exists(c):
            return c
    sys.exit("Chrome not found. Set CHROME=/path/to/chrome")


def sniff(blob):
    if blob[:8] == b"\x89PNG\r\n\x1a\n":
        return "image/png"
    if blob[:3] == b"\xff\xd8\xff":
        return "image/jpeg"
    if blob[:4] == b"RIFF" and blob[8:12] == b"WEBP":
        return "image/webp"
    if blob[:6] in (b"GIF87a", b"GIF89a"):
        return "image/gif"
    head = blob[:600].lower()
    if b"<svg" in head or b"<?xml" in head:
        return "image/svg+xml"
    return None


def static_svg(text):
    t = text.lower()
    fills = set(re.findall(r'(?:fill|stop-color|stroke)\s*[:=]\s*"?\s*(#[0-9a-f]{3,8}\b|rgb\([^)]*\))', t))
    return dict(
        svg_gradient=int(bool(re.search(r"<(lineargradient|radialgradient)", t))),
        svg_text=int("<text" in t),
        svg_elements=len(re.findall(r"<(path|rect|circle|ellipse|polygon|polyline|line)\b", t)),
        svg_path_chars=sum(len(m) for m in re.findall(r'\sd="([^"]*)"', text)),
        svg_declared_colors=len(fills),
        svg_filter=int("<filter" in t),
        svg_image=int("<image" in t),
    )


PAGE = r"""<!doctype html><meta charset=utf-8><body><pre id=out></pre><script>
const ITEMS=__ITEMS__;const S=192;
function hsl(r,g,b){r/=255;g/=255;b/=255;const M=Math.max(r,g,b),m=Math.min(r,g,b);let h=0,s=0,l=(M+m)/2;
 if(M!==m){const d=M-m;s=l>.5?d/(2-M-m):d/(M+m);h=M===r?((g-b)/d+(g<b?6:0)):M===g?((b-r)/d+2):((r-g)/d+4);h*=60}return [h,s,l]}
function hex(c){return '#'+c.map(v=>Math.round(v).toString(16).padStart(2,'0')).join('')}
async function measure(it){
 const img=document.getElementById('i_'+it.id);
 if(!img||!img.complete||!img.naturalWidth&&!it.src.startsWith('data:image/svg'))return {id:it.id,err:'decode'};
 let w=img.naturalWidth||S,h=img.naturalHeight||S;if(!w||!h){w=h=S}
 const k=Math.min(S/w,S/h);const W=Math.max(1,Math.round(w*k)),H=Math.max(1,Math.round(h*k));
 const cv=document.createElement('canvas');cv.width=W;cv.height=H;const g=cv.getContext('2d',{willReadFrequently:true});
 g.drawImage(img,0,0,W,H);let d;try{d=g.getImageData(0,0,W,H).data}catch(e){return {id:it.id,err:'taint'}}
 // background: transparent pixels, or for opaque rasters the most common corner color
 let opaque=true;for(let i=3;i<d.length;i+=4){if(d[i]<250){opaque=false;break}}
 let bg=null;if(opaque){const cs=[0,(W-1)*4,((H-1)*W)*4,((H-1)*W+W-1)*4].map(i=>[d[i],d[i+1],d[i+2]]);
  bg=cs.sort((a,b)=>cs.filter(c=>Math.abs(c[0]-b[0])+Math.abs(c[1]-b[1])+Math.abs(c[2]-b[2])<30).length-cs.filter(c=>Math.abs(c[0]-a[0])+Math.abs(c[1]-a[1])+Math.abs(c[2]-a[2])<30).length)[0]}
 const ink=new Uint8Array(W*H);let x0=W,y0=H,x1=-1,y1=-1,n=0;const bins=new Map();
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=(y*W+x)*4;const a=d[i+3];let on=a>128;
  if(on&&bg){on=Math.abs(d[i]-bg[0])+Math.abs(d[i+1]-bg[1])+Math.abs(d[i+2]-bg[2])>60}
  if(on){ink[y*W+x]=1;n++;if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;
   const q=((d[i]>>5)<<6)|((d[i+1]>>5)<<3)|(d[i+2]>>5);const b=bins.get(q)||[0,0,0,0];b[0]++;b[1]+=d[i];b[2]+=d[i+1];b[3]+=d[i+2];bins.set(q,b)}}
 if(!n)return {id:it.id,err:'empty'};
 const bw=x1-x0+1,bh=y1-y0+1;
 // merge color bins into clusters
 let cl=[...bins.values()].map(b=>({n:b[0],c:[b[1]/b[0],b[2]/b[0],b[3]/b[0]]})).sort((a,b)=>b.n-a.n);const C=[];
 for(const b of cl){const m=C.find(c=>Math.abs(c.c[0]-b.c[0])+Math.abs(c.c[1]-b.c[1])+Math.abs(c.c[2]-b.c[2])<70);
  if(m){const t=m.n+b.n;m.c=m.c.map((v,j)=>(v*m.n+b.c[j]*b.n)/t);m.n=t}else C.push({n:b.n,c:b.c})}
 C.sort((a,b)=>b.n-a.n);const sig=C.filter(c=>c.n/n>=0.04);
 const pal=sig.slice(0,4).map(c=>{const [hh,ss,ll]=hsl(...c.c);return {hex:hex(c.c),share:+(c.n/n).toFixed(3),h:Math.round(hh),s:+ss.toFixed(2),l:+ll.toFixed(2)}});
 // symmetry inside ink bbox
 let lr=0,tb=0,cnt=0;for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const v=ink[y*W+x];
  const mx=x1-(x-x0),my=y1-(y-y0);if(v||ink[y*W+mx]||ink[my*W+x]){cnt++;if(v===ink[y*W+mx])lr++;if(v===ink[my*W+x])tb++}}
 // connected parts (4-neighbour, parts under 0.2% of ink ignored) and edge pixels
 const lab=new Int32Array(W*H);let parts=0,edges=0;const st=[];
 for(let p=0;p<W*H;p++){if(!ink[p])continue;const x=p%W,y=(p/W)|0;
  if(x===0||y===0||x===W-1||y===H-1||!ink[p-1]||!ink[p+1]||!ink[p-W]||!ink[p+W])edges++;
  if(lab[p])continue;let sz=0;st.push(p);lab[p]=1;while(st.length){const q=st.pop();sz++;const qx=q%W;
   for(const r of [qx>0?q-1:-1,qx<W-1?q+1:-1,q-W,q+W]){if(r>=0&&r<W*H&&ink[r]&&!lab[r]){lab[r]=1;st.push(r)}}}
  if(sz>=n*0.002)parts++}
 // lockup geometry for wide logos: left ink run (symbol candidate), first empty gap, the rest (text)
 let lock=null;if(bw/bh>1.8){const col=new Array(bw).fill(0);for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(ink[y*W+x])col[x-x0]++;
  let i=0;while(i<bw&&!col[i])i++;let a=i;while(i<bw&&col[i])i++;const lw=i-a;let g=i;while(i<bw&&!col[i])i++;const gap=i-g;
  if(lw>0&&gap>=Math.max(2,bw*0.012)&&i<bw){let ly0=H,ly1=-1,ry0=H,ry1=-1;for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(ink[y*W+x]){const c=x-x0;
    if(c<a+lw){if(y<ly0)ly0=y;if(y>ly1)ly1=y}else if(c>=i){if(y<ry0)ry0=y;if(y>ry1)ry1=y}}
   const lh=ly1-ly0+1,rh=ry1-ry0+1;if(lh>4&&lw/lh>0.6&&lw/lh<1.6)lock={gap:+(gap/lh).toFixed(3),text_h:+(rh/lh).toFixed(3),text_mid:+(((ry0+ry1)/2-(ly0+ly1)/2)/lh).toFixed(3)}}}
 return {id:it.id,w,h,opaque:+opaque,lock_gap:lock?lock.gap:'',lock_text_h:lock?lock.text_h:'',lock_text_mid:lock?lock.text_mid:'',bbox_aspect:+(bw/bh).toFixed(3),coverage:+(n/(bw*bh)).toFixed(3),
  n_colors:sig.length,palette:pal,sym_lr:+(lr/cnt).toFixed(3),sym_tb:+(tb/cnt).toFixed(3),parts,
  complexity:+(edges/Math.sqrt(n)).toFixed(2)}}
window.addEventListener('load',async()=>{const res=[];for(const it of ITEMS){try{res.push(await measure(it))}catch(e){res.push({id:it.id,err:String(e).slice(0,60)})}}
 document.getElementById('out').textContent=JSON.stringify(res);document.title='done'});
</script>"""


def run_chunk(chrome, items, tmpdir, idx):
    page = os.path.join(tmpdir, "chunk%03d.html" % idx)
    imgs = "".join('<img id="i_%s" src="%s" style="display:none">' % (it["id"], it["src"]) for it in items)
    open(page, "w").write(PAGE.replace("<pre id=out></pre>", "<pre id=out></pre>" + imgs).replace("__ITEMS__", json.dumps([{"id": it["id"], "src": it["src"][:20]} for it in items])))
    cmd = [chrome, "--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check",
           "--user-data-dir=" + os.path.join(tmpdir, "prof"), "--virtual-time-budget=600000",
           "--run-all-compositor-stages-before-draw", "--dump-dom", "file://" + page]
    p = subprocess.run(cmd, capture_output=True, text=True, timeout=900)
    m = re.search(r'<pre id="out">(.*?)</pre>', p.stdout, re.S)
    if not m or not m.group(1).strip():
        print("chunk", idx, "returned nothing", p.stderr[-300:], file=sys.stderr)
        return []
    import html
    return json.loads(html.unescape(m.group(1)))

