/* Ohh-Exam — login page: username + password (sign in / sign up) or guest mode.
   Supabase Auth needs an email, so each username maps to a hidden address
   <username>@users.ohh-exam.app. "Confirm email" must be OFF in Supabase Auth settings. */
(function () {
  'use strict';

  const $ = (s) => document.querySelector(s);
  const APP = new URL('./', location.href).href;
  const USER_RE = /^[a-z0-9._-]{3,20}$/;
  const toEmail = (u) => u + '@users.ohh-exam.app';

  const CFG = window.PE_SUPABASE || {};
  const sb = CFG.url && CFG.key && window.supabase ? window.supabase.createClient(CFG.url, CFG.key) : null;

  const ERR = {
    'Invalid login credentials': 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',
    'User already registered': 'ชื่อผู้ใช้นี้มีคนใช้แล้ว ลองชื่ออื่น',
    'Email not confirmed': 'บัญชียังไม่เปิดใช้งาน กรุณาติดต่อผู้ดูแล',
    'Password should be at least 6 characters.': 'รหัสผ่านต้องมีอย่างน้อย 6 ตัว'
  };
  let mode = 'in';

  function say(text, kind) { const m = $('#msg'); m.textContent = text || ''; m.className = 'form-msg' + (kind ? ' ' + kind : ''); }
  const go = () => location.replace(APP);

  function setMode(m) {
    mode = m;
    const up = m === 'up';
    document.querySelectorAll('#tabs button').forEach((b) => b.classList.toggle('on', b.dataset.mode === m));
    $('#pw2-wrap').classList.toggle('hidden', !up);
    $('#user-hint').classList.toggle('hidden', !up);
    $('#pw').autocomplete = up ? 'new-password' : 'current-password';
    $('#pw').placeholder = up ? 'อย่างน้อย 6 ตัว' : 'รหัสผ่านของคุณ';
    $('#submit').textContent = up ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ';
    say('');
    $('#user').focus();
  }

  async function submit(e) {
    e.preventDefault();
    const username = $('#user').value.trim().toLowerCase(), pw = $('#pw').value, pw2 = $('#pw2').value;
    if (!username) return say('กรุณากรอกชื่อผู้ใช้', 'err');
    if (!USER_RE.test(username)) return say('ชื่อผู้ใช้ใช้ได้เฉพาะ a–z 0–9 . _ - ยาว 3–20 ตัว', 'err');
    if (pw.length < 6) return say('รหัสผ่านต้องมีอย่างน้อย 6 ตัว', 'err');
    if (mode === 'up' && pw !== pw2) return say('รหัสผ่านทั้งสองช่องไม่ตรงกัน', 'err');
    if (!sb) return say('ระบบบัญชียังไม่เปิดใช้งาน (กำลังเชื่อมต่อฐานข้อมูล) ระหว่างนี้กด "ลองใช้งานโดยไม่ต้องสมัคร" ได้เลย', 'err');

    const btn = $('#submit'); btn.disabled = true; say('กำลังดำเนินการ...');
    let res;
    try {
      res = mode === 'in'
        ? await sb.auth.signInWithPassword({ email: toEmail(username), password: pw })
        : await sb.auth.signUp({ email: toEmail(username), password: pw, options: { data: { username } } });
    } catch (err) {
      res = { error: { message: 'เชื่อมต่อไม่ได้ ตรวจสอบอินเทอร์เน็ตแล้วลองใหม่' } };
    }
    btn.disabled = false;
    if (res.error) return say(ERR[res.error.message] || res.error.message, 'err');
    if (mode === 'up' && !(res.data && res.data.session)) return say('สมัครแล้ว แต่บัญชียังไม่เปิดใช้งาน กรุณาติดต่อผู้ดูแล', 'err');
    try { localStorage.removeItem('ohh_guest'); } catch (e2) { /* ignore */ }
    go();
  }

  document.querySelectorAll('#tabs button').forEach((b) => b.addEventListener('click', () => setMode(b.dataset.mode)));
  $('#f').addEventListener('submit', submit);
  $('#eye').addEventListener('click', () => {
    const vis = $('#pw').type === 'password';
    $('#pw').type = $('#pw2').type = vis ? 'text' : 'password';
    $('#eye').textContent = vis ? 'ซ่อน' : 'แสดง';
  });
  $('#guest').addEventListener('click', () => { try { localStorage.setItem('ohh_guest', '1'); } catch (e) { /* ignore */ } go(); });

  setMode('in');
})();
