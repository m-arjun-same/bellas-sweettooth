// Bella's Sweet Tooth — own code. Reference system: Inacio Nakiti site mode.
(function(){
'use strict';
var $=function(s,c){return (c||document).querySelector(s)};
var $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
gsap.registerPlugin(ScrollTrigger);

/* Lenis smooth scroll */
var lenis=null;
if(window.Lenis){ lenis=new Lenis({lerp:.09,smoothWheel:true});
  lenis.on('scroll',ScrollTrigger.update);
  gsap.ticker.add(function(t){lenis.raf(t*1000)});
  gsap.ticker.lagSmoothing(0);
}
function scrollToEl(el){ if(lenis) lenis.scrollTo(el,{offset:-112}); else el.scrollIntoView({behavior:'smooth'}); }
$$('a[href^="#"]').forEach(function(a){ a.addEventListener('click',function(e){ var id=a.getAttribute('href'); if(id.length>1){ var el=$(id); if(el){ e.preventDefault(); closeMenu(); scrollToEl(el); } } }); });

/* clocks — Los Angeles */
function tickClock(){ try{ var f=new Intl.DateTimeFormat('en-US',{timeZone:'America/Los_Angeles',hour:'numeric',minute:'2-digit'});
  var t=f.format(new Date()); var c1=$('#laClock'),c2=$('#laClock2'); if(c1)c1.textContent=t; if(c2)c2.textContent=t+' PST'; }catch(e){} }
tickClock(); setInterval(tickClock,20000);

/* header + pill fade while scrolling, fab appears */
var lastY=0, hdr=$('#siteHeader'), pill=$('#pill'), fab=$('#fabMenu');
function onScrollY(y){ var moving=Math.abs(y-lastY)>2; hdr.classList.toggle('hide',moving&&y>140); pill.classList.toggle('hide',moving&&y>140); fab.classList.toggle('on',y>window.innerHeight*.7); lastY=y; }
if(lenis) lenis.on('scroll',function(e){onScrollY(e.scroll)}); window.addEventListener('scroll',function(){onScrollY(window.scrollY)},{passive:true});

/* custom cursor */
var cur=$('#cursor'), circ=$('#cursorCircle'), mx=innerWidth/2,my=innerHeight/2,cx=mx,cy=my;
document.addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px';});
(function loop(){ cx+=(mx-cx)*.16; cy+=(my-cy)*.16; circ.style.left=cx+'px'; circ.style.top=cy+'px'; requestAnimationFrame(loop); })();

/* dotted globe */
(function(){ var cv=$('#globe'); if(!cv)return; var g=cv.getContext('2d'); g.fillStyle='#8f8f8c';
  for(var y=8;y<190;y+=9) for(var x=8;x<190;x+=9){ var dx=x-95,dy=y-95; if(dx*dx+dy*dy<8100 && Math.random()>.32){ g.beginPath(); g.arc(x,y,1.6,0,7); g.fill(); } }
  g.fillStyle='#5C61E0'; g.beginPath(); g.arc(52,84,5,0,7); g.fill(); })();

/* hero particles -> photo */
(function(){ var cv=$('#heroParticles'), img=$('#heroImg'); if(!cv||!img) return;
  var im=new Image(); im.src=img.getAttribute('src');
  im.onload=function(){ var w=cv.clientWidth,h=cv.clientHeight; if(!w){setTimeout(arguments.callee,100);return;}
    cv.width=w; cv.height=h; var off=document.createElement('canvas');
    var scale=Math.max(w/im.naturalWidth,h/im.naturalHeight);
    off.width=w; off.height=h; var og=off.getContext('2d');
    og.filter='grayscale(1)'; og.drawImage(im,(w-im.naturalWidth*scale)/2,(h-im.naturalHeight*scale)/2,im.naturalWidth*scale,im.naturalHeight*scale);
    var data; try{ data=og.getImageData(0,0,w,h).data; }catch(e){ img.classList.add('on'); return; }
    var pts=[],step=w>500?7:6;
    for(var y=0;y<h;y+=step) for(var x=0;x<w;x+=step){ var i=(y*w+x)*4; if(data[i]<235){ pts.push({x:x,y:y,sx:Math.random()*w,sy:Math.random()*h,t:Math.random()}); } }
    var ctx=cv.getContext('2d'), start=null;
    function frame(ts){ if(!start)start=ts; var p=Math.min((ts-start)/2400,1); ctx.clearRect(0,0,w,h); ctx.fillStyle='#EDEDEA';
      pts.forEach(function(pt){ var q=Math.max(0,Math.min(1,p*1.4-pt.t*.4)); var e=1-Math.pow(1-q,3);
        ctx.globalAlpha=.25+.75*e; ctx.fillRect(pt.sx+(pt.x-pt.sx)*e,pt.sy+(pt.y-pt.sy)*e,2.2,2.2); });
      ctx.globalAlpha=1; if(p<1) requestAnimationFrame(frame); else { img.classList.add('on'); setTimeout(function(){cv.style.transition='opacity 1s';cv.style.opacity='0';},350); } }
    requestAnimationFrame(frame); };
  gsap.to('.hero-copy h1 .line>span',{y:0,duration:1.1,stagger:.12,ease:'power4.out',delay:.3});
})();

/* reveals */
$$('.reveal').forEach(function(el){ gsap.to(el,{opacity:1,y:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 86%'}}); });
$$('.reveal-h').forEach(function(el){ gsap.to(el,{clipPath:'inset(0 0 -12% 0)',duration:1.15,ease:'power4.out',scrollTrigger:{trigger:el,start:'top 86%'}}); });

/* particle stat numbers */
$$('.stat-num').forEach(function(cv){
  var text=cv.getAttribute('data-text');
  ScrollTrigger.create({trigger:cv,start:'top 85%',once:true,onEnter:function(){
    var w=cv.clientWidth||260,h=cv.clientHeight||110; cv.width=w; cv.height=h;
    var off=document.createElement('canvas'); off.width=w; off.height=h; var og=off.getContext('2d');
    og.font='900 '+(w>200?96:64)+'px Inter,sans-serif'; og.fillStyle='#fff'; og.textBaseline='middle';
    var tw=og.measureText(text).width; og.fillText(text,Math.max(0,(w-tw)/2),h/2+4);
    var data=og.getImageData(0,0,w,h).data, pts=[];
    for(var y=0;y<h;y+=4) for(var x=0;x<w;x+=4){ if(data[(y*w+x)*4+3]>120) pts.push({x:x,y:y,sx:Math.random()*w,sy:-20-Math.random()*120,t:Math.random()}); }
    var ctx=cv.getContext('2d'), start=null;
    function frame(ts){ if(!start)start=ts; var p=Math.min((ts-start)/1600,1); ctx.clearRect(0,0,w,h); ctx.fillStyle='#EDEDEA';
      pts.forEach(function(pt){ var q=Math.max(0,Math.min(1,p*1.3-pt.t*.3)); var e=1-Math.pow(1-q,3); ctx.fillRect(pt.sx+(pt.x-pt.sx)*e,pt.sy+(pt.y-pt.sy)*e,2.4,2.4); });
      if(p<1) requestAnimationFrame(frame); }
    requestAnimationFrame(frame);
  }});
});

/* work hover: dim siblings, preview + blue circle */
var wl=$('#workList'), prev=$('#workPreview');
if(wl && matchMedia('(hover:hover)').matches){
  $$('.work-row',wl).forEach(function(row){
    row.addEventListener('mouseenter',function(){ wl.classList.add('dim'); prev.src=row.getAttribute('data-img'); prev.classList.add('on'); circ.classList.add('on'); cur.style.opacity='0'; });
    row.addEventListener('mouseleave',function(){ wl.classList.remove('dim'); prev.classList.remove('on'); circ.classList.remove('on'); cur.style.opacity='1'; });
  });
  document.addEventListener('mousemove',function(e){ prev.style.left=(e.clientX-245)+'px'; prev.style.top=(e.clientY-145)+'px'; });
}

/* experience: pinned year follows timeline */
var expItems=$$('.exp-item'), expYear=$('#expYear');
expItems.forEach(function(it){
  ScrollTrigger.create({trigger:it,start:'top 55%',end:'bottom 55%',
    onToggle:function(self){ if(self.isActive){ expItems.forEach(function(x){x.classList.remove('on')}); it.classList.add('on');
      var y=it.getAttribute('data-year'); if(expYear.textContent!==y){ gsap.fromTo(expYear,{y:26,opacity:0},{y:0,opacity:1,duration:.5,ease:'power3.out'}); expYear.textContent=y; } } }});
});

/* motto: spotlight + break/fix */
var motto=$('#motto'), spot=$('#mottoSpot'), mottoH=$('#mottoH');
motto.addEventListener('mousemove',function(e){ var r=motto.getBoundingClientRect(); spot.style.left=(e.clientX-r.left)+'px'; spot.style.top=(e.clientY-r.top)+'px'; });
mottoH.addEventListener('mouseenter',function(){spot.classList.add('on')});
mottoH.addEventListener('mouseleave',function(){spot.classList.remove('on')});
/* split motto into letters for break */
$$('#mottoH .m-line').forEach(function(line){ var txt=line.textContent; var isAccent=line.querySelector('b'); line.innerHTML='';
  txt.split('').forEach(function(ch){ var s=document.createElement('span'); s.className='ltr'; s.textContent=ch===' '?'\u00A0':ch; line.appendChild(s); });
  if(isAccent){ /* recolor last words */ var spans=line.querySelectorAll('.ltr'); var words=txt.trim().split(' '); var accentWords=words.slice(1).join(' ').length;
    for(var i=spans.length-accentWords-1;i<spans.length;i++){ if(spans[i]) spans[i].style.color='#5C61E0'; } }
});
var broken=false, breakBtn=$('#breakBtn'), toasts=$('#toasts'), diff=$('#diffCard');
var toastTexts=["TypeError: Cannot read properties of undefined (reading 'icing')","Uncaught RangeError: sprinkles are not supposed to be on","Warning: this worked in my kitchen","ReferenceError: 'made to order' is not defined"];
breakBtn.addEventListener('click',function(){
  if(!broken){ broken=true; breakBtn.textContent='Fix it'; breakBtn.classList.add('blue');
    $$('#mottoH .ltr').forEach(function(s){ var r=(Math.random()*20-10).toFixed(1); s.style.transform='rotate('+r+'deg) translate('+(Math.random()*10-5)+'px,'+(Math.random()*10-5)+'px)'; });
    toasts.innerHTML=''; toastTexts.forEach(function(t,i){ var d=document.createElement('div'); d.className='toast'; d.textContent=t; d.style.animationDelay=(i*.09)+'s'; toasts.appendChild(d); });
  } else { broken=false; breakBtn.textContent='Break it'; breakBtn.classList.remove('blue'); toasts.innerHTML=''; diff.classList.add('on');
    setTimeout(function(){ $$('#mottoH .ltr').forEach(function(s){s.style.transform=''}); diff.classList.remove('on'); },1900); }
});

/* testimonials */
var TESTI=[
 {ex:'“beautiful and delicious heart shape bday cake”',full:'“beautiful and delicious heart shape bday cake 🫒🍸✨” — posted with her vintage martini heart cake, baked by Bella\u2019s Sweet Tooth.',name:'Tabia Ceja Lopez',role:'Customer — heart cake post'},
 {ex:'“thank you again for this beauty”',full:'“she was HEAVYY ! thank you again for this beauty 😍” — on the biggest book cake she has made so far.',name:'Bryan Ortega Amaro',role:'Customer — book cake post'},
 {ex:'“Stop! This is wayyy too cute”',full:'“Stop! This is wayyy too cute” — on the 6\u2033 3-layer birthday cake with the party hat.',name:'D Sweets',role:'Comment — 6\u2033 3-layer cake post'}
];
var tIdx=0,tTimer=null,tStart=null;
function showTesti(i){ tIdx=i; var t=TESTI[i];
  $$('.ttab').forEach(function(b,j){b.classList.toggle('active',j===i)});
  var ex=$('#testiExcerpt'); ex.innerHTML='';
  t.ex.split(' ').forEach(function(w){ var s=document.createElement('span'); s.className='w'; s.textContent=w; ex.appendChild(s); ex.appendChild(document.createTextNode(' ')); });
  $('#testiFull').textContent=t.full; $('#testiName').textContent=t.name; $('#testiRole').textContent=t.role;
  $$('#testiExcerpt .w').forEach(function(s,j){ setTimeout(function(){s.classList.add('sharp')},120+j*130); });
  tStart=Date.now();
}
function testiLoop(){ var bar=$('#testiBar'); (function f(){ if(tStart){ var p=(Date.now()-tStart)/6000; bar.style.width=Math.min(p*100,100)+'%';
  if(p>=1){ showTesti((tIdx+1)%TESTI.length); } } requestAnimationFrame(f); })(); }
showTesti(0); testiLoop();
$$('.ttab').forEach(function(b){ b.addEventListener('click',function(){ showTesti(parseInt(b.getAttribute('data-t'),10)); }); });

/* rails */
var railSections=$$('[data-rail]'), railLabel=$('#railLabel'), railRight=$('#railRight'), aww=$('#awwwardsBadge');
var ticks=[]; railSections.forEach(function(){ var i=document.createElement('i'); railRight.appendChild(i); ticks.push(i); });
var chars='ABCDEFGHIJKLMNOPQRSTUVWXYZ#/*<>';
function scramble(txt){ var n=0; var iv=setInterval(function(){ railLabel.textContent=txt.split('').map(function(c,j){ return j<n?c:chars[Math.floor(Math.random()*chars.length)] }).join(''); n++; if(n>txt.length){ railLabel.textContent=txt; clearInterval(iv);} },34); }
var io=new IntersectionObserver(function(es){ es.forEach(function(en){ if(en.isIntersecting){ var idx=railSections.indexOf(en.target);
  scramble(en.target.getAttribute('data-rail')); ticks.forEach(function(t,j){t.classList.toggle('on',j===idx)});
  var light=en.target.classList.contains('light')||en.target.tagName==='FOOTER'; aww.classList.toggle('on-light',light);
  document.querySelector('.rail-left').classList.toggle('on-light',light); hdr.classList.toggle('on-light',light); } }); },{rootMargin:'-45% 0px -45% 0px'});
railSections.forEach(function(s){io.observe(s)});

/* menu */
var overlay=$('#menuOverlay');
function openMenu(){ overlay.classList.add('open'); drawMoName(); }
function closeMenu(){ overlay.classList.remove('open'); }
$('#menuBtn').addEventListener('click',openMenu); fab.addEventListener('click',openMenu);
var moClose=$('#moClose'); if(moClose) moClose.addEventListener('click',closeMenu);
document.addEventListener('keydown',function(e){ if(e.key==='Escape'){ closeMenu(); closeStory(); } });
overlay.addEventListener('click',function(e){ if(e.target===overlay) closeMenu(); });
function drawMoName(){ var cv=$('#moName'); if(!cv||cv.width) { if(cv&&cv.width) return; }
  var w=cv.clientWidth||innerWidth; cv.width=w; cv.height=110; var g=cv.getContext('2d');
  g.font='900 64px Inter,sans-serif'; var txt='Bella\u2019s Sweet Tooth \u2022 Bella\u2019s Sweet Tooth \u2022 '; g.fillStyle='#fff';
  var data=null; var off=document.createElement('canvas'); off.width=w; off.height=110; var og=off.getContext('2d');
  og.font='900 64px Inter,sans-serif'; og.fillStyle='#fff'; og.fillText(txt,10,74);
  try{ data=og.getImageData(0,0,w,110).data; }catch(e){ return; }
  for(var y=0;y<110;y+=5) for(var x=0;x<w;x+=5){ if(data[(y*w+x)*4+3]>110){ g.globalAlpha=.75; g.fillRect(x,y,2.4,2.4); } } }

/* footer particle name */
(function(){ var cv=$('#footName'); if(!cv) return;
  function draw(){ var w=cv.clientWidth; if(!w) return; cv.width=w; cv.height=150;
    var off=document.createElement('canvas'); off.width=w; off.height=150; var og=off.getContext('2d');
    og.font='900 92px Inter,sans-serif'; og.fillStyle='#141412'; og.fillText('Bella\u2019s Sweet Tooth \u2022 Bella\u2019s Sweet Tooth',0,104);
    var data; try{ data=og.getImageData(0,0,w,150).data; }catch(e){ return; }
    var g=cv.getContext('2d'); g.fillStyle='#141412';
    for(var y=0;y<150;y+=5) for(var x=0;x<w;x+=5){ if(data[(y*w+x)*4+3]>110){ g.globalAlpha=.8; g.fillRect(x,y,2.6,2.6); } } }
  ScrollTrigger.create({trigger:cv,start:'top 95%',once:true,onEnter:draw}); window.addEventListener('resize',draw);
})();

/* chat */
var ANSWERS=[
 {k:['order','dm','buy','book'],a:'DM her on Instagram — but first check the “availability” highlight for open dates and read “how to order / policies”. She replies within 24–48 hours.'},
 {k:['size','big','layer','inch'],a:'From the feed: 5\u2033 and 6\u2033 cakes, two or three layers — plus bento and mini cakes for smaller celebrations.'},
 {k:['reply','fast','long','respond','answer'],a:'She replies to every DM herself within 24–48 hours.'},
 {k:['booking','now','november','date','available'],a:'She is booking November right now — the Spider-Man cake post says so. Check the “availability” highlight for the exact open dates.'},
 {k:['price','cost','much'],a:'Prices are quoted by her in DM — nothing is priced publicly, so send your date and design idea and she will quote you.'},
 {k:['where','location','la','pick'],a:'She is a home based baker in South Los Angeles, 90044.'},
 {k:['treat','strawberr','pretzel','pop'],a:'Yes — chocolate-covered strawberries, pretzels, cake pops and rice crispy treats, plus full party packages for any special occasion.'}
];
var log=$('#chatLog');
function addMsg(txt,me){ var d=document.createElement('div'); d.className='msg'+(me?' me':'');
  if(!me){ var im=document.createElement('img'); im.src='assets/vintageheart.jpg'; im.alt=''; d.appendChild(im); }
  var p=document.createElement('p'); p.textContent=txt; d.appendChild(p); log.appendChild(d); return d; }
function answer(q){ var typing=addMsg('•••',false); typing.classList.add('typing');
  setTimeout(function(){ typing.remove(); var low=q.toLowerCase(),found=null;
    ANSWERS.forEach(function(x){ if(!found) x.k.forEach(function(k){ if(low.indexOf(k)>-1) found=x.a; }); });
    addMsg(found||'I only know what\u2019s on her page — for anything else, DM @bellas.sweettooth on Instagram and she\u2019ll reply within 24–48 hours.',false);
  },900); }
$('#chatForm').addEventListener('submit',function(e){ e.preventDefault(); var v=$('#chatText').value.trim(); if(!v)return; $('#chatText').value=''; addMsg(v,true); answer(v); });
$$('#chatChips button').forEach(function(b){ b.addEventListener('click',function(){ addMsg(b.textContent,true); answer(b.textContent); }); });

/* story overlay */
var story=$('#story');
function openStory(){ story.classList.add('open'); document.body.style.overflow='hidden'; if(lenis)lenis.stop(); }
function closeStory(){ story.classList.remove('open'); document.body.style.overflow=''; if(lenis)lenis.start(); }
$('#segStory').addEventListener('click',openStory);
$('#segSite').addEventListener('click',closeStory);
$('#storySkip').addEventListener('click',closeStory);

/* show the code */
var codeBtns=[$('#codeBtn'),$('#codeBtn2')];
function toggleCode(){ document.body.classList.toggle('code-on'); $('#codeBtn').classList.toggle('on',document.body.classList.contains('code-on'));
  $('#pillTip').textContent=document.body.classList.contains('code-on')?'Hide the code':'Show the code';
  if(document.body.classList.contains('code-on')){ $('#mEls').textContent=document.getElementsByTagName('*').length.toLocaleString();
    try{ var nav=performance.getEntriesByType('navigation')[0]; $('#mPaint').textContent=(nav.domContentLoadedEventEnd/1000).toFixed(2)+'s'; }catch(e){}
    var kb=0; try{ performance.getEntriesByType('resource').forEach(function(r){kb+=(r.transferSize||0)}); }catch(e){}
    $('#mWeight').textContent=kb?Math.round(kb/1024)+' KB':'—';
    $('#cpCode').textContent='<section class="hero">\n  <canvas id="heroParticles"></canvas>\n  <h1>Custom cakes, made\n      to order in South LA.</h1>\n</section>\n\n.hero{ background:#0E0E0F }\n.hero h1{ font-weight:300;\n  font-size:56px; line-height:1.05 }'; } }
codeBtns.forEach(function(b){ if(b) b.addEventListener('click',toggleCode); });
document.addEventListener('mousemove',function(e){ if(!document.body.classList.contains('code-on'))return;
  var t=e.target, ins=$('#inspector'); if(!t||!t.tagName){ins.style.opacity='0';return;}
  var tag=t.tagName.toLowerCase()+(t.className&&typeof t.className==='string'?'.'+t.className.split(' ')[0]:'');
  ins.textContent='<'+tag+'> · '+Math.round(t.getBoundingClientRect().height)+'px'; ins.style.left=(e.clientX+16)+'px'; ins.style.top=(e.clientY+16)+'px'; ins.style.opacity='1'; });
/* fps meter */
(function(){ var n=0,last=performance.now(); function f(){ n++; var now=performance.now(); if(now-last>=1000){ var el=$('#mFps'); if(el)el.textContent=n; n=0; last=now; } requestAnimationFrame(f); } requestAnimationFrame(f); })();

/* loader failsafe: nothing blocks first paint; refresh triggers after full load */
window.addEventListener('load',function(){ setTimeout(function(){ ScrollTrigger.refresh(); },600); });
})();
