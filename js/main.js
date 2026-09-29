/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'veterinari-gregorio-guelfi',
    whatsapp: {
      number: '', // WhatsApp non dichiarato: si chiama (02 471816) o si scrive (l'e-mail del biglietto)
      message: '',
      ids: [],
    },
    /* il loro biglietto = Google (29/9/2026): lunedì–venerdì 9:30–19:30, sabato 9:30–18, domenica chiuso */
    hours: {
      0: [],
      1: [['09:30', '19:30']],
      2: [['09:30', '19:30']],
      3: [['09:30', '19:30']],
      4: [['09:30', '19:30']],
      5: [['09:30', '19:30']],
      6: [['09:30', '18:00']],
    },
    hoursStatusId: 'orarioStato',
    hoursTableSelector: '[data-day]',
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 1800,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 1040,
    EN: {
      "m.salta": "Skip to the content",
      "m.top": "Gregorio-Guelfi veterinary practice: back to the top",
      "m.sotto": "Veterinary practice",
      "m.nav": "The sections",
      "m.lingua": "Language",
      "m.menu": "Open the menu",
      "m.ingrandisci": "Enlarge the photo",
      "m.lightbox": "Enlarged photo",
      "m.chiudi": "Close",
      "n.appuntamento": "By appointment",
      "n.studio": "The practice",
      "n.pazienti": "The patients",
      "n.dicono": "Reviews",
      "n.dove": "Where",
      "n.doveDomande": "Where and questions",
      "t.chiama": "Call",
      "h.sopra": "Veterinary practice · Via Giambellino 67, Milan",
      "h.titolo": "I love that they call your four-legged friend <span class=\"per-nome\">by name</span>.",
      "h.chi": "Paola Di Palma, in a review on Google («Trovo fantastico che chiamino il tuo amico a quattro zampe per nome.»)",
      "h.testo": "The joint practice of Dr M. Gregorio and Dr B. Guelfi, in the Giambellino: dogs and cats, by appointment, Monday to Saturday.",
      "h.voto": "229 reviews on Google",
      "h.chiama": "Call for an appointment",
      "h.indicazioni": "Directions",
      "a.studio": "A white and brown dog on a lead on the practice’s tiled floor; through the door, the waiting room with yellow walls and orange chairs.",
      "c.studio": "A patient at the practice. Behind, the yellow waiting room.",
      "md.lista": "The tags with the patients’ names",
      "md.nota": "The names are those of the animals that clients mention in their reviews.",
      "md.chiama": "Call them by name",
      "p.etichetta": "By appointment",
      "p.titolo": "You call, and you book the day",
      "p.biglietto": "Their business card, remade exactly (in Italian): there’s a photo of it on the Google listing.",
      "p.testo": "The practice only sees patients by appointment: you call during opening hours, Monday to Saturday, and book the day. There’s also the email address on the card.",
      "p.cap": "Opening hours",
      "p.scrivi": "Write",
      "p.urgenza": "<b>If it’s urgent</b>, call +39 02 471816 straight away during opening hours.",
      "g.lun": "Monday",
      "g.mar": "Tuesday",
      "g.mer": "Wednesday",
      "g.gio": "Thursday",
      "g.ven": "Friday",
      "g.sab": "Saturday",
      "g.dom": "Sunday",
      "g.chiuso": "closed",
      "s.etichetta": "The practice",
      "s.titolo": "Some people have been coming for twenty years",
      "s.testo": "It’s the joint practice of Dr M. Gregorio and Dr B. Guelfi, at Via Giambellino 67. They see dogs and cats, by appointment, every day except Sunday.",
      "s.testo2": "In the 229 reviews on Google, clients talk about the vets in the plural, write their animal’s name and count the years: ten, fifteen, twenty.",
      "s.intro": "What clients tell:",
      "s.r1": "a puppy first brought in at two months old, and looked after ever since;",
      "s.r2": "an emergency handled calmly, for the cat and for the person with it;",
      "s.r3": "blood tests done on the spot, when needed;",
      "s.r4": "two dachshunds operated on, successfully;",
      "s.r5": "a wary dog who lets them do anything;",
      "s.r6": "and the end: an old animal accompanied with respect.",
      "z.etichetta": "The patients",
      "z.titolo": "Dogs and cats, at home",
      "a.p1": "A white chihuahua in its bed, among its soft toys.",
      "c.p1": "In bed, with the toys",
      "a.p2": "A white and grey cat with blue eyes, up close, with cornflowers behind.",
      "c.p2": "The blue eyes",
      "a.p3": "A black and white chihuahua with a red harness, lying on a green towel at the beach.",
      "c.p3": "On holiday, at the seaside",
      "a.p4": "Two cats at a window with a wrought-iron grille, one white and one cream, seen from behind.",
      "c.p4": "Two of them, at the window",
      "z.nota": "The photos are the clients’: they left them on the practice’s Google listing.",
      "d.etichetta": "Reviews",
      "d.titolo": "With the name, in the reviews",
      "d.voto": "on Google, 229 reviews",
      "d.a4": "Google, 4 years ago",
      "d.a3": "Google, 3 years ago",
      "d.a8": "Google, 8 years ago",
      "d.a2": "Google, 2 years ago",
      "d.a1": "Google, a year ago",
      "d.nota": "From the reviews on Google, as they were written (in Italian, one in English); cuts are marked […]. The sentence at the top of the page is from another client.",
      "d.tutte": "All the reviews on Google",
      "o.etichetta": "Where",
      "o.titolo": "Via Giambellino 67",
      "o.dove": "Via Giambellino 67, 20146 Milan. The <b>Via Brunelleschi</b> tram and bus stops are 50 metres away; <b>M4 Frattini</b> is 350 metres away.",
      "o.mappa": "Map: Gregorio-Guelfi veterinary practice, Via Giambellino 67, Milan",
      "q.etichetta": "Questions",
      "q.titolo": "Before you call",
      "q.1": "How do I book an appointment?",
      "q.1r": "By calling +39 02 471816 during opening hours, or by writing to ambru25@virgilio.it. Patients are seen by appointment only.",
      "q.2": "When are you open?",
      "q.2r": "Monday to Friday from 9:30 am to 7:30 pm, Saturday from 9:30 am to 6 pm. We are closed on Sundays.",
      "q.3": "What if it’s urgent?",
      "q.3r": "During opening hours, call +39 02 471816 straight away.",
      "q.4": "Which animals do you see?",
      "q.4r": "Dogs and cats: from puppies to old animals.",
      "q.5": "Where are you?",
      "q.5r": "At Via Giambellino 67, Milan: the Via Brunelleschi stops are 50 metres away, M4 Frattini 350 metres.",
      "f.sotto": "Veterinary practice · Dr M. Gregorio · Dr B. Guelfi",
      "f.orario": "Monday–Friday 9:30 am–7:30 pm, Saturday 9:30 am–6 pm · by appointment only",
      "f.cred": "Demo website made by <a href=\"https://bespokestud.io\" rel=\"noopener\">Bespoke Studio</a> · the photos are the clients’, from the Google listing (a brand’s lettering on the doormat covered); hours and reviews from Google (September 2026). We drew the tags ourselves, with the names clients write in their reviews.",
      "f.su": "Back to the top ↑"
    },
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */

  /* ══════════ STUDIO VETERINARIO GREGORIO-GUELFI — «Trovo fantastico che chiamino il tuo amico a quattro zampe per nome.» ══════════
     La pagina è il loro biglietto (il blu, la croce, «si riceve solo su appuntamento») e la loro sala d'attesa gialla.
     la FIRMA — le medagliette sui ganci: dodici medagliette coi nomi che i clienti scrivono nelle recensioni cadono una alla volta sul
     loro gancio, oscillano (un pendolo smorzato) e si fermano; poi il nome si incide (una punta di luce scorre sulla scritta). Col
     mouse sopra una medaglietta, oscilla. «Chiamali per nome»: si muovono una dopo l'altra, come chiamate, e il lettore di schermo
     legge i nomi. Stato finale = l'HTML/SVG (ferme, incise). Senza JS: lo stato finale, il bottone nascosto (col suo posto). Con
     reduced-motion: lo stato finale subito, e «Chiamali per nome» legge i nomi senza muovere niente. L'attesa è la classe
     firma-attesa dell'head (i ganci vuoti, via CSS, solo dentro .ganci), tolta dall'head dopo 2,5 s se il codice non arriva. Un rAF a
     tempo: la firma non dipende da GSAP. I dati vengono da _ggu_firma.mjs. */
  var DATI = {"nomi":["Billy","Naki","Snoopy","Tabata","Merlino","Zeus","Caramella","Alice","Laika","Alcor","Rufus","Pace"],"tempi":{"inizio":200,"passo":140,"caduta":380,"alto":70,"ampiezza":13,"periodo":820,"smorza":520,"oscilla":1900,"incisione":440,"ritardoIncisione":110,"fine":4080},"chiama":{"passo":170,"ampiezza":11,"oscilla":1600,"fine":3530}};
  var prendi = function (id) { return document.getElementById(id); };
  var figuraG = prendi('medagliette'), listaG = prendi('ganci'), chiamaB = prendi('ganciChiama'), leggiG = prendi('ganciLeggi');
  var MED = listaG ? [].slice.call(listaG.querySelectorAll('.medaglietta')) : [];
  var TG = DATI.tempi, CG = DATI.chiama;
  var faseG = 'fatta', modoG = '', rafG = 0, guardiaG = 0, larghezzaAvvioG = 0, corseG = 0, oraG = 0, fineG = 0;
  var pezzi = MED.map(function (el) {
    var testo = el.querySelector('.med__nome');
    return { el: el, clip: el.querySelector('.med__taglio'), punta: el.querySelector('.med__punta'), testo: testo, x0: 0, x1: 100, misurato: false, impulsi: [] };
  });
  var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
  var r3 = function (n) { return Math.round(n * 1000) / 1000; };
  var PAROLE = { it: { chiamati: 'Chiamati per nome: ' }, en: { chiamati: 'Called by name: ' } };
  function linguaG() { return (root.getAttribute('lang') || 'it').slice(0, 2) === 'en' ? 'en' : 'it'; }
  /* dove sta il nome inciso (in unità del disegno): lo si misura quando serve, coi caratteri già arrivati */
  function misura(p) {
    try { var b = p.testo.getBBox(); if (b.width > 0) { p.x0 = b.x - 1; p.x1 = b.x + b.width + 1; p.misurato = true; } } catch (e) {}
  }
  /* il pendolo: la somma degli impulsi, ognuno smorzato e con una coda che lo porta a zero esatto alla fine della sua durata */
  function angolo(p, t) {
    var a = 0;
    for (var k = 0; k < p.impulsi.length; k++) {
      var im = p.impulsi[k], u = t - im.s;
      if (u <= 0 || u >= im.d) continue;
      a += im.A * Math.exp(-u / TG.smorza) * Math.sin(2 * Math.PI * u / TG.periodo) * (1 - c01((u - 0.75 * im.d) / (0.25 * im.d)));
    }
    return a;
  }
  function attivi(t) { return pezzi.some(function (p) { return p.impulsi.some(function (im) { return t < im.s + im.d; }); }); }
  function incidi(p, e) {
    /* e = 0: niente inciso; e = 1: tutto; la punta di luce sta sul bordo che avanza */
    if (!p.misurato) misura(p);
    var bordo = p.x0 + (p.x1 - p.x0) * e;
    if (p.clip) p.clip.setAttribute('width', r3(e >= 1 ? 100 : bordo));
    if (p.punta) {
      if (e > 0 && e < 1) { p.punta.setAttribute('display', 'inline'); p.punta.setAttribute('cx', r3(bordo)); }
      else p.punta.setAttribute('display', 'none');
    }
  }
  function posa(p, y, a, op) {
    p.el.style.transform = 'translate(0px, ' + r3(y) + 'px) rotate(' + r3(a) + 'deg)';
    if (op !== null) p.el.style.opacity = r3(op);
  }
  function fotogrammaIntro(t) {
    for (var i = 0; i < pezzi.length; i++) {
      var p = pezzi[i], s = TG.inizio + i * TG.passo, L = s + TG.caduta;
      var q = c01((t - s) / TG.caduta);
      /* cade accelerando, tocca il gancio con un piccolo rimbalzo */
      var y = t < L ? -TG.alto * (1 - q) * (1 - q) : -3 * Math.sin(Math.PI * c01((t - L) / 130));
      posa(p, y, t >= L ? angolo(p, t) : 0, c01(q / 0.25));
      var e = c01((t - L - TG.ritardoIncisione) / TG.incisione);
      incidi(p, e);
    }
  }
  function fotogrammaMoto(t) {
    for (var i = 0; i < pezzi.length; i++) {
      var p = pezzi[i];
      posa(p, 0, angolo(p, t), null);
      if (modoG === 'chiama') {
        /* chiamata: la punta di luce ripassa sul nome, che resta inciso */
        var e = c01((t - (i * CG.passo + 60)) / TG.incisione);
        if (p.punta) {
          if (e > 0 && e < 1) { if (!p.misurato) misura(p); p.punta.setAttribute('display', 'inline'); p.punta.setAttribute('cx', r3(p.x0 + (p.x1 - p.x0) * e)); }
          else p.punta.setAttribute('display', 'none');
        }
      }
    }
  }
  function pulisciG() {
    pezzi.forEach(function (p) {
      ['transform', 'opacity'].forEach(function (k) { p.el.style.removeProperty(k); });
      if (!p.el.getAttribute('style')) p.el.removeAttribute('style');
      if (p.clip) p.clip.setAttribute('width', '100');
      if (p.punta) p.punta.setAttribute('display', 'none');
      p.impulsi = [];
    });
  }
  /* la guardia: se i fotogrammi smettono di arrivare per 1,5 s (scheda in background) le medagliette vanno allo stato finale;
     si riarma a ogni fotogramma (#229) */
  function sorvegliaG() { clearTimeout(guardiaG); guardiaG = setTimeout(chiudiG, 1500); }
  function chiudiG() {
    cancelAnimationFrame(rafG); rafG = 0;
    clearTimeout(guardiaG);
    pulisciG();
    if (figuraG) figuraG.setAttribute('data-firma', 'fatta');
    root.classList.remove('firma-attesa');
    faseG = 'fatta';
  }
  function avviaG(modo) {
    cancelAnimationFrame(rafG); rafG = 0;
    modoG = modo;
    if (modo === 'intro') {
      /* dalla classe d'attesa agli stili in linea senza cambiare un pixel: i ganci vuoti */
      pezzi.forEach(function (p, i) {
        p.el.style.opacity = '0';
        p.impulsi = [{ s: TG.inizio + i * TG.passo + TG.caduta, A: (i % 2 ? -1 : 1) * TG.ampiezza * (0.85 + 0.3 * ((i * 37) % 10) / 10), d: TG.oscilla }];
        incidi(p, 0);
      });
      fineG = TG.fine;
    }
    root.classList.remove('firma-attesa');
    faseG = 'corre'; if (figuraG) figuraG.setAttribute('data-firma', 'corre');
    larghezzaAvvioG = window.innerWidth;
    var t0 = null, corsa = ++corseG;
    oraG = 0;
    function fotogramma(ts) {
      rafG = 0;
      /* un fotogramma rimasto in coda dopo la chiusura (o di una corsa vecchia) non riapre niente */
      if (faseG !== 'corre' || corsa !== corseG) return;
      if (t0 === null) t0 = ts;
      var t = oraG = ts - t0;
      if (modoG === 'intro') fotogrammaIntro(t); else fotogrammaMoto(t);
      if (modoG === 'intro' ? t >= fineG : (t >= fineG && !attivi(t))) { chiudiG(); return; }
      sorvegliaG();
      rafG = requestAnimationFrame(fotogramma);
    }
    sorvegliaG();
    rafG = requestAnimationFrame(fotogramma);
  }
  /* un colpo a una medaglietta (il mouse sopra): se si stanno già muovendo si aggiunge alla corsa, se no ne parte una */
  function spingi(i, A) {
    if (reducedMotion || faseG === 'corre' && modoG === 'intro') return;
    var d = 1400;
    if (faseG === 'corre') { pezzi[i].impulsi.push({ s: oraG, A: A, d: d }); fineG = Math.max(fineG, oraG + d); return; }
    pezzi.forEach(function (p) { p.impulsi = []; });
    pezzi[i].impulsi.push({ s: 0, A: A, d: d });
    fineG = d;
    avviaG('tocco');
  }
  /* «Chiamali per nome»: una dopo l'altra, come chiamate; il lettore di schermo legge i nomi */
  function chiama() {
    var L = linguaG();
    if (leggiG) leggiG.textContent = PAROLE[L].chiamati + DATI.nomi.join(', ') + '.';
    if (reducedMotion) { if (faseG === 'corre') chiudiG(); return; }
    if (faseG === 'corre' || root.classList.contains('firma-attesa')) chiudiG();
    pezzi.forEach(function (p, i) { p.impulsi = [{ s: i * CG.passo, A: (i % 2 ? 1 : -1) * CG.ampiezza, d: CG.oscilla }]; });
    fineG = CG.fine;
    avviaG('chiama');
  }

  /* la testata segna la sezione in cui ti trovi */
  var linkVoci = [].slice.call(document.querySelectorAll('#mainNav a'));
  var bersagliVoci = linkVoci.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function aggiornaVoci() {
    var y = (document.getElementById('testata') || { offsetHeight: 80 }).offsetHeight + 40, ora = -1;
    for (var i = 0; i < bersagliVoci.length; i++) { if (bersagliVoci[i] && bersagliVoci[i].getBoundingClientRect().top <= y) ora = i; }
    linkVoci.forEach(function (a, k) { if (k === ora) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }
  var tickVoci = 0;
  window.addEventListener('scroll', function () {
    if (tickVoci) return;
    tickVoci = requestAnimationFrame(function () { tickVoci = 0; aggiornaVoci(); });
  }, { passive: true });
  aggiornaVoci();

  /* lo stato degli orari anche accanto al biglietto, col pallino verde quando è aperto */
  function copiaStato() {
    var primo = document.getElementById(SITE.hoursStatusId);
    if (!primo) return;
    var aperto = hoursState().open;
    ['orarioStato', 'orarioStato2'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (el !== primo) el.textContent = primo.textContent;
      el.classList.toggle('is-aperto', aperto);
    });
  }
  copiaStato();
  setInterval(copiaStato, 60000);

  /* la barra è «in vista» quando se ne vede almeno il 60% (o il 60% della finestra, se è più alta della finestra); l'altezza è
     quella del documento: all'avvio innerHeight di un telefono può non essere ancora quella vera (#233) */
  function altezzaVista() { return document.documentElement.clientHeight || window.innerHeight || 800; }
  function abbastanza(top, bottom, alto, vh) { return Math.min(bottom, vh) - Math.max(top, 0) >= 0.6 * Math.min(alto, vh); }
  function inVistaG() {
    var r = listaG.getBoundingClientRect();
    return abbastanza(r.top, r.bottom, r.height, altezzaVista());
  }

  if (figuraG && listaG && chiamaB && pezzi.length === DATI.nomi.length) {
    try { clearTimeout(window.__attesaGanci); } catch (e) {}
    window.__ganci = {
      stato: function () {
        return { fase: faseG, modo: modoG, corse: corseG, ora: oraG, moti: pezzi.reduce(function (n, p) { return n + p.impulsi.filter(function (im) { return oraG < im.s + im.d; }).length; }, 0) };
      },
      tempi: TG, chiama: CG,
    };
    var daFare = !reducedMotion && root.classList.contains('firma-attesa');
    /* la pagina aperta su una sezione (#dove): il browser ci scorre dopo, la firma non si vedrebbe */
    var ancora = location.hash && location.hash.length > 1 && location.hash !== '#inizio';
    var inVista = inVistaG();
    /* perché la firma è partita o no (lo legge il check) */
    window.__ganci.avvio = { daFare: daFare, ancora: !!ancora, inVista: inVista, top: listaG.getBoundingClientRect().top, vh: altezzaVista() };
    if (!daFare || ancora) chiudiG();
    else if (inVista) avviaG('intro');
    else if ('IntersectionObserver' in window) {
      /* la barra sotto la piega (telefoni): parte quando se ne vede abbastanza; fino ad allora i ganci restano vuoti */
      var soglie = []; for (var sg = 0; sg <= 20; sg++) soglie.push(sg / 20);
      var ioG = new IntersectionObserver(function (voci) {
        if (!voci.some(function (v) { return v.isIntersecting && abbastanza(v.boundingClientRect.top, v.boundingClientRect.bottom, v.boundingClientRect.height, altezzaVista()); })) return;
        ioG.disconnect();
        if (faseG === 'fatta' && root.classList.contains('firma-attesa')) avviaG('intro');
      }, { threshold: soglie });
      ioG.observe(listaG);
      window.__ganci.avvio.aspetta = true;
    } else chiudiG();
    /* un resize chiude la firma solo se cambia la LARGHEZZA (sul telefono arrivano resize della sola altezza, #228) */
    window.addEventListener('resize', function () {
      if (faseG !== 'corre' || Math.abs(window.innerWidth - larghezzaAvvioG) <= 1) return;
      chiudiG();
    });
    chiamaB.addEventListener('click', chiama);
    /* col mouse (o la penna) sopra una medaglietta, oscilla dal lato da cui arriva il puntatore */
    MED.forEach(function (el, i) {
      el.addEventListener('pointerenter', function (e) {
        if (e.pointerType === 'touch') return;
        var r = el.getBoundingClientRect();
        spingi(i, (e.clientX < r.left + r.width / 2 ? 1 : -1) * 8);
      });
    });
  }
})();
