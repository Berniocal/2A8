from pathlib import Path
import re

p = Path('vlastnosti.html')
t = p.read_text(encoding='utf-8')

# 1) Sugar description: distinguish covalent bonds inside a molecule from weaker
# intermolecular attractions holding the molecular crystal together.
old = " sugar:['Cukr','Krystal cukru tvoří mnoho stejných molekul uspořádaných v prostoru. Každá barevná skupina je zjednodušená molekula; vazby jsou zobrazené uvnitř molekul.','<div class=\"lattice-key\"><span><i class=\"key-dot\" style=\"background:#4d5963\"></i>uhlík</span><span><i class=\"key-dot\" style=\"background:#e45a4f\"></i>kyslík</span><span><i class=\"key-dot\" style=\"background:#9ed0ff\"></i>vodík</span></div>'],"
new = " sugar:['Cukr','Krystal cukru tvoří mnoho stejných molekul pravidelně uspořádaných v prostoru. Plné čáry jsou vazby uvnitř molekul. Světle modré přerušované čáry znázorňují slabší přitažlivé síly mezi sousedními molekulami – nejsou to další chemické vazby uvnitř jedné molekuly.','<div class=\"lattice-key\"><span><i class=\"key-dot\" style=\"background:#4d5963\"></i>uhlík</span><span><i class=\"key-dot\" style=\"background:#e45a4f\"></i>kyslík</span><span><i class=\"key-dot\" style=\"background:#9ed0ff\"></i>vodík</span><span style=\"gap:7px\"><i style=\"width:22px;border-top:2px dashed #9ecbdc;display:inline-block\"></i>mezimolekulové přitažlivé síly</span></div>'],"
if old not in t:
    raise SystemExit('Sugar description marker not found')
t = t.replace(old, new, 1)

# 2) Bonds can now be dashed / translucent.
old = "function B(i,j,c='#8aa0ad',w=2){l3bonds.push({i,j,c,w})}"
new = "function B(i,j,c='#8aa0ad',w=2,dash=0,alpha=1){l3bonds.push({i,j,c,w,dash,alpha})}"
if old not in t:
    raise SystemExit('B() marker not found')
t = t.replace(old, new, 1)

# 3) Sugar: make a real 3-D block of molecules, place them closer together,
# and connect neighbouring molecules with dashed intermolecular links.
pat = re.compile(r"function sugarMol\(ox,oy,oz\)\{.*?\}\nfunction buildSugar\(\)\{.*?\}\n", re.S)
new_sugar = r"""function sugarMol(ox,oy,oz){
  const pts=[[-17,0,0,'#4d5963',7.5],[0,-12,7,'#4d5963',7.5],[17,0,0,'#4d5963',7.5],[0,13,-7,'#4d5963',7.5],[0,0,17,'#e45a4f',6.5],[25,13,10,'#e45a4f',6.5],[-24,-12,9,'#9ed0ff',4.5],[24,-13,-7,'#9ed0ff',4.5]];
  const ids=pts.map(q=>A(ox+q[0],oy+q[1],oz+q[2],q[3],q[4]));
  [[0,1],[1,2],[2,3],[3,0],[0,4],[2,5],[0,6],[2,7]].forEach(e=>B(ids[e[0]],ids[e[1]],'#8799a5',2));
  return {ids,anchorO:ids[4],anchorH:ids[7]};
}
function buildSugar(){
  const pos=[-62,0,62],mols={};
  pos.forEach((x,ix)=>pos.forEach((y,iy)=>pos.forEach((z,iz)=>{mols[[ix,iy,iz]]=sugarMol(x,y,z)})));
  for(let ix=0;ix<3;ix++)for(let iy=0;iy<3;iy++)for(let iz=0;iz<3;iz++){
    const m=mols[[ix,iy,iz]];
    [[1,0,0],[0,1,0],[0,0,1]].forEach(d=>{
      const n=mols[[ix+d[0],iy+d[1],iz+d[2]]];
      if(n) B(m.anchorO,n.anchorH,'#9ecbdc',1.25,5,0.72);
    });
  }
}
"""
t, n = pat.subn(new_sugar, t, count=1)
if n != 1:
    raise SystemExit(f'Sugar functions replacement count {n}')

# 4) More stable, milder perspective. Negative rotated z is nearer the viewer.
old = "function proj(p,w,h){const q=rotate(p),f=520/(520+q.z*.75);return{x:w/2+q.x*f*l3scale,y:h/2+q.y*f*l3scale,z:q.z,r:p.r*f*l3scale}}"
new = "function proj(p,w,h){const q=rotate(p),camera=760,den=Math.max(260,camera+q.z),f=camera/den;return{x:w/2+q.x*f*l3scale,y:h/2+q.y*f*l3scale,z:q.z,r:p.r*f*l3scale}}"
if old not in t:
    raise SystemExit('Projection marker not found')
t = t.replace(old, new, 1)

# 5) Painter's algorithm: current projection makes negative z nearer, so draw
# larger z (farther) first. Interleave bonds and atoms by depth to avoid rear
# objects popping in front while rotating.
pat = re.compile(r"function l3draw\(\)\{.*?\}\nfunction showLattice3D", re.S)
new_draw = r"""function l3draw(){
  if(!l3canvas||!l3ctx)return;
  const dpr=Math.min(devicePixelRatio||1,2),w=l3canvas.clientWidth,h=l3canvas.clientHeight;
  if(!w||!h)return;
  if(l3canvas.width!=Math.round(w*dpr)||l3canvas.height!=Math.round(h*dpr)){l3canvas.width=Math.round(w*dpr);l3canvas.height=Math.round(h*dpr)}
  l3ctx.setTransform(dpr,0,0,dpr,0,0);l3ctx.clearRect(0,0,w,h);
  const pp=l3atoms.map(a=>proj(a,w,h)),drawables=[];
  l3bonds.forEach(b=>drawables.push({type:'bond',z:(pp[b.i].z+pp[b.j].z)/2,b}));
  pp.forEach((p,i)=>drawables.push({type:'atom',z:p.z,p,a:l3atoms[i]}));
  drawables.sort((a,b)=>b.z-a.z); // far first, near last
  for(const o of drawables){
    if(o.type==='bond'){
      const b=o.b,p=pp[b.i],q=pp[b.j];
      l3ctx.save();
      l3ctx.globalAlpha=b.alpha??1;
      l3ctx.strokeStyle=b.c;l3ctx.lineWidth=b.w*l3scale;l3ctx.lineCap='round';
      l3ctx.setLineDash(b.dash?[b.dash*l3scale,b.dash*.75*l3scale]:[]);
      l3ctx.beginPath();l3ctx.moveTo(p.x,p.y);l3ctx.lineTo(q.x,q.y);l3ctx.stroke();
      l3ctx.restore();
    }else{
      const {p,a}=o,g=l3ctx.createRadialGradient(p.x-p.r*.35,p.y-p.r*.35,Math.max(1,p.r*.1),p.x,p.y,Math.max(2,p.r));
      g.addColorStop(0,'#fff');g.addColorStop(.22,shade(a.c,40));g.addColorStop(.55,a.c);g.addColorStop(1,shade(a.c,-55));
      l3ctx.fillStyle=g;l3ctx.beginPath();l3ctx.arc(p.x,p.y,Math.max(2,p.r),0,Math.PI*2);l3ctx.fill();
    }
  }
}
function showLattice3D"""
t, n = pat.subn(new_draw, t, count=1)
if n != 1:
    raise SystemExit(f'l3draw replacement count {n}')

p.write_text(t, encoding='utf-8')
print('patched sugar crystal and depth sorting')
