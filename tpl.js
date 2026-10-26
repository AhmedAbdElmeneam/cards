/* SoulID templates: classic, couple, grad. The original "dev" page lives in app.js.
   Loaded after app.js on the public page and in the editor. */
(function () {
  'use strict';
  var N = window.NFC; if (!N) return;
  var esc = N.esc, icon = N.icon, T = N.TYPES, CFG = N.CFG;

  /* ------------------------------------------------- extra icons, link types, colors */
  var IC = {
    pdf: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
    video: '<rect x="2.5" y="5.5" width="13" height="13" rx="3"/><path d="M15.5 10l6-3.5v11l-6-3.5"/>',
    slides: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M12 16v4M8 20h8M7 12l3-3 2 2 4-4"/>',
    demo: '<circle cx="12" cy="12" r="9"/><path d="M10 8.5l5.5 3.5-5.5 3.5z"/>',
    heart: '<path d="M12 20.5s-7.5-4.6-9.4-9.3C1.2 7.6 3.6 4 7.2 4c2 0 3.6 1.1 4.8 2.8C13.2 5.1 14.8 4 16.8 4c3.6 0 6 3.6 4.6 7.2-1.9 4.7-9.4 9.3-9.4 9.3z"/>',
    cap: '<path d="M2 9.5L12 5l10 4.5L12 14z"/><path d="M6 11.5V16c3.5 2.4 8.5 2.4 12 0v-4.5M21.5 9.5V15"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.4-3.8 4.4-6 8-6s6.6 2.2 8 6"/>',
    cal: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    pin: '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    save: '<path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9.5" cy="7" r="4"/><path d="M19 8v6M16 11h6"/>',
    music: '<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
    uni: '<path d="M3 10l9-6 9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 21h18"/>',
    tag: '<path d="M20.5 13.5l-7 7a2 2 0 0 1-2.8 0L3 12.8V3h9.8l7.7 7.7a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/>'
  };
  for (var k in IC) N.ICONS[k] = IC[k];
  var NT = {
    demo: { n: 'Live demo', g: 'linear-gradient(135deg,#00bfa6,#2f6bff)', ph: 'https://…', b: null },
    pdf: { n: 'PDF', g: 'linear-gradient(135deg,#ff5a5a,#ff3d8b)', ph: 'https://drive.google.com/…', b: null },
    video: { n: 'Video', g: 'linear-gradient(135deg,#ff3d3d,#ff8a3d)', ph: 'https://youtu.be/…', b: null },
    slides: { n: 'Slides', g: 'linear-gradient(135deg,#ffb020,#ff6a3d)', ph: 'https://…', b: null }
  };
  for (k in NT) T[k] = NT[k];
  N.SKINS.rose = ['#ff6b95', '#e0457b', '#ffb38a'];
  N.SKINS.navy = ['#1e3a8a', '#3b5bdb', '#14b8a6'];
  N.SKINS.gold = ['#a8741a', '#d4a017', '#e9b949'];

  /* ------------------------------------------------------------------ text */
  var L = {
    en: { connect: 'Find me', findUs: 'Find us', pay: 'Pay', contact: 'Contact', call: 'Call', email: 'Email', save: 'Save contact',
      since: 'Together since', until: 'Counting down to', daysTog: 'days together', daysLeft: 'days to go', y: 'years', m: 'months', d: 'days',
      song: 'Our song', letter: 'A letter for you', open: 'Tap to open', close: 'Close', story: 'Our story', moments: 'Moments',
      abstract: 'Abstract', more: 'Read more', less: 'Show less', team: 'The team', sup: 'Supervised by', defense: 'Defense',
      dept: 'Faculty', keys: 'Keywords', res: 'Project links', gallery: 'Gallery',
      kinds: { grad: 'Graduation Project', master: "Master's Thesis", phd: 'PhD Dissertation', research: 'Research Paper' } },
    ar: { connect: 'تابعني', findUs: 'تابعونا', pay: 'الدفع', contact: 'تواصل', call: 'اتصال', email: 'إيميل', save: 'احفظ الرقم',
      since: 'مع بعض من', until: 'فاضل على يومنا', daysTog: 'يوم مع بعض', daysLeft: 'يوم فاضلين', y: 'سنة', m: 'شهر', d: 'يوم',
      song: 'أغنيتنا', letter: 'جواب ليك', open: 'دوس عشان تفتحه', close: 'اقفل', story: 'حكايتنا', moments: 'لحظاتنا',
      abstract: 'ملخص المشروع', more: 'اقرا أكتر', less: 'أقل', team: 'فريق العمل', sup: 'إشراف', defense: 'المناقشة',
      dept: 'الكلية', keys: 'كلمات مفتاحية', res: 'لينكات المشروع', gallery: 'صور',
      kinds: { grad: 'مشروع تخرج', master: 'رسالة ماجستير', phd: 'رسالة دكتوراه', research: 'بحث علمي' } }
  };
  function lang(P) { return P.lang === 'ar' ? 'ar' : 'en'; }

  /* --------------------------------------------------------------- helpers */
  function rich(s) { return esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>'); }
  function live(list) { return (list || []).filter(function (l) { return l && l.value; }); }
  function href(l) { return esc(N.hrefFor(l.type, l.value)); }
  function short(l) {
    var v = String(l.value || '').trim();
    if (l.sub) return l.sub;
    if (!/^https?:\/\//i.test(v) && !/\//.test(v) && !(/^(website|link|demo|pdf|video|slides)$/.test(l.type) && /\./.test(v))) return l.type === 'whatsapp' ? v : '@' + v.replace(/^@/, '');
    return v.replace(/^https?:\/\//i, '').replace(/^www\./, '').replace(/\?.*$/, '').replace(/\/$/, '');
  }
  function initials(n) { return esc(String(n || '?').trim().split(/\s+/).slice(0, 2).map(function (w) { return w.charAt(0); }).join('').toUpperCase()); }
  function hue(s) { var h = 0; s = String(s || ''); for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360; return h; }
  function fmtDate(iso, lg) {
    if (!iso) return '';
    var d = new Date(iso + 'T00:00:00'); if (isNaN(d)) return esc(iso);
    try { return d.toLocaleDateString(lg === 'ar' ? 'ar-EG' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }); } catch (e) { return iso; }
  }
  function rv(i, extra) { return ' rv' + (extra ? ' ' + extra : '') + '" style="--i:' + i; }
  function vcard(P) {
    var c = P.contact || {}, nm = String(P.name || '').replace(/[\r\n;,]/g, ' ');
    var v = ['BEGIN:VCARD', 'VERSION:3.0', 'FN:' + nm, 'N:' + nm + ';;;;'];
    if (P.status) v.push('TITLE:' + String(P.status).replace(/[\r\n]/g, ' '));
    if (c.phone) v.push('TEL;TYPE=CELL:' + c.phone);
    if (c.email) v.push('EMAIL:' + c.email);
    v.push('URL:' + location.origin + location.pathname, 'END:VCARD');
    return 'data:text/vcard;charset=utf-8,' + encodeURIComponent(v.join('\r\n'));
  }
  function contactBtns(P, t, cls) {
    var c = P.contact || {}, out = '';
    if (c.phone) out += '<a class="' + cls + '" href="tel:' + esc(String(c.phone).replace(/[^\d+]/g, '')) + '">' + icon('phone') + '<span>' + t.call + '</span></a>';
    if (c.email) out += '<a class="' + cls + '" href="mailto:' + esc(c.email) + '">' + icon('mail') + '<span>' + t.email + '</span></a>';
    if (c.phone || c.email) out += '<a class="' + cls + ' hl" href="' + vcard(P) + '" download="' + esc((P.name || 'contact').replace(/[^\w؀-ۿ -]/g, '')) + '.vcf">' + icon('save') + '<span>' + t.save + '</span></a>';
    return out;
  }
  function foot(P, i) {
    return '<footer class="t-foot' + rv(i) + '"><span class="m">' + esc((P.brand && P.brand !== 'MENEAM' ? P.brand : '') || CFG.brand || 'SoulID') + '</span><span>' + esc(P.tagline || 'tap · connect · share') + '</span></footer>';
  }
  function photo(P, cls) {
    return P.avatar ? '<img class="' + cls + '" src="' + esc(P.avatar) + '" alt="">' : '<span class="' + cls + ' t-ini">' + initials(P.name) + '</span>';
  }

  /* ================================================================ CLASSIC */
  function classic(P, t) {
    var i = 0, h = '';
    h += '<header class="c-hero' + rv(i++) + '"><div class="c-ring">' + photo(P, 'c-av') + '</div>' +
      '<h1 class="c-name" dir="auto">' + esc(P.name || 'Your Name') + '</h1>' +
      (P.status ? '<p class="c-role" dir="auto">' + esc(P.status) + '</p>' : '') +
      (P.bio ? '<p class="c-bio" dir="auto">' + rich(P.bio) + '</p>' : '') + '</header>';
    var pr = P.primary && P.primary.value ? P.primary : null;
    if (pr) {
      var pt = T[pr.type] || T.link;
      h += '<a class="c-cta' + rv(i++) + '" href="' + href(pr) + '" target="_blank" rel="noopener"><span class="c-cta-ic">' + icon(pr.type) + '</span>' +
        '<span class="c-tx"><b>' + esc(pr.label || pt.n) + '</b><small>' + esc(pr.sub || short(pr)) + '</small></span><span class="c-ar">→</span></a>';
    }
    var links = live(P.links);
    if (links.length) {
      h += '<h2 class="t-h' + rv(i++) + '">' + t.connect + '</h2><div class="c-links">';
      links.forEach(function (l) {
        var tt = T[l.type] || T.link;
        h += '<a class="c-row' + rv(i++) + ';--c:' + tt.g + '" href="' + href(l) + '" target="_blank" rel="noopener"><span class="c-ic">' + icon(l.type) + '</span>' +
          '<span class="c-tx"><b>' + esc(l.label || tt.n) + '</b><small dir="ltr">' + esc(short(l)) + '</small></span><span class="c-ar">↗</span></a>';
      });
      h += '</div>';
    }
    var pay = live(P.pay);
    if (pay.length) {
      h += '<h2 class="t-h' + rv(i++) + '">' + t.pay + '</h2><div class="c-pay">';
      pay.forEach(function (l) {
        var tt = T[l.type] || T.link;
        h += '<a class="c-pcard' + rv(i++) + ';--c:' + tt.g + '" href="' + href(l) + '" target="_blank" rel="noopener"><span class="c-ic">' + icon(l.type) + '</span><b>' + esc(l.label || tt.n) + '</b><small dir="ltr">' + esc(short(l)) + '</small></a>';
      });
      h += '</div>';
    }
    var cb = contactBtns(P, t, 'c-chip');
    if (cb) h += '<h2 class="t-h' + rv(i++) + '">' + t.contact + '</h2><div class="c-chips' + rv(i++) + '">' + cb + '</div>';
    return h + foot(P, i);
  }

  /* ================================================================= COUPLE */
  function couple(P, t, lg) {
    var C = P.couple || {}, i = 0, h = '';
    var a = C.a || '', b = C.b || '';
    var names = a && b ? '<span>' + esc(a) + '</span><em>&amp;</em><span>' + esc(b) + '</span>' : '<span>' + esc(a || b || P.name || 'You & Me') + '</span>';
    var future = C.since && new Date(C.since + 'T00:00:00') > new Date();
    h += '<header class="k-hero' + rv(i++) + '">' +
      '<div class="k-frame">' + (P.avatar ? '<img src="' + esc(P.avatar) + '" alt="">' : '<span class="k-noimg">' + icon('heart') + '</span>') + '<i class="k-beat">' + icon('heart') + '</i></div>' +
      '<h1 class="k-names" dir="auto">' + names + '</h1>' +
      (C.since ? '<p class="k-since">' + (future ? t.until : t.since) + ' <b>' + fmtDate(C.since, lg) + '</b>' + (C.place ? ' · ' + esc(C.place) : '') + '</p>' : (C.place ? '<p class="k-since">' + esc(C.place) + '</p>' : '')) +
      (P.bio ? '<p class="k-bio" dir="auto">' + rich(P.bio) + '</p>' : '') + '</header>';
    if (C.since) {
      h += '<section class="k-count' + rv(i++) + '" data-since="' + esc(C.since) + '">' +
        '<div class="k-big"><b data-k="total">0</b><span>' + (future ? t.daysLeft : t.daysTog) + '</span></div>' +
        '<div class="k-parts"><div><b data-k="y">0</b><span>' + t.y + '</span></div><div><b data-k="m">0</b><span>' + t.m + '</span></div><div><b data-k="d">0</b><span>' + t.d + '</span></div></div>' +
        '<div class="k-clock" dir="ltr" data-k="clock">00:00:00</div></section>';
    }
    if (C.song) {
      h += '<a class="k-song' + rv(i++) + '" href="' + esc(N.hrefFor('spotify', C.song)) + '" target="_blank" rel="noopener"><span class="k-vinyl"><i></i></span>' +
        '<span class="k-st"><small>' + t.song + '</small><b dir="auto">' + esc(C.songName || 'Play') + '</b></span><span class="eq"><i></i><i></i><i></i></span></a>';
    }
    if (C.message) {
      h += '<section class="k-letter-wrap' + rv(i++) + '"><button type="button" class="k-env" data-env aria-expanded="false"><span class="k-flap"></span><span class="k-seal">' + icon('heart') + '</span>' +
        '<span class="k-env-tx"><b>' + t.letter + '</b><small>' + t.open + '</small></span></button>' +
        '<div class="k-letter" dir="auto"><p>' + rich(C.message) + '</p>' + (a || b ? '<span class="k-sign">— ' + esc([a, b].filter(Boolean).join(' & ')) + '</span>' : '') + '</div></section>';
    }
    var st = (C.story || []).filter(function (s) { return s && (s.title || s.text); });
    if (st.length) {
      h += '<h2 class="t-h' + rv(i++) + '">' + t.story + '</h2><ol class="k-tl">';
      st.forEach(function (s) {
        h += '<li class="' + rv(i++).slice(1) + '"><span class="k-dot">' + icon('heart') + '</span>' + (s.date ? '<time dir="auto">' + esc(s.date) + '</time>' : '') +
          (s.title ? '<b dir="auto">' + esc(s.title) + '</b>' : '') + (s.text ? '<p dir="auto">' + rich(s.text) + '</p>' : '') + '</li>';
      });
      h += '</ol>';
    }
    var g = (P.gallery || []).filter(Boolean);
    if (g.length) {
      h += '<h2 class="t-h' + rv(i++) + '">' + t.moments + '</h2><div class="k-gal">';
      g.forEach(function (src, j) { h += '<button type="button" class="k-pol' + rv(i++) + ';--r:' + ((j % 2 ? 1 : -1) * (2 + (j % 3))) + 'deg" data-zoom="' + esc(src) + '"><img src="' + esc(src) + '" alt="" loading="lazy"></button>'; });
      h += '</div>';
    }
    var links = live(P.links);
    if (links.length) {
      h += '<h2 class="t-h' + rv(i++) + '">' + t.findUs + '</h2><div class="k-links' + rv(i++) + '">';
      links.forEach(function (l) { var tt = T[l.type] || T.link; h += '<a class="k-pill" style="--c:' + tt.g + '" href="' + href(l) + '" target="_blank" rel="noopener">' + icon(l.type) + '<span dir="' + (l.label ? 'auto' : 'ltr') + '">' + esc(l.label || short(l)) + '</span></a>'; });
      h += '</div>';
    }
    return h + foot(P, i);
  }
  function tick(root) {
    var box = root.querySelector('.k-count'); if (!box) return;
    var s = new Date(box.getAttribute('data-since') + 'T00:00:00'); if (isNaN(s)) return;
    function set(k, v) { var e = box.querySelector('[data-k="' + k + '"]'); if (e && e.textContent !== String(v)) e.textContent = v; }
    function run() {
      var now = new Date(), fut = s > now, A = fut ? now : s, B = fut ? s : now;
      var y = B.getFullYear() - A.getFullYear(), m = B.getMonth() - A.getMonth(), d = B.getDate() - A.getDate();
      if (d < 0) { m--; d += new Date(B.getFullYear(), B.getMonth(), 0).getDate(); }
      if (m < 0) { y--; m += 12; }
      var ms = B - A, total = Math.floor(ms / 864e5), r = Math.floor((ms % 864e5) / 1000);
      var p = function (n) { return (n < 10 ? '0' : '') + n; };
      set('total', total.toLocaleString('en-US')); set('y', y); set('m', m); set('d', d);
      set('clock', p(Math.floor(r / 3600)) + ':' + p(Math.floor(r / 60) % 60) + ':' + p(r % 60));
    }
    run(); clearInterval(tick._t); tick._t = setInterval(run, 1000);
  }

  /* =================================================================== GRAD */
  function grad(P, t) {
    var G = P.project || {}, i = 0, h = '';
    var kind = t.kinds[G.kind] || t.kinds.grad;
    var top = [G.uni, G.faculty].filter(Boolean).map(esc).join(' · ');
    h += '<div class="g-top' + rv(i++) + '">' + (top ? '<span class="g-uni" dir="auto">' + icon('uni') + top + '</span>' : '') +
      '<span class="g-badge">' + icon('cap') + kind + (G.year ? ' · ' + esc(G.year) : '') + '</span></div>';
    h += '<header class="g-hero' + rv(i++) + '">' + (P.avatar ? '<div class="g-cover"><img src="' + esc(P.avatar) + '" alt=""></div>' : '') +
      '<h1 class="g-title" dir="auto">' + esc(P.name || 'Project title') + '</h1>' + (P.status ? '<p class="g-sub" dir="auto">' + esc(P.status) + '</p>' : '') + '</header>';
    var meta = '';
    if (G.supervisor) meta += '<div class="g-meta"><span class="g-mi">' + icon('user') + '</span><small>' + t.sup + '</small><b dir="auto">' + esc(G.supervisor) + '</b></div>';
    if (G.date) meta += '<div class="g-meta"><span class="g-mi">' + icon('cal') + '</span><small>' + t.defense + '</small><b>' + fmtDate(G.date, lang(P)) + '</b></div>';
    if (meta) h += '<div class="g-metas' + rv(i++) + '">' + meta + '</div>';
    if (P.bio) {
      var long = String(P.bio).length > 320;
      h += '<section class="g-card' + rv(i++) + '"><h2 class="g-h">' + t.abstract + '</h2><div class="g-abs' + (long ? ' clamp' : '') + '" dir="auto">' + rich(P.bio) + '</div>' +
        (long ? '<button type="button" class="g-more" data-more data-l1="' + t.more + '" data-l2="' + t.less + '">' + t.more + '</button>' : '') + '</section>';
    }
    var kw = String(G.keywords || '').split(/[,،]/).map(function (s) { return s.trim(); }).filter(Boolean);
    if (kw.length) h += '<div class="g-kw' + rv(i++) + '">' + kw.map(function (w) { return '<span dir="auto">' + esc(w) + '</span>'; }).join('') + '</div>';
    var team = (G.team || []).filter(function (m) { return m && m.name; });
    if (team.length) {
      h += '<h2 class="t-h' + rv(i++) + '">' + t.team + '</h2><div class="g-team">';
      team.forEach(function (m) {
        var tag = m.link ? 'a' : 'div', at = m.link ? ' href="' + esc(N.hrefFor('linkedin', m.link)) + '" target="_blank" rel="noopener"' : '';
        h += '<' + tag + ' class="g-mem' + rv(i++) + ';--h:' + hue(m.name) + '"' + at + '><span class="g-ini">' + initials(m.name) + '</span><b dir="auto">' + esc(m.name) + '</b>' +
          (m.role ? '<small dir="auto">' + esc(m.role) + '</small>' : '') + (m.link ? '<i class="g-in">' + icon('linkedin') + '</i>' : '') + '</' + tag + '>';
      });
      h += '</div>';
    }
    var g = (P.gallery || []).filter(Boolean);
    if (g.length) {
      h += '<h2 class="t-h' + rv(i++) + '">' + t.gallery + '</h2><div class="g-gal' + rv(i++) + '">';
      g.forEach(function (src) { h += '<button type="button" class="g-shot" data-zoom="' + esc(src) + '"><img src="' + esc(src) + '" alt="" loading="lazy"></button>'; });
      h += '</div>';
    }
    var links = live(P.links);
    if (links.length) {
      h += '<h2 class="t-h' + rv(i++) + '">' + t.res + '</h2><div class="g-res">';
      links.forEach(function (l) {
        var tt = T[l.type] || T.link;
        h += '<a class="g-row' + rv(i++) + ';--c:' + tt.g + '" href="' + href(l) + '" target="_blank" rel="noopener"><span class="g-ric">' + icon(l.type) + '</span>' +
          '<span class="c-tx"><b>' + esc(l.label || tt.n) + '</b><small dir="ltr">' + esc(short(l)) + '</small></span><span class="c-ar">↗</span></a>';
      });
      h += '</div>';
    }
    var cb = contactBtns(P, t, 'g-chip');
    if (cb) h += '<h2 class="t-h' + rv(i++) + '">' + t.contact + '</h2><div class="g-chips' + rv(i++) + '">' + cb + '</div>';
    return h + foot(P, i);
  }

  /* ============================================================= public api */
  var R = { classic: classic, couple: couple, grad: grad };
  function render(P, el) {
    var tp = P.template, lg = lang(P), t = L[lg];
    el.setAttribute('dir', lg === 'ar' ? 'rtl' : 'ltr');
    el.innerHTML = R[tp](P, t, lg);
    var s = N.SKINS[P.skin] || N.SKINS[DEF_SKIN[tp]] || N.SKINS.aurora;
    N.applySkin(N.SKINS[P.skin] ? P.skin : DEF_SKIN[tp]);
    document.documentElement.style.setProperty('--c3', s[2]);
    if (tp === 'couple') tick(el);
  }
  var DEF_SKIN = { classic: 'aurora', couple: 'rose', grad: 'navy', dev: 'aurora' };
  function bg(tp) {
    var old = document.querySelector('.t-bg'); if (old) old.remove();
    if (!R[tp]) return;
    var d = document.createElement('div'); d.className = 't-bg t-bg-' + tp; d.setAttribute('aria-hidden', 'true');
    var h = '<b class="o1"></b><b class="o2"></b><b class="o3"></b>';
    if (tp === 'couple') for (var j = 0; j < 14; j++) {
      h += '<i style="--x:' + Math.round(Math.random() * 100) + '%;--s:' + (10 + Math.round(Math.random() * 16)) + 'px;--t:' + (9 + Math.random() * 9).toFixed(1) + 's;--dl:-' + (Math.random() * 18).toFixed(1) + 's">' + icon('heart') + '</i>';
    }
    d.innerHTML = h; document.body.insertBefore(d, document.body.firstChild);
  }

  /* shared interactions: envelope, read more, lightbox */
  document.addEventListener('click', function (e) {
    var env = e.target.closest && e.target.closest('[data-env]');
    if (env) { var w = env.parentNode, o = !w.classList.contains('open'); w.classList.toggle('open', o); env.setAttribute('aria-expanded', o); return; }
    var mo = e.target.closest && e.target.closest('[data-more]');
    if (mo) { var ab = mo.previousElementSibling, op = ab.classList.toggle('clamp'); mo.textContent = op ? mo.dataset.l1 : mo.dataset.l2; return; }
    var z = e.target.closest && e.target.closest('[data-zoom]');
    if (z) {
      var lb = document.createElement('div'); lb.className = 't-lb';
      lb.innerHTML = '<img src="' + esc(z.getAttribute('data-zoom')) + '" alt="">';
      lb.addEventListener('click', function () { lb.classList.add('out'); setTimeout(function () { lb.remove(); }, 250); });
      document.body.appendChild(lb); return;
    }
  });

  window.NFC_TPL = { render: render, bg: bg, has: function (tp) { return !!R[tp]; }, DEF_SKIN: DEF_SKIN,
    NAMES: { dev: 'مطوّر / برمجة', classic: 'كلاسيك', couple: 'كابلز', grad: 'مشروع تخرج / رسالة' } };
})();
