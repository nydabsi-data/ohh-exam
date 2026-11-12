/* Ohh-Exam — pilot aptitude tests, written for Ohh-Exam (no outside content).
   Every run generates fresh questions, so the tests can be practised again and again.
   API: window.APT.open(id, host) / APT.stop() / APT.TESTS
   host = { best(id) -> number|null, finish(id, pct, summary), back: '#learn' } */
(function () {
  'use strict';
  const $ = (s, r) => (r || document).querySelector(s);
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const fmt = (s) => { s = Math.max(0, Math.ceil(s)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  const nf = (n) => Number(n).toLocaleString('en-US');
  const T = (s) => (window.I18N ? window.I18N.t(s) : s);

  /* ---------- Test list ---------- */
  const TESTS = {
    series:    { title: 'Series Number', th: 'หาตัวเลขถัดไปในอนุกรม', kind: 'mc', n: 15, secs: 360,
      rules: ['15 ข้อ เวลา 6 นาที', 'หาตัวเลขถัดไปของอนุกรม เลือก 1 คำตอบ', 'ข้อสอบสุ่มใหม่ทุกครั้ง', 'ไม่ใช้เครื่องคิดเลข'] },
    math:      { title: 'Math Test', th: 'คณิตคิดเร็วสำหรับนักบิน', kind: 'mc', n: 20, secs: 480,
      rules: ['20 ข้อ เวลา 8 นาที', 'บวก ลบ คูณ หาร เปอร์เซ็นต์ และโจทย์การบิน (ความเร็ว เวลา น้ำมัน)', 'คิดในใจ ไม่ใช้เครื่องคิดเลข', 'ข้อสอบสุ่มใหม่ทุกครั้ง'] },
    rotation:  { title: 'Aircraft Rotation', th: 'การหมุนและทิศทางของเครื่องบิน', kind: 'mc', n: 15, secs: 240,
      rules: ['15 ข้อ เวลา 4 นาที', 'หาเครื่องบินที่เป็นลำเดียวกับต้นแบบแต่ถูกหมุน (ไม่ใช่ภาพกลับด้าน)', 'ดูจุดสีแดงที่ปลายปีกซ้าย และแถบสีเหลืองที่หางขวา', 'บางข้อให้บอกทิศที่เครื่องบินกำลังมุ่งหน้าไป'] },
    jigsaw:    { title: 'Spatial Jigsaw', th: 'มิติสัมพันธ์ ประกอบชิ้นส่วน', kind: 'mc', n: 12, secs: 300,
      rules: ['12 ข้อ เวลา 5 นาที', 'เลือกชิ้นส่วนที่เติมช่องว่างให้เต็มสี่เหลี่ยมพอดี', 'ชิ้นส่วนถูกหมุนได้ แต่ไม่ถูกพลิกกลับด้าน', 'ข้อสอบสุ่มใหม่ทุกครั้ง'] },
    joystick:  { title: 'Joy Stick', th: 'ควบคุมและความแม่นยำ', kind: 'joy', secs: 60,
      rules: ['ทดสอบ 60 วินาที', 'บังคับจุดสีขาวให้อยู่ในวงเป้าหมายที่เคลื่อนที่ตลอดเวลา', 'คอมพิวเตอร์: ปุ่มลูกศร หรือ W A S D · มือถือ: ลากปุ่มจอยด้านล่าง', 'จุดมีแรงเฉื่อยและมีลมพัด ต้องประคองให้นิ่ง'] },
    multitask: { title: 'Multitask', th: 'ทำหลายอย่างพร้อมกัน', kind: 'multi', secs: 90,
      rules: ['ทดสอบ 90 วินาที ทำ 3 งานพร้อมกัน', 'เลขคณิต: ตอบว่าสมการถูก (F) หรือผิด (J)', 'ไฟเตือน: กดไฟที่เป็นสีแดงให้ทันภายใน 2.5 วินาที (ปุ่ม 1–4)', 'มาตรวัด: เมื่อเข็มเข้าโซนแดง กด "ปรับ" (Space) ให้กลับมาตรงกลาง'] }
  };

  /* ---------- Shared helpers ---------- */
  function numOptions(ans, gen) {
    const out = [ans], seen = new Set([ans]);
    for (let g = 0; out.length < 4 && g < 300; g++) {
      const c = gen();
      if (Number.isFinite(c) && !seen.has(c) && c >= 0) { seen.add(c); out.push(c); }
    }
    for (let k = 1; out.length < 4; k++) if (!seen.has(ans + k)) { seen.add(ans + k); out.push(ans + k); }
    shuffle(out);
    return { opts: out, a: out.indexOf(ans) };
  }

  /* ---------- 1. Series Number ---------- */
  function genSeries() {
    const t = rnd(0, 8);
    let seq, next, ex;
    if (t === 0) {
      const d = pick([3, 4, 5, 6, 7, 8, 9, 11, 12, 15, -3, -4, -6, -7, -9]); const a = d < 0 ? rnd(60, 99) : rnd(2, 40);
      seq = [0, 1, 2, 3, 4].map((i) => a + d * i); next = a + d * 5;
      ex = d > 0 ? 'เพิ่มขึ้นทีละ ' + d : 'ลดลงทีละ ' + (-d);
    } else if (t === 1) {
      const a = rnd(1, 6), r = pick([2, 3]);
      seq = [0, 1, 2, 3, 4].map((i) => a * Math.pow(r, i)); next = a * Math.pow(r, 5);
      ex = 'คูณด้วย ' + r + ' ทุกครั้ง';
    } else if (t === 2) {
      const a = rnd(1, 20), d = rnd(1, 5), k = rnd(1, 3); seq = [a];
      for (let i = 0; i < 4; i++) seq.push(seq[i] + d + k * i);
      next = seq[4] + d + k * 4;
      ex = 'ผลต่างเพิ่มขึ้นทีละ ' + k + ' (' + [0, 1, 2, 3, 4].map((i) => '+' + (d + k * i)).join(', ') + ')';
    } else if (t === 3) {
      const a = rnd(1, 15), d1 = rnd(2, 6), b = rnd(20, 60), d2 = pick([-3, -2, 2, 3, 5]);
      seq = []; for (let i = 0; i < 4; i++) { seq.push(a + d1 * i); if (i < 3) seq.push(b + d2 * i); }
      next = b + d2 * 3;
      ex = 'มีสองชุดสลับกัน: ชุดแรกเพิ่มทีละ ' + d1 + ' ชุดที่สอง' + (d2 > 0 ? 'เพิ่มทีละ ' + d2 : 'ลดทีละ ' + (-d2)) + ' ตัวถัดไปอยู่ในชุดที่สอง';
    } else if (t === 4) {
      const n0 = rnd(1, 6), c = rnd(-3, 5);
      seq = [0, 1, 2, 3, 4].map((i) => (n0 + i) * (n0 + i) + c); next = (n0 + 5) * (n0 + 5) + c;
      ex = 'เลขยกกำลังสอง n²' + (c ? (c > 0 ? ' + ' + c : ' − ' + (-c)) : '') + ' โดย n = ' + n0 + ', ' + (n0 + 1) + ', ' + (n0 + 2) + ', …';
    } else if (t === 5) {
      const a = rnd(1, 5), b = rnd(2, 7); seq = [a, b];
      while (seq.length < 6) seq.push(seq[seq.length - 1] + seq[seq.length - 2]);
      next = seq[4] + seq[5];
      ex = 'แต่ละตัวเท่ากับผลบวกของสองตัวก่อนหน้า (' + seq[4] + ' + ' + seq[5] + ')';
    } else if (t === 6) {
      const m = pick([2, 3]), c = rnd(1, 6); seq = [rnd(1, 5)];
      for (let i = 0; i < 5; i++) seq.push(i % 2 === 0 ? seq[i] * m : seq[i] + c);
      next = seq[5] + c;   // the 6th step (i = 5) is a "+c" step
      ex = 'สลับกันระหว่าง ×' + m + ' และ +' + c;
    } else if (t === 7) {
      const c = pick([1, 2, 3, -1, -2]); seq = [rnd(3, 7)];
      for (let i = 0; i < 4; i++) seq.push(seq[i] * 2 + c);
      next = seq[4] * 2 + c;
      ex = 'คูณ 2 แล้ว' + (c > 0 ? 'บวก ' + c : 'ลบ ' + (-c));
    } else {
      const k = rnd(1, 5), r = pick([2, 3]);
      seq = [5, 4, 3, 2, 1].map((p) => k * Math.pow(r, p)); next = k;
      ex = 'หารด้วย ' + r + ' ทุกครั้ง';
    }
    const step = Math.max(2, Math.abs(next - seq[seq.length - 1]));
    const o = numOptions(next, () => next + pick([-1, 1]) * pick([1, 2, rnd(1, step), step, Math.round(step / 2) || 1]));
    return { q: '<div class="apt-seq">' + seq.map(nf).join('<i>,</i> ') + '<i>,</i> <b>?</b></div>',
      opts: o.opts.map(nf), a: o.a, ex: ex, plain: seq.join(', ') + ', ?' };
  }

  /* ---------- 2. Math ---------- */
  function genMath() {
    const t = rnd(0, 11);
    let q, ans, unit = '', ex;
    if (t === 0) { const a = rnd(120, 899), b = rnd(45, 499); q = a + ' + ' + b; ans = a + b; ex = a + ' + ' + b + ' = ' + ans; }
    else if (t === 1) { const a = rnd(300, 999), b = rnd(45, a - 50); q = a + ' − ' + b; ans = a - b; ex = a + ' − ' + b + ' = ' + ans; }
    else if (t === 2) { const a = rnd(12, 49), b = rnd(3, 9); q = a + ' × ' + b; ans = a * b; ex = a + ' × ' + b + ' = ' + ans; }
    else if (t === 3) { const b = rnd(3, 12), r = rnd(6, 40); q = (b * r) + ' ÷ ' + b; ans = r; ex = (b * r) + ' ÷ ' + b + ' = ' + r; }
    else if (t === 4) { const p = pick([10, 15, 20, 25, 30, 40, 50, 75]), y = 20 * rnd(2, 30); q = p + '% ของ ' + y; ans = p * y / 100; ex = y + ' × ' + p + ' ÷ 100 = ' + ans; }
    else if (t === 5 || t === 6) {
      let gs, mins, d;
      do { gs = pick([90, 100, 120, 150, 180, 210, 240]); mins = pick([10, 12, 15, 20, 30, 40, 45]); d = gs * mins / 60; } while (d % 1);
      if (t === 5) { q = 'ความเร็วภาคพื้น ' + gs + ' kt บินนาน ' + mins + ' นาที ได้ระยะทางกี่ NM'; ans = d; unit = ' NM'; ex = gs + ' × ' + mins + ' ÷ 60 = ' + d + ' NM'; }
      else { q = 'ระยะทาง ' + d + ' NM ความเร็วภาคพื้น ' + gs + ' kt ใช้เวลากี่นาที'; ans = mins; unit = ' นาที'; ex = d + ' ÷ ' + gs + ' × 60 = ' + mins + ' นาที'; }
    }
    else if (t === 7) {
      let rate, mins, f;
      do { rate = pick([6, 8, 9, 10, 12, 14]); mins = pick([30, 45, 90, 120, 150]); f = rate * mins / 60; } while (f % 1);
      q = 'อัตราสิ้นเปลือง ' + rate + ' แกลลอน/ชม. บินนาน ' + mins + ' นาที ใช้น้ำมันกี่แกลลอน'; ans = f; unit = ' gal'; ex = rate + ' × ' + mins + ' ÷ 60 = ' + f;
    }
    else if (t === 8) { const rate = pick([500, 700, 1000]), m = rnd(3, 12), alt = rate * m; q = 'ลดระดับ ' + nf(alt) + ' ft ด้วยอัตรา ' + rate + ' ft/นาที ใช้เวลากี่นาที'; ans = m; unit = ' นาที'; ex = nf(alt) + ' ÷ ' + rate + ' = ' + m + ' นาที'; }
    else if (t === 9) {
      const tas = 5 * rnd(20, 40), w = rnd(5, 35), head = Math.random() < 0.5;
      q = 'TAS ' + tas + ' kt ' + (head ? 'ลมปะทะหน้า' : 'ลมส่งท้าย') + ' ' + w + ' kt ความเร็วภาคพื้นเท่าใด'; ans = head ? tas - w : tas + w; unit = ' kt';
      ex = tas + (head ? ' − ' : ' + ') + w + ' = ' + ans + ' kt';
    }
    else if (t === 10) { const k = rnd(3, 12); q = 'กฎ 3:1 — ต้องลดระดับ ' + nf(k * 1000) + ' ft ควรเริ่มลดระดับห่างจากจุดหมายกี่ NM'; ans = 3 * k; unit = ' NM'; ex = 'ทุก 1,000 ft ใช้ระยะ 3 NM → ' + k + ' × 3 = ' + ans + ' NM'; }
    else { const den = pick([3, 4, 5, 8]), num = rnd(1, den - 1), base = den * rnd(4, 30); q = num + '/' + den + ' ของ ' + base; ans = base / den * num; ex = base + ' ÷ ' + den + ' × ' + num + ' = ' + ans; }
    const o = numOptions(ans, () => pick([ans + rnd(1, 9), ans - rnd(1, 9), ans + 10, ans - 10, Math.round(ans * 1.1), Math.round(ans * 0.9), ans * 2]));
    return { q: '<div class="apt-math">' + q + (/[ก-๙]/.test(q) ? '' : ' = ?') + '</div>', opts: o.opts.map((n) => nf(n) + unit), a: o.a, ex: ex, plain: q };
  }

  /* ---------- 3. Aircraft Rotation ---------- */
  const PLANE =
    '<path d="M0,-46 C5,-41 6,-31 6,-18 L6,30 C6,38 3,44 0,47 C-3,44 -6,38 -6,30 L-6,-18 C-6,-31 -5,-41 0,-46Z" fill="#1CB0F6"/>' +
    '<path d="M-6,-6 L-46,9 L-46,16 L-6,10Z M6,-6 L46,9 L46,16 L6,10Z" fill="#4A9FEA"/>' +
    '<path d="M-5,29 L-20,39 L-20,44 L-5,40Z M5,29 L20,39 L20,44 L5,40Z" fill="#4A9FEA"/>' +
    '<ellipse cx="0" cy="-30" rx="3.4" ry="6.5" fill="#fff"/>' +
    '<circle cx="-40" cy="12" r="5.5" fill="#FF4B4B" stroke="#fff" stroke-width="1.5"/>' +
    '<rect x="8" y="38.5" width="11" height="4.5" rx="1" fill="#FFC800" stroke="#fff" stroke-width="1"/>';
  const planeSvg = (rot, mirror) => '<svg class="apt-plane" viewBox="-52 -52 104 104"><g transform="rotate(' + rot + ')"><g' + (mirror ? ' transform="scale(-1,1)"' : '') + '>' + PLANE + '</g></g></svg>';
  const DIRS = ['N (000°)', 'NE (045°)', 'E (090°)', 'SE (135°)', 'S (180°)', 'SW (225°)', 'W (270°)', 'NW (315°)'];
  function genRotation(i) {
    if (i % 3 === 2) {   // heading question
      const h = rnd(0, 7), cand = [h, (h + 4) % 8, (8 - h) % 8, (h + 2) % 8, (h + 6) % 8, (h + 1) % 8].filter((v, k, a) => a.indexOf(v) === k);
      const opts = shuffle([h].concat(shuffle(cand.slice(1)).slice(0, 3)));
      const compass = '<svg class="apt-compass" viewBox="-60 -60 120 120"><circle r="56" fill="#F4FAFF" stroke="#CFE6F7" stroke-width="2"/>' +
        ['N', 'E', 'S', 'W'].map((d, k) => '<text x="' + [0, 50, 0, -50][k] + '" y="' + [-45, 4, 52, 4][k] + '" text-anchor="middle" font-size="11" font-weight="800" fill="' + (d === 'N' ? '#FF4B4B' : '#8AA0B6') + '">' + d + '</text>').join('') +
        '<g transform="scale(.72)">' + planeSvg(h * 45, false).replace(/^<svg[^>]*>|<\/svg>$/g, '') + '</g></svg>';
      return { q: '<div class="apt-fig">' + compass + '</div><p class="apt-ask">เครื่องบินลำนี้กำลังมุ่งหน้าไปทิศใด (มองจากด้านบน ทิศเหนืออยู่ด้านบน)</p>',
        opts: opts.map((k) => DIRS[k]), a: opts.indexOf(h), ex: 'หัวเครื่องชี้ไปทาง ' + DIRS[h], plain: 'ทิศของเครื่องบิน' };
    }
    const r0 = rnd(0, 11) * 30, ok = rnd(0, 3), used = new Set();
    const opts = [0, 1, 2, 3].map((k) => {
      let r; do { r = rnd(0, 23) * 15; } while (used.has(r) || r === r0); used.add(r);
      return planeSvg(r, k !== ok);
    });
    return { q: '<div class="apt-fig ref">' + planeSvg(r0, false) + '<span>ต้นแบบ</span></div><p class="apt-ask">ข้อใดคือเครื่องบินลำเดียวกับต้นแบบที่ถูกหมุน (ไม่ใช่ภาพกลับด้าน)</p>',
      opts, a: ok, grid: true, ex: 'ลำที่ถูกต้องมีจุดแดงที่ปีกซ้ายและแถบเหลืองที่หางขวาเหมือนต้นแบบ ลำอื่นเป็นภาพกลับด้าน', plain: 'หาเครื่องบินที่ถูกหมุน' };
  }

  /* ---------- 4. Spatial Jigsaw ---------- */
  const N = 4;
  const nb = (c) => [[c[0] - 1, c[1]], [c[0] + 1, c[1]], [c[0], c[1] - 1], [c[0], c[1] + 1]];
  const ck = (c) => c[0] + ',' + c[1];
  function connected(cells) {
    if (!cells.length) return false;
    const set = new Set(cells.map(ck)), seen = new Set([ck(cells[0])]), st = [cells[0]];
    while (st.length) nb(st.pop()).forEach((n) => { const k = ck(n); if (set.has(k) && !seen.has(k)) { seen.add(k); st.push(n); } });
    return seen.size === cells.length;
  }
  function norm(cells) {
    const r0 = Math.min.apply(null, cells.map((c) => c[0])), c0 = Math.min.apply(null, cells.map((c) => c[1]));
    return cells.map((c) => [c[0] - r0, c[1] - c0]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  }
  const rot90 = (cells) => norm(cells.map((c) => [c[1], -c[0]]));
  const mirror = (cells) => norm(cells.map((c) => [c[0], -c[1]]));
  const key = (cells) => norm(cells).map(ck).join(';');
  function rotKeys(cells) { const out = []; let s = norm(cells); for (let k = 0; k < 4; k++) { out.push(key(s)); s = rot90(s); } return out; }
  function shapeSvg(cells, color) {
    const H = Math.max.apply(null, cells.map((c) => c[0])) + 1, W = Math.max.apply(null, cells.map((c) => c[1])) + 1, s = 20;
    const size = Math.max(H, W, 3) * s;
    const ox = (size - W * s) / 2, oy = (size - H * s) / 2;
    return '<svg class="apt-shape" viewBox="-2 -2 ' + (size + 4) + ' ' + (size + 4) + '">' +
      cells.map((c) => '<rect x="' + (ox + c[1] * s) + '" y="' + (oy + c[0] * s) + '" width="' + s + '" height="' + s + '" rx="3" fill="' + color + '" stroke="#fff" stroke-width="2"/>').join('') + '</svg>';
  }
  function genJigsaw() {
    for (;;) {
      const all = []; for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) all.push([r, c]);
      const k = rnd(6, 9), A = [pick(all)], inA = new Set([ck(A[0])]);
      for (let g = 0; A.length < k && g < 200; g++) {
        const n = pick(nb(pick(A)));
        if (n[0] >= 0 && n[0] < N && n[1] >= 0 && n[1] < N && !inA.has(ck(n))) { inA.add(ck(n)); A.push(n); }
      }
      const B = all.filter((c) => !inA.has(ck(c)));
      if (A.length !== k || !connected(B) || B.length < 5) continue;
      const trueKeys = new Set(rotKeys(B)), outs = [], seen = new Set();
      const tryAdd = (cells) => {
        const kk = rotKeys(cells);
        if (kk.some((x) => trueKeys.has(x) || seen.has(x))) return;
        kk.forEach((x) => seen.add(x)); outs.push(cells);
      };
      const m = mirror(B); if (connected(m)) tryAdd(m);
      for (let g = 0; outs.length < 3 && g < 400; g++) {
        const nB = norm(B).slice(), rm = nB.splice(rnd(0, nB.length - 1), 1)[0];
        const set = new Set(nB.map(ck));
        const cand = []; nB.forEach((c) => nb(c).forEach((n) => { if (!set.has(ck(n)) && ck(n) !== ck(rm)) cand.push(n); }));
        if (!cand.length) continue;
        const nc = nB.concat([pick(cand)]);
        if (connected(nc)) tryAdd(norm(nc));
      }
      if (outs.length < 3) continue;
      const spin = (cells) => { let s = norm(cells); for (let r = rnd(0, 3); r > 0; r--) s = rot90(s); return s; };
      const options = shuffle([{ c: spin(B), ok: true }].concat(outs.slice(0, 3).map((c) => ({ c: spin(c), ok: false }))));
      const board = '<svg class="apt-board" viewBox="-2 -2 ' + (N * 30 + 4) + ' ' + (N * 30 + 4) + '">' +
        all.map((c) => inA.has(ck(c))
          ? '<rect x="' + c[1] * 30 + '" y="' + c[0] * 30 + '" width="30" height="30" rx="4" fill="#A570FF" stroke="#fff" stroke-width="2"/>'
          : '<rect x="' + (c[1] * 30 + 2) + '" y="' + (c[0] * 30 + 2) + '" width="26" height="26" rx="4" fill="#FFF" stroke="#C9B8F2" stroke-width="1.5" stroke-dasharray="4 3"/>').join('') + '</svg>';
      return { q: '<div class="apt-fig">' + board + '</div><p class="apt-ask">ชิ้นส่วนใดเติมช่องว่าง (เส้นประ) ให้เต็มสี่เหลี่ยมพอดี — หมุนได้ แต่ไม่พลิก</p>',
        opts: options.map((o) => shapeSvg(o.c, '#E5279B')), a: options.findIndex((o) => o.ok), grid: true,
        ex: 'ชิ้นที่ถูกต้องมีรูปทรงตรงกับช่องว่างเมื่อหมุน ชิ้นอื่นต่างไป 1 ช่อง หรือเป็นภาพกลับด้าน', plain: 'ประกอบชิ้นส่วน' };
    }
  }

  const GEN = { series: genSeries, math: genMath, rotation: genRotation, jigsaw: genJigsaw };

  /* ---------- Runner state ---------- */
  let host = null, cur = null, raf = 0, ticker = 0, keyHandler = null;
  function stop() {
    cancelAnimationFrame(raf); clearInterval(ticker); raf = 0; ticker = 0;
    if (keyHandler) document.removeEventListener('keydown', keyHandler), document.removeEventListener('keyup', keyHandler);
    keyHandler = null; cur = null;
  }
  const root = () => $('#apt-view');
  function frame(title, inner, opts) {
    opts = opts || {};
    root().innerHTML =
      '<div class="apt-top"><a class="x" href="' + host.back + '" id="apt-x" aria-label="ออก">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></a>' +
        '<div class="progress"><span id="apt-prog" style="width:' + (opts.prog || 0) + '%"></span></div>' +
        (opts.timer ? '<div class="l-timer" id="apt-timer"><img src="img/clock.png" alt=""><span id="apt-time">' + fmt(opts.timer) + '</span></div>' : '') +
      '</div><div class="apt-body">' + inner + '</div>';
    $('#apt-x').onclick = (e) => {
      if (cur && cur.running && !confirm(T('ออกจากแบบทดสอบ? คะแนนรอบนี้จะไม่ถูกบันทึก'))) { e.preventDefault(); return; }
      stop();
    };
  }

  function intro(id) {
    stop();
    const t = TESTS[id], best = host.best(id);
    frame(t.title,
      '<div class="apt-intro"><div class="apt-ico">' + (window.APT_ICON && window.APT_ICON[id] || '') + '</div>' +
        '<p class="apt-kicker">แบบทดสอบความถนัด</p><h1>' + t.title + '</h1><p class="apt-sub">' + t.th + '</p>' +
        '<ol class="apt-rules">' + t.rules.map((r) => '<li>' + r + '</li>').join('') + '</ol>' +
        (best != null ? '<p class="apt-best">คะแนนดีที่สุด <b>' + best + '%</b></p>' : '') +
        '<button class="btn apt-start" id="apt-start">เริ่มทำแบบทดสอบ</button></div>');
    $('#apt-start').onclick = () => (t.kind === 'mc' ? runMC(id) : t.kind === 'joy' ? runJoy(id) : runMulti(id));
    $('#apt-start').focus();
  }

  /* ---------- Multiple-choice tests (series / math / rotation / jigsaw) ---------- */
  function runMC(id) {
    stop();
    const t = TESTS[id], qs = [];
    for (let i = 0; i < t.n; i++) qs.push(GEN[id](i));
    cur = { id, qs, i: 0, ans: [], start: Date.now(), running: true };
    const end = cur.start + t.secs * 1000;
    const show = () => {
      const q = qs[cur.i];
      frame(t.title,
        '<div class="apt-q"><p class="apt-count">ข้อ ' + (cur.i + 1) + ' / ' + qs.length + '</p><div class="apt-qtext no-i18n">' + q.q + '</div>' +
        '<div class="apt-opts' + (q.grid ? ' grid' : '') + '">' +
          q.opts.map((o, k) => '<button class="apt-opt no-i18n" data-k="' + k + '"><span class="k">' + (k + 1) + '</span><span class="v">' + o + '</span></button>').join('') +
        '</div><button class="linkbtn apt-skip" id="apt-skip">ข้าม</button></div>',
        { prog: (cur.i / qs.length) * 100, timer: (end - Date.now()) / 1000 });
      $('.apt-opts').onclick = (e) => { const b = e.target.closest('.apt-opt'); if (b) answer(+b.dataset.k, b); };
      $('#apt-skip').onclick = () => answer(null);
    };
    let locked = false;
    const answer = (k, btn) => {
      if (locked || !cur) return; locked = true;
      cur.ans[cur.i] = k;
      if (btn) btn.classList.add('picked');
      setTimeout(() => { locked = false; if (!cur) return; cur.i++; cur.i >= qs.length ? finishMC() : show(); }, btn ? 180 : 0);
    };
    const finishMC = () => {
      const correct = qs.filter((q, i) => cur.ans[i] === q.a).length, used = Math.round((Date.now() - cur.start) / 1000);
      const pct = Math.round((correct / qs.length) * 100), answers = cur.ans.slice();
      stop();
      result(id, pct, [['ตอบถูก', correct + ' / ' + qs.length], ['ใช้เวลา', fmt(used)], ['ตอบผิด / ข้าม', (qs.length - correct) + ' ข้อ']],
        qs.map((q, i) => ({ q, mine: answers[i] })));
    };
    keyHandler = (e) => {
      if (e.type !== 'keydown' || !cur) return;
      const n = +e.key; if (n >= 1 && n <= 4) { const b = document.querySelector('.apt-opt[data-k="' + (n - 1) + '"]'); if (b) answer(n - 1, b); }
    };
    document.addEventListener('keydown', keyHandler);
    show();
    ticker = setInterval(() => {
      if (!cur) return;
      const left = (end - Date.now()) / 1000, el = $('#apt-time');
      if (el) { el.textContent = fmt(left); $('#apt-timer').classList.toggle('low', left <= 30); }
      if (left <= 0) finishMC();
    }, 250);
  }

  /* ---------- Result ---------- */
  function rating(p) { return p >= 90 ? 'ยอดเยี่ยม' : p >= 75 ? 'ดีมาก' : p >= 60 ? 'ผ่าน' : 'ฝึกอีกนิด'; }
  function result(id, pct, stats, review) {
    const t = TESTS[id], prevBest = host.best(id);
    host.finish(id, pct, stats);
    const wrong = (review || []).filter((r) => r.mine !== r.q.a);
    frame(t.title,
      '<div class="apt-result"><div class="apt-ring" style="--p:' + pct + '"><b>' + pct + '%</b><span>' + rating(pct) + '</span></div>' +
        '<h1>' + t.title + '</h1>' +
        (prevBest == null || pct > prevBest ? '<p class="apt-new">สถิติใหม่ของคุณ!</p>' : '<p class="apt-best">คะแนนดีที่สุด <b>' + prevBest + '%</b></p>') +
        '<div class="apt-stats">' + stats.map((s) => '<div><span>' + s[0] + '</span><b>' + s[1] + '</b></div>').join('') + '</div>' +
        '<div class="apt-actions"><a class="btn ghost" href="' + host.back + '">กลับ</a><button class="btn" id="apt-again">ทำอีกครั้ง</button></div>' +
        (review ? (wrong.length
          ? '<h3 class="apt-rh">เฉลยข้อที่ผิด (' + wrong.length + ')</h3><div class="apt-review no-i18n">' + wrong.map((r) =>
              '<div class="apt-rv"><div class="apt-rv-q">' + r.q.q + '</div><p><span class="bad">คุณตอบ: ' + (r.mine == null ? 'ข้าม' : stripSvg(r.q.opts[r.mine], r.mine)) + '</span>' +
              ' · <span class="good">ที่ถูก: ' + stripSvg(r.q.opts[r.q.a], r.q.a) + '</span></p><p class="ex">' + r.q.ex + '</p></div>').join('') + '</div>'
          : '<p class="apt-new">ถูกทุกข้อ เก่งมาก!</p>') : '') +
      '</div>');
    $('#apt-again').onclick = () => intro(id);
  }
  const stripSvg = (o, k) => (o.indexOf('<svg') === 0 ? 'ตัวเลือกที่ ' + (k + 1) : o);

  /* ---------- 5. Joy Stick (tracking) ---------- */
  function padControl(pad, knob, vec) {
    let on = false;
    const set = (e) => {
      const r = pad.getBoundingClientRect(), R = r.width / 2;
      let dx = e.clientX - (r.left + R), dy = e.clientY - (r.top + R); const d = Math.hypot(dx, dy);
      if (d > R) { dx *= R / d; dy *= R / d; }
      vec.x = dx / R; vec.y = dy / R;
      knob.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
    };
    const up = () => { on = false; vec.x = vec.y = 0; knob.style.transform = ''; };
    pad.addEventListener('pointerdown', (e) => { on = true; pad.setPointerCapture(e.pointerId); set(e); });
    pad.addEventListener('pointermove', (e) => { if (on) set(e); });
    pad.addEventListener('pointerup', up); pad.addEventListener('pointercancel', up);
  }
  function runJoy(id) {
    stop();
    const t = TESTS.joystick;
    frame(t.title,
      '<div class="apt-game"><canvas id="jc" class="apt-canvas"></canvas>' +
      '<div class="apt-hud"><span>อยู่ในเป้า <b id="j-in">0%</b></span><span class="hint">ลูกศร / WASD หรือลากจอย</span></div>' +
      '<div class="apt-pad" id="j-pad"><div class="apt-knob" id="j-knob"></div></div></div>', { timer: t.secs });
    const cv = $('#jc'), ctx = cv.getContext('2d'), keys = {}, pad = { x: 0, y: 0 };
    padControl($('#j-pad'), $('#j-knob'), pad);
    keyHandler = (e) => {
      const k = { ArrowUp: 'u', KeyW: 'u', ArrowDown: 'd', KeyS: 'd', ArrowLeft: 'l', KeyA: 'l', ArrowRight: 'r', KeyD: 'r' }[e.code];
      if (!k) return; e.preventDefault(); keys[k] = e.type === 'keydown';
    };
    document.addEventListener('keydown', keyHandler); document.addEventListener('keyup', keyHandler);
    const ph = [0, 1, 2, 3].map(() => Math.random() * 6.28);
    const p = { x: 0.5, y: 0.5, vx: 0, vy: 0 };
    let inside = 0, last = performance.now(), el = 0;
    cur = { running: true };
    const loop = (now) => {
      if (!cur) return;
      const dt = Math.min(0.05, (now - last) / 1000); last = now; el += dt;
      const dpr = window.devicePixelRatio || 1, W = cv.clientWidth, H = cv.clientHeight;
      if (cv.width !== Math.round(W * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const tx = 0.5 + 0.30 * Math.sin(el * 0.53 + ph[0]) + 0.10 * Math.sin(el * 1.37 + ph[1]);
      const ty = 0.5 + 0.28 * Math.sin(el * 0.41 + ph[2]) + 0.10 * Math.sin(el * 1.13 + ph[3]);
      const ax = (keys.r ? 1 : 0) - (keys.l ? 1 : 0) + pad.x + 0.25 * Math.sin(el * 0.37 + ph[1]);
      const ay = (keys.d ? 1 : 0) - (keys.u ? 1 : 0) + pad.y + 0.25 * Math.cos(el * 0.29 + ph[2]);
      p.vx = (p.vx + ax * 1.5 * dt) * Math.exp(-1.6 * dt); p.vy = (p.vy + ay * 1.5 * dt) * Math.exp(-1.6 * dt);
      p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.x < 0.02 || p.x > 0.98) { p.x = Math.min(0.98, Math.max(0.02, p.x)); p.vx *= -0.4; }
      if (p.y < 0.03 || p.y > 0.97) { p.y = Math.min(0.97, Math.max(0.03, p.y)); p.vy *= -0.4; }
      const R = Math.min(W, H) * 0.09, dx = (p.x - tx) * W, dy = (p.y - ty) * H, hit = Math.hypot(dx, dy) < R;
      if (hit) inside += dt;
      // draw
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(28,176,246,.10)'; ctx.lineWidth = 1;
      for (let gx = 0; gx < W; gx += 32) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke(); }
      for (let gy = 0; gy < H; gy += 32) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke(); }
      ctx.beginPath(); ctx.arc(tx * W, ty * H, R, 0, 6.283);
      ctx.fillStyle = hit ? 'rgba(28,176,246,.22)' : 'rgba(255,150,0,.16)'; ctx.fill();
      ctx.lineWidth = 3; ctx.strokeStyle = hit ? '#1CB0F6' : '#FF9600'; ctx.stroke();
      ctx.beginPath(); ctx.arc(p.x * W, p.y * H, 9, 0, 6.283); ctx.fillStyle = '#fff'; ctx.fill();
      ctx.lineWidth = 3; ctx.strokeStyle = '#2B2B2B'; ctx.stroke();
      const left = t.secs - el;
      $('#apt-time').textContent = fmt(left); $('#apt-timer').classList.toggle('low', left <= 10);
      $('#j-in').textContent = Math.round((inside / Math.max(el, 0.001)) * 100) + '%';
      $('#apt-prog').style.width = Math.min(100, (el / t.secs) * 100) + '%';
      if (el >= t.secs) {
        const pct = Math.round((inside / t.secs) * 100); stop();
        return result('joystick', pct, [['อยู่ในเป้า', inside.toFixed(1) + ' วินาที'], ['เวลาทดสอบ', t.secs + ' วินาที'], ['ความแม่นยำ', pct + '%']]);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame((n) => { last = n; loop(n); });
  }

  /* ---------- 6. Multitask ---------- */
  function runMulti(id) {
    stop();
    const t = TESTS.multitask;
    frame(t.title,
      '<div class="apt-multi">' +
        '<section class="mt-card"><h3>เลขคณิต</h3><div class="mt-eq no-i18n" id="mt-eq"></div>' +
          '<div class="mt-row"><button class="btn mt-yes" id="mt-yes">ถูก <small>F</small></button><button class="btn ghost mt-no" id="mt-no">ผิด <small>J</small></button></div>' +
          '<div class="mt-bar"><span id="mt-eqt"></span></div></section>' +
        '<section class="mt-card"><h3>ไฟเตือน</h3><div class="mt-lights">' +
          [1, 2, 3, 4].map((n) => '<button class="mt-light" data-l="' + (n - 1) + '"><span></span><small>' + n + '</small></button>').join('') + '</div></section>' +
        '<section class="mt-card"><h3>มาตรวัด</h3><div class="mt-gauge"><div class="mt-zone"></div><div class="mt-needle" id="mt-needle"></div></div>' +
          '<button class="btn mt-fix" id="mt-fix">ปรับ <small>Space</small></button></section>' +
      '</div>', { timer: t.secs });
    const st = { ok: 0, bad: 0, to: 0, hit: 0, miss: 0, fal: 0, fix: 0, gfal: 0, green: 0 };
    let el = 0, last = performance.now();
    // math
    let eq = null;
    const newEq = () => {
      const a = rnd(11, 59), b = rnd(6, 39), plus = Math.random() < 0.6, real = plus ? a + b : a - b;
      const right = Math.random() < 0.5, shown = right ? real : real + pick([-10, -2, -1, 1, 2, 10]);
      eq = { right, until: el + 6 };
      $('#mt-eq').textContent = a + (plus ? ' + ' : ' − ') + b + ' = ' + shown;
    };
    const ansEq = (yes) => { if (!eq) return; (yes === eq.right ? st.ok++ : st.bad++); flash('#mt-eq', yes === eq.right); newEq(); };
    // lights
    let lit = -1, litUntil = 0, nextLight = 2;
    const lightEls = Array.from(document.querySelectorAll('.mt-light'));
    const press = (n) => {
      if (n === lit) { st.hit++; lightEls[n].classList.remove('on'); lit = -1; nextLight = el + 1 + Math.random() * 2.5; }
      else { st.fal++; flash(lightEls[n], false); }
    };
    // gauge
    let g = 50, gv = 0;
    const fixG = () => { if (g < 20 || g > 80) { st.fix++; g = 50; gv = 0; } else { st.gfal++; flash('#mt-fix', false); } };
    const flash = (sel, good) => { const n = typeof sel === 'string' ? $(sel) : sel; if (!n) return; n.classList.remove('fl-ok', 'fl-bad'); void n.offsetWidth; n.classList.add(good ? 'fl-ok' : 'fl-bad'); };
    $('#mt-yes').onclick = () => ansEq(true); $('#mt-no').onclick = () => ansEq(false);
    $('#mt-fix').onclick = fixG;
    $('.mt-lights').onclick = (e) => { const b = e.target.closest('.mt-light'); if (b) press(+b.dataset.l); };
    keyHandler = (e) => {
      if (e.type !== 'keydown' || e.repeat) return;
      if (e.code === 'KeyF') ansEq(true); else if (e.code === 'KeyJ') ansEq(false);
      else if (e.code === 'Space') { e.preventDefault(); fixG(); }
      else if (/^Digit[1-4]$/.test(e.code)) press(+e.code.slice(5) - 1);
    };
    document.addEventListener('keydown', keyHandler);
    cur = { running: true };
    newEq();
    const loop = (now) => {
      if (!cur) return;
      const dt = Math.min(0.05, (now - last) / 1000); last = now; el += dt;
      if (el > eq.until) { st.to++; flash('#mt-eq', false); newEq(); }
      $('#mt-eqt').style.width = Math.max(0, (eq.until - el) / 6 * 100) + '%';
      if (lit < 0 && el >= nextLight) { lit = rnd(0, 3); litUntil = el + 2.5; lightEls[lit].classList.add('on'); }
      if (lit >= 0 && el > litUntil) { st.miss++; lightEls[lit].classList.remove('on'); flash(lightEls[lit], false); lit = -1; nextLight = el + 1 + Math.random() * 2.5; }
      gv += (Math.random() - 0.5) * 60 * dt + (g < 50 ? -4 : 4) * dt; gv = Math.max(-22, Math.min(22, gv));
      g = Math.max(0, Math.min(100, g + gv * dt));
      if (g >= 20 && g <= 80) st.green += dt;
      const nd = $('#mt-needle'); nd.style.left = g + '%'; nd.classList.toggle('red', g < 20 || g > 80);
      const left = t.secs - el;
      $('#apt-time').textContent = fmt(left); $('#apt-timer').classList.toggle('low', left <= 10);
      $('#apt-prog').style.width = Math.min(100, (el / t.secs) * 100) + '%';
      if (el >= t.secs) {
        const mA = st.ok / Math.max(1, st.ok + st.bad + st.to), lA = st.hit / Math.max(1, st.hit + st.miss + st.fal), gA = st.green / t.secs;
        const pct = Math.round(((mA + lA + gA) / 3) * 100); stop();
        return result('multitask', pct, [
          ['เลขคณิต', st.ok + ' ถูก · ' + st.bad + ' ผิด · ' + st.to + ' ไม่ทัน'],
          ['ไฟเตือน', st.hit + ' ทัน · ' + st.miss + ' พลาด · ' + st.fal + ' กดผิด'],
          ['มาตรวัด', Math.round(gA * 100) + '% อยู่ในโซนเขียว']]);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame((n) => { last = n; loop(n); });
  }

  window.APT = {
    TESTS,
    open(id, h) { host = h; if (!TESTS[id]) return false; intro(id); return true; },
    stop
  };
})();
