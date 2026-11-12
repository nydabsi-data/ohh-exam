/* Ohh-Exam — login page.
   Sign up: email + username + password (Supabase sends a confirmation email).
   Sign in: username OR email + password. A username is turned into its email
   with the RPC public.email_for_username (see database/schema.sql). */
(function () {
  'use strict';

  const $ = (s) => document.querySelector(s);
  const APP = new URL('./', location.href).href;
  const HERE = location.origin + location.pathname;
  const USER_RE = /^[a-z0-9._-]{3,20}$/;
  const EMAIL_RE = /^\S+@\S+\.\S+$/;

  const CFG = window.PE_SUPABASE || {};
  const sb = CFG.url && CFG.key && window.supabase ? window.supabase.createClient(CFG.url, CFG.key) : null;

  const ERR = {
    'Invalid login credentials': 'ชื่อผู้ใช้/อีเมล หรือรหัสผ่านไม่ถูกต้อง',
    'User already registered': 'อีเมลนี้สมัครไว้แล้ว ลองเข้าสู่ระบบแทน',
    'Email not confirmed': 'ยังไม่ได้ยืนยันอีเมล กรุณากดลิงก์ในอีเมลที่เราส่งไปก่อน',
    'Password should be at least 6 characters.': 'รหัสผ่านต้องมีอย่างน้อย 6 ตัว',
    'Email rate limit exceeded': 'ส่งอีเมลบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่'
  };
  let mode = 'in';

  function say(text, kind) { const m = $('#msg'); m.textContent = text || ''; m.className = 'form-msg' + (kind ? ' ' + kind : ''); }
  const go = () => location.replace(APP);

  function setMode(m) {
    mode = m;
    const up = m === 'up';
    document.querySelectorAll('#tabs button').forEach((b) => b.classList.toggle('on', b.dataset.mode === m));
    $('#email-wrap').classList.toggle('hidden', !up);
    $('#pw2-wrap').classList.toggle('hidden', !up);
    $('#user-hint').classList.toggle('hidden', !up);
    $('#user-label').textContent = up ? 'ตั้งชื่อผู้ใช้ (Username)' : 'ชื่อผู้ใช้หรืออีเมล';
    $('#user').placeholder = up ? 'เช่น captain01' : 'ชื่อผู้ใช้ หรือ you@example.com';
    $('#pw').autocomplete = up ? 'new-password' : 'current-password';
    $('#pw').placeholder = up ? 'อย่างน้อย 6 ตัว' : 'รหัสผ่านของคุณ';
    $('#submit').textContent = up ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ';
    say('');
    (up ? $('#email') : $('#user')).focus();
  }

  async function signIn() {
    const id = $('#user').value.trim(), pw = $('#pw').value;
    if (!id) return say('กรุณากรอกชื่อผู้ใช้หรืออีเมล', 'err');
    if (pw.length < 6) return say('รหัสผ่านต้องมีอย่างน้อย 6 ตัว', 'err');
    let email = id;
    if (!id.includes('@')) {
      const { data, error } = await sb.rpc('email_for_username', { p_username: id.toLowerCase() });
      if (error) return say('เชื่อมต่อไม่ได้ ลองใหม่อีกครั้ง', 'err');
      if (!data) return say('ไม่พบชื่อผู้ใช้นี้', 'err');
      email = data;
    }
    const { error } = await sb.auth.signInWithPassword({ email, password: pw });
    if (error) return say(ERR[error.message] || error.message, 'err');
    try { localStorage.removeItem('ohh_guest'); } catch (e) { /* ignore */ }
    go();
  }

  async function signUp() {
    const email = $('#email').value.trim(), username = $('#user').value.trim().toLowerCase(), pw = $('#pw').value, pw2 = $('#pw2').value;
    if (!EMAIL_RE.test(email)) return say('กรุณากรอกอีเมลให้ถูกต้อง', 'err');
    if (!USER_RE.test(username)) return say('ชื่อผู้ใช้ใช้ได้เฉพาะ a–z 0–9 . _ - ยาว 3–20 ตัว', 'err');
    if (pw.length < 6) return say('รหัสผ่านต้องมีอย่างน้อย 6 ตัว', 'err');
    if (pw !== pw2) return say('รหัสผ่านทั้งสองช่องไม่ตรงกัน', 'err');
    const avail = await sb.rpc('username_available', { p_username: username });
    if (avail.error) return say('เชื่อมต่อไม่ได้ ลองใหม่อีกครั้ง', 'err');
    if (!avail.data) return say('ชื่อผู้ใช้นี้มีคนใช้แล้ว ลองชื่ออื่น', 'err');
    const { data, error } = await sb.auth.signUp({ email, password: pw, options: { data: { username }, emailRedirectTo: HERE } });
    if (error) return say(ERR[error.message] || error.message, 'err');
    if (data && data.session) { try { localStorage.removeItem('ohh_guest'); } catch (e) { /* ignore */ } return go(); }
    $('#pw').value = ''; $('#pw2').value = '';
    say('สมัครเรียบร้อย ส่งลิงก์ยืนยันไปที่ ' + email + ' แล้ว กดลิงก์ในอีเมลเพื่อเปิดใช้บัญชี แล้วระบบจะพาเข้าแอปให้เอง', 'ok');
  }

  async function submit(e) {
    e.preventDefault();
    if (!sb) return say('ระบบบัญชียังไม่เปิดใช้งาน (กำลังเชื่อมต่อฐานข้อมูล) ระหว่างนี้กด "ลองใช้งานโดยไม่ต้องสมัคร" ได้เลย', 'err');
    const btn = $('#submit'); btn.disabled = true; say('กำลังดำเนินการ...');
    try { await (mode === 'in' ? signIn() : signUp()); }
    catch (err) { say('เชื่อมต่อไม่ได้ ตรวจสอบอินเทอร์เน็ตแล้วลองใหม่', 'err'); }
    btn.disabled = false;
  }

  document.querySelectorAll('#tabs button').forEach((b) => b.addEventListener('click', () => setMode(b.dataset.mode)));
  $('#f').addEventListener('submit', submit);
  $('#eye').addEventListener('click', () => {
    const vis = $('#pw').type === 'password';
    $('#pw').type = $('#pw2').type = vis ? 'text' : 'password';
    $('#eye').textContent = vis ? 'ซ่อน' : 'แสดง';
  });
  $('#guest').addEventListener('click', () => { try { localStorage.setItem('ohh_guest', '1'); } catch (e) { /* ignore */ } go(); });

  // Coming back from the confirmation email → signed in → into the app
  if (sb) {
    sb.auth.onAuthStateChange((ev, session) => {
      if (session && (ev === 'SIGNED_IN' || ev === 'INITIAL_SESSION')) {
        try { localStorage.removeItem('ohh_guest'); } catch (e) { /* ignore */ }
        go();
      }
    });
  }

  setMode('in');
})();
