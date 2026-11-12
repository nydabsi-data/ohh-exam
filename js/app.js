/* Pilot Exam — learning path, lessons, hearts, XP, streak.
   Progress is kept in localStorage for now (Supabase sync later). */
(function () {
  'use strict';

  const KEY = 'pilotexam_state_v1';
  const MAX_HEARTS = 5;
  const REFILL_MS = 30 * 60 * 1000;   // +1 heart every 30 minutes
  const XP_PER_Q = 10;
  const DAILY_GOAL = 50;
  const PRAISE = ['ถูกต้อง!', 'เยี่ยมมาก!', 'ยอดเยี่ยม!', 'แม่นมาก!', 'Roger that!'];

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const fmtTime = (s) => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');

  const ICON = {
    flame: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c1 3.5-1.5 5-1.5 7.5 0 1.4 1 2.5 2.3 2.5 1.4 0 2.2-1 2.2-2.4 0-.7-.2-1.3-.5-1.9C17 9.4 19 12 19 15a7 7 0 0 1-14 0c0-4.6 4.2-7.6 7-13z"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 2 4 14h7l-1.5 8L19 10h-7z"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.5 2.9 4.5 6.6 4.5c2.1 0 3.6 1.2 5.4 3.2 1.8-2 3.3-3.2 5.4-3.2 3.7 0 5.7 4 4.2 7.3C19.5 16.4 12 21 12 21z"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5-4.8-4.6 6.6-.9z"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 10V7a5 5 0 0 1 10 0v3h1a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1zm2 0h6V7a3 3 0 0 0-6 0z"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    plane: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/></svg>',
    trophy: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 3h10v2h3.5v3A4.5 4.5 0 0 1 16.3 12.5 5 5 0 0 1 13 15.9V19h3.5v2h-9v-2H11v-3.1a5 5 0 0 1-3.3-3.4A4.5 4.5 0 0 1 3.5 8V5H7zm0 4H5.5v1A2.5 2.5 0 0 0 7 10.3zm10 0v3.3A2.5 2.5 0 0 0 18.5 8V7z"/></svg>'
  };

  /* ---------- Data ---------- */
  const UNITS = window.UNITS || [];
  const LESSONS = [];
  UNITS.forEach((u) => u.lessons.forEach((l) => LESSONS.push(Object.assign({}, l, { unit: u }))));

  /* ---------- State ---------- */
  const dayKey = (d) => { d = d || new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  const yesterday = () => { const d = new Date(); d.setDate(d.getDate() - 1); return dayKey(d); };
  const fresh = () => ({ xp: 0, hearts: MAX_HEARTS, heartsAt: Date.now(), streak: 0, lastDay: null, today: dayKey(), todayXp: 0, done: {}, sound: true });

  let S = fresh();
  try { const raw = localStorage.getItem(KEY); if (raw) S = Object.assign(fresh(), JSON.parse(raw)); } catch (e) { /* private mode etc. */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ } };

  function sync() {
    if (S.today !== dayKey()) { S.today = dayKey(); S.todayXp = 0; }
    if (S.lastDay && S.lastDay !== dayKey() && S.lastDay !== yesterday()) S.streak = 0;
    if (S.hearts >= MAX_HEARTS) { S.hearts = MAX_HEARTS; S.heartsAt = Date.now(); }
    else {
      const n = Math.floor((Date.now() - S.heartsAt) / REFILL_MS);
      if (n > 0) {
        S.hearts = Math.min(MAX_HEARTS, S.hearts + n);
        S.heartsAt = S.hearts >= MAX_HEARTS ? Date.now() : S.heartsAt + n * REFILL_MS;
      }
    }
    save();
  }
  const minsToNextHeart = () => S.hearts >= MAX_HEARTS ? 0 : Math.max(1, Math.ceil((REFILL_MS - (Date.now() - S.heartsAt)) / 60000));
  function loseHeart() {
    if (S.hearts >= MAX_HEARTS) S.heartsAt = Date.now();
    S.hearts = Math.max(0, S.hearts - 1);
    save();
  }

  /* ---------- Sound (tiny WebAudio blips, no files) ---------- */
  let ac = null;
  function tone(ok) {
    if (!S.sound) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      const notes = ok ? [660, 880] : [220, 165];
      notes.forEach((f, i) => {
        const t = ac.currentTime + i * 0.09, o = ac.createOscillator(), g = ac.createGain();
        o.type = ok ? 'sine' : 'triangle'; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.15, t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
        o.connect(g).connect(ac.destination); o.start(t); o.stop(t + 0.18);
      });
    } catch (e) { /* no audio */ }
  }

  /* ---------- Views ---------- */
  function show(view) {
    ['home', 'lesson', 'result'].forEach((v) => $('#' + v + '-view').classList.toggle('hidden', v !== view));
    window.scrollTo(0, 0);
  }

  function renderStats() {
    $$('[data-stat]').forEach((el) => {
      const k = el.dataset.stat;
      const v = k === 'streak' ? S.streak : k === 'xp' ? S.xp : S.hearts;
      el.innerHTML = ICON[{ streak: 'flame', xp: 'bolt', hearts: 'heart' }[k]] + '<span>' + v + '</span>';
      el.classList.toggle('off', (k === 'streak' && !S.streak) || (k === 'hearts' && !S.hearts));
      el.title = { streak: 'เรียนต่อเนื่อง ' + S.streak + ' วัน', xp: 'XP สะสม ' + S.xp, hearts: 'หัวใจ ' + S.hearts + '/' + MAX_HEARTS }[k];
    });
  }

  const isDone = (id) => !!S.done[id];
  const isUnlocked = (i) => i === 0 || isDone(LESSONS[i - 1].id);
  const OFFSETS = [0, -70, -40, 40, 70, 0];

  function renderHome() {
    sync(); renderStats();
    const cur = LESSONS.findIndex((l) => !isDone(l.id));
    let html = '', i = 0;
    UNITS.forEach((u, ui) => {
      const doneN = u.lessons.filter((l) => isDone(l.id)).length;
      html += '<section class="unit" style="--c:' + u.color + ';--d:' + u.dark + '">' +
        '<header class="unit-head"><div><small>Unit ' + (ui + 1) + ' · ' + esc(u.th) + '</small><h2>' + esc(u.title) + '</h2></div>' +
        '<span class="unit-count">' + doneN + '/' + u.lessons.length + '</span></header><div class="path">';
      u.lessons.forEach((l, li) => {
        const st = isDone(l.id) ? 'done' : i === cur ? 'current' : isUnlocked(i) ? 'open' : 'locked';
        const ico = st === 'done' ? ICON.check : st === 'locked' ? ICON.lock : ICON.star;
        html += '<div class="node-wrap" style="transform:translateX(' + OFFSETS[li % OFFSETS.length] + 'px)">' +
          (st === 'current' ? '<div class="start-tip">เริ่ม</div>' : '') +
          '<button class="node ' + st + '" data-i="' + i + '" aria-label="' + esc(l.title) + '">' + ico + '</button>' +
          '<div class="node-label">' + esc(l.title) + '</div></div>';
        i++;
      });
      html += '</div></section>';
    });
    $('#path').innerHTML = html;
    renderAside();
  }

  function renderAside() {
    const doneN = LESSONS.filter((l) => isDone(l.id)).length;
    const pct = Math.min(100, (S.todayXp / DAILY_GOAL) * 100);
    const next = minsToNextHeart();
    $('#aside').innerHTML =
      '<div class="card"><h3>เป้าหมายวันนี้</h3><div class="goal-row">' + ICON.bolt +
        '<div class="bar"><span style="width:' + pct + '%"></span></div><b>' + S.todayXp + '/' + DAILY_GOAL + ' XP</b></div></div>' +
      '<div class="card"><h3>ความคืบหน้า</h3><ul class="kv">' +
        '<li><span>บทเรียนที่ผ่าน</span><b>' + doneN + '/' + LESSONS.length + '</b></li>' +
        '<li><span>XP สะสม</span><b>' + S.xp + '</b></li>' +
        '<li><span>เรียนต่อเนื่อง</span><b>' + S.streak + ' วัน</b></li>' +
        '<li><span>หัวใจ</span><b>' + S.hearts + '/' + MAX_HEARTS + (next ? ' · +1 ใน ' + next + ' นาที' : '') + '</b></li>' +
      '</ul></div>' +
      '<div class="card"><h3>ตั้งค่า</h3>' +
        '<label class="switch"><input type="checkbox" id="snd"' + (S.sound ? ' checked' : '') + '> เสียงเอฟเฟกต์</label>' +
        '<button class="linkbtn" id="reset">ล้างความคืบหน้าทั้งหมด</button></div>' +
      '<p class="note">คำถามชุดนี้เป็นตัวอย่างสำหรับทดสอบระบบ ควรตรวจกับตำราและข้อกำหนดของ CAAT / ICAO ก่อนใช้งานจริง</p>';
  }

  /* ---------- Lesson ---------- */
  let L = null;

  function startLesson(i) {
    sync();
    if (S.hearts <= 0) return heartsEmpty(false);
    const les = LESSONS[i];
    L = { i, les, queue: shuffle(les.questions.slice()), total: les.questions.length, correct: 0, wrong: 0, xp: 0, start: Date.now(), state: 'answer', sel: null, opts: null };
    $('#quit').innerHTML = ICON.x;
    $('#prog').style.width = '0%';
    renderStats();
    show('lesson');
    nextQuestion();
  }

  function setCheck(label, enabled) { const b = $('#check'); b.textContent = label; b.disabled = !enabled; }

  function nextQuestion() {
    if (!L.queue.length) return finishLesson();
    L.q = L.queue[0]; L.state = 'answer'; L.sel = null; L.opts = null;
    $('#foot').className = 'foot'; $('#fb').innerHTML = '';
    setCheck('ตรวจคำตอบ', false);

    const q = L.q;
    let kind, body;
    if (q.type === 'match') {
      kind = 'จับคู่ให้ถูกต้อง';
      const left = shuffle(q.pairs.map((p, k) => ({ t: p[0], k })));
      const right = shuffle(q.pairs.map((p, k) => ({ t: p[1], k })));
      const col = (arr, side) => '<div class="col">' + arr.map((x) => '<button class="opt" data-side="' + side + '" data-k="' + x.k + '">' + esc(x.t) + '</button>').join('') + '</div>';
      body = '<div class="match">' + col(left, 'l') + col(right, 'r') + '</div>';
      L.matched = 0;
    } else {
      kind = q.type === 'tf' ? 'จริงหรือไม่จริง' : 'เลือกคำตอบที่ถูกต้อง';
      L.opts = q.type === 'tf'
        ? [{ t: 'True — จริง', c: q.a === true }, { t: 'False — ไม่จริง', c: q.a === false }]
        : shuffle(q.o.map((t, j) => ({ t, c: j === q.a })));
      body = '<div class="opts">' + L.opts.map((o, j) => '<button class="opt" data-j="' + j + '"><span class="k">' + (j + 1) + '</span><span>' + esc(o.t) + '</span></button>').join('') + '</div>';
    }
    $('#qbox').innerHTML = '<div class="q-kind">' + kind + '</div><h1 class="q-title">' + esc(q.q) + '</h1>' + body;
  }

  function pickOption(j) {
    if (!L.opts || !L.opts[j]) return;
    L.sel = j;
    $$('#qbox .opt').forEach((b, k) => b.classList.toggle('sel', k === j));
    setCheck('ตรวจคำตอบ', true);
  }

  function pickMatch(b) {
    const side = b.dataset.side;
    const prev = document.querySelector('#qbox .opt.sel[data-side="' + side + '"]');
    if (prev) prev.classList.remove('sel');
    if (prev === b) return;
    b.classList.add('sel');
    const l = document.querySelector('#qbox .opt.sel[data-side="l"]');
    const r = document.querySelector('#qbox .opt.sel[data-side="r"]');
    if (!l || !r) return;
    if (l.dataset.k === r.dataset.k) {
      [l, r].forEach((x) => { x.classList.remove('sel'); x.classList.add('paired'); x.disabled = true; });
      L.matched++;
      if (L.matched === L.q.pairs.length) setTimeout(() => grade(true), 250);
    } else {
      [l, r].forEach((x) => { x.classList.remove('sel'); x.classList.add('shake'); setTimeout(() => x.classList.remove('shake'), 400); });
      tone(false);
    }
  }

  function grade(ok) {
    L.state = 'feedback'; L.ok = ok;
    if (L.opts) {
      $$('#qbox .opt').forEach((b, j) => {
        b.disabled = true; b.classList.remove('sel');
        if (L.opts[j].c) b.classList.add('right'); else if (j === L.sel) b.classList.add('wrong');
      });
    }
    if (ok) { L.correct++; L.xp += XP_PER_Q; } else { L.wrong++; loseHeart(); }
    tone(ok); renderStats();
    $('#prog').style.width = (L.correct / L.total) * 100 + '%';

    const ans = !ok && L.opts ? L.opts.find((o) => o.c).t : '';
    $('#foot').className = 'foot ' + (ok ? 'ok' : 'bad');
    $('#fb').innerHTML =
      '<div class="fb-head"><span class="ico">' + (ok ? ICON.check : ICON.x) + '</span><h4>' + (ok ? pick(PRAISE) : 'ยังไม่ถูก') + '</h4></div>' +
      (ans ? '<p><b>คำตอบที่ถูก:</b> ' + esc(ans) + '</p>' : '') +
      (L.q.ex ? '<p>' + esc(L.q.ex) + '</p>' : '');
    setCheck('ไปต่อ', true);
    $('#check').focus();
  }

  function onCheck() {
    if (!L) return;
    if (L.state === 'answer') {
      if (L.sel == null || !L.opts) return;
      grade(L.opts[L.sel].c);
    } else if (L.state === 'feedback') {
      const q = L.queue.shift();
      if (!L.ok) L.queue.push(q);   // wrong answers come back at the end
      if (S.hearts <= 0) return heartsEmpty(true);
      nextQuestion();
    }
  }

  function finishLesson() {
    const secs = Math.round((Date.now() - L.start) / 1000);
    const acc = Math.round((L.total / (L.total + L.wrong)) * 100);
    sync();
    S.xp += L.xp; S.todayXp += L.xp;
    const prev = S.done[L.les.id];
    S.done[L.les.id] = { best: Math.max(acc, prev ? prev.best : 0), times: (prev ? prev.times : 0) + 1, at: Date.now() };
    let streakUp = false;
    if (S.lastDay !== dayKey()) { S.streak = (S.lastDay === yesterday() ? S.streak : 0) + 1; S.lastDay = dayKey(); streakUp = true; }
    save();

    const i = L.i;
    $('#result-view').innerHTML =
      '<div class="result-in"><div class="trophy">' + ICON.trophy + '</div>' +
      '<h1>' + (acc === 100 ? 'สมบูรณ์แบบ!' : 'จบบทเรียนแล้ว!') + '</h1>' +
      '<p class="muted">' + esc(L.les.unit.title) + ' · ' + esc(L.les.title) + '</p>' +
      '<div class="tiles">' +
        '<div class="tile gold"><span>XP ที่ได้</span><b>' + ICON.bolt + L.xp + '</b></div>' +
        '<div class="tile green"><span>ความแม่นยำ</span><b>' + acc + '%</b></div>' +
        '<div class="tile blue"><span>เวลา</span><b>' + fmtTime(secs) + '</b></div>' +
      '</div>' +
      (streakUp ? '<p class="streak-msg">' + ICON.flame + 'เรียนต่อเนื่อง ' + S.streak + ' วัน</p>' : '') +
      '<div class="result-actions"><button class="btn ghost" id="again">ทำอีกครั้ง</button><button class="btn" id="cont">ไปต่อ</button></div></div>';
    L = null;
    show('result');
    tone(true);
    $('#again').onclick = () => startLesson(i);
    $('#cont').onclick = goHome;
    $('#cont').focus();
  }

  function goHome() { L = null; show('home'); renderHome(); }

  /* ---------- Modal & toast ---------- */
  let modalOutside = null;
  function modal(o) {
    $('#modal-box').innerHTML = '<h3>' + o.title + '</h3><p>' + o.body + '</p><div class="modal-actions"></div>';
    const wrap = $('#modal-box .modal-actions');
    o.actions.forEach((a) => {
      const b = document.createElement('button');
      b.className = 'btn block ' + (a.cls || '');
      b.textContent = a.label;
      b.onclick = () => { closeModal(); if (a.fn) a.fn(); };
      wrap.appendChild(b);
    });
    modalOutside = o.outside || null;
    $('#modal').classList.remove('hidden');
    wrap.firstChild.focus();
  }
  function closeModal() { $('#modal').classList.add('hidden'); modalOutside = null; }
  function dismissModal() { const f = modalOutside; closeModal(); if (f) f(); }

  function askQuit() {
    modal({
      title: 'ออกจากบทเรียน?',
      body: 'ถ้าออกตอนนี้ ความคืบหน้าในบทเรียนนี้จะหายไป',
      actions: [{ label: 'เรียนต่อ' }, { label: 'ออก', cls: 'danger', fn: goHome }]
    });
  }

  function heartsEmpty(inLesson) {
    const back = inLesson ? goHome : null;
    modal({
      title: 'หัวใจหมดแล้ว',
      body: 'หัวใจจะเติม 1 ดวงทุก 30 นาที ดวงถัดไปในอีก ' + minsToNextHeart() + ' นาที',
      actions: [{ label: 'กลับหน้าหลัก', fn: back }],
      outside: back
    });
  }

  let toastTimer;
  function toast(msg) {
    const t = $('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
  }

  /* ---------- Events ---------- */
  $('#path').addEventListener('click', (e) => {
    const n = e.target.closest('.node'); if (!n) return;
    if (n.classList.contains('locked')) return toast('ผ่านบทเรียนก่อนหน้าก่อน แล้วบทนี้จะปลดล็อก');
    startLesson(+n.dataset.i);
  });

  $('#aside').addEventListener('click', (e) => {
    if (e.target.id === 'reset') {
      modal({
        title: 'ล้างความคืบหน้า?',
        body: 'XP, streak และบทเรียนที่ผ่านแล้วทั้งหมดจะถูกลบ',
        actions: [{ label: 'ยกเลิก' }, { label: 'ล้างทั้งหมด', cls: 'danger', fn: () => { S = fresh(); save(); renderHome(); toast('ล้างความคืบหน้าแล้ว'); } }]
      });
    }
  });
  $('#aside').addEventListener('change', (e) => { if (e.target.id === 'snd') { S.sound = e.target.checked; save(); } });

  $('#qbox').addEventListener('click', (e) => {
    const b = e.target.closest('.opt');
    if (!b || !L || L.state !== 'answer' || b.disabled) return;
    if (L.q.type === 'match') pickMatch(b); else pickOption(+b.dataset.j);
  });
  $('#check').addEventListener('click', onCheck);
  $('#quit').addEventListener('click', askQuit);
  $('#modal').addEventListener('click', (e) => { if (e.target.id === 'modal') dismissModal(); });

  document.addEventListener('keydown', (e) => {
    if (!$('#modal').classList.contains('hidden')) { if (e.key === 'Escape') dismissModal(); return; }
    if (!L) return;
    if (e.key === 'Escape') return askQuit();
    if (e.key === 'Enter') { e.preventDefault(); if (!$('#check').disabled) onCheck(); return; }
    if (L.state === 'answer' && L.opts && /^[1-9]$/.test(e.key)) pickOption(+e.key - 1);
  });

  // Refresh hearts timer once a minute while the home page is open
  setInterval(() => { sync(); renderStats(); if (!$('#home-view').classList.contains('hidden')) renderAside(); }, 60000);

  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }

  renderHome();
})();
