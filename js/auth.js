/**
 * js/auth.js — Serenest Supabase Auth
 * Handles email+password signup/login/logout for both patients and professionals.
 * Requires js/config.js (sets window.SERENEST_SUPABASE_URL + window.SERENEST_SUPABASE_ANON_KEY)
 * and js/supabase-loader.js (sets window.__supabase) to be loaded first.
 */

(function () {
  'use strict';

  /* ── helpers ─────────────────────────────────────── */
  function getClient() {
    return window.__supabase || null;
  }

  function showMsg(elId, msg, isError) {
    var el = document.getElementById(elId);
    if (!el) return;
    el.textContent = msg;
    el.style.color = isError ? '#c0392b' : '#27ae60';
  }

  /* ── patient signup (index.html #signup) ─────────── */
  window.serenestPatientSignUp = function (e) {
    e.preventDefault();
    var sb = getClient();
    var emailEl = document.getElementById('patient-auth-email');
    var passEl  = document.getElementById('patient-auth-password');
    var nameEl  = document.getElementById('patient-auth-name');
    if (!emailEl || !passEl) return;
    var email    = emailEl.value.trim();
    var password = passEl.value;
    var name     = nameEl ? nameEl.value.trim() : '';
    if (!email || !password) { showMsg('patient-auth-msg', 'Please fill in all fields.', true); return; }
    if (!sb) { showMsg('patient-auth-msg', 'Backend not configured.', true); return; }
    sb.auth.signUp({
      email: email,
      password: password,
      options: { data: { full_name: name, role: 'patient' } }
    }).then(function (res) {
      if (res.error) { showMsg('patient-auth-msg', res.error.message, true); return; }
      showMsg('patient-auth-msg', 'Account created! Check your email to confirm.');
      emailEl.value = ''; passEl.value = ''; if (nameEl) nameEl.value = '';
    });
  };

  /* ── patient login ───────────────────────────────── */
  window.serenestPatientLogin = function (e) {
    e.preventDefault();
    var sb = getClient();
    var emailEl = document.getElementById('patient-login-email');
    var passEl  = document.getElementById('patient-login-password');
    if (!emailEl || !passEl) return;
    var email    = emailEl.value.trim();
    var password = passEl.value;
    if (!email || !password) { showMsg('patient-login-msg', 'Please fill in all fields.', true); return; }
    if (!sb) { showMsg('patient-login-msg', 'Backend not configured.', true); return; }
    sb.auth.signInWithPassword({ email: email, password: password }).then(function (res) {
      if (res.error) { showMsg('patient-login-msg', res.error.message, true); return; }
      showMsg('patient-login-msg', 'Welcome back!');
      setTimeout(function () { window.location.href = 'profile.html'; }, 800);
    });
  };

  /* ── professional signup (for-professionals.html) ── */
  window.serenestProSignUp = function (e) {
    e.preventDefault();
    var sb = getClient();
    var emailEl = document.getElementById('pro-auth-email');
    var passEl  = document.getElementById('pro-auth-password');
    var nameEl  = document.getElementById('pro-auth-name');
    var roleEl  = document.getElementById('pro-auth-role');
    if (!emailEl || !passEl) return;
    var email    = emailEl.value.trim();
    var password = passEl.value;
    var name     = nameEl ? nameEl.value.trim() : '';
    var role     = roleEl ? roleEl.value.trim() : '';
    if (!email || !password) { showMsg('pro-auth-msg', 'Email and password are required.', true); return; }
    if (!sb) { showMsg('pro-auth-msg', 'Backend not configured.', true); return; }
    sb.auth.signUp({
      email: email,
      password: password,
      options: { data: { full_name: name, role: 'professional', pro_role: role } }
    }).then(function (res) {
      if (res.error) { showMsg('pro-auth-msg', res.error.message, true); return; }
      // also write to professionals table
      if (name || role) {
        sb.from('professionals').insert({
          name: name || null,
          email: email,
          mobile: '',
          role: role || null
        }).catch(function () {});
      }
      showMsg('pro-auth-msg', 'Account created! Check your email to confirm, then log in.');
      emailEl.value = ''; passEl.value = '';
      if (nameEl) nameEl.value = ''; if (roleEl) roleEl.value = '';
    });
  };

  /* ── professional login ─────────────────────────── */
  window.serenestProLogin = function (e) {
    e.preventDefault();
    var sb = getClient();
    var emailEl = document.getElementById('pro-login-email');
    var passEl  = document.getElementById('pro-login-password');
    if (!emailEl || !passEl) return;
    var email    = emailEl.value.trim();
    var password = passEl.value;
    if (!email || !password) { showMsg('pro-login-msg', 'Please fill in all fields.', true); return; }
    if (!sb) { showMsg('pro-login-msg', 'Backend not configured.', true); return; }
    sb.auth.signInWithPassword({ email: email, password: password }).then(function (res) {
      if (res.error) { showMsg('pro-login-msg', res.error.message, true); return; }
      showMsg('pro-login-msg', 'Logged in!');
      setTimeout(function () { window.location.href = 'professionals-dashboard.html'; }, 800);
    });
  };

  /* ── logout (used on dashboard & profile) ───────── */
  window.serenestLogout = function () {
    var sb = getClient();
    if (!sb) { window.location.href = 'index.html'; return; }
    sb.auth.signOut().then(function () {
      window.location.href = 'index.html';
    });
  };

  /* ── session guard — call on protected pages ─────── */
  window.serenestRequireAuth = function (redirectTo) {
    var sb = getClient();
    if (!sb) { window.location.href = redirectTo || 'index.html'; return; }
    sb.auth.getSession().then(function (res) {
      if (!res.data || !res.data.session) {
        window.location.href = redirectTo || 'index.html';
      } else {
        // expose user data globally
        window.serenestUser = res.data.session.user;
        document.dispatchEvent(new CustomEvent('serenest:authed', { detail: res.data.session.user }));
      }
    });
  };

  /* ── update nav on every page ────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    var sb = getClient();
    if (!sb) return;
    sb.auth.getSession().then(function (res) {
      var session = res.data && res.data.session;
      var signupLinks = document.querySelectorAll('a[href="#signup"], a[href="index.html#signup"]');
      var proLinks    = document.querySelectorAll('a[href="for-professionals.html"]');
      if (session) {
        // replace "Sign up" with "My account" link
        signupLinks.forEach(function (a) {
          a.textContent = 'My account';
          a.href = 'profile.html';
        });
        // if user is professional, point to dashboard
        var role = session.user.user_metadata && session.user.user_metadata.role;
        if (role === 'professional') {
          proLinks.forEach(function (a) {
            a.textContent = 'My dashboard';
            a.href = 'professionals-dashboard.html';
          });
        }
      }
    });
  });

})();
