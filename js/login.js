/* Ohh-Exam — login page: sign in, sign up, forgot / reset password, guest mode. */
(function () {
  'use strict';

  const $ = (s) => document.querySelector(s);
  const APP = new URL('./', location.href).href;
  const HERE = location.origin + location.pathname;
  const recovering = /type=recovery/.test(location.hash);   // read before Supabase clears the hash

  const CFG = window.PE_SUPABASE || {};
  const sb = CFG.url && CFG.key && window.supabase ? window.supabase.createClient(CFG.url, CFG.key) : null;

  const ERR = {
    'Invalid login credentials': 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
    'Email not confirmed': 'ยังไม่ได้ยืนยันอีเมล กรุณากดลิงก์ในอีเมลก่อน',
    'User already registered': 'อีเมลนี้สมัครไว้แล้ว ลองเข้าสู่ระบบแทน',
    'Password should be at least 6 characters.': 'รหัสผ่านต้องมีอย่างน้อย 6 ตัว'
  };
  const MODES = {
    in:     { submit: 'เข้าสู่ระบบ' },
    up:     { submit: 'สมัครสมาชิก' },
    forgot: { submit: 'ส่งลิงก์ตั้งรหัสผ่านใหม่', title: 'ลืมรหัสผ่าน', sub: 'กรอกอีเมลที่ใช้สมัคร เราจะส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ไปให้' },
    reset:  { submit: 'บันทึกรหัสผ่านใหม่', title: 'ตั้งรหัสผ่านใหม่', sub: 'ใส่รหัสผ่านใหม่อย่างน้อย 6 ตัว' }
  };
  let mode = 'in';

  const show = (sel, on) => $(sel).classList.toggle('hidden', !on);
  function say(text, kind) { const m = $('#msg'); m.textContent = text || ''; m.className = 'form-msg' + (kind ? ' ' + kind : ''); }
  const go = () => location.replace(APP);

  function setMode(m) {
    mode = m;
    const cfg = MODES[m], tabbed = m === 'in' || m === 'up';
    document.querySelectorAll('#tabs button').forEach((b) => b.classList.toggle('on', b.dataset.mode === m));
    show('#tabs', tabbed);
    show('#title', !tabbed); show('#sub', !tabbed);
    $('#title').textContent = cfg.title || ''; $('#sub').textContent = cfg.sub || '';
    show('#email-wrap', m !== 'reset');
    show('#pw-wrap', m !== 'forgot');
    show('#pw2-wrap', m === 'up' || m === 'reset');
    show('#forgot', m === 'in');
    show('#back', m === 'forgot');
    show('#guest-box', m !== 'reset');
    $('#pw').autocomplete = m === 'in' ? 'current-password' : 'new-password';
    $('#pw').placeholder = m === 'in' ? 'รหัสผ่านของคุณ' : 'อย่างน้อย 6 ตัว';
    $('#submit').textContent = cfg.submit;
    say('');
    (m === 'reset' ? $('#pw') : $('#email')).focus();
  }

  async function submit(e) {
    e.preventDefault();
    if (!sb) return say('ระบบบัญชียังไม่เปิดใช้งาน (กำลังเชื่อมต่อฐานข้อมูล) ระหว่างนี้กด "ลองใช้งานโดยไม่ต้องสมัคร" ได้เลย', 'err');

    const email = $('#email').value.trim(), pw = $('#pw').value, pw2 = $('#pw2').value;
    if (mode !== 'reset' && !/^\S+@\S+\.\S+$/.test(email)) return say('กรุณากรอกอีเมลให้ถูกต้อง', 'err');
    if (mode !== 'forgot' && pw.length < 6) return say('รหัสผ่านต้องมีอย่างน้อย 6 ตัว', 'err');
    if ((mode === 'up' || mode === 'reset') && pw !== pw2) return say('รหัสผ่านทั้งสองช่องไม่ตรงกัน', 'err');

    const btn = $('#submit'); btn.disabled = true; say('กำลังดำเนินการ...');
    let res;
    try {
      if (mode === 'in') res = await sb.auth.signInWithPassword({ email, password: pw });
      else if (mode === 'up') res = await sb.auth.signUp({ email, password: pw, options: { emailRedirectTo: HERE } });
      else if (mode === 'forgot') res = await sb.auth.resetPasswordForEmail(email, { redirectTo: HERE });
      else res = await sb.auth.updateUser({ password: pw });
    } catch (err) {
      res = { error: { message: 'เชื่อมต่อไม่ได้ ตรวจสอบอินเทอร์เน็ตแล้วลองใหม่' } };
    }
    btn.disabled = false;
    if (res.error) return say(ERR[res.error.message] || res.error.message, 'err');

    if (mode === 'in') { try { localStorage.removeItem('ohh_guest'); } catch (e2) {} return go(); }
    if (mode === 'up') {
      if (res.data && res.data.session) return go();
      $('#pw').value = ''; $('#pw2').value = '';
      return say('ส่งลิงก์ยืนยันไปที่ ' + email + ' แล้ว กดยืนยันในอีเมล แล้วระบบจะพาเข้าแอปให้เอง', 'ok');
    }
    if (mode === 'forgot') return say('ถ้ามีบัญชีนี้อยู่ เราได้ส่งลิงก์ตั้งรหัสผ่านใหม่ไปที่ ' + email + ' แล้ว', 'ok');
    say('บันทึกรหัสผ่านใหม่แล้ว กำลังพาเข้าแอป...', 'ok');
    setTimeout(go, 900);
  }

  /* ---------- Events ---------- */
  document.querySelectorAll('#tabs button').forEach((b) => b.addEventListener('click', () => setMode(b.dataset.mode)));
  $('#forgot').addEventListener('click', () => setMode('forgot'));
  $('#back').addEventListener('click', () => setMode('in'));
  $('#f').addEventListener('submit', submit);
  $('#eye').addEventListener('click', () => {
    const vis = $('#pw').type === 'password';
    $('#pw').type = $('#pw2').type = vis ? 'text' : 'password';
    $('#eye').textContent = vis ? 'ซ่อน' : 'แสดง';
  });
  $('#guest').addEventListener('click', () => { try { localStorage.setItem('ohh_guest', '1'); } catch (e) {} go(); });

  if (sb) {
    sb.auth.onAuthStateChange((ev, session) => {
      if (ev === 'PASSWORD_RECOVERY') return setMode('reset');
      if (session && mode !== 'reset' && !recovering && (ev === 'SIGNED_IN' || ev === 'INITIAL_SESSION')) go();
    });
  }

  setMode(recovering ? 'reset' : 'in');
})();
