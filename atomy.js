const tabs=[...document.querySelectorAll('.tab')];
tabs.forEach(b=>b.onclick=()=>{tabs.forEach(x=>x.classList.remove('active'));document.querySelectorAll('.panel').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.getElementById(b.dataset.tab).classList.add('active')});

const A=(cls,x,y,size='m',txt='')=>`<div class="atom ${cls} ${size}" style="left:${x}px;top:${y}px">${txt}</div>`;
const B=(x,y,w,a=0)=>`<div class="bond" style="left:${x}px;top:${y}px;width:${w}px;transform:rotate(${a}deg)"></div>`;
const L=(txt,x,y)=>`<div class="label" style="left:${x}px;top:${y}px">${txt}</div>`;
const water=(x,y)=>B(x+18,y+25,40,-30)+B(x+22,y+29,45,0)+A('o',x,y,'m','O')+A('h',x+45,y-22,'s','H')+A('h',x+70,y,'s','H');

const concepts={
 atom:['Atom','<b>Atom</b> je jedna velmi malá částice látky.',()=>`<div class="scene">${A('h',210,78,'l','H')}${L('jeden atom',192,145)}</div>`],
 molecule:['Molekula','<b>Molekula</b> je skupina dvou nebo více spojených atomů.',()=>`<div class="scene">${B(180,104,65)}${A('h',152,82,'l','H')}${A('h',225,82,'l','H')}${L('spojené atomy = molekula',142,150)}</div>`],
 moleculeElement:['Molekula prvku','Je tvořena atomy <b>stejného druhu</b>.',()=>`<div class="scene">${B(180,104,65)}${A('o',152,82,'l','O')}${A('o',225,82,'l','O')}${L('O₂ = stejné atomy',166,150)}</div>`],
 moleculeCompound:['Molekula sloučeniny','Je tvořena atomy <b>různých druhů</b>.',()=>`<div class="scene">${water(160,82)}${L('H₂O = různé atomy',165,155)}</div>`],
 substance:['Látka','<b>Látku</b> tvoří obrovské množství atomů nebo molekul.',()=>`<div class="scene">${B(75,82,40)}${A('o',52,64,'m','O')}${A('o',100,64,'m','O')}${B(205,82,40)}${A('o',182,64,'m','O')}${A('o',230,64,'m','O')}${B(335,82,40)}${A('o',312,64,'m','O')}${A('o',360,64,'m','O')}${B(140,152,40)}${A('o',117,134,'m','O')}${A('o',165,134,'m','O')}${B(270,152,40)}${A('o',247,134,'m','O')}${A('o',295,134,'m','O')}${L('velké množství částic',145,195)}</div>`],
 element:['Prvek','<b>Prvek</b> je čistá látka tvořená jen jedním druhem atomů.',()=>`<div class="scene">${L('stejné samostatné atomy',25,12)}${A('metal',40,60,'m','Fe')}${A('metal',95,92,'m','Fe')}${A('metal',55,132,'m','Fe')}${L('nebo molekuly prvku',280,12)}${B(310,82,45)}${A('h',285,64,'m','H')}${A('h',337,64,'m','H')}${B(310,145,45)}${A('h',285,127,'m','H')}${A('h',337,127,'m','H')}</div>`],
 compound:['Sloučenina','<b>Sloučenina</b> je čistá látka tvořená molekulami sloučeniny.',()=>`<div class="scene">${water(35,95)}${water(165,95)}${water(295,95)}${L('stejné molekuly H₂O',135,177)}</div>`],
 mixture:['Směs','<b>Směs</b> obsahuje alespoň dvě různé látky společně.',()=>`<div class="scene">${L('látka A',35,15)}${B(65,88,42)}${A('h',40,70,'m','H')}${A('h',90,70,'m','H')}${B(65,150,42)}${A('h',40,132,'m','H')}${A('h',90,132,'m','H')}${L('+',205,92)}${L('látka B',305,15)}${water(300,82)}${L('různé látky společně = směs',120,190)}</div>`]
};
function showConcept(k){const d=concepts[k];conceptStage.innerHTML=`<h3>${d[0]}</h3><div class="concept-desc">${d[1]}</div>${d[2]()}`}
showConcept('atom');

let particleTimer;
function setState(s){clearInterval(particleTimer);const box=particleBox;box.innerHTML='';const W=box.clientWidth,H=box.clientHeight,arr=[],n=s==='gas'?20:35;for(let i=0;i<n;i++){const p=document.createElement('div');p.className='particle';let x,y,vx,vy;if(s==='solid'){x=25+(i%7)*45;y=25+Math.floor(i/7)*42;vx=vy=.5}else if(s==='liquid'){x=15+Math.random()*(W-45);y=H*.42+Math.random()*(H*.5-25);vx=(Math.random()-.5)*1.5;vy=(Math.random()-.5)*1.1}else{x=10+Math.random()*(W-35);y=10+Math.random()*(H-35);vx=(Math.random()-.5)*3;vy=(Math.random()-.5)*3}p.style.left=x+'px';p.style.top=y+'px';box.appendChild(p);arr.push({p,x,y,vx,vy,x0:x,y0:y})}stateNote.textContent={solid:'Částice jsou těsně u sebe a kmitají kolem svých poloh.',liquid:'Částice jsou blízko u sebe, ale mohou se navzájem posouvat.',gas:'Částice jsou daleko od sebe a pohybují se volně.'}[s];particleTimer=setInterval(()=>{const w=box.clientWidth,h=box.clientHeight;arr.forEach(a=>{if(s==='solid'){a.x=a.x0+Math.sin(Date.now()/120+a.x0)*2.5;a.y=a.y0+Math.cos(Date.now()/130+a.y0)*2.5}else{a.x+=a.vx;a.y+=a.vy;if(a.x<2||a.x>w-21)a.vx*=-1;if(a.y<2||a.y>h-21)a.vy*=-1;if(s==='liquid'&&a.y<h*.38){a.y=h*.38;a.vy=Math.abs(a.vy)}}a.p.style.left=a.x+'px';a.p.style.top=a.y+'px'})},30)}
setTimeout(()=>setState('solid'),50);

const photos=[
 ['Krystaly cukru','https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Sugar_crystals_under_the_microscope.jpg/960px-Sugar_crystals_under_the_microscope.jpg','Pod mikroskopem jsou vidět jednotlivé krystaly cukru.'],
 ['Krystaly soli','https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Salt_crystals_under_the_microscope.jpg/960px-Salt_crystals_under_the_microscope.jpg','Porovnej tvar krystalů soli s cukrem.'],
 ['Papír pod mikroskopem','https://upload.wikimedia.org/wikipedia/commons/9/9d/Tissue_paper_under_a_microscope.jpg','Při zvětšení jsou vidět propletená vlákna papíru.'],
 ['Žula pod mikroskopem','https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/%D0%93%D1%80%D0%B0%D0%BD%D0%B8%D1%82_%D0%BF%D0%BE%D0%B4_%D0%BC%D0%B8%D0%BA%D1%80%D0%BE%D1%81%D0%BA%D0%BE%D0%BF%D0%BE%D0%BC.jpg/960px-%D0%93%D1%80%D0%B0%D0%BD%D0%B8%D1%82_%D0%BF%D0%BE%D0%B4_%D0%BC%D0%B8%D0%BA%D1%80%D0%BE%D1%81%D0%BA%D0%BE%D0%BF%D0%BE%D0%BC.jpg','Žula je směs několika minerálů.']
];
function photoDoc(t,u,d){return `<!doctype html><html lang="cs"><meta charset="utf-8"><style>body{margin:0;font:14px Arial;color:#183243}figure{margin:0;padding:10px}img{width:100%;height:270px;object-fit:contain;background:#111;border-radius:12px}details{margin-top:10px;padding:8px;border:1px solid #d6e1e8;border-radius:10px;background:#f7fbfd}summary{font-weight:bold;cursor:pointer}</style><figure><img src="${u}" alt="${t}"><details><summary>Co na obrázku vidíš?</summary><p><b>${t}</b></p><p>${d}</p><p>Zdroj: Wikimedia Commons</p></details></figure></html>`}
photos.forEach(p=>{const f=document.createElement('iframe');f.className='photo-frame';f.loading='lazy';f.title=p[0];f.srcdoc=photoDoc(...p);photoGrid.appendChild(f)});

function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function order(n){return shuffle([...Array(n).keys()])}
function renderMC(q,box,handler){box.innerHTML='';shuffle(q.answers).forEach(text=>{const b=document.createElement('button');b.className='answer';b.textContent=text;b.onclick=()=>handler(text===q.correct);box.appendChild(b)})}

const terms=[
 {q:'Co je atom?',answers:['Velmi malá částice látky','Směs několika látek','Velká skupina těles'],correct:'Velmi malá částice látky',e:'Atom je velmi malá částice látky.'},
 {q:'Co je molekula?',answers:['Jedna celá látka','Skupina spojených atomů','Jeden prvek bez atomů'],correct:'Skupina spojených atomů',e:'Molekula je skupina spojených atomů.'},
 {q:'Co je molekula prvku?',answers:['Směs dvou látek','Molekula z různých druhů atomů','Molekula ze stejných druhů atomů'],correct:'Molekula ze stejných druhů atomů',e:'Např. H₂ nebo O₂.'},
 {q:'Co je molekula sloučeniny?',answers:['Jedna samostatná částice železa','Molekula z různých druhů atomů','Molekula pouze z jednoho druhu atomů'],correct:'Molekula z různých druhů atomů',e:'Např. H₂O nebo CO₂.'},
 {q:'Co je látka?',answers:['Jeden jediný atom','Obrovské množství atomů nebo molekul','Pouze směs'],correct:'Obrovské množství atomů nebo molekul',e:'Látka je tvořena obrovským množstvím atomů nebo molekul.'},
 {q:'Co je prvek?',answers:['Směs různých látek','Látka tvořená jedním druhem atomů','Látka tvořená vždy dvěma různými atomy'],correct:'Látka tvořená jedním druhem atomů',e:'Prvek je tvořen pouze jedním druhem atomů.'},
 {q:'Co je sloučenina?',answers:['Několik různých látek společně','Látka tvořená jen jedním druhem atomů','Čistá látka tvořená molekulami sloučeniny'],correct:'Čistá látka tvořená molekulami sloučeniny',e:'Sloučenina je čistá látka tvořená molekulami sloučeniny.'},
 {q:'Co je směs?',answers:['Samé stejné molekuly vody','Alespoň dvě různé látky společně','Jeden druh atomů'],correct:'Alespoň dvě různé látky společně',e:'Směs je tvořena alespoň dvěma různými látkami.'}
];
let termOrder=order(terms.length),termPos=-1,tr=0,tt=0,tlock=false,currentTerm;
function nextTerm(){termPos++;if(termPos>=termOrder.length){termOrder=order(terms.length);termPos=0}currentTerm=terms[termOrder[termPos]];tlock=false;termQuestion.textContent=currentTerm.q;renderMC(currentTerm,termAnswers,answerTerm);termFeedback.className='feedback'}
function answerTerm(ok){if(tlock)return;tlock=true;tt++;if(ok){tr++;termFeedback.className='feedback ok';termFeedback.textContent='Správně. '+currentTerm.e}else{termFeedback.className='feedback bad';termFeedback.textContent='Ještě ne. '+currentTerm.e}termScore.textContent=tr+' / '+tt}
nextTerm();

const sorts=[
 ['jeden atom mědi Cu','atom'],['jeden atom železa Fe','atom'],
 ['jedna molekula O₂','molPrvek'],['jedna molekula H₂','molPrvek'],
 ['jedna molekula H₂O','molSloucenina'],['jedna molekula CO₂','molSloucenina'],
 ['čistá látka tvořená pouze atomy mědi','prvek'],['čistá látka tvořená molekulami O₂','prvek'],
 ['čistá látka tvořená molekulami H₂O','sloucenina'],['čistá látka tvořená molekulami CO₂','sloucenina'],
 ['vzduch – několik různých plynů společně','smes'],['žula – několik různých minerálů společně','smes'],['slaná voda – voda a rozpuštěná sůl','smes'],['mokrý písek – písek a voda','smes']
];
const sortNames={atom:'atom',molPrvek:'molekula prvku',molSloucenina:'molekula sloučeniny',prvek:'prvek',sloucenina:'sloučenina',smes:'směs'};
let sortOrder=order(sorts.length),sortPos=-1,sr=0,st=0,slock=false,currentSort;
function nextSort(){sortPos++;if(sortPos>=sortOrder.length){sortOrder=order(sorts.length);sortPos=0}currentSort=sorts[sortOrder[sortPos]];slock=false;sortItem.textContent=currentSort[0];sortFeedback.className='feedback'}
function sortAnswer(x){if(slock)return;slock=true;st++;if(x===currentSort[1]){sr++;sortFeedback.className='feedback ok';sortFeedback.textContent='Správně.'}else{sortFeedback.className='feedback bad';sortFeedback.textContent='Nejpřesnější skupina je: '+sortNames[currentSort[1]]+'.'}sortScore.textContent=sr+' / '+st}
nextSort();

const quizzes=[
 {q:'Která možnost označuje jeden atom?',answers:['jedna molekula H₂','jeden atom H','čistý vodík tvořený mnoha molekulami H₂'],correct:'jeden atom H',e:'Jeden atom je jednotlivá částice.'},
 {q:'Která možnost je jedna molekula prvku?',answers:['CO₂','O₂','H₂O'],correct:'O₂',e:'O₂ je molekula ze dvou stejných atomů kyslíku.'},
 {q:'Která možnost je jedna molekula sloučeniny?',answers:['O₂','Fe','H₂O'],correct:'H₂O',e:'H₂O obsahuje různé druhy atomů.'},
 {q:'Co nejlépe vystihuje látku?',answers:['Vždy směs několika látek','Obrovské množství atomů nebo molekul','Jeden jediný atom'],correct:'Obrovské množství atomů nebo molekul',e:'Látku tvoří obrovské množství částic.'},
 {q:'Čisté látky dělíme na…',answers:['atomy a směsi','prvky a sloučeniny','jen prvky'],correct:'prvky a sloučeniny',e:'Čisté látky dělíme na prvky a sloučeniny.'},
 {q:'Které tvrzení o prvku je správné?',answers:['Je vždy směsí','Je tvořen pouze jedním druhem atomů','Musí obsahovat dva druhy atomů'],correct:'Je tvořen pouze jedním druhem atomů',e:'Prvek obsahuje jen jeden druh atomů.'},
 {q:'Které tvrzení o sloučenině používáme v tomto úvodu?',answers:['Je několik různých látek společně','Je čistá látka tvořená molekulami sloučeniny','Je tvořena jen jedním druhem atomů'],correct:'Je čistá látka tvořená molekulami sloučeniny',e:'Takto sloučeninu v tomto úvodu modelujeme.'},
 {q:'Co je směs?',answers:['Jeden druh atomů','Alespoň dvě různé látky společně','Samé stejné molekuly H₂O'],correct:'Alespoň dvě různé látky společně',e:'Směs obsahuje alespoň dvě různé látky.'},
 {q:'Co přesně označuje H₂, pokud mluvíme o jedné částici?',answers:['směs','atom vodíku','molekulu prvku vodíku'],correct:'molekulu prvku vodíku',e:'H₂ je molekula tvořená dvěma atomy vodíku.'},
 {q:'Který příklad je směs?',answers:['čistá voda','vzduch','čistý kyslík'],correct:'vzduch',e:'Vzduch je směs několika plynů.'}
];
let quizOrder=order(quizzes.length),quizPos=-1,qr=0,qt=0,qlock=false,currentQuiz;
function nextQuiz(){quizPos++;if(quizPos>=quizOrder.length){quizOrder=order(quizzes.length);quizPos=0}currentQuiz=quizzes[quizOrder[quizPos]];qlock=false;quizQuestion.textContent=(quizPos+1)+'. '+currentQuiz.q;renderMC(currentQuiz,quizAnswers,answerQuiz);quizFeedback.className='feedback'}
function answerQuiz(ok){if(qlock)return;qlock=true;qt++;if(ok){qr++;quizFeedback.className='feedback ok';quizFeedback.textContent='Správně. '+currentQuiz.e}else{quizFeedback.className='feedback bad';quizFeedback.textContent='Nesprávně. '+currentQuiz.e}quizScore.textContent=qr+' / '+qt}
function resetQuiz(){quizOrder=order(quizzes.length);quizPos=-1;qr=0;qt=0;quizScore.textContent='0 / 0';nextQuiz()}
nextQuiz();
