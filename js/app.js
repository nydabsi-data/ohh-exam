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
  const save = () => {
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ }
    if (sb && user) { clearTimeout(pushTimer); pushTimer = setTimeout(pushRemote, 1500); }
  };

  /* ---------- Supabase: sign-in + progress sync (optional) ---------- */
  const CFG = window.PE_SUPABASE || {};
  const sb = CFG.url && CFG.key && window.supabase ? window.supabase.createClient(CFG.url, CFG.key) : null;
  let user = null, pushTimer = null;

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
    ta.textContent = user ? (user.email || '?').charAt(0).toUpperCase() : 'เข้าสู่ระบบ';
    ta.title = user ? user.email : 'เข้าสู่ระบบเพื่อบันทึกความคืบหน้า';
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
    const acct = user
      ? '<div class="card"><h3>บัญชี</h3><p class="acct">' + esc(user.email || '') + '</p><p class="note flat">ความคืบหน้าซิงก์อัตโนมัติ ใช้ได้ทุกอุปกรณ์</p><button class="linkbtn" id="logout">ออกจากระบบ</button></div>'
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
    { id: 'learn', title: 'Pilot Knowledge', th: 'ความรู้นักบิน แบบบทเรียนสั้น', icon: 'book', color: '#58CC02', dark: '#58A700', href: '#learn', meta: ['6 วิชา', 'XP · Streak'] },
    { id: 'series', title: 'Series Number', th: 'หาตัวเลขถัดไปในอนุกรม', icon: 'series', color: '#1CB0F6', dark: '#1899D6', href: 'exams/series/', meta: ['15 ข้อ', '6 นาที'] },
    { id: 'math', title: 'Math Test', th: 'คณิตศาสตร์สำหรับนักบิน', icon: 'math', color: '#FF9600', dark: '#CC7800', href: 'exams/math/', meta: ['20 ข้อ', '30 นาที'] },
    { id: 'rotation', title: 'Aircraft Rotation', th: 'อ่านทิศทางและการหมุนของเครื่องบิน', icon: 'plane', color: '#CE82FF', dark: '#A568CC', href: 'exams/rotation/', meta: ['12 ข้อ', '3 นาที'] },
    { id: 'jigsaw', title: 'Spatial Jigsaw', th: 'มิติสัมพันธ์ ประกอบชิ้นส่วนภาพ', icon: 'puzzle', color: '#FF4B4B', dark: '#EA2B2B', href: 'exams/jigsaw/', meta: ['10 ข้อ', '3 นาที'] },
    { id: 'joystick', title: 'Joy Stick', th: 'ควบคุมและความแม่นยำ', icon: 'stick', color: '#2B70C9', dark: '#1F5AA6', href: 'exams/joystick/', meta: ['90 วินาที'] },
    { id: 'multitask', title: 'Multitask', th: 'ทำหลายอย่างพร้อมกัน', icon: 'multi', color: '#00B8A9', dark: '#00968A', href: 'exams/multitask/', meta: ['5 นาที'] }
  ];

  function renderHub() {
    const doneN = LESSONS.filter((l) => isDone(l.id)).length;
    $('#hub-hello').textContent = user ? 'สวัสดี ' + (user.email || '').split('@')[0] : 'สวัสดีผู้เยี่ยมชม';
    $('#exam-grid').innerHTML = EXAMS.map((x) => {
      const extra = x.id === 'learn'
        ? '<span class="ex-prog"><span class="bar"><span style="width:' + (doneN / LESSONS.length) * 100 + '%"></span></span><b>' + doneN + '/' + LESSONS.length + '</b></span>'
        : '';
      return '<a class="exam-card" href="' + x.href + '" style="--c:' + x.color + ';--d:' + x.dark + '">' +
        '<span class="ex-ico">' + EX_ICON[x.icon] + '</span>' +
        '<span class="ex-body"><b class="ex-title">' + esc(x.title) + '</b><span class="ex-th">' + esc(x.th) + '</span>' +
        '<span class="ex-meta">' + x.meta.map((m) => '<i>' + esc(m) + '</i>').join('') + '</span>' + extra + '</span>' +
        '<span class="ex-go">เริ่ม</span></a>';
    }).join('');
  }

  function route() {
    if (L) return;
    const learn = location.hash === '#learn';
    show('home');
    $('#hub').classList.toggle('hidden', learn);
    $('#learn').classList.toggle('hidden', !learn);
    $('#to-hub').classList.toggle('hidden', !learn);
    if (learn) renderHome(); else { sync(); renderStats(); renderHub(); }
  }
  window.addEventListener('hashchange', () => { if (!L) route(); });

  /* ---------- Modal & toast ---------- */
  let modalOutside = null, modalGuard = null;
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
  function closeModal() { $('#modal').classList.add('hidden'); modalOutside = null; modalGuard = null; }
  function dismissModal() {
    if (modalGuard && !modalGuard()) return;   // form pop-ups ask before leaving
    const f = modalOutside; closeModal(); if (f) f();
  }

  const gotoLogin = () => { location.href = 'login.html'; };

  function openAccount() {
    if (!user) return gotoLogin();
    modal({
      title: 'บัญชีของคุณ',
      body: esc(user.email || '') + '<br>ความคืบหน้าซิงก์อัตโนมัติ',
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
    const n = e.target.closest('.node'); if (!n) return;
    if (n.classList.contains('locked')) return toast('ผ่านบทเรียนก่อนหน้าก่อน แล้วบทนี้จะปลดล็อก');
    startLesson(+n.dataset.i);
  });

  $('#top-acct').addEventListener('click', openAccount);
  $('#aside').addEventListener('click', (e) => {
    if (e.target.id === 'login') return gotoLogin();
    if (e.target.id === 'logout') return signOut();
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

  if (sb) {
    sb.auth.onAuthStateChange((ev, session) => {
      const u = session ? session.user : null;
      const changed = (u && u.id) !== (user && user.id);
      user = u;
      if (changed && user) setTimeout(pullRemote, 0);   // don't call Supabase inside the callback
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
