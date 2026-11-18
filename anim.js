/* SoulID home motion: scroll reveals, scroll-linked depth on the product objects, hover tilt.
   Only transform/opacity, one rAF per frame, nothing runs for reduced-motion users. */
(function(){
var H=document.getElementById('home');if(!H)return;
var R=matchMedia('(prefers-reduced-motion:reduce)').matches;
var css='#home .hb{transition:transform .25s cubic-bezier(.2,.8,.2,1),background-color .2s,box-shadow .25s}'
+'#home .hb:hover{transform:translateY(-2px)}#home .hb.light:hover,#home .hb.dark:hover{box-shadow:0 14px 28px -12px rgba(0,0,0,.45)}'
+'#home .hb.light,#home .hb.dark{position:relative;overflow:hidden;isolation:isolate}'
+'#home .hb.light::after,#home .hb.dark::after{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(105deg,transparent 35%,rgba(255,255,255,.55) 50%,transparent 65%);transform:translateX(-120%);pointer-events:none}'
+'#home .hb.dark::after{background:linear-gradient(105deg,transparent 35%,rgba(255,255,255,.14) 50%,transparent 65%)}'
+'#home .hb:hover::after{transform:translateX(120%);transition:transform .7s ease}'
+'#home .hb:hover svg{animation:sWig .5s ease}@keyframes sWig{30%{transform:rotate(-12deg)}60%{transform:rotate(8deg)}}'
+'.sb{--bg:rgba(20,20,22,.9);--fg:#f2f1ed;--ln:rgba(242,241,237,.35);color:var(--fg);position:fixed;inset-inline:0;top:0;z-index:40;background:var(--bg);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);box-shadow:0 1px 0 color-mix(in srgb,var(--ln) 40%,transparent);transform:translateY(-100%);transition:transform .4s cubic-bezier(.2,.8,.2,1),background-color .5s ease,color .5s ease}'
+'.sb[data-t=b]{--bg:rgba(242,241,237,.9);--fg:#22211e;--ln:rgba(34,33,30,.3)}.sb[data-t=s]{--bg:rgba(230,228,223,.9);--fg:#22211e;--ln:rgba(34,33,30,.3)}'
+'.sb[data-t=c]{--bg:rgba(59,13,24,.92);--fg:#f3dcd3;--ln:rgba(212,168,152,.55)}.sb[data-t=g]{--bg:rgba(15,26,51,.92);--fg:#dbe2f0;--ln:rgba(174,186,211,.5)}'
+'#home .sb .mk{color:inherit}#home .sb .hb.ghost{color:inherit;box-shadow:inset 0 0 0 1.5px var(--ln);transition:transform .25s cubic-bezier(.2,.8,.2,1),color .5s,box-shadow .5s}#home .sb .hb.ghost:hover{box-shadow:inset 0 0 0 1.5px var(--fg)}'
+'.sb.on{transform:none}.sb .ht{padding:9px 0}#home .sb .hb{min-height:38px;padding:0 16px}.sb .ht .mk svg{height:28px}.sb .ht .mk .wd{height:17px}'
+'.hw li::before{transition:transform .35s cubic-bezier(.2,.8,.2,1)}.hw li:hover::before{transform:translateY(-6px)}'
+'.hw li::after{transform:scaleX(0);transform-origin:right}.hw li.on::after{transform:none;transition:transform 1s cubic-bezier(.6,0,.2,1) .35s}'
+'.hq summary{transition:padding .25s ease}.hq summary:hover{padding-inline-start:8px}'
+'.hq summary::after{transition:transform .3s cubic-bezier(.2,.8,.2,1)}.hq details[open] p{animation:qIn .4s ease both}'
+'@keyframes qIn{from{opacity:0;transform:translateY(-6px)}}'
+'.pv{perspective:1100px}.pv .ph,.pv .ob{will-change:transform}'
+'.pv .ph{transform:translate3d(0,var(--py,0px),0) rotateX(var(--tx,0deg)) rotateY(var(--ty,0deg));transition:transform .25s ease-out}'
+'.pv .ob{transform:translate3d(0,var(--oy,0px),0) rotate(calc(-9deg + var(--or,0deg)));transition:transform .25s ease-out,box-shadow .3s}'
+'.pb.pay .ob{transform:translate3d(0,var(--oy,0px),0) rotate(calc(var(--or,0deg) * 3))}'
+'.pv:hover .ob{box-shadow:0 60px 70px -30px rgba(0,0,0,.8),0 0 0 1px rgba(255,255,255,.1) inset}'
+'.hs{transform:translate3d(0,var(--hy,0px),0)}'
+'.js-rv .rv{opacity:0;transform:translateY(26px)}'
+'.js-rv .rv.on{opacity:1;transform:none;transition:opacity .7s ease var(--d,0s),transform .9s cubic-bezier(.2,.8,.2,1) var(--d,0s)}';
if(R)css=css.split('.pv{perspective')[0].replace(/animation:sWig[^}]*/,'');
var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

/* compact bar that slides in once the hero is behind you */
var hero=H.querySelector('.hh'),top=H.querySelector('.ht');
if(hero&&top){var sb=document.createElement('div');sb.className='sb';sb.setAttribute('aria-hidden','true');
  var x=document.createElement('div');x.className='hx';x.appendChild(top.cloneNode(true));sb.appendChild(x);
  sb.querySelectorAll('a').forEach(function(a){a.tabIndex=-1});H.appendChild(sb);
  new IntersectionObserver(function(e){sb.classList.toggle('on',!e[0].isIntersecting)},{rootMargin:'-60% 0px 0px 0px'}).observe(hero)}
/* the bar and the browser chrome take the colours of the section under them */
var TH={hh:['d','#141416'],hw:['s','#e6e4df'],biz:['b','#f2f1ed'],cpl:['c','#3b0d18'],grd:['g','#0f1a33'],pay:['s','#e6e4df'],hq:['s','#e6e4df'],he:['d','#141416']};
var secs=[].slice.call(H.querySelectorAll('section')),metas=document.querySelectorAll('meta[name=theme-color]'),cur='',tq=0;
function theme(){tq=0;var y=sb?sb.offsetHeight:60,k='hh';for(var i=0;i<secs.length;i++){var r=secs[i].getBoundingClientRect();if(r.top<=y&&r.bottom>y){var c=secs[i].classList;k=c.contains('pb')?c[1]:c[0];break}}
  if(innerHeight+scrollY>=document.documentElement.scrollHeight-4)k='he';
  if(k===cur||!TH[k])return;cur=k;if(sb)sb.setAttribute('data-t',TH[k][0]);metas.forEach(function(m){m.setAttribute('content',TH[k][1])})}
addEventListener('scroll',function(){if(!tq)tq=requestAnimationFrame(theme)},{passive:true});theme();
if(R)return;

/* reveals: each group staggers its own children */
H.classList.add('js-rv');
var groups=[['.hg>div:first-child',' h1, .ld, .ac, .tr'],['.hw','h2, li'],['.pb','h2, .ds, li, .ac'],['.hq','h2, details'],['.he','h2, p, .ac']];
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target)}})},{rootMargin:'0px 0px -12% 0px'});
groups.forEach(function(g){H.querySelectorAll(g[0]).forEach(function(box){
  box.querySelectorAll(g[1]).forEach(function(el,i){el.classList.add('rv');el.style.setProperty('--d',(i*.07).toFixed(2)+'s');
    if(g[0]==='.hg>div:first-child')return;io.observe(el)})})});
/* hero copy waits for the splash to leave */
var heroEls=H.querySelectorAll('.hg>div:first-child .rv');
setTimeout(function(){heroEls.forEach(function(el){el.classList.add('on')})},Math.max(0,2150-(performance.now()-(window.__sg0||performance.now()))));

/* scroll-linked depth: only bands on screen are updated, once per frame */
var vis=new Set(),bands=[].slice.call(H.querySelectorAll('.pb .pv')),hs=H.querySelector('.hs'),tick=0;
var vio=new IntersectionObserver(function(es){es.forEach(function(e){e.isIntersecting?vis.add(e.target):vis.delete(e.target)});ask()});
bands.forEach(function(b){vio.observe(b)});
function frame(){tick=0;var vh=innerHeight;
  vis.forEach(function(b){var r=b.getBoundingClientRect(),p=((r.top+r.height/2)-vh/2)/vh;p=Math.max(-1,Math.min(1,p));
    var ph=b.querySelector('.ph'),ob=b.querySelector('.ob');
    if(ph)ph.style.setProperty('--py',(p*60).toFixed(1)+'px');
    if(ob){ob.style.setProperty('--oy',(-p*40).toFixed(1)+'px');ob.style.setProperty('--or',(p*7).toFixed(2)+'deg')}});
  if(hs&&scrollY<vh)hs.style.setProperty('--hy',(scrollY*.18).toFixed(1)+'px')}
function ask(){if(!tick)tick=requestAnimationFrame(frame)}
addEventListener('scroll',ask,{passive:true});addEventListener('resize',ask,{passive:true});ask();

/* hover tilt on each phone (mouse only) */
if(matchMedia('(hover:hover) and (pointer:fine)').matches)bands.forEach(function(b){var ph=b.querySelector('.ph');if(!ph)return;
  b.addEventListener('pointermove',function(e){var r=b.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    ph.style.setProperty('--ty',(x*14).toFixed(1)+'deg');ph.style.setProperty('--tx',(-y*10).toFixed(1)+'deg')});
  b.addEventListener('pointerleave',function(){ph.style.removeProperty('--tx');ph.style.removeProperty('--ty')})});
})();
