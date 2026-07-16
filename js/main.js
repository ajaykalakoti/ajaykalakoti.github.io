/* ============================================================
   Ajay Kalakota — Portfolio
   Theme · Nav · Reveal · Counters · Skills filter · Form
   ============================================================ */

(function () {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Theme ---------- */
  const THEME_KEY = 'ajay-portfolio-theme';
  const html = document.documentElement;

  function readStoredTheme() {
    try { return localStorage.getItem(THEME_KEY); } catch { return null; }
  }
  function storeTheme(theme) {
    try { localStorage.setItem(THEME_KEY, theme); } catch { /* private mode */ }
  }
  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    storeTheme(theme);
  }

  const stored = readStoredTheme();
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(stored || (systemDark ? 'dark' : 'light'));

  $('#themeToggle')?.addEventListener('click', () => {
    applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });

  // Follow the OS only while the user hasn't picked a theme themselves.
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!readStoredTheme()) applyTheme(e.matches ? 'dark' : 'light');
  });

  /* ---------- Mobile nav ---------- */
  const burger   = $('#burger');
  const navLinks = $('#navLinks');

  function closeMenu() {
    navLinks?.classList.remove('is-open');
    burger?.classList.remove('is-open');
    burger?.setAttribute('aria-expanded', 'false');
  }

  burger?.addEventListener('click', () => {
    const open = navLinks.classList.toggle('is-open');
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
  });

  $$('.nav__link').forEach((link) => link.addEventListener('click', closeMenu));

  document.addEventListener('click', (e) => {
    if (!navLinks?.classList.contains('is-open')) return;
    if (!navLinks.contains(e.target) && !burger.contains(e.target)) closeMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  /* ---------- Scroll: navbar state, progress bar, back-to-top ---------- */
  const nav      = $('#nav');
  const progress = $('#navProgress');
  const toTop    = $('#toTop');

  function onScroll() {
    const y = window.scrollY;

    nav?.classList.toggle('is-scrolled', y > 10);
    toTop?.classList.toggle('is-visible', y > 500);

    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) {
      const pct = scrollable > 0 ? Math.min(Math.max(y / scrollable, 0), 1) * 100 : 0;
      // The ring is a normalised path (pathLength=100): 100 hides it, 0 completes it.
      progress.style.strokeDashoffset = String(100 - pct);
    }
  }

  // rAF-throttled so scrolling stays smooth on low-end devices.
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { onScroll(); ticking = false; });
  }, { passive: true });
  onScroll();

  toTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });

  /* ---------- Active section highlighting ---------- */
  const sections = $$('section[id]');
  const linkMap = new Map(
    $$('.nav__link').map((link) => [link.getAttribute('href').slice(1), link])
  );

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      linkMap.forEach((link) => link.classList.remove('is-active'));
      linkMap.get(entry.target.id)?.classList.add('is-active');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach((section) => sectionObserver.observe(section));

  /* ---------- Scroll reveal ---------- */
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      // Stagger siblings that enter together for a cascading effect.
      entry.target.style.transitionDelay = Math.min(i * 70, 350) + 'ms';
      entry.target.classList.add('is-visible');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  $$('.reveal').forEach((el) => revealObserver.observe(el));

  /* ---------- Typing effect ---------- */
  const typedEl = $('#typed');
  const PHRASES = [
    'Full Stack Developer',
    'Node.js & Express Engineer',
    'Angular · React · Next.js',
    'REST API & Webhook Builder',
    'CPaaS Platform Developer'
  ];

  if (typedEl) {
    if (prefersReducedMotion) {
      typedEl.textContent = PHRASES[0];
    } else {
      let phraseIdx = 0;
      let charIdx = 0;
      let deleting = false;

      (function type() {
        const phrase = PHRASES[phraseIdx];
        charIdx += deleting ? -1 : 1;
        typedEl.textContent = phrase.slice(0, charIdx);

        let delay = deleting ? 45 : 85;

        if (!deleting && charIdx === phrase.length) {
          delay = 1800;           // hold the finished phrase
          deleting = true;
        } else if (deleting && charIdx === 0) {
          deleting = false;
          phraseIdx = (phraseIdx + 1) % PHRASES.length;
          delay = 400;
        }

        setTimeout(type, delay);
      })();
    }
  }

  /* ---------- Animated counters ---------- */
  function animateCount(el) {
    const target   = parseFloat(el.dataset.target);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const duration = 1600;
    const start    = performance.now();

    function frame(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = (target * eased).toFixed(decimals);
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = target.toFixed(decimals);
    }
    requestAnimationFrame(frame);
  }

  const statsEl = $('#stats');
  if (statsEl) {
    const statsObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        $$('.count', entry.target).forEach((el) => {
          if (prefersReducedMotion) {
            el.textContent = parseFloat(el.dataset.target).toFixed(parseInt(el.dataset.decimals || '0', 10));
          } else {
            animateCount(el);
          }
        });
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.4 });
    statsObserver.observe(statsEl);
  }

  /* ---------- Proficiency bars ---------- */
  const profGrid = $('#profGrid');
  if (profGrid) {
    const barObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        $$('.bar__fill', entry.target).forEach((bar, i) => {
          setTimeout(() => { bar.style.width = bar.dataset.width + '%'; }, prefersReducedMotion ? 0 : i * 90);
        });
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.25 });
    barObserver.observe(profGrid);
  }

  /* ---------- Skills filter ---------- */
  const tabs  = $$('.skill-tab');
  const cards = $$('.skill-card');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');

      const filter = tab.dataset.filter;
      cards.forEach((card) => {
        const match = filter === 'all' || (card.dataset.cat || '').split(' ').includes(filter);
        card.classList.toggle('is-hidden', !match);
      });
    });
  });

  /* ---------- Contact form ---------- */
  const form = $('#contactForm');

  function showToast(message, type = 'success') {
    $('.toast')?.remove();

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.setAttribute('role', 'status');
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('is-visible'));
    setTimeout(() => {
      toast.classList.remove('is-visible');
      setTimeout(() => toast.remove(), 400);
    }, 5000);
  }

  function setError(field, message) {
    const wrap = field.closest('.field');
    wrap.classList.toggle('has-error', Boolean(message));
    $(`[data-error-for="${field.name}"]`).textContent = message || '';
  }

  function validate(field) {
    const value = field.value.trim();
    if (!value) {
      setError(field, `${field.previousElementSibling.textContent} is required`);
      return false;
    }
    if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      setError(field, 'Enter a valid email address');
      return false;
    }
    if (field.name === 'message' && value.length < 10) {
      setError(field, 'Message should be at least 10 characters');
      return false;
    }
    setError(field, '');
    return true;
  }

  if (form) {
    // Scoped to .field wrappers so the hidden honeypot is never validated.
    const fields = $$('.field input, .field textarea', form);

    fields.forEach((field) => {
      field.addEventListener('blur', () => validate(field));
      field.addEventListener('input', () => {
        if (field.closest('.field').classList.contains('has-error')) validate(field);
      });
    });

    const submitBtn = $('#submitBtn');
    const PRIMARY_EMAIL = 'ajaykalakoti34@gmail.com';
    const ALT_EMAIL     = 'ajaykalakota11042002@gmail.com';

    // Last resort if the network or the form service is unreachable: hand the
    // message to the visitor's mail client so it isn't silently lost.
    function mailtoFallback({ name, email, subject, message }) {
      const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
      window.location.href =
        `mailto:${PRIMARY_EMAIL}?cc=${ALT_EMAIL}` +
        `&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Validate every field so the user sees all problems at once, not one at a time.
      const ok = fields.map(validate).every(Boolean);
      if (!ok) {
        $('.field.has-error input, .field.has-error textarea', form)?.focus();
        return;
      }

      const data = Object.fromEntries(new FormData(form));
      submitBtn.classList.add('is-loading');
      submitBtn.disabled = true;

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            subject: data.subject,
            message: data.message,
            _honey: data._honey,
            _cc: ALT_EMAIL,
            _subject: `Portfolio enquiry: ${data.subject}`,
            _template: 'table',
            _captcha: 'false'
          })
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        // FormSubmit answers 200 even when it refuses to deliver (e.g. the form is
        // not activated yet), so the body — not the status — is the source of truth.
        const result = await res.json().catch(() => ({}));
        if (String(result.success) !== 'true') {
          throw new Error(result.message || 'Form service rejected the submission');
        }

        showToast('Message sent — thanks! I\'ll get back to you soon.');
        form.reset();
      } catch (err) {
        console.error('Contact form:', err);
        showToast('Could not send directly — opening your email app instead.', 'error');
        mailtoFallback(data);
      } finally {
        submitBtn.classList.remove('is-loading');
        submitBtn.disabled = false;
      }
    });
  }

  /* ---------- Experience, computed from the start date ----------
     Single source of truth. Change START_YEAR / START_MONTH if the date is wrong
     and every figure on the page follows — no hardcoded number to go stale. */
  const START_YEAR  = 2024;
  const START_MONTH = 12;   // December 2024 — first month at GreenAds Global.

  function monthsOfExperience() {
    const now = new Date();
    return (now.getFullYear() - START_YEAR) * 12 + (now.getMonth() + 1 - START_MONTH);
  }

  function formatYearsMonths(totalMonths) {
    const y = Math.floor(totalMonths / 12);
    const m = totalMonths % 12;
    if (!y) return `${m} mo`;
    return m ? `${y} yr ${m} mo` : `${y} yr`;
  }

  const months = monthsOfExperience();

  // "1 yr 7 mo" — unambiguous in any locale, unlike "1.7".
  $$('[data-exp="duration"]').forEach((el) => { el.textContent = formatYearsMonths(months); });

  // Decimal years, floored to 1 dp, for prose: 19 months -> "1.5+".
  const decimalYears = (Math.floor((months / 12) * 10) / 10).toFixed(1);
  $$('[data-exp="years"]').forEach((el) => { el.textContent = decimalYears; });

  // Feed the animated stat counter the same computed value.
  const expStat = $('[data-exp="stat"]');
  if (expStat) expStat.dataset.target = decimalYears;

  /* ---------- Footer year ---------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
