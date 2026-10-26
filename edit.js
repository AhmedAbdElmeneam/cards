/* NFC profile editor: form + live preview + save. Needs app.js loaded first. */
(function () {
  'use strict';
  var N = window.NFC, T = N.TYPES, esc = N.esc, Store = N.Store;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var P = null, slug = N.slugFromUrl(), dirty = false;

  var SOCIAL = ['instagram', 'tiktok', 'facebook', 'linkedin', 'github', 'telegram', 'x', 'youtube', 'snapchat', 'spotify', 'whatsapp', 'website', 'link'];
  var PAY = ['instapay', 'telda', 'link'];
  var PRIMARY = ['whatsapp', 'telegram', 'instagram', 'website', 'link'];
  var SKIN_NAMES = { aurora: 'أورورا', ocean: 'أوشن', sunset: 'سانست', lime: 'لايم', mono: 'مونو', rose: 'روز', navy: 'نيفي', gold: 'جولد' };
  var LINK_TYPES = {
    couple: ['instagram', 'tiktok', 'facebook', 'snapchat', 'whatsapp', 'spotify', 'youtube', 'website', 'link'],
    grad: ['demo', 'pdf', 'video', 'slides', 'github', 'website', 'youtube', 'linkedin', 'link']
  };
  /* label changes per template: element id -> text */
  var LABELS = {
    classic: { 'lb-status': 'شغلتك أو جملة قصيرة (اختياري)', 'h-gal': 'معرض صور (اختياري)' },
    couple: { 'h-photo': 'صورتكم', 'ph-hint': 'صورة واحدة ليكم مع بعض', 'h-bio': 'كلمة عنكم', 'lb-bio': 'جملة قصيرة تحت أساميكم (اختياري)', 'h-links': 'لينكاتكم', 'h-gal': 'صوركم' },
    grad: { 'h-photo': 'لوجو أو صورة المشروع', 'ph-hint': 'لوجو المشروع أو صورة غلاف', 'lb-name': 'عنوان المشروع', 'lb-status': 'سطر تحت العنوان (اختياري)',
      'h-bio': 'الملخص', 'lb-bio': 'ملخص المشروع (Abstract)', 'h-links': 'لينكات المشروع', 'h-gal': 'صور من المشروع' }
  };
  var DEFAULT_TEXT = {};
  function tpl() { return window.NFC_TPL && NFC_TPL.has(P.template) ? P.template : 'dev'; }
  function applyTplUI() {
    var tp = tpl();
    document.querySelectorAll('[data-only]').forEach(function (el) { el.hidden = el.dataset.only.split(' ').indexOf(tp) < 0; });
    var n = 0;
    document.querySelectorAll('.ed-form > .ed-card').forEach(function (c) { var sp = c.querySelector('h2 > span'); if (sp && !c.hidden) sp.textContent = ('0' + (++n)).slice(-2); });
    Object.keys(DEFAULT_TEXT).forEach(function (id) { document.getElementById(id).textContent = DEFAULT_TEXT[id]; });
    var map = LABELS[tp] || {};
    Object.keys(map).forEach(function (id) { var el = document.getElementById(id); if (!el) return; if (!(id in DEFAULT_TEXT)) DEFAULT_TEXT[id] = el.textContent; el.textContent = map[id]; });
    $('#pvbox').setAttribute('data-tpl', tp);
  }

  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function toast(msg, bad) {
    var t = $('#ed-toast'); t.textContent = msg; t.className = 'ed-toast show' + (bad ? ' bad' : '');
    clearTimeout(toast._t); toast._t = setTimeout(function () { t.className = 'ed-toast'; }, 2600);
  }
  function setDirty(v) {
    dirty = v; document.body.classList.toggle('is-dirty', v);
    document.querySelectorAll('.ed-save').forEach(function (b) { b.textContent = v ? 'احفظ التغييرات' : 'محفوظ ✓'; });
  }

  /* ------------------------------------------------------------ preview */
  var pvTimer;
  function preview() {
    clearTimeout(pvTimer);
    pvTimer = setTimeout(function () { N.render(P, $('#pv')); }, 90);
  }
  function changed() { setDirty(true); preview(); }

  /* ------------------------------------------------------------- fields */
  function bind(id, get, set) {
    var el = document.getElementById(id); el.value = get() || '';
    el.addEventListener('input', function () { set(el.value); changed(); });
  }
  function opts(list, cur) {
    return list.map(function (k) { return '<option value="' + k + '"' + (k === cur ? ' selected' : '') + '>' + T[k].n + '</option>'; }).join('');
  }

  function listEditor(boxId, key, types) {
    var box = document.getElementById(boxId);
    function draw() {
      var arr = P[key] || (P[key] = []);
      box.innerHTML = arr.map(function (l, i) {
        var t = T[l.type] || T.link;
        return '<div class="ed-row" data-i="' + i + '">' +
          '<span class="ed-ic" style="background:' + t.g + (t.ink ? ';color:' + t.ink : '') + '">' + N.icon(l.type) + '</span>' +
          '<select class="ed-in ed-type" id="' + key + '-type-' + i + '" aria-label="نوع اللينك">' + opts(types, l.type) + '</select>' +
          '<input class="ed-in ed-val" id="' + key + '-val-' + i + '" dir="ltr" placeholder="' + esc(t.ph) + '" value="' + esc(l.value) + '" aria-label="اللينك أو اليوزر">' +
          '<div class="ed-btns"><button type="button" class="ed-mini" data-act="up" aria-label="لفوق">↑</button><button type="button" class="ed-mini" data-act="down" aria-label="لتحت">↓</button><button type="button" class="ed-mini del" data-act="del" aria-label="امسح">✕</button></div>' +
          '<div class="ed-extra"><input class="ed-in ed-sm ed-lab" id="' + key + '-lab-' + i + '" placeholder="الاسم اللي يظهر (اختياري) · ' + esc(t.n) + '" value="' + esc(l.label || '') + '">' +
          '<input class="ed-in ed-sm ed-sb" id="' + key + '-sub-' + i + '" placeholder="السطر الصغير (اختياري)" value="' + esc(l.sub || '') + '"></div>' +
          '</div>';
      }).join('') || '<p class="ed-empty">مفيش لينكات لسه. دوس "ضيف لينك".</p>';
    }
    box.addEventListener('input', function (e) {
      var row = e.target.closest('.ed-row'); if (!row) return;
      var l = P[key][+row.dataset.i];
      if (e.target.classList.contains('ed-val')) l.value = e.target.value;
      if (e.target.classList.contains('ed-lab')) l.label = e.target.value;
      if (e.target.classList.contains('ed-sb')) l.sub = e.target.value;
      changed();
    });
    box.addEventListener('change', function (e) {
      if (!e.target.classList.contains('ed-type')) return;
      var row = e.target.closest('.ed-row'); P[key][+row.dataset.i].type = e.target.value; draw(); changed();
    });
    box.addEventListener('click', function (e) {
      var b = e.target.closest('[data-act]'); if (!b) return;
      var i = +b.closest('.ed-row').dataset.i, arr = P[key];
      if (b.dataset.act === 'del') arr.splice(i, 1);
      if (b.dataset.act === 'up' && i > 0) arr.splice(i - 1, 0, arr.splice(i, 1)[0]);
      if (b.dataset.act === 'down' && i < arr.length - 1) arr.splice(i + 1, 0, arr.splice(i, 1)[0]);
      draw(); changed();
    });
    document.querySelector('[data-add="' + key + '"]').addEventListener('click', function () {
      (P[key] = P[key] || []).push({ type: types[0], value: '' }); draw(); changed();
      var last = box.querySelector('.ed-row:last-child .ed-val'); if (last) last.focus();
    });
    draw();
  }

  /* ------------------------------------------ list of small objects (story, team) */
  function objList(boxId, getArr, fields, blank) {
    var box = document.getElementById(boxId);
    function draw() {
      var arr = getArr();
      box.innerHTML = arr.map(function (o, i) {
        return '<div class="ed-orow" data-i="' + i + '"><div class="ed-ofields">' + fields.map(function (f) {
          var v = esc(o[f.k] || ''), at = ' class="ed-in ed-sm" data-k="' + f.k + '" placeholder="' + esc(f.ph) + '" dir="' + (f.dir || 'auto') + '"';
          return f.area ? '<textarea' + at + ' rows="2">' + v + '</textarea>' : '<input' + at + ' value="' + v + '">';
        }).join('') + '</div><div class="ed-btns"><button type="button" class="ed-mini" data-act="up" aria-label="لفوق">↑</button><button type="button" class="ed-mini" data-act="down" aria-label="لتحت">↓</button><button type="button" class="ed-mini del" data-act="del" aria-label="امسح">✕</button></div></div>';
      }).join('') || '<p class="ed-empty">لسه مفيش حاجة هنا.</p>';
    }
    box.addEventListener('input', function (e) {
      var row = e.target.closest('.ed-orow'); if (!row || !e.target.dataset.k) return;
      getArr()[+row.dataset.i][e.target.dataset.k] = e.target.value; changed();
    });
    box.addEventListener('click', function (e) {
      var b = e.target.closest('[data-act]'); if (!b) return;
      var i = +b.closest('.ed-orow').dataset.i, arr = getArr();
      if (b.dataset.act === 'del') arr.splice(i, 1);
      if (b.dataset.act === 'up' && i > 0) arr.splice(i - 1, 0, arr.splice(i, 1)[0]);
      if (b.dataset.act === 'down' && i < arr.length - 1) arr.splice(i + 1, 0, arr.splice(i, 1)[0]);
      draw(); changed();
    });
    document.querySelector('[data-addo="' + boxId.replace('ed-', '') + '"]').addEventListener('click', function () {
      getArr().push(clone(blank)); draw(); changed();
      var last = box.querySelector('.ed-orow:last-child .ed-in'); if (last) last.focus();
    });
    draw();
  }

  /* ------------------------------------------------------------- gallery */
  var GAL_MAX = 6;
  function shrink(file, max, q) {
    return new Promise(function (res, rej) {
      var r = new FileReader();
      r.onload = function () {
        var im = new Image();
        im.onload = function () {
          var k = Math.min(1, max / Math.max(im.width, im.height)), c = document.createElement('canvas');
          c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
          c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); res(c.toDataURL('image/jpeg', q));
        };
        im.onerror = rej; im.src = r.result;
      };
      r.onerror = rej; r.readAsDataURL(file);
    });
  }
  function setupGallery() {
    var box = $('#ed-gal'), inp = $('#ed-galin');
    function draw() {
      var g = P.gallery || [];
      box.innerHTML = g.map(function (src, i) { return '<div class="ed-gi"><img src="' + esc(src) + '" alt=""><button type="button" class="ed-mini del" data-gdel="' + i + '" aria-label="امسح">✕</button></div>'; }).join('') ||
        '<p class="ed-empty">مفيش صور لسه.</p>';
    }
    box.addEventListener('click', function (e) { var b = e.target.closest('[data-gdel]'); if (!b) return; P.gallery.splice(+b.dataset.gdel, 1); draw(); changed(); });
    inp.addEventListener('change', function () {
      var files = [].slice.call(inp.files || []).filter(function (f) { return /^image\//.test(f.type); });
      P.gallery = P.gallery || [];
      var room = GAL_MAX - P.gallery.length;
      if (room <= 0) { toast('أقصى حاجة ' + GAL_MAX + ' صور. امسح صورة الأول', true); inp.value = ''; return; }
      if (files.length > room) toast('هتتضاف أول ' + room + ' صور بس', true);
      Promise.all(files.slice(0, room).map(function (f) { return shrink(f, 900, 0.76); })).then(function (list) {
        P.gallery = P.gallery.concat(list); draw(); changed(); inp.value = '';
      }, function () { toast('فيه صورة مش بتفتح، جرّب صورة تانية', true); inp.value = ''; });
    });
    draw();
  }

  /* --------------------------------------------------------------- photo */
  function setupPhoto() {
    var inp = $('#ed-photo'), img = $('#ed-avatar');
    function show() { img.innerHTML = P.avatar ? '<img src="' + esc(P.avatar) + '" alt="">' : '<span>' + esc((P.name || '?').charAt(0)) + '</span>'; }
    inp.addEventListener('change', function () {
      var f = inp.files && inp.files[0]; if (!f) return;
      if (!/^image\//.test(f.type)) { toast('اختار صورة (JPG أو PNG)', true); return; }
      var r = new FileReader();
      r.onload = function () {
        var im = new Image();
        im.onload = function () {
          var S = 420, c = document.createElement('canvas'); c.width = c.height = S;
          var s = Math.min(im.width, im.height), sx = (im.width - s) / 2, sy = (im.height - s) / 2.6;
          c.getContext('2d').drawImage(im, sx, Math.max(0, sy), s, s, 0, 0, S, S);
          P.avatar = c.toDataURL('image/jpeg', 0.84); show(); changed(); inp.value = '';
        };
        im.onerror = function () { toast('الصورة دي مش بتفتح، جرّب صورة تانية', true); };
        im.src = r.result;
      };
      r.readAsDataURL(f);
    });
    $('#ed-photo-del').addEventListener('click', function () { P.avatar = ''; show(); changed(); });
    show();
  }

  /* -------------------------------------------------------------- skins */
  function setupSkins() {
    var box = $('#ed-skins');
    box.innerHTML = Object.keys(N.SKINS).map(function (k) {
      var c = N.SKINS[k];
      return '<button type="button" class="ed-skin' + ((P.skin || (window.NFC_TPL && NFC_TPL.DEF_SKIN[tpl()]) || 'aurora') === k ? ' on' : '') + '" data-skin="' + k + '"><i style="background:linear-gradient(110deg,' + c[0] + ',' + c[1] + ' 50%,' + c[2] + ')"></i>' + SKIN_NAMES[k] + '</button>';
    }).join('');
    box.addEventListener('click', function (e) {
      var b = e.target.closest('[data-skin]'); if (!b) return;
      P.skin = b.dataset.skin; box.querySelectorAll('.ed-skin').forEach(function (x) { x.classList.toggle('on', x === b); }); changed();
    });
  }

  /* ---------------------------------------------------------------- form */
  function buildForm() {
    P.primary = P.primary || { type: 'whatsapp', value: '' };
    P.contact = P.contact || {};
    bind('f-name', function () { return P.name; }, function (v) { P.name = v; });
    bind('f-status', function () { return P.status; }, function (v) { P.status = v; });
    bind('f-bio', function () { return P.bio; }, function (v) { P.bio = v; });
    bind('f-term', function () { return P.terminal; }, function (v) { P.terminal = v; });
    var pt = $('#f-ptype'); pt.innerHTML = opts(PRIMARY, P.primary.type);
    pt.addEventListener('change', function () { P.primary.type = pt.value; $('#f-pval').placeholder = T[pt.value].ph; changed(); });
    bind('f-pval', function () { return P.primary.value; }, function (v) { P.primary.value = v; });
    $('#f-pval').placeholder = T[P.primary.type].ph;
    bind('f-plab', function () { return P.primary.label; }, function (v) { P.primary.label = v; });
    bind('f-psub', function () { return P.primary.sub; }, function (v) { P.primary.sub = v; });
    bind('f-phone', function () { return P.contact.phone; }, function (v) { P.contact.phone = v; });
    bind('f-email', function () { return P.contact.email; }, function (v) { P.contact.email = v; });
    bind('f-brand', function () { return P.brand; }, function (v) { P.brand = v; });
    bind('f-tag', function () { return P.tagline; }, function (v) { P.tagline = v; });
    var tp = tpl();
    listEditor('ed-links', 'links', LINK_TYPES[tp] || SOCIAL);
    listEditor('ed-pay', 'pay', PAY);
    setupPhoto(); setupSkins(); setupGallery();
    if (tp !== 'dev') {
      var lg = $('#f-lang'); lg.value = P.lang === 'ar' ? 'ar' : 'en';
      lg.addEventListener('change', function () { P.lang = lg.value; changed(); });
    }
    if (tp === 'couple') {
      var C = P.couple = P.couple || {};
      C.story = C.story || [];
      var nm = function () { P.name = C.a && C.b ? C.a + ' & ' + C.b : (C.a || C.b || ''); };
      bind('f-ca', function () { return C.a; }, function (v) { C.a = v; nm(); });
      bind('f-cb', function () { return C.b; }, function (v) { C.b = v; nm(); });
      bind('f-since', function () { return C.since; }, function (v) { C.since = v; });
      bind('f-place', function () { return C.place; }, function (v) { C.place = v; });
      bind('f-song', function () { return C.song; }, function (v) { C.song = v; });
      bind('f-songname', function () { return C.songName; }, function (v) { C.songName = v; });
      bind('f-msg', function () { return C.message; }, function (v) { C.message = v; });
      objList('ed-story', function () { return C.story; }, [{ k: 'date', ph: 'التاريخ · مثلاً 14 Feb 2022' }, { k: 'title', ph: 'العنوان · أول مرة اتقابلنا' }, { k: 'text', ph: 'كلمتين عن اللحظة دي (اختياري)', area: true }], { date: '', title: '', text: '' });
    }
    if (tp === 'grad') {
      var G = P.project = P.project || {};
      G.team = G.team || []; G.kind = G.kind || 'grad';
      var kd = $('#f-kind'); kd.value = G.kind; kd.addEventListener('change', function () { G.kind = kd.value; changed(); });
      bind('f-year', function () { return G.year; }, function (v) { G.year = v; });
      bind('f-uni', function () { return G.uni; }, function (v) { G.uni = v; });
      bind('f-fac', function () { return G.faculty; }, function (v) { G.faculty = v; });
      bind('f-sup', function () { return G.supervisor; }, function (v) { G.supervisor = v; });
      bind('f-ddate', function () { return G.date; }, function (v) { G.date = v; });
      bind('f-keys', function () { return G.keywords; }, function (v) { G.keywords = v; });
      objList('ed-team', function () { return G.team; }, [{ k: 'name', ph: 'الاسم' }, { k: 'role', ph: 'الدور · مثلاً Flutter Developer' }, { k: 'link', ph: 'لينك LinkedIn (اختياري)', dir: 'ltr' }], { name: '', role: '', link: '' });
    }
  }

  /* ---------------------------------------------------------------- save */
  function save() {
    if (Store.mode === 'cloud' && !(Store.auth && Store.auth.currentUser)) { toast('افتح الصفحة من لينك التعديل بتاعك تاني', true); return; }
    var bad = (P.links || []).concat(P.pay || []).filter(function (l) { return l.value && N.hrefFor(l.type, l.value) === '#'; });
    if (bad.length) { toast('فيه لينك مش مظبوط: ' + (bad[0].label || T[bad[0].type].n), true); return; }
    if (JSON.stringify(P).length > 950000) { toast('الصور كتير أوي على الصفحة. امسح صورة أو اتنين وجرّب تاني', true); return; }
    document.querySelectorAll('.ed-save').forEach(function (b) { b.disabled = true; b.textContent = 'بيتحفظ…'; });
    Store.save(slug, P).then(function () {
      setDirty(false); toast(Store.mode === 'cloud' ? 'اتحفظ. الكارت بيفتح على النسخة الجديدة دلوقتي' : 'اتحفظ على الجهاز ده (وضع تجريبي)');
    }, function (e) {
      setDirty(true); toast(/permission/i.test(e && e.message) ? 'الحساب ده مش مسموحله يعدّل الصفحة دي' : (e && e.message) || 'محصلش حفظ، جرّب تاني', true);
    }).then(function () { document.querySelectorAll('.ed-save').forEach(function (b) { b.disabled = false; }); });
  }

  /* --------------------------------------------------------------- start */
  function startEditor(data) {
    P = data ? clone(data) : clone(N.DEFAULT);
    $('#ed-app').hidden = false; $('#ed-lock').hidden = true;
    $('#ed-mode').textContent = Store.mode === 'cloud' ? 'أونلاين · ' + slug : 'وضع تجريبي · بيتحفظ على الجهاز ده بس';
    $('#ed-mode').classList.toggle('cloud', Store.mode === 'cloud');
    $('#ed-note').textContent = $('#ed-mode').textContent; $('#ed-note').classList.toggle('cloud', Store.mode === 'cloud');
    $('#ed-view').href = (Store.mode === 'cloud' ? (N.CFG.siteUrl ? './' + encodeURIComponent(slug) : 'index.html?u=' + encodeURIComponent(slug)) : 'index.html');
    applyTplUI(); buildForm(); N.render(P, $('#pv')); setDirty(false);
    if (window.NFC_TPL && NFC_TPL.NAMES[tpl()]) $('#ed-mode').textContent += ' · ' + NFC_TPL.NAMES[tpl()];
  }

  function boot() {
    document.querySelectorAll('.ed-save').forEach(function (b) { b.addEventListener('click', save); });
    $('#ed-reset').addEventListener('click', function () {
      var b = $('#ed-reset');
      if (!b.classList.contains('confirm')) { b.classList.add('confirm'); b.textContent = 'متأكد؟ دوس تاني'; setTimeout(function () { b.classList.remove('confirm'); b.textContent = 'رجّع الأصل'; }, 3000); return; }
      dirty = false;
      if (Store.mode !== 'cloud') { try { localStorage.removeItem(Store.key(slug)); } catch (x) {} }
      location.reload();
    });
    document.querySelectorAll('[data-tab]').forEach(function (b) {
      b.addEventListener('click', function () { document.body.dataset.tab = b.dataset.tab; document.querySelectorAll('[data-tab]').forEach(function (x) { x.classList.toggle('on', x === b); }); });
    });
    window.addEventListener('beforeunload', function (e) { if (dirty) { e.preventDefault(); e.returnValue = ''; } });

    var code = readCode();
    if (!code) { locked('افتح صفحة التعديل من اللينك الخاص بيك. اللينك فيه كود في آخره.'); return; }
    Store.init().then(function () {
      if (Store.mode !== 'cloud') {
        if (N.CFG.firebase) { locked('مقدرناش نوصل للسيرفر. اتأكد من النت وجرّب تاني.'); return; }
        if (norm(code) !== norm(N.CFG.demoKey)) { locked(); return; }
        Store.get(slug).then(startEditor);
        return;
      }
      Store.claim(code).then(function (s) { slug = s; return Store.get(s).then(startEditor); })
        .catch(function () { locked(); });
    });
  }
  function norm(c) { return String(c || '').toUpperCase().replace(/[^A-Z0-9]/g, ''); }
  function readCode() {
    var q = new URLSearchParams(location.search).get('k');
    var h = location.hash.replace(/^#/, '');
    var c = (q || h || '').trim();
    return /^[A-Za-z0-9-]{8,40}$/.test(c) ? c.toUpperCase() : '';
  }
  function locked(msg) {
    $('#ed-app').hidden = true; $('#ed-lock').hidden = false;
    if (msg) $('#lock-msg').textContent = msg;
  }
  boot();
})();
