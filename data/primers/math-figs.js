/* Ohh-Exam — diagrams for the maths primers (ปูพื้นฐาน), drawn as inline SVG so they stay sharp and work offline.
   window.PRIMER_FIGS[lessonId] = [{ at: 'idea' | 'keys' | 'f' | 'ex', svg, cap }] — `at` = which block of the primer it follows.
   Style: one calm palette, short labels (11–13 px) on the drawing, the explanation in the caption; colour only marks what matters. */
(function () {
  const C = { a: '#4C84B5', b: '#D38A4F', ok: '#3C9066', bad: '#C25A52', ink: '#35312C', mute: '#9A938A', line: '#D9D2C8', soft: '#F6F3EE', fa: '#E3EDF6', fb: '#F8EADD', fok: '#DDEFE4' };
  const svg = (w, h, body) => '<svg viewBox="0 0 ' + w + ' ' + h + '" style="max-width:' + Math.round(w * 1.3) + 'px" role="img" font-size="12" font-weight="500" fill="' + C.ink + '">' + body + '</svg>';
  // text: x, y, string, extra attributes (default centred)
  const t = (x, y, s, a) => '<text x="' + x + '" y="' + y + '" text-anchor="middle"' + (a || '') + '>' + s + '</text>';
  const ts = (x, y, s, a) => '<text x="' + x + '" y="' + y + '"' + (a || '') + '>' + s + '</text>';            // start-aligned
  const te = (x, y, s, a) => '<text x="' + x + '" y="' + y + '" text-anchor="end"' + (a || '') + '>' + s + '</text>';
  const B = ' font-weight="600"', M = ' fill="' + C.mute + '" font-size="11"';
  const col = (c) => ' fill="' + c + '"';
  const dot = (x, y, r, fill, stroke, sw) => '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + fill + '"' + (stroke ? ' stroke="' + stroke + '" stroke-width="' + (sw || 2) + '"' : '') + '/>';
  const line = (x1, y1, x2, y2, c, w, dash, extra) => '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + c + '" stroke-width="' + (w || 1.5) + '"' + (dash ? ' stroke-dasharray="' + dash + '"' : '') + ' stroke-linecap="round"' + (extra || '') + '/>';
  const poly = (pts, c, w) => '<polyline points="' + pts.map((p) => p.map((n) => Math.round(n * 10) / 10).join(',')).join(' ') + '" fill="none" stroke="' + c + '" stroke-width="' + (w || 2.5) + '" stroke-linejoin="round" stroke-linecap="round"/>';
  // arrowheads in user units, so a thick line does not get a giant head
  const mk = (id, c) => '<marker id="' + id + '" viewBox="0 0 10 10" refX="8.5" refY="5" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="10" orient="auto-start-reverse"><path d="M0 1 9 5 0 9z" fill="' + c + '"/></marker>';
  const defs = '<defs>' + mk('pfA', C.ink) + mk('pfAa', C.a) + mk('pfAb', C.b) + '</defs>';

  // ---------- Sets ----------
  const venn3 = (() => {
    let s = '';
    [['∪', 'A ∪ B', 'รวม'], ['∩', 'A ∩ B', 'ซ้ำกัน'], ['−', 'A − B', 'เฉพาะ A']].forEach(([op, lab, sub], i) => {
      const ox = i * 110, ax = ox + 43, bx = ox + 67, cy = 46, r = 28;
      s += '<clipPath id="pfV' + i + '"><circle cx="' + ax + '" cy="' + cy + '" r="' + r + '"/></clipPath>';
      if (op === '∪') s += dot(ax, cy, r, C.fa) + dot(bx, cy, r, C.fa);
      if (op === '∩') s += '<circle cx="' + bx + '" cy="' + cy + '" r="' + r + '" fill="' + C.a + '" fill-opacity=".55" clip-path="url(#pfV' + i + ')"/>';
      if (op === '−') s += dot(ax, cy, r, C.fa) + dot(bx, cy, r, '#fff');
      if (op === '∪') s += '<circle cx="' + ax + '" cy="' + cy + '" r="' + r + '" fill="' + C.a + '" fill-opacity=".35"/><circle cx="' + bx + '" cy="' + cy + '" r="' + r + '" fill="' + C.a + '" fill-opacity=".35"/>';
      if (op === '−') s += '<circle cx="' + ax + '" cy="' + cy + '" r="' + r + '" fill="' + C.a + '" fill-opacity=".45"/>' + dot(bx, cy, r, '#fff');
      s += dot(ax, cy, r, 'none', C.ink, 1.3) + dot(bx, cy, r, 'none', C.ink, 1.3) +
        t(ax - 13, cy + 4, 'A', M) + t(bx + 13, cy + 4, 'B', M) + t(ox + 55, 95, lab, B) + t(ox + 55, 110, sub, M);
    });
    return svg(330, 118, s);
  })();
  const vennEx = svg(320, 180,
    '<rect x="6" y="6" width="308" height="168" rx="12" fill="' + C.soft + '" stroke="' + C.line + '"/>' +
    '<circle cx="128" cy="92" r="58" fill="' + C.a + '" fill-opacity=".18" stroke="' + C.a + '" stroke-width="2"/>' +
    '<circle cx="192" cy="92" r="58" fill="' + C.b + '" fill-opacity=".18" stroke="' + C.b + '" stroke-width="2"/>' +
    t(104, 26, 'คณิต · 25', B + col(C.a)) + t(216, 26, 'อังกฤษ · 20', B + col(C.b)) +
    t(98, 99, '15', ' font-size="20" font-weight="700"') + t(160, 99, '10', ' font-size="20" font-weight="700"') + t(222, 99, '10', ' font-size="20" font-weight="700"') +
    ts(18, 164, 'U = 40', M) + te(302, 164, 'นอกวง = 5', B + col(C.ok)));
  const TF = (v) => '<td class="' + (v ? 'tt' : 'ff') + '">' + (v ? 'T' : 'F') + '</td>';
  const truth = '<table class="pr-truth" aria-label="ตารางค่าความจริง"><thead><tr><th>p</th><th>q</th><th>p ∧ q</th><th>p ∨ q</th><th>p → q</th><th>p ↔ q</th></tr></thead><tbody>' +
    [[1, 1], [1, 0], [0, 1], [0, 0]].map(([p, q]) => '<tr><th>' + (p ? 'T' : 'F') + '</th><th>' + (q ? 'T' : 'F') + '</th>' +
      TF(p && q) + TF(p || q) + TF(!p || q) + TF(p === q) + '</tr>').join('') + '</tbody></table>';

  // ---------- Real numbers: number lines ----------
  const X = (v) => 40 + (v + 3) * 24;   // −3 … 7 → 40 … 280
  const axis = (y, ticks) => line(16, y, 304, y, C.mute) + ticks.map((v) => line(X(v), y - 4, X(v), y + 4, C.mute) + t(X(v), y + 19, String(v).replace('-', '−'), ' fill="' + C.mute + '"')).join('');
  const numLines = svg(320, 160, defs +
    ts(16, 18, '|x − 2| < 3', B) + te(304, 18, 'ช่วงเดียว', M) +
    axis(42, [-1, 2, 5]) + line(X(-1), 42, X(5), 42, C.ok, 5) + dot(X(-1), 42, 5.5, '#fff', C.ok, 2.5) + dot(X(5), 42, 5.5, '#fff', C.ok, 2.5) + dot(X(2), 42, 3, C.ink) +
    ts(16, 102, '|x − 1| ≥ 2', B) + te(304, 102, 'แยกสองข้าง', M) +
    axis(126, [-1, 1, 3]) +
    line(X(-1), 126, 22, 126, C.b, 5, '', ' marker-end="url(#pfAb)"') + line(X(3), 126, 298, 126, C.b, 5, '', ' marker-end="url(#pfAb)"') +
    dot(X(-1), 126, 5.5, C.b) + dot(X(3), 126, 5.5, C.b) + dot(X(1), 126, 3, C.ink));

  // ---------- Functions ----------
  const machine = svg(320, 64, defs +
    dot(30, 32, 19, C.fa, C.a) + t(30, 37, '4', ' font-size="15" font-weight="700"') +
    line(53, 32, 84, 32, C.ink, 1.5, '', ' marker-end="url(#pfA)"') +
    '<rect x="90" y="11" width="140" height="42" rx="10" fill="' + C.fb + '" stroke="' + C.b + '" stroke-width="1.5"/>' +
    t(160, 30, 'f(x) = 2x + 3', B) + t(160, 45, '×2 แล้ว +3', M) +
    line(236, 32, 267, 32, C.ink, 1.5, '', ' marker-end="url(#pfA)"') +
    dot(290, 32, 19, C.fok, C.ok) + t(290, 37, '11', ' font-size="15" font-weight="700"'));
  const PX = (x) => 44 + x * 54, PY = (y) => 168 - y * 20;
  const para = svg(320, 192,
    line(44, 12, 44, 168, C.mute) + line(44, 168, 304, 168, C.mute) + te(304, 184, 'x', M) + ts(30, 16, 'y', M) +
    poly([0, .25, .5, .75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.25, 3.5, 3.75, 4].map((x) => [PX(x), PY(x * x - 4 * x + 7)]), C.a, 2.5) +
    line(PX(2), PY(3) + 7, PX(2), 168, C.b, 1.3, '3 4') + dot(PX(2), PY(3), 5.5, C.b) +
    ts(PX(2) + 12, PY(3) + 26, 'จุดยอด (2, 3)', B + col(C.b)) + ts(PX(2) + 12, PY(3) + 41, 'ค่าต่ำสุด = 3', M) +
    t(PX(2), 184, 'x = −b/2a = 2', ' font-size="11"' + col(C.b)) +
    te(304, 20, 'y = x² − 4x + 7', ' font-size="11"' + col(C.a)));

  // ---------- Exponential & log ----------
  const EX = (x) => 110 + 25 * x, EY = (y) => 150 - 25 * y;
  const xs = []; for (let x = -3; x <= 2.33; x += 0.25) xs.push(x);
  const expPts = xs.map((x) => [EX(x), EY(Math.pow(2, x))]);
  const logPts = xs.map((x) => [EX(Math.pow(2, x)), EY(x)]);
  const expLog = svg(300, 232,
    line(28, 150, 272, 150, C.mute) + line(110, 14, 110, 228, C.mute) +
    line(EX(-3), EY(-3), EX(4.6), EY(4.6), C.mute, 1.2, '4 4') + ts(EX(4.6) + 4, EY(4.6) + 4, 'y = x', M) +
    poly(expPts, C.b, 2.5) + poly(logPts, C.a, 2.5) +
    dot(EX(0), EY(1), 4.5, C.b) + te(EX(0) - 7, EY(1) - 5, '(0, 1)', M) +
    dot(EX(1), EY(0), 4.5, C.a) + ts(EX(1) + 5, EY(0) + 17, '(1, 0)', M) +
    te(EX(2.33) - 10, EY(5) + 10, 'y = 2ˣ', B + col(C.b)) + te(266, EY(2.33) + 22, 'y = log₂x', B + col(C.a)));

  // ---------- Trigonometry ----------
  const tri = svg(320, 176,
    '<path d="M40 148 L256 148 L256 30 Z" fill="' + C.soft + '"/>' +
    line(40, 148, 256, 148, C.a, 3) + line(256, 148, 256, 30, C.bad, 3) + line(40, 148, 256, 30, C.ok, 3) +
    '<path d="M243 148 V135 H256" fill="none" stroke="' + C.ink + '" stroke-width="1.2"/>' +
    '<path d="M74 148 A34 34 0 0 0 69.8 131.7" fill="none" stroke="' + C.ink + '" stroke-width="1.5"/>' + t(84, 143, 'θ', B) +
    t(148, 168, 'ชิด', B + col(C.a)) + ts(266, 86, 'ข้าม', B + col(C.bad)) + ts(266, 101, 'ตรงข้าม θ', M) +
    '<text x="138" y="76" text-anchor="middle" font-weight="600" fill="' + C.ok + '" transform="rotate(-28.6 138 76)">ฉาก · ยาวสุด</text>');
  const R = 80, cx = 110, cy = 108, ang = (d) => [cx + R * Math.cos(d * Math.PI / 180), cy - R * Math.sin(d * Math.PI / 180)];
  const [x60, y60] = ang(60), [x120, y120] = ang(120);
  const quad = svg(220, 216,
    dot(cx, cy, R, C.soft, C.line, 1.5) + line(18, cy, 202, cy, C.mute) + line(cx, 16, cx, 200, C.mute) +
    t(150, 90, 'ทุกตัว +', B + col(C.ok)) + t(70, 90, 'sin +', B + col(C.ok)) + t(70, 140, 'tan +', B + col(C.ok)) + t(150, 140, 'cos +', B + col(C.ok)) +
    line(x120, y120, x60, y60, C.mute, 1.2, '3 4') + line(cx, cy, x60, y60, C.a, 2) + line(cx, cy, x120, y120, C.b, 2) +
    dot(x60, y60, 4.5, C.a) + dot(x120, y120, 4.5, C.b) +
    ts(x60 + 7, y60 - 4, '60°', B + col(C.a)) + te(x120 - 7, y120 - 4, '120°', B + col(C.b)) +
    te(214, cy - 6, '0°', M) + ts(4, cy - 6, '180°', M) + ts(cx + 6, 12, '90°', M) + ts(cx + 6, 212, '270°', M));

  // ---------- Sequences & series ----------
  const steps = (y, nums, lab, c, fill, mid) => nums.map((n, i) => dot(40 + i * 80, y, 18, fill, c, 1.5) + t(40 + i * 80, y + 5, n, ' font-size="13" font-weight="700"')).join('') +
    [0, 1, 2].map((i) => '<path d="M' + (56 + i * 80) + ' ' + (y - 10) + ' Q' + (80 + i * 80) + ' ' + (y - 34) + ' ' + (104 + i * 80) + ' ' + (y - 10) + '" fill="none" stroke="' + c + '" stroke-width="1.5" marker-end="url(#' + mid + ')"/>' +
      t(80 + i * 80, y - 28, lab, B + col(c))).join('');
  const seq = svg(320, 138, defs + steps(50, ['3', '7', '11', '15'], '+4', C.a, C.fa, 'pfAa') + steps(116, ['5', '15', '45', '135'], '×3', C.b, C.fb, 'pfAb'));
  const gauss = svg(320, 96,
    [['1', 30], ['2', 62], ['3', 94], ['…', 160], ['98', 226], ['99', 258], ['100', 290]].map(([n, x]) => t(x, 82, n, ' font-size="14" font-weight="700"')).join('') +
    [[30, 290, -6, C.a], [62, 258, 16, C.b], [94, 226, 38, C.ok]].map(([a, b2, q, c]) => '<path d="M' + a + ' 66 Q160 ' + q + ' ' + b2 + ' 66" fill="none" stroke="' + c + '" stroke-width="1.8"/>').join('') +
    t(160, 12, 'แต่ละคู่ = 101', B));
  let hx = 20, hb = '', hv = 8;
  for (let i = 0; i < 7; i++) {
    const w = hv * 17.5;
    hb += '<rect x="' + hx + '" y="26" width="' + w + '" height="30" fill="' + C.a + '" fill-opacity="' + (0.85 - i * 0.1) + '" stroke="#fff" stroke-width="1.5"/>' +
      (hv >= 1 ? t(hx + w / 2, 46, String(hv), ' font-weight="700" fill="#fff"') : '');
    hx += w; hv /= 2;
  }
  const halving = svg(320, 66,
    '<rect x="20" y="26" width="280" height="30" fill="none" stroke="' + C.mute + '" stroke-width="1.2" stroke-dasharray="4 3"/>' + hb +
    ts(20, 18, '0', M) + te(300, 18, '16', B));

  // ---------- Counting: P vs C ----------
  const box = (x, lab, n) => '<rect x="' + x + '" y="10" width="68" height="50" rx="10" fill="' + C.fa + '" stroke="' + C.a + '" stroke-width="1.5"/>' +
    t(x + 34, 28, lab, M) + t(x + 34, 51, n, ' font-size="18" font-weight="700"');
  const pc = svg(320, 116,
    box(8, 'ประธาน', '6') + t(87, 41, '×', ' font-size="15"' + col(C.mute)) + box(98, 'รองฯ', '5') + t(177, 41, '×', ' font-size="15"' + col(C.mute)) +
    box(188, 'เลขา', '4') + t(290, 42, '= 120', ' font-size="15" font-weight="700"' + col(C.a)) +
    line(8, 76, 312, 76, C.line) +
    ts(8, 96, 'มีตำแหน่ง → P(6, 3) =', '') + te(312, 96, '120', B + col(C.a)) +
    ts(8, 112, 'แค่เลือกเข้ากลุ่ม → 120 ÷ 3! =', '') + te(312, 112, '20', B + col(C.b)));

  // ---------- Probability: dice table ----------
  let dg = t(135, 12, 'ลูกที่ 2', M) + '<text x="10" y="128" text-anchor="middle" font-size="11" fill="' + C.mute + '" transform="rotate(-90 10 128)">ลูกที่ 1</text>';
  for (let i = 1; i <= 6; i++) dg += t(46 + (i - 1) * 30 + 13, 30, i, B) + t(30, 40 + (i - 1) * 30 + 18, i, B);
  for (let r = 1; r <= 6; r++) for (let c = 1; c <= 6; c++) {
    const hit = r + c === 7, x = 46 + (c - 1) * 30, y = 38 + (r - 1) * 30;
    dg += '<rect x="' + x + '" y="' + y + '" width="26" height="26" rx="6" fill="' + (hit ? C.ok : C.soft) + '"/>' +
      t(x + 13, y + 17, r + c, hit ? ' font-weight="700" fill="#fff"' : ' fill="' + C.mute + '"');
  }
  const dice = svg(240, 222, dg);

  // ---------- Statistics: same mean, different spread ----------
  const SX = (v) => 24 + v * 11;
  const spread = svg(320, 150,
    line(SX(10), 22, SX(10), 112, C.bad, 1.3, '4 4') + t(SX(10), 14, 'x̄ = 10', B + col(C.bad)) +
    [8, 9, 10, 11, 12].map((v) => dot(SX(v), 46, 6, C.a)).join('') + te(312, 50, 'S.D. เล็ก', B + col(C.a)) +
    [2, 6, 10, 14, 18].map((v) => dot(SX(v), 90, 6, C.b)).join('') + te(312, 94, 'S.D. ใหญ่', B + col(C.b)) +
    line(SX(0), 122, SX(20), 122, C.mute) + [0, 5, 10, 15, 20].map((v) => line(SX(v), 118, SX(v), 126, C.mute) + t(SX(v), 141, v, M)).join(''));

  // ---------- Calculus: tangent + area ----------
  const KX = (x) => 44 + x * 108, KY = (y) => 168 - y * 30;
  const curve = []; for (let x = 0; x <= 2.21; x += 0.1) curve.push([KX(x), KY(x * x)]);
  const area = curve.filter(([x]) => x <= KX(2) + 0.1);
  const calc = svg(320, 190,
    '<path d="M' + KX(0) + ' ' + KY(0) + ' ' + area.map(([x, y]) => 'L' + x.toFixed(1) + ' ' + y.toFixed(1)).join(' ') + ' L' + KX(2) + ' ' + KY(0) + ' Z" fill="' + C.ok + '" fill-opacity=".18"/>' +
    line(44, 12, 44, 168, C.mute) + line(44, 168, 308, 168, C.mute) + t(KX(1), 184, '1', M) + t(KX(2), 184, '2', M) +
    poly(curve, C.a, 2.5) + line(KX(.5), KY(0), KX(1.8), KY(2.6), C.b, 2) + dot(KX(1), KY(1), 5, C.b) +
    ts(54, 40, 'เส้นสัมผัสที่ x = 1', B + col(C.b)) + ts(54, 56, 'ความชัน f′(1) = 2', ' font-size="11"' + col(C.b)) +
    t(KX(1.45), 156, '∫₀² x² dx = 8/3', B + col(C.ok)) +
    te(KX(2.2) - 6, KY(4.84) + 6, 'y = x²', B + col(C.a)));

  const F = {
    'math-set-1': [{ at: 'idea', svg: venn3, cap: 'ส่วนที่ระบายสีคือคำตอบของแต่ละแบบ' },
      { at: 'ex', svg: vennEx, cap: 'ช่องกลาง 10 คนอยู่ในทั้งสองวง ถ้าบวก 25 + 20 ตรง ๆ จะนับซ้ำ จึงต้องลบออกหนึ่งครั้ง: 15 + 10 + 10 = 35 คน นอกวงเหลือ 40 − 35 = 5 คน' }],
    'math-set-2': [{ at: 'keys', svg: truth, cap: 'ตารางค่าความจริง — p → q เป็นเท็จช่องเดียว คือ T → F' }],
    'math-real-1': [{ at: 'f', svg: numLines, cap: 'บน: |x − 2| < 3 คือห่างจาก 2 ไม่เกิน 3 → −1 < x < 5 · ล่าง: |x − 1| ≥ 2 คือห่างจาก 1 ตั้งแต่ 2 → x ≤ −1 หรือ x ≥ 3 · วงกลมโปร่งไม่รวมจุด วงกลมทึบรวมจุด' }],
    'math-func-1': [{ at: 'idea', svg: machine, cap: 'ฟังก์ชันคือเครื่องจักร: ใส่ x = 4 ได้ f(4) = 11 ออกมาค่าเดียวเสมอ' },
      { at: 'ex', svg: para, cap: 'a > 0 กราฟหงายเหมือนถ้วย จุดยอด (2, 3) จึงเป็นจุดต่ำสุด' }],
    'math-explog-1': [{ at: 'idea', svg: expLog, cap: 'log₂x คือภาพสะท้อนของ 2ˣ ข้ามเส้น y = x — 2ˣ ผ่าน (0, 1) ส่วน log₂x ผ่าน (1, 0)' }],
    'math-trig-1': [{ at: 'idea', svg: tri, cap: 'มองจากมุม θ: sin = ข้าม/ฉาก · cos = ชิด/ฉาก · tan = ข้าม/ชิด' },
      { at: 'ex', svg: quad, cap: '120° กับ 60° สูงเท่ากัน sin จึงเท่ากัน แต่ 120° อยู่ฝั่งซ้าย cos จึงติดลบ' }],
    'math-seq-1': [{ at: 'idea', svg: seq, cap: 'บน: ลำดับเลขคณิต บวกเท่ากันทุกก้าว (d = 4) · ล่าง: ลำดับเรขาคณิต คูณเท่ากันทุกก้าว (r = 3)' }],
    'math-seq-2': [{ at: 'f', svg: gauss, cap: 'จับคู่หัวกับท้าย ได้คู่ละ 101 มี 50 คู่ → 1 + 2 + … + 100 = 50 × 101 = 5,050 (ที่มาของ Sₙ = n/2 · (a₁ + aₙ))' },
      { at: 'ex', svg: halving, cap: 'แต่ละก้าวเติมครึ่งหนึ่งของช่องที่เหลือ (r = 1/2) ผลบวกจึงเข้าใกล้ 16 แต่ไม่เกิน' }],
    'math-prob-1': [{ at: 'idea', svg: pc, cap: 'ถามก่อนเสมอว่า "มีตำแหน่งต่างกันไหม" — มีใช้ P · ไม่มีใช้ C (หารด้วยจำนวนแบบที่สลับกันเอง)' }],
    'math-prob-2': [{ at: 'ex', svg: dice, cap: 'ทอยลูกเต๋า 2 ลูกได้ 36 แบบ ช่องสีเขียว (ผลรวม 7) มี 6 ช่อง → 6/36 = 1/6' }],
    'math-stat-1': [{ at: 'keys', svg: spread, cap: 'สองชุดมีค่าเฉลี่ยเท่ากัน แต่ชุดล่างอยู่ห่างค่าเฉลี่ยมากกว่า S.D. จึงใหญ่กว่า' }],
    'math-calc-1': [{ at: 'idea', svg: calc, cap: 'อนุพันธ์ = ความชันของเส้นสัมผัส (สีส้ม) · ปริพันธ์ = พื้นที่ใต้กราฟ (สีเขียว)' }]
  };
  // the caption doubles as the label for screen readers
  Object.values(F).forEach((gs) => gs.forEach((g) => { g.svg = g.svg.replace('<svg ', '<svg aria-label="' + g.cap.replace(/"/g, '') + '" '); }));
  window.PRIMER_FIGS = Object.assign(window.PRIMER_FIGS || {}, F);
})();
