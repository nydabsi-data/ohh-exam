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
  const nfmt = (n) => Number(n).toLocaleString('en-US');
  // Extra questions (data/extra/*.js) are appended to their lesson by id, so earlier question keys stay the same.
  const XQ = window.EXTRA_Q || {};
  [window.UNITS, window.PHYSICS_UNITS, window.CHEM_UNITS, window.BIO_UNITS, window.MATH_UNITS].forEach((us) =>
    (us || []).forEach((u) => u.lessons.forEach((l) => { if (XQ[l.id] && !l.__xq) { l.questions = l.questions.concat(XQ[l.id]); l.__xq = true; } })));
  const COURSES = {
    pilot:   { units: window.UNITS || [], hash: '#learn', back: '#exams', note: true },
    physics: { units: window.PHYSICS_UNITS || [], hash: '#learn-physics', back: '#exams' },
    chem:    { units: window.CHEM_UNITS || [], hash: '#learn-chem', back: '#exams' },
    bio:     { units: window.BIO_UNITS || [], hash: '#learn-bio', back: '#exams' },
    math:    { units: window.MATH_UNITS || [], hash: '#learn-math', back: '#exams' },
    // English: TOEIC books + Grammar + Vocabulary, opened from the "English" card (#english)
    toeic:   { units: (window.TOEIC_UNITS || []).slice().sort((a, b) => (a.n || 0) - (b.n || 0)), hash: '#learn-toeic', back: '#english' },
    grammar: { units: window.GRAMMAR_UNITS || [], hash: '#learn-grammar', back: '#english' },
    vocab:   { units: window.VOCAB_UNITS || [], hash: '#learn-vocab', back: '#english' }
  };
  Object.values(COURSES).forEach((c) => { c.lessons = flatten(c.units); });
  // Every question gets a stable key "<lesson id>#<index>" so wrong answers can be practised later.
  const QBANK = {};
  Object.values(COURSES).forEach((c) => c.lessons.forEach((l) => l.questions.forEach((q, k) => {
    q.__key = l.id + '#' + k; QBANK[q.__key] = { q, lesson: l };
  })));
  const ALL_LESSONS = [].concat(...Object.values(COURSES).map((c) => c.lessons));
  // Memory trick shown after answering: q.tip, or window.Q_TIPS['<lessonId>#<index>'] (data/tips/*.js)
  const qTip = (q) => q.tip || (window.Q_TIPS && window.Q_TIPS[q.__key]) || '';
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
  let sb = null;
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
    if ((b.avatarAt || 0) > (a.avatarAt || 0)) { out.avatar = b.avatar; out.avatarAt = b.avatarAt; }
    out.apt = Object.assign({}, b.apt);
    for (const k in (a.apt || {})) { const x = a.apt[k], y = out.apt[k]; out.apt[k] = !y ? x : { best: Math.max(x.best, y.best), last: (x.at >= y.at ? x : y).last, n: Math.max(x.n || 0, y.n || 0), at: Math.max(x.at || 0, y.at || 0) }; }
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
    ['home', 'lesson', 'result', 'apt'].forEach((v) => $('#' + v + '-view').classList.toggle('hidden', v !== view));
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

  // Lesson-card icon that matches the unit's topic (falls back to the star)
  const TI = (d, fill) => '<svg viewBox="0 0 24 24" ' + (fill ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"') + '>' + d + '</svg>';
  const TOPIC_ICONS = [
    [/^basic/, TI('<path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/>', true)],          // aeroplane
    [/^hist/, TI('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>')],                                                                    // clock
    [/^pof|^aero/, TI('<path d="M3 14c5-6 13-6 18-2"/><path d="M8 9V4M12 8V3M16 9V5"/><path d="m6 6 2-2 2 2M10 5l2-2 2 2M14 7l2-2 2 2"/>')],     // lift arrows over a wing
    [/^met/, TI('<path d="M7 18a4 4 0 0 1-.6-7.96A6 6 0 0 1 18 9a4.5 4.5 0 0 1-.5 9z"/>')],                                                     // cloud
    [/^nav/, TI('<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>')],                                                          // compass
    [/^law/, TI('<path d="M12 3v18M5 7h14M7 21h10"/><path d="M5 7 2 13a3 3 0 0 0 6 0zM19 7l-3 6a3 3 0 0 0 6 0z"/>')],                           // scales
    [/^agk/, TI('<path d="M4 18a8 8 0 1 1 16 0"/><path d="m12 18 4-6"/><circle cx="12" cy="18" r="1.4" fill="currentColor"/>')],                // gauge
    [/^hfr/, TI('<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/>')], // headset
    [/^phy-kin/, TI('<path d="M3 12h13M12 7l5 5-5 5M20 5v14"/>')],
    [/^phy-force/, TI('<path d="M2 12h7M15 12h7M6 9l3 3-3 3M18 9l-3 3 3 3"/><rect x="9" y="9" width="6" height="6" rx="1"/>')],
    [/^phy-energy|^chem-redox/, TI('<path d="M13.5 2 4 14h6.5L9 22l11-13h-6.8z"/>', true)],
    [/^phy-motion/, TI('<ellipse cx="12" cy="12" rx="9" ry="5"/><circle cx="20" cy="10" r="1.8" fill="currentColor"/><circle cx="12" cy="12" r="2"/>')],
    [/^phy-wave/, TI('<path d="M2 12c2.5-6 5-6 7.5 0s5 6 7.5 0 3.5-4 5-2"/>')],
    [/^phy-elec/, TI('<path d="M9 2v6M15 2v6M6 8h12v3a6 6 0 0 1-12 0zM12 17v5"/>')],
    [/^phy-mag/, TI('<path d="M6 3v8a6 6 0 0 0 12 0V3h-4v8a2 2 0 0 1-4 0V3z"/>')],
    [/^phy-heat/, TI('<path d="M10 14V5a2 2 0 0 1 4 0v9a4 4 0 1 1-4 0z"/><path d="M12 9v7"/>')],
    [/^phy-modern|^chem-atom/, TI('<ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/><circle cx="12" cy="12" r="1.8" fill="currentColor"/>')],
    [/^chem-bond/, TI('<circle cx="6" cy="12" r="3.5"/><circle cx="18" cy="12" r="3.5"/><path d="M9.5 11h5M9.5 13h5"/>')],
    [/^chem-mole/, TI('<path d="M9 3h6M10 3v6L4.5 19a1.5 1.5 0 0 0 1.3 2h12.4a1.5 1.5 0 0 0 1.3-2L14 9V3"/><path d="M7 15h10"/>')],
    [/^chem-rate/, TI('<circle cx="12" cy="13.5" r="7.5"/><path d="M12 9.5v4.2l2.6 1.6M9.5 2.5h5"/>')],
    [/^chem-acid/, TI('<path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z"/>')],
    [/^chem-org/, TI('<path d="M12 3l7.8 4.5v9L12 21l-7.8-4.5v-9z"/>')],
    [/^bio-cell/, TI('<circle cx="12" cy="12" r="9"/><circle cx="13" cy="11" r="3.5"/><circle cx="7.5" cy="15" r="1" fill="currentColor"/>')],
    [/^bio-mol|^bio-gen/, TI('<path d="M7 3c0 6 10 6 10 12s-10 6-10 6M17 3c0 6-10 6-10 12s10 6 10 6M8.5 7h7M8.5 17h7"/>')],
    [/^bio-body/, TI('<path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.5 2.9 4.5 6.6 4.5c2.1 0 3.6 1.2 5.4 3.2 1.8-2 3.3-3.2 5.4-3.2 3.7 0 5.7 4 4.2 7.3C19.5 16.4 12 21 12 21z"/>', true)],
    [/^bio-plant/, TI('<path d="M5 19C5 10 11 4 20 4c0 9-6 15-15 15z"/><path d="M5 19 13 11"/>')],
    [/^bio-eco/, TI('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>')],
    [/^math-set/, TI('<circle cx="9" cy="12" r="6"/><circle cx="15" cy="12" r="6"/>')],
    [/^math-real/, TI('<path d="M3 13h3l3 7 5-17h7"/>')],
    [/^math-func|^math-explog/, TI('<path d="M4 4v16h16"/><path d="M6 17c4 0 6-10 13-11"/>')],
    [/^math-trig/, TI('<path d="M4 20h16L4 6z"/><path d="M4 16h4v4"/>')],
    [/^math-seq/, TI('<path d="M18 5H6l7 7-7 7h12"/>')],
    [/^math-prob/, TI('<rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="9" cy="9" r="1.3" fill="currentColor"/><circle cx="15" cy="15" r="1.3" fill="currentColor"/><circle cx="15" cy="9" r="1.3" fill="currentColor"/><circle cx="9" cy="15" r="1.3" fill="currentColor"/>')],
    [/^math-stat/, TI('<path d="M4 20h16M7 20v-6M12 20V8M17 20v-10"/>')],
    [/^math-calc/, TI('<path d="M14 4c-2-1-4 0-4 3v10c0 3-2 4-4 3"/>')],
    [/^wind/, TI('<path d="M3 8h11a3 3 0 1 0-3-3M3 12h16a3 3 0 1 1-3 3M3 16h8"/>')],
    [/^geo/, TI('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>')],
    [/^toeic|^eg-|^ev-/, TI('<path d="M4 5a2 2 0 0 1 2-2h13v15H6a2 2 0 0 0-2 2zM4 20a2 2 0 0 0 2 2h13v-4"/><path d="M8 8h7M8 12h5"/>')]
  ];
  const pilotIcon = (name) => '<span class="pilot-icon pilot-icon-' + name + '" aria-hidden="true"></span>';
  // Full-colour topic pictures (img/topics/*.png)
  const imgIcon = (name) => '<img class="topic-img" src="img/topics/' + name + '.png" alt="" aria-hidden="true" loading="lazy">';
  // Aptitude tests: full-colour pictures (rotation uses the red plane)
  const APT_IMG = { series: 'apt-series', math: 'apt-math', rotation: 'agk-plane', jigsaw: 'apt-jigsaw', joystick: 'apt-joystick', multitask: 'apt-multitask' };
  // Home subject cards: full-colour pictures
  const MODE_IMG = { pilot: 'agk-plane', physics: 'home-physics', chem: 'home-chem', bio: 'home-bio', mathhs: 'apt-math', english: 'home-english' };
  const exIcon = (x) => APT_IMG[x.id] ? imgIcon(APT_IMG[x.id]) : EX_ICON[x.icon];
  const TOPIC_IMG = { 'math-set': 'math-sphere', 'math-real': 'math-neq', 'math-func': 'math-pyramid', 'math-explog': 'math-inf-blue', 'math-trig': 'math-pi', 'math-seq': 'math-inf-pink', 'math-prob': 'math-pct', 'math-stat': 'math-pyramid', 'math-calc': 'math-inf-pink', 'phy-start': 'phys-cradle', 'phy-kin': 'phys-sun', 'phy-force': 'phys-scale', 'phy-energy': 'phys-bullets', 'phy-motion': 'phys-flowergun', 'phy-wave': 'phys-sound', 'phy-elec': 'phys-plug', 'phy-mag': 'phys-signal', 'phy-heat': 'fire', 'phy-modern': 'phys-emc2', basic: 'agk-compass', pof: 'basic', met: 'met-cloud', hist: 'hist', nav: 'nav', law: 'law', agk: 'agk-plane', hfr: 'hfr-pilot', geo: 'geo', wind: 'wind',
    'chem-atom': 'chem-atomic', 'chem-bond': 'chem-dumbbell', 'chem-mole': 'chem-boxes', 'chem-rate': 'chem-molecules', 'chem-acid': 'chem-molecule', 'chem-redox': 'fuel-pct', 'chem-org': 'chem-hex' };
  const TOPIC_IMG_ALT = {
    'math-set': ['math-sphere', 'math-neq'], 'math-seq': ['math-inf-pink', 'math-pct'], 'math-prob': ['math-pyramid', 'math-pct'],
    'chem-atom': ['chem-atomic', 'chem-element'], 'chem-bond': ['chem-dumbbell', 'chem-molecule'], 'chem-mole': ['chem-boxes', 'chem-element'], 'chem-rate': ['chem-molecules', 'chem-dumbbell'],
    'chem-acid': ['chem-molecule', 'chem-molecules'], 'chem-org': ['chem-hex', 'chem-molecule'],
    'phy-start': ['phys-cradle', 'phys-emc2'], 'phy-kin': ['phys-sun', 'phys-bullets'], 'phy-force': ['phys-scale', 'phys-book', 'phys-apple'],
    'phy-energy': ['phys-bullets', 'phys-force', 'phys-energy'], 'phy-motion': ['phys-flowergun', 'phys-blast'], 'phy-wave': ['phys-sound', 'phys-sun', 'phys-signal'],
    'phy-elec': ['phys-energy', 'phys-plug', 'phys-bulb'], 'phy-mag': ['phys-signal', 'phys-plug'], 'phy-heat': ['fire', 'fuel-pct'], 'phy-modern': ['phys-emc2', 'phys-bulb'],
    hist: ['hist', 'agk'], pof: ['basic', 'airport', 'hfr'], met: ['met-cloud', 'met-rain', 'met-moon'], nav: ['nav', 'geo', 'agk'], law: ['seatbelt', 'law', 'gavel'], agk: ['agk-takeoff', 'agk-compass', 'agk-plane'], hfr: ['hfr-pilot', 'nav', 'ticket'], wind: ['agk-takeoff', 'wind'], geo: ['agk-compass', 'geo'], basic: ['agk-compass', 'agk-plane', 'fuel-pump'] };   // lesson cards take turns between these pictures
  const topicIcon = (unitId, li) => {
    const key = String(unitId || '').replace(/-\d+$/, '');
    if (TOPIC_IMG_ALT[key] && li != null) return imgIcon(TOPIC_IMG_ALT[key][li % TOPIC_IMG_ALT[key].length]);
    if (TOPIC_IMG[key]) return imgIcon(TOPIC_IMG[key]);
    const t = TOPIC_ICONS.find((x) => x[0].test(unitId || '')); return t ? t[1] : ICON.star;
  };
  const PLAY_ICON = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>';

  const isDone = (id) => !!S.done[id];
  const aptBest = (id) => (S.apt && S.apt[id] ? S.apt[id].best : null);
  let isAdmin = false;   // super admin: every lesson unlocked
  const isUnlocked = (i) => isAdmin || i === 0 || isDone(LESSONS[i - 1].id);
  // Trying without an account: only the first GUEST_FREE lessons of each course and the first aptitude test
  const GUEST_FREE = 2;
  const isGuest = () => !user && !isAdmin;
  const guestLocked = (i) => isGuest() && i >= GUEST_FREE;
  function askSignup() {
    modal({ title: T('สมัครสมาชิกฟรีเพื่อปลดล็อก'),
      body: T('โหมดทดลองใช้ทำได้ 2 บทแรกของแต่ละวิชา และแบบทดสอบชุดแรก สมัครสมาชิก (ฟรี) เพื่อปลดล็อกทุกบทและเก็บคะแนนไว้ในบัญชี'),
      actions: [{ label: T('สมัคร / เข้าสู่ระบบ'), fn: () => { location.href = 'login.html'; } }, { label: T('ไว้ก่อน'), cls: 'ghost' }] });
  }
  const OFFSETS = [0, -70, -40, 40, 70, 0];

  // ปูพื้นฐาน: easy primers per lesson (data/primers/*.js → window.PRIMERS), opened from the first card of a unit
  const PRIMERS = () => window.PRIMERS || {};
  function primerHtml(l, p, n) {
    const li = (s) => '<li>' + esc(s) + '</li>';
    // diagrams (data/primers/*-figs.js) go right after the block they explain
    const fig = (at) => ((window.PRIMER_FIGS || {})[l.id] || []).filter((g) => g.at === at)
      .map((g) => '<figure class="pr-fig no-i18n">' + g.svg + (g.cap ? '<figcaption>' + esc(g.cap) + '</figcaption>' : '') + '</figure>').join('');
    return '<section class="pr-sec">' +
      (n > 1 ? '<h4 class="pr-head">' + esc(l.title) + '</h4>' : '') +
      '<div class="pr-idea"><b>' + T('เข้าใจก่อน') + '</b><p>' + esc(p.idea) + '</p></div>' + fig('idea') +
      (p.keys?.length ? '<div class="pr-block"><b>' + T('คำและสัญลักษณ์ที่ต้องรู้') + '</b><dl class="pr-keys">' +
        p.keys.map(([k, v]) => '<div><dt>' + esc(k) + '</dt><dd>' + esc(v) + '</dd></div>').join('') + '</dl></div>' : '') + fig('keys') +
      (p.f?.length ? '<div class="pr-block"><b>' + T('สูตรที่ใช้บ่อย') + '</b><ul class="pr-f">' + p.f.map(li).join('') + '</ul></div>' : '') + fig('f') +
      (p.ex ? '<div class="pr-ex"><b>' + T('ลองทำตัวอย่าง') + '</b><p class="pr-q">' + esc(p.ex.q) + '</p><ol>' + p.ex.s.map(li).join('') + '</ol>' +
        '<p class="pr-a">' + T('ตอบ') + ': <strong>' + esc(p.ex.a) + '</strong></p></div>' : '') + fig('ex') +
      (p.trap ? '<div class="pr-trap"><b>⚠️ ' + T('จุดที่พลาดบ่อย') + '</b><p>' + esc(p.trap) + '</p></div>' : '') +
      (p.tip ? '<div class="pr-tip"><b>💡 ' + T('วิธีจำ') + '</b><p>' + esc(p.tip) + '</p></div>' : '') +
      '</section>';
  }
  function openPrimer(ui) {
    const u = UNITS[ui]; if (!u) return;
    const ls = u.lessons.filter((l) => PRIMERS()[l.id]);
    const first = LESSONS.findIndex((l) => l.id === u.lessons[0].id);
    modal({ title: T('ปูพื้นฐาน') + ' · ' + esc(u.th || u.title), body: '',
      actions: [{ label: T('เริ่มบทที่ 1'), fn: () => { const c = document.querySelector('.lesson-card[data-i="' + first + '"]'); if (c) c.click(); } },
        { label: T('ปิด'), cls: 'ghost' }] });
    const box = $('#modal-box');
    box.classList.add('wide', 'primer');
    box.querySelector('p').outerHTML = '<div class="primer-body">' + ls.map((l) => primerHtml(l, PRIMERS()[l.id], ls.length)).join('') + '</div>';
    box.scrollTop = 0;
  }

  function renderHome() {
    sync(); renderStats();
    const cur = LESSONS.findIndex((l) => !isDone(l.id));
    let html = '', i = 0;
    UNITS.forEach((u, ui) => {
      const doneN = u.lessons.filter((l) => isDone(l.id)).length;
      html += '<section class="unit" id="unit-' + ui + '" style="--c:' + u.color + ';--d:' + u.dark + ';--t:' + (u.text || '#fff') + '">' +
        '<header class="unit-head"><div><small>Unit ' + (ui + 1) + ' · ' + esc(u.th) + '</small><h2>' + esc(u.title) + '</h2></div>' +
        '<span class="unit-tools"><span class="unit-count">' + doneN + '/' + u.lessons.length + '</span>' +
          '<button class="row-arrow" data-dir="-1" aria-label="ก่อนหน้า"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg></button>' +
          '<button class="row-arrow" data-dir="1" aria-label="ถัดไป"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg></button></span>' +
        '</header><div class="lesson-row">';
      // "ปูพื้นฐาน" card first when the unit has primers (easy basics to read before lesson 1; always open)
      const pn = u.lessons.filter((l) => PRIMERS()[l.id]).length;
      if (pn) html += '<button class="lesson-card open primer-card" data-unit="' + ui + '" aria-label="' + T('ปูพื้นฐาน') + ' ' + esc(u.th || u.title) + '">' +
        '<span class="lc-top"><span class="lc-num">' + T('ก่อนเริ่ม') + '</span><span class="primer-chip">' + T('อ่าน 3 นาที') + '</span></span>' +
        '<span class="lc-ico">' + TI('<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/><path d="M9 8h7M9 12h5"/>') + '</span>' +
        '<span class="lc-title">' + T('ปูพื้นฐาน') + '</span>' +
        '<span class="lc-meta">' + T('สรุปง่าย ๆ · สูตร · ตัวอย่าง') + '</span>' +
        '<span class="lc-foot"><span class="lc-go" aria-label="' + T('อ่าน') + '">' + PLAY_ICON + '</span></span></button>';
      // One card per lesson, in a row you swipe sideways
      u.lessons.forEach((l, li) => {
        const gl = guestLocked(i) && !isDone(l.id);
        const st = gl ? 'locked' : isDone(l.id) ? 'done' : i === cur ? 'current' : isUnlocked(i) ? 'open' : 'locked';
        const best = st === 'done' ? S.done[l.id].best : 0;
        const foot = st === 'done' ? '<span class="lc-state done">' + ICON.check + '<span>ผ่านแล้ว ' + best + '%</span></span>'
          : gl ? '<span class="lc-state locked">' + ICON.lock + '<span>สมัครเพื่อปลดล็อก</span></span>'
          : st === 'locked' ? '<span class="lc-state locked">' + ICON.lock + '<span>ล็อก</span></span>'
          : '<span class="lc-go" aria-label="เริ่ม">' + PLAY_ICON + '</span>';
        html += '<button class="lesson-card ' + st + (gl ? ' guest' : '') + '" data-i="' + i + '" aria-label="' + esc(l.title) + '">' +
          '<span class="lc-top"><span class="lc-num">บทที่ ' + (li + 1) + '</span>' + diffChip(lessonDiff(l)) + '</span>' +
          '<span class="lc-ico">' + (st === 'done' ? ICON.check : st === 'locked' ? ICON.lock : topicIcon(u.id, li)) + '</span>' +
          '<span class="lc-title">' + esc(l.title) + '</span>' +
          '<span class="lc-meta">' + l.questions.length + ' ข้อ</span>' +
          '<span class="lc-foot">' + foot + '</span></button>';
        i++;
      });
      html += '</div></section>';
    });
    // Pilot: the 6 aptitude tests as one more unit, same card style (always open)
    if (course === 'pilot') {
      const tests = EXAMS.filter((x) => x.id !== 'learn');
      html += '<section class="unit" id="unit-apt" style="--c:#CB7F89;--d:#BD5D6A;--t:#fff">' +
        '<header class="unit-head"><div><small>Unit ' + (UNITS.length + 1) + ' · แบบทดสอบความถนัด</small><h2>Aptitude tests</h2></div>' +
        '<span class="unit-tools"><span class="unit-count">' + tests.length + ' ' + T('ชุด') + '</span>' +
          '<button class="row-arrow" data-dir="-1" aria-label="ก่อนหน้า"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg></button>' +
          '<button class="row-arrow" data-dir="1" aria-label="ถัดไป"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg></button></span>' +
        '</header><div class="lesson-row">' +
        tests.map((x, ti) => (isGuest() && ti > 0
          ? '<button class="lesson-card locked guest" style="--c:' + x.color + ';--d:' + x.dark + '">' +
            '<span class="lc-top"><span class="lc-num">ชุดที่ ' + (ti + 1) + '</span></span><span class="lc-ico">' + ICON.lock + '</span>' +
            '<span class="lc-title">' + esc(x.title) + '</span><span class="lc-meta">' + x.meta.map(esc).join(' · ') + '</span>' +
            '<span class="lc-foot"><span class="lc-state locked">' + ICON.lock + '<span>สมัครเพื่อปลดล็อก</span></span></span></button>'
          : '<a class="lesson-card open exam-lc" href="' + x.href + '" style="--c:' + x.color + ';--d:' + x.dark + '">' +
          '<span class="lc-top"><span class="lc-num">ชุดที่ ' + (ti + 1) + '</span></span>' +
          '<span class="lc-ico">' + exIcon(x) + '</span>' +
          '<span class="lc-title">' + esc(x.title) + '</span>' +
          '<span class="lc-meta">' + x.meta.map(esc).join(' · ') + '</span>' +
          '<span class="lc-foot">' + (aptBest(x.id) != null
            ? '<span class="lc-state done">' + ICON.check + '<span>ดีที่สุด ' + aptBest(x.id) + '%</span></span>'
            : '<span class="lc-go" aria-label="เริ่ม">' + PLAY_ICON + '</span>') + '</span></a>')).join('') +
        '</div></section>';
    }
    // Topic buttons: one square icon tile per unit (tap to jump to it)
    if (UNITS.length > 1) {
      const tiles = UNITS.map((u, ui) => ({ id: 'unit-' + ui, c: u.color, d: u.dark, icon: topicIcon(u.id), label: u.th || u.title }));
      if (course === 'pilot') tiles.push({ id: 'unit-apt', c: '#CB7F89', d: '#BD5D6A', icon: imgIcon('seatbelt'), label: 'แบบทดสอบ' });
      html = '<div class="topic-head"><h3>' + T('หัวข้อ') + '</h3><span>' + tiles.length + ' ' + T('หัวข้อ') + '</span></div>' +
        '<div class="topic-carousel"><button class="row-arrow topic-prev" type="button" data-dir="-1" aria-controls="topic-row" aria-label="' + T('เลื่อนหัวข้อไปทางซ้าย') + '">' +
          TI('<path d="M15 5l-7 7 7 7"/>') + '</button>' +
        '<div class="topic-row" id="topic-row">' + tiles.map((t) =>
          '<button class="topic-btn" data-go="' + t.id + '" style="--c:' + t.c + ';--d:' + t.d + '"><span class="tb-ico">' + t.icon + '</span><span class="tb-lab">' + esc(t.label) + '</span></button>').join('') +
        '</div><button class="row-arrow topic-next" type="button" data-dir="1" aria-controls="topic-row" aria-label="' + T('เลื่อนหัวข้อไปทางขวา') + '">' +
          TI('<path d="M9 5l7 7-7 7"/>') + '</button></div>' + html;
    }
    if (course === 'vocab' && window.VOCAB_FLASH_WORDS?.length) {
      html = '<section class="card"><h3>' + T('ฝึกคำศัพท์แบบสุ่มต่อเนื่อง') + '</h3>' +
        '<div class="g-chips">' + Object.entries(VOCAB_FLASH_PARTS).map(([hash, part]) =>
          '<a class="btn' + (part ? ' ghost' : '') + '" href="' + hash + '">' + T(VOCAB_PART_NAMES[part] || 'ทั้งหมด') + '</a>').join('') +
        '</div></section>' + html;
    }
    // Picture cards are no longer listed on the course page — each picture shows inside its question (after answering)
    const figs = [];
    if (figs.length) {
      html = '<section class="unit fig-unit" style="--c:#DFA590;--d:#D17E60;--t:#fff">' +
        '<header class="unit-head"><div><small>ดูภาพแล้วจำง่ายขึ้น</small><h2>ภาพประกอบ</h2></div>' +
        '<span class="unit-tools"><span class="unit-count">' + figs.length + ' ภาพ</span></span></header>' +
        '<div class="lesson-row fig-row">' + figs.map((k) =>
          '<button class="fig-card no-i18n" data-fig="' + k + '">' + FIGS[k].svg + '<span>' + FIGS[k].title + '</span></button>').join('') +
        '</div></section>' + html;
    }
    // Pilot: aviation vocabulary (glossary page)
    if (course === 'pilot' && aviaTerms().length) {
      html = '<div class="pilot-study-links"><a class="glossary-entry" href="#glossary"><span class="ge-ico">' + imgIcon('ticket') + '</span>' +
        '<span class="ge-body"><b>คำศัพท์การบิน</b><i>' + nfmt(aviaTerms().length) + ' คำ พร้อมคำแปลสั้น ๆ</i></span>' +
        '<span class="lc-go" aria-label="เปิด">' + PLAY_ICON + '</span></a>' +
        '<a class="glossary-entry" href="#picture-flash"><span class="ge-ico">' + imgIcon('airport') + '</span>' +
        '<span class="ge-body"><b>' + T('Flash Card พร้อมรูป') + '</b><i>' + Math.min(PICTURE_FLASH_LIMIT, (window.PM_QUIZ || []).length) + ' ' + T('ข้อ') + '</i></span>' +
        '<span class="lc-go">' + PLAY_ICON + '</span></a>' +
        '<a class="glossary-entry" href="#aircraft-flash"><span class="ge-ico">' + pilotIcon('plane') + '</span>' +
        '<span class="ge-body"><b>' + T('Flash Card เครื่องบิน 3D') + '</b><i>' + AIRCRAFT_FLASH.length + ' ' + T('ข้อ') + '</i></span>' +
        '<span class="lc-go">' + PLAY_ICON + '</span></a>' +
        '<button type="button" class="glossary-entry" id="turbofan-quiz"><span class="ge-ico">' +
        TI('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2"/><path d="M12 10l-4-5m6 6 6-2m-8 5-1 6"/>') + '</span>' +
        '<span class="ge-body"><b>Turbofan 3D Quiz</b><i>' + TURBOFAN_QUIZ.length + ' ' + T('ข้อ') + '</i></span>' +
        '<span class="lc-go">' + PLAY_ICON + '</span></button>' +
        '<button type="button" class="glossary-entry" id="pm-quiz"><span class="ge-ico">' +
        TI('<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4M6 12l3-3 3 3 4-5"/>') + '</span>' +
        '<span class="ge-body"><b>Project Magenta Quiz</b><i>' + (window.PM_QUIZ || []).length + ' ' + T('ข้อ') + '</i></span>' +
        '<span class="lc-go">' + PLAY_ICON + '</span></button></div>' + html;
    }
    $('#path').innerHTML = html;
    // Bring the next lesson to do into view in its row
    const curCard = $('#path .lesson-card.current');
    if (curCard) { const row = curCard.parentElement; row.scrollLeft = Math.max(0, curCard.offsetLeft - row.offsetLeft - 16); }
    $$('#path :is(.lesson-row, .topic-row)').forEach(updateArrows);
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
    const les = LESSONS[i];
    L = { i, les, queue: shuffle(les.questions.slice()), total: les.questions.length, correct: 0, wrong: 0, xp: 0, start: Date.now(), state: 'answer', sel: null, opts: null };
    openLesson();
  }
  // Practice: a mixed set of questions; no hearts lost, lessons are not marked as passed.
  function startPractice(questions, title, limit = 10) {
    if (!questions.length) return toast('ยังไม่มีข้อให้ฝึก');
    sync();
    const qs = shuffle(questions.slice()).slice(0, limit);
    L = { i: null, practice: { title, src: questions, limit }, les: { id: null, title, unit: { title: 'Practice' } },
          queue: qs, total: qs.length, correct: 0, wrong: 0, xp: 0, start: Date.now(), state: 'answer', sel: null, opts: null };
    openLesson();
  }
  // Pilot lessons are always timed (stopwatch in the lesson top bar)
  let timerId = null;
  const isPilotRun = () => L.les.id ? !/^(phy|chem|bio|math)-/.test(L.les.id) : !/^(phy|chem|bio|math)-/.test((L.queue[0] && L.queue[0].__key) || '');
  function startTimer(on) {
    clearInterval(timerId);
    const box = $('#l-timer');
    box.classList.toggle('hidden', !on);
    if (!on) return;
    const tick = () => {
      if (!L) { clearInterval(timerId); return; }
      $('#l-time').textContent = fmtTime(Math.floor((Date.now() - L.start) / 1000));
    };
    tick(); timerId = setInterval(tick, 1000);
  }
  function openLesson() {
    startTimer(isPilotRun());
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
    setCheck('เลือกคำตอบ', false);

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
    $('#qbox').innerHTML = '<div class="q-kind">' + kind + ' ' + diffChip(qDiff(q)) + '</div>' + qHead(q.q) +
      (q.model ? aircraftFigure({ asset: q.model, reference: q.source }) : q.image ? productFigure(q) : '') + body;
    if (q.model) loadAircraftModel('#qbox');
  }

  function productFigure(q) {
    return '<figure class="q-product-image"><img src="' + esc(q.image) + '" alt="' + T('ภาพหน้าจอสำหรับคำถาม') + '">' +
      '<figcaption><a href="' + esc(q.source) + '" target="_blank" rel="noopener">Project Magenta</a></figcaption></figure>';
  }

  // Long reading passages (TOEIC) are written as "passage\n\nquestion": show the passage in its own box
  function qHead(text) {
    const parts = String(text).split('\n\n');
    const ask = parts.pop();
    return (parts.length ? '<div class="q-passage no-i18n">' + esc(parts.join('\n\n')) + '</div>' : '') + '<h1 class="q-title no-i18n">' + esc(ask) + '</h1>';
  }

  function pickOption(j) {
    if (!L.opts || !L.opts[j]) return;
    L.sel = j;
    $$('#qbox .opt').forEach((b, k) => b.classList.toggle('sel', k === j));
    onCheck();   // answer shows right away — no "check answer" step; then press "ไปต่อ"
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
    if (ok) { L.correct++; L.xp += DIFF[d].xp; } else { L.wrong++; }
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
      (L.q.ex ? '<p class="no-i18n">' + esc(L.q.ex) + '</p>' : '') +
      (qTip(L.q) ? '<p class="fb-tip no-i18n"><b>💡 วิธีจำ:</b> ' + esc(qTip(L.q)) + '</p>' : '') +
      (course === 'pilot' || L.q.image ? abbrBox([L.q.q, L.q.ex, qTip(L.q)].concat(L.opts ? L.opts.map((o) => o.t) : []).join(' ')) : '');
    // A labelled picture for this topic (data/figs.js), shown under the question after answering
    const fig = figFor(L.q);
    if (fig) $('#qbox').insertAdjacentHTML('beforeend', '<figure class="q-fig no-i18n"><figcaption>ภาพประกอบ: ' + fig.title + '</figcaption>' + fig.svg + figParts(fig) + '</figure>');
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
      '<div class="result-in"><div class="res-char"><img src="' + charSrc(myChar()) + '" alt=""><span class="res-badge">' + ICON.trophy + '</span></div>' +
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
    $('#again').onclick = () => practice ? startPractice(practice.src, practice.title, practice.limit) : startLesson(i);
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
    { id: 'learn', title: 'Pilot Knowledge', th: 'ความรู้นักบิน แบบบทเรียนสั้น', icon: 'book', color: '#CA6B48', dark: '#B85836', text: '#fff', href: '#learn', meta: ['6 วิชา', 'XP · Streak'] },
    { id: 'series', title: 'Series Number', th: 'หาตัวเลขถัดไปในอนุกรม', icon: 'series', color: '#CB7F89', dark: '#BD5D6A', text: '#fff', href: '#apt-series', meta: ['15 ข้อ', '6 นาที'] },
    { id: 'math', title: 'Math Test', th: 'คณิตคิดเร็วสำหรับนักบิน', icon: 'math', color: '#B54A58', dark: '#9F414E', text: '#fff', href: '#apt-math', meta: ['20 ข้อ', '8 นาที'] },
    { id: 'rotation', title: 'Aircraft Rotation', th: 'การหมุนและทิศทางของเครื่องบิน', icon: 'plane', color: '#DFA590', dark: '#D17E60', text: '#fff', href: '#apt-rotation', meta: ['15 ข้อ', '4 นาที'] },
    { id: 'jigsaw', title: 'Spatial Jigsaw', th: 'มิติสัมพันธ์ ประกอบชิ้นส่วน', icon: 'puzzle', color: '#B95361', dark: '#9C404C', text: '#fff', href: '#apt-jigsaw', meta: ['12 ข้อ', '5 นาที'] },
    { id: 'joystick', title: 'Joy Stick', th: 'ควบคุมและความแม่นยำ', icon: 'stick', color: '#B25534', dark: '#96482C', text: '#fff', href: '#apt-joystick', meta: ['60 วินาที'] },
    { id: 'multitask', title: 'Multitask', th: 'ทำหลายอย่างพร้อมกัน', icon: 'multi', color: '#DCA9B0', dark: '#CC818B', text: '#fff', href: '#apt-multitask', meta: ['90 วินาที'] }
  ];

  // Modes on the home page. Each mode groups its own exam cards (only "Pilot" for now).
  const MODES = [
    { id: 'pilot', title: 'Pilot', th: 'ความรู้นักบินและแบบทดสอบความถนัด', icon: 'plane', cls: 'cream', color: '#E9C376', dark: '#DEA637', text: '#fff', href: '#learn', course: 'pilot',
      items: (window.UNITS || []).map((u) => ({ title: u.title, color: u.color })) },
    { id: 'physics', title: 'ฟิสิกส์ ม.ปลาย', th: 'กลศาสตร์ คลื่น ไฟฟ้า และฟิสิกส์ยุคใหม่', icon: 'atom', color: '#CA6B48', dark: '#B85836', text: '#fff', href: '#learn-physics', course: 'physics',
      items: (window.PHYSICS_UNITS || []).map((u) => ({ title: u.title, color: u.color, sym: u.sym })) },
    { id: 'chem', title: 'เคมี ม.ปลาย', th: 'อะตอม พันธะ โมล กรด–เบส และอินทรีย์', icon: 'flask', color: '#DFA590', dark: '#D17E60', text: '#fff', href: '#learn-chem', course: 'chem',
      items: (window.CHEM_UNITS || []).map((u) => ({ title: u.title, color: u.color })) },
    { id: 'bio', title: 'ชีววิทยา ม.ปลาย', th: 'เซลล์ พันธุศาสตร์ ระบบร่างกาย พืช นิเวศ และวิวัฒนาการ', icon: 'leaf', color: '#CB7F89', dark: '#BA5663', text: '#fff', href: '#learn-bio', course: 'bio',
      items: (window.BIO_UNITS || []).map((u) => ({ title: u.title, color: u.color })) },
    { id: 'mathhs', title: 'คณิตศาสตร์ ม.ปลาย', th: 'เซต ฟังก์ชัน ตรีโกณ ลำดับ ความน่าจะเป็น สถิติ แคลคูลัส', icon: 'sigma', color: '#B54A58', dark: '#9F414E', text: '#fff', href: '#learn-math', course: 'math',
      items: (window.MATH_UNITS || []).map((u) => ({ title: u.title, color: u.color })) },
    // English groups three courses; its card opens #english, which lists them
    { id: 'english', title: 'English', th: 'TOEIC ไวยากรณ์ และคำศัพท์', icon: 'english', unitLabel: 'คอร์ส', color: '#CB7F89', dark: '#BD5D6A', text: '#fff', href: '#english', courses: ['toeic', 'grammar', 'vocab'],
      items: [
        { id: 'toeic', course: 'toeic', title: 'TOEIC', th: 'Reading Part 5–7 แนวข้อสอบจริง จับเวลา', icon: 'toeic', color: '#CB7F89', dark: '#BD5D6A', text: '#fff', href: '#learn-toeic' },
        { id: 'grammar', course: 'grammar', title: 'Grammar', th: 'ไวยากรณ์ที่ออกสอบ TOEIC', icon: 'grammar', color: '#DFA590', dark: '#D17E60', text: '#fff', href: '#learn-grammar' },
        { id: 'vocab', course: 'vocab', title: 'Vocabulary', th: 'คำศัพท์ TOEIC จับคู่การ์ด เติมคำ', icon: 'vocab', color: '#CA6B48', dark: '#B85836', text: '#fff', href: '#learn-vocab' }
      ] }
  ];
  // a mode's courses (English has three, the others one)
  const modeCourses = (m) => (m.courses || [m.course]).filter((c) => COURSES[c] && COURSES[c].units.length);
  const sumOf = (cs, f) => cs.reduce((s, c) => s + f(COURSES[c]), 0);
  EX_ICON.english = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"><path d="M4 5h9a3 3 0 0 1 3 3v11a2 2 0 0 0-2-2H4z"/><path d="M20 5h-1M20 9h-2M7 9h5M7 13h4"/></svg>';
  EX_ICON.grammar = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"><path d="M4 19 9 5h1l5 14M6 14h7"/><path d="M17 9l2 2 3-4"/></svg>';
  EX_ICON.vocab = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"><rect x="3" y="6" width="11" height="14" rx="2"/><path d="M8 6V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-5"/></svg>';
  EX_ICON.toeic = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"><path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4M9 11h6M9 15h6M9 19h4"/></svg>';
  EX_ICON.sigma = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M18 5H6l7 7-7 7h12"/></svg>';
  EX_ICON.flask = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"><path d="M9 3h6M10 3v6L4.5 19a1.5 1.5 0 0 0 1.3 2h12.4a1.5 1.5 0 0 0 1.3-2L14 9V3"/><path d="M7 15h10" /></svg>';
  EX_ICON.leaf = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"><path d="M5 19C5 10 11 4 20 4c0 9-6 15-15 15z"/><path d="M5 19 13 11"/></svg>';
  EX_ICON.atom = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/><circle cx="12" cy="12" r="1.8" fill="currentColor"/></svg>';
  const doneIn = (c) => COURSES[c].lessons.filter((l) => isDone(l.id)).length;

  /* ---------- Characters (img/chars/c1..c8.png) ---------- */
  // n = image number (img/chars/c<n>.png). The pink-shirt girl (6) and the chef (7) were removed.
  const CHARS = [
    { n: 1, th: 'นักอ่าน', bg: '#DFA590' }, { n: 2, th: 'นักผจญภัย', bg: '#DB9E24' }, { n: 3, th: 'สายเทค', bg: '#CB7F89' },
    { n: 4, th: 'คนรักดนตรี', bg: '#A24E2F' }, { n: 5, th: 'นักคิด', bg: '#B54A58' }, { n: 8, th: 'นักปลูก', bg: '#CA6B48' }
  ];
  const charSrc = (n) => 'img/chars/c' + n + '.png';
  const charOf = (n) => CHARS.find((c) => c.n === n) || CHARS[0];
  function myChar() {
    if (CHARS.some((c) => c.n === S.avatar)) return S.avatar;
    const s = user ? uname() : 'guest';
    let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return CHARS[h % CHARS.length].n;
  }

  // A character on each Home card (image numbers from CHARS)
  const MODE_CHAR = { pilot: 2, physics: 5, chem: 3, bio: 8, mathhs: 4, english: 1 };
  // Home search: filters the subject cards as you type; Enter searches the aviation vocabulary
  function hubSearch(q) {
    q = q.trim().toLowerCase();
    let shown = 0;
    $$('#exam-grid .mode-card').forEach((c) => { const ok = !q || c.dataset.text.includes(q); c.classList.toggle('hidden', !ok); if (ok) shown++; });
    const none = $('#hub-none');
    if (!shown && q) {
      const html = '<p class="note" id="hub-none">' + T('ไม่พบวิชาที่ตรงกัน') + (aviaTerms().length ? ' — <a href="#glossary" id="hub-to-g">' + T('ค้นหาในคำศัพท์การบิน') + '</a>' : '') + '</p>';
      if (none) none.outerHTML = html; else $('#exam-grid').insertAdjacentHTML('afterend', html);
    } else if (none) none.remove();
  }

  function renderHub(sub) {
    const doneN = doneIn('pilot');
    const mode = sub && MODES.find((m) => m.id === sub);
    $('#hub-hello').textContent = mode ? 'โหมด ' + mode.title : (user ? 'สวัสดี ' + uname() : 'สวัสดีผู้เยี่ยมชม');
    $('#hub-title').textContent = mode ? mode.title : 'เลือกโหมดที่จะฝึก';
    const hc = $('#hub-char');
    if (hc) { hc.src = charSrc(myChar()); hc.alt = T(charOf(myChar()).th); }
    $('#exam-grid').classList.toggle('modes', !mode);
    // Home extras: stats card in the banner, search bar, section heading (main picker only)
    $('#hub-stats').classList.toggle('hidden', !!mode);
    $('#hub-search-wrap').classList.toggle('hidden', !!mode);
    $('#hub-sec').classList.toggle('hidden', !!mode);
    if (!mode) {
      const passed = Object.keys(COURSES).reduce((s, c) => s + doneIn(c), 0);
      $('#hub-stats').innerHTML =
        '<span><i class="hs-ico xp">' + ICON.bolt + '</i><span><small>' + T('XP สะสม') + '</small><b>' + nfmt(S.xp) + '</b></span></span>' +
        '<span><i class="hs-ico st">' + ICON.flame + '</i><span><small>' + T('เรียนต่อเนื่อง') + '</small><b>' + S.streak + ' ' + T('วัน') + '</b></span></span>' +
        '<span><i class="hs-ico ok">' + ICON.check + '</i><span><small>' + T('บทเรียนผ่าน') + '</small><b>' + passed + '</b></span></span>';
    }
    if (!mode) {
      $('#exam-grid').innerHTML = MODES.filter((m) => modeCourses(m).length).map((m) => { const cs = modeCourses(m);
        return '<a class="exam-card mode-card' + (m.cls ? ' ' + m.cls : '') + '" href="' + m.href + '" style="--c:' + m.color + ';--d:' + m.dark + '"' +
            ' data-text="' + esc((m.title + ' ' + m.th).toLowerCase()) + '">' +
          '<span class="mc-deco">' + EX_ICON[m.icon] + '</span>' +
          '<span class="mc-top"><span class="mc-ico">' + (MODE_IMG[m.id] ? imgIcon(MODE_IMG[m.id]) : EX_ICON[m.icon]) + '</span>' +
            '<span><b class="mc-title">' + esc(m.title) + '</b><br><span class="mc-sub">' + esc(T(m.th)) + '</span></span></span>' +
          // Numbers on the card: topics (units) — or courses for English — questions, lessons passed
          '<span class="mc-nums">' +
            '<span><b>' + (m.courses ? cs.length : sumOf(cs, (c) => c.units.length)) + '</b><i>' + T(m.unitLabel || 'เรื่อง') + '</i></span>' +
            '<span><b>' + nfmt(sumOf(cs, (c) => c.lessons.reduce((s, l) => s + l.questions.length, 0))) + '</b><i>' + T('ข้อ') + '</i></span>' +
            (m.id === 'pilot' ? '<span><b>' + (EXAMS.length - 1) + '</b><i>' + T('แบบทดสอบ') + '</i></span>' : '') +
          '</span>' +
          '<span class="mc-foot"><span class="mc-meta">' +
            T('บทเรียนผ่าน') + ' ' + cs.reduce((s, c) => s + doneIn(c), 0) + '/' + sumOf(cs, (c) => c.lessons.length) + '</span>' +
          '</span></a>'; }).join('');
      return;
    }
    $('#exam-grid').innerHTML = mode.items.filter((x) => !x.course || (COURSES[x.course] && COURSES[x.course].units.length)).map((x) => {
      if (x.course) {   // a course card (English): units, questions and lessons passed
        const C = COURSES[x.course], dn = doneIn(x.course);
        x = Object.assign({}, x, { meta: [C.units.length + ' ' + T(x.course === 'toeic' ? 'ชุด' : 'บท'), nfmt(C.lessons.reduce((s, l) => s + l.questions.length, 0)) + ' ' + T('ข้อ')],
          prog: '<span class="ex-prog"><span class="bar"><span style="width:' + (dn / C.lessons.length) * 100 + '%"></span></span><b>' + dn + '/' + C.lessons.length + '</b></span>' });
      }
      const extra = x.prog || (x.id === 'learn'
        ? '<span class="ex-prog"><span class="bar"><span style="width:' + (doneN / COURSES.pilot.lessons.length) * 100 + '%"></span></span><b>' + doneN + '/' + COURSES.pilot.lessons.length + '</b></span>'
        : '');
      return '<a class="exam-card" href="' + x.href + '" style="--c:' + x.color + ';--d:' + x.dark + ';--t:' + x.text + '">' +
        '<span class="ex-ico">' + exIcon(x) + '</span>' +
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
  const M_ICON = {
    lesson1: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"><path d="M4 5a2 2 0 0 1 2-2h13v15H6a2 2 0 0 0-2 2zM4 20a2 2 0 0 0 2 2h13v-4"/><path d="M9 8h6"/></svg>',
    xp50: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 2 4 14h6.5L9 22l11-13h-6.8z"/></svg>',
    correct15: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m7.5 12.5 3 3 6-6.5"/></svg>',
    exam1: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="12" cy="13.5" r="7.5"/><path d="M12 9.5v4.2l2.6 1.6M9.5 2.5h5M12 2.5V6M18.5 6.5l1.5-1.5"/></svg>',
    perfect: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 3h10v2h3.5v3A4.5 4.5 0 0 1 16.3 12.5 5 5 0 0 1 13 15.9V19h3.5v2h-9v-2H11v-3.1a5 5 0 0 1-3.3-3.4A4.5 4.5 0 0 1 3.5 8V5H7zm0 4H5.5v1A2.5 2.5 0 0 0 7 10.3zm10 0v3.3A2.5 2.5 0 0 0 18.5 8V7z"/></svg>'
  };
  // Mission pictures (img/topics); a claimed mission shows the team trophy
  const M_IMG = { lesson1: 'm-pencil', xp50: 'apt-series', correct15: 'm-target', exam1: 'apt-jigsaw', perfect: 'm-trophy' };
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
      '<div class="page-banner"><img class="pb-art" src="img/topics/m-diamond.png" alt="" aria-hidden="true"><p>ภารกิจประจำวัน · รีเซ็ตในอีก ' + left + ' ชม.</p><h1>ภารกิจวันนี้</h1>' +
        '<div class="banner-row"><span>' + ICON.flame + 'ต่อเนื่อง ' + S.streak + ' วัน</span><span>' + ICON.check + 'สำเร็จ ' + doneN + '/' + MISSIONS.length + '</span></div></div>' +
      MISSIONS.map((m) => {
        const v = Math.min(m.need, m.get()), full = v >= m.need, got = !!S.daily.claimed[m.id];
        return '<div class="mission' + (got ? ' got' : '') + '">' +
          '<span class="m-ico">' + (got ? imgIcon('m-team') : M_IMG[m.id] ? imgIcon(M_IMG[m.id]) : M_ICON[m.id] || TAB_ICON.missions) + '</span>' +
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
  const PR_IMG = { redo: 'm-pencil', target: 'apt-series', shuffle: 'hist' };   // Practice tiles: full-colour pictures
  let practiceSets = {};
  function renderPractice() {
    const missed = missedQuestions();
    const weak = weakLessons();
    const weakQs = [].concat(...weak.slice(0, 3).map((w) => w.l.questions));
    const reviewQs = [].concat(...ALL_LESSONS.filter((l) => isDone(l.id)).map((l) => l.questions));
    practiceSets = { missed, weak: weakQs, review: reviewQs };
    const tile = (id, icon, title, sub, n, cls) =>
      '<button class="pr-tile ' + cls + '" data-p="' + id + '"' + (n ? '' : ' disabled') + '>' +
        '<span class="pr-ico">' + (PR_IMG[icon] ? imgIcon(PR_IMG[icon]) : PR_ICON[icon]) + '</span><span class="pr-body"><b>' + title + '</b><i>' + sub + '</i></span>' +
        '<span class="pr-count">' + n + ' <small>ข้อ</small></span></button>';
    $('#practice-body').innerHTML =
      '<div class="page-banner"><p>ฝึกได้ไม่จำกัด · ได้ XP ตามระดับความยาก</p><h1>Practice</h1></div>' +
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
      '<h4 class="course-h">ฟิสิกส์ ม.ปลาย</h4>' + unitRows(COURSES.physics.units) +
      '<h4 class="course-h">เคมี ม.ปลาย</h4>' + unitRows(COURSES.chem.units) +
      '<h4 class="course-h">ชีววิทยา ม.ปลาย</h4>' + unitRows(COURSES.bio.units) +
      '<h4 class="course-h">คณิตศาสตร์ ม.ปลาย</h4>' + unitRows(COURSES.math.units) +
      (COURSES.toeic.units.length ? '<h4 class="course-h">TOEIC</h4>' + unitRows(COURSES.toeic.units) : '') +
      (COURSES.grammar.units.length ? '<h4 class="course-h">English Grammar</h4>' + unitRows(COURSES.grammar.units) : '') +
      (COURSES.vocab.units.length ? '<h4 class="course-h">English Vocabulary</h4>' + unitRows(COURSES.vocab.units) : '');
    // Accuracy by difficulty (one bar per level, value written next to it)
    const diffRows = [1, 2, 3].map((k) => {
      const x = (S.diff || {})[k] || { a: 0, c: 0 };
      const p = x.a ? Math.round((x.c / x.a) * 100) : 0;
      return '<div class="mrow"><div class="mrow-top"><b>' + diffChip(k) + '</b><span>' + (x.a ? p + '% · ' + x.c + '/' + x.a : '–') + '</span></div>' +
        '<div class="bar diff-bar d' + k + '"><span style="width:' + p + '%"></span></div></div>';
    }).join('');
    const week = vals.reduce((a, b) => a + b, 0);
    $('#perf-body').innerHTML =
      '<div class="page-banner"><img class="pb-art" src="img/topics/m-trophy.png" alt="" aria-hidden="true"><p>ผลคะแนนและพัฒนาการของคุณ</p><h1>Performance</h1></div>' +
      '<div class="kpis">' +
        '<div class="kpi"><span>XP สะสม</span><b>' + S.xp + '</b></div>' +
        '<div class="kpi"><span>ความแม่นยำ</span><b>' + (acc == null ? '–' : acc + '%') + '</b></div>' +
        '<div class="kpi"><span>เรียนต่อเนื่อง</span><b>' + S.streak + ' <small>วัน</small></b></div>' +
        '<div class="kpi"><span>บทเรียนที่ผ่าน</span><b>' + doneN + '<small>/' + ALL_LESSONS.length + '</small></b></div>' +
      '</div>' +
      '<div class="card"><div class="card-head"><h3>XP 7 วันล่าสุด</h3><span>รวม ' + week + ' XP</span></div><div class="xpchart" role="img" aria-label="XP 7 วันล่าสุด: ' + vals.join(', ') + '">' + bars + '</div></div>' +
      '<div class="card"><div class="card-head"><h3>ความแม่นยำตามระดับความยาก</h3><span>ง่าย 10 · ปานกลาง 15 · ยาก 20 XP</span></div>' + diffRows + '</div>' +
      '<div class="card"><h3>ความคืบหน้ารายวิชา</h3>' + units + '</div>' +
      '<div class="card"><div class="card-head"><h3>แบบทดสอบความถนัด</h3><span>คะแนนดีที่สุด · ล่าสุด</span></div>' +
        EXAMS.filter((x) => x.id !== 'learn').map((x) => {
          const a = (S.apt || {})[x.id];
          return '<div class="mrow"><div class="mrow-top"><b>' + esc(x.title) + '</b><span>' + (a ? a.best + '% · ' + T('ล่าสุด') + ' ' + a.last + '% · ' + a.n + ' ' + T('ครั้ง') : T('ยังไม่ได้ทำ')) + '</span></div>' +
            '<div class="bar"><span style="width:' + (a ? a.best : 0) + '%"></span></div></div>';
        }).join('') + '</div>';
  }

  /* ---------- Profile (tab 4) ---------- */
  function renderProfile() {
    const name = user ? uname() : T('ผู้เยี่ยมชม');
    $('#profile-body').innerHTML =
      '<div class="profile-card"><span class="avatar char" style="--bg:' + charOf(myChar()).bg + '"><img src="' + charSrc(myChar()) + '" alt=""></span>' +
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
      users: () => '<form class="mg-add" id="mg-add" autocomplete="off"><b>เพิ่มผู้ใช้</b>' +
        '<input id="ma-email" type="email" placeholder="อีเมล (ไม่ใส่ก็ได้)">' +
        '<input id="ma-user" type="text" placeholder="ชื่อผู้ใช้ (a–z 0–9 . _ -)" autocapitalize="none" spellcheck="false" required>' +
        '<input id="ma-pw" type="text" placeholder="รหัสผ่าน (อย่างน้อย 6 ตัว)" autocomplete="new-password" required>' +
        '<select id="ma-role"><option value="user">User</option><option value="super_admin">Super admin</option></select>' +
        '<button class="btn" type="submit">เพิ่ม</button><span class="form-msg" id="ma-msg"></span></form>' +
        '<div class="mg-table-wrap"><table class="mg-table"><thead><tr><th>ผู้ใช้</th><th>XP</th><th>สมัครเมื่อ</th><th>ใช้งานล่าสุด</th><th>สิทธิ์</th></tr></thead><tbody>' +
        users.map((u) => '<tr><td><b>' + esc(u.username) + '</b><small>' + (/@no-email.ohh-exam.local$/.test(u.email || '') ? T('ไม่มีอีเมล') : esc(u.email)) + '</small></td><td>' + u.xp + '</td><td>' + fmt(u.created_at) + '</td><td>' + fmt(u.last_sign_in_at) + '</td>' +
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
    $('#mg-body').onsubmit = async (e) => {
      if (e.target.id !== 'mg-add') return;
      e.preventDefault();
      const msg = $('#ma-msg'), btn = e.target.querySelector('button[type=submit]');
      const email = $('#ma-email').value.trim(), uname = $('#ma-user').value.trim().toLowerCase(), pw = $('#ma-pw').value, role = $('#ma-role').value;
      if (!/^[a-z0-9._-]{3,20}$/.test(uname)) { msg.className = 'form-msg err'; msg.textContent = 'ชื่อผู้ใช้ใช้ได้เฉพาะ a–z 0–9 . _ - ยาว 3–20 ตัว'; return; }
      if (pw.length < 6) { msg.className = 'form-msg err'; msg.textContent = 'รหัสผ่านอย่างน้อย 6 ตัว'; return; }
      btn.disabled = true; msg.className = 'form-msg'; msg.textContent = 'กำลังเพิ่ม...';
      const { data: newId, error: err } = await sb.rpc('admin_add_user', { p_email: email, p_username: uname, p_password: pw, p_role: role });
      btn.disabled = false;
      if (err) {
        const m = err.message || '';
        msg.className = 'form-msg err';
        msg.textContent = /email already/.test(m) ? 'อีเมลนี้มีผู้ใช้แล้ว' : /username already/.test(m) ? 'ชื่อผู้ใช้นี้มีคนใช้แล้ว'
          : /bad email/.test(m) ? 'อีเมลไม่ถูกต้อง' : /admin_add_user/.test(m) ? 'ยังไม่ได้ติดตั้งฟังก์ชัน ให้รันไฟล์ database/admin_add_user.sql ใน Supabase SQL Editor' : 'เพิ่มไม่ได้: ' + m;
        return;
      }
      users.unshift({ id: newId, username: uname, email: email ? email.toLowerCase() : uname + '@no-email.ohh-exam.local', role, xp: 0, created_at: new Date().toISOString(), last_sign_in_at: null });
      showMg('users');
      toast('เพิ่มผู้ใช้ ' + uname + ' แล้ว — เข้าสู่ระบบได้ทันที');
    };
    showMg('users');
  }

  /* ---------- Aptitude tests (js/aptitude.js) ---------- */
  let aptOpen = null;
  window.APT_ICON = { series: imgIcon(APT_IMG.series), math: imgIcon(APT_IMG.math), rotation: imgIcon(APT_IMG.rotation), jigsaw: imgIcon(APT_IMG.jigsaw), joystick: imgIcon(APT_IMG.joystick), multitask: imgIcon(APT_IMG.multitask) };
  const APT_HOST = {
    back: '#learn',
    best: (id) => aptBest(id),
    finish(id, pct) {
      S.apt = S.apt || {};
      const p = S.apt[id] || { best: 0, n: 0 };
      S.apt[id] = { best: Math.max(p.best || 0, pct), last: pct, n: (p.n || 0) + 1, at: Date.now() };
      const xp = 5 + Math.round(pct / 10);
      sync(); S.xp += xp; S.todayXp += xp; S.hist[dayKey()] = (S.hist[dayKey()] || 0) + xp;
      S.daily.exams++;
      if (S.lastDay !== dayKey()) { S.streak = (S.lastDay === yesterday() ? S.streak : 0) + 1; S.lastDay = dayKey(); }
      save(); tone(pct >= 60);
      toast(T('ได้รับ +' + xp + ' XP'));
    }
  };

  /* ---------- Aviation vocabulary (data/avia/*.js → window.AVIA_TERMS) ---------- */
  // Entry: [term, abbreviation, Thai meaning, Thai explanation, category]
  const AVIA_CATS = { aircraft: 'เครื่องบินและระบบ', aero: 'อากาศพลศาสตร์และสมรรถนะ', met: 'อุตุนิยมวิทยา', nav: 'การเดินอากาศ', atc: 'ATC ห้วงอากาศ กฎหมาย', ops: 'สนามบิน ปฏิบัติการ ความปลอดภัย' };
  let AVIA = null;
  // Abbreviations in a question / its answer: full English name + Thai meaning, shown after answering.
  // Source: the aviation vocabulary (data/avia/*.js) plus a few simulator terms it does not have.
  const EXTRA_ABBR = {
    IOS: ['Instructor Operating Station', 'สถานีครูฝึก ใช้ตั้งสภาพอากาศ ใส่ความผิดปกติ และย้ายตำแหน่งเครื่องในเครื่องจำลอง'],
    'TO/GA': ['Take-Off / Go-Around', 'โหมดเร่งกำลังเต็มสำหรับขึ้นบินหรือบินขึ้นใหม่ (ยกเลิกการลงจอด)'],
    FLCH: ['Flight Level Change', 'โหมดเปลี่ยนระดับบิน คุมความเร็วด้วยการก้ม–เงยหัวเครื่อง'],
    MCDU: ['Multipurpose Control and Display Unit', 'จอและแป้นพิมพ์ของ Airbus สำหรับป้อนเส้นทางและข้อมูลให้ระบบจัดการการบิน'],
    FCU: ['Flight Control Unit', 'แผงตั้งค่าออโต้ไพลอตของ Airbus เช่น ความเร็ว ทิศทาง ความสูง'],
    MCP: ['Mode Control Panel', 'แผงตั้งค่าออโต้ไพลอตของ Boeing เช่น ความเร็ว ทิศทาง ความสูง'],
    CB: ['Cumulonimbus', 'เมฆฝนฟ้าคะนองก้อนใหญ่ (ถ้าเป็นเรื่องระบบไฟฟ้า CB = Circuit Breaker เบรกเกอร์ตัดไฟ)'],
    RA: ['Rain', 'ฝน (รหัสในรายงาน METAR) · ถ้าเป็นเรื่องเครื่องวัด RA = Radio Altimeter'],
  };
  let ABBR = null;
  function abbrMap() {
    if (ABBR) return ABBR;
    ABBR = {};
    aviaTerms().forEach((t) => {
      const a = String(t[1] || '').trim();
      if (/^[A-Z][A-Z0-9/]{1,9}$/.test(a) && !ABBR[a]) ABBR[a] = [t[0], t[2]];
    });
    return Object.assign(ABBR, EXTRA_ABBR);
  }
  function abbrBox(text) {
    const m = abbrMap(), found = [];
    (String(text).match(/[A-Z][A-Z0-9]{1,6}(?:\/[A-Z]{1,4})?/g) || []).forEach((a) => { if (m[a] && found.indexOf(a) < 0) found.push(a); });
    if (!found.length) return '';
    return '<div class="fb-abbr no-i18n"><b>ตัวย่อในข้อนี้</b>' + found.slice(0, 8).map((a) =>
      '<span><b>' + esc(a) + '</b> = ' + esc(m[a][0]) + ' — ' + esc(m[a][1]) + '</span>').join('') + '</div>';
  }
  function aviaTerms() {
    if (AVIA) return AVIA;
    const seen = new Set();
    AVIA = (window.AVIA_TERMS || []).filter((t) => {
      const k = (t[0] + '|' + t[1]).toLowerCase();
      if (!t[0] || seen.has(k)) return false;
      seen.add(k); return true;
    }).sort((a, b) => a[0].localeCompare(b[0], 'en', { sensitivity: 'base' }));
    return AVIA;
  }
  const G = { q: '', cat: 'all', limit: 60 };
  function glossaryList() {
    const q = G.q.trim().toLowerCase();
    return aviaTerms().filter((t) => (G.cat === 'all' || t[4] === G.cat) &&
      (!q || t[0].toLowerCase().includes(q) || t[1].toLowerCase().includes(q) || t[2].includes(q) || t[3].includes(q)));
  }
  function renderGlossaryList() {
    const list = glossaryList();
    $('#g-count').textContent = nfmt(list.length) + ' ' + T('คำ');
    $('#g-list').innerHTML = list.slice(0, G.limit).map((t) =>
      '<article class="g-item no-i18n"><header><b>' + esc(t[0]) + '</b>' + (t[1] ? '<span class="g-abbr">' + esc(t[1]) + '</span>' : '') +
      '<span class="g-cat">' + esc(AVIA_CATS[t[4]] || t[4]) + '</span></header>' +
      '<p class="g-th">' + esc(t[2]) + '</p></article>').join('') ||
      '<p class="note">' + T('ไม่พบคำที่ค้นหา') + '</p>';
    $('#g-more').classList.toggle('hidden', list.length <= G.limit);
  }
  function renderGlossary() {
    const all = aviaTerms(), counts = {};
    all.forEach((t) => { counts[t[4]] = (counts[t[4]] || 0) + 1; });
    $('#glossary-body').innerHTML =
      '<div class="page-banner"><p>' + T('คำศัพท์พร้อมคำแปลสั้น ๆ') + '</p><h1>' + T('คำศัพท์การบิน') + '</h1>' +
        '<div class="banner-row"><span>' + nfmt(all.length) + ' ' + T('คำ') + '</span><span>' + Object.keys(counts).length + ' ' + T('หมวด') + '</span></div></div>' +
      '<div class="g-tools"><input id="g-search" class="g-search" type="search" placeholder="' + T('ค้นหาคำศัพท์ เช่น METAR, flap, มุมปะทะ') + '" value="' + esc(G.q) + '">' +
        '<button class="btn" id="g-quiz">' + T('การ์ดคำศัพท์ 5 วิ') + '</button></div>' +
      '<div class="g-chips">' + ['all'].concat(Object.keys(AVIA_CATS).filter((k) => counts[k])).map((k) =>
        '<button class="g-chip' + (G.cat === k ? ' on' : '') + '" data-cat="' + k + '">' + (k === 'all' ? T('ทั้งหมด') : AVIA_CATS[k]) +
        ' <small>' + nfmt(k === 'all' ? all.length : counts[k]) + '</small></button>').join('') + '</div>' +
      '<p class="g-count" id="g-count"></p><div class="g-list" id="g-list"></div>' +
      '<button class="btn ghost block hidden" id="g-more">' + T('ดูเพิ่มเติม') + '</button>';
    renderGlossaryList();
  }
  /* Flash cards: every word in the current filter, shuffled; 5 seconds per card; when all are done a new
     shuffled round starts, and it keeps going until "หยุด". +2 XP per right answer. */
  const FC_SECS = 5;
  const PICTURE_FLASH_LIMIT = 30;
  const TURBOFAN_NASA = 'https://www.grc.nasa.gov/www/k-12/airplane/aturbf.html';
  const TURBOFAN_FAA = 'https://www.faa.gov/sites/faa.gov/files/regulations_policies/handbooks_manuals/aviation/airplane_handbook/20_afh_glossary.pdf';
  const TURBOFAN_FAA_POWERPLANT = 'https://www.faa.gov/sites/faa.gov/files/03_amtp_ch1.pdf';
  const TURBOFAN_FAA_PHAK = 'https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/faa-h-8083-25c.pdf';
  const TURBOFAN_NASA_NOZZLE = 'https://www.grc.nasa.gov/www/k-12/airplane/nozzle.html';
  const TURBOFAN_NASA_TURBOPROP = 'https://www.grc.nasa.gov/WWW/K-12/airplane/Animation/turbtyp/etps.html';
  const TURBOFAN_QUIZ = [
    { type: 'mc', d: 1, model: 'fan.glb', source: TURBOFAN_NASA,
      q: "หลังผ่านพัดลมหน้า อากาศใน turbofan แบ่งเป็นเส้นทางใด?",
      o: ["ผ่านแกนเครื่องยนต์และไหลอ้อมแกน","เข้าห้องเผาไหม้ทั้งหมด","ออกจากเครื่องโดยไม่สร้างแรงขับทั้งหมด","แยกเป็นอากาศเข้าและเชื้อเพลิงเข้า"], a: 0,
      ex: "อากาศหลังพัดลมส่วนหนึ่งผ่านแกนเพื่อเข้าสู่ชุดอัดอากาศ ส่วนที่เหลือไหลอ้อมแกนและช่วยสร้างแรงขับ",
      tip: "ดูพัดลมหน้าแล้วจำ «กลางเข้าแกน รอบนอกไหลอ้อม»" },
    { type: 'mc', d: 1, model: 'fan.glb', source: TURBOFAN_NASA,
      q: "ถ้ากระแสอากาศไหลอ้อมแกน 80 หน่วย และผ่านแกน 10 หน่วย Bypass Ratio เท่าไร?",
      o: ["8:1","1:8","9:1","10:1"], a: 0,
      ex: "อัตราส่วนบายพาสคิดจากอัตราการไหลมวลของอากาศอ้อมแกนหารด้วยอัตราการไหลมวลผ่านแกน จึงได้ 80 ÷ 10 = 8",
      tip: "จำ «อ้อม ÷ แกน» ใช้อัตราการไหลมวลของสองทาง" },
    { type: 'mc', d: 1, model: 'compressor.glb', source: TURBOFAN_NASA,
      q: "อากาศที่ผ่านแกนเครื่องยนต์พบชิ้นส่วนใดตามลำดับ?",
      o: ["ชุดอัดอากาศ → ห้องเผาไหม้ → กังหัน","ห้องเผาไหม้ → กังหัน → ชุดอัดอากาศ","กังหัน → ชุดอัดอากาศ → ห้องเผาไหม้","ชุดอัดอากาศ → กังหัน → ห้องเผาไหม้"], a: 0,
      ex: "อากาศถูกเพิ่มความดันก่อนเข้าสู่ห้องเผาไหม้ จากนั้นก๊าซร้อนจึงผ่านกังหัน",
      tip: "ท่อง «อัด → เผา → หมุน» ไล่จากหน้าพัดลมไปทางท้ายเครื่อง" },
    { type: 'mc', d: 1, model: 'compressor.glb', source: TURBOFAN_NASA,
      q: "อะไรคือการเปลี่ยนแปลงหลักที่ชุดอัดอากาศทำกับอากาศ?",
      o: ["ความดันเพิ่มขึ้น","เกิดการเผาไหม้ในชุดอัดอากาศ","อากาศทั้งหมดไหลออกทางบายพาส","ก๊าซแยกตัวเป็นเชื้อเพลิง"], a: 0,
      ex: "ชุดอัดอากาศรับพลังงานกลจากเพลาเพื่อเพิ่มความดันอากาศก่อนเข้าสู่ห้องเผาไหม้",
      tip: "เห็นใบหลายแถวด้านหน้า ให้คิดถึง «อัดให้ความดันสูงก่อนเผา»" },
    { type: 'mc', d: 1, model: 'combustor.glb', source: TURBOFAN_NASA,
      q: "ส่วนใดเติมพลังงานความร้อนให้กับกระแสอากาศในแกน?",
      o: ["ห้องเผาไหม้","พัดลมหน้า","ชุดอัดอากาศ","กังหัน"], a: 0,
      ex: "เชื้อเพลิงเผาไหม้กับอากาศอัดในห้องเผาไหม้ ก๊าซร้อนจึงไหลต่อไปยังกังหัน",
      tip: "จำ «ที่เผาอยู่กลาง ระหว่างที่อัดกับที่หมุน»" },
    { type: 'mc', d: 1, model: 'turbine.glb', source: TURBOFAN_NASA,
      q: "กังหันนำพลังงานจากก๊าซร้อนไปใช้อย่างไร?",
      o: ["หมุนเพลาที่ขับชุดอัดอากาศและพัดลม","ใช้ก๊าซร้อนอัดเชื้อเพลิงในถัง","เพิ่มปริมาณอากาศผ่านพัดลมโดยไม่มีเพลา","ส่งก๊าซกลับไปที่ช่องรับอากาศ"], a: 0,
      ex: "ก๊าซร้อนถ่ายพลังงานให้ใบกังหัน กังหันส่งกำลังผ่านเพลาไปยังชุดหมุนที่เชื่อมกัน",
      tip: "จำ «ก๊าซร้อนหมุนท้าย เพลากลับไปขับหน้า»" },
    { type: 'mc', d: 1, model: 'turbine.glb', source: TURBOFAN_NASA,
      q: "คำว่า two-spool ในตัวอย่าง turbofan อธิบายอะไร?",
      o: ["ชุดหมุนสองชุดที่ใช้เพลาร่วมแนวแกนและหมุนได้ต่างความเร็ว","เครื่องยนต์สองตัวที่อยู่คนละปีก","ห้องเผาไหม้สองห้องที่ทำงานสลับกัน","กระแสอากาศสองทางที่มีความเร็วเท่ากันเสมอ"], a: 0,
      ex: "แต่ละ spool ประกอบด้วยชิ้นส่วนที่เชื่อมกันด้วยเพลาเดียวกัน เพลาของสองชุดอยู่ร่วมแนวแกนโดยแต่ละชุดหมุนได้ด้วยความเร็วของตนเอง",
      tip: "จำ «สอง spool = สองชุดหมุน» แม้อยู่ตรงกลางลำเครื่องยนต์แนวเดียวกัน" },
    { type: 'mc', d: 1, model: 'fan.glb', source: TURBOFAN_NASA,
      q: "ส่วนใดของกระแสอากาศมีส่วนสร้างแรงขับใน turbofan?",
      o: ["ทั้งกระแสอ้อมแกนและไอพ่นออกจากแกน","เฉพาะอากาศที่ไหลอ้อมแกนเสมอ","เฉพาะอากาศที่ไหลผ่านแกนเสมอ","เฉพาะอากาศก่อนผ่านพัดลม"], a: 0,
      ex: "เครื่องยนต์สร้างแรงขับจากการเพิ่มโมเมนตัมให้ทั้งกระแสบายพาสและกระแสจากแกน สัดส่วนขึ้นอยู่กับการออกแบบ",
      tip: "จำ «แรงขับสองทาง» กระแสอ้อมแกนก็ช่วยผลักเครื่องบิน" },
    { type: 'mc', d: 1, model: 'compressor.glb', source: TURBOFAN_FAA,
      q: "Compressor stall คือความผิดปกติที่เริ่มจากอะไร?",
      o: ["กระแสอากาศแยกตัวจากผิวใบชุดอัดอากาศ","การเผาไหม้หยุดลงที่ห้องเผาไหม้โดยตรง","พัดลมกลับทิศหมุนตามปกติ","อากาศเปลี่ยนจากผ่านแกนไปเป็นบายพาสตามปกติ"], a: 0,
      ex: "เมื่อการไหลแยกตัวจากใบอัด บางขั้นของชุดอัดอากาศจะทำงานผิดปกติ การไหลผ่านเครื่องยนต์อาจไม่เสถียร",
      tip: "จำ «ใบอัดก็สตอลล์ได้» จุดเริ่มอยู่ที่การไหลผ่านใบอัด" },
    { type: 'mc', d: 1, model: 'combustor.glb', source: TURBOFAN_FAA,
      q: "Flameout ในเครื่องยนต์กังหันหมายถึงอะไร?",
      o: ["การเผาไหม้ในห้องเผาไหม้ดับลง","พัดลมหน้าเปลี่ยนความเร็วตามการเร่งเครื่องปกติ","ใบพัดอัดอากาศเกิดการไหลแยกตัวเสมอ","เข็มวัดอุณหภูมิแสดงค่าสูงทุกครั้ง"], a: 0,
      ex: "Flameout คือภาวะที่ไฟในห้องเผาไหม้ดับลง จึงหยุดการเติมพลังงานความร้อนตามปกติให้กระแสแกน",
      tip: "จำ «flame คือไฟ, out คือดับ» คำนี้เจาะจงที่การเผาไหม้" },
    { type: 'mc', d: 1, model: 'fan.glb', source: TURBOFAN_FAA_POWERPLANT,
      q: "ช่องรับอากาศ (inlet) อยู่ตรงไหนในเส้นทางลมของ turbofan?",
      o: ["ด้านหน้าพัดลม","ระหว่างห้องเผาไหม้กับกังหัน","หลังหัวฉีดไอเสีย","ระหว่างกังหันสองชุด"], a: 0,
      ex: "ช่องรับอากาศนำอากาศจากภายนอกเข้าสู่พัดลมและเครื่องยนต์",
      tip: "จำ «ช่องรับ → พัดลม» ไล่จากด้านหน้าสุด" },
    { type: 'mc', d: 1, model: 'fan.glb', source: TURBOFAN_NASA,
      q: "คำว่า high-bypass บอกอะไรเกี่ยวกับปริมาณอากาศในเครื่องยนต์?",
      o: ["อากาศที่ไหลอ้อมแกนมีมากเมื่อเทียบกับที่ผ่านแกน","ความดันอากาศในห้องเผาไหม้สูงที่สุดเสมอ","เชื้อเพลิงส่วนใหญ่ไหลผ่านพัดลมหน้า","แรงขับทั้งหมดมาจากไอเสียร้อน"], a: 0,
      ex: "ค่าบายพาสสูงหมายถึงอัตราการไหลมวลรอบแกนสูงเมื่อเทียบกับอัตราการไหลมวลผ่านแกน",
      tip: "จำ «บายพาสสูง = ลมอ้อมมาก»" },
    { type: 'mc', d: 1, model: 'compressor.glb', source: TURBOFAN_FAA_POWERPLANT,
      q: "ใบ rotor ของชุดอัดอากาศต่างจากใบ stator อย่างไร?",
      o: ["Rotor หมุนกับเพลา ส่วน stator อยู่กับโครงเครื่อง","Rotor อยู่กับโครงเครื่อง ส่วน stator หมุนกับเพลา","ทั้งคู่หมุนสวนกันทุกขั้น","ทั้งคู่ยึดอยู่กับที่และมีแต่เพลาที่หมุน"], a: 0,
      ex: "ใบ rotor ถ่ายพลังงานจากเพลาให้อากาศ ส่วนใบ stator เป็นแถวใบคงที่ซึ่งช่วยจัดทิศทางการไหล",
      tip: "จำ «R = Rotate» ส่วน stator อยู่กับที่แม้บางแบบปรับมุมใบได้" },
    { type: 'mc', d: 1, model: 'compressor.glb', source: TURBOFAN_FAA_POWERPLANT,
      q: "ใบ stator ระหว่างแถว rotor ช่วยเตรียมอากาศสำหรับขั้นถัดไปอย่างไร?",
      o: ["ปรับทิศทางการไหลให้เข้าใบ rotor แถวถัดไป","เร่งความเร็วของเพลาโดยตรง","จุดไฟกลางทางเดินอากาศ","เปลี่ยนอากาศให้ไหลเข้าช่องบายพาสทั้งหมด"], a: 0,
      ex: "ใบคงที่จัดมุมของกระแสลมออกจาก rotor หนึ่งขั้นให้เหมาะกับ rotor ขั้นถัดไป และมีส่วนช่วยเพิ่มความดันสถิต",
      tip: "จำ «ใบหมุนเติมพลัง ใบอยู่กับที่จัดทาง»" },
    { type: 'mc', d: 1, model: 'compressor.glb', source: TURBOFAN_FAA_POWERPLANT,
      q: "คำว่า axial-flow compressor สื่อถึงทิศทางการไหลหลักแบบใด?",
      o: ["จากหน้าสู่ท้ายในแนวเพลา","จากเพลาออกด้านข้างเป็นหลัก","ย้อนกลับจากห้องเผาไหม้สู่ช่องรับ","ไหลสลับซ้ายขวาทุกแถว"], a: 0,
      ex: "ชุดอัดอากาศแบบ axial จัดแถวใบต่อกันตามแนวยาว อากาศจึงไหลโดยรวมขนานกับแกนเพลา",
      tip: "จำ «axial = ตาม axis หรือแนวแกน»" },
    { type: 'mc', d: 1, model: 'compressor.glb', source: TURBOFAN_FAA_POWERPLANT,
      q: "ชุดอัดอากาศแบบ centrifugal ส่งอากาศออกจากใบหมุนไปทางใด?",
      o: ["จากใกล้แกนออกสู่ขอบด้านนอก","จากขอบนอกวิ่งกลับเข้าแกนตลอด","ตรงตามแนวเพลาไปท้ายเครื่องตลอด","ออกทางปลายท่อไอเสียโดยตรง"], a: 0,
      ex: "ใบ impeller เหวี่ยงอากาศออกสู่รอบนอก แล้ว diffuser ช่วยเปลี่ยนพลังงานความเร็วเป็นความดันสถิต",
      tip: "จำ «แรงหนีศูนย์ พาลมออกขอบ»" },
    { type: 'mc', d: 1, model: 'combustor.glb', source: TURBOFAN_FAA_POWERPLANT,
      q: "ทำไม diffuser ก่อนห้องเผาไหม้จึงมีทางไหลที่ช่วยให้อากาศช้าลง?",
      o: ["เพื่อให้กระแสอากาศเหมาะกับการรักษาการเผาไหม้ให้เสถียร","เพื่อให้กังหันหมุนย้อนทาง","เพื่อให้เครื่องยนต์ไม่ต้องใช้เชื้อเพลิง","เพื่อให้อากาศทั้งหมดออกไปทางบายพาส"], a: 0,
      ex: "อากาศความเร็วสูงออกจากชุดอัดถูกทำให้ช้าลงก่อนเข้าบริเวณเผาไหม้ เพื่อให้เปลวไฟคงตัวได้ง่ายขึ้น",
      tip: "จำ «ก่อนเผา ลดความเร็วลม»" },
    { type: 'mc', d: 1, model: 'combustor.glb', source: TURBOFAN_FAA_POWERPLANT,
      q: "คำว่า annular combustor อธิบายรูปร่างของห้องเผาไหม้แบบใด?",
      o: ["เป็นวงแหวนรอบแนวเพลา","เป็นท่อเดี่ยวที่ติดนอกลำเครื่อง","เป็นถังเชื้อเพลิงทรงกลมปลายปีก","เป็นแผ่นเรียบอยู่หน้าพัดลม"], a: 0,
      ex: "ห้องเผาไหม้แบบ annular จัดพื้นที่เผาไหม้เป็นวงต่อเนื่องรอบแกนกลางของเครื่องยนต์",
      tip: "จำ «annular = รูปวงแหวน»" },
    { type: 'mc', d: 1, model: 'combustor.glb', source: TURBOFAN_FAA_POWERPLANT,
      q: "อากาศบริเวณ dilution zone หลังส่วนเผาไหม้ช่วยอะไร?",
      o: ["ผสมกับก๊าซร้อนเพื่อลดและกระจายอุณหภูมิก่อนเข้ากังหัน","เพิ่มอุณหภูมิจนถึงค่าสูงสุดก่อนเข้ากังหัน","หมุนพัดลมหน้าโดยตรง","แยกเชื้อเพลิงคืนไปยังถัง"], a: 0,
      ex: "อากาศที่เติมช่วงท้ายห้องเผาไหม้ช่วยให้ก๊าซที่ส่งเข้ากังหันเย็นลงและอุณหภูมิสม่ำเสมอขึ้น",
      tip: "จำ «dilution = เจือจางความร้อนก่อนกังหัน»" },
    { type: 'mc', d: 1, model: 'combustor.glb', source: TURBOFAN_FAA_POWERPLANT,
      q: "หัวจุดระเบิด (igniter) มีหน้าที่อะไรในห้องเผาไหม้?",
      o: ["ให้ประกายเริ่มจุดส่วนผสมอากาศและเชื้อเพลิง","เพิ่มความดันอากาศแทนชุดอัด","ถ่ายกำลังกลับไปขับพัดลม","ควบคุมช่องรับอากาศด้านหน้า"], a: 0,
      ex: "หัวจุดระเบิดให้ประกายเพื่อเริ่มหรือจุดการเผาไหม้อีกครั้ง ส่วนการเผาไหม้ที่เสถียรสามารถดำเนินต่อได้เมื่อมีอากาศและเชื้อเพลิง",
      tip: "จำ «igniter จุดไฟ ส่วน combustor คือที่ที่ไฟเผาไหม้»" },
    { type: 'mc', d: 1, model: 'turbine.glb', source: TURBOFAN_FAA_POWERPLANT,
      q: "Turbine inlet guide vanes อยู่ก่อนใบกังหันหมุนเพื่อทำอะไร?",
      o: ["ปรับทิศทางก๊าซร้อนให้เข้าหาใบกังหันอย่างเหมาะสม","ฉีดเชื้อเพลิงเข้าสู่ถังเครื่องยนต์","ลดความเร็วพัดลมหน้าโดยตรง","นำก๊าซร้อนย้อนกลับไปช่องอากาศเข้า"], a: 0,
      ex: "ใบคงที่ทางเข้ากังหันจัดมุมและเร่งกระแสก๊าซก่อนเข้าปะทะใบหมุน",
      tip: "จำ «guide vane นำลมร้อน ก่อน rotor รับแรง»" },
    { type: 'mc', d: 1, model: 'turbine.glb', source: TURBOFAN_FAA_POWERPLANT,
      q: "ทำไมใบกังหันบางแบบจึงมีช่องระบายความร้อนภายใน?",
      o: ["เพื่อให้อากาศช่วยควบคุมอุณหภูมิของใบที่สัมผัสก๊าซร้อน","เพื่อเก็บเชื้อเพลิงไว้ในใบกังหัน","เพื่อลดแรงดันลมก่อนเข้าพัดลมหน้า","เพื่อทำให้ใบกังหันหมุนโดยไม่ต้องมีก๊าซ"], a: 0,
      ex: "อากาศสำหรับหล่อเย็นไหลในช่องของใบกังหัน บางแบบระบายออกที่ผิวเพื่อช่วยลดภาระความร้อนบนวัสดุ",
      tip: "จำ «ก๊าซร้อนข้างนอก อากาศช่วยหล่อเย็นข้างใน»" },
    { type: 'mc', d: 1, model: 'turbine.glb', source: TURBOFAN_FAA_POWERPLANT,
      q: "Accessory gearbox ในเครื่องยนต์กังหันมีบทบาทใด?",
      o: ["รับกำลังจากเครื่องยนต์เพื่อขับอุปกรณ์เสริม เช่น ปั๊ม","อัดอากาศหลักทั้งหมดเข้าห้องเผาไหม้","เป็นช่องทางหลักที่ก๊าซไอเสียออกจากเครื่อง","แยกการไหลเป็นแกนและบายพาส"], a: 0,
      ex: "ชุดเฟืองถ่ายทอดกำลังจากเครื่องยนต์ไปยังอุปกรณ์ประกอบ เช่น ปั๊มน้ำมันหรือปั๊มเชื้อเพลิงตามการออกแบบ",
      tip: "จำ «gearbox แจกกำลังให้อุปกรณ์ประกอบ»" },
    { type: 'mc', d: 1, model: 'turbine.glb', source: TURBOFAN_NASA_NOZZLE,
      q: "หัวฉีดไอเสีย (exhaust nozzle) มีหน้าที่หลักข้อใด?",
      o: ["จัดการการไหลและส่งก๊าซออกไปด้านท้ายเพื่อสร้างแรงขับ","รับอากาศจากภายนอกให้พัดลม","เพิ่มพลังงานความร้อนด้วยการจุดไฟในห้องเผาไหม้","รับกำลังจากเพลาไปขับปั๊ม"], a: 0,
      ex: "หัวฉีดไอเสียกำหนดลักษณะการไหลออกและเปลี่ยนพลังงานบางส่วนของกระแสให้เป็นความเร็วของไอพ่น",
      tip: "จำ «nozzle คือปากออก» อยู่ด้านท้ายทางไหล" },
    { type: 'mc', d: 1, model: 'fan.glb', source: TURBOFAN_NASA_NOZZLE,
      q: "ในหัวฉีดแบบ co-annular กระแสอากาศบายพาสออกทางส่วนใด?",
      o: ["ทางวงแหวนรอบหัวฉีดแกน","ทางหัวฉีดตรงกลางเพียงทางเดียว","ทางช่องรับอากาศด้านหน้า","ทางรูหัวฉีดเชื้อเพลิง"], a: 0,
      ex: "ในรูปแบบ co-annular กระแสจากแกนออกทางกลาง ส่วนอากาศจากพัดลมออกทางช่องวงแหวนรอบนอก",
      tip: "จำ «แกนกลางออกกลาง ลมอ้อมออกวงนอก»" },
    { type: 'mc', d: 1, model: 'turbine.glb', source: TURBOFAN_NASA_TURBOPROP,
      q: "Turboprop ใช้พลังงานจากเครื่องยนต์ไปสร้างแรงขับหลักผ่านอะไร?",
      o: ["ใบพัดที่ขับด้วยกำลังจากกังหัน","ไอเสียร้อนอย่างเดียว","พัดลมที่อยู่ในท่อบายพาสแบบ turbofan","ก๊าซที่ยังไม่ผ่านการเผาไหม้"], a: 0,
      ex: "turboprop ใช้กำลังกลจากกังหันไปขับใบพัด โดยใบพัดสร้างแรงขับส่วนใหญ่",
      tip: "จำ «prop คือ propeller» ฟังชื่อแล้วมองหาใบพัดเปิด" },
    { type: 'mc', d: 1, model: 'combustor.glb', source: TURBOFAN_FAA_PHAK,
      q: "คำว่า EGT บนมาตรวัดเครื่องยนต์ย่อมาจากอะไร?",
      o: ["Exhaust Gas Temperature","Engine Generator Torque","Estimated Ground Thrust","External Gauge Transfer"], a: 0,
      ex: "EGT คือค่าอุณหภูมิของก๊าซไอเสีย ตำแหน่งเซนเซอร์และค่าที่ใช้ติดตามขึ้นกับแบบเครื่องยนต์",
      tip: "จำ «Gas Temperature = อุณหภูมิก๊าซ» โดย E หมายถึง exhaust" },
    { type: 'mc', d: 1, model: 'combustor.glb', source: TURBOFAN_FAA_PHAK,
      q: "คำว่า Hot Start สื่อถึงความผิดปกติใดระหว่างสตาร์ตเครื่องยนต์กังหัน?",
      o: ["อุณหภูมิที่ใช้ติดตามการสตาร์ตสูงเกินขีดจำกัด","เครื่องเร่งถึงรอบเดินเบาตามปกติ","อากาศไหลอ้อมแกนตามการออกแบบ","พัดลมหมุนจากลมภายนอกในช่วงจอด"], a: 0,
      ex: "Hot start คือกรณีอุณหภูมิระหว่างเริ่มเดินเครื่องสูงเกินขีดจำกัดของเครื่องแบบนั้น",
      tip: "จำ «hot ดูอุณหภูมิ» เทียบกับ hung ที่ดูว่ารอบขึ้นต่อหรือไม่" },
    { type: 'mc', d: 1, model: 'compressor.glb', source: TURBOFAN_FAA_PHAK,
      q: "ถ้าจุดติดแล้วแต่เครื่องยนต์เร่งไม่ถึงรอบเดินเบา เรียกภาวะนี้ว่าอะไร?",
      o: ["Hung Start","Flameout ในทุกกรณี","Bypass Flow","Normal Idle"], a: 0,
      ex: "Hung start คือกรณีเครื่องเร่งไม่ถึงรอบที่ควรได้หลังจุดติด หรือไม่สามารถขึ้นถึงรอบเดินเบาได้",
      tip: "จำ «hung = รอบค้างก่อน idle»" },
    { type: 'mc', d: 1, model: 'fan.glb', source: TURBOFAN_FAA_PHAK,
      q: "FOD ที่เกิดจากการดูดสิ่งแปลกปลอมเข้าเครื่องยนต์ ย่อมาจากอะไรในบริบทของความเสียหาย?",
      o: ["Foreign Object Damage","Fan Output Difference","Fuel Overrun Detection","Forward Orbit Direction"], a: 0,
      ex: "ในบริบทนี้ FOD หมายถึงความเสียหายจากสิ่งแปลกปลอม เช่น เศษวัสดุที่ถูกดูดเข้าสู่บริเวณพัดลมหรือทางเดินอากาศ",
      tip: "จำ «Object เข้าไป → Damage ตามมา»" }
  ];
  const AIRCRAFT_FLASH = [
    { icao: 'BCS3', name: 'Airbus A220-300', asset: 'a220.glb', clue: 'เครื่องบินลำตัวแคบที่เริ่มพัฒนาภายใต้ชื่อ Bombardier CS300',
      tip: 'จำว่า «220 = CS300» เวลาดูรูปให้เริ่มจากลำตัวเรียว แล้วเทียบขนาดเครื่องยนต์กับลำตัว' },
    { icao: 'A320', name: 'Airbus A320', asset: 'a320.glb', clue: 'เครื่องบินลำตัวแคบสองเครื่องยนต์ สังเกตจมูกโค้งและประตูทางออกเหนือปีก',
      tip: 'จำ «จมูกมน + เครื่องกลม» แล้วเทียบกับ 737 ที่จมูกแหลมกว่าและเครื่องยนต์อยู่ต่ำกว่า' },
    { icao: 'A359', name: 'Airbus A350', asset: 'a350.glb', clue: 'เครื่องบินลำตัวกว้างสองเครื่องยนต์ สังเกตปลายปีกที่โค้งเชิดขึ้น',
      tip: 'จำ «ปีกเชิด» มองจากด้านหน้าเฉียงแล้วไล่จากโคนปีกไปถึงปลายที่ยกขึ้น' },
    { icao: 'A388', name: 'Airbus A380', asset: 'a380.glb', clue: 'เครื่องบินลำตัวกว้างสี่เครื่องยนต์ที่มีห้องโดยสารสองชั้นตลอดลำตัว',
      tip: 'จำ «2 ชั้น 4 เครื่อง» ดูหน้าต่างสองแถวตลอดลำ แล้วนับเครื่องยนต์ข้างละสอง' },
    { icao: 'B738', name: 'Boeing 737', asset: 'b737.glb', clue: 'เครื่องบินลำตัวแคบสองเครื่องยนต์ จมูกค่อนข้างแหลมและเครื่องยนต์ติดต่ำ',
      tip: 'จำ «จมูกแหลม + เครื่องอยู่ต่ำ» แล้วเทียบกับจมูกมนของ A320' },
    { icao: 'B788', name: 'Boeing 787 Dreamliner', asset: 'b787.glb', clue: 'เครื่องบินลำตัวกว้างสองเครื่องยนต์ สังเกตแนวปีกโค้งและขอบท้ายฝาครอบเครื่องยนต์แบบฟันเลื่อย',
      tip: 'จำ «ปีกโค้ง + ขอบเครื่องเป็นซี่» ลองหมุนไปดูด้านข้างและท้ายเครื่องยนต์' },
    { icao: 'A333', name: 'Airbus A330-300', asset: 'a333.glb', cc0: true,
      clue: 'เครื่องบินลำตัวกว้างสองเครื่องยนต์ในตระกูล A330 สังเกตปลายปีกแบบแผ่นยกขึ้น',
      tip: 'จำ «A330 ปลายปีกเป็นแผ่น» เทียบกับ A350 ที่ปลายปีกเชิดขึ้นแบบโค้งต่อเนื่อง' },
    { icao: 'B752', name: 'Boeing 757-200', asset: 'b752.glb', cc0: true,
      clue: 'เครื่องบินลำตัวแคบสองเครื่องยนต์ มีลำตัวเรียวยาวและระยะจากท้องเครื่องถึงพื้นค่อนข้างสูง',
      tip: 'จำ «757 ลำเรียวและขายาว» แล้วเทียบกับ 767 ซึ่งมีลำตัวกว้างกว่า' },
    { icao: 'B763', name: 'Boeing 767-300', asset: 'b763.glb', cc0: true,
      clue: 'เครื่องบินลำตัวกว้างสองเครื่องยนต์ สัดส่วนช่วงลำตัวดูหนากว่า 757',
      tip: 'จำ «767 ลำกว้างกว่า 757» ลองหมุนมุมหน้าเฉียงเพื่อดูหน้าตัดของลำตัว' },
    { icao: 'B77W', name: 'Boeing 777-300ER', asset: 'b77w.glb', cc0: true,
      clue: 'เครื่องบินลำตัวกว้างที่มีลำตัวยาว เครื่องยนต์คู่ขนาดใหญ่ และปลายปีกกวาดยื่นออกตามแนวปีก',
      tip: 'จำ «ลำยาว เครื่องใหญ่ ปลายปีกกวาด» แล้วเทียบกับ 787 ที่ขอบท้ายฝาครอบเครื่องยนต์เป็นซี่' },
    { icao: 'E190', name: 'Embraer E190', asset: 'e190.glb', cc0: true,
      clue: 'เจ็ตภูมิภาคที่ติดตั้งเครื่องยนต์ใต้ปีกและมีแพนหางระดับอยู่ต่ำกว่ายอดครีบหาง',
      tip: 'จำ «E190 เครื่องอยู่ใต้ปีก» ถ้าเครื่องยนต์อยู่ข้างท้ายลำและหางเป็นตัว T ให้เทียบกับ CRJ900' },
    { icao: 'CRJ9', name: 'Bombardier CRJ900', asset: 'crj9.glb', cc0: true,
      clue: 'เจ็ตภูมิภาคที่มีเครื่องยนต์ติดข้างท้ายลำตัวและแพนหางระดับอยู่บนยอดครีบหาง',
      tip: 'จำ «เครื่องคู่ท้ายลำ + หางตัว T» มองด้านข้างจะเห็นเครื่องยนต์อยู่หลังปีกหลัก' },
    { icao: 'DH8D', name: 'Dash 8 Q400', asset: 'dh8d.glb', cc0: true,
      clue: 'เครื่องบินโดยสารภูมิภาคแบบใบพัดคู่ มีปีกสูงและแพนหางระดับอยู่บนยอดครีบหาง',
      tip: 'จำ «ใบพัดคู่ ปีกบน หาง T» ใช้ตำแหน่งปีกสูงแยกจาก King Air 200 ที่ปีกอยู่ต่ำ' },
    { icao: 'BE20', name: 'Beechcraft King Air 200', asset: 'be20.glb', cc0: true,
      clue: 'เครื่องบินใบพัดคู่สำหรับงานธุรกิจและภารกิจทั่วไป มีปีกต่ำและลำตัวสั้นกว่าฝูงเครื่องโดยสารภูมิภาคในชุดนี้',
      tip: 'จำ «ใบพัดคู่ ปีกล่าง ลำสั้น» เทียบกับ Dash 8 Q400 ที่ปีกอยู่บนลำตัวและลำยาวกว่า' },
    { group: 'engine', name: 'Fan · พัดลมหน้าเครื่อง', asset: 'fan.glb', clue: 'พัดลมหน้ารับอากาศเข้าสู่เครื่องยนต์ ส่วนหนึ่งไหลผ่านแกนกลางและอีกส่วนไหลอ้อมแกนเพื่อสร้างแรงขับ',
      tip: 'จำ «จานใหญ่สุดอยู่หน้า» มองหาใบพัดแถวแรกที่กว้างกว่าชุดอื่น' },
    { group: 'engine', name: 'Compressor · ชุดอัดอากาศ', asset: 'compressor.glb', clue: 'ชุดใบพัดหลายขั้นเพิ่มความดันของอากาศก่อนส่งเข้าสู่ห้องเผาไหม้',
      tip: 'จำ «อัดก่อนเผา» ดูแถวใบพัดเล็กหลายชั้นระหว่างพัดลมหน้าและห้องเผาไหม้' },
    { group: 'engine', name: 'Combustor · ห้องเผาไหม้', asset: 'combustor.glb', clue: 'เป็นบริเวณที่อากาศอัดผสมกับเชื้อเพลิงและเกิดการเผาไหม้ ก๊าซร้อนไหลต่อไปยังกังหัน',
      tip: 'จำ «วงกลางไร้ใบ» ในโมเดลเป็นปลอกวงแหวนคั่นระหว่างชุดอัดอากาศกับกังหัน' },
    { group: 'engine', name: 'Turbine · กังหัน', asset: 'turbine.glb', clue: 'รับพลังงานจากก๊าซร้อนที่ไหลผ่าน แล้วส่งกำลังผ่านเพลาไปหมุนชุดอัดอากาศและพัดลม',
      tip: 'จำ «ก๊าซร้อนหมุนใบพัดท้าย» มองหาชุดใบพัดหลังห้องเผาไหม้' },
    { group: 'airframe', name: 'Flap · แฟลป', asset: 'flap.glb', clue: 'พื้นผิวที่ขอบท้ายปีก มักอยู่ด้านในใกล้ลำตัว ใช้เพิ่มแรงยกและแรงต้านในช่วงบินช้า',
      tip: 'จำ «แฟลปอยู่ใกล้ลำ» หมุนดูปีกจากด้านบน แล้วเทียบตำแหน่งกับแพนเอียงที่อยู่ไกลออกไป' },
    { group: 'airframe', name: 'Aileron · แพนเอียง', asset: 'aileron.glb', clue: 'พื้นผิวที่ขอบท้ายปีกด้านนอก ช่วยให้อากาศยานเอียงซ้ายหรือขวารอบแกนตามยาว',
      tip: 'จำ «ท้ายปีกนอกใช้เอียง» มองหาชิ้นที่อยู่ใกล้ปลายปีกกว่าแฟลป' },
    { group: 'airframe', name: 'Rudder · แพนหางเสือ', asset: 'rudder.glb', clue: 'พื้นผิวขยับได้ที่ขอบท้ายแพนหางดิ่ง ใช้ควบคุมการหันหัวซ้าย–ขวา',
      tip: 'จำ «หางตั้ง หัวหัน» ชิ้นที่ไฮไลต์อยู่หลังครีบแนวตั้ง' },
    { group: 'airframe', name: 'Landing Gear · ชุดฐานล้อ', asset: 'landing-gear.glb', clue: 'ชุดล้อและขารับแรงที่รองรับเครื่องบินเมื่อจอด ขับเคลื่อนบนพื้น วิ่งขึ้น หรือลงจอด',
      tip: 'จำ «ล้อ + ขารับแรง» ลองหมุนมองจากด้านข้าง จะเห็นขาเชื่อมจากโครงเครื่องลงมาที่เพลาล้อ' },
    { group: 'airframe', name: 'Elevator · แพนบังคับขึ้นลง', asset: 'elevator.glb',
      clue: 'พื้นบังคับที่ขอบท้ายแพนหางระดับ ใช้เปลี่ยนมุมก้ม–เงยของหัวเครื่องบิน (pitch)',
      tip: 'จำ «ชิ้นท้ายหางนอน ขยับหัวขึ้นลง» ส่วนคงที่ด้านหน้าคือ Horizontal Stabilizer' },
    { group: 'airframe', name: 'Horizontal Stabilizer · แพนหางระดับ', asset: 'horizontal-stabilizer.glb',
      clue: 'พื้นผิวแนวนอนที่หาง ช่วยให้เครื่องบินมีเสถียรภาพด้านก้ม–เงย ในแบบที่เห็น Elevator เป็นชิ้นขยับได้ที่ขอบท้าย',
      tip: 'จำ «แผ่นนอนแผ่นใหญ่ช่วยทรงตัว» ส่วนขอบท้ายที่เล็กกว่าใช้บังคับก้ม–เงย' },
    { group: 'airframe', name: 'Vertical Stabilizer · แพนหางดิ่ง', asset: 'vertical-stabilizer.glb',
      clue: 'ครีบแนวตั้งที่หาง ช่วยให้อากาศยานคงทิศทาง ส่วนที่ขยับได้ตรงขอบท้ายคือ Rudder',
      tip: 'จำ «ครีบตั้งช่วยคงทิศ ขอบท้ายใช้หัน» แยกแผ่นหลักที่อยู่ด้านหน้าออกจากแพนหางเสือ' },
    { group: 'airframe', name: 'Slat · สแลต', asset: 'slat.glb',
      clue: 'ชิ้นส่วนที่ขอบหน้าปีก เมื่อกางจะช่วยให้กระแสอากาศเกาะผิวปีกได้ที่มุมปะทะสูงขึ้นก่อนเกิดสตอลล์',
      tip: 'จำ «สแลตหน้า แฟลปท้าย» หมุนมองจากด้านบนเพื่อดูว่าชิ้นที่ไฮไลต์อยู่ขอบไหน' },
    { group: 'airframe', name: 'Spoiler · แผงลดแรงยก', asset: 'spoiler.glb',
      clue: 'แผงบนผิวปีกที่ยกตัวขึ้นเพื่อลดแรงยกและเพิ่มแรงต้าน บางระบบใช้ช่วยควบคุมการเอียงด้วย',
      tip: 'จำ «ฝาเด้งบนปีกเพื่อลดแรงยก» มองจากด้านข้างจะเห็นแผงยกออกจากผิวปีก' },
    { group: 'airframe', name: 'Winglet · ปลายปีกตั้ง', asset: 'winglet.glb',
      clue: 'พื้นผิวที่ปลายปีกซึ่งส่วนมากยกขึ้น ช่วยลดแรงต้านเหนี่ยวนำที่เกี่ยวข้องกับกระแสหมุนวนบริเวณปลายปีก',
      tip: 'จำ «ปีกเล็กติดปลายปีก» ไล่สายตาจากโคนปีกไปหาชิ้นที่เชิดขึ้นตรงปลายสุด' },
    { group: 'airframe', name: 'Pitot Tube · ท่อพิโตต์', asset: 'pitot.glb',
      clue: 'ท่อขนาดเล็กที่หันช่องรับอากาศไปด้านหน้าเพื่อรับความดันรวม ระบบใช้ร่วมกับความดันสถิตเพื่อหาความเร็วอากาศ',
      tip: 'จำ «ท่อเล็กหันหน้าไปรับลม» ในโมเดลให้หมุนดูข้างจมูกเครื่องบินแล้วหาปลายท่อ' },
    { group: 'airframe', name: 'Fuselage · ลำตัวเครื่องบิน', asset: 'fuselage.glb',
      clue: 'โครงสร้างส่วนกลางที่มีห้องนักบินและพื้นที่สำหรับผู้โดยสารหรือสัมภาระ เป็นจุดเชื่อมกับปีกและส่วนหาง',
      tip: 'จำ «ลำยาวจากจมูกถึงหาง» ส่วนที่ไฮไลต์คือโครงหลักที่ปีกทั้งสองข้างยื่นออกมา' }
  ];
  function aircraftFigure(aircraft) {
    const asset = 'img/aircraft-flash/' + aircraft.asset;
    const source = aircraft.reference || (aircraft.icao ? 'https://planes.fyi/aircraft/types/' + aircraft.icao : '');
    const sourceLabel = aircraft.reference ? (source.includes('.nasa.gov/') ? 'NASA' : 'FAA') : T('ดูรุ่นนี้บน Planes.FYI');
    return '<figure class="q-product-image aircraft-figure">' +
      '<model-viewer src="' + asset + '" alt="' + T('โมเดล 3D สำหรับคำถาม') + '" camera-controls touch-action="pan-y" camera-orbit="55deg 68deg 105%" shadow-intensity="0.6" loading="eager"></model-viewer>' +
      '<p class="aircraft-status" role="status">' + T('กำลังโหลดโมเดล 3D') + '</p>' +
      '<figcaption>' + (aircraft.cc0
        ? '<a href="https://github.com/oktal3700/bluebell" target="_blank" rel="noopener">Bluebell CSL</a> · ' +
          '<a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank" rel="noopener">CC0 1.0</a>'
        : T('โมเดลจำลองเพื่อการเรียนรู้')) +
      (source ? ' · <a href="' + esc(source) + '" target="_blank" rel="noopener">' + sourceLabel + '</a>'
              : ' · ' + T('สังเกตส่วนที่ไฮไลต์สีส้ม')) + '</figcaption></figure>';
  }
  function loadAircraftModel(container = '#glossary-body') {
    const model = $(container + ' model-viewer');
    if (!model) return;
    const status = model.nextElementSibling;
    const unavailable = () => {
      model.hidden = true;
      status.textContent = T('โหลดโมเดล 3D ไม่สำเร็จ ลองเปิดหน้านี้อีกครั้ง');
    };
    model.addEventListener('load', () => { status.hidden = true; }, { once: true });
    model.addEventListener('error', unavailable, { once: true });
    import('./vendor/model-viewer-4.1.0.min.js').catch(unavailable);
  }
  const VOCAB_FLASH_PARTS = {
    '#vocab-flash': '', '#vocab-flash-nouns': 'n.', '#vocab-flash-verbs': 'v.',
    '#vocab-flash-adjectives': 'adj.', '#vocab-flash-adverbs': 'adv.'
  };
  const VOCAB_PART_NAMES = { 'n.': 'คำนาม', 'v.': 'คำกริยา', 'adj.': 'คำคุณศัพท์', 'adv.': 'คำกริยาวิเศษณ์' };
  let FC = null;
  function fcStop() { if (FC) { clearInterval(FC.timer); clearTimeout(FC.next); FC.on = false; } }
  const fcId = (t, mode) => mode === 'air' ? (t.name || '') + '|' + (t.q || t.icao || '') : mode === 'pic' ? (t.q || '') : (t[0] || '') + '|' + (t[1] || '');
  function startFlash(picture = false, aircraft = false, vocabPart = null) {
    fcStop();
    const pool = vocabPart !== null
      ? (window.VOCAB_FLASH_WORDS || []).filter((word) => !vocabPart || word[1] === vocabPart)
      : aircraft ? AIRCRAFT_FLASH : picture
      ? (window.PM_QUIZ || [])
      : glossaryList().length >= 4 ? glossaryList() : aviaTerms();
    if (pool.length < 4) return toast(T('ยังไม่มีคำศัพท์ให้ทดสอบ'));
    // Never the same order: every start is a fresh shuffle, and cards not seen in earlier
    // sessions come first (the list of seen cards resets once every card has been shown)
    const mode = vocabPart !== null ? 'vocab' : aircraft ? 'air' : picture ? 'pic' : 'word';
    const seenKey = 'ohh_fc_seen_' + mode + (vocabPart || '');
    let seen = [];
    try { seen = JSON.parse(localStorage.getItem(seenKey) || '[]'); } catch (e) { seen = []; }
    let seenSet = new Set(seen);
    if (pool.every((t) => seenSet.has(fcId(t, mode)))) { seen = []; seenSet = new Set(); }
    const fresh = shuffle(pool.filter((t) => !seenSet.has(fcId(t, mode))));
    const old = shuffle(pool.filter((t) => seenSet.has(fcId(t, mode))));
    const deck = fresh.concat(old).slice(0, picture && !aircraft ? PICTURE_FLASH_LIMIT : pool.length);
    FC = { on: true, picture, aircraft, vocabPart, mode, seenKey, seen, pool, deck, i: 0, round: 1, right: 0, wrong: 0, streak: 0 };
    fcCard();
  }
  function fcCard() {
    if (!FC || !FC.on) return;
    clearTimeout(FC.next);
    if (FC.picture && FC.i >= FC.deck.length) {
      $('#glossary-body').innerHTML = '<div class="fc-wrap"><div class="fc-card"><h1>' + T('จบชุดคำถาม') +
        '</h1><b>' + FC.right + '/' + FC.deck.length + '</b><p>' + T('ตอบถูก') + '</p></div>' +
        '<div class="fc-actions"><button class="btn" id="fc-again">' + T('ทำอีกครั้ง') + '</button>' +
        '<a class="btn ghost" href="#learn">' + T('กลับไปหน้าบทเรียน') + '</a></div></div>';
      return;
    }
    if (FC.i >= FC.deck.length) { FC.deck = shuffle(FC.pool.slice()); FC.i = 0; FC.round++; toast(T('เริ่มรอบใหม่ สุ่มลำดับใหม่')); }
    const t = FC.deck[FC.i];
    // remember this card as seen, so the next session starts with cards not seen yet
    const id = fcId(t, FC.mode);
    if (FC.seen.indexOf(id) < 0) {
      FC.seen.push(id);
      if (FC.seen.length > 5000) FC.seen = FC.seen.slice(-5000);
      try { localStorage.setItem(FC.seenKey, JSON.stringify(FC.seen)); } catch (e) { /* storage full or blocked */ }
    }

    if (FC.aircraft) {
      const others = shuffle(FC.pool.filter((item) => item !== t && item.group === t.group)).slice(0, 3);
      FC.opts = shuffle([t, ...others].map((aircraft) => ({ s: aircraft.name, c: aircraft === t })));
    } else if (FC.picture) {
      FC.opts = shuffle(t.o.map((option, index) => ({ s: option, c: index === t.a })));
    } else {
      const others = [...new Set(shuffle(FC.pool).map((option) => option[2]))].filter((meaning) => meaning !== t[2]).slice(0, 3);
      FC.opts = shuffle([{ s: t[2], c: true }].concat(others.map((meaning) => ({ s: meaning, c: false }))));
    }
    FC.t = t; FC.done = false; FC.start = Date.now();
    $('#glossary-body').innerHTML =
      '<div class="fc-wrap' + (FC.picture ? ' pic' : '') + '">' +
        '<div class="fc-top"><span>' + (FC.picture ? '' : T('รอบที่') + ' ' + FC.round + ' · ') + T('คำที่') + ' ' + (FC.i + 1) + '/' + nfmt(FC.deck.length) + '</span>' +
          '<span class="fc-score"><b class="ok">✓ ' + FC.right + '</b> <b class="bad">✗ ' + FC.wrong + '</b>' + (FC.streak > 2 ? ' <b class="st">🔥 ' + FC.streak + '</b>' : '') + '</span></div>' +
        (FC.picture ? '' : '<div class="fc-bar"><span id="fc-time"></span></div>') +
        (FC.picture
          ? '<div class="fc-card fc-picture"><h1 class="no-i18n">' + (FC.aircraft ? T(t.group ? 'ชิ้นส่วนที่ไฮไลต์คืออะไร?' : 'เครื่องบินในภาพคือรุ่นใด?') : esc(t.q)) + '</h1>' +
            (FC.aircraft ? aircraftFigure(t) : productFigure(t)) + '</div>'
          : '<div class="fc-card no-i18n">' + (t[1] ? '<small>' + esc(t[1]) + '</small>' : '') + '<b>' + esc(t[0]) + '</b><i>' + esc(AVIA_CATS[t[4]] || '') + '</i></div>') +
        '<div class="fc-opts no-i18n">' + FC.opts.map((o, k) => '<button class="fc-opt" data-k="' + k + '"><span class="k">' + (k + 1) + '</span>' + esc(o.s) + '</button>').join('') + '</div>' +
        '<p class="fc-ex no-i18n" id="fc-ex" role="status"></p>' +
        '<div class="fc-actions"><button class="btn ghost" id="fc-back">' + T('หยุด') + '</button>' +
          (FC.picture && FC.i < FC.deck.length - 1 ? '<button class="btn ghost" id="fc-skip">' + T('ข้ามไว้ก่อน') + '</button>' : '') +
          '<button class="btn hidden" id="fc-next">' + T('ถัดไป') + '</button></div>' +
      '</div>';
    if (FC.picture) { if (FC.aircraft) loadAircraftModel(); return; }
    FC.timer = setInterval(() => {
      const left = FC_SECS - (Date.now() - FC.start) / 1000, bar = $('#fc-time');
      if (bar) { bar.style.width = Math.max(0, left / FC_SECS * 100) + '%'; bar.classList.toggle('low', left < 1); }
      if (left <= 0) fcAnswer(-1);   // time is up
    }, 50);
  }
  function fcAnswer(k) {
    if (!FC || !FC.on || FC.done || (k >= 0 && !FC.opts[k])) return;
    FC.done = true; clearInterval(FC.timer);
    const ok = k >= 0 && FC.opts[k].c;
    if (ok) { FC.right++; FC.streak++; S.xp += 2; S.todayXp += 2; S.hist[dayKey()] = (S.hist[dayKey()] || 0) + 2; S.daily.correct++; save(); }
    else { FC.wrong++; FC.streak = 0; }
    tone(ok);
    $$('#glossary .fc-opt').forEach((b, j) => { b.disabled = true; if (FC.opts[j].c) b.classList.add('right'); else if (j === k) b.classList.add('wrong'); });
    if (FC.aircraft) {
      $('#fc-ex').innerHTML = '<strong>' + esc(FC.t.name) + '</strong>' +
        '<span class="fc-definition">' + esc(FC.t.clue) + '</span>' +
        '<span class="fc-definition"><strong>' + T('ทริกจำง่าย') + '</strong> · ' + esc(FC.t.tip) + '</span>';
    } else if (FC.picture) {
      const question = FC.t;
      $('#fc-ex').innerHTML = '<strong>' + esc(question.o[question.a]) + '</strong>' +
        '<span class="fc-definition">' + esc(question.ex) + '</span>' +
        abbrBox([question.q].concat(question.o, [question.ex]).join(' '));
    } else {
      const [term, , meaning, description] = FC.t;
      $('#fc-ex').innerHTML =
        (k < 0 ? '<b>' + T('หมดเวลา') + '</b> · ' : '') +
        '<strong>' + esc(term) + '</strong> · ' + esc(meaning) +
        (description ? '<span class="fc-definition">' + esc(description) + '</span>' : '');
    }
    FC.i++;
    $('#glossary .fc-card').classList.add(ok ? 'is-correct' : 'is-incorrect');
    // Vocab advances after a short pause for the answer. Other modes wait for the next button.
    if (FC.mode === 'vocab') FC.next = setTimeout(fcCard, 1800);
    $('#fc-skip')?.classList.add('hidden');
    const next = $('#fc-next');
    next.classList.remove('hidden');
    next.focus({ preventScroll: true });
    next.scrollIntoView({ behavior: 'smooth', block: 'nearest' });   // phones: bring the button out from under the tab bar
  }

  /* ---------- Router: bottom tab bar ---------- */
  const PAGES = { '#learn': 'learn', '#learn-physics': 'learn', '#learn-chem': 'learn', '#learn-bio': 'learn', '#learn-math': 'learn', '#learn-toeic': 'learn', '#learn-grammar': 'learn', '#learn-vocab': 'learn', '#glossary': 'glossary', '#picture-flash': 'glossary', '#aircraft-flash': 'glossary', '#practice': 'practice', '#missions': 'missions', '#stats': 'stats', '#profile': 'profile' };
  function route() {
    if (L) return;
    if (location.hash === '#pilot') history.replaceState(null, '', location.pathname + location.search + '#learn');   // old Pilot page → Pilot lessons
    // Aptitude tests (#apt-<id>) run in their own full-screen view
    const aptId = /^#apt-(\w+)$/.exec(location.hash);
    if (aptId && window.APT && APT.TESTS[aptId[1]]) {
      if (aptOpen === aptId[1]) return;          // already open (e.g. language switch) — don't restart
      if (isGuest() && aptId[1] !== 'series') {   // guests: first test only
        history.replaceState(null, '', location.pathname + location.search + '#learn');
        route(); return askSignup();
      }
      aptOpen = aptId[1]; setCourse('pilot');
      show('apt');
      APT.open(aptOpen, APT_HOST);
      return;
    }
    if (aptOpen) { aptOpen = null; if (window.APT) APT.stop(); }
    const vocabPart = VOCAB_FLASH_PARTS[location.hash];
    const page = vocabPart !== undefined ? 'glossary' : PAGES[location.hash] || 'hub';
    const sub = location.hash === '#pilot' ? 'pilot' : location.hash === '#english' ? 'english' : null;
    if (page === 'learn') setCourse({ '#learn-physics': 'physics', '#learn-chem': 'chem', '#learn-bio': 'bio', '#learn-math': 'math', '#learn-toeic': 'toeic', '#learn-grammar': 'grammar', '#learn-vocab': 'vocab' }[location.hash] || 'pilot');
    show('home');
    ['hub', 'learn', 'glossary', 'practice', 'missions', 'stats', 'profile'].forEach((p) => $('#' + p).classList.toggle('hidden', p !== page));
    // Back arrow: Pilot lessons → Pilot page, physics lessons / Pilot page → mode picker
    $('#to-hub').classList.toggle('hidden', !(page === 'learn' || page === 'glossary' || sub));
    $('#to-hub').setAttribute('href', page === 'glossary' ? (vocabPart !== undefined ? '#learn-vocab' : '#learn') : page === 'learn' ? COURSES[course].back : '#exams');
    const tab = page === 'learn' || page === 'hub' || page === 'glossary' ? 'home' : page;
    $$('#tabbar a').forEach((a) => a.classList.toggle('on', a.dataset.tab === tab));
    sync(); renderStats();
    if (page !== 'glossary') fcStop();   // leaving the flash cards stops their timer
    if (page === 'learn') renderHome();
    else if (page === 'missions') renderMissions();
    else if (page === 'stats') renderPerf();
    else if (page === 'profile') renderProfile();
    else if (page === 'practice') renderPractice();
    else if (page === 'glossary') {
      const aircraft = location.hash === '#aircraft-flash';
      const picture = aircraft || location.hash === '#picture-flash';
      if (vocabPart !== undefined) {
        if (!(FC && FC.on && FC.mode === 'vocab' && FC.vocabPart === vocabPart)) startFlash(false, false, vocabPart);
      } else if (picture) {
        if (!(FC && FC.on && FC.picture && FC.aircraft === aircraft)) startFlash(true, aircraft);
      } else if (!(FC && FC.on && FC.mode === 'word')) {
        fcStop();
        renderGlossary();
      }
    }
    else renderHub(sub);
    $('#tab-dot').classList.toggle('hidden', !claimable());
    $('#tab-dot-p').classList.toggle('hidden', !Object.keys(S.miss || {}).some((k) => QBANK[k]));
  }
  window.addEventListener('hashchange', () => { if (!L) route(); });

  // Picture flash cards: show the picture as big as it stays sharp (at most 2.2× its real size),
  // tap it to see it full screen; tap again (or Esc) to close
  document.addEventListener('load', (e) => {
    const img = e.target;
    if (!(img instanceof HTMLImageElement) || !img.closest('.fc-picture')) return;
    img.style.maxWidth = 'min(100%, ' + Math.round(img.naturalWidth * 2.2) + 'px)';
    img.style.maxHeight = 'min(var(--fc-img-h, 62vh), ' + Math.round(img.naturalHeight * 2.2) + 'px)';
  }, true);
  document.addEventListener('click', (e) => {
    const zoom = document.querySelector('.img-zoom');
    if (zoom) { zoom.remove(); return; }
    const img = e.target.closest('.fc-picture .q-product-image img');
    if (!img) return;
    const z = document.createElement('div');
    z.className = 'img-zoom';
    z.innerHTML = '<img src="' + img.getAttribute('src') + '" alt=""><span>' + T('แตะเพื่อปิด') + '</span>';
    document.body.appendChild(z);
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { const z = document.querySelector('.img-zoom'); if (z) z.remove(); } });
  window.addEventListener('langchange', () => { if (!L) route(); });

  // Home search
  $('#hub').addEventListener('input', (e) => { if (e.target.id === 'hub-q') hubSearch(e.target.value); });
  $('#hub').addEventListener('keydown', (e) => {
    if (e.target.id !== 'hub-q' || e.key !== 'Enter' || !aviaTerms().length) return;
    const shown = $$('#exam-grid .mode-card:not(.hidden)').length;
    if (!shown || e.target.value.trim()) { G.q = e.target.value; G.cat = 'all'; G.limit = 60; if (!shown) location.hash = '#glossary'; }
  });
  $('#hub').addEventListener('click', (e) => { if (e.target.closest('#hub-to-g')) { G.q = $('#hub-q').value; G.cat = 'all'; G.limit = 60; } });

  // Glossary: search as you type, category chips, "show more", flash cards
  $('#glossary').addEventListener('input', (e) => {
    if (e.target.id !== 'g-search') return;
    G.q = e.target.value; G.limit = 60; renderGlossaryList();
  });
  $('#glossary').addEventListener('click', (e) => {
    if (FC && FC.on) {
      const o = e.target.closest('.fc-opt'); if (o) return fcAnswer(+o.dataset.k);
      if (e.target.closest('#fc-again')) return startFlash(FC.picture, FC.aircraft);
      if (e.target.closest('#fc-next') && FC.done) return fcCard();
      if (e.target.closest('#fc-skip') && FC.picture && !FC.done && FC.i < FC.deck.length - 1) {
        const [deferred] = FC.deck.splice(FC.i, 1);
        FC.deck.push(deferred);
        return fcCard();
      }
      if (e.target.closest('#fc-back')) { if (FC.mode === 'vocab') { fcStop(); location.hash = '#learn-vocab'; return; } if (FC.picture) { location.hash = '#learn'; return; } fcStop(); return renderGlossary(); }
      return;
    }
    const chip = e.target.closest('.g-chip');
    if (chip) { G.cat = chip.dataset.cat; G.limit = 60; $$('#glossary .g-chip').forEach((c) => c.classList.toggle('on', c === chip)); return renderGlossaryList(); }
    if (e.target.closest('#g-more')) { G.limit += 60; return renderGlossaryList(); }
    if (e.target.closest('#g-quiz')) startFlash();
  });

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

  /* ---------- Pictures (data/figs.js) ---------- */
  function figFor(q) {
    if (!window.FIGS || !q) return null;
    const lid = q.__key ? q.__key.split('#')[0] : '';
    const c = /^bio-/.test(lid) ? 'bio' : /^chem-/.test(lid) ? 'chem' : /^phy-/.test(lid) ? 'physics' : /^math-/.test(lid) ? 'math' : 'pilot';
    const text = (q.q || '') + ' ' + (q.ex || '');
    const k = Object.keys(FIGS).find((id) => FIGS[id].course === c && FIGS[id].keys.test(text));
    return k ? FIGS[k] : null;
  }
  const figParts = (f) => !f.parts ? '' : '<dl class="fig-parts">' + f.parts.map((p) => '<div><dt>' + esc(p[0]) + '</dt><dd>' + esc(p[1]) + '</dd></div>').join('') + '</dl>';
  function openFig(id) {
    const f = (window.FIGS || {})[id]; if (!f) return;
    const box = $('#modal-box');
    box.classList.add('wide');
    box.innerHTML = '<button class="mx" id="mx" aria-label="ปิด">' + ICON.x + '</button><h3>' + f.title + '</h3><div class="fig-big no-i18n">' + f.svg + figParts(f) + '</div>';
    $('#modal').classList.remove('hidden');
    modalOutside = null;
    modalGuard = () => confirm(T('ปิดภาพนี้?'));   // outside click / Esc asks first; × closes directly
    $('#mx').onclick = closeModal;
  }

  /* ---------- Modal & toast ---------- */
  let modalOutside = null, modalGuard = null;
  function modal(o) {
    $('#modal-box').classList.remove('wide', 'primer');
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
  function closeModal() { $('#modal').classList.add('hidden'); $('#modal-box').classList.remove('wide', 'primer'); modalOutside = null; modalGuard = null; }
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
    if (e.target.closest('#turbofan-quiz')) return startPractice(TURBOFAN_QUIZ, 'Turbofan 3D Quiz', TURBOFAN_QUIZ.length);
    if (e.target.closest('#pm-quiz')) return startPractice(window.PM_QUIZ || [], 'Project Magenta Quiz', window.PM_QUIZ?.length);
    const arrow = e.target.closest('.row-arrow');
    if (arrow) {
      const row = arrow.closest('.topic-carousel, .unit').querySelector('.topic-row, .lesson-row');
      row.scrollBy({ left: +arrow.dataset.dir * (row.clientWidth * 0.8), behavior: 'smooth' });
      return;
    }
    const tb = e.target.closest('.topic-btn');
    if (tb) { const sec = document.getElementById(tb.dataset.go); if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    const fc = e.target.closest('.fig-card');
    if (fc) return openFig(fc.dataset.fig);
    const pc = e.target.closest('.primer-card');
    if (pc) return openPrimer(+pc.dataset.unit);
    if (e.target.closest('.lesson-card.guest')) return askSignup();
    const ex = e.target.closest('a.exam-lc');
    if (ex) return;   // aptitude test link: the router opens it
    const n = e.target.closest('.lesson-card'); if (!n) return;
    if (n.classList.contains('locked')) return toast('ผ่านบทเรียนก่อนหน้าก่อน แล้วบทนี้จะปลดล็อก');
    startLesson(+n.dataset.i);
  });
  $('#path').addEventListener('scroll', (e) => { if (e.target.matches('.lesson-row, .topic-row')) updateArrows(e.target); }, true);
  window.addEventListener('resize', () => $$('#path :is(.lesson-row, .topic-row)').forEach(updateArrows));

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
    if (FC && FC.on && /^[1-4]$/.test(e.key)) return fcAnswer(+e.key - 1);   // flash cards: keys 1–4
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

  function connectAccount() {
    if (sb || !CFG.url || !CFG.key || !window.supabase) return;
    sb = window.supabase.createClient(CFG.url, CFG.key);
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
          if (!L) route();
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
  if (window.supabase) connectAccount();
  else document.getElementById('supabase-sdk')?.addEventListener('load', connectAccount, { once: true });
})();
