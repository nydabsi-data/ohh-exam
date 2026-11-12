/* Ohh-Exam — learning path, lessons, hearts, XP, streak.
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
  const T = (s) => (window.I18N ? window.I18N.t(s) : s);   // for strings outside the DOM (confirm boxes)

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
  // Courses: each has its own learning path. UNITS / LESSONS point at the course being viewed.
  const flatten = (units) => { const out = []; units.forEach((u) => u.lessons.forEach((l) => out.push(Object.assign({}, l, { unit: u })))); return out; };
  const COURSES = {
    pilot:   { units: window.UNITS || [], hash: '#learn', back: '#pilot', note: true },
    physics: { units: window.PHYSICS_UNITS || [], hash: '#learn-physics', back: '#exams' }
  };
  Object.values(COURSES).forEach((c) => { c.lessons = flatten(c.units); });
  // Every question gets a stable key "<lesson id>#<index>" so wrong answers can be practised later.
  const QBANK = {};
  Object.values(COURSES).forEach((c) => c.lessons.forEach((l) => l.questions.forEach((q, k) => {
    q.__key = l.id + '#' + k; QBANK[q.__key] = { q, lesson: l };
  })));
  const ALL_LESSONS = [].concat(...Object.values(COURSES).map((c) => c.lessons));
  let course = 'pilot', UNITS = COURSES.pilot.units, LESSONS = COURSES.pilot.lessons;
  function setCourse(c) { course = COURSES[c] ? c : 'pilot'; UNITS = COURSES[course].units; LESSONS = COURSES[course].lessons; }

  // Difficulty: 1 easy / 2 medium / 3 hard. Harder questions give more XP.
  const DIFF = { 1: { th: 'ง่าย', xp: 10 }, 2: { th: 'ปานกลาง', xp: 15 }, 3: { th: 'ยาก', xp: 20 } };
  const qDiff = (q) => q.d || (q.type === 'mc' ? 2 : 1);
  const lessonDiff = (l) => Math.round(l.questions.reduce((s, q) => s + qDiff(q), 0) / l.questions.length);
  const diffChip = (d) => '<span class="diff d' + d + '">' + DIFF[d].th + '</span>';

  /* ---------- State ---------- */
  const dayKey = (d) => { d = d || new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  const yesterday = () => { const d = new Date(); d.setDate(d.getDate() - 1); return dayKey(d); };
  const freshDaily = () => ({ day: dayKey(), lessons: 0, correct: 0, exams: 0, perfect: 0, claimed: {} });
  // hist: { 'YYYY-MM-DD': xp } · answered/correctTotal: every graded answer · daily: today's mission counters
  const fresh = () => ({ xp: 0, hearts: MAX_HEARTS, heartsAt: Date.now(), streak: 0, lastDay: null, today: dayKey(), todayXp: 0, done: {}, sound: true,
    hist: {}, answered: 0, correctTotal: 0, daily: freshDaily() });

  let S = fresh();
  try { const raw = localStorage.getItem(KEY); if (raw) S = Object.assign(fresh(), JSON.parse(raw)); } catch (e) { /* private mode etc. */ }
  const save = () => {
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ }
    if (sb && user) { clearTimeout(pushTimer); pushTimer = setTimeout(pushRemote, 1500); }
  };

  /* ---------- Supabase: sign-in + progress sync (optional) ---------- */
  const CFG = window.PE_SUPABASE || {};
  const sb = CFG.url && CFG.key && window.supabase ? window.supabase.createClient(CFG.url, CFG.key) : null;
  let user = null, pushTimer = null;
  const uname = () => !user ? '' : (user.user_metadata && user.user_metadata.username) || (user.email || '').split('@')[0];

  async function pushRemote() {
    if (!sb || !user) return;
    const { error } = await sb.from('progress').upsert({ user_id: user.id, state: S, xp: S.xp, updated_at: new Date().toISOString() });
    if (error) console.warn('sync failed', error.message);
  }

  // Combine progress from this device (a) and the account (b) without losing either.
  function merge(a, b) {
    b = Object.assign(fresh(), b);
    const out = Object.assign({}, a);
    out.xp = Math.max(a.xp, b.xp);
    out.done = Object.assign({}, b.done);
    for (const k in a.done) {
      const x = a.done[k], y = out.done[k];
      out.done[k] = !y ? x : { best: Math.max(x.best, y.best), times: Math.max(x.times, y.times), at: Math.max(x.at || 0, y.at || 0) };
    }
    if ((b.lastDay || '') > (a.lastDay || '') || (b.lastDay === a.lastDay && b.streak > a.streak)) { out.streak = b.streak; out.lastDay = b.lastDay; }
    if (b.today === a.today) out.todayXp = Math.max(a.todayXp, b.todayXp);
    else if ((b.today || '') > (a.today || '')) { out.today = b.today; out.todayXp = b.todayXp; }
    if (b.hearts < a.hearts) { out.hearts = b.hearts; out.heartsAt = b.heartsAt; }
    out.hist = Object.assign({}, b.hist);
    for (const d in (a.hist || {})) out.hist[d] = Math.max(a.hist[d], out.hist[d] || 0);
    out.diff = {};
    [1, 2, 3].forEach((k) => {
      const x = (a.diff || {})[k] || { a: 0, c: 0 }, y = (b.diff || {})[k] || { a: 0, c: 0 };
      out.diff[k] = x.a >= y.a ? x : y;
    });
    out.miss = Object.assign({}, b.miss);
    for (const k in (a.miss || {})) { const x = a.miss[k], y = out.miss[k]; out.miss[k] = !y || x.at >= y.at ? x : y; }
    out.answered = Math.max(a.answered || 0, b.answered || 0);
    out.correctTotal = Math.max(a.correctTotal || 0, b.correctTotal || 0);
    const da = a.daily || freshDaily(), db = b.daily || freshDaily();
    if (da.day === db.day) {
      out.daily = { day: da.day, claimed: Object.assign({}, db.claimed, da.claimed) };
      ['lessons', 'correct', 'exams', 'perfect'].forEach((k) => { out.daily[k] = Math.max(da[k] || 0, db[k] || 0); });
    } else out.daily = da.day > db.day ? da : db;
    return out;
  }

  async function pullRemote() {
    if (!sb || !user) return;
    const { data, error } = await sb.from('progress').select('state').eq('user_id', user.id).maybeSingle();
    if (error) { console.warn('load failed', error.message); return; }
    if (data && data.state) S = merge(S, data.state);
    save(); pushRemote();
    if (!L) route();
  }

  function sync() {
    if (S.today !== dayKey()) { S.today = dayKey(); S.todayXp = 0; }
    if (!S.daily || S.daily.day !== dayKey()) S.daily = freshDaily();
    if (!S.hist) S.hist = {};
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
    const ta = $('#top-acct');
    ta.classList.remove('hidden');
    ta.classList.toggle('in', !!user);
    ta.textContent = user ? (uname() || '?').charAt(0).toUpperCase() : 'เข้าสู่ระบบ';
    ta.title = user ? uname() : 'เข้าสู่ระบบเพื่อบันทึกความคืบหน้า';
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
      html += '<section class="unit" style="--c:' + u.color + ';--d:' + u.dark + ';--t:' + (u.text || '#fff') + '">' +
        '<header class="unit-head"><div><small>Unit ' + (ui + 1) + ' · ' + esc(u.th) + '</small><h2>' + esc(u.title) + '</h2></div>' +
        '<span class="unit-tools"><span class="unit-count">' + doneN + '/' + u.lessons.length + '</span>' +
          '<button class="row-arrow" data-dir="-1" aria-label="ก่อนหน้า"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg></button>' +
          '<button class="row-arrow" data-dir="1" aria-label="ถัดไป"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg></button></span>' +
        '</header><div class="lesson-row">';
      // One card per lesson, in a row you swipe sideways
      u.lessons.forEach((l, li) => {
        const st = isDone(l.id) ? 'done' : i === cur ? 'current' : isUnlocked(i) ? 'open' : 'locked';
        const best = st === 'done' ? S.done[l.id].best : 0;
        const foot = st === 'done' ? '<span class="lc-state done">' + ICON.check + '<span>ผ่านแล้ว ' + best + '%</span></span>'
          : st === 'locked' ? '<span class="lc-state locked">' + ICON.lock + '<span>ล็อก</span></span>'
          : '<span class="lc-go">เริ่ม</span>';
        html += '<button class="lesson-card ' + st + '" data-i="' + i + '" aria-label="' + esc(l.title) + '">' +
          '<span class="lc-top"><span class="lc-num">บทที่ ' + (li + 1) + '</span>' + diffChip(lessonDiff(l)) + '</span>' +
          '<span class="lc-ico">' + (st === 'done' ? ICON.check : st === 'locked' ? ICON.lock : ICON.star) + '</span>' +
          '<span class="lc-title">' + esc(l.title) + '</span>' +
          '<span class="lc-meta">' + l.questions.length + ' ข้อ</span>' +
          '<span class="lc-foot">' + foot + '</span></button>';
        i++;
      });
      html += '</div></section>';
    });
    $('#path').innerHTML = html;
    // Bring the next lesson to do into view in its row
    const curCard = $('#path .lesson-card.current');
    if (curCard) { const row = curCard.parentElement; row.scrollLeft = Math.max(0, curCard.offsetLeft - row.offsetLeft - 16); }
    $$('#path .lesson-row').forEach(updateArrows);
    renderAside();
  }
  function updateArrows(row) {
    const btns = row.parentElement.querySelectorAll('.row-arrow');
    const more = row.scrollWidth - row.clientWidth > 4;
    btns.forEach((b) => {
      b.classList.toggle('hidden', !more);
      b.disabled = +b.dataset.dir < 0 ? row.scrollLeft <= 2 : row.scrollLeft + row.clientWidth >= row.scrollWidth - 2;
    });
  }

  function renderAside() {
    const doneN = LESSONS.filter((l) => isDone(l.id)).length;
    const pct = Math.min(100, (S.todayXp / DAILY_GOAL) * 100);
    const next = minsToNextHeart();
    const acct = user
      ? '<div class="card"><h3>บัญชี</h3><p class="acct">' + esc(uname()) + '</p><p class="note flat">ความคืบหน้าซิงก์อัตโนมัติ ใช้ได้ทุกอุปกรณ์</p><button class="linkbtn" id="logout">ออกจากระบบ</button></div>'
      : '<div class="card"><h3>บันทึกความคืบหน้า</h3><p class="note flat">เข้าสู่ระบบเพื่อเก็บ XP และบทเรียนไว้ในบัญชี ใช้ต่อได้ทุกอุปกรณ์</p><button class="btn block" id="login">เข้าสู่ระบบ / สมัคร</button></div>';
    $('#aside').innerHTML = acct +
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
      (COURSES[course].note ? '<p class="note">คำถามชุดนี้เป็นตัวอย่างสำหรับทดสอบระบบ ควรตรวจกับตำราและข้อกำหนดของ CAAT / ICAO ก่อนใช้งานจริง</p>' : '') +
      '<p class="note">ระดับความยาก: ง่าย +10 XP · ปานกลาง +15 XP · ยาก +20 XP ต่อข้อ</p>';
  }

  /* ---------- Lesson ---------- */
  let L = null;

  function startLesson(i) {
    sync();
    if (S.hearts <= 0) return heartsEmpty(false);
    const les = LESSONS[i];
    L = { i, les, queue: shuffle(les.questions.slice()), total: les.questions.length, correct: 0, wrong: 0, xp: 0, start: Date.now(), state: 'answer', sel: null, opts: null };
    openLesson();
  }
  // Practice: a mixed set of questions; no hearts lost, lessons are not marked as passed.
  function startPractice(questions, title) {
    if (!questions.length) return toast('ยังไม่มีข้อให้ฝึก');
    sync();
    const qs = shuffle(questions.slice()).slice(0, 10);
    L = { i: null, practice: { title, src: questions }, les: { id: null, title, unit: { title: 'Practice' } },
          queue: qs, total: qs.length, correct: 0, wrong: 0, xp: 0, start: Date.now(), state: 'answer', sel: null, opts: null };
    openLesson();
  }
  function openLesson() {
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
      const col = (arr, side) => '<div class="col">' + arr.map((x) => '<button class="opt no-i18n" data-side="' + side + '" data-k="' + x.k + '">' + esc(x.t) + '</button>').join('') + '</div>';
      body = '<div class="match">' + col(left, 'l') + col(right, 'r') + '</div>';
      L.matched = 0;
    } else {
      kind = q.type === 'tf' ? 'จริงหรือไม่จริง' : 'เลือกคำตอบที่ถูกต้อง';
      L.opts = q.type === 'tf'
        ? [{ t: 'True — จริง', c: q.a === true }, { t: 'False — ไม่จริง', c: q.a === false }]
        : shuffle(q.o.map((t, j) => ({ t, c: j === q.a })));
      body = '<div class="opts">' + L.opts.map((o, j) => '<button class="opt" data-j="' + j + '"><span class="k">' + (j + 1) + '</span><span' + (q.type === 'tf' ? '' : ' class="no-i18n"') + '>' + esc(o.t) + '</span></button>').join('') + '</div>';
    }
    // Question text and answer options are content, not UI: the TH/EN switch leaves them as written.
    $('#qbox').innerHTML = '<div class="q-kind">' + kind + ' ' + diffChip(qDiff(q)) + '</div><h1 class="q-title no-i18n">' + esc(q.q) + '</h1>' + body;
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
    const d = qDiff(L.q);
    if (ok) { L.correct++; L.xp += DIFF[d].xp; } else { L.wrong++; if (!L.practice) loseHeart(); }
    // Remember mistakes; a question leaves the list after it is answered right twice
    S.miss = S.miss || {};
    const key = L.q.__key;
    if (key) {
      if (!ok) S.miss[key] = { n: ((S.miss[key] && S.miss[key].n) || 0) + 1, ok: 0, at: Date.now() };
      else if (S.miss[key]) { S.miss[key].ok++; S.miss[key].at = Date.now(); if (S.miss[key].ok >= 2) delete S.miss[key]; }
    }
    S.answered = (S.answered || 0) + 1;
    if (ok) { S.correctTotal = (S.correctTotal || 0) + 1; S.daily.correct++; }
    S.diff = S.diff || {};
    S.diff[d] = S.diff[d] || { a: 0, c: 0 };
    S.diff[d].a++; if (ok) S.diff[d].c++;
    tone(ok); renderStats();
    $('#prog').style.width = (L.correct / L.total) * 100 + '%';

    const ans = !ok && L.opts ? L.opts.find((o) => o.c).t : '';
    $('#foot').className = 'foot ' + (ok ? 'ok' : 'bad');
    $('#fb').innerHTML =
      '<div class="fb-head"><span class="ico">' + (ok ? ICON.check : ICON.x) + '</span><h4>' + (ok ? pick(PRAISE) : 'ยังไม่ถูก') + '</h4></div>' +
      (ans ? '<p><b>คำตอบที่ถูก:</b> ' + (L.q.type === 'tf' ? esc(ans) : '<span class="no-i18n">' + esc(ans) + '</span>') + '</p>' : '') +
      (L.q.ex ? '<p class="no-i18n">' + esc(L.q.ex) + '</p>' : '');
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
    S.hist[dayKey()] = (S.hist[dayKey()] || 0) + L.xp;
    S.daily.lessons++;
    if (acc === 100 && !L.practice) S.daily.perfect++;
    if (!L.practice) {
      const prev = S.done[L.les.id];
      S.done[L.les.id] = { best: Math.max(acc, prev ? prev.best : 0), times: (prev ? prev.times : 0) + 1, at: Date.now() };
    }
    let streakUp = false;
    if (S.lastDay !== dayKey()) { S.streak = (S.lastDay === yesterday() ? S.streak : 0) + 1; S.lastDay = dayKey(); streakUp = true; }
    save();

    const i = L.i, practice = L.practice;
    $('#result-view').innerHTML =
      '<div class="result-in"><div class="trophy">' + ICON.trophy + '</div>' +
      '<h1>' + (acc === 100 ? 'สมบูรณ์แบบ!' : practice ? 'ฝึกเสร็จแล้ว!' : 'จบบทเรียนแล้ว!') + '</h1>' +
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
    $('#again').onclick = () => practice ? startPractice(practice.src, practice.title) : startLesson(i);
    $('#cont').onclick = goHome;
    $('#cont').focus();
  }

  function goHome() { L = null; show('home'); route(); }

  /* ---------- Exam hub (card picker after login) ---------- */
  const EX_ICON = {
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"><path d="M4 5a2 2 0 0 1 2-2h13v15H6a2 2 0 0 0-2 2zM4 20a2 2 0 0 0 2 2h13v-4"/></svg>',
    series: '<svg viewBox="0 0 24 24"><text x="12" y="16.5" text-anchor="middle" font-size="11" font-weight="900" font-family="Nunito,sans-serif" fill="currentColor">123</text></svg>',
    stick: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 17h14a2 2 0 0 1 2 2v2H3v-2a2 2 0 0 1 2-2z"/><rect x="10.8" y="8" width="2.4" height="9" rx="1"/><circle cx="12" cy="6" r="4"/></svg>',
    multi: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2" opacity=".5"/></svg>',
    plane: ICON.plane,
    puzzle: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 3a2 2 0 0 1 4 0v2h4a1 1 0 0 1 1 1v4h-1a2 2 0 0 0 0 4h1v4a1 1 0 0 1-1 1h-4v-1a2 2 0 0 0-4 0v1H6a1 1 0 0 1-1-1v-4h1a2 2 0 0 0 0-4H5V6a1 1 0 0 1 1-1h4z"/></svg>',
    math: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M5 7h6M8 4v6M14 7h6M5.5 15.5l5 5M10.5 15.5l-5 5M14 16h6M14 20h6"/></svg>'
  };
  const EXAMS = [
    { id: 'learn', title: 'Pilot Knowledge', th: 'ความรู้นักบิน แบบบทเรียนสั้น', icon: 'book', color: '#1CB0F6', dark: '#1899D6', text: '#fff', href: '#learn', meta: ['6 วิชา', 'XP · Streak'] },
    { id: 'series', title: 'Series Number', th: 'หาตัวเลขถัดไปในอนุกรม', icon: 'series', color: '#FF4B4B', dark: '#E03A3A', text: '#fff', href: 'exams/series/', meta: ['15 ข้อ', '6 นาที'] },
    { id: 'math', title: 'Math Test', th: 'คณิตศาสตร์สำหรับนักบิน', icon: 'math', color: '#FF9600', dark: '#E07F00', text: '#fff', href: 'exams/math/', meta: ['20 ข้อ', '30 นาที'] },
    { id: 'rotation', title: 'Aircraft Rotation', th: 'อ่านทิศทางและการหมุนของเครื่องบิน', icon: 'plane', color: '#A570FF', dark: '#8549E8', text: '#fff', href: 'exams/rotation/', meta: ['12 ข้อ', '3 นาที'] },
    { id: 'jigsaw', title: 'Spatial Jigsaw', th: 'มิติสัมพันธ์ ประกอบชิ้นส่วนภาพ', icon: 'puzzle', color: '#E5279B', dark: '#C21A80', text: '#fff', href: 'exams/jigsaw/', meta: ['10 ข้อ', '3 นาที'] },
    { id: 'joystick', title: 'Joy Stick', th: 'ควบคุมและความแม่นยำ', icon: 'stick', color: '#00B4E6', dark: '#0094C2', text: '#fff', href: 'exams/joystick/', meta: ['90 วินาที'] },
    { id: 'multitask', title: 'Multitask', th: 'ทำหลายอย่างพร้อมกัน', icon: 'multi', color: '#FF86D0', dark: '#E865B5', text: '#fff', href: 'exams/multitask/', meta: ['5 นาที'] }
  ];

  // Modes on the home page. Each mode groups its own exam cards (only "Pilot" for now).
  const MODES = [
    { id: 'pilot', title: 'Pilot', th: 'ความรู้นักบินและแบบทดสอบความถนัด', icon: 'plane', color: '#1CB0F6', dark: '#1899D6', text: '#fff', href: '#pilot', items: EXAMS, course: 'pilot' },
    { id: 'physics', title: 'ฟิสิกส์ ม.ปลาย', th: 'กลศาสตร์ คลื่น ไฟฟ้า และฟิสิกส์ยุคใหม่', icon: 'atom', color: '#A570FF', dark: '#8549E8', text: '#fff', href: '#learn-physics', course: 'physics',
      items: (window.PHYSICS_UNITS || []).map((u) => ({ title: u.title, color: u.color, sym: u.sym })) }
  ];
  EX_ICON.atom = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/><circle cx="12" cy="12" r="1.8" fill="currentColor"/></svg>';
  const doneIn = (c) => COURSES[c].lessons.filter((l) => isDone(l.id)).length;

  function renderHub(sub) {
    const doneN = doneIn('pilot');
    const mode = sub && MODES.find((m) => m.id === sub);
    $('#hub-hello').textContent = mode ? 'โหมด ' + mode.title : (user ? 'สวัสดี ' + uname() : 'สวัสดีผู้เยี่ยมชม');
    $('#hub-title').textContent = mode ? mode.title : 'เลือกโหมดที่จะฝึก';
    $('#exam-grid').classList.toggle('modes', !mode);
    if (!mode) {
      $('#exam-grid').innerHTML = MODES.map((m) =>
        '<a class="exam-card mode-card" href="' + m.href + '" style="--c:' + m.color + ';--d:' + m.dark + '">' +
          '<span class="mc-deco">' + EX_ICON[m.icon] + '</span>' +
          '<span class="mc-top"><span class="mc-ico">' + EX_ICON[m.icon] + '</span>' +
            '<span><b class="mc-title">' + esc(m.title) + '</b><br><span class="mc-sub">' + esc(T(m.th)) + '</span></span></span>' +
          '<span class="mode-chips">' + m.items.map((x) => '<span class="chip-ico" title="' + esc(x.title) + '" style="--c:' + x.color + '">' + (x.icon ? EX_ICON[x.icon] : '<b>' + esc(x.sym) + '</b>') + '</span>').join('') + '</span>' +
          '<span class="mc-foot"><span class="mc-meta">' +
            (m.id === 'pilot' ? m.items.length + ' ' + T('ชุดข้อสอบ') : m.items.length + ' ' + T('บท')) + ' · ' + T('บทเรียนผ่าน') + ' ' + doneIn(m.course) + '/' + COURSES[m.course].lessons.length + '</span>' +
          '</span></a>').join('');
      return;
    }
    $('#exam-grid').innerHTML = mode.items.map((x) => {
      const extra = x.id === 'learn'
        ? '<span class="ex-prog"><span class="bar"><span style="width:' + (doneN / COURSES.pilot.lessons.length) * 100 + '%"></span></span><b>' + doneN + '/' + COURSES.pilot.lessons.length + '</b></span>'
        : '';
      return '<a class="exam-card" href="' + x.href + '" style="--c:' + x.color + ';--d:' + x.dark + ';--t:' + x.text + '">' +
        '<span class="ex-ico">' + EX_ICON[x.icon] + '</span>' +
        '<span class="ex-body"><b class="ex-title">' + esc(x.title) + '</b><span class="ex-th">' + esc(x.th) + '</span>' +
        '<span class="ex-meta">' + x.meta.map((m) => '<i>' + esc(m) + '</i>').join('') + '</span>' + extra + '</span>' +
        '<span class="ex-go">เริ่ม</span></a>';
    }).join('');
  }

  /* ---------- Missions (tab 2) ---------- */
  const MISSIONS = [
    { id: 'lesson1', title: 'จบบทเรียน 1 บท', need: 1, get: () => S.daily.lessons, xp: 10 },
    { id: 'xp50', title: 'สะสม 50 XP วันนี้', need: DAILY_GOAL, get: () => S.todayXp, xp: 20 },
    { id: 'correct15', title: 'ตอบถูก 15 ข้อ', need: 15, get: () => S.daily.correct, xp: 15 },
    { id: 'exam1', title: 'ลองทำแบบทดสอบ 1 ชุด', need: 1, get: () => S.daily.exams, xp: 10 },
    { id: 'perfect', title: 'ทำบทเรียนได้ 100%', need: 1, get: () => S.daily.perfect, xp: 25 }
  ];
  const claimable = () => MISSIONS.filter((m) => m.get() >= m.need && !S.daily.claimed[m.id]).length;
  const TAB_ICON = {
    home: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3 3 10.5V20a1 1 0 0 0 1 1h5v-6h6v6h5a1 1 0 0 0 1-1v-9.5z"/></svg>',
    missions: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/></svg>',
    stats: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="12" width="4.5" height="9" rx="1.5"/><rect x="9.75" y="7" width="4.5" height="14" rx="1.5"/><rect x="16.5" y="3" width="4.5" height="18" rx="1.5"/></svg>',
    profile: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="8" r="4.5"/><path d="M3.5 21a8.5 8.5 0 0 1 17 0z"/></svg>'
  };

  function renderMissions() {
    const left = Math.max(0, Math.ceil((new Date(new Date().setHours(24, 0, 0, 0)) - Date.now()) / 3600000));
    const doneN = MISSIONS.filter((m) => S.daily.claimed[m.id]).length;
    $('#mission-list').innerHTML =
      '<div class="page-banner"><p>ภารกิจประจำวัน · รีเซ็ตในอีก ' + left + ' ชม.</p><h1>ภารกิจวันนี้</h1>' +
        '<div class="banner-row"><span>' + ICON.flame + 'ต่อเนื่อง ' + S.streak + ' วัน</span><span>' + ICON.check + 'สำเร็จ ' + doneN + '/' + MISSIONS.length + '</span></div></div>' +
      MISSIONS.map((m) => {
        const v = Math.min(m.need, m.get()), full = v >= m.need, got = !!S.daily.claimed[m.id];
        return '<div class="mission' + (got ? ' got' : '') + '">' +
          '<span class="m-ico">' + (got ? ICON.check : TAB_ICON.missions) + '</span>' +
          '<div class="m-body"><b>' + esc(m.title) + '</b>' +
            '<div class="m-prog"><div class="bar"><span style="width:' + (v / m.need) * 100 + '%"></span></div><i>' + v + '/' + m.need + '</i></div></div>' +
          (got ? '<span class="m-done">รับแล้ว</span>'
            : '<button class="btn m-claim" data-m="' + m.id + '"' + (full ? '' : ' disabled') + '>+' + m.xp + ' XP</button>') +
          '</div>';
      }).join('');
  }

  /* ---------- Practice (tab 2): wrong answers and weak spots ---------- */
  function missedQuestions() {
    return Object.keys(S.miss || {}).filter((k) => QBANK[k])
      .sort((a, b) => S.miss[b].n - S.miss[a].n || S.miss[b].at - S.miss[a].at).map((k) => QBANK[k].q);
  }
  function weakLessons() {
    const misses = {};
    Object.keys(S.miss || {}).forEach((k) => { if (QBANK[k]) { const id = QBANK[k].lesson.id; misses[id] = (misses[id] || 0) + S.miss[k].n; } });
    return ALL_LESSONS
      .filter((l) => misses[l.id] || (isDone(l.id) && S.done[l.id].best < 80))
      .map((l) => ({ l, miss: misses[l.id] || 0, best: isDone(l.id) ? S.done[l.id].best : null }))
      .sort((a, b) => b.miss - a.miss || (a.best == null ? 101 : a.best) - (b.best == null ? 101 : b.best));
  }
  const PR_ICON = {
    redo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4v5h5"/></svg>',
    target: TAB_ICON.missions,
    shuffle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/></svg>'
  };
  let practiceSets = {};
  function renderPractice() {
    const missed = missedQuestions();
    const weak = weakLessons();
    const weakQs = [].concat(...weak.slice(0, 3).map((w) => w.l.questions));
    const reviewQs = [].concat(...ALL_LESSONS.filter((l) => isDone(l.id)).map((l) => l.questions));
    practiceSets = { missed, weak: weakQs, review: reviewQs };
    const tile = (id, icon, title, sub, n, cls) =>
      '<button class="pr-tile ' + cls + '" data-p="' + id + '"' + (n ? '' : ' disabled') + '>' +
        '<span class="pr-ico">' + PR_ICON[icon] + '</span><span class="pr-body"><b>' + title + '</b><i>' + sub + '</i></span>' +
        '<span class="pr-count">' + n + ' <small>ข้อ</small></span></button>';
    $('#practice-body').innerHTML =
      '<div class="page-banner"><p>ไม่เสียหัวใจ · ได้ XP ตามระดับความยาก</p><h1>Practice</h1></div>' +
      '<div class="pr-tiles">' +
        tile('missed', 'redo', 'ฝึกข้อที่ตอบผิด', missed.length ? 'ตอบถูก 2 ครั้งแล้วข้อจะหายจากรายการ' : 'ยังไม่มีข้อที่ตอบผิด', missed.length, 't-red') +
        tile('weak', 'target', 'ฝึกจุดอ่อน', weak.length ? 'รวมข้อจากบทที่ยังทำได้ไม่ดี' : 'ยังไม่พบจุดอ่อน', weak.length ? weakQs.length : 0, 't-orange') +
        tile('review', 'shuffle', 'ทบทวนแบบสุ่ม', reviewQs.length ? 'สุ่ม 10 ข้อจากบทที่ผ่านแล้ว' : 'ผ่านบทเรียนก่อนแล้วจะทบทวนได้', reviewQs.length, 't-sky') +
      '</div>' +
      '<div class="card"><h3>บทที่ยังอ่อน</h3>' +
        (weak.length ? weak.slice(0, 6).map((w) =>
          '<button class="weak-row" data-lesson="' + w.l.id + '"><span class="wr-dot" style="--c:' + w.l.unit.color + '"></span>' +
          '<span class="wr-body"><b>' + esc(w.l.title) + '</b><i>' + esc(w.l.unit.title) + '</i></span>' +
          '<span class="wr-stat">' + (w.miss ? 'ผิด ' + w.miss + ' ครั้ง' : '') + (w.miss && w.best != null ? ' · ' : '') + (w.best != null ? 'แม่นยำ ' + w.best + '%' : '') + '</span>' +
          '<span class="wr-go">ฝึก</span></button>').join('')
          : '<p class="note flat">ยังไม่มี ทำบทเรียนไปสักพักแล้วระบบจะบอกว่าบทไหนควรฝึกเพิ่ม</p>') +
      '</div>';
  }

  /* ---------- Score & performance (tab 3) ---------- */
  function renderPerf() {
    const doneN = ALL_LESSONS.filter((l) => isDone(l.id)).length;
    const acc = S.answered ? Math.round((S.correctTotal / S.answered) * 100) : null;
    const days = [];
    for (let k = 6; k >= 0; k--) { const d = new Date(); d.setDate(d.getDate() - k); days.push(d); }
    const vals = days.map((d) => S.hist[dayKey(d)] || 0), max = Math.max(50, ...vals);
    const WD = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
    const bars = days.map((d, k) =>
      '<div class="col"><div class="track"><span class="v" style="height:' + (vals[k] / max) * 100 + '%" data-tip="' + vals[k] + ' XP"></span></div>' +
      '<i class="' + (k === 6 ? 'today' : '') + '">' + WD[d.getDay()] + '</i></div>').join('');
    const unitRows = (units) => units.map((u) => {
      const ls = u.lessons.filter((l) => isDone(l.id));
      const best = ls.length ? Math.round(ls.reduce((s, l) => s + S.done[l.id].best, 0) / ls.length) : 0;
      const pct = (ls.length / u.lessons.length) * 100;
      return '<div class="mrow"><div class="mrow-top"><b>' + esc(u.title) + '</b><span>' + ls.length + '/' + u.lessons.length + ' บท' + (ls.length ? ' · แม่นยำ ' + best + '%' : '') + '</span></div>' +
        '<div class="bar"><span style="width:' + pct + '%"></span></div></div>';
    }).join('');
    const units = '<h4 class="course-h">Pilot</h4>' + unitRows(COURSES.pilot.units) +
      '<h4 class="course-h">ฟิสิกส์ ม.ปลาย</h4>' + unitRows(COURSES.physics.units);
    // Accuracy by difficulty (one bar per level, value written next to it)
    const diffRows = [1, 2, 3].map((k) => {
      const x = (S.diff || {})[k] || { a: 0, c: 0 };
      const p = x.a ? Math.round((x.c / x.a) * 100) : 0;
      return '<div class="mrow"><div class="mrow-top"><b>' + diffChip(k) + '</b><span>' + (x.a ? p + '% · ' + x.c + '/' + x.a : '–') + '</span></div>' +
        '<div class="bar diff-bar d' + k + '"><span style="width:' + p + '%"></span></div></div>';
    }).join('');
    const week = vals.reduce((a, b) => a + b, 0);
    $('#perf-body').innerHTML =
      '<div class="page-banner"><p>ผลคะแนนและพัฒนาการของคุณ</p><h1>Performance</h1></div>' +
      '<div class="kpis">' +
        '<div class="kpi"><span>XP สะสม</span><b>' + S.xp + '</b></div>' +
        '<div class="kpi"><span>ความแม่นยำ</span><b>' + (acc == null ? '–' : acc + '%') + '</b></div>' +
        '<div class="kpi"><span>เรียนต่อเนื่อง</span><b>' + S.streak + ' <small>วัน</small></b></div>' +
        '<div class="kpi"><span>บทเรียนที่ผ่าน</span><b>' + doneN + '<small>/' + ALL_LESSONS.length + '</small></b></div>' +
      '</div>' +
      '<div class="card"><div class="card-head"><h3>XP 7 วันล่าสุด</h3><span>รวม ' + week + ' XP</span></div><div class="xpchart" role="img" aria-label="XP 7 วันล่าสุด: ' + vals.join(', ') + '">' + bars + '</div></div>' +
      '<div class="card"><div class="card-head"><h3>ความแม่นยำตามระดับความยาก</h3><span>ง่าย 10 · ปานกลาง 15 · ยาก 20 XP</span></div>' + diffRows + '</div>' +
      '<div class="card"><h3>ความคืบหน้ารายวิชา</h3>' + units + '</div>' +
      '<p class="note">คะแนนจากแบบทดสอบ 6 ชุด (Series Number, Math ฯลฯ) จะแสดงที่นี่ในขั้นถัดไป</p>';
  }

  /* ---------- Profile (tab 4) ---------- */
  let isAdmin = false;
  function renderProfile() {
    const name = user ? uname() : T('ผู้เยี่ยมชม');
    $('#profile-body').innerHTML =
      '<div class="profile-card"><span class="avatar">' + esc(name.charAt(0).toUpperCase()) + '</span>' +
        '<div><h1>' + esc(name) + '</h1><p>' + (user ? esc(user.email || '') : 'ยังไม่ได้เข้าสู่ระบบ ความคืบหน้าเก็บในเครื่องนี้') + '</p>' +
        (isAdmin ? '<span class="role-badge">Super admin</span>' : '') + '</div></div>' +
      (isAdmin ? '<button class="admin-entry" id="open-mgmt"><span class="ae-ico">' + TAB_ICON.stats + '</span><span><b>Management</b><i>จัดการผู้ใช้และดูภาพรวมระบบ</i></span><span class="ae-go">เปิด</span></button>' : '') +
      '<div class="card"><h3>ตั้งค่า</h3>' +
        '<label class="switch"><input type="checkbox" id="snd2"' + (S.sound ? ' checked' : '') + '> เสียงเอฟเฟกต์</label>' +
        '<button class="linkbtn" id="reset2">ล้างความคืบหน้าทั้งหมด</button></div>' +
      (user ? '<button class="btn danger block" id="logout2">ออกจากระบบ</button>'
            : '<button class="btn block" id="login2">เข้าสู่ระบบ / สมัครสมาชิก</button>');
  }

  /* ---------- Management pop-up (super admin) ---------- */
  async function openManagement() {
    const box = $('#modal-box');
    box.classList.add('wide');
    box.innerHTML = '<button class="mx" id="mx" aria-label="ปิด">' + ICON.x + '</button><h3>Management</h3>' +
      '<div class="tabs mg-tabs"><button class="on" data-mg="users">ผู้ใช้</button><button data-mg="overview">ภาพรวม</button></div>' +
      '<div id="mg-body" class="mg-body"><p class="note">กำลังโหลด...</p></div>';
    $('#modal').classList.remove('hidden');
    modalOutside = null;
    modalGuard = () => confirm(T('ออกจากหน้า Management?'));
    $('#mx').onclick = closeModal;
    const { data, error } = await sb.rpc('admin_list_users');
    if (error) {
      $('#mg-body').innerHTML = '<p class="form-msg err">โหลดข้อมูลไม่ได้: ' + esc(error.message) + '</p><p class="note">ถ้ายังไม่ได้ติดตั้งฟังก์ชัน admin ให้รันไฟล์ database/admin.sql ใน Supabase SQL Editor</p>';
      return;
    }
    const users = data || [];
    const fmt = (t) => t ? new Date(t).toLocaleDateString(window.I18N && window.I18N.lang === 'en' ? 'en-GB' : 'th-TH', { day: 'numeric', month: 'short', year: '2-digit' }) : '–';
    const today = dayKey();
    const views = {
      users: () => '<div class="mg-table-wrap"><table class="mg-table"><thead><tr><th>ผู้ใช้</th><th>XP</th><th>สมัครเมื่อ</th><th>ใช้งานล่าสุด</th><th>สิทธิ์</th></tr></thead><tbody>' +
        users.map((u) => '<tr><td><b>' + esc(u.username) + '</b><small>' + esc(u.email) + '</small></td><td>' + u.xp + '</td><td>' + fmt(u.created_at) + '</td><td>' + fmt(u.last_sign_in_at) + '</td>' +
          '<td>' + (u.id === user.id ? '<span class="role-badge">Super admin</span>'
            : '<select class="role-sel" data-uid="' + u.id + '"><option value="user"' + (u.role === 'user' ? ' selected' : '') + '>User</option><option value="super_admin"' + (u.role === 'super_admin' ? ' selected' : '') + '>Super admin</option></select>') +
          '</td></tr>').join('') + '</tbody></table></div>',
      overview: () => {
        const active = users.filter((u) => u.last_sign_in_at && dayKey(new Date(u.last_sign_in_at)) === today).length;
        const xp = users.reduce((s, u) => s + (u.xp || 0), 0);
        return '<div class="kpis">' +
          '<div class="kpi"><span>สมาชิกทั้งหมด</span><b>' + users.length + '</b></div>' +
          '<div class="kpi"><span>เข้าใช้วันนี้</span><b>' + active + '</b></div>' +
          '<div class="kpi"><span>Super admin</span><b>' + users.filter((u) => u.role === 'super_admin').length + '</b></div>' +
          '<div class="kpi"><span>XP รวมทุกคน</span><b>' + xp + '</b></div></div>';
      }
    };
    const showMg = (k) => {
      document.querySelectorAll('.mg-tabs button').forEach((b) => b.classList.toggle('on', b.dataset.mg === k));
      $('#mg-body').innerHTML = views[k]();
    };
    document.querySelectorAll('.mg-tabs button').forEach((b) => b.onclick = () => showMg(b.dataset.mg));
    $('#mg-body').onchange = async (e) => {
      const sel = e.target.closest('.role-sel'); if (!sel) return;
      const { error: err } = await sb.rpc('admin_set_role', { p_user: sel.dataset.uid, p_role: sel.value });
      if (err) { toast('เปลี่ยนสิทธิ์ไม่ได้: ' + err.message); return; }
      const u = users.find((x) => x.id === sel.dataset.uid); if (u) u.role = sel.value;
      toast('อัปเดตสิทธิ์แล้ว');
    };
    showMg('users');
  }

  /* ---------- Router: bottom tab bar ---------- */
  const PAGES = { '#learn': 'learn', '#learn-physics': 'learn', '#practice': 'practice', '#missions': 'missions', '#stats': 'stats', '#profile': 'profile' };
  function route() {
    if (L) return;
    const page = PAGES[location.hash] || 'hub';
    const sub = location.hash === '#pilot' ? 'pilot' : null;
    if (page === 'learn') setCourse(location.hash === '#learn-physics' ? 'physics' : 'pilot');
    show('home');
    ['hub', 'learn', 'practice', 'missions', 'stats', 'profile'].forEach((p) => $('#' + p).classList.toggle('hidden', p !== page));
    // Back arrow: Pilot lessons → Pilot page, physics lessons / Pilot page → mode picker
    $('#to-hub').classList.toggle('hidden', !(page === 'learn' || sub));
    $('#to-hub').setAttribute('href', page === 'learn' ? COURSES[course].back : '#exams');
    const tab = page === 'learn' || page === 'hub' ? 'home' : page;
    $$('#tabbar a').forEach((a) => a.classList.toggle('on', a.dataset.tab === tab));
    sync(); renderStats();
    if (page === 'learn') renderHome();
    else if (page === 'missions') renderMissions();
    else if (page === 'stats') renderPerf();
    else if (page === 'profile') renderProfile();
    else if (page === 'practice') renderPractice();
    else renderHub(sub);
    $('#tab-dot').classList.toggle('hidden', !claimable());
    $('#tab-dot-p').classList.toggle('hidden', !Object.keys(S.miss || {}).some((k) => QBANK[k]));
  }
  window.addEventListener('hashchange', () => { if (!L) route(); });
  window.addEventListener('langchange', () => { if (!L) route(); });

  $('#practice').addEventListener('click', (e) => {
    const t = e.target.closest('.pr-tile');
    if (t && !t.disabled) {
      const titles = { missed: 'ฝึกข้อที่ตอบผิด', weak: 'ฝึกจุดอ่อน', review: 'ทบทวนแบบสุ่ม' };
      return startPractice(practiceSets[t.dataset.p] || [], titles[t.dataset.p]);
    }
    const w = e.target.closest('.weak-row');
    if (w) { const l = ALL_LESSONS.find((x) => x.id === w.dataset.lesson); if (l) startPractice(l.questions, l.title); }
  });
  $('#mission-list').addEventListener('click', (e) => {
    const b = e.target.closest('.m-claim'); if (!b || b.disabled) return;
    const m = MISSIONS.find((x) => x.id === b.dataset.m); if (!m || S.daily.claimed[m.id]) return;
    S.daily.claimed[m.id] = true; S.xp += m.xp; S.hist[dayKey()] = (S.hist[dayKey()] || 0) + m.xp;
    save(); tone(true); toast('ได้รับ +' + m.xp + ' XP'); route();
  });
  $('#exam-grid').addEventListener('click', (e) => {
    const a = e.target.closest('.exam-card'); if (!a || a.getAttribute('href').charAt(0) === '#') return;
    S.daily.exams++; save();
  });
  $('#profile').addEventListener('click', (e) => {
    const id = e.target.closest('button') && e.target.closest('button').id;
    if (id === 'open-mgmt') openManagement();
    else if (id === 'logout2') signOut();
    else if (id === 'login2') gotoLogin();
    else if (id === 'reset2') askReset();
  });
  $('#profile').addEventListener('change', (e) => { if (e.target.id === 'snd2') { S.sound = e.target.checked; save(); } });

  /* ---------- Modal & toast ---------- */
  let modalOutside = null, modalGuard = null;
  function modal(o) {
    $('#modal-box').classList.remove('wide');
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
  function closeModal() { $('#modal').classList.add('hidden'); $('#modal-box').classList.remove('wide'); modalOutside = null; modalGuard = null; }
  function dismissModal() {
    if (modalGuard && !modalGuard()) return;   // form pop-ups ask before leaving
    const f = modalOutside; closeModal(); if (f) f();
  }

  const gotoLogin = () => { location.href = 'login.html'; };

  function openAccount() {
    if (!user) return gotoLogin();
    modal({
      title: 'บัญชีของคุณ',
      body: esc(uname()) + '<br>ความคืบหน้าซิงก์อัตโนมัติ',
      actions: [{ label: 'ปิด' }, { label: 'ออกจากระบบ', cls: 'danger', fn: signOut }]
    });
  }
  async function signOut() {
    try { if (sb) await sb.auth.signOut(); } catch (e) { /* offline */ }
    try { localStorage.removeItem('ohh_guest'); } catch (e) { /* ignore */ }
    location.replace('login.html');
  }

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
    const arrow = e.target.closest('.row-arrow');
    if (arrow) {
      const row = arrow.closest('.unit').querySelector('.lesson-row');
      row.scrollBy({ left: +arrow.dataset.dir * (row.clientWidth * 0.8), behavior: 'smooth' });
      return;
    }
    const n = e.target.closest('.lesson-card'); if (!n) return;
    if (n.classList.contains('locked')) return toast('ผ่านบทเรียนก่อนหน้าก่อน แล้วบทนี้จะปลดล็อก');
    startLesson(+n.dataset.i);
  });
  $('#path').addEventListener('scroll', (e) => { if (e.target.classList && e.target.classList.contains('lesson-row')) updateArrows(e.target); }, true);
  window.addEventListener('resize', () => $$('#path .lesson-row').forEach(updateArrows));

  function askReset() {
    modal({
      title: 'ล้างความคืบหน้า?',
      body: 'XP, streak และบทเรียนที่ผ่านแล้วทั้งหมดจะถูกลบ',
      actions: [{ label: 'ยกเลิก' }, { label: 'ล้างทั้งหมด', cls: 'danger', fn: () => { S = fresh(); save(); route(); toast('ล้างความคืบหน้าแล้ว'); } }]
    });
  }
  $('#top-acct').addEventListener('click', () => { if (user) location.hash = '#profile'; else gotoLogin(); });
  $('#aside').addEventListener('click', (e) => {
    if (e.target.id === 'login') return gotoLogin();
    if (e.target.id === 'logout') return signOut();
    if (e.target.id === 'reset') askReset();
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

  if (sb) {
    sb.auth.onAuthStateChange((ev, session) => {
      const u = session ? session.user : null;
      const changed = (u && u.id) !== (user && user.id);
      user = u;
      if (changed && user) setTimeout(pullRemote, 0);   // don't call Supabase inside the callback
      if (changed) {
        isAdmin = false;
        if (user) setTimeout(async () => {
          const r = await sb.rpc('is_super_admin');
          isAdmin = !!(r && r.data);
          if (!L && location.hash === '#profile') route();
        }, 0);
      }
      // Session gone (signed out elsewhere / expired) and not a guest → back to the login page
      if (!user && ev === 'INITIAL_SESSION') {
        let guest = false; try { guest = !!localStorage.getItem('ohh_guest'); } catch (e) { /* ignore */ }
        if (!guest) return location.replace('login.html');
      }
      if (!L) route();
    });
  }

  route();
})();
