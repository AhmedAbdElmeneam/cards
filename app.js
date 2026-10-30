/* NFC profile — shared core: link catalog, safe rendering, storage, page effects.
   Used by index.html (public page) and edit.html (editor). */
(function () {
  'use strict';
  var CFG = window.NFC_CONFIG || {};

  /* ------------------------------------------------------------------ icons */
  var ICONS = {"whatsapp": '<path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z"/><path d="M9 9.5c.3 2.2 2.3 4.2 4.5 4.5"/>', "linkedin": '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M8 10.5V16M8 7.8v.01M12 16v-5.5M12 13a2.5 2.5 0 0 1 5 0v3"/>', "github": '<path d="M9 19c-4 1.3-4-2-6-2.5M15 21v-3.5a3 3 0 0 0-.9-2.4c3-.3 6-1.5 6-6.6a5 5 0 0 0-1.4-3.6 4.7 4.7 0 0 0-.1-3.6s-1.1-.3-3.6 1.4a12.4 12.4 0 0 0-6.5 0C6 1 4.9 1.3 4.9 1.3a4.7 4.7 0 0 0-.1 3.6A5 5 0 0 0 3.4 8.5c0 5.1 3 6.3 6 6.6a3 3 0 0 0-.9 2.4V21"/>', "instagram": '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17" cy="7" r=".9" fill="currentColor"/>', "tiktok": '<path d="M14 4v10.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 4c.5 2.5 2.2 4 5 4.2"/>', "facebook": '<path d="M15 4h-2a3 3 0 0 0-3 3v13"/><path d="M7 11h7"/>', "spotify": '<circle cx="12" cy="12" r="9"/><path d="M7.5 9.5c3-1 6.5-.7 9 .8M8 12.7c2.5-.7 5.2-.4 7.3.8M8.6 15.6c1.9-.5 3.9-.3 5.5.6"/>', "mail": '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M4 7l8 6 8-6"/>', "phone": '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>', "code": '<path d="M8 7l-5 5 5 5M16 7l5 5-5 5"/>', "scale": '<path d="M12 3v18M6 21h12M5 7h14M5 7l-3 7a3 3 0 0 0 6 0zM19 7l-3 7a3 3 0 0 0 6 0z"/>', "telegram": '<path d="M21 4L3 11l6 2.5M21 4l-3 16-9-6.5M21 4L9 13.5V19l3-3.2"/>', "instapay": '<path d="M13 3L5 13.5h6L10 21l8-10.5h-6z"/>', "telda": '<rect x="2.5" y="5" width="19" height="14" rx="3"/><path d="M2.5 9.5h19M6.5 15h4"/>', "x": '<path d="M4 4l16 16M20 4L4 20"/>', "youtube": '<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10 9.5v5l4.5-2.5z" fill="currentColor"/>', "snapchat": '<path d="M12 3c3 0 5 2.2 5 5v3l2 1-2 1c.3 1.7 1.8 2.8 3 3-1 .8-2.3 1-3.5 1-.8 1.3-2.2 2-4.5 2s-3.7-.7-4.5-2c-1.2 0-2.5-.2-3.5-1 1.2-.2 2.7-1.3 3-3l-2-1 2-1V8c0-2.8 2-5 5-5z"/>', "website": '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.8 3.5 5.8 3.5 9s-1 6.2-3.5 9c-2.5-2.8-3.5-5.8-3.5-9s1-6.2 3.5-9z"/>', "link": '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'};
  function icon(name) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || ICONS.link) + '</svg>';
  }

  /* ----------------------------------------------------------- link catalog */
  function handle(v) { return String(v || '').trim().replace(/^@/, ''); }
  function phoneDigits(v) { var d = String(v || '').replace(/\D/g, ''); return d.charAt(0) === '0' ? '20' + d.slice(1) : d; }
  var TYPES = {
    whatsapp:  { n: 'WhatsApp',  g: 'linear-gradient(135deg,#13b45c,#00bfa6)', ph: '01xxxxxxxxx', b: function (v) { return 'https://wa.me/' + phoneDigits(v); } },
    instagram: { n: 'Instagram', g: 'linear-gradient(135deg,#ffb020,#ff3d8b 50%,#7b4dff)', ph: '@username', b: function (v) { return 'https://www.instagram.com/' + handle(v); } },
    tiktok:    { n: 'TikTok',    g: 'linear-gradient(135deg,#141628,#ff3d8b)', ph: '@username', b: function (v) { return 'https://www.tiktok.com/@' + handle(v); } },
    facebook:  { n: 'Facebook',  g: 'linear-gradient(135deg,#2f6bff,#7b4dff)', ph: 'username', b: function (v) { return 'https://www.facebook.com/' + handle(v); } },
    linkedin:  { n: 'LinkedIn',  g: 'linear-gradient(135deg,#2f6bff,#5aa9ff)', ph: 'username', b: function (v) { return 'https://www.linkedin.com/in/' + handle(v); } },
    github:    { n: 'GitHub',    g: 'linear-gradient(135deg,#141628,#454b75)', ph: 'username', b: function (v) { return 'https://github.com/' + handle(v); } },
    telegram:  { n: 'Telegram',  g: 'linear-gradient(135deg,#2aabee,#2f6bff)', ph: '@username', b: function (v) { return 'https://t.me/' + handle(v); } },
    x:         { n: 'X',         g: 'linear-gradient(135deg,#141628,#3a3f55)', ph: '@username', b: function (v) { return 'https://x.com/' + handle(v); } },
    youtube:   { n: 'YouTube',   g: 'linear-gradient(135deg,#ff3d3d,#ff3d8b)', ph: '@channel', b: function (v) { return 'https://www.youtube.com/@' + handle(v); } },
    snapchat:  { n: 'Snapchat',  g: 'linear-gradient(135deg,#ffd400,#ffb020)', ph: 'username', b: function (v) { return 'https://www.snapchat.com/add/' + handle(v); } },
    spotify:   { n: 'Spotify',   g: 'linear-gradient(135deg,#1fc46b,#00bfa6)', ph: 'https://open.spotify.com/…', b: null },
    website:   { n: 'Website',   g: 'linear-gradient(135deg,#7b4dff,#2f6bff)', ph: 'example.com', b: null },
    instapay:  { n: 'InstaPay',  g: 'linear-gradient(135deg,#5b2dbd,#a24bff)', ph: 'https://ipn.eg/S/…', b: null, pay: true },
    telda:     { n: 'telda',     g: 'linear-gradient(135deg,#141628,#2b2f45)', ph: 'https://ipn.eg/S/…', b: null, pay: true, ink: '#c8ff4d' },
    link:      { n: 'Link',      g: 'linear-gradient(135deg,#00bfa6,#2f6bff)', ph: 'https://…', b: null }
  };

  function safeUrl(u) {
    u = String(u || '').trim();
    return /^(https?:\/\/|mailto:|tel:)/i.test(u) ? u : '#';
  }
  function hrefFor(type, v) {
    v = String(v || '').trim();
    if (!v) return '#';
    if (/^https?:\/\//i.test(v)) return safeUrl(v);
    var t = TYPES[type] || TYPES.link;
    if (/^[\w-]+(\.[\w-]+)+(\/|$)/.test(v) && type !== 'whatsapp') return safeUrl('https://' + v);
    return t.b ? safeUrl(t.b(v)) : safeUrl('https://' + v);
  }
  function shortOf(type, v) {
    v = String(v || '').trim();
    if (!/^https?:\/\//i.test(v) && !/\//.test(v)) return type === 'whatsapp' ? v : '@' + handle(v);
    var s = v.replace(/^https?:\/\//i, '').replace(/^www\./, '').replace(/\?.*$/, '').replace(/\/$/, '');
    var parts = s.split('/');
    return parts.length > 1 ? parts[parts.length - 1] : s;
  }

  /* --------------------------------------------------------------- render */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }
  function rich(s) { return esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>'); }
  function initials(n) { return esc(String(n || '?').trim().split(/\s+/).slice(0, 2).map(function (w) { return w.charAt(0); }).join('').toUpperCase()); }

  var EQ = '<span class="eq" aria-hidden="true"><i></i><i></i><i></i></span>';
  function tile(l, i, wide) {
    var t = TYPES[l.type] || TYPES.link;
    var name = l.label || t.n, sub = l.sub || shortOf(l.type, l.value);
    var end = (l.type === 'spotify' ? EQ : '') + (l.type !== 'spotify' || wide ? '<span class="ar">↗</span>' : '');
    return '<a class="l panel rv' + (wide ? ' wide' : '') + (t.pay ? ' pay' : '') + '" style="--i:' + i + ';--c:' + t.g + (t.ink ? ';--ink2:' + t.ink : '') + '" href="' + esc(hrefFor(l.type, l.value)) + '" target="_blank" rel="noopener">' +
      '<span class="ico"' + (t.ink ? ' style="color:' + t.ink + '"' : '') + '>' + icon(l.type) + '</span><span class="tx"><b>' + esc(name) + '</b><span>' + esc(sub) + '</span></span>' + end + '</a>';
  }
  function grid(list, start) {
    var html = '', n = list.length;
    list.forEach(function (l, k) { html += tile(l, start + k, n % 2 === 1 && k === n - 1); });
    return '<div class="grid">' + html + '</div>';
  }

  function render(P, el) {
    P = P || {};
    var TP = window.NFC_TPL;
    if (TP && TP.has(P.template)) { el.setAttribute('data-tpl', P.template); TP.render(P, el); return; }
    el.setAttribute('data-tpl', 'dev'); el.removeAttribute('dir');
    var i = 0, h = '';
    var av = P.avatar ? '<img src="' + esc(P.avatar) + '" alt="' + esc(P.name) + '">' : '<span class="ini">' + initials(P.name) + '</span>';
    h += '<section class="panel me rv" style="--i:' + (i++) + '"><div class="av">' + av + '</div><h1>' + esc(P.name || 'Your Name') + '</h1>' +
      (P.status ? '<div class="st">' + esc(P.status) + '</div>' : '<div></div>') +
      (P.bio ? '<p>' + rich(P.bio) + '</p>' : '') +
      (P.terminal ? '<div class="term"><span class="p">$</span><span>' + esc(P.terminal) + '</span><span class="cur"></span></div>' : '') + '</section>';

    var links = (P.links || []).filter(function (l) { return l && l.value; });
    var pr = P.primary && P.primary.value ? P.primary : null;
    if (pr || links.length) {
      h += '<div class="lbl rv" style="--i:' + (i++) + '"><span><b>//</b> connect</span></div>';
      if (pr) {
        var pt = TYPES[pr.type] || TYPES.whatsapp;
        h += '<a class="l rv wa" style="--i:' + (i++) + ';background-image:' + pt.g.replace(')', ',#2fb6ff)') + '" href="' + esc(hrefFor(pr.type, pr.value)) + '" target="_blank" rel="noopener"><span class="ico">' + icon(pr.type) +
          '</span><span class="tx"><b>' + esc(pr.label || pt.n) + '</b><span>' + esc(pr.sub || 'Message me directly') + '</span></span><span class="ar">→</span></a>';
      }
      if (links.length) { h += grid(links, i); i += links.length; }
    }
    var pay = (P.pay || []).filter(function (l) { return l && l.value; });
    if (pay.length) {
      h += '<div class="lbl rv" style="--i:' + (i++) + '"><span><b>//</b> pay</span></div>' + grid(pay, i); i += pay.length;
    }
    var c = P.contact || {};
    if (c.phone || c.email) {
      h += '<div class="lbl rv" style="--i:' + (i++) + '"><span><b>//</b> contact</span></div><div class="panel contact rv" style="--i:' + (i++) + '">' +
        (c.phone ? '<button class="cp" data-copy="' + esc(c.phone) + '">' + icon('phone') + '<span class="v">' + esc(c.phone) + '</span><span class="cl">copy</span></button>' : '') +
        (c.email ? '<button class="cp" data-copy="' + esc(c.email) + '">' + icon('mail') + '<span class="v">' + esc(c.email) + '</span><span class="cl">copy</span></button>' : '') + '</div>';
    }
    h += '<div class="foot rv" style="--i:' + (i++) + '"><span class="m">' + (window.SIDM || esc)((P.brand && P.brand !== 'MENEAM' ? P.brand : '') || CFG.brand || 'NFC') + '</span><span>' + esc(P.tagline || 'tap · connect · build') + '</span></div>';
    el.innerHTML = h;
    applySkin(P.skin);
  }

  var SKINS = {
    aurora: ['#2f6bff', '#7b4dff', '#ff3d8b'],
    ocean:  ['#0077ff', '#00a3c4', '#00bfa6'],
    sunset: ['#ff6a3d', '#ff3d8b', '#b03dff'],
    lime:   ['#00a86b', '#1fc46b', '#b8d400'],
    mono:   ['#141628', '#454b75', '#8a90a8']
  };
  function applySkin(name, root) {
    var s = SKINS[name] || SKINS.aurora, r = (root || document.documentElement).style;
    r.setProperty('--grad', 'linear-gradient(110deg,' + s[0] + ',' + s[1] + ' 50%,' + s[2] + ')');
    r.setProperty('--violet', s[1]);
    r.setProperty('--blue', s[0]);
  }

  /* copy buttons (event delegation, works for re-rendered content) */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('[data-copy]'); if (!btn) return;
    var t = btn.getAttribute('data-copy'), lbl = btn.querySelector('.cl');
    function done() { if (lbl) { lbl.textContent = 'copied'; btn.classList.add('ok'); setTimeout(function () { lbl.textContent = 'copy'; btn.classList.remove('ok'); }, 1500); } }
    function fb() { var ta = document.createElement('textarea'); ta.value = t; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); done(); } catch (x) {} document.body.removeChild(ta); }
    try { navigator.clipboard.writeText(t).then(done, fb); } catch (x) { fb(); }
  });

  /* --------------------------------------------------------------- storage */
  function loadScript(src) {
    return new Promise(function (res, rej) { var s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = function () { rej(new Error('Could not load ' + src)); }; document.head.appendChild(s); });
  }
  var Store = {
    mode: 'local', error: null,
    init: function () {
      var self = this;
      if (!CFG.firebase || !CFG.firebase.apiKey) return Promise.resolve(self);
      var v = '10.12.2', base = 'https://www.gstatic.com/firebasejs/' + v + '/';
      return loadScript(base + 'firebase-app-compat.js')
        .then(function () { return Promise.all([loadScript(base + 'firebase-auth-compat.js'), loadScript(base + 'firebase-firestore-compat.js')]); })
        .then(function () {
          firebase.initializeApp(CFG.firebase);
          self.db = firebase.firestore(); self.auth = firebase.auth(); self.mode = 'cloud';
          return self;
        })
        .catch(function (e) { self.error = e; self.mode = 'local'; return self; });
    },
    key: function (slug) { return 'nfc-profile:' + slug; },
    get: function (slug) {
      if (this.mode === 'cloud') return this.db.collection('profiles').doc(slug).get().then(function (d) { return d.exists ? d.data() : null; });
      try { var raw = localStorage.getItem(this.key(slug)); return Promise.resolve(raw ? JSON.parse(raw) : null); } catch (e) { return Promise.resolve(null); }
    },
    save: function (slug, data) {
      if (this.mode === 'cloud') {
        var d = JSON.parse(JSON.stringify(data)); d.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
        return this.db.collection('profiles').doc(slug).set(d);
      }
      try { localStorage.setItem(this.key(slug), JSON.stringify(data)); return Promise.resolve(); }
      catch (e) { return Promise.reject(new Error('Your browser blocked saving. Turn off private mode and try again.')); }
    },
    /* Exchange a secret edit code for the profile it unlocks (cloud mode). */
    claim: function (code) {
      var self = this;
      return self.auth.signInAnonymously()
        .then(function () { return self.db.collection('keys').doc(code).get(); })
        .then(function (d) {
          if (!d.exists || !d.data().slug) throw new Error('badkey');
          var slug = d.data().slug;
          return self.db.collection('sessions').doc(self.auth.currentUser.uid).set({ slug: slug, code: code }).then(function () { return slug; });
        });
    }
  };

  function slugFromUrl() {
    var q = new URLSearchParams(location.search).get('u');
    var hsh = location.hash.replace(/^#/, '');
    // pretty links: soulid.org/mona  (ignore page names and the old /cards/ folder)
    var seg = decodeURIComponent(location.pathname.split('/').filter(Boolean).pop() || '');
    if (/\.html?$/i.test(seg) || /^(index|edit|admin|cards)$/i.test(seg)) seg = '';
    return (q || hsh || seg || CFG.defaultSlug || 'demo').toLowerCase().replace(/[^a-z0-9_-]/g, '');
  }

  /* ------------------------------------------------------------ page effects */
  /* ---- background: Dart typing itself ---- */
function startCodeBg(){
  var c=document.getElementById('code'); if(!c||!c.getContext) return;
  var x=c.getContext('2d'), dpr=Math.min(devicePixelRatio||1,2), W,H, cols=[];
  var still=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var PP=window.__P||{}, NM=String(PP.name||'Your Name').replace(/'/g,''), CL=(NM.split(/\s+/)[0]||'Me').replace(/[^A-Za-z]/g,'')||'Profile';
  var LK=(PP.links||[]).slice(0,4).map(function(l){return "  Link."+l.type+"(),";});
  var SRC=["import 'package:flutter/material.dart';","","class "+CL+" extends StatelessWidget {","  const "+CL+"({super.key});","","  @override","  Widget build(BuildContext context) {","    return Card(","      holder: '"+NM+"',","      chip: NfcChip.ntag215,","    );","  }","}","",
  "// tap · connect · build","final links = <Link>["].concat(LK,["];","",
  "Future<void> connect() async {","  final tag = await NfcManager.read();","  if (tag.isValid) {","    await launchUrl(profileUrl);","  }","}","",
  "class Architecture {","  final layers = ['ui', 'domain', 'data'];","  final state = Bloc<Event, State>();","  final perf = 120; // fps","}","",
  "void main() => runApp(const "+CL+"());",""]);
  var KW=/^(import|class|extends|const|final|return|async|await|if|void|super|true|false)$/;
  var C={kw:'#7b4dff',str:'#00a58f',ty:'#2f6bff',cm:'#9aa1b9',num:'#ff8a00',fn:'#ff3d8b',at:'#ff3d8b',p:'#4a5070'};
  function tok(s){
    var out=[],m,re=/(\/\/.*$)|('[^']*'?)|(@\w+)|(\b\d+\b)|([A-Za-z_]\w*)|(\s+)|([^\sA-Za-z_\d'])/g;
    while((m=re.exec(s))){var t=m[0],k='p';
      if(m[1])k='cm';else if(m[2])k='str';else if(m[3])k='at';else if(m[4])k='num';
      else if(m[5]){ if(KW.test(t))k='kw'; else if(/^[A-Z]/.test(t))k='ty'; else if(s.charAt(re.lastIndex)==='(')k='fn'; }
      out.push([t,k]);}
    return out;
  }
  var LH=19, FS=12.5, CWD=360;
  function setup(){
    W=innerWidth;H=innerHeight;c.width=W*dpr;c.height=H*dpr;x.setTransform(dpr,0,0,dpr,0,0);
    var n=Math.max(1,Math.ceil(W/CWD)), gap=W/n; cols=[];
    for(var i=0;i<n;i++){
      var col={x:i*gap+14+(i%2)*10,src:Math.floor(Math.random()*SRC.length),lines:[],cur:'',ci:0,speed:22+Math.random()*16,acc:0,
        rows:Math.ceil(H/LH)+1,off:0};
      // prefill so the first frame already shows code
      var pre=Math.floor(col.rows*(.45+Math.random()*.4));
      for(var k=0;k<pre;k++){col.lines.push(SRC[col.src]);col.src=(col.src+1)%SRC.length;}
      cols.push(col);
    }
  }
  var cache={};
  function T(s){return cache[s]||(cache[s]=tok(s));}
  function line(s,px,py,partial){
    var t=T(s),cx=px; x.font='500 '+FS+'px "JetBrains Mono",ui-monospace,monospace';
    for(var i=0;i<t.length;i++){x.fillStyle=C[t[i][1]];x.fillText(t[i][0],cx,py);cx+=x.measureText(t[i][0]).width;}
    return cx;
  }
  var last=performance.now();
  function frame(now){
    var dt=Math.min(.05,(now-last)/1000); last=now;
    x.clearRect(0,0,W,H); x.textBaseline='middle';
    cols.forEach(function(col){
      if(!still){
        col.acc+=dt*col.speed;
        while(col.acc>=1){col.acc-=1; var target=SRC[col.src];
          if(col.ci<target.length){col.ci++;}
          else{col.lines.push(target);col.src=(col.src+1)%SRC.length;col.ci=0;col.acc-=3;}
        }
        col.cur=SRC[col.src].slice(0,col.ci);
        if(col.lines.length>=col.rows-1){col.off+=dt*LH*2.2; if(col.off>=LH){col.off-=LH;col.lines.shift();}}
      }
      var y=LH*.8-col.off;
      x.globalAlpha=W<560?.14:.22;
      for(var i=0;i<col.lines.length;i++){ if(col.lines[i]) line(col.lines[i],col.x,y); y+=LH; }
      x.globalAlpha=W<560?.28:.42;
      var end=line(col.cur,col.x,y);
      if(Math.floor(now/450)%2===0){x.fillStyle='#7b4dff';x.fillRect(end+1,y-7,7,14);}
      x.globalAlpha=1;
    });
    if(!still) requestAnimationFrame(frame);
  }
  setup(); addEventListener('resize',function(){setup(); if(still) frame(performance.now());});
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(function(){cache={};});
  requestAnimationFrame(frame);
}
  /* ---- scroll: progress bar + reveal ---- */
function startReveal(){
  var bar=document.querySelector('.prog');
  function on(){var m=document.documentElement.scrollHeight-innerHeight; if(bar) bar.style.transform='scaleX('+(m>0?scrollY/m:0)+')';}
  addEventListener('scroll',on,{passive:true}); on();
  if(!('IntersectionObserver' in window)) return;
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.15});
  document.querySelectorAll('.rv').forEach(function(el){ if(el.getBoundingClientRect().top>innerHeight-10){el.classList.add('later');io.observe(el);} });
  addEventListener('pointerdown',function(e){var r=document.createElement('span');r.className='ripple';r.style.left=e.clientX+'px';r.style.top=e.clientY+'px';
    r.style.borderColor=['#2f6bff','#7b4dff','#ff3d8b','#00bfa6','#ffb020'][Math.floor(Math.random()*5)];document.body.appendChild(r);setTimeout(function(){r.remove()},850);});
}

  /* ----------------------------------------------------------- public boot */
  function boot() {
    var t0 = performance.now(), el = document.getElementById('app');
    var slug = slugFromUrl();
    Store.init().then(function () { return Store.get(slug); }).catch(function () { return null; }).then(function (P) {
      P = P || DEFAULT;
      window.__P = P;
      var elapsed = (performance.now() - t0) / 1000;
      document.documentElement.style.setProperty('--base', Math.max(0.1, 2.15 - elapsed) + 's');
      if (P.name) document.title = P.name;
      var tp = window.NFC_TPL && NFC_TPL.has(P.template) ? P.template : 'dev';
      document.body.setAttribute('data-tpl', tp);
      if (tp !== 'dev') NFC_TPL.bg(tp);
      render(P, el);
      if (tp === 'dev') startCodeBg();
      startReveal();
    });
  }

  var DEFAULT = {"name": "Your Name", "status": "", "avatar": "", "bio": "This card has not been set up yet.", "terminal": "", "primary": {"type": "whatsapp", "value": ""}, "links": [], "pay": [], "contact": {}, "skin": "aurora", "brand": "SoulID", "tagline": "tap · connect · build"};

  window.NFC = { CFG: CFG, TYPES: TYPES, SKINS: SKINS, ICONS: ICONS, icon: icon, esc: esc, render: render, applySkin: applySkin, Store: Store, slugFromUrl: slugFromUrl, boot: boot, DEFAULT: DEFAULT, hrefFor: hrefFor };
})();
