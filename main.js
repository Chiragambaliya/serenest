(function () {
  'use strict';

  // Header scroll state
  const header = document.querySelector('.header');
  if (header) {
    const onScroll = function () {
      header.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Signup form (prevent default, show feedback)
  document.querySelectorAll('.signup-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      if (!btn) return;

      if (form.classList.contains('professionals-form')) {
        var inputs = form.querySelectorAll('input');
        var nameInput = form.querySelector('input[name="name"]');
        var email = form.querySelector('input[name="email"]');
        var mobile = form.querySelector('input[name="mobile"]');
        var roleInput = form.querySelector('input[name="role"]');
        if (!email || !email.value.trim() || !mobile || !mobile.value.trim()) return;
        var nameVal = nameInput ? nameInput.value.trim() : '';
        var emailVal = email.value.trim();
        var mobileVal = mobile.value.trim();
        var roleVal = roleInput ? roleInput.value.trim() : null;

        // FIX Bug 1: use function expression (var done = function) instead of
        // function declaration inside a block — illegal in strict mode
        var done = function () {
          btn.textContent = "Thank you — we'll be in touch";
          btn.disabled = true;
          inputs.forEach(function (input) { input.value = ''; });
        };

        if (window.__supabase) {
          window.__supabase.from('professionals').insert({
            name: nameVal, email: emailVal, mobile: mobileVal, role: roleVal || null
          }).then(done).catch(done);
        } else { done(); }

      } else if (form.classList.contains('signup-email-mobile')) {
        var emailInput = form.querySelector('input[name="email"]');
        var mobileInput = form.querySelector('input[name="mobile"]');
        if (!emailInput || !emailInput.value.trim() || !mobileInput || !mobileInput.value.trim()) return;
        var emailVal2 = emailInput.value.trim();
        var mobileVal2 = mobileInput.value.trim();

        // FIX Bug 1 (continued): function expression, not declaration
        var done = function () {
          btn.textContent = 'Thank you';
          btn.disabled = true;
          emailInput.value = '';
          mobileInput.value = '';
        };

        if (window.__supabase) {
          window.__supabase.from('signups').insert({
            email: emailVal2, mobile: mobileVal2
          }).then(done).catch(done);
        } else { done(); }
      }
    });
  });

  // Screening questionnaire (multi-step)
  const screeningForm = document.getElementById('screening-form');
  if (screeningForm) {
    const steps = screeningForm.querySelectorAll('.screening-step:not(.screening-step-result)');
    const resultStep = screeningForm.querySelector('.screening-step-result');
    const prevBtn = document.getElementById('screening-prev');
    const nextBtn = document.getElementById('screening-next');
    const submitBtn = document.getElementById('screening-submit');
    const progressBar = document.getElementById('screening-progress');
    const actionsEl = screeningForm.querySelector('.screening-actions');
    const totalSteps = steps.length + 1; // steps + result
    let currentStep = 1;

    // FIX Bug 2: consolidated actionsEl display logic — single clear write per call
    function updateStep(step) {
      currentStep = step;
      steps.forEach(function (el, i) {
        el.classList.toggle('screening-step-active', i + 1 === step);
      });
      if (resultStep) {
        resultStep.classList.toggle('screening-step-active', step === totalSteps);
      }

      var isResult = step === totalSteps;

      if (prevBtn) {
        prevBtn.disabled = step <= 1;
        prevBtn.style.display = isResult ? 'none' : '';
      }
      if (nextBtn) nextBtn.style.display = (!isResult && step < totalSteps - 1) ? '' : 'none';
      if (submitBtn) submitBtn.style.display = (!isResult && step === totalSteps - 1) ? '' : 'none';

      // Single authoritative write — no double-set
      if (actionsEl) actionsEl.style.display = isResult ? 'none' : 'flex';

      if (progressBar) {
        progressBar.style.width = (step / totalSteps) * 100 + '%';
      }
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        var stepEl = steps[currentStep - 1];
        var checkboxes = stepEl && stepEl.querySelectorAll('input[type="checkbox"][name="conditions"]');
        var radios = stepEl && stepEl.querySelectorAll('input[type="radio"]');
        if (stepEl) {
          if (checkboxes && checkboxes.length > 0) {
            var anyChecked = Array.prototype.some.call(checkboxes, function (c) { return c.checked; });
            if (!anyChecked) return;
          } else if (radios && radios.length > 0) {
            var radioChecked = stepEl.querySelector('input[type="radio"]:checked');
            if (!radioChecked) return;
          }
        }
        if (currentStep < totalSteps - 1) {
          updateStep(currentStep + 1);
        }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        if (currentStep > 1) {
          updateStep(currentStep - 1);
        }
      });
    }

    screeningForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var reasonEl = screeningForm.querySelector('input[name="reason"]:checked');
      var formatEl = screeningForm.querySelector('input[name="format"]:checked');
      var frequencyEl = screeningForm.querySelector('input[name="frequency"]:checked');
      var conditionEls = screeningForm.querySelectorAll('input[name="conditions"]:checked');
      var reason = reasonEl ? reasonEl.value : null;
      var format = formatEl ? formatEl.value : null;
      var frequency = frequencyEl ? frequencyEl.value : null;
      var conditions = [];
      conditionEls.forEach(function (el) { conditions.push(el.value); });
      if (window.__supabase) {
        window.__supabase.from('screening_responses').insert({
          reason: reason,
          conditions: conditions.length ? conditions : null,
          format: format,
          frequency: frequency
        }).catch(function () {});
      }
      updateStep(totalSteps);
    });

    updateStep(1);
  }
})();
