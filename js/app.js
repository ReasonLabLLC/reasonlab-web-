/* ==========================================================
   ReasonLab Main JavaScript
   Navigation, effects, analyzer, Formspree lead capture,
   booking autofill and Cal.com reveal
   ========================================================== */

const FORM_ENDPOINT = 'https://formspree.io/f/xpqggeyq';
const CAL_LINK = 'https://cal.com/reasonlab/strategy-call';

// ---------- Helpers ----------
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

function safeValue(id) {
  return document.getElementById(id)?.value?.trim() || '';
}

function setValueIfEmpty(id, value) {
  const el = document.getElementById(id);
  if (el && value && !el.value) el.value = value;
}

function storageGet(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function storageSet(key, value) {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function postToFormspree(payload) {
  return fetch(FORM_ENDPOINT, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
}

function leadSessionId() {
  let id = storageGet('reasonlab_lead_session_id');
  if (!id) {
    id = `reasonlab-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    storageSet('reasonlab_lead_session_id', id);
  }
  return id;
}

function bookingPath() {
  return 'book.html';
}

function normalizeWebsite(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if (/^https?:\/\//i.test(raw)) return raw;
  return `https://${raw}`;
}

function readAnalyzerData() {
  return {
    company: safeValue('bizname'),
    website: safeValue('bizsite'),
    industry: document.getElementById('industry')?.value || '',
    challenge: document.getElementById('challenge')?.value || ''
  };
}

function saveAnalyzerData() {
  const data = readAnalyzerData();
  storageSet('reasonlab_analyzer', JSON.stringify(data));
  return data;
}

// ---------- Year ----------
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---------- Mobile Navigation ----------
const navToggle = document.getElementById('navToggle');
const navlinks = document.getElementById('navlinks');

if (navToggle && navlinks) {
  navToggle.addEventListener('click', () => {
    const open = navlinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  navlinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navlinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ---------- Reveal on scroll ----------
const revealEls = $$('.reveal');
if ('IntersectionObserver' in window && revealEls.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => observer.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('in'));
}

// ---------- Background nodes canvas ----------
(function initNodeCanvas() {
  const canvas = document.getElementById('node-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  const isMobile = window.matchMedia('(max-width: 760px)').matches;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width = 0;
  let height = 0;
  let points = [];
  let animationId = null;
  let lastFrame = 0;
  const frameInterval = isMobile ? 1000 / 24 : 1000 / 40;

  function resize() {
    width = canvas.offsetWidth || window.innerWidth;
    height = canvas.offsetHeight || 720;
    const ratio = Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.5);

    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    const count = isMobile
      ? Math.max(16, Math.floor(width / 34))
      : Math.max(24, Math.floor(width / 50));

    points = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 2.6 + 1.8,
      c: ['#7029A1', '#D21767', '#FF690D', '#00B6DD'][
        Math.floor(Math.random() * 4)
      ]
    }));
  }

  function paint() {
    ctx.clearRect(0, 0, width, height);

    points.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.c;
      ctx.globalAlpha = 0.75;
      ctx.fill();

      for (let j = i + 1; j < points.length; j++) {
        const q = points[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const distanceSquared = dx * dx + dy * dy;
        const maxDistance = isMobile ? 130 : 155;

        if (distanceSquared < maxDistance * maxDistance) {
          const distance = Math.sqrt(distanceSquared);
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = 'rgba(245,245,247,.16)';
          ctx.globalAlpha = 1 - distance / maxDistance;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    });

    ctx.globalAlpha = 1;
  }

  function draw(timestamp) {
    if (!document.hidden && timestamp - lastFrame >= frameInterval) {
      lastFrame = timestamp;
      paint();
    }
    animationId = requestAnimationFrame(draw);
  }

  resize();
  paint();

  if (!reduceMotion) animationId = requestAnimationFrame(draw);

  let resizeTimer;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(resize, 160);
  }, { passive: true });

  window.addEventListener('beforeunload', () => {
    if (animationId) cancelAnimationFrame(animationId);
  });
})();

// ---------- Hero engine panel ----------
(function initEnginePanel() {
  const timeline = document.getElementById('epTimeline');
  if (!timeline) return;

  const steps = Array.from(timeline.querySelectorAll('.ep-step'));
  const chips = Array.from(document.querySelectorAll('.ep-manual-chip'));
  const animationTimers = [];

  function clearAnimationTimers() {
    animationTimers.splice(0).forEach(timer => window.clearTimeout(timer));
  }

  function schedule(callback, delay) {
    animationTimers.push(window.setTimeout(callback, delay));
  }

  function playTimeline() {
    steps.forEach(step => step.classList.remove('show'));
    timeline.classList.remove('timeline-ready');

    // Force the pseudo-element line and the steps to restart cleanly.
    void timeline.offsetHeight;
    timeline.classList.add('timeline-ready');

    steps.forEach((step, index) => {
      schedule(() => step.classList.add('show'), 260 + index * 360);
    });
  }

  function animateCount(element, target, mode, duration) {
    if (!element) return;

    let start = null;

    function step(timestamp) {
      if (!start) start = timestamp;

      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      if (mode === 'revenue') {
        element.textContent = `$${Math.floor(eased * target).toLocaleString()}`;
      } else if (mode === 'speed') {
        element.textContent = `${(eased * target).toFixed(1)}s`;
      } else {
        element.textContent = `${Math.floor(eased * target)}`;
      }

      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  function playManualTasks() {
    chips.forEach(chip => chip.classList.remove('show'));
    void timeline.offsetHeight;

    chips.forEach((chip, index) => {
      schedule(() => chip.classList.add('show'), 820 + index * 240);
    });
  }

  function runDashboard() {
    animateCount(document.getElementById('epLeads'), 12, 'int', 1400);
    animateCount(document.getElementById('epSpeed'), 2.4, 'speed', 1400);
    animateCount(document.getElementById('epRevenue'), 2400, 'revenue', 1600);
    animateCount(document.getElementById('epManualTasks'), 18, 'int', 1500);
    playManualTasks();
  }

  function runStopwatch() {
    const stopwatch = document.getElementById('epStopwatch');
    if (!stopwatch) return;

    let start = null;
    const duration = 900;

    function step(timestamp) {
      if (!start) start = timestamp;

      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      stopwatch.textContent = `${(eased * 2.4).toFixed(1)}s`;

      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  function playEngineAnimation() {
    clearAnimationTimers();
    playTimeline();
    runDashboard();
    runStopwatch();
  }

  let engineTimer = null;

  function scheduleEngineAnimation() {
    window.clearTimeout(engineTimer);
    if (document.hidden) return;
    engineTimer = window.setTimeout(() => {
      playEngineAnimation();
      scheduleEngineAnimation();
    }, 6000);
  }

  playEngineAnimation();
  scheduleEngineAnimation();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      window.clearTimeout(engineTimer);
      clearAnimationTimers();
    } else {
      playEngineAnimation();
      scheduleEngineAnimation();
    }
  });
})();

// ---------- FAQ ----------
$$('.faq-q').forEach(button => {
  button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    if (!item) return;
    item.classList.toggle('open');
  });
});

// ---------- Business Analyzer ----------
(function initAnalyzer() {
  const form = document.getElementById('analyzerForm');
  if (!form) return;

  const result = document.getElementById('analyzerResult');

  ['bizname', 'bizsite', 'industry', 'challenge'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;

    el.addEventListener('input', saveAnalyzerData);
    el.addEventListener('change', saveAnalyzerData);
  });

  form.addEventListener('submit', event => {
    event.preventDefault();

    const data = saveAnalyzerData();

    if (!result) return;

    result.classList.add('show');
    result.innerHTML = `
      <div class="terminal-head">
        <span></span><span></span><span></span>
        <strong>business-analyzer.exe</strong>
      </div>

      <div class="terminal-lines">
        <p>&gt; Connecting to ReasonLab scan engine...</p>
        <p>&gt; Reading business profile: ${data.company || 'Unknown business'}</p>
        <p>&gt; Checking website: ${data.website || 'No website provided'}</p>
        <p>&gt; Looking for missed lead opportunities...</p>
        <p>&gt; Building recommended system map...</p>
      </div>

      <div class="result-grid">
        <div><small>Lead Capture</small><strong>Needs Work</strong></div>
        <div><small>Automation Score</small><strong>71%</strong></div>
        <div><small>AI Agent Fit</small><strong>High</strong></div>
        <div><small>First Build</small><strong>CRM + AI</strong></div>
      </div>

      <div class="recommendation-card blue">
        <small>Recommended first system</small>
        <p>
          An AI lead capture and follow-up system that responds instantly,
          qualifies prospects and sends every opportunity into one simple pipeline.
        </p>
      </div>

      <a
        href="${bookingPath()}"
        data-book-link="true"
        class="btn btn-primary analyzer-booking-link"
      >
        Book a Strategy Call
      </a>
    `;
  });
})();

// ---------- Reliable Book CTA navigation ----------
document.addEventListener('click', event => {
  const link = event.target.closest(
    'a[data-book-link="true"], a[href="/book.html"], a[href="book.html"]'
  );

  if (!link) return;

  const onBookPage = document.body.classList.contains('book-page');
  if (onBookPage) return;

  event.preventDefault();

  if (document.getElementById('analyzerForm')) saveAnalyzerData();
  window.location.href = bookingPath();
});

// ---------- Autofill Booking from Analyzer ----------
(function autofillBookingFromAnalyzer() {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  const saved = storageGet('reasonlab_analyzer');
  if (!saved) return;

  let data;

  try {
    data = JSON.parse(saved);
  } catch {
    return;
  }

  setValueIfEmpty('company', data.company);
  setValueIfEmpty('website', data.website);
  setValueIfEmpty('industry', data.industry);
  setValueIfEmpty('challenge', data.challenge);
})();

// ---------- Booking Page: Formspree + Cal.com ----------
(function initBookingPage() {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  const statusBox = document.getElementById('bookingStatus');
  const calSection = document.getElementById('calSection');
  const calFrame = document.getElementById('calFrame');
  const sessionId = leadSessionId();
  const partialKey = `reasonlab_partial_lead_sent_${sessionId}`;

  let partialSent = storageGet(partialKey) === 'true';
  let partialTimer = null;

  function getBookingData() {
    return {
      name: safeValue('name'),
      email: safeValue('email'),
      phone: safeValue('phone'),
      company: safeValue('company'),
      website: safeValue('website'),
      industry: document.getElementById('industry')?.value || '',
      main_challenge: document.getElementById('challenge')?.value || '',
      notes: safeValue('notes'),
      lead_session_id: sessionId,
      captured_from: window.location.href,
      captured_at: new Date().toISOString()
    };
  }

  function updateCalFrame(data) {
    if (!calFrame) return;

    const notes = [
      data.phone ? `Phone: ${data.phone}` : '',
      data.company ? `Company: ${data.company}` : '',
      data.website ? `Website: ${normalizeWebsite(data.website)}` : '',
      data.industry ? `Industry: ${data.industry}` : '',
      data.main_challenge ? `Main challenge: ${data.main_challenge}` : '',
      data.notes ? `Notes: ${data.notes}` : ''
    ]
      .filter(Boolean)
      .join('\n');

    const params = new URLSearchParams({
      embed: 'true',
      name: data.name,
      email: data.email,
      notes
    });

    if (data.phone) params.set('phone', data.phone);
    if (data.company) params.set('company', data.company);
    if (data.website) params.set('website', normalizeWebsite(data.website));
    if (data.industry) params.set('industry', data.industry);
    if (data.main_challenge) params.set('challenge', data.main_challenge);

    calFrame.src = `${CAL_LINK}?${params.toString()}`;
  }

  async function sendPartialLead() {
    if (partialSent) return;

    const data = getBookingData();

    if (!data.name || !isValidEmail(data.email)) return;

    partialSent = true;
    storageSet(partialKey, 'true');

    try {
      await postToFormspree({
        _subject: 'ReasonLab partial lead',
        lead_status: 'partial_lead',
        ...data
      });
    } catch (error) {
      console.warn('Partial lead failed:', error);
    }
  }

  function schedulePartialLead() {
    window.clearTimeout(partialTimer);
    partialTimer = window.setTimeout(sendPartialLead, 700);
  }

  ['name', 'email', 'phone'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;

    el.addEventListener('input', schedulePartialLead);
    el.addEventListener('blur', sendPartialLead);
    el.addEventListener('change', sendPartialLead);
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();

    const data = getBookingData();

    if (!data.name || !isValidEmail(data.email)) {
      if (statusBox) {
        statusBox.classList.add('show', 'error');
        statusBox.textContent =
          'Please enter your name and a valid email before continuing.';
      }

      return;
    }

    if (statusBox) {
      statusBox.classList.remove('error');
      statusBox.classList.add('show');
      statusBox.textContent =
        'Saving your request and opening real calendar availability...';
    }

    try {
      await postToFormspree({
        _subject: 'ReasonLab booking lead',
        lead_status: 'booking_started',
        ...data
      });
    } catch (error) {
      console.warn('Full lead failed:', error);
    }

    updateCalFrame(data);

    if (calSection) {
      calSection.classList.add('show');

      window.setTimeout(() => {
        calSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 120);
    }

    if (statusBox) {
      statusBox.textContent =
        'Great — now select an available time below.';
    }
  });
})();
