/* Ohh-Exam — TH / EN language switch.
   The app renders Thai; in English mode this layer translates every text node and the
   placeholder / title / aria-label attributes as they appear (MutationObserver).
   Elements inside .no-i18n are left alone (e.g. the Thai answer explanations).
   Switch with any element that has data-lang="th" / data-lang="en". */
(function () {
  'use strict';
  const KEY = 'ohh_lang';
  let lang = 'th';
  try { lang = localStorage.getItem(KEY) === 'en' ? 'en' : 'th'; } catch (e) { /* ignore */ }

  const EXACT = {
    'เข้า': 'Enter', 'เข้าใช้วันนี้': 'Active today', 'เข้าสู่ระบบ': 'Sign in',
    'เข้าสู่ระบบ / สมัคร': 'Sign in / Sign up', 'เข้าสู่ระบบ / สมัครสมาชิก': 'Sign in / Sign up',
    'เข้าสู่ระบบ · Ohh-Exam': 'Sign in · Ohh-Exam',
    'เข้าสู่ระบบเพื่อเก็บ XP และบทเรียนไว้ในบัญชี ใช้ต่อได้ทุกอุปกรณ์': 'Sign in to keep your XP and lessons in your account, on every device.',
    'เข้าสู่ระบบเพื่อบันทึกความคืบหน้า': 'Sign in to save your progress',
    'เช่น captain01': 'e.g. captain01',
    'เชื่อมต่อไม่ได้ ตรวจสอบอินเทอร์เน็ตแล้วลองใหม่': "Can't connect. Check your internet and try again.",
    'เชื่อมต่อไม่ได้ ลองใหม่อีกครั้ง': "Can't connect. Please try again.",
    'เป้าหมายวันนี้': "Today's goal", 'เปิด': 'Open', 'เมนูหลัก': 'Main menu',
    'เยี่ยมมาก!': 'Great job!', 'เริ่ม': 'Start', 'เรียนต่อ': 'Keep learning',
    'เลือกโหมดที่จะฝึก': 'Choose a mode', 'เลือกคำตอบที่ถูกต้อง': 'Choose the correct answer',
    'เวลา': 'Time', 'เสียงเอฟเฟกต์': 'Sound effects',
    'แบบทดสอบ 7 ชุด พร้อมเฉลยและคำอธิบาย': '7 test sets with answers and explanations',
    'แม่นมาก!': 'Spot on!', 'แสดง': 'Show', 'ซ่อน': 'Hide', 'โปรไฟล์': 'Profile', 'ไปต่อ': 'Continue',
    'ไม่พบชื่อผู้ใช้นี้': 'Username not found',
    'กรุณากรอกชื่อผู้ใช้หรืออีเมล': 'Please enter your username or email',
    'กรุณากรอกอีเมลให้ถูกต้อง': 'Please enter a valid email',
    'กลับไปเลือกข้อสอบ': 'Back', 'กลับหน้าหลัก': 'Back to home',
    'กำลังโหลด...': 'Loading...', 'กำลังดำเนินการ...': 'Working...',
    'คณิตศาสตร์สำหรับนักบิน': 'Math for pilots', 'ควบคุมและความแม่นยำ': 'Control and precision',
    'ความแม่นยำ': 'Accuracy', 'ความคืบหน้า': 'Progress',
    'ความคืบหน้าซิงก์อัตโนมัติ': 'Progress syncs automatically',
    'ความคืบหน้าซิงก์อัตโนมัติ ใช้ได้ทุกอุปกรณ์': 'Progress syncs automatically on every device',
    'ความคืบหน้ารายวิชา': 'Progress by subject',
    'ความรู้นักบิน แบบบทเรียนสั้น': 'Pilot knowledge in short lessons',
    'ความรู้นักบินและแบบทดสอบความถนัด': 'Pilot knowledge and aptitude tests',
    'คะแนนจากแบบทดสอบ 6 ชุด (Series Number, Math ฯลฯ) จะแสดงที่นี่ในขั้นถัดไป': 'Scores from the 6 aptitude tests (Series Number, Math, etc.) will appear here in a later update.',
    'คำตอบที่ถูก:': 'Correct answer:',
    'คำถามชุดนี้เป็นตัวอย่างสำหรับทดสอบระบบ ควรตรวจกับตำราและข้อกำหนดของ CAAT / ICAO ก่อนใช้งานจริง': 'These are sample questions for testing. Check them against CAAT / ICAO material before real use.',
    'จบบทเรียน 1 บท': 'Finish 1 lesson', 'จบบทเรียนแล้ว!': 'Lesson complete!',
    'จริงหรือไม่จริง': 'True or false', 'True — จริง': 'True', 'False — ไม่จริง': 'False',
    'จัดการผู้ใช้และดูภาพรวมระบบ': 'Manage users and see the overview',
    'จับคู่ให้ถูกต้อง': 'Match the pairs',
    'ชื่อผู้ใช้ หรือ you@example.com': 'Username or you@example.com',
    'ชื่อผู้ใช้/อีเมล หรือรหัสผ่านไม่ถูกต้อง': 'Wrong username/email or password',
    'ชื่อผู้ใช้ใช้ได้เฉพาะ a–z 0–9 . _ - ยาว 3–20 ตัว': 'Usernames can use a–z, 0–9, . _ - (3–20 characters)',
    'ชื่อผู้ใช้นี้มีคนใช้แล้ว ลองชื่ออื่น': 'That username is taken. Try another one.',
    'ชื่อผู้ใช้หรืออีเมล': 'Username or email',
    'ตรวจคำตอบ': 'Check', 'ตอบถูก 15 ข้อ': 'Get 15 answers right', 'ตั้งค่า': 'Settings',
    'ตั้งชื่อผู้ใช้ (Username)': 'Choose a username',
    'ถ้าไม่เข้าสู่ระบบ ความคืบหน้าจะเก็บไว้ในเครื่องนี้เท่านั้น': 'Without signing in, progress is saved on this device only.',
    'ถ้ายังไม่ได้ติดตั้งฟังก์ชัน admin ให้รันไฟล์ database/admin.sql ใน Supabase SQL Editor': 'If the admin functions are not installed yet, run database/admin.sql in the Supabase SQL Editor.',
    'ถ้าออกตอนนี้ ความคืบหน้าในบทเรียนนี้จะหายไป': "If you leave now, this lesson's progress will be lost.",
    'ถูกต้อง!': 'Correct!', 'ทำบทเรียนได้ 100%': 'Score 100% on a lesson',
    'ทำหลายอย่างพร้อมกัน': 'Do several things at once', 'ทำอีกครั้ง': 'Try again',
    'XP ที่ได้': 'XP earned', 'XP สะสม': 'Total XP', 'XP รวมทุกคน': 'Total XP (all)',
    'บทเรียนที่ผ่าน': 'Lessons passed', 'บทเรียนสั้น ทำจบได้ในไม่กี่นาที': 'Short lessons you can finish in minutes',
    'บัญชี': 'Account', 'บัญชีของคุณ': 'Your account', 'บันทึกความคืบหน้า': 'Save your progress',
    'ปิด': 'Close', 'ผลคะแนน': 'Score', 'ผลคะแนนและพัฒนาการของคุณ': 'Your scores and progress',
    'ผ่านบทเรียนก่อนหน้าก่อน แล้วบทนี้จะปลดล็อก': 'Finish the previous lesson to unlock this one',
    'เลือกตัวละคร': 'Choose your character', 'นักอ่าน': 'Reader', 'นักผจญภัย': 'Explorer', 'สายเทค': 'Techie', 'คนรักดนตรี': 'Music lover', 'นักคิด': 'Thinker', 'เพื่อนใจดี': 'Buddy', 'เชฟ': 'Chef', 'นักปลูก': 'Gardener',
    'ผู้เยี่ยมชม': 'Guest', 'ผู้ใช้': 'User',
    'ฝึกข้อสอบวันละไม่กี่นาที สนุกเหมือนเล่นเกม': 'Practice exams a few minutes a day. As fun as a game.',
    'พิมพ์รหัสผ่านอีกครั้ง': 'Type the password again',
    'ภาพรวม': 'Overview', 'ภารกิจ': 'Missions', 'ภารกิจวันนี้': "Today's missions",
    'ภาษาอังกฤษ ตัวเลข . _ - ได้ ยาว 3–20 ตัว': 'Letters, numbers and . _ - allowed, 3–20 characters',
    'มิติสัมพันธ์ ประกอบชิ้นส่วนภาพ': 'Spatial reasoning: fit the pieces',
    'มี XP ภารกิจ และ streak ให้อยากกลับมาทุกวัน': 'XP, missions and streaks keep you coming back',
    'ยกเลิก': 'Cancel', 'ยอดเยี่ยม!': 'Excellent!',
    'ยังไม่ได้เข้าสู่ระบบ ความคืบหน้าเก็บในเครื่องนี้': 'Not signed in. Progress is saved on this device.',
    'ยังไม่ได้ยืนยันอีเมล กรุณากดลิงก์ในอีเมลที่เราส่งไปก่อน': 'Email not confirmed yet. Please click the link we sent you.',
    'ยังไม่ถูก': 'Not quite', 'ยืนยันรหัสผ่าน': 'Confirm password',
    'รหัสผ่าน (Password)': 'Password', 'รหัสผ่านของคุณ': 'Your password',
    'รหัสผ่านต้องมีอย่างน้อย 6 ตัว': 'Password must be at least 6 characters',
    'รหัสผ่านทั้งสองช่องไม่ตรงกัน': "The passwords don't match",
    'รับแล้ว': 'Claimed', 'ลองใช้งานโดยไม่ต้องสมัคร': 'Try without an account', 'ลองทำแบบทดสอบ 1 ชุด': 'Try 1 test',
    'ล้างความคืบหน้า?': 'Reset progress?', 'ล้างความคืบหน้าแล้ว': 'Progress reset',
    'ล้างความคืบหน้าทั้งหมด': 'Reset all progress', 'ล้างทั้งหมด': 'Reset everything',
    'XP, streak และบทเรียนที่ผ่านแล้วทั้งหมดจะถูกลบ': 'All XP, streaks and finished lessons will be deleted.',
    'สมบูรณ์แบบ!': 'Perfect!', 'สมัครเมื่อ': 'Joined', 'สมัครสมาชิก': 'Sign up', 'สมาชิกทั้งหมด': 'Total members',
    'สวัสดีผู้เยี่ยมชม': 'Hello, guest', 'สะสม 50 XP วันนี้': 'Earn 50 XP today',
    'สิทธิ์': 'Role', 'หน้าแรก': 'Home', 'หรือ': 'or', 'หัวใจ': 'Hearts', 'หัวใจหมดแล้ว': 'Out of hearts',
    'หาตัวเลขถัดไปในอนุกรม': 'Find the next number in the series',
    'อย่างน้อย 6 ตัว': 'At least 6 characters',
    'ออก': 'Leave', 'ออกจากบทเรียน': 'Leave lesson', 'ออกจากบทเรียน?': 'Leave the lesson?', 'ออกจากระบบ': 'Sign out',
    'ออกจากหน้า Management?': 'Leave Management?', 'อัปเดตสิทธิ์แล้ว': 'Role updated',
    'อ่านทิศทางและการหมุนของเครื่องบิน': 'Read aircraft direction and rotation',
    'อีเมล (Email)': 'Email', 'อีเมลนี้สมัครไว้แล้ว ลองเข้าสู่ระบบแทน': 'This email is already registered. Try signing in.',
    'ส่งอีเมลบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่': 'Too many emails sent. Please wait a moment and try again.',
    'ปิดหน้าต่างนี้? ข้อมูลที่กรอกจะหายไป': 'Close this window? What you typed will be lost.',
    'ใช้งานล่าสุด': 'Last active', 'วัน': 'days', 'ชุดข้อสอบ': 'exam sets', 'บทเรียนผ่าน': 'Lessons passed',
    'อา': 'Sun', 'จ': 'Mon', 'อ': 'Tue', 'พ': 'Wed', 'พฤ': 'Thu', 'ศ': 'Fri', 'ส': 'Sat',
    'หลักการบิน': 'Principles of Flight', 'อุตุนิยมวิทยา': 'Meteorology', 'การเดินอากาศ': 'Navigation',
    'กฎหมายการบิน': 'Air Law', 'ระบบอากาศยานและเครื่องวัด': 'Aircraft & Instruments', 'วิทยุสื่อสารและปัจจัยมนุษย์': 'Radio & Human Factors',
    'ง่าย': 'Easy', 'ปานกลาง': 'Medium', 'ยาก': 'Hard', 'บท': 'chapters', 'ชุด': 'sets', 'Reading Part 5–7 แนวข้อสอบจริง จับเวลา': 'Reading Parts 5–7, exam-style, timed', 'สมัครเพื่อปลดล็อก': 'Sign up to unlock', 'สมัครสมาชิกฟรีเพื่อปลดล็อก': 'Sign up free to unlock', 'โหมดทดลองใช้ทำได้ 2 บทแรกของแต่ละวิชา และแบบทดสอบชุดแรก สมัครสมาชิก (ฟรี) เพื่อปลดล็อกทุกบทและเก็บคะแนนไว้ในบัญชี': 'Trying without an account lets you do the first 2 lessons of each subject and the first test. Sign up (free) to unlock everything and keep your scores.', 'สมัคร / เข้าสู่ระบบ': 'Sign up / Sign in', 'ไว้ก่อน': 'Not now', 'ภาพประกอบ': 'Pictures', 'ดูภาพแล้วจำง่ายขึ้น': 'See it to remember it', 'ปิดภาพนี้?': 'Close this picture?', 'เรื่อง': 'topics', 'แบบทดสอบ': 'tests', 'คณิตศาสตร์ ม.ปลาย': 'High-school maths', 'เซต ฟังก์ชัน ตรีโกณ ลำดับ ความน่าจะเป็น สถิติ แคลคูลัส': 'Sets, functions, trig, sequences, probability, statistics, calculus',
    'ฝึกฝน': 'Practice', 'ฝึกได้ไม่จำกัด · ได้ XP ตามระดับความยาก': 'Unlimited practice · XP by difficulty',
    'ฝึกข้อที่ตอบผิด': 'Practise your mistakes', 'ฝึกจุดอ่อน': 'Work on weak spots', 'ทบทวนแบบสุ่ม': 'Random review',
    'ตอบถูก 2 ครั้งแล้วข้อจะหายจากรายการ': 'A question leaves the list after 2 right answers',
    'ยังไม่มีข้อที่ตอบผิด': 'No wrong answers yet', 'รวมข้อจากบทที่ยังทำได้ไม่ดี': 'Questions from lessons you find hard',
    'ยังไม่พบจุดอ่อน': 'No weak spots found yet', 'สุ่ม 10 ข้อจากบทที่ผ่านแล้ว': '10 random questions from passed lessons',
    'ผ่านบทเรียนก่อนแล้วจะทบทวนได้': 'Pass a lesson first to review it', 'บทที่ยังอ่อน': 'Lessons to work on',
    'ยังไม่มี ทำบทเรียนไปสักพักแล้วระบบจะบอกว่าบทไหนควรฝึกเพิ่ม': 'Nothing yet. After a few lessons this shows which ones need more practice.',
    'ฝึก': 'Practise', 'ฝึกเสร็จแล้ว!': 'Practice done!', 'ยังไม่มีข้อให้ฝึก': 'Nothing to practise yet',
    'ข้อ': 'Qs', 'ผ่านแล้ว': 'Passed', 'ล็อก': 'Locked', 'ก่อนหน้า': 'Previous', 'ถัดไป': 'Next',
    'ความแม่นยำตามระดับความยาก': 'Accuracy by difficulty',
    'ง่าย 10 · ปานกลาง 15 · ยาก 20 XP': 'Easy 10 · Medium 15 · Hard 20 XP',
    'ระดับความยาก: ง่าย +10 XP · ปานกลาง +15 XP · ยาก +20 XP ต่อข้อ': 'Difficulty: Easy +10 XP · Medium +15 XP · Hard +20 XP per question'
  };
  // Extra names registered by data files (e.g. physics units and lessons).
  const EXTRA = window.I18N_EXTRA || {};
  Object.assign(EXACT, EXTRA);

  // Whole-string patterns for sentences with values inside.
  const FULL = [
    [/^สวัสดี (.+)$/, 'Hello, $1'],
    [/^โหมด (.+)$/, '$1 mode'],
    [/^XP 7 วันล่าสุด(.*)$/, 'XP, last 7 days$1'],
    [/^หัวใจจะเติม 1 ดวงทุก 30 นาที ดวงถัดไปในอีก (\d+) นาที$/, 'You get 1 heart back every 30 minutes. Next one in $1 min.'],
    [/^สมัครเรียบร้อย ส่งลิงก์ยืนยันไปที่ (\S+) แล้ว[\s\S]*$/, 'Signed up! We sent a confirmation link to $1. Click it to activate your account.'],
    [/^ระบบบัญชียังไม่เปิดใช้งาน[\s\S]*$/, 'Accounts are not available yet. Use "Try without an account" for now.'],
    [/^ได้รับ \+(\d+) XP$/, '+$1 XP received'],
    [/^บทที่ (\d+)$/, 'Lesson $1'],
    [/^ชุดที่ (\d+)$/, 'Test $1'],
    [/^ผ่านแล้ว (\d+)%$/, 'Passed $1%'],
    [/^ผิด (\d+) ครั้ง$/, '$1 wrong'],
    [/^ผิด (\d+) ครั้ง · แม่นยำ (\d+)%$/, '$1 wrong · $2% accuracy']
  ];
  // Phrase replacements for mixed strings (longest first), then number + unit patterns.
  const PHRASES = Object.entries(Object.assign({}, EXTRA, {
    'ภารกิจประจำวัน': 'Daily missions', 'รีเซ็ตในอีก': 'resets in', 'เรียนต่อเนื่อง': 'Streak', 'ต่อเนื่อง': 'Streak',
    'สำเร็จ': 'Done', 'ชุดข้อสอบ': 'exam sets', 'บทเรียนผ่าน': 'Lessons passed', 'แม่นยำ': 'accuracy', 'รวม': 'Total',
    'เปลี่ยนสิทธิ์ไม่ได้:': 'Could not change role:', 'โหลดข้อมูลไม่ได้:': 'Could not load data:',
    'ระบบอากาศยานและเครื่องวัด': 'Aircraft & Instruments', 'วิทยุสื่อสารและปัจจัยมนุษย์': 'Radio & Human Factors',
    'แบบทดสอบความถนัด': 'Aptitude tests', 'พื้นฐานเครื่องบิน': 'Aircraft Basics', 'ประวัติศาสตร์การบิน': 'Aviation History',
    'หลักการบิน': 'Principles of Flight', 'อุตุนิยมวิทยา': 'Meteorology', 'การเดินอากาศ': 'Navigation', 'กฎหมายการบิน': 'Air Law'
  })).sort((a, b) => b[0].length - a[0].length);
  const UNITS = [
    [/(\d+)\/(\d+) บท/g, '$1/$2 lessons'], [/(\d+) ชม\./g, '$1 h'], [/(\d+) วัน/g, '$1 days'],
    [/(\d+) ข้อ/g, '$1 Qs'], [/(\d+) วินาที/g, '$1 sec'], [/(\d+) นาที/g, '$1 min'],
    [/(\d+) วิชา/g, '$1 subjects'], [/(\d+) ชุด/g, '$1 sets'], [/(\d+) บท/g, '$1 chapters'], [/\+1 ใน (\d+) min/g, '+1 in $1 min']
  ];
  const THAI = /[฀-๿]/;

  function t(s) {
    if (lang !== 'en' || !s || !THAI.test(s)) return s;
    const m = /^(\s*)([\s\S]*?)(\s*)$/.exec(s);
    let core = m[2];
    if (Object.prototype.hasOwnProperty.call(EXACT, core)) return m[1] + EXACT[core] + m[3];
    for (const [re, r] of FULL) if (re.test(core)) return m[1] + core.replace(re, r) + m[3];
    for (const [a, b] of PHRASES) core = core.split(a).join(b);
    for (const [re, r] of UNITS) core = core.replace(re, r);
    return m[1] + core + m[3];
  }

  const SKIP = '.no-i18n, script, style, textarea';
  const ATTRS = ['placeholder', 'title', 'aria-label'];

  function doText(n) {
    const p = n.parentElement;
    if (!p || p.closest(SKIP)) return;
    const cur = n.nodeValue;
    const orig = n.__tr === cur && n.__th != null ? n.__th : cur;   // text changed by the app → new original
    const out = t(orig);
    n.__th = orig; n.__tr = out;
    if (cur !== out) n.nodeValue = out;
  }
  function doAttrs(el) {
    if (el.closest(SKIP)) return;
    for (const a of ATTRS) {
      if (!el.hasAttribute(a)) continue;
      el.__th = el.__th || {}; el.__tr = el.__tr || {};
      const cur = el.getAttribute(a);
      const orig = el.__tr[a] === cur && el.__th[a] != null ? el.__th[a] : cur;
      const out = t(orig);
      el.__th[a] = orig; el.__tr[a] = out;
      if (cur !== out) el.setAttribute(a, out);
    }
  }
  function apply(root) {
    root = root || document.body;
    if (root.nodeType === 3) return doText(root);
    if (root.nodeType !== 1) return;
    doAttrs(root);
    root.querySelectorAll('[placeholder],[title],[aria-label]').forEach(doAttrs);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let n; while ((n = w.nextNode())) doText(n);
  }

  let docTitle = null;
  function applyTitle() {
    if (docTitle == null || (document.title !== t(docTitle) && document.title !== docTitle)) docTitle = document.title;
    const out = t(docTitle); if (document.title !== out) document.title = out;
  }
  function paintSwitch() {
    document.querySelectorAll('[data-lang]').forEach((b) => {
      b.classList.toggle('on', b.dataset.lang === lang);
      b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
    });
  }

  function setLang(l) {
    lang = l === 'en' ? 'en' : 'th';
    try { localStorage.setItem(KEY, lang); } catch (e) { /* ignore */ }
    document.documentElement.lang = lang;
    apply(document.body); applyTitle(); paintSwitch();
    window.dispatchEvent(new CustomEvent('langchange', { detail: lang }));
  }

  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-lang]'); if (!b) return;
    e.preventDefault(); setLang(b.dataset.lang);
  });

  new MutationObserver((list) => {
    if (lang !== 'en') return;
    for (const m of list) {
      if (m.type === 'childList') m.addedNodes.forEach(apply);
      else if (m.type === 'characterData') doText(m.target);
      else if (m.type === 'attributes') doAttrs(m.target);
    }
  }).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });

  window.I18N = { t, setLang, get lang() { return lang; } };
  document.documentElement.lang = lang;
  apply(document.body); applyTitle(); paintSwitch();
})();
