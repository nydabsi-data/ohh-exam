/* Ohh-Exam — labelled diagrams (drawn for Ohh-Exam as inline SVG).
   window.FIGS = { id: { course, title, keys: RegExp, svg } }
   keys: a question whose text or explanation matches shows this picture after it is answered. */
(function () {
  const W = 360, H = 240;
  const svg = (inner) => '<svg viewBox="0 0 ' + W + ' ' + H + '" class="fig-svg" role="img" font-family="inherit">' + inner + '</svg>';
  // Label with a leader line: point (x1,y1) → text at (x2,y2)
  const lab = (x1, y1, x2, y2, text, anchor) =>
    '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="#8C8C8C" stroke-width="1.3"/>' +
    '<circle cx="' + x1 + '" cy="' + y1 + '" r="2.6" fill="#2B2B2B"/>' +
    '<text x="' + (x2 + (anchor === 'end' ? -4 : anchor === 'middle' ? 0 : 4)) + '" y="' + (y2 + 4) + '" font-size="12" font-weight="700" fill="#2B2B2B" text-anchor="' + (anchor || 'start') + '">' + text + '</text>';
  const cap = (text) => '<text x="' + W / 2 + '" y="' + (H - 8) + '" font-size="12" font-weight="600" fill="#6B6B6B" text-anchor="middle">' + text + '</text>';

  /* 1. Chromosome */
  const chromosome = svg(
    '<path d="M150 34 Q186 120 150 206" stroke="#A570FF" stroke-width="30" stroke-linecap="round" fill="none"/>' +
    '<path d="M210 34 Q174 120 210 206" stroke="#8549E8" stroke-width="30" stroke-linecap="round" fill="none"/>' +
    '<path d="M150 34 Q186 120 150 206" stroke="#fff" stroke-opacity=".35" stroke-width="30" stroke-dasharray="3 16" fill="none"/>' +
    '<path d="M210 34 Q174 120 210 206" stroke="#fff" stroke-opacity=".35" stroke-width="30" stroke-dasharray="3 16" fill="none"/>' +
    '<ellipse cx="180" cy="120" rx="15" ry="11" fill="#FFC800" stroke="#E5A800" stroke-width="2"/>' +
    lab(152, 52, 70, 30, 'โครมาทิด', 'end') + lab(208, 52, 290, 30, 'โครมาทิด') +
    '<text x="180" y="13" font-size="11" font-weight="700" fill="#6B6B6B" text-anchor="middle">โครมาทิดพี่น้อง 2 สาย (เหมือนกัน)</text>' +
    lab(193, 120, 262, 120, 'เซนโทรเมียร์') +
    // DNA coiled on histones (inset)
    '<g transform="translate(26 150)"><rect x="-6" y="-26" width="104" height="58" rx="10" fill="#F7F2FF" stroke="#E2D4FF"/>' +
    [10, 34, 58, 82].map((x) => '<circle cx="' + x + '" cy="6" r="9" fill="#FFD6E8" stroke="#FF4B9B" stroke-width="1.5"/>').join('') +
    '<path d="M0 6 C5 -8 15 -8 20 6 S30 20 34 6 S44 -8 48 6 S58 20 62 6 S72 -8 76 6 S86 20 92 6" stroke="#8549E8" stroke-width="2" fill="none"/>' +
    '<text x="46" y="27" font-size="10" font-weight="700" fill="#6B6B6B" text-anchor="middle">DNA พันรอบโปรตีนฮิสโตน</text></g>' +
    cap('1 โครโมโซม (หลังจำลอง DNA) = 2 โครมาทิด ยึดกันที่เซนโทรเมียร์'));

  /* 2. Mitochondrion */
  const cx = 180, cy = 112;
  const mito = svg(
    '<ellipse cx="' + cx + '" cy="' + cy + '" rx="150" ry="70" fill="#FFE7CC" stroke="#FF9600" stroke-width="4"/>' +
    '<ellipse cx="' + cx + '" cy="' + cy + '" rx="136" ry="57" fill="#FFF6EA" stroke="#E07F00" stroke-width="3"/>' +
    [-96, -48, 0, 48, 96].map((d) => '<line x1="' + (cx + d) + '" y1="' + (cy - 56) + '" x2="' + (cx + d) + '" y2="' + (cy - 10) + '" stroke="#E07F00" stroke-width="9" stroke-linecap="round"/>').join('') +
    [-72, -24, 24, 72].map((d) => '<line x1="' + (cx + d) + '" y1="' + (cy + 56) + '" x2="' + (cx + d) + '" y2="' + (cy + 10) + '" stroke="#E07F00" stroke-width="9" stroke-linecap="round"/>').join('') +
    '<circle cx="' + (cx - 120) + '" cy="' + cy + '" r="8" fill="none" stroke="#FF4B9B" stroke-width="2.5"/>' +
    [[-110, -24], [-60, 30], [10, -32], [60, 26], [118, -10], [-20, 36], [100, 30]].map((p) => '<circle cx="' + (cx + p[0]) + '" cy="' + (cy + p[1]) + '" r="2.8" fill="#8549E8"/>').join('') +
    lab(cx - 70, cy - 66, cx - 70, 20, 'เยื่อหุ้มชั้นนอก', 'end') +
    lab(cx + 48, cy - 34, 250, 22, 'คริสตี (cristae)', 'start') +
    lab(cx - 36, cy + 2, 175, 218, 'เมทริกซ์', 'middle') +
    lab(cx - 120, cy + 8, 78, 218, 'DNA ของไมโทคอนเดรีย', 'middle') +
    lab(cx + 60, cy + 26, 270, 218, 'ไรโบโซม', 'middle') +
    '<text x="' + W / 2 + '" y="' + (H - 2) + '" font-size="11" font-weight="600" fill="#6B6B6B" text-anchor="middle">แหล่งสร้าง ATP จากการหายใจระดับเซลล์</text>');

  /* 3. DNA double helix */
  const seq = 'ATGCGTACCGATTGCA', COL = { A: '#FF4B4B', T: '#FFC800', G: '#1CB0F6', C: '#A570FF' }, PAIR = { A: 'T', T: 'A', G: 'C', C: 'G' };
  let s1 = '', s2 = '', rungs = '';
  for (let x = 20; x <= 340; x += 4) {
    const t = (x - 20) / 40;
    s1 += (x === 20 ? 'M' : 'L') + x + ' ' + (100 + 55 * Math.sin(t)).toFixed(1) + ' ';
    s2 += (x === 20 ? 'M' : 'L') + x + ' ' + (100 - 55 * Math.sin(t)).toFixed(1) + ' ';
  }
  for (let i = 0; i < seq.length; i++) {
    const x = 30 + i * 19.5, t = (x - 20) / 40, ya = 100 + 55 * Math.sin(t), yb = 100 - 55 * Math.sin(t);
    if (Math.abs(ya - yb) < 10) continue;
    const ym = (ya + yb) / 2, b1 = seq[i], b2 = PAIR[b1];
    rungs += '<line x1="' + x + '" y1="' + ya.toFixed(1) + '" x2="' + x + '" y2="' + ym.toFixed(1) + '" stroke="' + COL[b1] + '" stroke-width="7" stroke-linecap="round"/>' +
      '<line x1="' + x + '" y1="' + ym.toFixed(1) + '" x2="' + x + '" y2="' + yb.toFixed(1) + '" stroke="' + COL[b2] + '" stroke-width="7" stroke-linecap="round"/>';
  }
  const legend = [['A', 'T', 'A–T (H 2 พันธะ)'], ['G', 'C', 'G–C (H 3 พันธะ)']].map((p, k) =>
    '<g transform="translate(' + (40 + k * 160) + ' 182)"><rect width="14" height="14" rx="3" fill="' + COL[p[0]] + '"/><rect x="16" width="14" height="14" rx="3" fill="' + COL[p[1]] + '"/>' +
    '<text x="36" y="12" font-size="12" font-weight="700" fill="#2B2B2B">' + p[2] + '</text></g>').join('');
  const dna = svg(rungs +
    '<path d="' + s1 + '" stroke="#5B6B82" stroke-width="5" fill="none" stroke-linecap="round"/>' +
    '<path d="' + s2 + '" stroke="#2B2B2B" stroke-width="5" fill="none" stroke-linecap="round"/>' +
    '<text x="22" y="34" font-size="11" font-weight="700" fill="#6B6B6B">สายนิวคลีโอไทด์ 2 สาย วิ่งสวนทิศกัน</text>' + legend +
    cap('เบสจับคู่กันตรงกลาง น้ำตาล–ฟอสเฟตเป็นแกนด้านนอก'));

  /* 4. Animal cell vs plant cell */
  const cell = svg(
    '<text x="92" y="22" font-size="13" font-weight="800" fill="#2B2B2B" text-anchor="middle">เซลล์สัตว์</text>' +
    '<text x="248" y="22" font-size="13" font-weight="800" fill="#2B2B2B" text-anchor="middle">เซลล์พืช</text>' +
    // animal
    '<ellipse cx="92" cy="112" rx="78" ry="70" fill="#FFE9F3" stroke="#FF4B9B" stroke-width="3"/>' +
    '<circle cx="96" cy="104" r="24" fill="#EADFFF" stroke="#8549E8" stroke-width="2.5"/><circle cx="100" cy="100" r="8" fill="#A570FF"/>' +
    '<ellipse cx="50" cy="140" rx="15" ry="8" fill="#FFE7CC" stroke="#FF9600" stroke-width="2"/><path d="M40 140 l4 -4 4 8 4 -8 4 8 4 -4" stroke="#E07F00" stroke-width="1.5" fill="none"/>' +
    [[60, 80], [130, 140], [120, 70], [75, 160], [140, 110]].map((p) => '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="2.6" fill="#8549E8"/>').join('') +
    // plant
    '<rect x="196" y="38" width="148" height="150" rx="10" fill="#FFF3D6" stroke="#B07A2A" stroke-width="6"/>' +
    '<rect x="204" y="46" width="132" height="134" rx="6" fill="#FFF9EC" stroke="#FF4B9B" stroke-width="2"/>' +
    '<rect x="220" y="72" width="80" height="88" rx="28" fill="#DCF2FF" stroke="#1CB0F6" stroke-width="2.5"/>' +
    '<circle cx="318" cy="70" r="15" fill="#EADFFF" stroke="#8549E8" stroke-width="2.5"/><circle cx="321" cy="67" r="5" fill="#A570FF"/>' +
    [[318, 116], [318, 150], [236, 170]].map((p) => '<ellipse cx="' + p[0] + '" cy="' + p[1] + '" rx="12" ry="7" fill="#7CCB82" stroke="#3E9A4A" stroke-width="1.5"/><line x1="' + (p[0] - 6) + '" y1="' + p[1] + '" x2="' + (p[0] + 6) + '" y2="' + p[1] + '" stroke="#2F7A3A" stroke-width="2"/>').join('') +
    lab(96, 128, 128, 214, 'นิวเคลียส', 'middle') + lab(50, 132, 20, 196, 'ไมโทคอนเดรีย', 'start') +
    lab(260, 116, 220, 214, 'แวคิวโอลใหญ่', 'middle') + lab(318, 150, 318, 214, 'คลอโรพลาสต์', 'middle') +
    lab(344, 52, 352, 30, 'ผนังเซลล์', 'end') + lab(168, 112, 170, 34, 'เยื่อหุ้มเซลล์', 'middle') +
    '<text x="' + W / 2 + '" y="' + (H - 2) + '" font-size="11" font-weight="600" fill="#6B6B6B" text-anchor="middle">พืชมีผนังเซลล์ คลอโรพลาสต์ และแวคิวโอลขนาดใหญ่</text>');

  /* 5. Mitosis stages */
  const X = (x, y, c) => '<path d="M' + (x - 6) + ' ' + (y - 8) + ' L' + (x + 6) + ' ' + (y + 8) + ' M' + (x + 6) + ' ' + (y - 8) + ' L' + (x - 6) + ' ' + (y + 8) + '" stroke="' + (c || '#8549E8') + '" stroke-width="4" stroke-linecap="round"/>';
  const stage = (i, name, note, inner) => {
    const x = 45 + i * 90;
    return '<g><circle cx="' + x + '" cy="98" r="38" fill="#EEF8FF" stroke="#1CB0F6" stroke-width="2.5"/>' + inner(x, 98) +
      '<text x="' + x + '" y="158" font-size="13" font-weight="800" fill="#2B2B2B" text-anchor="middle">' + name + '</text>' +
      '<text x="' + x + '" y="176" font-size="10.5" font-weight="600" fill="#6B6B6B" text-anchor="middle">' + note + '</text></g>';
  };
  const mitosis = svg(
    stage(0, 'โพรเฟส', 'โครโมโซมหดสั้น', (x, y) => X(x - 14, y - 10) + X(x + 12, y - 14) + X(x, y + 14)) +
    stage(1, 'เมทาเฟส', 'เรียงกลางเซลล์', (x, y) =>
      ['M', 'N'].map(() => '').join('') +
      [-18, 0, 18].map((d) => '<line x1="' + (x - 34) + '" y1="' + y + '" x2="' + x + '" y2="' + (y + d) + '" stroke="#9CC9E8" stroke-width="1"/><line x1="' + (x + 34) + '" y1="' + y + '" x2="' + x + '" y2="' + (y + d) + '" stroke="#9CC9E8" stroke-width="1"/>' + X(x, y + d)).join('')) +
    stage(2, 'แอนาเฟส', 'โครมาทิดแยกไปขั้ว', (x, y) =>
      [-14, 0, 14].map((d) => '<path d="M' + (x - 10) + ' ' + (y + d - 6) + ' L' + (x - 22) + ' ' + (y + d) + ' L' + (x - 10) + ' ' + (y + d + 6) + '" stroke="#8549E8" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path d="M' + (x + 10) + ' ' + (y + d - 6) + ' L' + (x + 22) + ' ' + (y + d) + ' L' + (x + 10) + ' ' + (y + d + 6) + '" stroke="#8549E8" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>').join('')) +
    stage(3, 'เทโลเฟส', 'แบ่งไซโทพลาซึม', (x, y) =>
      '<circle cx="' + (x - 17) + '" cy="' + y + '" r="13" fill="#EADFFF" stroke="#8549E8" stroke-width="2"/><circle cx="' + (x + 17) + '" cy="' + y + '" r="13" fill="#EADFFF" stroke="#8549E8" stroke-width="2"/>' +
      '<line x1="' + x + '" y1="' + (y - 36) + '" x2="' + x + '" y2="' + (y + 36) + '" stroke="#1CB0F6" stroke-width="3" stroke-dasharray="5 4"/>') +
    '<text x="' + W / 2 + '" y="30" font-size="12" font-weight="700" fill="#6B6B6B" text-anchor="middle">ไมโทซิส: 1 เซลล์ → 2 เซลล์ จำนวนโครโมโซมเท่าเดิม</text>' +
    cap('จำง่าย: P-M-A-T (โพร → เมทา → แอนา → เทโล)'));

  /* 6. Chloroplast */
  const granum = (x, y) => [0, 1, 2, 3].map((k) => '<rect x="' + (x - 16) + '" y="' + (y - 16 + k * 8) + '" width="32" height="7" rx="3.5" fill="#5CB86A" stroke="#2F7A3A" stroke-width="1"/>').join('');
  const chloro = svg(
    '<ellipse cx="180" cy="112" rx="152" ry="72" fill="#DDF3D9" stroke="#3E9A4A" stroke-width="4"/>' +
    '<ellipse cx="180" cy="112" rx="142" ry="63" fill="#EEF9EA" stroke="#5CB86A" stroke-width="2"/>' +
    '<path d="M70 112 H290" stroke="#5CB86A" stroke-width="3"/><path d="M110 90 L150 130 M210 90 L250 130" stroke="#5CB86A" stroke-width="3"/>' +
    granum(90, 112) + granum(130, 90) + granum(170, 130) + granum(210, 90) + granum(250, 130) + granum(280, 108) +
    lab(130, 84, 120, 24, 'กรานุม (ไทลาคอยด์ซ้อนกัน)', 'middle') +
    lab(200, 160, 120, 214, 'สโตรมา', 'middle') +
    lab(300, 52, 300, 24, 'เยื่อหุ้ม 2 ชั้น', 'middle') +
    lab(152, 112, 250, 214, 'ลาเมลลา', 'middle') +
    '<text x="' + W / 2 + '" y="' + (H - 2) + '" font-size="11" font-weight="600" fill="#6B6B6B" text-anchor="middle">แสง + CO₂ + H₂O → น้ำตาล + O₂ (ปฏิกิริยาแสงที่ไทลาคอยด์)</text>');

  window.FIGS = {
    mitosis:    { course: 'bio', title: 'ระยะของไมโทซิส', svg: mitosis, keys: /ไมโทซิส|โพรเฟส|เมทาเฟส|แอนาเฟส|เทโลเฟส|ไซโทไคนีซิส/ },
    chromosome: { course: 'bio', title: 'โครโมโซม', svg: chromosome, keys: /โครโมโซม|โครมาทิด|เซนโทรเมียร์|ฮิสโตน/ },
    dna:        { course: 'bio', title: 'DNA เกลียวคู่', svg: dna, keys: /DNA|ดีเอ็นเอ|นิวคลีโอไทด์|คู่เบส|เบส [ATGC]/ },
    mito:       { course: 'bio', title: 'ไมโทคอนเดรีย', svg: mito, keys: /ไมโทคอนเดรีย|ATP|หายใจระดับเซลล์/ },
    chloro:     { course: 'bio', title: 'คลอโรพลาสต์', svg: chloro, keys: /คลอโรพลาสต์|สังเคราะห์ด้วยแสง|คลอโรฟิลล์|ไทลาคอยด์/ },
    cell:       { course: 'bio', title: 'เซลล์สัตว์ vs เซลล์พืช', svg: cell, keys: /ผนังเซลล์|เยื่อหุ้มเซลล์|ออร์แกเนลล์|แวคิวโอล|เซลล์พืช|เซลล์สัตว์|ไรโบโซม|นิวเคลียส/ }
  };
})();
