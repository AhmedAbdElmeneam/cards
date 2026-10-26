/* Seller dashboard: create a customer (fresh random edit code each time), list customers, copy links, replace or cancel a code.
   Needs app.js + Firebase. Only the owner's Google account can write (enforced by firestore.rules). */
(function () {
  'use strict';
  var N = window.NFC, esc = N.esc, Store = N.Store, CFG = N.CFG;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var db, auth, rows = [];
  var BASE = (CFG.siteUrl || (location.origin + location.pathname.replace(/[^/]*$/, ''))).replace(/\/?$/, '/');
  var ALPHA = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

  function toast(msg, bad) {
    var t = $('#cp-toast'); t.textContent = msg; t.className = 'ed-toast show' + (bad ? ' bad' : '');
    clearTimeout(toast._t); toast._t = setTimeout(function () { t.className = 'ed-toast'; }, 2800);
  }
  function newCode() {
    var a = new Uint32Array(12), s = '';
    crypto.getRandomValues(a);
    for (var i = 0; i < 12; i++) { s += ALPHA[a[i] % ALPHA.length]; if (i === 3 || i === 7) s += '-'; }
    return s;
  }
  function cardUrl(slug) { return CFG.siteUrl ? BASE + encodeURIComponent(slug) : BASE + '?u=' + encodeURIComponent(slug); }
  function editUrl(code) { return BASE + (CFG.siteUrl ? 'edit?k=' : 'edit.html?k=') + code; }
  function slugify(s) {
    return String(s || '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 30);
  }
  function copy(text, btn) {
    function ok() { if (btn) { var o = btn.textContent; btn.textContent = 'اتنسخ ✓'; setTimeout(function () { btn.textContent = o; }, 1400); } }
    try { navigator.clipboard.writeText(text).then(ok, fb); } catch (e) { fb(); }
    function fb() { var ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); ok(); } catch (x) { toast('انسخه يدوي', true); } document.body.removeChild(ta); }
  }
  function message(name, slug, code) {
    return 'أهلاً ' + (name || '') + ' 👋\n' +
      'كارتك جاهز! أي حد يلمس الكارت هيفتح صفحتك:\n' + cardUrl(slug) + '\n\n' +
      'ولينك تعديل صفحتك (خليه معاك ومتبعتهوش لحد):\n' + editUrl(code);
  }

  /* --------------------------------------------------------------- create */
  function freeCode() {
    var c = newCode();
    return db.collection('keys').doc(c).get().then(function (d) { return d.exists ? freeCode() : c; });
  }
  function create(e) {
    e.preventDefault();
    var name = $('#n-name').value.trim(), slug = slugify($('#n-slug').value || name), err = $('#n-err');
    err.textContent = '';
    if (!name) { err.textContent = 'اكتب اسم العميل'; return; }
    if (slug.length < 3) { err.textContent = 'الرابط لازم يكون 3 حروف إنجليزي على الأقل، زي mona'; return; }
    var btn = $('#n-go'); btn.disabled = true; btn.textContent = 'بيتعمل…';
    var code;
    db.collection('profiles').doc(slug).get().then(function (p) {
      if (p.exists || rows.some(function (r) { return r.slug === slug; })) throw new Error('taken');
      return freeCode();
    }).then(function (c) {
      code = c;
      var batch = db.batch(), ts = firebase.firestore.FieldValue.serverTimestamp();
      batch.set(db.collection('keys').doc(code), { slug: slug, name: name, createdAt: ts });
      batch.set(db.collection('profiles').doc(slug), { name: name, brand: CFG.brand || '', skin: 'aurora', tagline: 'tap · connect · build', links: [], pay: [], contact: {}, createdAt: ts });
      return batch.commit();
    }).then(function () {
      showResult(name, slug, code);
      $('#n-form').reset(); $('#n-slug').dataset.touched = '';
      load();
    }).catch(function (x) {
      err.textContent = x.message === 'taken' ? 'الرابط "' + slug + '" مستخدم قبل كده، اختار غيره' :
        (/permission/i.test(x.code || x.message) ? 'الحساب ده مش مسموحله يضيف عملاء' : 'محصلش، جرّب تاني');
    }).then(function () { btn.disabled = false; btn.textContent = 'اعمل عميل جديد'; });
  }
  function showResult(name, slug, code) {
    var box = $('#n-result');
    box.innerHTML =
      '<div class="cp-ok">✓ اتعمل ' + esc(name) + ' بكود جديد</div>' +
      linkRow('اكتب ده على الكارت', cardUrl(slug)) +
      linkRow('ابعت ده للعميل بس (لينك التعديل)', editUrl(code)) +
      '<button type="button" class="ed-btn primary cp-msg">انسخ رسالة جاهزة للعميل</button>';
    box.hidden = false;
    box.querySelector('.cp-msg').addEventListener('click', function (e) { copy(message(name, slug, code), e.currentTarget); });
  }
  function linkRow(label, url) {
    return '<div class="cp-link"><small>' + esc(label) + '</small><div><code dir="ltr">' + esc(url) + '</code><button type="button" class="ed-mini cp-cp" data-copy-text="' + esc(url) + '">نسخ</button></div></div>';
  }

  /* ----------------------------------------------------------------- list */
  function load() {
    // Customers = every profile (so a customer whose code was cancelled still shows up and can be deleted)
    return Promise.all([db.collection('profiles').get(), db.collection('keys').get()]).then(function (res) {
      var keys = {};
      res[1].docs.forEach(function (d) { var x = d.data(); (keys[x.slug] = keys[x.slug] || []).push({ code: d.id, at: x.createdAt ? x.createdAt.toMillis() : 0, name: x.name }); });
      rows = res[0].docs.map(function (d) {
        var x = d.data(), k = (keys[d.id] || []).sort(function (a, b) { return b.at - a.at; });
        return { slug: d.id, name: x.name || (k[0] && k[0].name) || d.id, code: k[0] ? k[0].code : '', codes: k.map(function (y) { return y.code; }),
                 at: x.createdAt && x.createdAt.toMillis ? x.createdAt.toMillis() : (k[0] ? k[0].at : 0) };
      }).sort(function (a, b) { return b.at - a.at; });
      draw();
    }).catch(function () { $('#cp-list').innerHTML = '<p class="ed-empty">مقدرتش أجيب العملاء</p>'; });
  }
  function draw() {
    var f = ($('#cp-search').value || '').toLowerCase().trim();
    var list = rows.filter(function (r) { return !f || (r.name + ' ' + r.slug).toLowerCase().indexOf(f) > -1; });
    $('#cp-count').textContent = rows.length;
    $('#cp-list').innerHTML = list.map(function (r) {
      var has = !!r.code;
      return '<div class="cp-row" data-slug="' + esc(r.slug) + '">' +
        '<div class="cp-who"><b>' + esc(r.name) + '</b><span dir="ltr">/' + esc(r.slug) + '</span></div>' +
        '<div class="cp-code" dir="ltr">' + (has ? esc(r.code.slice(0, 4)) + '-••••-••••' : 'no code') + '</div>' +
        '<div class="cp-acts">' +
        '<button type="button" class="ed-mini wide" data-act="card">لينك الكارت</button>' +
        (has ? '<button type="button" class="ed-mini wide" data-act="edit">لينك التعديل</button>' +
               '<button type="button" class="ed-mini wide" data-act="msg">الرسالة</button>' : '') +
        '<button type="button" class="ed-mini wide" data-act="rotate">كود جديد</button>' +
        (has ? '<button type="button" class="ed-mini wide del" data-act="revoke">إلغاء الكود</button>' : '') +
        '<button type="button" class="ed-mini wide del cp-del" data-act="delete">حذف العميل</button>' +
        '</div></div>';
    }).join('') || '<p class="ed-empty">' + (rows.length ? 'مفيش نتايج' : 'لسه مفيش عملاء. اعمل أول واحد من فوق.') + '</p>';
  }
  // Deletes the profile (with its photo), every edit code and every browser session of this customer.
  function removeCustomer(r) {
    return db.collection('sessions').where('slug', '==', r.slug).get().then(function (q) {
      var refs = q.docs.map(function (d) { return d.ref; });
      r.codes.forEach(function (c) { refs.push(db.collection('keys').doc(c)); });
      refs.push(db.collection('profiles').doc(r.slug));
      var chain = Promise.resolve();
      for (var i = 0; i < refs.length; i += 450) (function (part) {
        chain = chain.then(function () { var b = db.batch(); part.forEach(function (x) { b.delete(x); }); return b.commit(); });
      })(refs.slice(i, i + 450));
      return chain;
    });
  }
  function onListClick(e) {
    var b = e.target.closest('[data-act]'); if (!b) return;
    var r = rows.filter(function (x) { return x.slug === b.closest('.cp-row').dataset.slug; })[0]; if (!r) return;
    var act = b.dataset.act;
    if (act === 'card') return copy(cardUrl(r.slug), b);
    if (act === 'edit') return copy(editUrl(r.code), b);
    if (act === 'msg') return copy(message(r.name, r.slug, r.code), b);
    if (!b.classList.contains('confirm')) {
      var o = b.textContent; b.classList.add('confirm');
      b.textContent = act === 'delete' ? 'هيتمسح نهائياً، دوس تاني' : 'متأكد؟';
      setTimeout(function () { b.classList.remove('confirm'); b.textContent = o; }, act === 'delete' ? 4000 : 3000); return;
    }
    b.disabled = true;
    if (act === 'delete') {
      removeCustomer(r).then(function () { toast('اتمسح ' + r.name + ' وكل بياناته'); $('#n-result').hidden = true; load(); },
        function () { toast('محصلش الحذف، جرّب تاني', true); b.disabled = false; });
    }
    if (act === 'revoke') {
      db.collection('keys').doc(r.code).delete().then(function () { toast('اتلغى. لينك التعديل القديم بطّل يشتغل، وصفحة الكارت لسه شغالة'); load(); }, function () { toast('محصلش', true); b.disabled = false; });
    }
    if (act === 'rotate') {
      freeCode().then(function (c) {
        var batch = db.batch();
        batch.set(db.collection('keys').doc(c), { slug: r.slug, name: r.name, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
        r.codes.forEach(function (old) { batch.delete(db.collection('keys').doc(old)); });
        return batch.commit().then(function () { return c; });
      }).then(function (c) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        showResult(r.name, r.slug, c); toast('اتعمل كود جديد، والقديم بطّل يشتغل'); load();
      }, function () { toast('محصلش', true); b.disabled = false; });
    }
  }

  /* ----------------------------------------------------------------- boot */
  function boot() {
    $('#n-name').addEventListener('input', function () { if (!$('#n-slug').dataset.touched) $('#n-slug').value = slugify($('#n-name').value); });
    $('#n-slug').addEventListener('input', function () { $('#n-slug').dataset.touched = '1'; });
    $('#n-form').addEventListener('submit', create);
    $('#cp-search').addEventListener('input', draw);
    $('#cp-list').addEventListener('click', onListClick);
    document.addEventListener('click', function (e) { var b = e.target.closest('.cp-cp'); if (b) copy(b.dataset.copyText, b); });

    Store.init().then(function () {
      if (Store.mode !== 'cloud') { $('#cp-login').hidden = false; $('#cp-login-msg').textContent = 'صفحة التحكم محتاجة Firebase متوصل في config.js.'; $('#cp-google').hidden = true; return; }
      db = Store.db; auth = Store.auth;
      $('#cp-google').addEventListener('click', function () {
        var p = new firebase.auth.GoogleAuthProvider(); p.setCustomParameters({ prompt: 'select_account' });
        auth.signInWithPopup(p).catch(function (x) {
          if (/popup/i.test(x.code || '')) return auth.signInWithRedirect(p);
          $('#cp-login-msg').textContent = 'محصلش دخول، جرّب تاني';
        });
      });
      $('#cp-out').addEventListener('click', function () { auth.signOut(); });
      auth.onAuthStateChanged(function (u) {
        if (!u || u.isAnonymous) { $('#cp-app').hidden = true; $('#cp-login').hidden = false; return; }
        $('#cp-user').textContent = u.email || '';
        // Probe: only the owner can list keys
        db.collection('keys').limit(1).get().then(function () {
          $('#cp-login').hidden = true; $('#cp-app').hidden = false; load();
        }, function () {
          $('#cp-login-msg').textContent = 'الحساب ' + (u.email || '') + ' مش مسموحله يدخل هنا.';
          auth.signOut();
        });
      });
    });
  }
  boot();
})();
