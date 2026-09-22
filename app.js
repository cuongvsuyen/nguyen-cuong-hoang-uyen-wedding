(() => {
  'use strict';

  const cfg = window.WEDDING_CONFIG;
  const gallery = cfg.images?.gallery || cfg.gallery || [];
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  const gate = $('#gate');
  const pageShell = $('#pageShell');
  const music = $('#music');
  const musicToggle = $('#musicToggle');
  const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- couple names: one source of truth in config.js ---------- */
  function applyCoupleNames() {
    const couple = cfg.couple || {};
    const names = {
      'groom-short': couple.groomShort || '',
      'groom-upper': couple.groomUpper || couple.groomShort || '',
      'groom-full': couple.groomFull || couple.groomShort || '',
      'bride-short': couple.brideShort || '',
      'bride-upper': couple.brideUpper || couple.brideShort || '',
      'bride-full': couple.brideFull || couple.brideShort || ''
    };

    Object.entries(names).forEach(([key, value]) => {
      $$(`[data-name=\"${key}\"]`).forEach(node => { node.textContent = value; });
    });

    document.title = `${names['groom-short']} & ${names['bride-short']}`;
  }



  /* ---------- all wedding-specific content comes from config.js ---------- */
  function setText(selector, value) {
    $$(selector).forEach(node => { node.textContent = value ?? ''; });
  }

  function parseDateOnly(value) {
    const [y, m, d] = String(value || '').split('-').map(Number);
    return { y, m, d, date: new Date(y, (m || 1) - 1, d || 1) };
  }

  function weekdayVi(date) {
    const labels = ['CHỦ NHẬT', 'THỨ HAI', 'THỨ BA', 'THỨ TƯ', 'THỨ NĂM', 'THỨ SÁU', 'THỨ BẢY'];
    return labels[date.getDay()] || '';
  }

  function monthLabel(month) {
    return `THÁNG ${String(month).padStart(2, '0')}`;
  }

  function applyWeddingConfig() {
    // Theme
    if (cfg.theme?.background) document.documentElement.style.setProperty('--red', cfg.theme.background);
    if (cfg.theme?.primary) document.documentElement.style.setProperty('--gold', cfg.theme.primary);
    if (cfg.theme?.gateGradient) document.documentElement.style.setProperty('--gate-gradient', cfg.theme.gateGradient);
    if (cfg.assets?.frameTitle) document.documentElement.style.setProperty('--frame-title-image', `url("${cfg.assets.frameTitle}")`);
    if (cfg.assets?.frameCalendar) document.documentElement.style.setProperty('--frame-calendar-image', `url("${cfg.assets.frameCalendar}")`);

    // Asset URLs / local paths
    $$('[data-asset]').forEach(node => {
      const key = node.dataset.asset;
      const src = cfg.assets?.[key];
      if (src) node.src = src;
    });
    $$('[data-svg-asset]').forEach(node => {
      const key = node.dataset.svgAsset;
      const src = cfg.assets?.[key];
      if (src) node.setAttribute('href', src);
    });
    $$('[data-config-image="hero"]').forEach(node => {
      if (cfg.images?.hero) node.setAttribute('href', cfg.images.hero);
    });

    // Families
    ['groom', 'bride'].forEach(side => {
      const family = cfg.families?.[side] || {};
      const root = $(`[data-family="${side}"]`);
      if (!root) return;
      $('.family-title', root).textContent = family.parentTitle || '';
      $('.family-father', root).textContent = family.father || '';
      $('.family-mother', root).textContent = family.mother || '';
      const address = $('.family-address', root);
      address.textContent = family.address || '';
      if (family.mapUrl) {
        address.href = family.mapUrl;
        address.setAttribute('aria-label', `Mở Google Maps: ${family.address || side}`);
      } else {
        address.removeAttribute('href');
      }
    });

    // Announcement and birth order
    setText('[data-config="announcement-line1"]', cfg.announcement?.line1);
    setText('[data-config="announcement-line2"]', cfg.announcement?.line2);
    setText('[data-config="groom-birth-order"]', cfg.couple?.groomBirthOrder);
    setText('[data-config="bride-birth-order"]', cfg.couple?.brideBirthOrder);

    // Ceremony
    const c = parseDateOnly(cfg.ceremony?.date);
    setText('[data-config="gate-date"]', c.y ? `${c.d} tháng ${c.m}, ${c.y}` : '');
    const ceremonyHeader = $('[data-config="ceremony-header"]');
    if (ceremonyHeader) ceremonyHeader.innerHTML = safeText(cfg.ceremony?.header || '').replace(/\n/g, '<br>');
    setText('[data-config="ceremony-time"]', cfg.ceremony?.time ? `VÀO LÚC ${cfg.ceremony.time}` : '');
    setText('[data-config="ceremony-weekday"]', weekdayVi(c.date));
    setText('[data-config="ceremony-day"]', c.d ? String(c.d).padStart(2, '0') : '');
    setText('[data-config="ceremony-month"]', c.m ? monthLabel(c.m) : '');
    setText('[data-config="ceremony-year"]', c.y || '');
    setText('[data-config="ceremony-lunar"]', cfg.ceremony?.lunar ? `(${cfg.ceremony.lunar})` : '');

    // Reception
    const r = parseDateOnly(cfg.reception?.date);
    setText('[data-config="party-label"]', cfg.reception?.partyLabel);
    setText('[data-config="banquet-time"]', cfg.reception?.banquetTime);
    setText('[data-config="guest-reception-time"]', cfg.reception?.guestReceptionTime);
    setText('[data-config="reception-weekday"]', weekdayVi(r.date));
    setText('[data-config="reception-day"]', r.d ? String(r.d).padStart(2, '0') : '');
    setText('[data-config="reception-month"]', r.m ? monthLabel(r.m) : '');
    setText('[data-config="calendar-month"]', r.y ? `THÁNG ${r.m} · ${r.y}` : '');
    setText('[data-config="reception-lunar"]', cfg.reception?.lunar ? `(${cfg.reception.lunar})` : '');
    setText('[data-config="venue-prefix"]', cfg.reception?.venuePrefix);
    setText('[data-config="venue"]', cfg.reception?.venue);
    const map = $('#venueMap');
    if (map && cfg.reception?.mapEmbedUrl) map.src = cfg.reception.mapEmbedUrl;
    const directions = $('#venueDirections');
    if (directions) directions.href = cfg.reception?.directionsUrl || '#';

    // Dress code
    setText('[data-config="dress-title"]', cfg.dresscode?.title || 'DRESS CODE');
    setText('[data-config="dress-subtitle"]', cfg.dresscode?.subtitle || '');
    setText('[data-config="thank-you"]', cfg.thankYou || '');
    const dressRoot = $('#dressColors');
    if (dressRoot) {
      dressRoot.innerHTML = '';
      (cfg.dresscode?.colors || []).forEach(color => {
        const swatch = document.createElement('span');
        swatch.style.setProperty('--swatch', color);
        dressRoot.appendChild(swatch);
      });
    }

    // Music URL
    if (music && cfg.music?.url) music.src = cfg.music.url;
  }


  let musicStarted = false;
  let inviteOpening = false;
  let galleryIndex = 0;
  let galleryAutoplayTimer = 0;
  let galleryResumeTimer = 0;
  let galleryInRange = false;
  let galleryHoverPaused = false;
  let galleryManualPaused = false;
  let galleryTouch = null;
  let toastTimer;

  /* ---------- deterministic ambient particles (matches original envelope logic) ---------- */
  function hashSeed(text) {
    let h = 0x811c9dc5;
    for (let i = 0; i < text.length; i++) {
      h ^= text.charCodeAt(i);
      h = Math.imul(h, 0x1000193);
    }
    return h >>> 0;
  }

  function seededRandom(seedText) {
    let seed = hashSeed(seedText);
    return () => {
      let x = seed = (seed + 0x6d2b79f5) >>> 0;
      x = Math.imul(x ^ (x >>> 15), 1 | x);
      x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
      return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
    };
  }

  function buildGateParticles() {
    const root = $('#gateParticles');
    const colors = ['#FFBE89', '#FFD4A8', '#FF9B4A', '#710001'];
    const rnd = seededRandom(`long-phung-v3:${cfg.couple.groomShort}:${cfg.couple.brideShort}`);
    root.innerHTML = '';

    // Original cover uses 12 ambient particles.
    for (let i = 0; i < 12; i++) {
      const duration = 18 + 8 * rnd();
      const node = document.createElement('span');
      node.className = 'happiness-particle';
      node.textContent = '囍';
      node.style.left = `${5 + 90 * rnd()}%`;
      node.style.setProperty('--particle-color', colors[Math.floor(rnd() * colors.length)]);
      node.style.setProperty('--particle-size', `${10 + 14 * rnd()}px`);
      node.style.setProperty('--duration', `${duration}s`);
      node.style.setProperty('--delay', `${-rnd() * duration}s`);
      node.style.setProperty('--sway', `${(rnd() - .5) * 60}px`);
      root.appendChild(node);
    }
  }

  function buildBurstParticles() {
    const root = $('#gateBurst');
    const colors = ['#FFBE89', '#FFD4A8', '#FF9B4A', '#710001'];
    root.innerHTML = '';

    for (let i = 0; i < 32; i++) {
      const angle = 2 * Math.PI * i / 32 + (Math.random() - .5) * .4;
      const radius = 25 + 60 * Math.random();
      const x = 50 + Math.cos(angle) * radius;
      const y = 50 + Math.sin(angle) * radius;
      const node = document.createElement('span');
      node.className = 'burst-particle';
      node.textContent = '囍';
      node.style.color = colors[Math.floor(Math.random() * colors.length)];
      node.style.fontSize = `${10 + 16 * Math.random()}px`;
      node.style.textShadow = `0 0 10px ${node.style.color}`;
      node.style.setProperty('--dx', `${(x - 50) * 5}px`);
      node.style.setProperty('--dy', `${(y - 50) * 5}px`);
      node.style.setProperty('--rot-start', `${(Math.random() - .5) * 30}deg`);
      node.style.setProperty('--rot-end', `${(Math.random() - .5) * 360}deg`);
      node.style.setProperty('--burst-delay', `${.15 * Math.random()}s`);
      root.appendChild(node);
    }
    setTimeout(() => { root.innerHTML = ''; }, 1600);
  }

  function spawnSealRing() {
    const wrap = $('.gate-card-wrap');
    const ring = document.createElement('span');
    ring.className = 'gate-seal-ring';
    wrap.appendChild(ring);
    setTimeout(() => ring.remove(), 700);
  }

  function spawnFlyingDecor() {
    const layer = $('#gateFlyLayer');
    layer.innerHTML = '';
    $$('.gate-phoenix, .gate-dragon').forEach(source => {
      const rect = source.getBoundingClientRect();
      const holder = document.createElement('span');
      holder.className = 'gate-fly-copy';
      holder.style.left = `${rect.left}px`;
      holder.style.top = `${rect.top}px`;
      holder.style.width = `${rect.width}px`;
      holder.style.height = `${rect.height}px`;

      const img = source.cloneNode(true);
      img.removeAttribute('class');
      img.className = 'gate-fly-image';
      img.style.setProperty('--fly-rotation', source.classList.contains('gate-phoenix') ? '20deg' : '-20deg');
      holder.appendChild(img);
      layer.appendChild(holder);
    });
    setTimeout(() => { layer.innerHTML = ''; }, 1350);
  }

  function playOpenChime() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = 'sine';
        const at = now + .1 * i;
        osc.frequency.setValueAtTime(freq, at);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(.035 - .005 * i, at + .01);
        gain.gain.exponentialRampToValueAtTime(.001, at + 1.8);
        osc.start(at); osc.stop(at + 1.8);
      });

      [1567.98, 2093].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = 'sine';
        const at = now + .35 + .1 * i;
        osc.frequency.setValueAtTime(freq, at);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(.015, at + .02);
        gain.gain.exponentialRampToValueAtTime(.001, at + 1.2);
        osc.start(at); osc.stop(at + 1.2);
      });

      const bass = ctx.createOscillator();
      const bassGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      bass.connect(filter); filter.connect(bassGain); bassGain.connect(ctx.destination);
      bass.type = 'sine'; bass.frequency.setValueAtTime(261.63, now);
      filter.type = 'lowpass'; filter.frequency.value = 400;
      bassGain.gain.setValueAtTime(0, now);
      bassGain.gain.linearRampToValueAtTime(.025, now + .4);
      bassGain.gain.setValueAtTime(.02, now + 1);
      bassGain.gain.exponentialRampToValueAtTime(.001, now + 2.5);
      bass.start(now); bass.stop(now + 2.5);

      setTimeout(() => {
        [783.99, 987.77, 1174.66, 1567.98].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain); gain.connect(ctx.destination);
          osc.type = 'sine';
          const at = ctx.currentTime + .06 * i;
          osc.frequency.setValueAtTime(freq, at);
          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(.025, at + .01);
          gain.gain.exponentialRampToValueAtTime(.001, at + .6);
          osc.start(at); osc.stop(at + .6);
        });
        setTimeout(() => ctx.close?.().catch?.(() => {}), 1200);
      }, 1200);
    } catch (_) {}
  }

  /* ---------- page background ---------- */
  function buildBackgroundDecor() {
    const field = $('#decorField');
    const strip = document.createElement('div');
    strip.className = 'decor-strip';
    for (let i = 0; i < 12; i++) {
      const image = new Image();
      image.src = i % 2 === 0 ? cfg.assets.phung : cfg.assets.rong;
      image.alt = '';
      strip.appendChild(image);
    }
    field.appendChild(strip);

    let raf = 0;
    const parallax = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = $('#inviteCard').getBoundingClientRect();
        const scrollInside = Math.max(0, -rect.top);
        strip.style.transform = `translate3d(-50%, ${scrollInside * .08}px, 0)`;
      });
    };
    addEventListener('scroll', parallax, { passive: true });
  }

  /* ---------- exact 3D cards gallery behavior ---------- */
  function relativeGalleryPosition(index) {
    const total = gallery.length;
    let delta = index - galleryIndex;
    if (delta > total / 2) delta -= total;
    if (delta < -total / 2) delta += total;
    return delta;
  }

  function renderGalleryCards() {
    const cards = $$('.gallery-3d-card', $('#galleryCarousel'));
    cards.forEach((card, index) => {
      const delta = relativeGalleryPosition(index);
      const abs = Math.abs(delta);
      const active = delta === 0;
      const scale = Math.max(.7, 1 - .15 * abs);
      const opacity = Math.max(.3, 1 - .25 * abs);
      card.style.transform = `translateX(${60 * delta}%) translateZ(${-150 * abs}px) rotateY(${45 * delta}deg) scale(${scale})`;
      card.style.opacity = String(opacity);
      card.style.zIndex = String(100 - abs);
      card.classList.toggle('is-active', active);
      card.setAttribute('aria-hidden', active ? 'false' : 'true');
    });
    const counter = $('#galleryCarouselCounter');
    if (counter) counter.textContent = `${galleryIndex + 1} / ${gallery.length}`;
  }

  function pauseGalleryTemporarily() {
    galleryManualPaused = true;
    clearTimeout(galleryResumeTimer);
    stopGalleryAutoplay();
    galleryResumeTimer = setTimeout(() => {
      galleryManualPaused = false;
      updateGalleryAutoplay();
    }, 6000);
  }

  function setGalleryIndex(index, manual = false) {
    const len = gallery.length;
    galleryIndex = (index + len) % len;
    renderGalleryCards();
    if (manual) pauseGalleryTemporarily();
  }

  function shiftGalleryDeck(delta, manual = true) {
    setGalleryIndex(galleryIndex + delta, manual);
  }

  function startGalleryAutoplay() {
    if (galleryAutoplayTimer || gallery.length <= 1 || prefersReducedMotion.matches || !galleryInRange || galleryHoverPaused || galleryManualPaused) return;
    galleryAutoplayTimer = setInterval(() => shiftGalleryDeck(1, false), 1400);
  }

  function stopGalleryAutoplay() {
    if (galleryAutoplayTimer) clearInterval(galleryAutoplayTimer);
    galleryAutoplayTimer = 0;
  }

  function updateGalleryAutoplay() {
    stopGalleryAutoplay();
    startGalleryAutoplay();
  }

  function buildGallery() {
    const root = $('#galleryCarousel');
    root.innerHTML = `
      <div class="gallery-deck-shell">
        <button type="button" class="gallery-deck-nav prev" id="galleryDeckPrev" aria-label="Ảnh trước">‹</button>
        <div class="gallery-deck" id="galleryDeck"></div>
        <button type="button" class="gallery-deck-nav next" id="galleryDeckNext" aria-label="Ảnh sau">›</button>
      </div>
      <div class="gallery-carousel-counter" id="galleryCarouselCounter">1 / ${gallery.length}</div>`;

    const deck = $('#galleryDeck');
    gallery.forEach((src, index) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'gallery-3d-card';
      card.setAttribute('aria-label', `Ảnh cưới ${index + 1}`);
      card.style.aspectRatio = String(2 / 3);
      card.style.transitionDuration = '1100ms';
      const img = new Image();
      img.src = src;
      img.alt = `Ảnh cưới ${index + 1}`;
      img.loading = index < 3 ? 'eager' : 'lazy';
      card.appendChild(img);
      card.addEventListener('click', () => {
        if (index === galleryIndex) openGallery(index);
        else setGalleryIndex(index, true);
      });
      deck.appendChild(card);
    });

    $('#galleryDeckPrev').addEventListener('click', () => shiftGalleryDeck(-1, true));
    $('#galleryDeckNext').addEventListener('click', () => shiftGalleryDeck(1, true));

    root.addEventListener('mouseenter', () => {
      galleryHoverPaused = true;
      stopGalleryAutoplay();
    });
    root.addEventListener('mouseleave', () => {
      galleryHoverPaused = false;
      updateGalleryAutoplay();
    });

    deck.addEventListener('touchstart', event => {
      const t = event.touches[0];
      galleryTouch = { x: t.clientX, y: t.clientY };
    }, { passive: true });
    deck.addEventListener('touchend', event => {
      if (!galleryTouch) return;
      const t = event.changedTouches[0];
      const dx = t.clientX - galleryTouch.x;
      const dy = Math.abs(t.clientY - galleryTouch.y);
      galleryTouch = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > dy) shiftGalleryDeck(dx < 0 ? 1 : -1, true);
    }, { passive: true });

    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver(entries => {
        galleryInRange = !!entries[0]?.isIntersecting;
        updateGalleryAutoplay();
      }, { threshold: 0, rootMargin: '300px 0px' });
      obs.observe(root);
    } else {
      galleryInRange = true;
      startGalleryAutoplay();
    }

    prefersReducedMotion.addEventListener?.('change', updateGalleryAutoplay);
    renderGalleryCards();
  }

  /* ---------- static data ---------- */
  function buildCalendar() {
    const root = $('#calendarDays');
    root.innerHTML = '';
    const { y: year, m, d: weddingDay } = parseDateOnly(cfg.reception?.date);
    const month = m - 1;
    if (!year || month < 0) return;
    const first = new Date(year, month, 1);
    const days = new Date(year, month + 1, 0).getDate();
    const mondayIndex = (first.getDay() + 6) % 7;
    for (let i = 0; i < mondayIndex; i++) {
      const cell = document.createElement('span');
      cell.className = 'empty'; cell.textContent = '0'; root.appendChild(cell);
    }
    for (let day = 1; day <= days; day++) {
      const cell = document.createElement('span');
      cell.textContent = String(day);
      if (day === weddingDay) cell.className = 'wedding-day';
      root.appendChild(cell);
    }
  }

  function buildTimeline() {
    const root = $('#timeline');
    cfg.timeline.forEach(({ time, label }) => {
      const row = document.createElement('div');
      row.className = 'timeline-item';
      row.innerHTML = `
        <div class="timeline-time">${time}</div>
        <div class="timeline-axis"><span class="timeline-dot"></span></div>
        <div class="timeline-label">${label}</div>`;
      root.appendChild(row);
    });
  }

  function safeText(value) {
    return String(value ?? '').replace(/[&<>'"]/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    })[char]);
  }

  function getStoredComments() {
    try { return JSON.parse(localStorage.getItem('longphung-comments') || '[]'); }
    catch { return []; }
  }

  function renderComments() {
    const root = $('#comments');
    const stored = getStoredComments();
    const comments = [...stored].reverse().concat(cfg.comments);
    root.innerHTML = '';
    comments.slice(0, 10).forEach(c => {
      const card = document.createElement('article');
      card.className = 'comment-card';
      card.innerHTML = `<strong>${safeText(c.name)}</strong><p>${safeText(c.message)}</p>`;
      root.appendChild(card);
    });
  }

  function buildBankCards() {
    const root = $('#bankGrid');
    root.innerHTML = '';
    cfg.bankCards.forEach(card => {
      const el = document.createElement('article');
      el.className = 'bank-card';
      el.innerHTML = `
        <h3>${safeText(card.role)} - ${safeText(card.name)}</h3>
        <img src="${card.qr}" alt="QR ${safeText(card.role)}" />
        <span class="bank-name">${safeText(card.bank)}</span>
        <span class="bank-account">${safeText(card.account)}</span>
        <b>${safeText(card.name)}</b>
        <button class="save-qr" type="button"><span class="save-qr-icon" aria-hidden="true">↓</span><span>Lưu QR</span></button>`;
      const save = $('.save-qr', el);
      save.addEventListener('click', async event => {
        event.stopPropagation();
        const filename = `qr-${card.role.toLowerCase().replace(/\s+/g, '-')}.png`;
        try {
          // Works for both local images and remote image URLs when CORS permits it.
          const response = await fetch(card.qr, { mode: 'cors' });
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const blob = await response.blob();
          const objectUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = objectUrl;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          a.remove();
          setTimeout(() => URL.revokeObjectURL(objectUrl), 1200);
        } catch (_) {
          // Some remote hosts do not allow CORS/download. Open the image instead.
          window.open(card.qr, '_blank', 'noopener');
        }
      });
      root.appendChild(el);
    });
  }

  function updateCountdown() {
    const target = new Date(`${cfg.reception.date}T${cfg.reception.banquetTime}:00+07:00`).getTime();
    const diff = Math.max(0, target - Date.now());
    const values = {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000)
    };
    Object.entries(values).forEach(([key, val]) => {
      const el = $(`[data-unit="${key}"]`);
      if (el) el.textContent = String(val).padStart(2, '0');
    });
  }

  function showToast(message) {
    const toast = $('#toast');
    toast.textContent = message;
    toast.classList.add('is-showing');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-showing'), 2400);
  }

  /* ---------- audio ---------- */
  async function startMusic() {
    if (!musicStarted) {
      try { music.currentTime = cfg.music.startTime; } catch (_) {}
      musicStarted = true;
    }
    music.volume = cfg.music.volume;
    try {
      await music.play();
      musicToggle.classList.add('is-playing');
    } catch (_) {
      musicToggle.classList.remove('is-playing');
    }
  }

  function pauseMusic() {
    music.pause();
    musicToggle.classList.remove('is-playing');
  }

  music.addEventListener('timeupdate', () => {
    if (music.currentTime >= cfg.music.endTime) {
      music.currentTime = cfg.music.startTime;
      if (!music.paused) music.play().catch(() => {});
    }
  });
  musicToggle.addEventListener('click', () => music.paused ? startMusic() : pauseMusic());

  /* ---------- opening sequence from HAR + video ---------- */
  function openInvite() {
    if (inviteOpening) return;
    inviteOpening = true;
    pageShell.classList.add('is-visible');
    pageShell.setAttribute('aria-hidden', 'false');

    // Same click starts the soundtrack and a soft generated chime.
    startMusic();
    playOpenChime();
    spawnSealRing();
    spawnFlyingDecor();
    gate.classList.add('is-opening');

    // Video: after the tap, the seal reacts immediately; the card starts leaving
    // almost at once and the 囍 burst fills the empty red cover for a short beat.
    setTimeout(() => {
      buildBurstParticles();
      gate.classList.add('is-away');
    }, prefersReducedMotion.matches ? 20 : 110);

    // In the supplied phone recording the invitation is visible in under one second.
    setTimeout(() => {
      gate.classList.add('is-opened');
      document.body.classList.remove('is-gated');
      musicToggle.classList.add('is-visible');
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, prefersReducedMotion.matches ? 100 : 820);
  }
  $('#openInvite').addEventListener('click', openInvite);

  /* ---------- modals ---------- */
  function openModal(id) {
    const modal = document.getElementById(id);
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('has-modal');
  }

  function closeModal(id) {
    const modal = document.getElementById(id);
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    if (!$('.modal.is-open')) document.documentElement.classList.remove('has-modal');
  }

  $$('[data-close]').forEach(button => button.addEventListener('click', () => closeModal(button.dataset.close)));
  $$('.modal').forEach(modal => modal.addEventListener('click', event => {
    if (event.target === modal) closeModal(modal.id);
  }));

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') $$('.modal.is-open').forEach(m => closeModal(m.id));
    if ($('#galleryModal').classList.contains('is-open')) {
      if (event.key === 'ArrowLeft') shiftGalleryLightbox(-1);
      if (event.key === 'ArrowRight') shiftGalleryLightbox(1);
    }
  });

  function renderGalleryLightbox() {
    $('#galleryLarge').src = gallery[galleryIndex];
    $('#galleryCounter').textContent = `${galleryIndex + 1} / ${gallery.length}`;
  }

  function openGallery(index) {
    galleryIndex = index;
    renderGalleryCards();
    renderGalleryLightbox();
    pauseGalleryTemporarily();
    openModal('galleryModal');
  }

  function shiftGalleryLightbox(delta) {
    galleryIndex = (galleryIndex + delta + gallery.length) % gallery.length;
    renderGalleryCards();
    renderGalleryLightbox();
    pauseGalleryTemporarily();
  }

  $('#galleryPrev').addEventListener('click', () => shiftGalleryLightbox(-1));
  $('#galleryNext').addEventListener('click', () => shiftGalleryLightbox(1));
  let lightboxTouchStart = null;
  $('#galleryModal').addEventListener('touchstart', e => { lightboxTouchStart = e.changedTouches[0].clientX; }, { passive: true });
  $('#galleryModal').addEventListener('touchend', e => {
    if (lightboxTouchStart == null) return;
    const delta = e.changedTouches[0].clientX - lightboxTouchStart;
    if (Math.abs(delta) > 45) shiftGalleryLightbox(delta < 0 ? 1 : -1);
    lightboxTouchStart = null;
  }, { passive: true });

  const rsvpForm = $('#rsvpForm');
  const rsvpSubmit = $('#rsvpSubmit');
  const rsvpStatusMessage = $('#rsvpStatusMessage');
  const rsvpGuestsField = $('#rsvpGuestsField');

  function getRsvpClientId() {
    let id = localStorage.getItem('longphung-rsvp-client-id');
    if (!id) {
      id = (crypto.randomUUID ? crypto.randomUUID() : `guest-${Date.now()}-${Math.random().toString(16).slice(2)}`);
      localStorage.setItem('longphung-rsvp-client-id', id);
    }
    return id;
  }

  function setRsvpBusy(isBusy) {
    if (!rsvpSubmit) return;
    rsvpSubmit.disabled = isBusy;
    rsvpSubmit.classList.toggle('is-loading', isBusy);
    rsvpForm?.setAttribute('aria-busy', isBusy ? 'true' : 'false');
  }

  function setRsvpStatus(message, type = '') {
    if (!rsvpStatusMessage) return;
    rsvpStatusMessage.textContent = message;
    rsvpStatusMessage.className = `rsvp-status${type ? ` is-${type}` : ''}`;
  }

  function updateRsvpGuestField() {
    const attendance = $('input[name="attendance"]:checked', rsvpForm)?.value || 'yes';
    const no = attendance === 'no';
    rsvpGuestsField?.classList.toggle('is-disabled', no);
    const guests = $('#rsvpGuests');
    if (guests) {
      guests.disabled = no;
      if (no) guests.value = '1';
    }
  }

  function hydrateRsvpForm() {
    try {
      const saved = JSON.parse(localStorage.getItem('longphung-rsvp') || 'null');
      if (!saved || !rsvpForm) return;
      $('#rsvpName').value = saved.name || '';
      $('#rsvpPhone').value = saved.phone || '';
      $('#rsvpRelation').value = saved.relation || 'groom';
      $('#rsvpDiet').value = saved.diet || '';
      $('#rsvpMessage').value = saved.message || '';
      const attendance = saved.status === 'no' ? 'no' : 'yes';
      const radio = $(`input[name="attendance"][value="${attendance}"]`, rsvpForm);
      if (radio) radio.checked = true;
      if (saved.guests && attendance === 'yes') $('#rsvpGuests').value = String(saved.guests);
      updateRsvpGuestField();
      setRsvpStatus('Bạn đã từng gửi xác nhận. Gửi lại để cập nhật thông tin.', 'saved');
    } catch (_) {}
  }

  $('#openRsvp').addEventListener('click', () => {
    $('#rsvpSection')?.scrollIntoView({ behavior: prefersReducedMotion.matches ? 'auto' : 'smooth', block: 'center' });
    setTimeout(() => $('#rsvpName')?.focus({ preventScroll: true }), prefersReducedMotion.matches ? 0 : 650);
  });
  $('#giftBox').addEventListener('click', () => openModal('giftModal'));

  $$('input[name="attendance"]', rsvpForm).forEach(input => input.addEventListener('change', updateRsvpGuestField));

  function submitRsvpToGoogle(endpoint, fields) {
    return new Promise((resolve, reject) => {
      const requestId = `rsvp-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const frameName = `rsvpFrame_${Date.now()}_${Math.random().toString(16).slice(2)}`;
      const iframe = document.createElement('iframe');
      const form = document.createElement('form');
      let settled = false;

      iframe.name = frameName;
      iframe.hidden = true;
      iframe.setAttribute('aria-hidden', 'true');
      iframe.style.display = 'none';

      form.method = 'POST';
      form.action = endpoint;
      form.target = frameName;
      form.style.display = 'none';

      const payload = { ...fields, requestId };
      Object.entries(payload).forEach(([name, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = String(value ?? '');
        form.appendChild(input);
      });

      const cleanup = () => {
        window.removeEventListener('message', onMessage);
        clearTimeout(timer);
        form.remove();
        setTimeout(() => iframe.remove(), 0);
      };

      const finish = (fn, value) => {
        if (settled) return;
        settled = true;
        cleanup();
        fn(value);
      };

      const onMessage = event => {
        const trustedOrigin = event.origin === 'https://script.google.com' || event.origin === 'https://script.googleusercontent.com';
        if (!trustedOrigin) return;
        const data = event.data;
        if (!data || data.type !== 'wedding-rsvp-result' || data.requestId !== requestId) return;
        if (data.ok) finish(resolve, data);
        else finish(reject, new Error(data.error || 'Google Sheet không thể lưu RSVP'));
      };

      const timer = setTimeout(() => {
        finish(reject, new Error('Hết thời gian chờ phản hồi từ Google Apps Script'));
      }, 12000);

      window.addEventListener('message', onMessage);
      document.body.appendChild(iframe);
      document.body.appendChild(form);
      form.submit();
    });
  }

  rsvpForm.addEventListener('submit', async event => {
    event.preventDefault();
    const attendance = $('input[name="attendance"]:checked', rsvpForm)?.value || 'yes';
    const payload = {
      clientId: getRsvpClientId(),
      name: $('#rsvpName').value.trim(),
      phone: $('#rsvpPhone').value.trim(),
      relation: $('#rsvpRelation').value,
      status: attendance,
      guests: attendance === 'yes' ? Number($('#rsvpGuests').value || 1) : 0,
      diet: $('#rsvpDiet').value.trim(),
      message: $('#rsvpMessage').value.trim(),
      updatedAt: Date.now()
    };

    if (!payload.name) {
      setRsvpStatus('Vui lòng nhập họ và tên của bạn.', 'error');
      $('#rsvpName').focus();
      return;
    }

    setRsvpBusy(true);
    setRsvpStatus('Đang gửi xác nhận...', 'sending');

    // Always keep a local copy so the guest can edit their answer on the same device.
    localStorage.setItem('longphung-rsvp', JSON.stringify(payload));

    try {
      const endpoint = String(cfg.rsvp?.endpoint || '').trim();
      const isConfigured = /^https:\/\/script\.google\.com\/macros\/s\/.+\/exec(?:[?#].*)?$/.test(endpoint);

      if (!isConfigured) {
        throw new Error('Google Apps Script Web App URL chưa được cấu hình trong config.js');
      }

      // Submit with a hidden cross-origin form. The Apps Script response posts a
      // message back to this page, so we can confirm that Google Sheet actually saved it.
      const result = await submitRsvpToGoogle(endpoint, {
        clientId: payload.clientId,
        name: payload.name,
        phone: payload.phone,
        relation: payload.relation,
        status: payload.status,
        guests: String(payload.guests),
        diet: payload.diet,
        message: payload.message,
        updatedAt: String(payload.updatedAt),
        source: location.href,
        userAgent: navigator.userAgent,
        formVersion: cfg.rsvp?.formVersion || 'github-pages-google-sheets-v1',
        website: $('#rsvpWebsite')?.value || ''
      });

      localStorage.setItem('longphung-rsvp', JSON.stringify({
        ...payload,
        syncedTo: 'google-sheets',
        serverId: result.id || '',
        sentAt: Date.now()
      }));
      setRsvpStatus('Cảm ơn bạn! Xác nhận đã được gửi thành công ♥', 'success');
      showToast('Đã gửi xác nhận tham dự ♥');
    } catch (error) {
      setRsvpStatus('Đã lưu trên thiết bị này. Chưa gửi được lên Google Sheet.', 'warning');
      showToast('Đã lưu tạm xác nhận trên thiết bị');
      console.warn('Google Sheets RSVP unavailable:', error);
    } finally {
      setRsvpBusy(false);
    }
  });

  hydrateRsvpForm();
  updateRsvpGuestField();

  $('#guestbookForm').addEventListener('submit', event => {
    event.preventDefault();
    const name = $('#guestName').value.trim();
    const message = $('#guestWish').value.trim();
    if (!name || !message) return;
    const list = getStoredComments();
    list.push({ name, message, createdAt: Date.now() });
    localStorage.setItem('longphung-comments', JSON.stringify(list.slice(-30)));
    event.target.reset();
    renderComments();
    showToast('Đã lưu lời chúc ♥');
  });

  $('#addCalendar').addEventListener('click', () => {
    const start = new Date(`${cfg.reception.date}T${cfg.reception.banquetTime}:00+07:00`);
    const end = new Date(start.getTime() + 4 * 3600000);
    const format = d => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Long Phung Wedding//VI', 'BEGIN:VEVENT',
      `DTSTART:${format(start)}`, `DTEND:${format(end)}`,
      `SUMMARY:Lễ cưới ${cfg.couple.groomShort} & ${cfg.couple.brideShort}`,
      `LOCATION:${cfg.reception.venue}`,
      'DESCRIPTION:Thân mời bạn đến dự buổi tiệc chung vui cùng gia đình.',
      'END:VEVENT', 'END:VCALENDAR'
    ].join('\r\n');
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    const slug = `${cfg.couple.groomShort}-${cfg.couple.brideShort}`.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    a.download = `${slug || 'wedding'}.ics`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });

  // The reference video does not use strong section fade-ins while scrolling.
  $$('.reveal').forEach(n => n.classList.add('is-in'));

  applyWeddingConfig();
  applyCoupleNames();
  buildGateParticles();
  buildBackgroundDecor();
  buildGallery();
  buildCalendar();
  buildTimeline();
  buildBankCards();
  renderComments();
  updateCountdown();
  setInterval(updateCountdown, 1000);
})();
